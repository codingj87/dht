# -*- coding: utf-8 -*-
from itertools import zip_longest

from django.http import HttpResponse
from django.utils.decorators import method_decorator

from zen.common import timeutil
from lib.view import View
from ..deco import json_encode
# from ..models import Config


class SettingManagementView(View):
    @method_decorator(json_encode)
    def list_up(self, request):
        return self._list_up(request)

    def _list_up(self, request):
        sdate = timeutil.getUnixTimeFromHumanTime(
            request.POST.get("sdate"), "%Y-%m-%d"
        )
        edate = (
            timeutil.getUnixTimeFromHumanTime(
                request.POST.get("edate"), "%Y-%m-%d"
            )
            + 86400
        )
        excel = request.POST.get("excel")
        start = request.POST.get("start")
        limit = request.POST.get("limit")
        if (not excel) and limit:
            start = int(start)
            limit = int(limit)
        else:
            start = limit = None

        rs = (
            Config.objects.filter(ctime__gte=sdate, ctime__lte=edate)
            .order_by("-ctime")
            .values_list("id", "subject", "size", "ctime")
        )
        totalCount = rs.count()
        if limit:
            rs = rs[start : start + limit]
        return {
            "success": True,
            "data": [
                {
                    "id": id_,
                    "name": subject,
                    "size": size,
                    "m_time": timeutil.getHumanTimeFromUnixTime(ctime),
                }
                for id_, subject, size, ctime in rs
            ],
            "totalCount": totalCount,
            "request": request,
        }

    def download_config(self, request):
        id_ = request.POST.get("id")
        config = Config.objects.get(id=id_)
        after = config.after
        ctime = config.ctime
        response = HttpResponse(after, content_type="text/plain")
        response[
            "Content-Disposition"
        ] = f'attachment; filename="dhcpd{ctime}.conf"'
        return response

    @method_decorator(json_encode)
    def compare_config(self, request):
        id_ = request.POST.get("id")
        config = Config.objects.get(id=id_)
        after = config.after.splitlines()
        before = config.before.splitlines()
        size = config.size
        emphasis_after = "\n".join(
            item for item in self.compare(after, before)
        )

        return {
            "success": True,
            "data": {
                "after": emphasis_after.replace("None", ""),
                "before": "\n".join(before),
                "size": size,
            },
        }

    def compare(self, after, before):
        for a, b in zip_longest(after, before):
            if a != b:
                yield f"{a}"
            else:
                yield a


# EOF
