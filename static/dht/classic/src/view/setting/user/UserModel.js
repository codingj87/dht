/**
 * Created by go on 16. 4. 12.
 */
Ext.define('dht.view.setting.user.UserModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.user',

    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    stores: {
        gridStore: {
            proxy: {
                type: 'ajax',
                url: '/user/listup',
                reader: {type: 'json', rootProperty: 'data', totalProperty: 'totalCount'}
            },
            autoLoad: true,
            listeners: {beforeload: 'gridStoreBeforeload'}
        }
    },

    data: {
    }
});