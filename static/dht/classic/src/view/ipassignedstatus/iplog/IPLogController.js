/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dhcp.view.ipassignedstatus.iplog.IPLogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.iplog',

    gridStoreBeforeload: function (store) {
        store.getProxy().setExtraParams(this.lookupReference('searchForm').getValues());
    },

    gridStoreLoad: function () {
        this.lookupReference('searchBT').setLoading(false);
    },

    onSearch: function () {
        if (this.lookupReference('searchForm').isValid()) {
            this.lookupReference('searchBT').setLoading(false);
            this.getViewModel().getStore('gridStore').loadPage(1);
        } else {
            Ext.Msg.alert('알림', '필요한 형식을 입력해주세요.')
        }
    },
    onExcel: function () {
        const mode = 'xls',
            store = this.lookupReference('grid').getStore(),
            params = this.lookupReference('searchForm').getValues();

        if (store.getTotalCount() > 65536) {
            Ext.Msg.alert('오류', '엑셀 최대 레코드수를 초과했습니다.');
            return;
        }
        params['mode'] = mode;
        dhcp.excel('/ip_log/excel', params);
    }
});