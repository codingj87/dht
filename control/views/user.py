# -*- coding: utf-8 -*-
import time, hashlib
from django.utils.decorators import method_decorator

from zen.common import timeutil
from ..view import View
from ..deco import json_encode, no_login_json_encode
from ..models import User


class UserView(View):
    @method_decorator(json_encode)
    def listup(self, request):
        userid = request.POST.get("userid")
        name = request.POST.get("name")
        phone = request.POST.get("phone")
        email = request.POST.get("email")
        level = request.POST.get("level")

        start = int(request.POST.get("start", 0))
        limit = int(request.POST.get("limit", 20))

        options = {}
        if userid:
            options["userid__icontains"] = userid
        if name:
            options["name__icontains"] = name
        if phone:
            options["phone__icontains"] = phone
        if email:
            options["email__icontains"] = email
        if level:
            options["level"] = level

        if options:
            rs = User.objects.filter(**options).order_by("name")
        else:
            rs = User.objects.all().order_by("name")

        total_count = rs.count()
        return {
            "success": True,
            "totalCount": total_count,
            "data": [
                {
                    "id": r.id,
                    "userid": r.userid,
                    "name": r.name,
                    "phone": r.phone,
                    "email": r.email,
                    "desc": r.desc,
                    "enable": r.enable,
                    "ctime": timeutil.getHumanTimeFromUnixTime(r.ctime),
                    "mtime": timeutil.getHumanTimeFromUnixTime(r.mtime),
                }
                for r in rs[start : start + limit]
            ],
        }

    @classmethod
    def _masking_email(cls, email):
        if email:
            _email = list(email)
            flag = True
            for idx, char in enumerate(email):
                if char == "@":
                    flag = False

                if not (idx % 2) and flag:
                    _email[idx] = "*"
            return "".join(_email)
        else:
            return email

    @method_decorator(no_login_json_encode)
    def create(self, request):
        user_id = request.POST.get("user_id")
        name = request.POST.get("name")
        pw = request.POST.get("pw")
        phone = request.POST.get("phone")
        email = request.POST.get("email")
        desc = request.POST.get("desc")
        enable = request.POST.get("enable")

        user_id = user_id.strip()
        if user_id.endswith("@system"):
            return {"success": False, "errmsg": "시스템 계정은 생성할 수 없습니다."}

        if User.objects.filter(userid=user_id).exists():
            return {"success": False, "errmsg": f"{user_id}는 이미 존재 합니다"}

        now = int(time.time())
        User.objects.create(
            **{
                "userid": user_id,
                "name": name.strip(),
                "passwd": hashlib.sha512(pw.encode("utf8")).hexdigest(),
                "phone": phone.strip(),
                "email": email.strip(),
                "desc": desc,
                "ctime": now,
                "mtime": now,
                "enable": enable,
            }
        )
        return {"success": True}

    @method_decorator(json_encode)
    def read(self, request):
        userid = request.POST.get("userid")
        if userid:
            user = User.objects.get(userid=userid)
        else:
            id = request.POST.get("id")
            user = User.objects.get(id=id)
        return {
            "success": True,
            "data": {
                "id": user.id,
                "user_id": user.userid,
                "name": user.name,
                "phone": user.phone,
                "email": user.email,
                "desc": user.desc,
                "enable": user.enable == 1,
            },
        }

    @method_decorator(json_encode)
    def update(self, request):
        user_id = request.POST.get("id").strip()
        name = request.POST.get("name").strip()
        passwd = request.POST.get("pw")
        phone = request.POST.get("phone")
        email = request.POST.get("email")
        desc = request.POST.get("desc")
        enable = request.POST.get("enable")

        now = int(time.time())
        user = User.objects.get(id=int(user_id))
        if name != user.name:
            user.name = name

        if passwd:
            user.passwd = hashlib.sha512(passwd.encode("utf8")).hexdigest()

        if user.phone != phone:
            if not phone.find("*") > -1:
                user.phone = phone

        if user.email != email:
            if not email.find("*") > -1:
                user.email = email

        if user.desc != desc:
            user.desc = desc

        if user.enable != enable:
            user.enable = enable

        user.mtime = now
        user.save()

        return {"success": True}

    @method_decorator(json_encode)
    def update2(self, request):
        depart = request.POST.get("depart")
        desc = request.POST.get("desc")
        email = request.POST.get("email")
        language = request.POST.get("language")
        phone = request.POST.get("phone")
        pw = request.POST.get("pw")
        user_id = request.POST.get("user_id")
        theme = request.POST.get("theme")

        if theme:
            request.session["theme"] = theme

        user = User.objects.get(userid=user_id)
        if language and user.language and (language != user.language):
            request.session["language"] = language

        user.language = language
        user.depart = depart
        user.phone = phone
        user.email = email
        user.desc = desc
        user.theme = theme

        now = int(time.time())
        if pw:
            user.passwd = hashlib.sha512(pw.encode("utf8")).hexdigest()
            user.passwd_time = now

        user.mtime = now
        user.save()
        return {"success": True}

    @method_decorator(json_encode)
    def delete(self, request):
        id = int(request.POST["id"])
        userid = User.objects.get(id=id).userid

        if User.objects.count() == 1:
            return {"success": False, "errmsg": "유일한 사용자이므로 삭제할 수 없습니다."}

        if userid == "masteradmin":
            return {"success": False, "errmsg": "관리자 계정은 삭제할 수 없습니다."}

        try:
            User.objects.get(id=id).delete()
        except:
            pass

        return {"success": True}

    @staticmethod
    def masking_phone(phone):
        if phone:
            return phone[:-4] + "****"
        else:
            return phone


# EOF
