# -*- coding: utf-8 -*-
import ipaddress
from django.utils.decorators import method_decorator

from zen import zenpack
from zen.common import timeutil
from lib.view import View
from ..deco import json_encode
from ..util import get_rpc_list, IP_STATE, get_cluster_ip


class IPSearchView(View):
    @method_decorator(json_encode)
    def list_up(self, request):
        cluster_id = request.session.get("cluster_id")
        ip = request.POST.get("ip")
        if not ip:
            return {"success": True, "data": [], "totalCount": 0}

        start = request.POST.get("start")
        limit = request.POST.get("limit")
        if limit:
            start = int(start)
            limit = int(limit)
        else:
            start = limit = None

        for rpc in get_rpc_list(get_cluster_ip(cluster_id)):
            try:
                shared_network_list = rpc.show_sharednetwork_list(ip)
            except:
                pass
            else:
                active_rpc = rpc
                break
        else:
            return {"success": False, "errmsg": "현재 구동중인 DHCP 서버가 존재하지 않습니다"}

        ip = ipaddress.IPv4Network(ip, strict=False)
        data = []
        for shared_network in shared_network_list:
            total = 0
            for klass, info in active_rpc.show_lease_info(
                shared_network
            ).items():
                uses = info.get("1")  # assigned
                if uses:
                    total += info["total"]

            if not total:
                continue

            ip_list = zenpack.loadBinaryData(
                active_rpc.show_ip_by_lease_type(
                    shared_network, None, "assigned", 0, total
                )
            )
            for item in ip_list:
                _ip = item[0]
                if ipaddress.IPv4Address(_ip) in ip:
                    info = active_rpc.show_lease_by_ip(_ip)
                    if info["MAC"] != "":
                        data.append(
                            {
                                "ip": _ip,
                                "mac": ":".join(
                                    [
                                        info["MAC"][i : i + 2]
                                        for i in range(0, len(info["MAC"]), 2)
                                    ]
                                ),
                                "vendor_class_id": info["VENDORCLASSID"]
                                or "default",
                                "state": IP_STATE[info["STATE"]],
                                "class": info["CLASS"] or "default",
                                "start_time": timeutil.getHumanTimeFromUnixTime(
                                    int(info["STIME"])
                                ),
                                "end_time": timeutil.getHumanTimeFromUnixTime(
                                    int(info["ETIME"])
                                ),
                                "update_time": timeutil.getHumanTimeFromUnixTime(
                                    int(info["ATIME"])
                                ),
                            }
                        )

        total_count = len(data)
        if start is not None:
            data = data[start : start + limit]

        return {"success": True, "data": data, "totalCount": total_count}


# EOF
