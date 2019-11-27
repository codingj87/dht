import time

from django.utils.decorators import method_decorator
from pandas.io import json

from control.deco import json_encode
# from control.models import CacheDomain, Domain
# from control.serializers import CacheDomainSerializer
from control.util import get_query
from lib.view import View


class CacheDomainView(View):
    def __init__(self):
        self.fields = [f.name for f in CacheDomain._meta.fields]

    @method_decorator(json_encode)
    def list_up(self, request):
        q, start, limit = get_query(request.POST, self.fields, "mtime")

        queryset = CacheDomain.objects.filter(**q)

        if start and limit:
            start, limit = int(start), int(limit)
            queryset = queryset[start : start + limit]

        serializer = CacheDomainSerializer(
            queryset, many=True, context={"request": request}
        )

        return {"success": True, "data": serializer.data}

    @method_decorator(json_encode)
    def create(self, request):
        params = json.loads(request.body.decode("utf-8"))

        if Domain.objects.filter(domain=params["domain"]):
            return {"success": False, "errMsg": "이미 포워드 도메인에 동일한 도메인이 있습니다."}
        try:
            CacheDomain.objects.create(**params)
        except Exception as e:
            return {"success": False, "errMsg": str(e)}

        return {"success": True}

    @method_decorator(json_encode)
    def update(self, request):
        params = json.loads(request.body.decode("utf-8"))
        pk = params.get("id")
        del params["id"]

        now = int(time.time())
        try:
            CacheDomain.objects.filter(pk=pk).update(mtime=now, **params)
        except Exception as e:
            return {"success": False, "errMsg": str(e)}
        return {"success": True}

    @method_decorator(json_encode)
    def delete(self, request):
        pk = request.POST.get("id")

        try:
            query = CacheDomain.objects.get(pk=pk)
        except CacheDomain.DoesNotExist:
            return {"success": False, "errMsg": "이미 삭제된 도메인 입니다."}

        query.delete()
        return {"success": True}

    @method_decorator(json_encode)
    def read(self, request):
        pk = request.POST.get("id")

        try:
            query = CacheDomain.objects.get(pk=pk)
        except CacheDomain.DoesNotExist:
            return {"success": False, "errMsg": "존재하지 않는 도메인 입니다."}

        serializer = CacheDomainSerializer(query, context={"request": request})

        return {"success": True, "data": serializer.data}
