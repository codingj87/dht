# -*- coding: utf-8 -*-
import time
from django.utils.decorators import method_decorator

from zen.common import timeutil
from lib.view import View
from ..deco import json_encode
# from ..models import JobHistory
from ..rpc import createSharedNetwork, deleteSharedNetwork, updateSharedNetwork


class WorkLogView(View):
    @method_decorator(json_encode)
    def list_up(self, request):
        start_date = request.POST.get("sdate")
        end_date = request.POST.get("edate")

        start = request.POST.get("start")
        limit = request.POST.get("limit")
        if limit:
            start = int(start)
            limit = int(limit)
        else:
            start = limit = None

        if start_date:
            start_date = timeutil.getUnixTimeFromHumanTime(
                start_date, "%Y-%m-%d"
            )
        if end_date:
            end_date = (
                timeutil.getUnixTimeFromHumanTime(end_date, "%Y-%m-%d") + 86400
            )

        rs = (
            JobHistory.objects.filter(
                ctime__gte=start_date, ctime__lte=end_date
            )
            .order_by("-ctime")
            .values_list(
                "userid",
                "type",
                "before_cfg",
                "after_cfg",
                "is_rollback",
                "shared_network",
                "ctime",
                "id",
            )
        )

        total_count = rs.count()
        if limit:
            rs = rs[start : start + limit]

        return {
            "success": True,
            "data": [
                {
                    "worker": r[0],
                    "work_type": r[1],
                    "display_before_work": r[2] and r[2].splitlines() or r[2],
                    "display_after_work": r[3] and r[3].splitlines() or r[3],
                    "before_work": r[2],
                    "after_work": r[3],
                    "is_rollback": r[4] and "적용" or "미적용",
                    "shared_network": r[5],
                    "time": timeutil.getHumanTimeFromUnixTime(r[6]),
                    "id": r[7],
                }
                for r in rs
            ],
            "totalCount": total_count,
        }

    @method_decorator(json_encode)
    def rollback(self, request):
        user_id = request.POST.get("worker")
        work_type = request.POST.get("work_type")
        before_work = request.POST.get("before_work")
        shared_network = request.POST.get("shared_network")
        work_id = request.POST.get("id")

        try:
            if work_type == "create":
                deleteSharedNetwork(shared_network, user_id)
            elif work_type == "update":
                updateSharedNetwork(shared_network, before_work, user_id)
            else:
                createSharedNetwork(shared_network, before_work, user_id)
        except:
            return {"success": False, "errmsg": "네트워크 접속 이상"}
        else:
            job_history = JobHistory.objects.get(id=work_id)
            job_history.mtime = int(time.time())
            job_history.is_rollback = 1
            job_history.save()
            return {"success": True}


# EOF
