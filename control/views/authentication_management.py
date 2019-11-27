# -*- coding: utf-8 -*-
import time
from django.utils.decorators import method_decorator

from lib.excellib import Excel
from lib.view import View
from .. import serializers
# from ..models import NAS, NASType, Supplicant
from ..deco import json_encode
from ..util import streaming_http_response, get_query, get_data, make_mac_form


class ListNASTypeView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.fields = {f.name for f in NASType._meta.fields}

    @method_decorator(json_encode)
    def list(self, request):
        return self._list(request)

    def _list(self, request):
        try:
            q, start, limit = get_query(request.POST, self.fields)

            queryset = NASType.objects.filter(**q).order_by("mtime")

            total_count = queryset.count()
            if start or limit:
                queryset = queryset[start : start + limit]

            serializer = serializers.NASTypeSerializer(
                queryset, many=True, context={"request": request}
            )

            return {
                "success": True,
                "data": serializer.data,
                "totalCount": total_count,
            }
        except Exception as e:
            return {"success": False, "errMsg": str(e)}

    @method_decorator(json_encode)
    def create(self, request):
        data = get_data(request.POST, self.fields)
        NASType.objects.create(**data)

        return {"success": True}

    def excel(self, request):
        mode = request.POST.get("mode")
        excel = Excel()

        data = self._list(request).get("data")

        excel.add_sheet(
            "NAS Type 현황",
            [
                ("NAS Type", "type", 300),
                ("비고", "desc", 300),
                ("생성 시간", "ctime", 200),
                ("수정 시간", "mtime", 200),
            ],
            data,
        )
        buf, file_type = excel.save()
        return streaming_http_response(
            request,
            mode,
            time.strftime("NAS Type 등록 현황 %Y-%m-%d %H%M%S"),
            buf,
            file_type,
        )


class NASTypeView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.fields = {f.name for f in NASType._meta.fields}

    @method_decorator(json_encode)
    def read(self, request, pk):
        try:
            query = NASType.objects.get(pk=pk)
        except NASType.DoesNotExist:
            return {"success": False, "errMsg": "해당 NAS Type이 없습니다."}

        serializer = serializers.NASTypeSerializer(
            query, context={"request": request}
        )
        return {"success": True, "data": serializer.data}

    @method_decorator(json_encode)
    def update(self, request, pk):
        try:
            data = get_data(request.POST, self.fields)
            query = NASType.objects.get(pk=pk)
        except NASType.DoesNotExist:
            return {"success": False, "errMsg": "해당 NAS Type이 없습니다."}

        serializer = serializers.InputNASTypeSerializer(query, data=data)
        if serializer.is_valid():
            serializer.save()
            return {"success": True}
        else:
            return {"success": False, "errMsg": serializer.errors}

    @method_decorator(json_encode)
    def delete(self, request, pk):
        try:
            query = NASType.objects.get(pk=pk)
        except NASType.DoesNotExist:
            return {"success": False, "errMsg": "해당 NAS Type이 없습니다."}

        query.delete()
        return {"success": True}


class ListNASView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.fields = {f.name for f in NAS._meta.fields}

    @method_decorator(json_encode)
    def list(self, request):
        return self._list(request)

    def _list(self, request):
        try:
            q, start, limit = get_query(request.POST, self.fields)

            if "type__icontains" in q:
                q["type__type__icontains"] = q["type__icontains"]
                del q["type__icontains"]

            queryset = NAS.objects.filter(**q).order_by("mtime")

            total_count = queryset.count()
            if start or limit:
                queryset = queryset[start : start + limit]

            serializer = serializers.ListNASSerializer(
                queryset, many=True, context={"request": request}
            )
            return {
                "success": True,
                "data": serializer.data,
                "totalCount": total_count,
            }
        except Exception as e:
            return {"success": False, "errMsg": str(e)}

    @method_decorator(json_encode)
    def create(self, request):
        try:
            data = get_data(request.POST, self.fields)

            serializer = serializers.InputNASSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                return {"success": True}
            else:
                if "ip" in serializer.errors:
                    return {"success": False, "errMsg": "동일한 IP 값이 존재합니다."}
                return {"success": False, "errMsg": f"{serializer.errors}"}

        except Exception as e:
            return {"success": False, "errMsg": str(e)}

    def excel(self, request):
        mode = request.POST.get("mode")
        excel = Excel()

        data = self._list(request).get("data")

        excel.add_sheet(
            "NAS 현황",
            [
                ("NAS", "name", 250),
                ("NAS IP", "ip", 250),
                ("NAS type", "type", 250),
                ("비고", "desc", 250),
            ],
            data,
        )
        buf, file_type = excel.save()
        return streaming_http_response(
            request,
            mode,
            time.strftime("NAS 등록 현황 %Y-%m-%d %H%M%S"),
            buf,
            file_type,
        )


class NASView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.fields = {f.name for f in NAS._meta.fields}

    @method_decorator(json_encode)
    def read(self, request, pk):
        try:
            query = NAS.objects.get(pk=pk)
        except NAS.DoesNotExist:
            return {"success": False, "errMsg": "해당 NAS가 없습니다."}

        serializer = serializers.NASSerializer(
            query, context={"request": request}
        )
        return {"success": True, "data": serializer.data}

    @method_decorator(json_encode)
    def update(self, request, pk):
        try:
            data = get_data(request.POST, self.fields)
            query = NAS.objects.get(pk=pk)

        except NAS.DoesNotExist:
            return {"success": False, "errMsg": "해당 NAS가 없습니다."}

        serializer = serializers.InputNASSerializer(query, data=data)

        if serializer.is_valid():
            serializer.save()
            return {"success": True}
        else:
            if "ip" in serializer.errors:
                return {"success": False, "errMsg": "동일한 IP 값이 존재합니다."}
            return {"success": False, "errMsg": f"{serializer.errors}"}

    @method_decorator(json_encode)
    def delete(self, request, pk):
        try:
            query = NAS.objects.get(pk=pk)
        except NAS.DoesNotExist:
            return {"success": False, "errMsg": "해당 NAS가 없습니다."}

        query.delete()
        return {"success": True}


class ListSupplicantView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.fields = {f.name for f in Supplicant._meta.fields}

    @method_decorator(json_encode)
    def list(self, request):
        return self._list(request)

    def _list(self, request):
        try:
            q, start, limit = get_query(request.POST, self.fields)
            for k in "nas":
                if "nas__icontains" in q:
                    q["nas__name__icontains"] = q["nas__icontains"]
                    del q["nas__icontains"]

            if "mac__icontains" in q and "-" in str(q["mac__icontains"]):
                q["mac__icontains"] = q["mac__icontains"].replace("-", "")

            queryset = Supplicant.objects.filter(**q).order_by("-mtime")
            total_count = queryset.count()
            if start or limit:
                queryset = queryset[start : start + limit]

            serializer = serializers.ListSupplicantSerializer(
                queryset, many=True, context={"request": request}
            )

            for data in serializer.data:
                data["mac"] = make_mac_form(data["mac"])

            return {
                "success": True,
                "data": serializer.data,
                "totalCount": total_count,
            }
        except Exception as e:
            return {"success": False, "errMsg": str(e)}

    @method_decorator(json_encode)
    def create(self, request):
        try:
            data = get_data(request.POST, self.fields)

            serializer = serializers.InputSupplicantSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                return {"success": True}
            else:
                if "mac" in serializer.errors:
                    return {"success": False, "errMsg": "동일한 MAC 값이 존재합니다."}
                elif "ip" in serializer.errors:
                    return {"success": False, "errMsg": "동일한 IP 값이 존재합니다."}
                return {"success": False, "errMsg": serializer.errors}

        except Exception as e:
            return {"success": False, "errMsg": str(e)}

    def excel(self, request):
        mode = request.POST.get("mode")
        excel = Excel()

        data = self._list(request).get("data")
        excel.add_sheet(
            "사용자 현황",
            [
                ("사용자 ID", "userid", 250),
                ("사용자 MAC", "mac", 250),
                ("사용자 IP", "ip", 250),
                ("NAS", "nas", 250),
                ("비고", "remarks", 250),
            ],
            data,
        )
        buf, file_type = excel.save()
        return streaming_http_response(
            request,
            mode,
            time.strftime("단말 등록 현황 %Y-%m-%d %H%M%S"),
            buf,
            file_type,
        )


class SupplicantView(View):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.fields = {f.name for f in Supplicant._meta.fields}

    @method_decorator(json_encode)
    def read(self, request, pk):
        try:
            query = Supplicant.objects.get(pk=pk)
        except Supplicant.DoesNotExist:
            return {"success": False, "errMsg": "해당 단말이 없습니다."}

        serializer = serializers.SupplicantSerializer(
            query, context={"request": request}
        )
        return {"success": True, "data": serializer.data}

    @method_decorator(json_encode)
    def update(self, request, pk):
        try:
            data = get_data(request.POST, self.fields)
            supplicant = Supplicant.objects.get(pk=pk)
        except Supplicant.DoesNotExist:
            return {"success": False, "errMsg": "해당 단말이 없습니다."}

        serializer = serializers.InputSupplicantSerializer(
            supplicant, data=data
        )

        if serializer.is_valid():
            serializer.save()
            return {"success": True}
        else:
            if "mac" in serializer.errors:
                return {"success": False, "errMsg": "동일한 MAC 값이 존재합니다."}
            elif "ip" in serializer.errors:
                return {"success": False, "errMsg": "동일한 IP 값이 존재합니다."}
            return {"success": False, "errMsg": serializer.errors}

    @method_decorator(json_encode)
    def delete(self, request, pk):
        try:
            query = Supplicant.objects.get(pk=pk)
        except Supplicant.DoesNotExist:
            return {"success": False, "errMsg": "해당 단말 MAC이 없습니다."}

        query.delete()
        return {"success": True}


# EOF
