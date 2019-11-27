from typing import List


def get_status(rpc, shared_network_list: list, params: dict) -> List[dict]:
    ret = []
    for shared_network_name in shared_network_list:
        lease_info = rpc.show_lease_info(shared_network_name)
        detail = get_status_detail(lease_info, shared_network_name, params)
        ret += detail
    return apply_id(ret)


def apply_id(target: List[dict]) -> List[dict]:
    ret = []
    for index, value in enumerate(target, 1):
        value["id"] = index
        ret.append(value)
    return ret


def get_status_detail(
    info: dict, shared_network_name: str, params: dict
) -> List[dict]:
    ret = []
    ip_class: (str, None) = params.get("ip_class")
    min_usage: int = params.get("min_usage")
    max_usage: int = params.get("max_usage")

    for key, value in info.items():
        _class = key if key else "default"

        total = value["total"]
        used = value.get("1", 0)
        usage_rate = round(used * 100 / total, 2)

        if ip_class and ip_class != _class:
            continue

        if min_usage <= usage_rate <= max_usage:
            data = {
                "shared_network": shared_network_name,
                "class": _class,
                "total": total,
                "free": value.get("3", 0),
                "uses": used,
                "ip_collision": value.get("2", 0),
                "usage": usage_rate,
            }
            ret.append(data)
    return ret


def merge_status_data(data: List[dict]) -> List[dict]:
    ret = []
    tmp = {}
    for item in data:
        if tmp.get("shared_network") == item.get("shared_network"):
            tmp["class"] += f'<br>{item["class"]}'
            tmp["total"] += f'<br>{item["total"]}'
            tmp["free"] += f'<br>{item["free"]}'
            tmp["uses"] += f'<br>{item["uses"]}'
            tmp["ip_collision"] += f'<br>{item["ip_collision"]}'
            tmp["usage"] += f'<br>{item["usage"]}'
        else:
            if tmp:
                ret.append(tmp)
            tmp = {
                "shared_network": item["shared_network"],
                "class": str(item["class"]),
                "total": str(item["total"]),
                "free": str(item["free"]),
                "uses": str(item["uses"]),
                "ip_collision": str(item["ip_collision"]),
                "usage": str(item["usage"]),
            }
    return ret
