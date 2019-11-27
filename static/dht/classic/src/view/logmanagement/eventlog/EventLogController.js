/**
 * Created by zen on 18. 5. 31.
 */

Ext.define('dhcp.view.logmanagement.eventlog.EventLogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.eventlog',

    gridStoreBeforeload: function(store) {
        store.getProxy().setExtraParams(this.lookupReference('searchForm').getValues());
    },

    gridStoreLoad: function() {
        this.lookupReference('searchBT').setLoading(false);
    },

    onSearch: function() {
        if (this.lookupReference('searchForm').isValid()) {
            this.lookupReference('searchBT').setLoading(false);
            this.getViewModel().getStore('gridStore').loadPage(1);
        } else {
            Ext.Msg.alert('알림', '올바른 형식을 입력해주세요.');
        }
    }
});