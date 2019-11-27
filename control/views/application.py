# -*- coding: utf-8 -*-
import time

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from lib.view import View
from ..config import SYSTEM_MAP
from ..deco import no_login_json_encode
from ..models import User, Setting


class ApplicationView(View):
    def index(self, request):
        d = dict(
            Setting.objects.filter(key__startswith="passwd_").values_list(
                "key", "value"
            )
        )
        SYSTEM_MAP["passwd_alpha"] = d.get("passwd_alpha")
        SYSTEM_MAP["passwd_number"] = d.get("passwd_number")
        SYSTEM_MAP["passwd_special"] = d.get("passwd_special")
        SYSTEM_MAP["passwd_length"] = d.get("passwd_length")
        return render(request, "index.html", SYSTEM_MAP)

    @method_decorator(csrf_exempt)
    @method_decorator(no_login_json_encode)
    def create(self, request):
        userid = request.POST.get("userID")
        if User.objects.filter(userid=userid).exists():
            return {"success": False, "msg": "ID가 중복되었습니다."}

        now = int(time.time())
        User.objects.create(
            userid=userid,
            passwd=request.POST.get("passwd"),
            level=int(request.POST.get("admin")),
            email=request.POST.get("email"),
            enable=0,
            desc=request.POST.get("desc"),
            phone=request.POST.get("phone"),
            name=request.POST.get("name"),
            ctime=now,
            mtime=now,
        )
        return {"success": True}


# END
