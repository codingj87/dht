# -*- coding: utf-8 -*-
from django.conf.urls import url, include
from django.urls import path
from django.views.generic.base import RedirectView

# noinspection PyUnresolvedReferences
from zen.rpc4django import views as rpcviews
from control.views import (
    base,
    dhcp,
    password,
    user,
    treecache,
    group,
    host,
    application,
    ip_stats,
    ip_search,
    ip_pool_setting,
    setting_management,
    server_status,
    replication,
    system_log,
    ip_log,
    work_log,
    event_log,
    settings,
    cluster,
    authentication_management,
    log_search,
    domain,
    cache_domain,
    account_log,
    dhcp_templates,
)

favicon_view = RedirectView.as_view(
    url="/static/img/favicon.ico", permanent=True
)

urlpatterns = [
    url(r"^(\w*)$", base.BaseView.as_view()),  #
    url(r"^captcha/", include("captcha.urls")),
    url(r"^logout$", base.BaseView.logout),
    url(r"^login$", base.BaseView.login),  #
    url(r"^application/(\w*)$", application.ApplicationView.as_view()),
    url(r"^settingjs$", base.BaseView.settingjs),  #
    url(r"^favicon.ico$", favicon_view),
    url(r"^setting/(\w*)$", settings.SettingsView.as_view()),  # 환경설정
    url(r"^user/(\w*)$", user.UserView.as_view()),  # 사용자
    url(r"^password/(\w*)$", password.PasswordView.as_view()),  # 비밀번호 disabled
    # url(r"^dht/(\w*)$", dht.DHCPView.as_view()),  # 메인
    url(r"^dht/(\w*)$", dhcp.DHCPView.as_view()),  # 메인
    url(r"^treecache/(\w*)$", treecache.TreeView.as_view()),  # 트리
    url(r"^group/(\w*)$", group.GroupView.as_view()),  # 트리, 그룹
    ###
    url(r"^system_log/(\w*)$", system_log.SystemLogView.as_view()),
    url(r"^work_log/(\w*)$", work_log.WorkLogView.as_view()),
    url(r"^event_log/(\w*)$", event_log.EventLogView.as_view()),
    url(r"^ip_log/(\w*)$", ip_log.IPLogView.as_view()),
    path("cluster/<str:method>", cluster.ClusterView.as_view()),
    # Host
    url(r"^host/(\w*)$", host.HostView.as_view()),  # 트리
    # RPC
    url(r"^ip_stats/(\w*)$", ip_stats.IPStatsView.as_view()),  # ip 할당 현황
    url(r"^ip_search/(\w*)$", ip_search.IPSearchView.as_view()),  # ip lease 정보
    url(
        r"^ip_pool_setting/(\w*)$", ip_pool_setting.IPPoolSettingView.as_view()
    ),  # ip pool 설정
    url(
        r"^setting_management/(\w*)$",
        setting_management.SettingManagementView.as_view(),
    ),  # ip pool 설정
    url(
        r"^server_status/(\w*)$", server_status.ServerStatusView.as_view()
    ),  # ip pool 설정
    url(
        r"^replication/(\w*)$", replication.ReplicationView.as_view()
    ),  # DB 이중화
    path(
        route="nas_type/<str:method>/",
        view=authentication_management.ListNASTypeView.as_view(),
    ),
    path(
        route="nas_type/<str:method>/<int:pk>/",
        view=authentication_management.NASTypeView.as_view(),
    ),
    path(
        route="nas/<str:method>/",
        view=authentication_management.ListNASView.as_view(),
    ),
    path(
        route="nas/<str:method>/<int:pk>/",
        view=authentication_management.NASView.as_view(),
    ),
    path(
        route="supplicant/<str:method>/",
        view=authentication_management.ListSupplicantView.as_view(),
    ),
    path(
        route="supplicant/<str:method>/<int:pk>/",
        view=authentication_management.SupplicantView.as_view(),
    ),
    path(
        route="log_search/<str:method>/",
        view=log_search.ListLogSearchView.as_view(),
    ),
    path(route="domain/<str:method>/", view=domain.DomainView.as_view()),
    path(
        route="cache_domain/<str:method>/",
        view=cache_domain.CacheDomainView.as_view(),
    ),
    path(
        route="account_log/<str:method>/",
        view=account_log.ListAccountLogSearchView.as_view(),
    ),
    path(
        "dhcp_templates/<str:method>/",
        dhcp_templates.DHCPTemplatesView.as_view(),
    ),
]

# RPC 처리 --------
urlpatterns.insert(0, url(r"^RPC2$", rpcviews.serve_rpc_request))
