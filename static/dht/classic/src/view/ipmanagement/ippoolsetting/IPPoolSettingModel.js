/**
 * Created by parkyes90 on 18. 01. 09.
 */
Ext.define('dhcp.view.ipmanagement.ippoolsetting.IPPoolSettingModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.ippoolsetting',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],
  stores: {
    gridStore: {
      proxy: {
        type: 'ajax',
        url: '/ip_pool_setting/list_up',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: true,
      listeners: { beforeload: 'gridStoreBeforeload', load: 'gridStoreLoad' }
    },
    ipGridStore: {}
  },
  data: {}
});
