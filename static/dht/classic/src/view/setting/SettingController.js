/**
 * Created by go on 16. 4. 8.
 */
Ext.define('dht.view.setting.SettingController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.setting',

    /**
     * Called when the view is created
     */
    showDBReplication: function() {
        if(DB_Replication  === '0') {
            this.lookupReference('tabpanel').child('#replication').tab.hide();
        } else if(DB_Replication  === '1') {
            this.lookupReference('tabpanel').child('#replication').tab.show();
        } else {
            this.lookupReference('tabpanel').child('#replication').tab.hide();
        }
    }
});