# -*- coding: utf-8 -*-
import time
from django.utils.decorators import method_decorator
from django.db.models import Q

from zen.common import timeutil
from lib import dynamicDHCPLog
from lib.excellib import Excel
from lib.view import View
from ..deco import json_encode
from ..util import streaming_http_response


class IPLogView(View):
    @method_decorator(json_encode)
    def list_up(self, request):
        return self._list_up(request)

    def _list_up(self, request):
        start_date = request.POST.get("sdate")
        end_date = request.POST.get("edate")
        type_ = request.POST.get("type")
        vendor_class = request.POST.get("vendor_class")
        hostname = request.POST.get("hostname")
        ip = request.POST.get("ip")
        mac = request.POST.get("mac")
        excel = request.POST.get("excel")
        limit = request.POST.get("limit")
        start = request.POST.get("start")

        filters = Q()
        if type_:
            filters &= Q(type=type_)
        if ip:
            filters &= Q(yiaddr__startswith=ip) | Q(ciaddr__startswith=ip)
        if mac:
            mac = "".join(x for x in mac.lower() if x in "0123456789abcdef")
            if mac:
                filters &= Q(chaddr__contains=mac)
        if vendor_class:
            filters &= Q(vendor_class__icontains=vendor_class)
        if hostname:
            filters &= Q(hostname__icontains=hostname)

        total_count, query_set_list = self.get_tables(
            start_date, end_date, filters
        )
        if len(query_set_list) > 0:
            first_query_set = query_set_list.pop()
            rs = first_query_set.union(*query_set_list, all=True).order_by(
                "-ctime", "-id"
            )
            if (not excel) and limit:
                start = int(start)
                limit = int(limit)
                rs = rs[start : start + limit]

            return {
                "success": True,
                "data": [
                    {
                        "ip": r.svr_ip,
                        "time": timeutil.getHumanTimeFromUnixTime(r.ctime),
                        "ci": r.ciaddr,
                        "mac": ":".join(
                            [
                                r.chaddr[i : i + 2]
                                for i in range(0, len(r.chaddr), 2)
                            ]
                        ),
                        "yi": r.yiaddr,
                        "vendor_class": r.vendorclass,
                        "hostname": r.hostname,
                        "type": r.type,
                    }
                    for r in rs
                ],
                "totalCount": total_count,
            }

        return {"success": True, "data": [], "totalCount": 0}

    def excel(self, request):
        mode = request.POST.get("mode")
        excel = Excel()

        data = self._list_up(request)["data"]
        now = time.strftime("%Y-%m-%d %H%M%S")
        excel.add_sheet(
            "IP 할당 로그",
            [
                ("요청 시간", "time", 200),
                ("유형", "type", 150),
                ("Client IP", "ci", 200),
                ("MAC 주소", "mac", 200),
                ("Your IP", "yi", 200),
                ("벤더 클래스", "vendor_class", 200),
                ("Host name", "hostname", 250),
                ("서버 IP", "ip", 200),
            ],
            data,
        )
        buf, file_type = excel.save()
        return streaming_http_response(
            request, mode, "IP 할당 로그 %s" % now, buf, file_type
        )

    @classmethod
    def get_tables(cls, start, end, options):
        start = timeutil.getUnixTimeFromHumanTime(
            start, "%Y-%m-%d"
        )  # 2018-08-05
        end = timeutil.getUnixTimeFromHumanTime(end, "%Y-%m-%d")  # 2018-08-10

        tables = [
            timeutil.getHumanTimeFromUnixTime(date, "%Y%m%d")
            for date in range(start, end + 86399, 86400)
        ]
        tables.reverse()

        ret = []
        total_count = 0
        for table in tables:
            query_set = dynamicDHCPLog.getLogModel(table).objects.filter(
                options
            )
            total_count += query_set.count()
            ret.append(query_set)
        return total_count, ret


# EOF
