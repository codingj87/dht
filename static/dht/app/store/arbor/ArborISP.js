/**
 * Created by go on 16. 5. 12.
 */
Ext.define('dht.store.arbor.ArborISP', {
    extend: 'Ext.data.Store',

    alias: 'store.arbor_isp',

    proxy: {
        type: 'ajax',
        url: '/combo/arbor_isp',
        reader: { type: 'json', rootProperty: 'data' }
    }
});

