# -*- coding: utf-8 -*-
import time
from functools import reduce
from collections import defaultdict, Counter
from django.utils.decorators import method_decorator

from zen import zenpack
from zen.common import timeutil

from control.helpers import get_status, merge_status_data
from lib.excellib import Excel
from lib.view import View
# from ..models import SHARED_NETWORK_STATS
from ..deco import json_encode
from ..util import streaming_http_response, get_rpc_list, get_cluster_ip


class IPStatsView(View):
    @method_decorator(json_encode)
    def list_up(self, request):
        try:
            totalCount, data = self._list_up(request)
        except Exception as e:
            print(str(e))
            return {"success": False, "errmsg": str(e)}
        else:
            return {"success": True, "data": data, "totalCount": totalCount}

    def _list_up(self, request):
        params = {"min_usage": 0, "max_usage": 100}
        sharedNetworkNameCondition = request.POST.get("shared_network")
        network_class = request.POST.get("class")
        cluster_id = request.session.get("cluster_id")
        if network_class:
            params["ip_class"] = network_class
        ipCondition = request.POST.get("ip") or None

        usage = request.POST.get("usage")
        if usage:
            usage = float(usage)
            usage_type = request.POST.get("type")  # over | under
            if usage_type == "over":
                params["min_usage"] = usage
            if usage_type == "under":
                params["max_usage"] = usage

        start = request.POST.get("start")
        limit = request.POST.get("limit")
        if limit:
            start = int(start)
            limit = int(limit)
        else:
            start = limit = None

        for rpc in get_rpc_list(get_cluster_ip(cluster_id)):
            try:
                shared_network_list = rpc.show_sharednetwork_list(ipCondition)
            except:
                pass
            else:
                active_rpc = rpc
                break
        else:
            raise Exception("현재 구동중인 DHCP 서버가 존재하지 않습니다")

        if sharedNetworkNameCondition:
            shared_network_list = [
                name
                for name in shared_network_list
                if sharedNetworkNameCondition in name
            ]
        data = get_status(active_rpc, shared_network_list, params)
        data = merge_status_data(data)
        total_count = len(data)

        if start and limit:
            data = data[start : start + limit]

        data.sort(key=lambda x: len(x["class"]))
        return total_count, data

    @method_decorator(json_encode)
    def chart_list_up(self, request):
        stime = int(request.POST.get("stime"))
        etime = int(request.POST.get("etime"))
        shared_network = request.POST.get("shared_network")

        info = defaultdict(Counter)
        userClassSet = set()
        rs = SHARED_NETWORK_STATS.objects.filter(
            shared_network=shared_network, ctime__gte=stime, ctime__lte=etime
        )
        for userClass, totalIP, assignedIP, ctime in rs.values_list(
            "user_class", "total_ip", "assigned", "ctime"
        ):
            info[ctime][userClass] = assignedIP * 100 / totalIP
            userClassSet.add(userClass)

        timeKey = sorted(list(info.keys()))
        statList = []
        if len(timeKey) <= 1000:
            for _time in timeKey:
                datum = {
                    userClass: info[_time][userClass]
                    for userClass in userClassSet
                }
                datum["ctime"] = _time
                statList.append(datum)
        else:
            start, end = timeKey[0], timeKey[-1]
            timeInterval = (end - start + 1) // 1000
            timeInfo = defaultdict(lambda *_: defaultdict(list))
            for _time in timeKey:
                for userClass in userClassSet:
                    timeInfo[_time // timeInterval * timeInterval][
                        userClass
                    ].append(info[_time][userClass])

            for _time, data in timeInfo.items():
                datum = {
                    userClass: sum(value) / len(value)
                    for userClass, value in data.items()
                }
                datum["ctime"] = _time
                statList.append(datum)

        data = {"stime": stime, "etime": etime, "sharedNetworkStats": statList}
        return {"success": True, "data": data}

    @method_decorator(json_encode)
    def get_ip_assigned(self, request):
        try:
            data = self._get_ip_assigned(request)
        except Exception as e:
            return {"success": False, "errmsg": str(e)}
        else:
            return {"success": True, "data": data}

    def _get_ip_assigned(self, request):
        ip_assigned = request.POST.get("ip_assigned")
        limit = request.POST.get("limit")
        cluster_id = request.session.get("cluster_id")
        shared_network = request.POST.get("shared_network")

        ip_assigned_sum = reduce(
            lambda x, y: int(x) + int(y), ip_assigned.split("<br>")
        )
        limit_sum = reduce(lambda x, y: int(x) + int(y), limit.split("<br>"))

        if isinstance(ip_assigned_sum, str):
            ip_assigned_sum = int(ip_assigned_sum)

        if isinstance(limit_sum, str) and limit_sum.isdigit():
            limit_sum = int(limit_sum)

        if not ip_assigned_sum:
            raise Exception("할당된 IP가 없습니다.")

        for rpc in get_rpc_list(get_cluster_ip(cluster_id)):
            try:
                ip_list = zenpack.loadBinaryData(
                    rpc.show_ip_by_lease_type(
                        shared_network, None, "assigned", 0, limit_sum
                    )
                )
            except:
                pass
            else:
                break
        else:
            raise Exception("현재 구동중인 DHCP 서버가 존재하지 않습니다")

        return [
            {
                "ip": item[0],
                "mac": ":".join(
                    [
                        item[1]["MAC"][i : i + 2]
                        for i in range(0, len(item[1]["MAC"]), 2)
                    ]
                ),
                "class": item[1]["CLASS"] or "default",
                "start": timeutil.getHumanTimeFromUnixTime(
                    int(item[1]["STIME"])
                ),
                "end": timeutil.getHumanTimeFromUnixTime(
                    int(item[1]["ETIME"])
                ),
            }
            for item in ip_list
        ]

    def excel(self, request):
        mode = request.POST.get("mode")
        flag = request.POST.get("flag")
        title = "IP 할당 현황"
        now = time.strftime("%Y-%m-%d %H%M%S")
        excel = Excel()

        if flag == "AssignedIPList":
            title = "할당 IP 목록"
            data = self._get_ip_assigned(request)
            excel.add_sheet(
                title,
                [
                    ("IP", "ip", 250),
                    ("MAC", "mac", 250),
                    ("Class", "class", 200),
                    ("Lease Start", "start", 300),
                    ("Lease End", "end", 300),
                ],
                data,
            )
        else:
            totalCount, data = self._list_up(request.POST)
            excel.add_sheet(
                title,
                [
                    ("Shared_Network", "shared_network", 250),
                    ("Class", "class", 200),
                    ("사용률(%)", "usage", 150),
                    ("전체", "total", 150),
                    ("할당", "uses", 150),
                    ("미할당", "free", 150),
                    ("IP충돌", "ip_collision", 150),
                ],
                data,
            )

        buf, file_type = excel.save()
        return streaming_http_response(
            request, mode, f"{title} {now}", buf, file_type
        )


# EOF
