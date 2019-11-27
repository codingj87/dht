/**
 * Created by go on 15. 9. 9.
 */
Ext.define('dhcp.overrides.window.Window', {
    override: 'Ext.window.Window',
    //constrain: true,
    modal: true,
    resizable: false,
    draggable: false
    //referenceHolder: true,
    //defaultListenerScope: true,
});