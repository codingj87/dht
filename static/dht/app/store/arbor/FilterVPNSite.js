/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.FilterVPNSite', {
    extend: 'Ext.data.Store',
    alias: 'store.filtervpnsite',

    fields: [ 'value', 'display' ],
    data: [
        ['0',  'none'],
        ['1',  'application'],
        ['2',  'dscp'],
        ['3',  'icmp'],
        ['4',  'ip_precedence'],
        ['5',  'mpls_qos'],
        ['6',  'packet_length'],
        ['7',  'protocol'],
        ['8',  'recent_flows'],
        ['9',  'tcp_port'],
        ['10', 'tos'],
        ['11', 'tos_dtrm'],
        ['12', 'udp_port'],
        ['13', 'vpnsite']
    ]
});
