/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.FilterProfile', {
    extend: 'Ext.data.Store',
    alias: 'store.filterprofile',

    fields: [ 'value', 'display' ],
    data: [
        ['0',  'none'],
        ['1',  'application'],
        ['2',  'as'],
        ['3',  'as_origin'],
        ['4',  'as_peer'],
        ['5',  'city'],
        ['6',  'country'],
        ['7',  'customer'],
        ['8',  'dscp'],
        ['9',  'fingerprint'],
        ['10', 'icmp'],
        ['11', 'interface'],
        ['12', 'interface_ext'],
        ['13', 'ip_precedence'],
        ['14', 'ipv6_tcp'],
        ['15', 'ipv6_udp'],
        ['16', 'missing_pct'],
        ['17', 'nexthop'],
        ['18', 'packet_length'],
        ['19', 'peer'],
        ['20', 'profile'],
        ['21', 'protocol'],
        ['22', 'protocol_offnet'],
        ['23', 'recent_flows'],
        ['24', 'region'],
        ['25', 'retransmit_pct'],
        ['26', 'router'],
        ['27', 'service'],
        ['28', 'src24'],
        ['29', 'tcp_port'],
        ['30', 'tos'],
        ['31', 'tos_dtrm'],
        ['32', 'udp_port']
    ]
});
