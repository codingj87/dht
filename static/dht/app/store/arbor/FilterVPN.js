/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.FilterVPN', {
    extend: 'Ext.data.Store',
    alias: 'store.filtervpn',

    fields: [ 'value', 'display' ],
    data: [
        ['0',  'none'],
        ['1',  'application'],
        ['2',  'dscp'],
        ['3',  'icmp'],
        ['4',  'interface'],
        ['5',  'ip_precedence'],
        ['6',  'mpls_qos'],
        ['7',  'packet_length'],
        ['8',  'protocol'],
        ['9',  'recent_flows'],
        ['10', 'router'],
        ['11', 'tcp_port'],
        ['12', 'tos'],
        ['13', 'tos_dtrm'],
        ['14', 'udp_port']
    ]
});
