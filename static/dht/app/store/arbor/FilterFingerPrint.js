/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.FilterFingerPrint', {
    extend: 'Ext.data.Store',
    alias: 'store.filterfingerprint',

    fields: [ 'value', 'display' ],
    data: [
        ['0',  'none'],
        ['1',  'application'],
        ['2',  'atf'],
        ['3',  'city'],
        ['4',  'country'],
        ['5',  'customer'],
        ['6',  'interface'],
        ['7',  'interface_ext'],
        ['8',  'packet_length'],
        ['9',  'peer'],
        ['10', 'profile'],
        ['11', 'protocol'],
        ['12', 'region'],
        ['13', 'router'],
        ['14', 'tcp_port'],
        ['15', 'udp_port'],
        ['16', 'vpnsite']
    ]                          
});
