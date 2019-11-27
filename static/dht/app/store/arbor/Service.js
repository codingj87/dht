/**
 * Created by go on 16. 4. 18.
 */
Ext.define('dht.store.arbor.Service', {
    extend: 'Ext.data.Store',
    alias: 'store.service',

    fields: ['value', 'display', 'tags', 'desc'],
    data: [
        ['27', 'Internet', 'service', 'Default Service matching all default applications for all TMS ports.']
    ]
});