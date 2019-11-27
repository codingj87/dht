# -*- coding: utf-8 -*-
import ipaddress, os, time, random, mimetypes, re, io, string, logging
import numpy as np
from socket import inet_aton
from urllib.parse import quote

from django.db import models
from xlwt import Workbook, Font, Pattern, XFStyle, Alignment

from django.http import HttpResponse, StreamingHttpResponse
from wsgiref.util import FileWrapper

# from zen.common import timeutil, iputil
from zen.common.tokens import IPADDRESS_PATTERN
from zen.common.jsonrpc import ServiceProxy
# from .models import Daemon, Cluster
from .config import WebRPC

IP_STATE = {"1": "assigned", "2": "collision", "3": "free"}


def validate_ip_address(ip_address):
    try:
        inet_aton(ip_address)
    except:
        return False
    else:
        return True


def human_number(
    value, separator=",", precision=2, delimiter_count=3, decimal_separator="."
):
    """ Converts an integer or floating-point number or a string to a string
        containing the delimiter character (default comma)
        after every delimiter_count digits (by default 3 digits).

        For example:
            {% load number_human %}
            String: {% number_human '1234567890.5' ' ' %}
            Float: {% number_human 1234567890.5 ' ' %}
            Integer {% number_human 1234567890 ' ' %}

            String: {% number_human '1234567890,5' ' ' 1 3 ',' %}
    """
    f = ""
    if isinstance(value, (int, np.integer)):
        negative = value < 0
        s = str(abs(value))
    elif isinstance(value, (float, np.number)):
        negative = value < 0
        s = "%s.%df" % ("%", precision) % (abs(value))
        p = s.find(decimal_separator)
        if p > -1:
            f, s = s[p:], s[:p]
    else:
        negative = False
        s = value
        p = s.find(decimal_separator)
        if p > -1:
            f = s[p : p + precision + 1]
            if f == decimal_separator:
                f = ""
            s = s[:p]

    groups = []
    while s:
        groups.insert(0, s[-delimiter_count:])
        s = s[:-delimiter_count]

    return "%s%s%s" % ("-" if negative else "", separator.join(groups), f)


def human_time(secs):
    hours, rest = divmod(secs, 3600)
    minutes, rest = divmod(rest, 60)
    if hours:
        return "%02dh %02dm" % (hours, minutes)
    elif minutes:
        return "%02dm %02ds" % (minutes, rest)
    else:
        return "%02ds" % secs


def get_ip_address(s):
    m = IPADDRESS_PATTERN.match(s)
    return m and m.group(1) or None


def random_password(length=8, alpha=True, number=True, special=True):
    regex = "!@#$%^&*()"
    components = []
    if alpha:
        components.append(string.ascii_letters)
    if number:
        components.append(string.digits)
    if special:
        components.append(regex)

    while 1:
        password = ""
        for x in range(length):
            y = random.choice(components)
            z = random.choice(y)
            password += z

        for check_type, check_str in [
            (alpha, string.ascii_letters),
            (number, string.digits),
            (special, regex),
        ]:
            if check_type:
                found = False
                for p in password:
                    if p in check_str:
                        found = True
                        break
                if not found:
                    continue

        return password


def excel(request, filename="", settings=None, rs=None, password=None):
    if settings is None:
        settings = []

    if rs is None:
        rs = []

    keys = map(lambda x: x[1], settings)

    buf = io.BytesIO()

    book = Workbook(encoding="utf-8")
    sheet = book.add_sheet("Sheet1")

    pat = Pattern()
    pat.pattern = Pattern.SOLID_PATTERN
    pat.pattern_fore_colour = 0x16

    font = Font()
    font.bold = True

    align = Alignment()
    align.horizon = Alignment.HORZ_CENTER
    align.vertical = Alignment.VERT_CENTER

    style = XFStyle()
    style.font = font
    style.pattern = pat
    style.alignment = align

    for col, (title, _, width) in enumerate(settings):
        sheet.write(0, col, title, style)
        sheet.col(col).width = width * 32  # 0x0d00 + width
    sheet.row(0).set_style(style)

    row = 1
    for r in rs:
        for col, k in enumerate(keys):
            sheet.write(row, col, r[k])
        row += 1

    if password:
        sheet.protect = (
            sheet.wnd_protect
        ) = sheet.obj_protect = sheet.scen_protect = True
        sheet.password = password

        book.protect = book.wnd_protect = book.obj_protect = True
        book.password = password

    book.save(buf)

    response = HttpResponse(
        buf.getvalue(), content_type="application/vnd.ms-excel"
    )
    response["Content-Disposition"] = 'attachment; filename="%s_%s.xls"' % (
        get_attach_filename(request, filename),
        time.strftime("%Y%m%d%H%M%S"),
    )
    return response


def get_attach_filename(request, filename):
    agent = request.META.get("HTTP_USER_AGENT")
    if "MSIE" in agent:
        return quote(filename)
    elif "Trident" in agent:
        return quote(filename)
    elif "Firefox" in agent:
        return filename
    elif "Mozilla" in agent:
        return quote(filename)
    else:  # Safari, Opera
        return filename


def _process_macro(template, user, sender, macro):
    template = template.replace("%ID%", user.userid)
    template = template.replace("%DATE%", time.strftime("%Y-%m-%d"))
    template = template.replace("%DATETIME%", time.strftime("%Y-%m-%d %H:%M"))
    template = template.replace("%RECEIVER%", user.name)
    if sender:
        template = template.replace("%SENDER%", sender.name)

    for k, v in macro.items():
        template = template.replace(k, v)

    return template


def load_table_map(table, key, value):
    """ ex) util.load_table_map(User, 'ip', 'name') """
    return {getattr(r, key): getattr(r, value) for r in table.objects.all()}


def human_size(size):
    size = float(size)
    types = ["YB", "ZB", "EB", "PB", "TB", "GB", "MB", "KB", "B"]
    while 1:
        if size < 1024:
            return "%d %s" % (size, types.pop())
        size /= 1024.0
        types.pop()


def mask_to_bits(net_mask):
    """
    Convert string rep of net_mask to number of bits

    >>> mask_to_bits('255.255.255.255')
    32
    >>> mask_to_bits('255.255.224.0')
    19
    >>> mask_to_bits('0.0.0.0')
    0
    """
    if isinstance(net_mask, str) and net_mask.find(".") > -1:
        test = 0xFFFFFFFF
        if net_mask[0] == "0":
            return 0

        mask_num = ip_to_decimal(net_mask)
        for i in range(32):
            if test == mask_num:
                return 32 - i
            test -= 2 ** i
        return None
    else:
        return int(net_mask)


def ip_to_decimal(ip):
    check_ip(ip)
    octets = ip.split(".")
    octets.reverse()
    i = 0
    for j in range(len(octets)):
        i += (256 ** j) * int(octets[j])
    return i


def check_ip(ip):
    success = True
    if ip == "":
        success = False
    else:
        try:
            octets = ip.split(".")
            if len(octets) != 4:
                success = False
        except Exception as e:
            print("%s is not a dot delimited address" % ip)
            logging.exception(e)
        else:
            for o in octets:
                try:
                    if not (0 <= int(o) <= 255):
                        success = False
                except Exception as e:
                    success = False
                    logging.exception(e)

    if not success:
        print("%s is an invalid address" % ip)
    return True


class GetTableMap(object):
    """
    Map (Simple Network Management Protocol, SNMP) table OIDs to their column names.
    """

    def __init__(self, name, table_oid, col_map):
        """Initializer
        """
        self.name = name
        self.table_oid = table_oid
        self.col_map = col_map
        self._oids = {}
        for numb, name in self.col_map.items():
            self._oids[self.table_oid + numb] = name

    def get_oids(self):
        """Return the raw OIDs used to get this table.
        """
        return list(self._oids.keys())

    def map_data(self, results):
        """Map data from the format returned by SNMP table get (which is column-based)
        to a row-based format. eg data[row_idx][col_name]
        """
        data = {}
        for col, rows in results.items():
            name = self._oids[col]
            clen = len(col) + 1
            for r_oid, value in rows.items():
                r_idx = r_oid[clen:]
                data.setdefault(r_idx, {})
                data[r_idx][name] = value
        return data


def get_net_str(ip, net_mask):
    """
    Deprecated in favour of netFromIpAndNet()
    """
    return net_from_ip_and_net(ip, net_mask)


def decimal_ip_to_str(ip):
    """
    Convert a decimal IP address (as returned by ipToDecimal)
    to a regular IPv4 dotted quad address.

    >>> decimal_ip_to_str(ip_to_decimal('10.23.44.57'))
    '10.23.44.57'
    """
    _masks = (0x000000FF, 0x0000FF00, 0x00FF0000, 0xFF000000)
    o = []
    for i in range(len(_masks)):
        t = ip & _masks[i]
        s = str(t >> (i * 8))
        o.append(s)
    o.reverse()
    return ".".join(o)


def get_net(ip, net_mask):
    """
    Deprecated in favour of decimalNetFromIpAndNet()
    """
    return decimal_net_from_ip_and_net(ip, net_mask)


def decimal_net_from_ip_and_net(ip, net_mask):
    """
    Get network address of IP as string netmask as in the form 255.255.255.0

    >>> get_net('10.12.25.33', 24)
    168564992L
    >>> get_net('10.12.25.33', '255.255.255.0')
    168564992L
    """
    check_ip(ip)
    ip = ip_to_decimal(ip)

    try:
        net_bits = int(net_mask)
    except ValueError:
        net_bits = -1

    if 0 < net_bits <= 32:
        net_mask = bits_to_decimal_mask(net_bits)
    else:
        check_ip(net_mask)
        net_mask = ip_to_decimal(net_mask)
    return ip & net_mask


def bits_to_decimal_mask(net_bits):
    """
    Convert integer number of netbits to a decimal number

    >>> bits_to_decimal_mask(32)
    4294967295L
    >>> bits_to_decimal_mask(19)
    4294959104L
    >>> bits_to_decimal_mask(0)
    0L
    """
    mask_numb = 0
    net_bits = int(net_bits)
    for i in range(32 - net_bits, 32):
        mask_numb += 2 ** i
    return mask_numb


def net_from_ip_and_net(ip, net_mask):
    """
    Return network number as string

    >>> net_from_ip_and_net('10.12.25.33', 24)
    '10.12.25.0'
    >>> net_from_ip_and_net('250.12.25.33', 1)
    '128.0.0.0'
    >>> net_from_ip_and_net('10.12.25.33', 16)
    '10.12.0.0'
    >>> net_from_ip_and_net('10.12.25.33', 32)
    '10.12.25.33'
    """
    return decimal_ip_to_str(get_net(ip, net_mask))


def file_download(path):
    ext = os.path.splitext(path)[-1]
    mime_type = mimetypes.types_map.get(ext, "application/octet-stream")
    response = StreamingHttpResponse(
        FileWrapper(io.open(path, "rb")), content_type=mime_type
    )
    response["Content-Length"] = os.path.getsize(path)
    response[
        "Content-Disposition"
    ] = 'attachment; filename="%s"' % os.path.basename(path)
    return response


def get_rpc_list(vip, svrType="dhcpv4_ipmanager"):
    return [
        ServiceProxy(f"https://{ip}:{port}/RPC2")
        for ip, port in Daemon.objects.filter(
            svr_type=svrType, cluster__vip=vip
        )
        .order_by("-status", "hamode")
        .values_list("ip", "rpc_port")
    ]


def get_server_list(vip, svrType="dhcpv4_ipmanager", status=None):
    if status is None:
        return [
            (ServiceProxy(f"https://{ip}:{port}/RPC2"), ip, hamode)
            for ip, port, hamode in Daemon.objects.filter(
                svr_type=svrType, cluster__vip=vip
            )
            .order_by("-status", "hamode")
            .values_list("ip", "rpc_port", "hamode")
        ]
    else:
        return [
            (ServiceProxy(f"https://{ip}:{port}/RPC2"), ip, hamode)
            for ip, port, hamode in Daemon.objects.filter(
                svr_type=svrType, cluster__vip=vip, status=status
            )
            .order_by("-status", "hamode")
            .values_list("ip", "rpc_port", "hamode")
        ]


def get_rpc(ip, svrType="dhcpv4_ipmanager"):
    if ip is None:
        return ServiceProxy(WebRPC)

    daemon = Daemon.objects.only("rpc_port").get(ip=ip, svr_type=svrType)
    return ServiceProxy("https://{}:{}/RPC2".format(ip, daemon.rpc_port))


def decode_object(obj, encoding):
    if isinstance(obj, dict):
        for k, v in obj.items():
            obj[k] = decode_object(v, encoding)
    elif isinstance(obj, list):
        obj = [decode_object(x, encoding) for x in obj]
    elif isinstance(obj, tuple):
        obj = tuple([decode_object(x, encoding) for x in obj])
    elif isinstance(obj, bytes):
        obj = obj.decode(encoding)

    return obj


def streaming_http_response(request, mode, file_name, buf, file_type):
    if mode == "xls":
        response = StreamingHttpResponse(
            FileWrapper(io.open(buf, "rb")),
            content_type="application/vnd.ms-excel",
        )
    elif mode == "html":
        response = StreamingHttpResponse(
            FileWrapper(io.open(buf, "rb")), content_type="application/liquid"
        )
    else:
        response = StreamingHttpResponse(
            FileWrapper(io.open(buf, "rb")),
            content_type="application/octet-stream",
        )
    response["Content-Length"] = os.path.getsize(buf)
    response["Content-Disposition"] = (
        'attachment; filename="%s"'
        % get_attach_filename(request, "%s.%s" % (file_name, file_type))
    )
    return response


def chars_only(value, pattern="[a-zA-Z0-9_]"):
    if not value:
        return ""
    return "".join(re.findall(pattern, value))


def get_params(query: models.Model, fields: set) -> dict:
    params = {}
    for field in fields:
        value = query.__getattribute__(field)
        if "time" in field and isinstance(value, int):
            params[field] = timeutil.getHumanTimeFromUnixTime(value)
        else:
            params[field] = value
    return params


def get_cluster_ip(pk):
    if pk:
        try:
            query = Cluster.objects.get(pk=pk)
        except Cluster.DoesNotExist:
            return False
    else:
        query = Cluster.objects.all().first()
    return query.vip


def get_query(params: dict, fields, time_type="ctime"):
    q = {}
    start = limit = None
    for key, value in params.items():
        if key == "sdate" and value:
            q[f"{time_type}__gte"] = timeutil.getUnixTimeFromHumanTime(
                value, "%Y-%m-%d"
            )
        if key == "edate" and value:
            q[f"{time_type}__lte"] = (
                timeutil.getUnixTimeFromHumanTime(value, "%Y-%m-%d")
                + 24 * 60 * 60
            )

        if not key.startswith("is_") and key in fields and value:
            if value.isdigit():
                # q[key] = int(value)
                q[f"{key}__icontains"] = int(value)
            else:
                if value == "*":
                    continue
                q[f"{key}__icontains"] = value
        if key == "start":
            start = int(params["start"])
        if key == "limit":
            limit = int(params["limit"])

    return q, start, limit


def get_data(params: dict, fields):
    data = {}
    for key, value in params.items():
        if key in fields and value:
            if value.isdigit():
                data[key] = int(value)
            else:
                data[key] = value
    return data


def update_shared_network(
    request, n_mac, n_ip, c_mac, c_ip, template, user_id
):
    # rpc.py 와 util.py 가 모듈 순환 참조
    # rpc.py 에서 util.py 에 get_server_list() 를 import 하고 있어, 상단에서 rpc.py 를 불러올 때 에러 발생. (순환참조?)
    # 함수 안에서 import 처리
    from .rpc import deleteSharedNetwork, createSharedNetwork

    if c_ip != n_ip:
        is_exists = get_lease_info_by_ip(request, n_ip)
        if is_exists:
            return {"success": False, "errMsg": f"지정한 IP가 다른 곳에서 사용중입니다."}
        is_update = True
    elif c_mac != n_mac:
        is_update = True
    else:
        is_update = False

    if is_update:
        subnet, router, shared_network = get_network_data(n_ip)
        mac = make_mac_form(n_mac)
        config = template.render(
            shared_network=shared_network,
            subnet=subnet,
            router=router,
            ip=n_ip,
            mac=mac,
        )

        if c_mac and c_ip:
            _, _, old_shared_network = get_network_data(c_ip)
            deleteSharedNetwork(old_shared_network, user_id)
            result = createSharedNetwork(shared_network, config, user_id)

            if "ok" not in result:
                return {"success": False, "errMsg": result}

            return result

        result = createSharedNetwork(shared_network, config, user_id)

        if "ok" not in result:
            return {"success": False, "errMsg": result}

        return result

    return {"success": True}


def get_network_data(ip):
    subnet = iputil.int2ip(iputil.ip2int(ip) - 2)
    router = iputil.int2ip(iputil.ip2int(ip) - 1)
    shared_network = "_%s" % subnet.replace(".", "_")
    return subnet, router, shared_network


def get_lease_info_by_ip(request, ip):
    cluster_id = request.session.get("cluster_id")
    for rpc in get_rpc_list(get_cluster_ip(cluster_id)):
        try:
            response = rpc.show_lease_by_ip(ip)
        except:
            pass
        else:
            break
    else:
        return {"success": False, "errmsg": "현재 구동중인 DHCP 서버가 존재하지 않습니다"}

    return response


def run_chap_info(mac, tunnel_ip, update):

    for ip, rpcPort in Daemon.objects.filter(
        svr_type="radius", status=1
    ).values_list("ip", "rpc_port"):
        rpc = ServiceProxy(f"https://{ip}:{rpcPort}/RPC2")
        try:
            if update:
                rpc.updateChapInfo(mac, tunnel_ip)
            else:
                rpc.deleteChapInfo(mac)
        except:
            pass
        else:
            break

    return None


def check_30bit_ip(ip):
    subnet_ip = ipaddress.IPv4Network(f"{ip}/30", strict=False)
    str_ip = str(subnet_ip.network_address + 2)
    if ip != str_ip:
        return {
            "success": False,
            "errMsg": ("30Bit IP가 아닙니다.", f"등록 가능하신 IP는 {str_ip} 입니다."),
        }
    return None


def make_mac_form(mac):
    try:
        return "-".join(mac[i : i + 2] for i in range(0, 11, 2))
    except:
        return None


def change_from_ip_to_domain(ip: str) -> str:
    to_list = ip.split(".")
    to_list.reverse()
    return f'{".".join(to_list)}.in-addr.arpa'


# END
