# -*- coding: utf-8 -*-
import time
from django.db.models import Q
from django.utils.decorators import method_decorator

from lib.excellib import Excel
from lib.view import View
from .. import serializers
# from ..models import AuthLog
from ..deco import json_encode
from ..util import streaming_http_response, get_query, make_mac_form


class ListLogSearchView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.fields = {f.name for f in AuthLog._meta.fields}

    @method_decorator(json_encode)
    def list(self, request):
        return self._list(request)

    def _list(self, request):
        try:
            q, start, limit = get_query(request.POST, self.fields)

            if "packet_type__icontains" in q and q["packet_type__icontains"] == "*":
                del q["packet_type__icontains"]
            if "response__icontains" in q and q["response__icontains"] == "*":
                del q["response__icontains"]

            queryset = AuthLog.objects.filter(**q)
            packet_type_condition = Q(packet_type="Accounting-On") | Q(packet_type="Accounting-Off")

            certification_type = request.POST.get("certification_type")
            if certification_type == "equipment":
                queryset = queryset.filter(packet_type_condition)
            elif certification_type == "user":
                queryset = queryset.exclude(packet_type_condition)

            mac = request.POST.get("mac")
            if mac:
                mac = "".join(c for c in mac.lower() if c in "0123456789abcdef")
                queryset = queryset.filter(
                    Q(supplicant__icontains=mac) | Q(emhs_mac__icontains=mac)
                )

            queryset = queryset.order_by("-ctime")
            total_count = queryset.count()
            if start or limit:
                queryset = queryset[start : start + limit]

            serializer = serializers.ListLogSearchSerializer(
                queryset, many=True, context={"request": request}
            )

            for data in serializer.data:
                if data["supplicant"]:
                    data["supplicant"] = make_mac_form(data["supplicant"])
                if data["emhs_mac"]:
                    data["emhs_mac"] = make_mac_form(data["emhs_mac"])

            return {
                "success": True,
                "data": serializer.data,
                "totalCount": total_count,
            }
        except Exception as e:
            return {"success": False, "errMsg": str(e)}

    def excel(self, request):
        mode = request.POST.get("mode")
        excel = Excel()

        data = self._list(request).get("data")
        excel.add_sheet(
            "인증 이력",
            [
                ("요청 시간", "ctime", 200),
                ("요청 유형", "packet_type", 200),
                ("응답 유형", "response", 200),
                ("NAS", "emhs", 200),
                # ("5G Router MAC", "emhs_mac", 200),
                ("NAS IP", "ip", 200),
                ("사용자 MAC", "supplicant", 200),
            ],
            data,
        )
        buf, file_type = excel.save()
        return streaming_http_response(
            request,
            mode,
            time.strftime("인증 이력 %Y-%m-%d %H%M%S"),
            buf,
            file_type,
        )

    @method_decorator(json_encode)
    def log_reset(self, request):
        try:
            AuthLog.objects.all().delete()
        except Exception as e:
            return {"success": False, "errMsg": str(e)}
        else:
            return self._list(request)


# EOF
