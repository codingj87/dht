/**
 * Created by jjol on 16. 10. 11.
 */

Ext.define('dht.view.dhcp.DHCPModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.dhcp',

    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    stores: {
        hostGridStore: {
            proxy: {
                type: 'ajax',
                url: '/host/list_up',
                reader: {type: 'json', rootProperty: 'data', totalProperty: 'totalCount'}
            },
            autoLoad: true
        }
    },
    data: {
        selectGroupName: '',
        selectGroupID: ''
    }
});