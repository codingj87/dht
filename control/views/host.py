# -*- coding: utf-8 -*-
import time
from django.utils.decorators import method_decorator
from django.db.models import Q

# from zen.common import timeutil
from ..view import View
from ..deco import json_encode
# from ..models import Host


class HostView(View):
    @method_decorator(json_encode)
    def list_up(self, request):
        mode = request.POST.get("mode")
        group_id = request.POST.get("id")
        name = request.POST.get("name")
        ip = request.POST.get("ip")
        port = request.POST.get("port")
        start = int(request.POST.get("start", 0))
        limit = int(request.POST.get("limit", 20))

        if mode == "grid":
            options = {}
            if group_id:
                options["group__id"] = int(group_id)
            if name:
                options["name__icontains"] = name

            rs = Host.objects.filter(**options)
            if ip:
                rs = rs.filter(
                    Q(master_ip__icontains=ip) | Q(slave_ip__icontains=ip)
                )
            if port:
                rs = rs.filter(Q(master_port=port) | Q(slave_port=port))

            rs = rs.order_by("name")
            total_count = rs.count()
            rs = rs[start : start + limit]
        else:
            rs = Host.objects.order_by("name").all()
            total_count = rs.count()

        return {
            "success": "True",
            "total_count": total_count,
            "data": [
                {
                    "id": r.id,
                    "group_name": r.group.name,
                    "group_id": r.group.id,
                    "name": r.name,
                    "master_ip": r.master_ip,
                    "master_port": r.master_port,
                    "slave_ip": r.slave_ip,
                    "slave_port": r.slave_port,
                    "ctime": timeutil.getHumanTimeFromUnixTime(r.ctime),
                    "mtime": timeutil.getHumanTimeFromUnixTime(r.mtime),
                }
                for r in rs
            ],
        }

    @method_decorator(json_encode)
    def read(self, request):
        host_id = int(request.POST.get("id"))
        host = Host.objects.get(id=host_id)
        data = {
            "id": host.id,
            "group_name": host.group.name,
            "group_id": host.group.id,
            "name": host.name,
            "master_ip": host.master_ip,
            "master_port": host.master_port,
            "slave_ip": host.slave_ip,
            "slave_port": host.slave_port,
            "ctime": host.ctime,
            "mtime": host.mtime,
        }
        return {"success": "True", "data": data}

    @method_decorator(json_encode)
    def create(self, request):
        name = request.POST.get("name")
        master_ip = request.POST.get("master_ip")
        master_port = request.POST.get("master_port")
        slave_ip = request.POST.get("slave_ip")
        slave_port = request.POST.get("slave_port")
        group_id = 2  # 임시 int(request.POST.get('group_id'))

        now = int(time.time())
        Host.objects.create(
            group_id=group_id,
            name=name,
            master_ip=master_ip,
            master_port=master_port,
            slave_ip=slave_ip,
            slave_port=slave_port,
            ctime=now,
            mtime=now,
        )
        return {"success": "True"}

    @method_decorator(json_encode)
    def update(self, request):
        host_id = int(request.POST.get("id"))
        name = request.POST.get("name")
        master_ip = request.POST.get("master_ip")
        master_port = request.POST.get("master_port")
        slave_ip = request.POST.get("slave_ip")
        slave_port = request.POST.get("slave_port")

        host = Host.objects.get(id=host_id)
        host.name = name
        host.master_ip = master_ip
        host.master_port = master_port
        host.slave_ip = slave_ip
        host.slave_port = slave_port
        host.mtime = int(time.time())
        host.save()
        return {"success": "True"}

    @method_decorator(json_encode)
    def delete(self, request):
        Host.objects.get(id=int(request.POST.get("id"))).delete()
        return {"success": "True"}


# EOF
