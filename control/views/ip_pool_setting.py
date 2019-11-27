# -*- coding: utf-8 -*-
import io, time, ipaddress
from pandas.io import json
from django.utils.decorators import method_decorator

from zen.common import iputil
from zen.ipms.dhcpv4.ipmanager.parser import SubnetConfig
from lib.excellib import Excel
from lib.view import View
from ..deco import json_encode
from ..config import template_path
from ..rpc import createSharedNetwork, updateSharedNetwork, deleteSharedNetwork
from ..util import streaming_http_response, get_rpc_list, get_cluster_ip
# from ..models import Config, DHCPTemplate


class IPPoolSettingView(View):
    @method_decorator(json_encode)
    def list_up(self, request):
        try:
            totalCount, data = self._list_up(request)
        except Exception as e:
            ret = {"success": False, "errmsg": str(e)}
        else:
            ret = {"success": True, "data": data, "totalCount": totalCount}
        return ret

    def _list_up(self, request):
        cluster_id = request.session.get("cluster_id")
        share_network = request.POST.get("shared_network")
        subnet = request.POST.get("subnet") or None
        usage_class = request.POST.get("class")

        start = request.POST.get("start")
        limit = request.POST.get("limit")
        if limit:
            start = int(start)
            limit = int(limit)
        else:
            start = limit = None

        for rpc in get_rpc_list(
            get_cluster_ip(cluster_id), "dhcpv4_ipmanager"
        ):
            try:
                shared_network_list = rpc.show_sharednetwork_list(subnet)
            except:
                pass
            else:
                active_rpc = rpc
                break
        else:
            raise Exception("현재 구동중인 DHCP 서버가 존재하지 않습니다")

        data_list = []
        for sharedNetworkName in shared_network_list:
            config = active_rpc.read_sharednetwork_config(sharedNetworkName)
            subnet_config = SubnetConfig(config)
            sharedNetworkNameByDesc, scopeInfo = subnet_config.get(
                sharedNetworkName
            )

            data = []
            for subnet, value in scopeInfo.items():
                subnet, net_mask = subnet.split("/")
                for ipRange, option in value.items():
                    if "=" in ipRange:
                        _type = "manual"
                        ipRange = ipRange.split(";")[0]
                        mac, rangeStart = ipRange.split("=")
                        rangeEnd = mac
                        _class = "default"
                    else:
                        _type = "dynamic"
                        mac = ""
                        ipRange, _class = ipRange.split(";")
                        _class = _class.strip() or "default"
                        rangeStart, rangeEnd = ipRange.split("-")

                    data.append(
                        {
                            "subnet": subnet,
                            "net_mask": net_mask,
                            "type": _type,
                            "mac": mac,
                            "range_start": rangeStart,
                            "range_end": rangeEnd,
                            "class": _class,
                            "router": option["opt3"],
                            "domain_name_servers": option.get("opt6", ""),
                            "dhcp_lease_time": option.get("opt51", ""),
                        }
                    )

            subnet_data = {
                key: "<br>".join(item[key] for item in data) for key in data[0]
            }

            share_network_data = {
                "shared_network": sharedNetworkName,
                "shared_network_name": sharedNetworkNameByDesc,
            }

            subnet_data.update(share_network_data)
            data_list.append(subnet_data)

        if share_network:
            data_list = list(
                filter(
                    lambda x: share_network in x["shared_network"], data_list
                )
            )

        if usage_class:
            data_list = list(
                filter(lambda x: usage_class in x["class"], data_list)
            )

        totalCount = len(data_list)
        if start is not None:
            data_list = data_list[start : start + limit]
        return (totalCount, sorted(data_list, key=lambda x: len(x["class"])))

    def excel(self, request):
        mode = request.POST.get("mode")
        excel = Excel()

        totalCount, data = self._list_up(request)
        excel.add_sheet(
            "IP 풀 설정",
            [
                ("Name", "shared_network_name", 350),
                ("Shared Network", "shared_network", 250),
                ("Type", "type", 200),
                ("Class", "class", 200),
                ("Range Start", "range_start", 250),
                ("Range End", "range_end", 250),
            ],
            data,
        )
        buf, file_type = excel.save()
        return streaming_http_response(
            request,
            mode,
            time.strftime("IP 풀 설정 %Y-%m-%d %H%M%S"),
            buf,
            file_type,
        )

    @method_decorator(json_encode)
    def create_config(self, request):
        # [{"subnet":"2.1.0.0","net_mask":"255.255.0.0","router":"2.1.1.1","option":[
        #   {"type":"dynamic","range_start":"2.1.1.2","range_end":"2.1.1.255","class":"","mac":""},
        #   {"type":"dynamic","range_start":"2.1.2.0","range_end":"2.1.2.255","class":"","mac":""},
        #   {"type":"dynamic","range_start":"2.1.3.0","range_end":"2.1.3.255","class":"","mac":""},
        #   {"type":"dynamic","range_start":"2.1.4.0","range_end":"2.1.4.254","class":"","mac":""},
        #   {"type":"dynamic","range_start":"2.1.5.0","range_end":"2.1.5.255","class":"","mac":""},
        #   {"type":"dynamic","range_start":"2.1.6.0","range_end":"2.1.6.255","class":"","mac":""}
        # ]}]
        shared_network = request.POST.get("shared_network")
        params = json.loads(request.POST.get("params"))
        update = request.POST.get("update")
        user_id = request.session.get("userid")
        cluster_id = request.session.get("cluster_id")

        subnet_prefix, *content, subnet_suffix = (
            io.open(template_path, "rt", encoding="utf8").read().splitlines()
        )
        option_template = "\n".join(content)
        temp_config_template2 = []
        macSet = set()
        for item in params:
            # if item.get("template"):
            #     template_pk = int(item["template"])
            #     query = DHCPTemplate.objects.get(pk=template_pk)
            #     subnet_prefix, *content, subnet_suffix = (
            #         query.template.splitlines()
            #     )
            #     option_template = "\n".join(content)
            temp_option = [subnet_prefix]
            optionList = []
            previousOption = None
            for option in item["option"]:
                if option["type"] == "manual":
                    if previousOption:
                        optionList.append(previousOption)
                        previousOption = None
                    optionList.append(option)
                elif not previousOption:
                    previousOption = option
                elif (
                    previousOption["class"] != option["class"]
                    or previousOption["dhcp_lease_time"]
                    != option["dhcp_lease_time"]
                    or previousOption["domain_name_servers"]
                    != option["domain_name_servers"]
                ):
                    optionList.append(previousOption)
                    previousOption = option
                elif (
                    iputil.ip2int(previousOption["range_end"]) + 1
                ) == iputil.ip2int(option["range_start"]):
                    previousOption["range_end"] = option["range_end"]
                else:
                    optionList.append(previousOption)
                    previousOption = option

            if previousOption:
                optionList.append(previousOption)
            for option in optionList:
                option["net_mask"] = item["net_mask"]
                option["router"] = item["router"]
                if option["type"] == "manual":
                    mac = option["mac"]
                    if mac in macSet:
                        return {
                            "success": False,
                            "errmsg": f"MAC주소는 하나의 IP 주소에만 지정될 수 있습니다.\r\n{mac}주소가 여러 IP에 지정되어 있습니다. ",
                        }

                    macSet.add(mac)
                    option_without_domain = option_template.replace(
                        "dynamic-dht range %(range_start)s %(range_end)s class %(class)s",
                        "manual-dht %(mac)s %(range_end)s",
                    )
                    temp_option.append(option_without_domain % option)
                else:
                    _class = option["class"].strip()
                    if not _class:
                        option["class"] = ""
                        option_without_class = option_template.replace(
                            " class ", ""
                        )
                        temp_option.append(option_without_class % option)
                    else:
                        option["class"] = f'"{_class}"'
                        temp_option.append(option_template % option)

            temp_option.append(subnet_suffix)
            temp_config_template = "\n".join(temp_option)
            temp_config_template2.append(
                temp_config_template % item
            )  # (item['subnet'], item['net_mask']))

        config_template = "shared-network %s {\n%s\n}" % (
            shared_network,
            "\n".join(temp_config_template2),
        )
        for rpc in get_rpc_list(
            get_cluster_ip(cluster_id), "dhcpv4_ipmanager"
        ):
            try:
                shared_network_list = rpc.show_sharednetwork_list()
            except:
                pass
            else:
                active_rpc = rpc
                break

        else:
            return {"success": False, "errmsg": "현재 구동중인 DHCP 서버가 존재하지 않습니다"}

        before = "\n".join(
            active_rpc.read_sharednetwork_config(shared_network)
            for shared_network in shared_network_list
        )

        if update == "false":
            data = createSharedNetwork(
                shared_network, config_template, user_id
            )
        else:
            data = updateSharedNetwork(
                shared_network, config_template, user_id
            )

        after = "\n".join(
            active_rpc.read_sharednetwork_config(shared_network)
            for shared_network in shared_network_list
        )
        if "ok" not in data:
            return {"success": False, "errmsg": data}

        Config.objects.create(
            subject="dhcpd.conf",
            before=before,
            after=after,
            size=len(after),
            ctime=int(time.time()),
        )
        return {"success": True, "data": data}

    @method_decorator(json_encode)
    def delete_config(self, request):
        shared_network_name = request.POST.get("shared_network")
        user_id = request.session.get("userid")
        cluster_id = request.session.get("cluster_id")

        for rpc in get_rpc_list(
            get_cluster_ip(cluster_id), "dhcpv4_ipmanager"
        ):
            try:
                shared_network_list = rpc.show_sharednetwork_list()
            except:
                pass
            else:
                active_rpc = rpc
                break
        else:
            return {"success": False, "errmsg": "현재 구동중인 DHCP 서버가 존재하지 않습니다"}

        before = "\n".join(
            active_rpc.read_sharednetwork_config(shared_network)
            for shared_network in shared_network_list
        )

        deleteSharedNetwork(shared_network_name, user_id)

        after = "\n".join(
            active_rpc.read_sharednetwork_config(shared_network)
            for shared_network in shared_network_list
        )

        Config.objects.create(
            subject="dhcpd.conf",
            before=before,
            after=after,
            size=len(after),
            ctime=int(time.time()),
        )
        return {"success": True}

    @method_decorator(json_encode)
    def read_config(self, request):
        shared_network = request.POST.get("shared_network")
        cluster_id = request.session.get("cluster_id")
        for rpc in get_rpc_list(
            get_cluster_ip(cluster_id), "dhcpv4_ipmanager"
        ):
            try:
                config = rpc.read_sharednetwork_config(shared_network)
            except:
                pass
            else:
                break
        else:
            return {"success": False, "errmsg": "현재 구동중인 DHCP 서버가 존재하지 않습니다"}
        subnet_config = SubnetConfig(config)
        description, subnetInfo = subnet_config.get(shared_network)
        data = []
        for key, value in subnetInfo.items():
            option = []
            router = ""
            ip, netMask = key.split("/", 1)
            for k, v in value.items():
                k, _class = k.split(";")
                router = v.get("opt3", "")
                domain_name_servers = v.get("opt6", "")
                dhcp_lease_time = v.get("opt51", "")
                if "=" in k:
                    mac, ip = k.split("=")
                    option.append(
                        {
                            "type": "manual",
                            "range_start": ip,
                            "range_end": ip,
                            "class": _class,
                            "domain_name_servers": domain_name_servers,
                            "dhcp_lease_time": dhcp_lease_time,
                            "mac": mac,
                        }
                    )
                else:
                    rangeStart, rangeEnd = k.split("-")
                    # 만약 C-class에 걸쳐있다면 c-class 별로 나누기를 한다
                    _start, _end = (rangeStart.split("."), rangeEnd.split("."))
                    if _start[:3] == _end[:3]:
                        option.append(
                            {
                                "type": "dynamic",
                                "range_start": rangeStart,
                                "range_end": rangeEnd,
                                "class": _class,
                                "domain_name_servers": domain_name_servers,
                                "dhcp_lease_time": dhcp_lease_time,
                                "mac": "",
                            }
                        )
                    else:
                        intStart, intEnd = (
                            iputil.ip2int(rangeStart),
                            iputil.ip2int(rangeEnd),
                        )
                        boundaryIP = (intStart // 256 * 256) + 256
                        option.append(
                            {
                                "type": "dynamic",
                                "range_start": rangeStart,
                                "range_end": iputil.int2ip(boundaryIP - 1),
                                "class": _class,
                                "domain_name_servers": domain_name_servers,
                                "dhcp_lease_time": dhcp_lease_time,
                                "mac": "",
                            }
                        )
                        for boundaryIP in range(boundaryIP, intEnd - 255, 256):
                            option.append(
                                {
                                    "type": "dynamic",
                                    "range_start": iputil.int2ip(boundaryIP),
                                    "range_end": iputil.int2ip(
                                        boundaryIP + 255
                                    ),
                                    "class": _class,
                                    "domain_name_servers": domain_name_servers,
                                    "dhcp_lease_time": dhcp_lease_time,
                                    "mac": "",
                                }
                            )

                        option.append(
                            {
                                "type": "dynamic",
                                "range_start": iputil.int2ip(
                                    intEnd // 256 * 256
                                ),
                                "range_end": rangeEnd,
                                "class": _class,
                                "domain_name_servers": domain_name_servers,
                                "dhcp_lease_time": dhcp_lease_time,
                                "mac": "",
                            }
                        )

            data.append(
                {
                    "subnet": ip,
                    "net_mask": netMask,
                    "router": router,
                    "option": option,
                }
            )
        return {
            "success": True,
            "data": data,
            "shared_network": shared_network,
        }

    @method_decorator(json_encode)
    def write_subnet(self, request):
        try:
            subnet = request.POST.get("subnet")
            net_mask = SubnetConfig.netmaskMap[request.POST.get("net_mask")]
            ip = ipaddress.IPv4Network(
                "{subnet}/{net_mask}".format(subnet=subnet, net_mask=net_mask),
                strict=False,
            )
        except Exception as e:
            return {"success": False, "errMsg": str(e)}
        return {"success": True, "ip": str(ip.network_address)}

    @method_decorator(json_encode)
    def get_broadcast_address(self, request):
        try:
            ip = request.POST.get("ip")
            mask = request.POST.get("mask")
            net = ipaddress.IPv4Network(f"{ip}/{mask}", False)
        except Exception as e:
            return {"success": False, "errMsg": str(e)}
        return {"success": True, "data": str(net.broadcast_address)}

    @method_decorator(json_encode)
    def get_is_valid_router_ip(self, request):
        try:
            start = ipaddress.IPv4Address(request.POST.get("start"))
            ip = ipaddress.IPv4Address(request.POST.get("ip"))
            end = ipaddress.IPv4Address(request.POST.get("end"))

        except Exception as e:
            return {"success": False, "errMsg": str(e)}
        return {"success": True, "data": start < ip < end}


# EOF
