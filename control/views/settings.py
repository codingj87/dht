# -*- coding: utf-8 -*-
import os, time, io
from django.utils.decorators import method_decorator

from lib.view import View
from lib.dynamicWorkLog import getLogModel
from ..deco import json_encode
from ..models import Setting


class SettingsView(View):
    KEY_LABEL_MAP = {
        "auth_fail_count": "로그인 재시도(회)",
        "auth_fail_action": "로그인실패 액션",
        "auth_block_time": "차단시간(분)",
        "passwd_alpha": "비밀번호 알파벳",
        "passwd_number": "비밀번호 숫자",
        "passwd_special": "비밀번호 특수문자",
        "passwd_length": "비밀번호 길이",
        "passwd_interval": "비밀번호 변경주기",
    }

    @method_decorator(json_encode)
    def read(self, request):
        data = dict(Setting.objects.values_list("key", "value"))
        return {"success": True, "data": data}

    @method_decorator(json_encode)
    def update(self, request):
        WorkLog = getLogModel(time.strftime("%Y%m%d"))
        log = WorkLog(
            **{
                "action": "settings.update",
                "userid": request.session.get("userid"),
                "user_ip": request.META.get("REMOTE_ADDR"),
                "ctime": int(time.time()),
            }
        )

        logdesc = []
        setting = dict(Setting.objects.values_list("key", "value"))
        for key, helpString in self.KEY_LABEL_MAP.items():
            try:
                value = request.POST[key]
            except:
                continue
            else:
                try:
                    originValue = setting[key]
                except:
                    Setting.objects.create(key=key, value=value)
                    logdesc.append("%s(%s)" % (helpString, value))
                else:
                    if originValue != value:
                        r = Setting.objects.get(key=key)
                        r.value = value
                        r.save()
                        logdesc.append(
                            "%s(%s -> %s)" % (helpString, originValue, value)
                        )

        log.desc = ", ".join(logdesc)
        log.response = "success"
        log.save()

        return {"success": True}

    @method_decorator(json_encode)
    def readTemplate(self, request):
        key = request.POST.get("key")
        try:
            value = Setting.objects.get(key=key).value
        except:
            data = {"subject": "", "content": ""}
        else:
            if "<sep>" in value:
                subject, content = value.split("<sep>")
                data = {"subject": subject, "content": content}
            else:
                data = {"subject": "", "content": value}

        return {"success": True, "data": data}

    @method_decorator(json_encode)
    def updateTemplate(self, request):
        key = request.POST.get("key")
        value = request.POST.get("value")

        try:
            r = Setting.objects.get(key=key)
        except:
            Setting.objects.create(key=key, value=value)
        else:
            r.value = value
            r.save()

        return {"success": True}

    def upload(self, directory, file):
        filePath = os.path.join(directory, file.name)
        if os.path.isfile(filePath):
            os.remove(filePath)

        with io.open(filePath, "wb") as fileObj:
            for chunk in file.chunks():
                fileObj.write(chunk)

        return True

    def systemtree(self, request):
        return [
            {"id": 0, "text": "시스템 설정", "iconCls": "parser", "children": None}
        ]


# END
