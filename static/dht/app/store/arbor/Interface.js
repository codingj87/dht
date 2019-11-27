/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.Interface', {
    extend: 'Ext.data.Store',
    alias: 'store.interface',

    fields: ['value', 'display', 'router', 'tags', 'desc'],
    data: [
    ]
});