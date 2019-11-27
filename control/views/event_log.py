# -*- coding: utf-8 -*-
from django.utils.decorators import method_decorator

from zen.common import timeutil
from lib import dynamic_event_log
from lib.view import View
from ..deco import json_encode


class EventLogView(View):
    @method_decorator(json_encode)
    def list_up(self, request):
        start_date = request.POST.get("sdate")
        end_date = request.POST.get("edate")
        start = request.POST.get("start")
        if start:
            start = int(start)
            limit = int(request.POST.get("limit") or 20)
        else:
            start = limit = None

        total_count, query_set_list = self.get_tables(start_date, end_date)
        if len(query_set_list) > 0:
            first_query_set = query_set_list.pop()
            rs = first_query_set.union(*query_set_list, all=True).order_by(
                "-ctime"
            )
            return {
                "success": True,
                "data": [
                    {
                        "svr_ip": r.svr_ip,
                        "ctime": timeutil.getHumanTimeFromUnixTime(r.ctime),
                        "type": r.severity_level == 40 and "error" or "normal",
                        "msg": r.msg[:200],
                    }
                    for r in rs[start : start + limit]
                ],
                "totalCount": total_count,
            }

        return {"success": True, "data": [], "totalCount": 0}

    @classmethod
    def get_tables(cls, start, end):
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
            query_set = dynamic_event_log.get_log_model(table).objects.filter()
            ret.append(query_set)
            total_count += query_set.count()

        return total_count, ret


# EOF
