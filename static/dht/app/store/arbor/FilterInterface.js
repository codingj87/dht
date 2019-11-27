/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.FilterInterface', {
    extend: 'Ext.data.Store',
    alias: 'store.filterinterface',

    fields: [ 'value', 'display' ],
    data: [
        ['0',  'none'],
        ['1',  'application'],
        ['2',  'as'],
        ['3',  'as2as_in'],
        ['4',  'as2as_out'],
        ['5',  'as2peer_in'],
        ['6',  'as_origin'],
        ['7',  'as_peer'],
        ['8',  'aspath'],
        ['9',  'community'],
        ['10', 'customer'],
        ['11', 'dscp'],
        ['12', 'fingerprint'],
        ['13', 'icmp'],
        ['14', 'interface_stats'],
        ['15', 'ip_precedence'],
        ['16', 'ipv6_tcp'],
        ['17', 'ipv6_udp'],
        ['18', 'mpls'],
        ['19', 'mpls_pe'],
        ['20', 'mpls_qos'],
        ['21', 'nexthop'],
        ['22', 'packet_length'],
        ['23', 'pathlen'],
        ['24', 'peer'],
        ['25', 'prefix'],
        ['26', 'profile'],
        ['27', 'protocol'],
        ['28', 'r_as'],
        ['29', 'r_as_origin'],
        ['30', 'r_as_peer'],
        ['31', 'r_community'],
        ['32', 'r_nexthop'],
        ['33', 'recent_flows'],
        ['34', 'tcp_port'],
        ['35', 'tos'],
        ['36', 'tos_dtrm'],
        ['37', 'udp_port']
    ]                          
});
