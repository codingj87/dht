/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.FilterType', {
    extend: 'Ext.data.Store',
    alias: 'store.filtertype',

    fields: [ 'value', 'display' ],
    data: [
        ['0', 'application'],
        ['1', 'as'],
        ['2', 'as_origin'],
        ['3', 'as_peer'],
        ['4', 'aspath'],
        ['5', 'atf'],
        ['6', 'city'],
        ['7', 'community'],
        ['8', 'country'],
        ['9', 'customer'],
        ['10', 'dscp'],
        ['11', 'fingerprint'],
        ['12', 'icmp'],
        ['13', 'interface'],
        ['14', 'ip_precedence'],
        ['15', 'ipv6'],
        ['16', 'ipv6_tcp'],
        ['17', 'ipv6_udp'],
        ['18', 'mpls'],
        ['19', 'mpls_pe'],
        ['20', 'mpls_qos'],
        ['21', 'network'],
        ['22', 'nexthop'],
        ['23', 'packet_length'],
        ['24', 'peer'],
        ['25', 'prefix'],
        ['26', 'profile'],
        ['27', 'protocol'],
        ['28', 'region'],
        ['29', 'router'],
        ['30', 'service'],
        ['31', 'tcp_port'],
        ['32', 'tms'],
        ['33', 'tos'],
        ['34', 'tos_dtrm'],
        ['35', 'udp_port'],
        ['36', 'vpn'],
        ['37', 'vpnsite']
    ]
});