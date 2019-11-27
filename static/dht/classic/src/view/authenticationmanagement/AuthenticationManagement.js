/**
 * Created by zen on 19. 1. 28.
 */
Ext.define('dhcp.view.authenticationmanagement.AuthenticationManagement', {
  extend: 'Ext.Container',

  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.tab.Panel',
    'dhcp.view.authenticationmanagement.AuthenticationManagementController',
    'dhcp.view.authenticationmanagement.AuthenticationManagementModel',
    'dhcp.view.authenticationmanagement.enterpriseregistration.EnterpriseRegistration',
    'dhcp.view.authenticationmanagement.emhsregistration.EMHSRegistration',
    'dhcp.view.authenticationmanagement.devicemacregistration.DeviceMacRegistration'
  ],

  xtype: 'authenticationmanagement',

  viewModel: {
    type: 'authenticationmanagement'
  },

  controller: 'authenticationmanagement',

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
            { xtype: 'emhsregistration' },
            { xtype: 'enterpriseregistration' },
            { xtype: 'devicemacregistration' }
          ]
        }
      ]
    }
  ]
});
