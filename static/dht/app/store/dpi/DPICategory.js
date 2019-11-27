/**
 * Created by go on 16. 5. 12.
 */
Ext.define('dht.store.dpi.DPICategory', {
    extend: 'Ext.data.Store',

    alias: 'store.dpi_category',

    proxy: {
        type: 'ajax',
        url: '/combo/dpi_category',
        reader: { type: 'json', rootProperty: 'data' }
    },
    autoLoad: true
});

