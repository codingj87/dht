/**
 * Created by parkyes90 on 18. 01. 09.
 */
Ext.define('dht.view.dhcp.settingmanagement.SettingManagementModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.settingmanagement',

    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],
    stores:{
        gridStore: {
            proxy: {
                type: 'ajax',
                url: '/setting_management/list_up',
                reader: {type: 'json', rootProperty: 'data', totalProperty: 'totalCount'}
            },
            autoLoad: true,
            listeners: {beforeload: 'gridStoreBeforeload', load: 'gridStoreLoad'}
        }
    },
    data: {
        searchForm: {
            sdate: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            edate: new Date()
        }
    }
});