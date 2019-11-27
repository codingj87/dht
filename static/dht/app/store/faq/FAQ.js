Ext.define('dht.store.faq.FAQ', {
    extend: 'Ext.data.Store',
    alias: 'store.faq',

    model: 'dht.model.faq.Category',

    proxy: {
        type: 'api',
        url: '~api/faq/faq'
    }
});
