/**
 * Created by parkyes90 on 18. 01. 09.
 */
Ext.define('dhcp.view.ipassignedstatus.iplog.IPLogModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.iplog',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],
  stores: {
    gridStore: {
      proxy: {
        type: 'ajax',
        url: '/ip_log/list_up',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: true,
      listeners: { beforeload: 'gridStoreBeforeload', load: 'gridStoreLoad' }
    }
  },
  data: {
    searchForm: {
      sdate: new Date(),
      edate: new Date()
    }
  }
});
