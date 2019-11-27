/**
 * Created by zen on 19. 1. 28.
 */
Ext.define('dhcp.view.ipaddressmanagement.IPAddressManagement', {
  extend: 'Ext.Container',

  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.tab.Panel',
    'dhcp.view.ipaddressmanagement.IPAddressManagementController',
    'dhcp.view.ipaddressmanagement.IPAddressManagementModel',
    // 'dht.view.ipaddressmanagement.ippoolsetting.IPPoolSetting',
    'dhcp.view.ipaddressmanagement.ipstatus.IPStatus'
  ],

  xtype: 'ipaddressmanagement',

  viewModel: {
    type: 'ipaddressmanagement'
  },

  controller: 'ipaddressmanagement',
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
            // {xtype: 'ippoolsetting'},
            { xtype: 'ipstatus' }
          ]
        }
      ]
    }
  ]
});
