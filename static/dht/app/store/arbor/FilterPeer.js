/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.FilterPeer', {
    extend: 'Ext.data.Store',
    alias: 'store.filterpeer',

    fields: [ 'value', 'display' ],
    data: [
        ['0',  'none'],
        ['1',  'application'],
        ['2',  'as'],
        ['3',  'as_origin'],
        ['4',  'aspath'],
        ['5',  'bgp_stats'],
        ['6',  'bgp_summary'],
        ['7',  'city'],
        ['8',  'community'],
        ['9',  'country'],
        ['10', 'customer'],
        ['11', 'dscp'],
        ['12', 'fingerprint'],
        ['13', 'icmp'],
        ['14', 'interface'],
        ['15', 'ip_precedence'],
        ['16', 'ipv6_tcp'],
        ['17', 'ipv6_udp'],
        ['18', 'nexthop'],
        ['19', 'packet_length'],
        ['20', 'pathlen'],
        ['21', 'peer'],
        ['22', 'prefix'],
        ['23', 'profile'],
        ['24', 'protocol'],
        ['25', 'r_as'],
        ['26', 'r_as_origin'],
        ['27', 'r_as_peer'],
        ['28', 'r_community'],
        ['29', 'r_nexthop'],
        ['30', 'recent_flows'],
        ['31', 'region'],
        ['32', 'router'],
        ['33', 'tcp_port'],
        ['34', 'tos'],
        ['35', 'tos_dtrm'],
        ['36', 'udp_port']
    ]                          
});
