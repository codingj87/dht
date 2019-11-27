import time

from django.utils.decorators import method_decorator
from pandas.io import json

from control.deco import json_encode
# from control.models import Domain
# from control.serializers import DomainListSerializer, DomainDetailSerializer
from control.util import get_query, change_from_ip_to_domain
from lib.view import View


class DomainView(View):
    def __init__(self):
        self.fields = [f.name for f in Domain._meta.fields]

    @method_decorator(json_encode)
    def list_up(self, request):
        q, start, limit = get_query(request.POST, self.fields, "mtime")

        is_reverse = request.POST.get("is_reverse")

        q["is_reverse"] = is_reverse == "true"

        queryset = Domain.objects.filter(**q)

        if start and limit:
            start, limit = int(start), int(limit)
            queryset = queryset[start : start + limit]

        serializer = DomainListSerializer(
            queryset, many=True, context={"request": request}
        )

        return {"success": True, "data": serializer.data}

    @method_decorator(json_encode)
    def create(self, request):
        params = json.loads(request.body.decode("utf-8"))

        data_of_soa = params.get("dataOfSOA")
        data_of_record = params.get("dataOfRecord")

        if data_of_soa.get("ip"):
            data_of_soa["is_reverse"] = True
            data_of_soa["domain"] = change_from_ip_to_domain(data_of_soa["ip"])
            del data_of_soa["ip"]

        try:
            Domain.objects.create(record=data_of_record, **data_of_soa)
        except Exception as e:
            return {"success": False, "errMsg": str(e)}
        return {"success": True}

    @method_decorator(json_encode)
    def update(self, request):
        params = json.loads(request.body.decode("utf-8"))

        pk = params.get("id")
        data_of_soa = params.get("dataOfSOA")
        data_of_record = params.get("dataOfRecord")

        now = int(time.time())
        try:
            Domain.objects.filter(pk=pk).update(
                mtime=now, record=data_of_record, **data_of_soa
            )
        except Exception as e:
            return {"success": False, "errMsg": str(e)}
        return {"success": True}

    @method_decorator(json_encode)
    def delete(self, request):
        pk = request.POST.get("id")

        try:
            query = Domain.objects.get(pk=pk)
        except Domain.DoesNotExist:
            return {"success": False, "errMsg": "이미 삭제된 도메인 입니다."}

        query.delete()
        return {"success": True}

    @method_decorator(json_encode)
    def read(self, request):
        pk = request.POST.get("id")

        try:
            query = Domain.objects.get(pk=pk)
        except Domain.DoesNotExist:
            return {"success": False, "errMsg": "존재하지 않는 도메인 입니다."}

        serializer = DomainDetailSerializer(
            query, context={"request": request}
        )

        return {"success": True, "data": serializer.data}
