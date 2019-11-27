/**
 * Created by zen on 19. 4. 12.
 */
Ext.define('dht.view.dhcp.clustermanagement.ClusterManagementModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.clustermanagement',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],
  stores: {
    gridStore: {
      proxy: {
        type: 'ajax',
        url: '/cluster/list_up',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: true
    },
    ipGridStore: {},
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
      listeners: { load: 'gridStoreLoad', beforeload: 'handleBeforeLoad' }
    }
  },
  data: {}
});
