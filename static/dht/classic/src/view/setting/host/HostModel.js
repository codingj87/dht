/**
 * Created by jjol on 16. 10. 26.
 */

Ext.define('dht.view.setting.host.HostModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.host',

    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    stores: {
        gridStore: {
            proxy: {
                type: 'ajax',
                url: '/host/list_up',
                reader: {type: 'json', rootProperty: 'data', totalProperty: 'totalCount'},
                extraParams: {mode: 'grid'}
            },
            autoLoad: true
        }
    },

    data: {
        selectGroupName: 'ALL',
        selectGroupID: null
    }
});