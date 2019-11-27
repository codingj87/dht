from rest_framework import serializers
from zen.common import timeutil

# from .models import NAS, NASType, AuthLog, Supplicant, Domain, CacheDomain


class TimeSerializer(serializers.ModelSerializer):
    ctime = serializers.SerializerMethodField()
    mtime = serializers.SerializerMethodField()

    def get_ctime(self, obj):
        if "request" in self.context:
            return timeutil.getHumanTimeFromUnixTime(obj.ctime)
        return timeutil.getHumanTimeFromUnixTime(0)

    def get_mtime(self, obj):
        if "request" in self.context:
            return timeutil.getHumanTimeFromUnixTime(obj.mtime)
        return timeutil.getHumanTimeFromUnixTime(0)


# class NASTypeSerializer(TimeSerializer):
#     class Meta:
#         model = NASType
#         fields = [f.name for f in NASType._meta.fields]
#
#
# class InputNASTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = NASType
#         fields = ["type", "desc"]
#
#
# class ListNASSerializer(serializers.ModelSerializer):
#
#     type = serializers.SerializerMethodField()
#
#     class Meta:
#         model = NAS
#         fields = [f.name for f in NAS._meta.fields]
#
#     def get_type(self, obj):
#         if "request" in self.context:
#             return obj.type.type if obj.type else ""
#         return None
#
#
# class NASSerializer(serializers.ModelSerializer):
#
#     type = NASTypeSerializer()
#
#     class Meta:
#         model = NAS
#         fields = [f.name for f in NAS._meta.fields]
#
#
# class InputNASSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = NAS
#         fields = ["name", "ip", "type", "secret", "desc"]
#
#
# class ListSupplicantSerializer(serializers.ModelSerializer):
#
#     nas = serializers.SerializerMethodField()
#
#     class Meta:
#         model = Supplicant
#         fields = [f.name for f in Supplicant._meta.fields]
#
#     def get_nas(self, obj):
#         if "request" in self.context:
#             return obj.nas.name if obj.nas else ""
#         return None
#
#
# class InputSupplicantSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Supplicant
#         fields = ["userid", "password", "ip", "mac", "nas", "desc"]
#
#
# class SupplicantSerializer(serializers.ModelSerializer):
#
#     nas = NASSerializer()
#
#     class Meta:
#         model = Supplicant
#         fields = [f.name for f in Supplicant._meta.fields]
#
#
# class ListLogSearchSerializer(serializers.ModelSerializer):
#
#     ctime = serializers.SerializerMethodField()
#
#     class Meta:
#         model = AuthLog
#         fields = [f.name for f in AuthLog._meta.fields]
#
#     def get_ctime(self, obj):
#         if "request" in self.context:
#             return timeutil.getHumanTimeFromUnixTime(obj.ctime)
#         return timeutil.getHumanTimeFromUnixTime(0)
#
#
# class DomainListSerializer(TimeSerializer):
#
#     record_count = serializers.SerializerMethodField()
#
#     class Meta:
#         model = Domain
#         fields = [
#             f.name for f in Domain._meta.fields if f.name != "record"
#         ] + ["record_count"]
#
#     def get_record_count(self, obj):
#         if "request" in self.context and obj.record:
#             return len(obj.record)
#         return 0
#
#
# class DomainDetailSerializer(TimeSerializer):
#     class Meta:
#         model = Domain
#         fields = [f.name for f in Domain._meta.fields]
#
#
# class CacheDomainSerializer(TimeSerializer):
#     class Meta:
#         model = CacheDomain
#         fields = [f.name for f in CacheDomain._meta.fields]
