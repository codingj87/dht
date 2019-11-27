# -*- coding: utf-8 -*-
from zen.common import config as dht_config

template_path = dht_config.get("dhcpv4", "TemplateConfig")
config_path = dht_config.get("dhcpv4", "ScopeConfig")

WebRPC = f'https://{dht_config.get("common", "DB_HOST")}:{dht_config.get("dhcpv4", "IPManagerRPCPort")}/RPC2'
show_DB_Replication = dht_config.get_int_val("common", "DB_REPLICATION", 0)

SYSTEM_MAP = {
    "system_name": "dht",
    "system_subname": "",
    "system_sitename": "zen",
}
# EOF
