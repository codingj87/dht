/**
 * Created by zen on 19. 1. 31.
 */
Ext.define('dhcp.view.logsearch.LogSearch', {
  extend: 'Ext.Container',

  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.tab.Panel',
    'dhcp.view.logsearch.LogSearchController',
    'dhcp.view.logsearch.LogSearchModel',
    'dhcp.view.logsearch.accountlogsearch.AccountLogSearch',
    'dhcp.view.logsearch.authlogsearch.AuthLogSearch'
    // 'dht.view.logsearch.iplog.IPLog',
    // 'dht.view.logsearch.deviceuselog.DeviceUseLog'
  ],
  xtype: 'logsearch',

  viewModel: {
    type: 'logsearch'
  },

  controller: 'logsearch',

  layout: 'fit',
  items: [
    {
      xtype: 'container',
      layout: { type: 'hbox', align: 'stretch' },
      defaults: { margin: 10 },
      items: [
        {
          xtype: 'tabpanel',
          flex: 1,
          items: [
            { xtype: 'accountlogsearch' },
            { xtype: 'authlogsearch' }
            // { xtype: 'iplog' },
            // { xtype: 'deviceuselog' }
          ]
        }
      ]
    }
  ]
});
