# -*- coding: utf-8 -*-
import io, traceback
from pandas.io import json

from django.http import HttpResponse
from django.shortcuts import redirect


def debug(func):
    def decorator(request, *args, **kwargs):
        try:
            response = func(request, *args, **kwargs)
            return response
        except:
            buf = io.BytesIO()
            traceback.print_exc(file=buf)
            io.open("/tmp/django.log", "ab").write(buf.getvalue() + "\n\n")
            return HttpResponse(buf.getvalue())

    return decorator


def json_encode(func):
    def decorator(request, *args, **kwargs):
        if not request.session.get("userid") or request.session.get(
            "userip"
        ) != request.META.get("REMOTE_ADDR"):
            response = json.dumps({"errcode": "SESSION_EXPIRED"})
            resp = HttpResponse(response)
        else:
            response = func(request, *args, **kwargs)
            response = json.dumps(response)
            callback = request.POST.get("callback")
            if callback:  # ext compatible
                resp = HttpResponse("%s(%s)" % (callback, response))
            else:
                resp = HttpResponse(response, content_type="application/json")
        resp.flush()
        return resp

    return decorator


def no_login_json_encode(func):
    def decorator(request, *args, **kwargs):
        response = func(request, *args, **kwargs)
        response = json.dumps(response)
        resp = HttpResponse(response, content_type="application/json")
        resp.CacheControl = "no-cache"
        resp.flush()
        return resp

    return decorator


def login_required(func):
    def decorator(request, *args, **kwargs):
        if not request.session.get("userid") or request.session.get(
            "userip"
        ) != request.META.get("REMOTE_ADDR"):
            return redirect("/")
        else:
            # realm = request.session.get('realm')
            # if 0 and realm:
            #     _realm = '/'.join([x for x in realm.split('?', 1)[0].split('/') if x])    # allowed url
            #     _path  = '/'.join([x for x in request.path.split('/') if x])              # requested url
            #     if _realm != _path:
            #         return redirect(realm)
            response = func(request, *args, **kwargs)
            if isinstance(response, HttpResponse):
                return response
            else:
                return HttpResponse(response)

    return decorator


def session_json_encode(func):
    def decorator(request, *args, **kwargs):
        if not request.session.get("userid") or (
            request.session.get("userip") != request.META.get("REMOTE_ADDR")
        ):
            response = json.dumps(
                {"success": False, "errcode": "SESSION_EXPIRED"}
            )
            resp = HttpResponse(response, content_type="application/json")
        else:
            response = func(request, *args, **kwargs)
            response = json.dumps(response)
            callback = request.POST.get("callback")
            if callback:  # ext compatible
                resp = HttpResponse("%s(%s)" % (callback, response))
            else:
                resp = HttpResponse(response, content_type="application/json")
        resp.flush()
        return resp

    return decorator


# END
