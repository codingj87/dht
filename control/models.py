# -*- coding: utf-8 -*-
import time

from django.contrib.postgres.fields import JSONField
from django.db import models


class Setting(models.Model):  # 특수값
    id = models.AutoField(primary_key=True)  # 아이디
    key = models.CharField(max_length=64, unique=True, db_index=True)  # 키
    value = models.TextField(null=True)  # 값

    class Meta:
        app_label = "control"
        db_table = "SETTING"


class User(models.Model):  # 사용자관리
    id = models.AutoField(primary_key=True)  # 아이디
    # group = models.ForeignKey(Group, null=True, on_delete=models.CASCADE)  # 그룹
    userid = models.CharField(
        max_length=32, unique=True, db_index=True
    )  # 사용자아이디
    passwd = models.CharField(max_length=128)  # 비밀번호
    enable = models.IntegerField(default=1)  # 활성 유저
    level = models.IntegerField(default=1)  # 권한
    name = models.CharField(max_length=64, null=True)  # 이름
    email = models.EmailField(max_length=64, null=True)  # 이메일
    phone = models.CharField(max_length=32, null=True)  # 전화번호
    desc = models.TextField(null=True)  # 비고
    ctime = models.IntegerField(null=True)  # 생성시간
    mtime = models.IntegerField(null=True)  # 수정시간
    list_count = models.IntegerField(default=25)  # 리스트수
    use_help = models.IntegerField(default=1)  # 도움말 사용
    login_fail_cnt = models.IntegerField(default=0)  # 로그인 실패 수
    login_fail_time = models.IntegerField(default=0, null=True)  # 마지막 로그인 실패시간

    class Meta:
        app_label = "control"
        db_table = "USER"


# class TimeStampedModel(models.Model):
#     ctime = models.IntegerField(db_index=True)
#     mtime = models.IntegerField(db_index=True)
#
#     def save(self, *args, **kwargs):
#         now = int(time.time())
#         if self.pk:
#             self.mtime = now
#         else:
#             self.ctime = self.mtime = now
#
#         super(TimeStampedModel, self).save(*args, **kwargs)
#
#     class Meta:
#         abstract = True
#
#
# class Cluster(models.Model):
#     id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=128, db_index=True)  # 설치 위치 등
#     vip = models.CharField(
#         max_length=15, db_index=True, unique=True
#     )  # virtual IP
#     ctime = models.IntegerField()
#     mtime = models.IntegerField()
#
#     class Meta:
#         app_label = "control"
#         db_table = "CLUSTER"
#
#
# class Daemon(models.Model):
#     DAEMON_STATUS_CHOICES = (
#         (0, "not running"),
#         (1, "running & normal operation"),
#         (2, "running but abnormally operating"),
#     )
#
#     id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=128, db_index=True)
#     cluster = models.ForeignKey(
#         Cluster, null=True, on_delete=models.CASCADE
#     )  #
#     ip = models.CharField(max_length=15, db_index=True)  # real IP
#     rpc_port = models.IntegerField()  # rpc port
#     svr_type = models.CharField(
#         max_length=32, db_index=True, null=True
#     )  # dhcpv4_parser / dhcpv4_ipmanager
#     status = models.IntegerField(
#         choices=DAEMON_STATUS_CHOICES, default=0, null=False
#     )
#     hamode = models.CharField(
#         max_length=15, null=True
#     )  # master / slave / standalone
#     ctime = models.IntegerField()
#     mtime = models.IntegerField()
#     desc = models.TextField(null=True)
#
#     class Meta:
#         app_label = "control"
#         db_table = "DAEMON"
#         unique_together = ("ip", "svr_type")
#
#
# class Group(models.Model):  # 본부관리
#     id = models.AutoField(primary_key=True)  # 아이디
#     pid = models.IntegerField(null=True)  # 상위그룹
#     name = models.CharField(max_length=64)  # 그룹명
#     desc = models.TextField(null=True)  # 비고
#     ctime = models.IntegerField(null=True)  # 생성시간
#     mtime = models.IntegerField(null=True)  # 수정시간
#
#     class Meta:
#         app_label = "control"
#         db_table = "GROUP"
#
#
#
#
#
# class Host(models.Model):  # DHCP 서버관리
#     id = models.AutoField(primary_key=True)  # 아이디
#     group = models.ForeignKey(Group, null=True, on_delete=models.CASCADE)  # 그룹
#     name = models.CharField(max_length=64, null=True)  # 서버명
#     master_ip = models.CharField(max_length=64, null=True)  # master IP
#     master_port = models.CharField(max_length=64, null=True)  # master Port
#     slave_ip = models.CharField(max_length=64, null=True)  # slave IP
#     slave_port = models.CharField(max_length=64, null=True)  # slave Port
#     ctime = models.IntegerField(null=True)  # 생성시간
#     mtime = models.IntegerField(null=True)  # 수정시간
#
#     class Meta:
#         app_label = "control"
#         db_table = "HOST"
#
#
# class JobHistory(models.Model):  # 사용자관리
#     id = models.AutoField(primary_key=True)  # 아이디
#     userid = models.CharField(max_length=32, db_index=True)  # 사용자아이디
#     type = models.CharField(
#         max_length=32, db_index=True
#     )  # 작업유형 (create, update, delete)
#     before_cfg = models.TextField(null=True)  # 이전설정
#     after_cfg = models.TextField(null=True)  # 이후설정
#     is_rollback = models.IntegerField(default=0, null=True)  # 롤백여부
#     master_result = models.IntegerField(default=0, null=True)  # master 적용결과
#     slave_result = models.IntegerField(default=0, null=True)  # slave 적용결과
#     # vip = models.CharField(max_length=15)  # DHCP Server VIP
#     shared_network = models.CharField(
#         max_length=64, db_index=True
#     )  # Shared Network
#     ctime = models.IntegerField()  # 작업시간
#     mtime = models.IntegerField(null=True)  # 수정시간
#
#     class Meta:
#         app_label = "control"
#         db_table = "JOB_HISTORY"
#
#
# class Notice(models.Model):  # 공지사항
#     id = models.AutoField(primary_key=True)  # 아이디
#     subject = models.CharField(max_length=32, db_index=True)  # 제목
#     content = models.TextField(null=True)  # 내용
#     user = models.ForeignKey(User, on_delete=models.CASCADE)  # 등록자
#     ctime = models.IntegerField(null=True)  # 생성시간
#     mtime = models.IntegerField(null=True)  # 수정시간
#
#     class Meta:
#         app_label = "control"
#         db_table = "NOTICE"
#
#
# class Config(models.Model):
#     id = models.AutoField(primary_key=True)
#     subject = models.CharField(max_length=32, db_index=True)
#     after = models.TextField(null=True)
#     before = models.TextField(null=True)
#     size = models.IntegerField()  # contents 길이
#     ctime = models.IntegerField(null=True)
#     mtime = models.IntegerField(null=True)
#
#     class Meta:
#         app_label = "control"
#         db_table = "CONFIG"
#
#
# class DHCPHandleStat(models.Model):  #  1분단위 통계 처리
#     id = models.AutoField(primary_key=True)
#     ip = models.CharField(max_length=15, db_index=True)  # real sever IP
#     discover = models.FloatField(default=0.0)  # EPS
#     offer = models.FloatField(default=0.0)
#     request = models.FloatField(default=0.0)
#     ack = models.FloatField(default=0.0)
#     decline = models.FloatField(default=0.0)
#     nack = models.FloatField(default=0.0)
#     release = models.FloatField(default=0.0)
#     others = models.FloatField(
#         default=0.0
#     )  # 기타 (inform, leasequery, decline, ...)
#     ctime = models.IntegerField(db_index=True)
#     mtime = models.IntegerField(null=True)
#
#     class Meta:
#         app_label = "control"
#         db_table = "DHCP_HANDLE_STAT"
#
#
# class SHARED_NETWORK_STATS(models.Model):  # 10분단위 통계
#     id = models.AutoField(primary_key=True)
#     shared_network = models.CharField(
#         max_length=64, db_index=True
#     )  # Shared Network
#     user_class = models.CharField(max_length=64)  # user class
#     total_ip = models.IntegerField()
#     assigned = models.IntegerField()
#     collision = models.IntegerField()
#     ctime = models.IntegerField(db_index=True)
#     mtime = models.IntegerField(null=True)
#
#     class Meta:
#         app_label = "control"
#         db_table = "SHARED_NETWORK_STATS"
#         unique_together = ("shared_network", "user_class", "ctime")
#
#
# # radius
# class NASType(models.Model):
#     # category ; unix, windows, network, etc
#     id = models.AutoField(primary_key=True)
#     type = models.CharField(
#         max_length=32, unique=True
#     )  # cisco, juniper, asus, VPN
#     desc = models.TextField(null=True)
#     ctime = models.IntegerField(null=True)
#     mtime = models.IntegerField(null=True)
#
#     class Meta:
#         app_label = "control"
#         db_table = "NAS_TYPE"
#
#
# class NAS(models.Model):
#     id = models.AutoField(primary_key=True)
#     name = models.CharField(max_length=128, unique=True, db_index=True)
#     ip = models.CharField(max_length=256, unique=True, db_index=True)
#     type = models.ForeignKey(NASType, db_index=True, on_delete=models.CASCADE)
#     secret = models.CharField(max_length=32, null=True)
#     desc = models.CharField(max_length=256, null=True)
#     ctime = models.IntegerField(null=True)
#     mtime = models.IntegerField(null=True)
#
#     class Meta:
#         app_label = "control"
#         db_table = "NAS"
#
#
# class Supplicant(models.Model):  # 접속단말
#     id = models.AutoField(primary_key=True)
#     userid = models.CharField(
#         max_length=32, db_index=True, unique=True, null=True
#     )  # mac or userid
#     password = models.CharField(max_length=64, null=True)
#     nas = models.ForeignKey(NAS, null=True, on_delete=models.CASCADE)
#     ip = models.CharField(max_length=15, db_index=True, null=True)
#     mac = models.CharField(max_length=12, db_index=True, null=True)
#     desc = models.CharField(max_length=256, null=True)
#     ctime = models.IntegerField(null=True)
#     mtime = models.IntegerField(null=True)
#
#     class Meta:
#         app_label = "control"
#         db_table = "SUPPLICANT"
#
#
# class AuthLog(models.Model):
#     id = models.AutoField(primary_key=True)
#     packet_type = models.CharField(
#         max_length=32, db_index=True
#     )  # acccount_on, account_off, access_requet, account_request, ...
#     lte_id = models.CharField(max_length=32, null=True)
#     emhs = models.CharField(max_length=32, null=True)
#     emhs_mac = models.CharField(max_length=32, null=True)
#     emhs_ip = models.CharField(max_length=32, null=True)
#     supplicant = models.CharField(max_length=32, null=True)
#     ip = models.CharField(
#         max_length=15, db_index=True, null=True
#     )  # emhs's IP (IP 주소는 변경될 수 있으므로 별도로 저장함)
#     response = models.CharField(
#         max_length=128, db_index=True
#     )  # accept, reject(원인), drop(원인)
#     ctime = models.IntegerField(null=True)
#     mtime = models.IntegerField(null=True)
#
#     class Meta:
#         app_label = "control"
#         db_table = "AUTH_LOG"
#
#
# class AccountingLog(models.Model):  # 현재 진행중
#     # {'userid': 'zen', 'calling_station_id': '10.10.10.32', 'nas_ip': '10.10.10.11', 'ctime': 1557293827, 'status_type': 'Interim-Update', 'output_octets': 853646, 'input_octets': 172456, 'output_packets': 1175, 'input_packets': 1159, 'session_time': 240, 'mtime': 1557294067}
#     id = models.AutoField(primary_key=True)
#     userid = models.CharField(max_length=32, db_index=True)
#     calling_station_id = models.CharField(
#         max_length=15, db_index=True
#     )  # mac or IP
#     nas_ip = models.CharField(max_length=15, db_index=True)  # IP
#     status_type = models.CharField(
#         max_length=14, db_index=True
#     )  # Start, Interim-Update
#     output_octets = models.BigIntegerField(default=0)
#     output_rate = models.FloatField(default=0.0)  # 시간별 그래피 출력을 위한 평균 output 값
#     input_octets = models.BigIntegerField(default=0)
#     input_rate = models.FloatField(default=0.0)  # 시간별 그래피 출력을 위한 평균 output 값
#     output_packets = models.BigIntegerField(default=0)
#     input_packets = models.BigIntegerField(default=0)
#     session_time = models.IntegerField(default=0)
#     ctime = models.IntegerField()
#     mtime = models.IntegerField()
#
#     class Meta:
#         app_label = "control"
#         db_table = "ACCOUNTING_LOG"
#         unique_together = ("userid", "calling_station_id")
#
#
# class AccountedLog(models.Model):
#     # {'userid': 'zen', 'calling_station_id': '10.10.10.32', 'nas_ip': '10.10.10.11', 'ctime': 1557293827, 'status_type': 'Interim-Update', 'output_octets': 853646, 'input_octets': 172456, 'output_packets': 1175, 'input_packets': 1159, 'session_time': 240, 'mtime': 1557294067}
#     id = models.AutoField(primary_key=True)
#     userid = models.CharField(max_length=32, db_index=True)
#     calling_station_id = models.CharField(
#         max_length=15, db_index=True
#     )  # mac or IP
#     nas_ip = models.CharField(max_length=15, db_index=True)  # IP
#     status_type = models.CharField(
#         max_length=14, db_index=True
#     )  # Stop, Stop-abnormal
#     output_octets = models.BigIntegerField(default=0)
#     output_rate = models.FloatField(default=0.0)  # 시간별 그래피 출력을 위한 평균 output 값
#     input_octets = models.BigIntegerField(default=0)
#     input_rate = models.FloatField(default=0.0)  # 시간별 그래피 출력을 위한 평균 output 값
#     output_packets = models.BigIntegerField(default=0)
#     input_packets = models.BigIntegerField(default=0)
#     session_time = models.IntegerField(default=0)
#     terminate_cause = models.CharField(max_length=32)
#     ctime = models.IntegerField(null=True)
#     mtime = models.IntegerField(null=True)
#
#     class Meta:
#         app_label = "control"
#         db_table = "ACCOUNTED_LOG"
#
#
# class Domain(TimeStampedModel):
#     domain = models.CharField(max_length=256, unique=True, db_index=True)
#     email = models.EmailField()
#     master = models.CharField(max_length=256)
#     slave = models.CharField(max_length=256)
#     ttl = models.IntegerField()
#     minimum_ttl = models.IntegerField()
#     retry = models.IntegerField()
#     expire = models.IntegerField()
#     refresh = models.IntegerField()
#     record = JSONField()
#     is_reverse = models.BooleanField(default=False)
#
#     class Meta:
#         app_label = "control"
#         db_table = "DOMAIN"
#
#
# class CacheDomain(TimeStampedModel):
#     domain = models.CharField(max_length=256, unique=True, db_index=True)
#     forwarders = JSONField()
#
#     class Meta:
#         app_label = "control"
#         db_table = "CACHE_DOMAIN"
#
#
# class DHCPTemplate(TimeStampedModel):
#     name = models.CharField(max_length=256, unique=True, db_index=True)
#     template = models.TextField()
#     options = JSONField()
#
#     class Meta:
#         app_label = "control"
#         db_table = "DHCP_TEMPLATE"
#
#
# # EOF
