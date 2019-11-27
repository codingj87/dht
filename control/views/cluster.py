# -*- coding: utf-8 -*-
import time

from django.db import IntegrityError
from django.utils.decorators import method_decorator

from control.util import get_params
from lib.view import View
from ..deco import json_encode

# from ..models import Cluster


class ClusterView(View):
    def __init__(self):
        self.fields = {f.name for f in Cluster._meta.fields}

    @method_decorator(json_encode)
    def list_up(self, request):
        start = request.POST.get("start")
        limit = request.POST.get("limit")
        queryset = Cluster.objects.all()
        data = []

        if start and limit:
            start, limit = int(start), int(limit)
            queryset = queryset[start : start + limit]

        for query in queryset:
            params = get_params(query, self.fields)
            data.append(params)

        return {"success": True, "data": data}

    @method_decorator(json_encode)
    def read(self, request):
        pk = request.POST.get("pk")

        try:
            query = Cluster.objects.get(pk=pk)
        except Cluster.DoesNotExist:
            return {"success": False, "errMsg": "해당 클러스터가 없습니다."}

        params = get_params(query, self.fields)

        return {"success": True, "data": params}

    @method_decorator(json_encode)
    def delete(self, request):
        pk = request.POST.get("pk")
        try:
            query = Cluster.objects.get(pk=pk)
        except Cluster.DoesNotExist:
            return {"success": False, "errMsg": "해당 클러스터가 없습니다."}
        query.delete()
        return {"success": True}

    @method_decorator(json_encode)
    def update(self, request):
        pk = request.POST.get("pk")

        try:
            query = Cluster.objects.get(pk=pk)
        except Cluster.DoesNotExist:
            return {"success": False, "errMsg": "해당 클러스터가 없습니다."}

        query.mtime = int(time.time())

        for key, value in request.POST.dict().items():
            if key in self.fields and key != "pk":
                query.__setattr__(key, value)

        query.save()
        return {"success": True}

    @method_decorator(json_encode)
    def create(self, request):
        params = request.POST.dict()

        try:
            Cluster.objects.create(
                **params, ctime=int(time.time()), mtime=int(time.time())
            )
        except IntegrityError:
            return {"success": False, "errMsg": "중복된 VIP가 있습니다."}

        return {"success": True}

    @method_decorator(json_encode)
    def register(self, request):
        pk = request.POST.get("pk")

        try:
            query = Cluster.objects.get(pk=pk)
        except Cluster.DoesNotExist:
            return {"success": False, "errMsg": "해당 클러스터가 없습니다."}

        request.session["cluster_id"] = query.id

        return {"success": True}


# EOF
