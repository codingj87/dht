/**
 * Created by jjol on 16. 10. 25.
 */

Ext.define('dhcp.view.ipassignedstatus.ipsearch.IPSearchController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ipsearch',

    gridStoreBeforeload: function(store) {
        store.getProxy().setExtraParams(this.lookupReference('searchForm').getValues());
    },

    gridStoreLoad: function() {
        this.lookupReference('searchBT').setLoading(false);
    },

    onSearch: function() {
        this.lookupReference('searchBT').setLoading(false);
        this.getViewModel().getStore('gridStore').loadPage(1);
    }
});