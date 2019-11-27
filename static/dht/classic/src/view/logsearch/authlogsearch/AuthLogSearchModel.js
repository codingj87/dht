/**
 * Created by zen on 19. 1. 31.
 */
Ext.define('dhcp.view.logsearch.authlogsearch.AuthLogSearchModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.authlogsearch',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],

  stores: {
    gridStore: {
      proxy: {
        type: 'ajax',
        url: '/log_search/list/',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: true,
      listeners: { beforeload: 'gridStoreBeforeload', load: 'gridStoreLoad' }
    },
    comboStore: {
      fields: ['value', 'display'],
      data: [
        { display: 'all', value: '*' },
        { display: 'Account On', value: 'Accounting-On' },
        { display: 'Account Off', value: 'Accounting-Off' },
        { display: 'Access Request', value: 'Access-Request' },
        { display: 'Interim Update', value: 'Interim-Update' },
        { display: 'Start', value: 'Start' },
        { display: 'Stop', value: 'Stop' }
      ]
    }
  },
  data: {
    searchForm: {
      sdate: new Date(),
      edate: new Date()
    }
  }
});
