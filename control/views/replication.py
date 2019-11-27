# -*- coding: utf-8 -*-
import os
from subprocess import Popen, PIPE

from django.utils.decorators import method_decorator
from django.db import connections
from django.shortcuts import render

from zen.common import environment

from control.util import get_cluster_ip
from dht import settings
from lib.view import View
from ..deco import no_login_json_encode
from .. import util


class ReplicationView(View):
    STATUS_MAP = {
        "1": "Up. Disconnect.",
        "2": "Up. Connected.",
        "3": "Down",
        "-1": "There is no node.",
    }

    def index(self, request):
        return render(request, "replication.html", {})

    @method_decorator(no_login_json_encode)
    def nodeInfo(self, request):
        data = []
        watchdog_info = {}
        cluster_id = request.session.get("cluster_id")

        try:
            RPC_INFO = util.get_rpc_list(get_cluster_ip(cluster_id))[0]
        except:
            return {"success": False, "data": []}

        try:
            vip = RPC_INFO.getVIP()
        except:
            return {"success": False, "data": []}

        wd_result = RPC_INFO.pgWatchdogInfo()
        for item in wd_result["data"].splitlines()[2:]:
            _, _, hostName, *_, status = item.split()
            watchdog_info[hostName] = status

        for host in settings.PGPOOL_HOSTS:
            node_id = host.get("id")
            user = host.get("user")
            hostname = host.get("name")
            port = host.get("port")
            cmd = f"/usr/local/bin/pcp_node_info -U {user} -w -h {vip} -p {settings.PCP_PORT} -n {node_id}"
            proc = Popen(cmd, shell=True, stdout=PIPE, stderr=PIPE)
            try:
                result, _ = proc.communicate()  # result : bytes
                result = result.decode("utf8").strip().split(" ")
                status_code = result[2]
            except:
                status_code = "-1"

            status_msg = self.STATUS_MAP.get(status_code)

            try:
                cs = connections[hostname].cursor()
            except:
                db_active = db_isMaster = False
            else:
                db_active = True
                cs.execute("SELECT pg_is_in_recovery()")
                (standby,), = cs.fetchall()
                if standby:
                    db_isMaster = False
                    if status_code != "-1":
                        status_msg += "  %s" % "Running as standby server"
                else:
                    db_isMaster = True
                    if status_code != "-1":
                        status_msg += "  %s" % "Running as primary server"

            data.append(
                {
                    "hostname": hostname,
                    "port": port,
                    "db_pool_status": status_code,
                    "watchdog_status": watchdog_info.get(hostname)
                    != "SHUTDOWN",
                    "status": status_msg,
                    "db_active": db_active,
                    "db_isMaster": db_isMaster,
                    "isMaster": watchdog_info.get(hostname) == "MASTER",
                    "virtual_ip": vip,
                }
            )
        return {"success": True, "data": data}

    @method_decorator(no_login_json_encode)
    def recovery(self, request):
        node_id = request.POST.get("nodeId")
        cluster_id = request.session.get("cluster_id")
        try:
            RPC_INFO = util.get_rpc_list(get_cluster_ip(cluster_id))[0]
        except:
            return {"success": False, "data": []}
        try:
            result = RPC_INFO.pgRecovery(int(node_id))
            if result.get("result"):
                return {"success": True, "data": result.get("data")}
            else:
                return {"success": False, "errmsg": result.get("errmsg")}
        except:
            return {"success": False, "errmsg": "node 가 존재하지 않습니다."}

    @method_decorator(no_login_json_encode)
    def attach(self, request):
        node_id = request.POST.get("nodeId")
        cluster_id = request.session.get("cluster_id")
        try:
            RPC_INFO = util.get_rpc_list(get_cluster_ip(cluster_id))[0]
        except:
            return {"success": False, "data": []}
        try:
            result = RPC_INFO.pgAttachNode(int(node_id))
            if result.get("result"):
                return {"success": True, "data": result.get("data")}
            else:
                return {"success": False, "errmsg": result.get("data")}
        except:
            return {"success": False, "errmsg": "node 가 존재하지 않습니다."}


# EOF
