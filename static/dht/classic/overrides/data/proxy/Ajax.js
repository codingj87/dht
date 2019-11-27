/**
 * Created by go on 15. 7. 14.
 */
Ext.define('dhcp.overrides.data.proxy.Ajax', {
    override: 'Ext.data.proxy.Ajax',
    defaultActionMethods: {
        create : 'POST',
        read   : 'POST',
        update : 'POST',
        destroy: 'POST'
    },
    config: {
        actionMethods: {
            create : 'POST',
            read   : 'POST',
            update : 'POST',
            destroy: 'POST'
        }
    }
});