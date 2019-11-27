/**
 * Created by zen on 19. 1. 28.
 */
Ext.define('dhcp.view.radius.RADIUS', {
  extend: 'Ext.Container',

  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.tab.Panel',
    'dhcp.view.radius.RADIUSController',
    'dhcp.view.radius.RADIUSModel',
    'dhcp.view.radius.systemmonitoring.SystemMonitoring'
  ],

  xtype: 'radius',
  viewModel: {
    type: 'radius'
  },
  controller: 'radius',

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
            // { xtype: 'user', title: '사용자 관리' },
            { xtype: 'systemmonitoring', title: '시스템 모니터링' }
          ]
        }
      ]
    }
  ]
});
