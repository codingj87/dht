# -*- coding: utf-8 -*-
import time
from io import StringIO

from django.shortcuts import redirect, render
from django.http import HttpResponseNotFound
from django.http import HttpResponse
from django.utils.decorators import method_decorator

from dht.settings import USE_DMS, USE_DHCP, USE_RADIUS
from lib import dynamicWorkLog
from ..config import SYSTEM_MAP, show_DB_Replication
from ..deco import no_login_json_encode, json_encode, login_required
from ..view import View
# from ..models import User, Setting, Cluster
from ..models import User, Setting
from ..util import get_rpc_list, get_cluster_ip


class BaseView(View):
    @classmethod
    def index(cls, request, context=None):
        if context is None:
            context = SYSTEM_MAP
        context["salt"] = request.session.session_key

        # d = dict(
        #     Setting.objects.filter(key__startswith="passwd_").values_list(
        #         "key", "value"
        #     )
        # )
        # SYSTEM_MAP["passwd_alpha"] = d.get("passwd_alpha")
        # SYSTEM_MAP["passwd_number"] = d.get("passwd_number")
        # SYSTEM_MAP["passwd_special"] = d.get("passwd_special")
        # SYSTEM_MAP["passwd_length"] = d.get("passwd_length")

        # temp
        SYSTEM_MAP["passwd_alpha"] = ''
        SYSTEM_MAP["passwd_number"] = ''
        SYSTEM_MAP["passwd_special"] = ''
        SYSTEM_MAP["passwd_length"] = 7

        if request.META.get("QUERY_STRING"):
            return HttpResponseNotFound("<h1>Page not found</h1>")
        else:
            return render(request, "index.html", context, SYSTEM_MAP)

    @no_login_json_encode
    def login(self, request):

        userid = request.POST.get("userid")
        passwd = request.POST.get("passwd")

        WorkLog = dynamicWorkLog.getLogModel(time.strftime("%Y%m%d"))
        now = int(time.time())
        log = WorkLog(**{"action": "login", "userid": userid, "ctime": now})

        settings_data = dict(
            Setting.objects.filter(key__startswith="auth_").values_list(
                "key", "value"
            )
        )
        LIMIT = int(settings_data.get("auth_fail_count") or 3)  # 로그인 재시도 회
        BLOCK_MODE = settings_data.get(
            "auth_fail_action", "disable"
        )  # 계정차단 or  일시차단
        BLOCK_TIME = int(
            settings_data.get("auth_block_time") or 5
        )  # 일이차단시 차단 시간(단위: 분)

        try:
            user = User.objects.only("passwd", "enable").get(userid=userid)
        except Exception as e:
            return {
                "success": False,
                "msg": "아이디를 다시 확인하세요.",
                "errmsg": str(e),
            }

        if user.login_fail_time and user.enable:  # 로그인 가능시간 AND 활성화 계정 확인
            if BLOCK_MODE == "delay":
                if (now - user.login_fail_time) > int(BLOCK_TIME) * 60:
                    user.login_fail_cnt = 0
                    user.enable = 1
                    user.login_fail_time = None
                else:
                    log.response = "fail"
                    log.desc = "일시적으로 계정이 차단하였습니다."
                    log.save()
                    return {"success": False, "msg": log.desc}

        if (
            user.enable == 0
        ):  # and user.approval_state == 1:  # 승인은 됐지만, 패스워드 실패 등으로 일시적 중지된 경우
            log.response = "fail"
            log.desc = "계정이 차단 되었습니다."
            log.save()
            return {"success": False, "msg": log.desc}

        if not passwd or (passwd != user.passwd):
            user.login_fail_cnt += 1
            log.response = "fail"
            if user.login_fail_cnt >= LIMIT:
                if BLOCK_MODE == "disable":
                    user.desc = (
                        "(%d회 접속실패) 계정이 무기한 차단 되었습니다." % user.login_fail_cnt
                    )
                    user.enable = 0
                else:
                    log.desc = "(%d회 접속실패) %s분 동안 계정이 차단 되었습니다." % (
                        LIMIT,
                        BLOCK_TIME,
                    )
                user.login_fail_cnt = 0
                user.login_fail_time = now
            else:
                log.response = "fail"
                log.desc = "패스워드 입력 실패를 하였습니다.(다음 %s회 실패시 계정 차단 됩니다.)" % (
                    LIMIT - user.login_fail_cnt
                )

            user.save()
            log.save()
            return {"success": False, "msg": log.desc}

        return self._permit_login(request, userid)

    def _permit_login(self, request, userid):
        user = User.objects.get(userid=userid)
        userip = request.META.get("REMOTE_ADDR")

        request.session["userid"] = userid
        request.session["username"] = user.name
        request.session["userip"] = userip

        if user.userid == "masteradmin":
            rs = User.objects.filter(enable=0).order_by("-ctime")
            now = int(time.time())
            for r in rs:
                if now - r.ctime < 86400:
                    return {"success": True, "url": "/dht/#setting"}
            else:
                # return {"success": True, "url": "/dht/#ipassignedstatus"}
                return {"success": True, "url": "/dht/#setting"}
        else:
            # return {"success": True, "url": "/dht/#ipassignedstatus"}
            return {"success": True, "url": "/dht/#setting"}

    @classmethod
    def logout(cls, request):
        request.session.flush()
        return redirect("/")

    @classmethod
    def url_not_matched(cls, request):
        url = request.META.get("REQUEST_URI", "").strip()
        if not url.endswith("/"):
            return redirect(url + "/")
        else:
            return redirect("/")

    @method_decorator(login_required)
    def settingjs(self, request):
        userid = request.session.get("userid")
        cluster_id = request.session.get("cluster_id")
        expose_settings = {
            "passwd_alpha": (str, "off"),
            "passwd_number": (str, "off"),
            "passwd_special": (str, "off"),
            "passwd_length": (int, 6),
            "session_idle_time": (int, 3600),
            "session_idle_time_check": (int, 1),
        }

        setting_map = dict(Setting.objects.values_list("key", "value"))
        buf = StringIO()
        for key, (type, default) in expose_settings.items():
            value = setting_map.get(key)
            val = ""
            if value:
                val = value.replace("\\", "\\\\")  # for client path

            if type == int:
                buf.write("var %s = %s;\r\n" % (key.upper(), val or default))
            else:
                buf.write("var %s = '%s';\r\n" % (key.upper(), val or default))
        buf.write(
            "var CLIENT_IP = '%s';\r\n" % request.META.get("REMOTE_ADDR")
        )
        buf.write("var SERVER_TIMESTAMP = %d;\r\n" % time.time())

        # if cluster_id:
        #     query = Cluster.objects.get(pk=cluster_id)
        #     name = query.name
        # else:
        #     try:
        #         # name = Cluster.objects.all().first().name
        #     except Cluster.DoesNotExist:
        #         name = ""
        # for rpc in get_rpc_list(get_cluster_ip(cluster_id)):
        #     try:
        #         license_count, current_ip_count = rpc.getLicense()
        #     except Exception:
        #         pass
        #     else:
        #         break
        # else:
        #     license_count, current_ip_count = "구동 중인 DHCP 서버가 없습니다.", 0
        if userid:
            user = User.objects.get(userid=userid)
            buf.write("var LEVEL = '%s';\r\n" % user.level)
            buf.write("var USERID = '%s';\r\n" % user.userid)
            buf.write("var USERNAME = '%s';\r\n" % user.name)
            buf.write("var NOTICE = {time: 0, desc: ''};\r\n")
            # buf.write("var IPCOUNT = '%s';\r\n" % current_ip_count)
            # buf.write("var CLUSTER_NAME = '%s';\r\n" % name)
            # buf.write("var LICENSE = '%s';\r\n" % license_count)
            buf.write("var DB_Replication = '%s';\r\n" % show_DB_Replication)
            buf.write("var DMS = '%s';\r\n" % USE_DMS)
            buf.write("var DHCP = '%s';\r\n" % USE_DHCP)
            buf.write("var RADIUS = '%s';\r\n" % USE_RADIUS)

        return HttpResponse(
            buf.getvalue(), content_type="application/x-javascript"
        )

    @method_decorator(json_encode)
    def get_license(self, request):
        cluster_id = request.session.get("cluster_id")
        for rpc in get_rpc_list(get_cluster_ip(cluster_id)):
            try:
                license_count, current_ip_count = rpc.getLicense()
            except Exception:
                pass
            else:
                break
        else:
            raise Exception("현재 구동중인 DHCP 서버가 존재하지 않습니다")

        return {"IPCOUNT": current_ip_count, "LICENSE": license_count}


# EOF
