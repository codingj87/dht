/**
 * Created by jjol on 16. 10. 18.
 */

Ext.define('dhcp.view.ipassignedstatus.ipstats.IPStatsModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.ipstats',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],
  stores: {
    gridStore: {
      proxy: {
        type: 'ajax',
        url: '/ip_stats/list_up',
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
  data: {}
});
