/**
 * Created by zen on 19. 5. 13.
 */
Ext.define('dhcp.view.logsearch.accountlogsearch.AccountLogSearchModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.accountlogsearch',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],

  stores: {
    gridStore: {
      proxy: {
        type: 'ajax',
        url: '/account_log/list/',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: true,
      listeners: { beforeload: 'gridStoreBeforeload', load: 'gridStoreLoad' }
    },
    statusComboStore: {
      fields: ['value', 'display'],
      data: [
        { display: 'all', value: '*' },
        { display: 'Start', value: 'Start' },
        { display: 'Interim-Update', value: 'Interim-Update' },
        { display: 'Stop', value: 'Stop' },
        { display: 'Stop-abnormal', value: 'Stop-abnormal' }
      ]
    },
    terminateComboStore: {
      fields: ['value', 'display'],
      data: [
        { display: 'all', value: '*' },
        { display: 'Session-Timeout', value: 'Session-Timeout' },
        { display: 'Idle-Timeout', value: 'Idle-Timeout' }
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
