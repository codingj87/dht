# -*- coding: utf-8 -*-
import time
from django.utils.decorators import method_decorator

from zen.common import timeutil
from lib import dynamic_event_log
from lib.excellib import Excel
from lib.view import View
from ..deco import json_encode
from ..util import streaming_http_response


class SystemLogView(View):
    @method_decorator(json_encode)
    def list_up(self, request):
        return self._list_up(request)

    def _list_up(self, request):
        start_date = request.POST.get("sdate")
        end_date = request.POST.get("edate")
        ip = request.POST.get("ip")
        log_type = request.POST.get("type")

        excel = request.POST.get("excel")
        start = request.POST.get("start")
        limit = request.POST.get("limit")
        if (not excel) and limit:
            start = int(start)
            limit = int(limit)
        else:
            start = limit = None

        options = {}
        if ip:
            options["svr_ip__icontains"] = ip
        if log_type:
            options["severity_level__icontains"] = int(log_type)

        total_count, query_set_list = self.get_tables(
            start_date, end_date, **options
        )
        if len(query_set_list) > 0:
            first_query_set = query_set_list.pop()
            rs = first_query_set.union(*query_set_list, all=True).order_by(
                "-ctime"
            )
            if limit:
                rs = rs[start : start + limit]

            return {
                "success": True,
                "data": [
                    {
                        "svr_ip": r.svr_ip,
                        "time": timeutil.getHumanTimeFromUnixTime(r.ctime),
                        "level": r.severity_level,
                        "message": r.msg[:200],
                        "type": r.severity_level == 40 and "error" or "normal",
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
            "시스템 로그",
            [
                ("생성 시간", "time", 200),
                ("서버 IP", "svr_ip", 150),
                ("레벨", "level", 100),
                ("메시지", "message", 1000),
                ("유형", "type", 150),
            ],
            data,
        )
        buf, file_type = excel.save()
        return streaming_http_response(
            request, mode, "시스템 로그 " + now, buf, file_type
        )

    @classmethod
    def get_tables(cls, start, end, **options):
        start = timeutil.getUnixTimeFromHumanTime(start, "%Y-%m-%d")
        end = timeutil.getUnixTimeFromHumanTime(end, "%Y-%m-%d")
        tables = []

        while 1:
            tables.append(timeutil.getHumanTimeFromUnixTime(start, "%Y%m%d"))
            if start >= end:
                break
            start += 86400

        tables.reverse()

        ret = []
        total_count = 0
        for table in tables:
            query_set = dynamic_event_log.get_log_model(table).objects.filter(
                **options
            )
            ret.append(query_set)
            total_count += query_set.count()

        return total_count, ret


# EOF
