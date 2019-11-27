/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.Router', {
    extend: 'Ext.data.Store',
    alias: 'store.router',

    fields: ['value', 'display', 'tags', 'desc'],
    data: [
    ]
});