# -*- coding: utf-8 -*-
import time, re
from django.utils.decorators import method_decorator
from django.core.cache import cache

# from zen.common import timeutil
from lib.view import View
from ..deco import json_encode
# from ..models import Group, Host


class GroupView(View):
    @method_decorator(json_encode)
    def read(self, request):
        group_id = request.POST.get("id")
        r = Group.objects.get(id=group_id)
        return {
            "success": True,
            "data": {
                "id": r.id,
                "name": r.name,
                "desc": r.desc,
                "ctime": timeutil.getHumanTimeFromUnixTime(r.ctime),
                "mtime": timeutil.getHumanTimeFromUnixTime(r.mtime),
            },
        }

    @method_decorator(json_encode)
    def create(self, request):
        pid = int(request.POST.get("pid", 0))
        name = request.POST.get("name").strip()
        desc = request.POST.get("desc")
        errors = self.validate(request)
        if errors:
            return {"success": False, "errmsg": errors["name"]}

        if Group.objects.filter(name=name, pid=pid).exists():
            return {
                "success": False,
                "errmsg": f"그룹이름 '{name}'이(가) 존재합니다. 다른이름을 사용해 주세요.",
            }

        now = int(time.time())
        group = Group.objects.create(
            name=name, desc=desc, pid=pid, ctime=now, mtime=now
        )
        cache.delete("group")
        return {"success": True, "data": {"id": "group-%s" % group.id}}

    @method_decorator(json_encode)
    def update(self, request):
        errors = self.validate(request)
        if errors:
            return {"success": False, "errors": errors}

        group_id = int(request.POST.get("id"))
        name = request.POST.get("name").strip()
        desc = request.POST.get("desc")
        now = int(time.time())

        group = Group.objects.get(id=group_id)
        if (
            Group.objects.filter(name=name, pid=group.pid)
            .exclude(id=group_id)
            .exists()
        ):
            return {
                "success": False,
                "errmsg": f"그룹이름 '{name}'이(가) 존재합니다. 다른이름을 사용해 주세요.",
            }

        sentinnel = False
        if name != group.name:
            group.name = name
            sentinnel = True

        if desc != group.desc:
            group.desc = desc
            sentinnel = True

        if sentinnel:
            group.mtime = now
            group.save()

        cache.delete("group")
        return {"success": True, "data": {"id": "group-%s" % group.id}}

    def validate(self, request):
        name = request.POST.get("name").strip()
        if not name:
            return {"name": "필수입력 항목입니다."}

        if re.match(".*?[!@#$%^&*_+-=:\";'?,./]+", name, re.DOTALL):
            return {"name": "특수문자는 입력 할 수 없습니다."}

    @method_decorator(json_encode)
    def delete(self, request):
        group_id = int(request.POST.get("id"))
        force = request.POST.get("force")
        userid = request.session["userid"]
        userip = request.META.get("REMOTE_ADDR")
        return self._delete(group_id, force, userid, userip)

    def _delete(self, group_id, force, userid="", userip=""):
        if Group.objects.get(id=group_id).pid == 0:
            return {
                "success": False,
                "errcode": "GROUP_ROOT",
                "errmsg": "최상위 그룹은 삭제할수 없습니다.",
            }

        try:
            if not force:
                if Group.objects.filter(pid=group_id).exists():
                    return {
                        "success": False,
                        "errcode": "GROUP_EXISTS",
                        "errmsg": "하위그룹이 존재합니다.",
                    }

                if Host.objects.filter(group__id=group_id).exists():
                    return {
                        "success": False,
                        "errcode": "HOST_EXISTS",
                        "errmsg": "빈 그룹이 아닙니다.",
                    }

            group = Group.objects.get(id=group_id)
            self._delete_group(group, force, userid, userip)
            cache.delete("group")
            return {"success": True}
        except Exception as e:
            return {"success": False, "errmsg": str(e)}

    def _delete_group(self, group, force=False, userid="", userip=""):
        if force:
            for subgroup in Group.objects.filter(pid=group.id):
                self._delete_group(subgroup, force, userid, userip)
            Host.objects.filter(group__id=group.id).delete()
        group.delete()


# EOF
