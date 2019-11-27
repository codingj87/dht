/**
 * Created by zen on 18. 7. 10.
 */
Ext.define('dht.view.setting.replication.ReplicationModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.replication',

    stores: {
        nodeInfo: {
            proxy:{
                type:'ajax',
                url:'/replication/nodeInfo',
                reader:{
                    type:'json',
                    rootProperty:'data'
                }
            },
            autoLoad: true,
            listeners: {
                'load': 'loadReplicationStatus'
            }
        }
    },

    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    }
});