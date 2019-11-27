# -*- coding: utf-8 -*-
import time
from pandas import DataFrame as df
from collections import defaultdict
from django.utils.decorators import method_decorator

from zen.zenpack import loadBinaryData
from zen.common import timeutil
from lib.view import View
# from ..models import DHCPHandleStat, Daemon
from ..deco import json_encode
from ..util import get_server_list, get_rpc, get_cluster_ip


class ServerStatusView(View):
    @method_decorator(json_encode)
    def server_list_up(self, request):
        now = time.strftime("%Y-%m-%d %H:%M:%S")
        vip = request.POST.get("vip")
        data = []
        cluster_id = request.session.get("cluster_id")
        for rpc, ip, haMode in get_server_list(
            vip if vip else get_cluster_ip(cluster_id), "dhcpv4_ipmanager"
        ):
            try:
                serviceStatus, syncStatus = (
                    rpc.getServerStatus()
                )  # 1 - service 중 / 0 - standby 중
                state = rpc.getStatus()

                response = rpc.runCommand("ps -ef")
                if response["result"]:
                    response_data = loadBinaryData(response["data"])

                process_check = {
                    "DHCP": "kt_cordzero_dhcpv4_ipmanager",
                    "RADIUS": "kt_cordzero_radius",
                    "PPTPD": "pptpd",
                    "UWSGI": "uwsgi",
                }

                for key, value in process_check.items():
                    if value in response_data:
                        process_check[key] = True

                daemon = Daemon.objects.filter(ip=ip)
                if daemon.exists():
                    hostname = daemon[0].name

            except Exception as e:
                data.append(
                    {
                        "ip": ip,
                        "server_status": -1,  # dead
                        "replication": haMode,
                    }
                )
            else:
                data.append(
                    {
                        "hostname": hostname,
                        "ip": ip,
                        "server_status": serviceStatus,
                        "cpu": round(100 - state[0]["idle"], 2),
                        "memory": round(
                            state[1]["used"] * 100 / state[1]["total"], 2
                        ),
                        "swap": round(
                            state[2]["used"] * 100 / state[2]["total"], 2
                        ),
                        "disk": state[3]["/"],
                        "mtime": now,
                        "replication": haMode,
                        "process_check": process_check,
                    }
                )
        return {"success": True, "data": data}

    @method_decorator(json_encode)
    def list_up(self, request):
        stime = int(request.POST.get("stime"))
        etime = int(request.POST.get("etime"))
        resolution = request.POST.get("resolution", "300")
        ip = request.POST.get("ip")

        try:
            data = loadBinaryData(
                get_rpc(ip).getRRDData(stime, etime, resolution)
            )
        except Exception as e:
            return {"success": False, "data": [], "errmsg": str(e)}
        else:
            rs = (
                DHCPHandleStat.objects.filter(
                    ip=ip, ctime__gte=stime, ctime__lte=etime
                )
                .order_by("ctime")
                .values(
                    "discover",
                    "offer",
                    "request",
                    "ack",
                    "decline",
                    "nack",
                    "release",
                    "others",
                    "ctime",
                )
            )
            statList = list(rs)

            if len(statList) > 1000:
                start, end = statList[0]["ctime"], statList[-1]["ctime"]
                timeInterval = (end - start + 1) // 1000
                timeInfo = defaultdict(lambda *_: defaultdict(list))
                for stat in statList:
                    for key, value in stat.items():
                        timeInfo[stat["ctime"] // timeInterval * timeInterval][
                            key
                        ].append(value)

                compressedData = []
                for _time, values in timeInfo.items():
                    datum = {
                        key: sum(value) / len(value)
                        for key, value in values.items()
                    }
                    datum["ctime"] = _time
                    compressedData.append(datum)

                statList.clear()
                statList = compressedData

            legend = [
                "discover",
                "offer",
                "request",
                "ack",
                "decline",
                "nack",
                "release",
                "others",
            ]
            data["stat"] = {"legend": legend, "category": [], "series": []}

            for stat in statList:
                data["stat"]["category"].append(
                    timeutil.getHumanTimeFromUnixTime(stat["ctime"])
                )

            dataSet = df(statList, columns=legend).round(3)
            for column in dataSet.columns.values.tolist():
                data["stat"]["series"].append(
                    {
                        "id": f"stat_{column}",
                        "name": column,
                        "data": dataSet[column].tolist(),
                    }
                )

        return {"success": True, "data": data}


# EOF
