# -*- coding: utf-8 -*-
import uuid, hashlib

from django.shortcuts import render
from django.http import HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from ..view import View
from ..deco import no_login_json_encode
from ..models import User


class PasswordView(View):
    @classmethod
    def index(cls, request):
        if request.META.get("QUERY_STRING"):
            return HttpResponseNotFound("<h1>Page not found</h1>")
        return render(request, "password.html")

    @method_decorator(csrf_exempt)
    @method_decorator(no_login_json_encode)
    def find(self, request):
        userid = request.POST.get("userID")
        email = request.POST.get("email")

        try:
            user = User.objects.get(userid=userid)
        except:
            return {
                "success": False,
                "msg": "not found user.",
                "msg_h": "알 수 없는 ID 입니다.",
            }

        if user.email != email:
            return {
                "success": False,
                "msg": "email do not match.",
                "msg_h": "이메일이 일치하지 않습니다.",
            }

        new_pw = str(uuid.uuid1()).split("-")[0]
        # send_mail(
        #     '[zenDHCP] 임시 비밀번호 발송.',
        #     '[%s]의 패스워드를 [%s]로 재발급 하였습니다.' % (userid, new_pw),
        #     'admin@zensystems.co.kr',
        #     [email, 'admin@kt.com'],
        #     fail_silently=False
        # )
        user.passwd = hashlib.sha512(new_pw.encode("utf8")).hexdigest()
        user.save()
        return {"success": True}


# END
