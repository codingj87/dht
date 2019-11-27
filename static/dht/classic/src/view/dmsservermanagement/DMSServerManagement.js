/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.dmsservermanagement.DMSServerManagement', {
  extend: 'Ext.Container',

  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.tab.Panel',
    'dhcp.view.dmsservermanagement.DMSServerManagementController',
    'dhcp.view.dmsservermanagement.DMSServerManagementModel',
    'dhcp.view.dmsservermanagement.dmsservermonitoring.DMSServerMonitoring'
  ],

  xtype: 'dmsservermanagement',

  viewModel: {
    type: 'dmsservermanagement'
  },

  controller: 'dmsservermanagement',
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
          items: [{ xtype: 'dmsservermonitoring' }]
        }
      ]
    }
  ]
});
