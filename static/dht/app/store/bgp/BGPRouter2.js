/**
 * Created by jjol on 16. 7. 28.
 */

Ext.define('dht.store.bgp.BGPRouter2', {
    extend: 'Ext.data.Store',

    alias: 'store.bgp_router2',

    fields: ['value', 'display'],
    data: [
        {value: '', display: '전체'},
        {value: 'KIC101', display: 'KIC101'},
        {value: 'KIC105', display: 'KIC105'},
        {value: 'KIC106', display: 'KIC106'},
        {value: 'KIC107', display: 'KIC107'},
        {value: 'KIC108', display: 'KIC108'},
        {value: 'KIC234', display: 'KIC234'},
        {value: 'KIC235', display: 'KIC235'},
        {value: 'KIC236', display: 'KIC236'},
        {value: 'KIC237', display: 'KIC237'},
        {value: 'KIC238', display: 'KIC238'}
    ]
});

