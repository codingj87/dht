/**
 * Created by parkyes90 on 18. 01. 09.
 */
Ext.define('dht.view.dhcp.serverstatus.ServerStatusModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.serverstatus',

  stores: {
    serverGridStore: {
      proxy: {
        type: 'ajax',
        url: '/server_status/server_list_up',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'totalCount'
        }
      },
      groupField: 'status',
      autoLoad: true,
      listeners: { load: 'gridStoreLoad' }
    }
  }
});
