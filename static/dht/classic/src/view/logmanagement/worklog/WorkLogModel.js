/**
 * Created by parkyes90 on 18. 01. 09.
 */
Ext.define('dhcp.view.logmanagement.worklog.WorkLogModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.worklog',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],
  stores: {
    gridStore: {
      proxy: {
        type: 'ajax',
        url: '/work_log/list_up',
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
      sdate: Ext.Date.add(new Date(), Ext.Date.DAY, -7),
      edate: new Date()
    }
    /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
  }
});
