/**
 * Created by jjol on 16. 10. 25.
 */
Ext.define('dhcp.view.ipassignedstatus.ipsearch.IPSearchModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.ipsearch',

    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    stores:{
        gridStore: {
            proxy: {
                type: 'ajax',
                url: '/ip_search/list_up',
                reader: {type: 'json', rootProperty: 'data', totalProperty: 'totalCount'}
            },
            autoLoad: true,
            listeners: {beforeload: 'gridStoreBeforeload', load: 'gridStoreLoad'}
        }
    },
    data: {
    }
});