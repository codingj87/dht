# -*- coding: utf-8 -*-
import time
from django.core.exceptions import ObjectDoesNotExist

from zen import zenpack
from zen.rpc4django import rpcmethod
from zen.common.jsonrpc import ServiceProxy
from zen.ipms.radius.eap_code import EAP_TYPE_MSCHAPV2, EAP_TYPE_PEAP
from lib import dynamicDHCPLog
# from .models import (
#     Cluster,
#     Daemon,
#     JobHistory,
#     Config,
#     DHCPHandleStat,
#     SHARED_NETWORK_STATS,
#     NAS,
#     Supplicant,
#     AccountingLog,
#     AccountedLog,
# )
from .util import get_server_list


@rpcmethod(name="healthcheck")
def health_check():
    return True


@rpcmethod(name="insertDHCPLog")
def insertDHCPLog(data):
    data = zenpack.loadBinaryData(data)
    DHCPLog = dynamicDHCPLog.getLogModel(time.strftime("%Y%m%d"))
    DHCPLog.objects.bulk_create(DHCPLog(**datum) for datum in data)
    return True


@rpcmethod(name="server.start")
def server_start(p):
    # dht 데몬이 로딩하면서 호출
    # {
    # 'system_name': 'master-devel',
    # 'ip': '10.10.10.11',
    # 'svr_type': 'dhcpv4_parser',   # ipmanager
    # 'rpc_port': 10000
    # }

    # {
    #   'system_name': 'master-devel',
    #   'ip': '10.10.10.11',
    #   'virtual_ip': '10.10.10.13',
    #   'svr_type': 'dhcpv4_ipmanager',
    #   'rpc_port': 10004,
    #   'ha_mode': 'MASTER'
    # }
    now = int(time.time())
    svr_type = p["svr_type"]
    hamode = p.get("ha_mode")
    vip = p["virtual_ip"]
    try:
        cluster = Cluster.objects.get(vip=vip)
    except:
        cluster = Cluster.objects.create(
            name=p["system_name"], vip=vip, ctime=now, mtime=now
        )

    try:
        daemon = Daemon.objects.get(ip=p["ip"], svr_type=svr_type)
    except ObjectDoesNotExist:
        Daemon.objects.create(
            ip=p["ip"],
            cluster=cluster,
            rpc_port=p["rpc_port"],
            svr_type=svr_type,
            name=p["system_name"],
            status=1,
            hamode=hamode,
            ctime=now,
            mtime=now,
        )
    else:
        daemon.name = p["system_name"]
        daemon.rpc_port = p["rpc_port"]
        daemon.cluster = cluster
        daemon.hamode = hamode
        daemon.mtime = now
        daemon.status = 1
        daemon.save()

    if svr_type == "dhcpv4_ipmanager":
        scopeContents = p["scope_contents"]
        scopeTime = p["scope_contents_mtime"]
        scopeSize = len(scopeContents)

        try:
            oldConfig = Config.objects.order_by("-ctime")[0]
        except:
            Config.objects.create(
                subject="dhcpd.conf",
                after=scopeContents,
                size=scopeSize,
                ctime=scopeTime,
            )
        else:
            if oldConfig.size != scopeSize:
                Config.objects.create(
                    subject="dhcpd.conf",
                    before=oldConfig.after,
                    after=scopeContents,
                    size=scopeSize,
                    ctime=scopeTime,
                )

    return {"result": True, "data": {}}  # policy


@rpcmethod(name="server.end")
def server_end(svrType, ip):
    try:
        daemon = Daemon.objects.get(ip=ip, svr_type=svrType)
    except:
        pass
    else:
        daemon.status = 0
        daemon.mtime = int(time.time())
        daemon.save()

    return {"result": True}


@rpcmethod(name="createSharedNetwork")
def createSharedNetwork(sharedNetworkName, config, user_id):
    rpcList = {
        hamode: ServiceProxy(f"https://{ip}:{rpcPort}/RPC2")
        for hamode, ip, rpcPort in Daemon.objects.filter(
            svr_type="dhcpv4_ipmanager", status=1, hamode__isnull=False
        ).values_list("hamode", "ip", "rpc_port")
    }
    errMsg = []
    if "standalone" in rpcList:
        try:
            ret_code, err_msg = rpcList[
                "standalone"
            ].create_sharednetwork_config(config)
        except:
            master_result = 0
            errMsg.append("standalone error: daemon not respond")
        else:
            if ret_code:
                master_result = 1
                errMsg.append("master: ok")
            else:
                master_result = 0
                errMsg.append("master error: %s" % err_msg)
        slave_result = 0
    else:
        if "master" in rpcList:
            try:
                ret_code, err_msg = rpcList[
                    "master"
                ].create_sharednetwork_config(config)
            except:
                master_result = 0
                errMsg.append("master error: daemon not respond")
            else:
                if ret_code:
                    master_result = 1
                    errMsg.append("master: ok")
                else:
                    master_result = 0
                    errMsg.append("master error: %s" % err_msg)
        else:
            master_result = 0
            errMsg.append("master: not respond")

        if "slave" in rpcList:
            try:
                ret_code, err_msg = rpcList[
                    "slave"
                ].create_sharednetwork_config(config)
            except:
                slave_result = 0
                errMsg.append("slave error: daemon not respond")
            else:
                if ret_code:
                    slave_result = 1
                    errMsg.append("slave: ok")
                else:
                    slave_result = 0
                    errMsg.append("slave error: %s" % err_msg)
        else:
            slave_result = 0
            errMsg.append("slave: not respond")

    JobHistory.objects.create(
        userid=user_id,
        type="create",
        after_cfg=config,
        master_result=master_result,
        slave_result=slave_result,
        shared_network=sharedNetworkName,
        ctime=int(time.time()),
    )
    return "\n".join(errMsg)


@rpcmethod(name="updateSharedNetwork")
def updateSharedNetwork(sharedNetworkName, config, user_id):
    rpcList = {
        hamode: ServiceProxy(f"https://{ip}:{rpcPort}/RPC2")
        for hamode, ip, rpcPort in Daemon.objects.filter(
            svr_type="dhcpv4_ipmanager", status=1, hamode__isnull=False
        ).values_list("hamode", "ip", "rpc_port")
    }

    for rpc in rpcList.values():
        try:
            beforeConfig = rpc.read_sharednetwork_config(sharedNetworkName)
        except:
            pass
        else:
            if beforeConfig:
                break
    else:
        return "fail to get %s information" % sharedNetworkName

    errMsg = []

    if "standalone" in rpcList:
        try:
            ret_code, err_msg = rpcList[
                "standalone"
            ].update_sharednetwork_config(sharedNetworkName, config)
        except:
            master_result = 0
            errMsg.append("master error: daemon not respond")
        else:
            if ret_code:
                master_result = 1
                errMsg.append("master: ok")
            else:
                master_result = 0
                errMsg.append("master error: %s" % err_msg)
        slave_result = 0
    else:
        if "master" in rpcList:
            try:
                ret_code, err_msg = rpcList[
                    "master"
                ].update_sharednetwork_config(sharedNetworkName, config)
            except:
                master_result = 0
                errMsg.append("master error: daemon not respond")
            else:
                if ret_code:
                    master_result = 1
                    errMsg.append("master: ok")
                else:
                    master_result = 0
                    errMsg.append("master error: %s" % err_msg)
        else:
            master_result = 0
            errMsg.append("master: not respond")

        if "slave" in rpcList:
            try:
                ret_code, err_msg = rpcList[
                    "slave"
                ].update_sharednetwork_config(sharedNetworkName, config)
            except:
                slave_result = 0
                errMsg.append("slave error: daemon not respond")
            else:
                if ret_code:
                    slave_result = 1
                    errMsg.append("slave: ok")
                else:
                    slave_result = 0
                    errMsg.append("slave error: %s" % err_msg)
        else:
            slave_result = 0
            errMsg.append("slave: not respond")

    JobHistory.objects.create(
        userid=user_id,
        type="update",
        before_cfg=beforeConfig,
        after_cfg=config,
        master_result=master_result,
        slave_result=slave_result,
        # vip=vip,
        shared_network=sharedNetworkName,
        ctime=int(time.time()),
    )
    return "\n".join(errMsg)


@rpcmethod(name="deleteSharedNetwork")
def deleteSharedNetwork(sharedNetworkName, user_id):
    rpcList = {
        hamode: ServiceProxy(f"https://{ip}:{rpcPort}/RPC2")
        for hamode, ip, rpcPort in Daemon.objects.filter(
            svr_type="dhcpv4_ipmanager", status=1, hamode__isnull=False
        ).values_list("hamode", "ip", "rpc_port")
    }

    for rpc in rpcList.values():
        try:
            config = rpc.read_sharednetwork_config(sharedNetworkName)
        except:
            pass
        else:
            if config:
                break
    else:
        return f"fail to get {sharedNetworkName} information"

    errMsg = []

    if "standalone" in rpcList:
        try:
            ret_code, err_msg = rpcList[
                "standalone"
            ].delete_sharednetwork_config(sharedNetworkName)
        except:
            master_result = 0
            errMsg.append("master error: daemon not respond")
        else:
            if ret_code:
                master_result = 1
                errMsg.append("master: ok")
            else:
                master_result = 0
                errMsg.append("master error: %s" % err_msg)
        slave_result = 0
    else:
        if "master" in rpcList:
            try:
                ret_code, err_msg = rpcList[
                    "master"
                ].delete_sharednetwork_config(sharedNetworkName)
            except:
                master_result = 0
                errMsg.append("master error: daemon not respond")
            else:
                if ret_code:
                    master_result = 1
                    errMsg.append("master: ok")
                else:
                    master_result = 0
                    errMsg.append("master error: %s" % err_msg)
        else:
            master_result = 0
            errMsg.append("master: not respond")

        if "slave" in rpcList:
            try:
                ret_code, err_msg = rpcList[
                    "slave"
                ].delete_sharednetwork_config(sharedNetworkName)
            except:
                slave_result = 0
                errMsg.append("slave error: daemon not respond")
            else:
                if ret_code:
                    slave_result = 1
                    errMsg.append("slave: ok")
                else:
                    slave_result = 0
                    errMsg.append("slave error: %s" % err_msg)
        else:
            slave_result = 0
            errMsg.append("slave: not respond")

    JobHistory.objects.create(
        userid=user_id,
        type="delete",
        before_cfg=config,
        master_result=master_result,
        slave_result=slave_result,
        # vip=vip,
        shared_network=sharedNetworkName,
        ctime=int(time.time()),
    )
    return "\n".join(errMsg)


@rpcmethod(name="registerDHCPHandledInfo")
def registerDHCPHandledInfo(data):
    DHCPHandleStat.objects.bulk_create(
        DHCPHandleStat(**datum) for datum in zenpack.loadBinaryData(data)
    )
    return True


@rpcmethod(name="registerDHCPStats")
def registerDHCPStats(data):
    try:
        SHARED_NETWORK_STATS.objects.bulk_create(
            SHARED_NETWORK_STATS(**datum)
            for datum in zenpack.loadBinaryData(data)
        )
    except:
        pass

    return True


@rpcmethod(name="checkDaemonStatus")
def checkDaemonStatus(vip):
    # called from check_ipms in cronjobs
    now = int(time.time())
    daemonStatus = {
        (serverIP, serverType): status
        for serverIP, serverType, status in Daemon.objects.values_list(
            "ip", "svr_type", "status"
        )
    }
    for rpc, serverIP, haMode in get_server_list(vip, "dhcpv4_parser"):
        status = daemonStatus[(serverIP, "dhcpv4_parser")]
        try:
            rpc.healthcheck()
        except:
            if status == 1:
                Daemon.objects.filter(
                    ip=serverIP, svr_type="dhcpv4_parser"
                ).update(status=0, mtime=now)
        else:
            if status == 0:
                Daemon.objects.filter(
                    ip=serverIP, svr_type="dhcpv4_parser"
                ).update(status=1, mtime=now)

    for rpc, serverIP, haMode in get_server_list(vip, "dhcpv4_ipmanager"):
        status = daemonStatus[(serverIP, "dhcpv4_ipmanager")]
        try:
            rpc.healthcheck()
        except:
            if status == 1:
                Daemon.objects.filter(
                    ip=serverIP, svr_type="dhcpv4_ipmanager"
                ).update(status=0, mtime=now)
        else:
            if status == 0:
                Daemon.objects.filter(
                    ip=serverIP, svr_type="dhcpv4_ipmanager"
                ).update(status=1, mtime=now)
    return True


# --- RADIUS API -----------
@rpcmethod(name="radius.getNASInfo")
def radiusGetNASInfo(ip):
    try:
        nas = NAS.objects.get(ip=ip)
    except ObjectDoesNotExist:
        return {"result": False}
    else:
        return {
            "result": True,
            "data": {"secret": nas.secret, "type": nas.type.type},
        }


@rpcmethod(name="radius.getUserInfo")
def radiusGetUserInfo(params):
    # params = {
    #     'authenticatorIP': authenticatorIPAddress,
    #     'userID': userid,
    #     'clientIP': clientIPAddress,
    #     'clientMAC': clientMACAddress,
    #     'authType': 'radius'
    # }
    # XXX 접속 이력을 남겨야 한다
    try:
        user = Supplicant.objects.get(userid=params["userID"])
    except:
        return {"result": False}
    else:
        return {
            "result": True,
            "data": {
                "eapType": EAP_TYPE_PEAP,  # EAP_TYPE_PEAP, EAP_TYPE_TTLS, ...
                "authType": EAP_TYPE_MSCHAPV2,
                "attribute": {},
                "password": user.password,
                "userid": user.userid,
                "ip": user.ip,
            },
        }


@rpcmethod(name="radius.registerAccountLogs")
def radiusRegisterAccountLogs(updateSet, stopSet):
    try:
        updateSet = zenpack.loadBinaryData(updateSet)
        stopSet = zenpack.loadBinaryData(stopSet)

        currentExistSet = {
            (userID, callingStationID): id
            for userID, callingStationID, id in AccountingLog.objects.values_list(
                "userid", "calling_station_id", "id"
            )
        }

        deleteSet = set()
        for account in updateSet:
            try:
                del account["utime"]
            except:
                pass
            key = (account["userid"], account["calling_station_id"])
            if key in currentExistSet:
                deleteSet.add(currentExistSet[key])

        for account in stopSet:
            key = (account["userid"], account["calling_station_id"])
            if key in currentExistSet:
                deleteSet.add(currentExistSet[key])

        if deleteSet:
            AccountingLog.objects.filter(id__in=deleteSet).delete()

        if updateSet:
            AccountingLog.objects.bulk_create(
                AccountingLog(**account) for account in updateSet
            )

        if stopSet:
            AccountedLog.objects.bulk_create(
                AccountedLog(**account) for account in stopSet
            )
    except Exception as e:
        import traceback

        traceback.print_exc(file=open("/tmp/error.txt", "at"))

    return True


# EOF
