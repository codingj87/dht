# -*- coding: utf-8 -*-
import json
import time

from django.db import IntegrityError
from django.utils.decorators import method_decorator

from lib.view import View
from ..deco import json_encode

# from ..models import DHCPTemplate


err_response = {"success": False, "errMsg": "해당 템플릿이 없습니다."}
options = [
    "pad",
    "time-offset",
    "time-server",
    "name-server",
    "domain-name-servers",
    "log-server",
    "cookie-server",
    "lpr-server",
    "impress-server",
    "resource-location-server",
    "host-name",
    "boot-file-size",
    "merit-dump-file",
    "domain-name",
    "dht-lease-time",
    "swap-server",
    "root-path",
    "extensions-path",
    "ip-forwarding-enable/disable",
    "non-local-source-routing-enable/disable",
    "policy-filter",
    "maximum-datagram-reassembly-size",
    "default-ip-time-to-live",
    "path-mtu-aging-timeout",
    "path-mtu-plateau-table",
    "interface-mtu",
    "all-subnets-are-local",
    "broadcast-address",
    "perform-mask-discovery",
    "mask-supplier",
    "perform-router-discovery",
    "router-solicitation-address",
    "static-route",
    "trailer-encapsulation",
    "arp-cache-timeout",
    "ethernet-encapsulation",
    "tcp-default-ttl",
    "tcp-keepalive-interval",
    "tcp-keepalive-garbage",
    "nis-domain",
    "network-information-servers",
    "network-time-protocol-servers",
    "vendor-specific-information",
    "netbios-over-tcp/ip-name-servers",
    "netbios-over-tcp/ip-datagram-distribution-servers",
    "netbios-over-tcp/ip-node-type",
    "netbios-over-tcp/ip-scope",
    "x-window-system-font-servers",
    "x-window-system-display-manager",
    "requested-ip-address",
    "ip-address-lease-time",
    "option-overload",
    "dht-message-type",
    "server-identifier",
    "parameter-request-list",
    "message",
    "maximum-dht-message-size",
    "renewal-time-value",
    "rebinding-time-value",
    "vendor-class-identifier",
    "client-identifier",
    "network-information-service+-domain",
    "network-information-service+-servers",
    "tftp-server-name",
    "bootfile-name",
    "mobile-ip-home-agent",
    "smtp-server",
    "pop3-server",
    "nntp-server",
    "default-www-server",
    "default-finger-server",
    "default-irc-server",
    "default-streettalk-server",
    "default-streettalk-directory-assistance-server",
    "user-class",
    "client-fqdn",
    "relay-agent-information",
    "client-last-transaction-time",
    "associated-ip",
    "the-open-group's-user-authentication-protocol",
    "disable-stateless-auto-configuration-in-ipv4-clients",
    "voip-configuration-server",
]


class DHCPTemplatesView(View):
    @method_decorator(json_encode)
    def list_up(self, request):
        start = request.POST.get("start")
        limit = request.POST.get("limit")
        name = request.POST.get("name")

        q = {}

        if name:
            q["name__icontains"] = name

        queryset = DHCPTemplate.objects.filter(**q)

        if start and limit:
            start, limit = int(start), int(limit)
            queryset = queryset[start : start + limit]

        return {
            "success": True,
            "data": [
                {"name": query.name, "options": query.options, "id": query.pk}
                for query in queryset
            ],
        }

    @method_decorator(json_encode)
    def read(self, request):
        pk = request.POST.get("pk")

        try:
            query = DHCPTemplate.objects.get(pk=pk)
        except DHCPTemplate.DoesNotExist:
            return err_response

        return {
            "success": True,
            "data": {"name": query.name, "options": query.options},
        }

    @method_decorator(json_encode)
    def delete(self, request):
        pk = request.POST.get("pk")
        try:
            query = DHCPTemplate.objects.get(pk=pk)
        except DHCPTemplate.DoesNotExist:
            return err_response
        query.delete()
        return {"success": True}

    @method_decorator(json_encode)
    def update(self, request):
        pk = request.POST.get("pk")
        name = request.POST.get("name")
        template = request.POST.get("template")
        template_options = request.POST.get("options")
        try:
            query = DHCPTemplate.objects.get(pk=pk)
        except DHCPTemplate.DoesNotExist:
            return err_response

        query.name = name
        query.template = template
        query.options = json.loads(template_options)

        query.save()
        return {"success": True}

    @method_decorator(json_encode)
    def create(self, request):
        name = request.POST.get("name")
        template = request.POST.get("template")
        template_options = request.POST.get("options")
        try:
            DHCPTemplate.objects.create(
                name=name,
                template=template,
                options=json.loads(template_options),
            )
        except IntegrityError:
            return {"success": False, "errMsg": "중복된 템플릿 명이 있습니다."}
        except Exception as e:
            return {"success": False, "errMsg": str(e)}

        return {"success": True}

    @method_decorator(json_encode)
    def options(self, request):
        return {
            "success": True,
            "data": [
                {"text": option, "value": option} for option in sorted(options)
            ],
        }

    @method_decorator(json_encode)
    def templates_combo(self, request):
        return {
            "success": True,
            "data": [
                {
                    "text": query.name,
                    "value": query.pk,
                    "options": query.options,
                }
                for query in DHCPTemplate.objects.all()
            ],
        }


# EOF
