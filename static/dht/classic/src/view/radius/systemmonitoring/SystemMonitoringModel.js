/**
 * Created by parkyes90 on 18. 01. 09.
 */
Ext.define('dhcp.view.radius.systemmonitoring.SystemMonitoringModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.systemmonitoring',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],

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
  },
  data: {
    searchForm: {
      sdate: moment().subtract(1, 'd')._d,
      edate: moment()._d
    }
  }
});
