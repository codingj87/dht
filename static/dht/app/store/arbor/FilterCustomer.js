/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.FilterCustomer', {
    extend: 'Ext.data.Store',
    alias: 'store.filtercustomer',

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
        ['23', 'r_as'],
        ['24', 'r_as_origin'],
        ['25', 'r_community'],
        ['26', 'r_nexthop'],
        ['27', 'recent_flows'],
        ['28', 'region'],
        ['29', 'retransmit_pct'],
        ['30', 'router'],
        ['31', 'service'],
        ['32', 'src24'],
        ['33', 'tcp_port'],
        ['34', 'tos'],
        ['35', 'tos_dtrm'],
        ['36', 'udp_port']
    ]
});