/**
 * Created by zen on 18. 5. 31.
 */
Ext.define('dhcp.view.logmanagement.eventlog.EventLogModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.eventlog',

    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    stores: {
        gridStore: {
            proxy: {
                type: 'ajax',
                url: '/event_log/list_up',
                reader: {type: 'json', rootProperty: 'data', totalProperty: 'totalCount'}
            },
            autoLoad: true,
            listeners: {beforeload: 'gridStoreBeforeload', load: 'gridStoreLoad'}
        }
    },

    data: {
        searchForm: {
            sdate: new Date(),
            edate: new Date()
        }
    }
});