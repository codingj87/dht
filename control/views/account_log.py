# -*- coding: utf-8 -*-
import time
from lib.view import View
# from ..models import AccountedLog, AccountingLog
from django.utils.decorators import method_decorator
from ..deco import json_encode
from itertools import chain
from zen.common import timeutil
from lib.excellib import Excel
from ..util import get_query, streaming_http_response


class ListAccountLogSearchView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.accounting_fields = {f.name for f in AccountingLog._meta.fields}
        self.accounted_fields = {f.name for f in AccountedLog._meta.fields}

    @method_decorator(json_encode)
    def list(self, request):
        return self._list(request)

    def _list(self, request):
        account_status = request.POST.get('account_status')

        if account_status == "Accounting":
            accounting_q, start, limit = get_query(request.POST, self.accounting_fields)
            rs = AccountingLog.objects.filter(**accounting_q).values()
        elif account_status == "Accounted":
            accounted_q, start, limit = get_query(request.POST, self.accounted_fields)
            rs = AccountedLog.objects.filter(**accounted_q).values()
        else:
            accounting_q, start, limit = get_query(request.POST, self.accounting_fields)
            accounted_q, _, _ = get_query(request.POST, self.accounted_fields)

            accounting_queryset = AccountingLog.objects.filter(**accounting_q).values()
            accounted_queryset = AccountedLog.objects.filter(**accounted_q).values()

            rs = list(chain(accounting_queryset, accounted_queryset))
            rs = sorted(rs, key=lambda k: k['ctime'], reverse=False)

        rs = rs[start:start + limit]

        data = [
            {
                "userid": r["userid"],
                "calling_station_id": r["calling_station_id"],
                "nas_ip": r["nas_ip"],
                "status_type": r["status_type"],
                "output_octets": r["output_octets"],
                "input_octets": r["input_octets"],
                "output_packets": r["output_packets"],
                "input_packets": r["input_packets"],
                "session_time": r["session_time"],
                "terminate_cause": r["terminate_cause"] if "terminate_cause" in r else "",
                'ctime': timeutil.getHumanTimeFromUnixTime(r["ctime"])
            } for r in rs
        ]

        return {
            "success": True,
            "totalCount": len(data),
            "data": data
        }

    def excel(self, request):
        mode = request.POST.get("mode")
        excel = Excel()

        data = self._list(request).get("data")
        excel.add_sheet(
            "account_log",
            [
                ("userid", "userid", 200),
                ("calling_station_id", "calling_station_id", 200),
                ("nas_ip", "nas_ip", 200),
                ("status_type", "status_type", 200),
                ("output_octets", "output_octets", 200),
                ("input_octets", "input_octets", 200),
                ("output_packets", "output_packets", 200),
                ("input_packets", "input_packets", 200),
                ("session_time", "session_time", 200),
                ("terminate_cause", "terminate_cause", 200),
                ("ctime", "ctime", 200),
            ],
            data,
        )
        buf, file_type = excel.save()
        return streaming_http_response(
            request,
            mode,
            time.strftime("account_log %Y-%m-%d %H%M%S"),
            buf,
            file_type,
        )