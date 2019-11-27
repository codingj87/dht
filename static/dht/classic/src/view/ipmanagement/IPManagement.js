/**
 * Created by jjol on 16. 10. 11.
 */

Ext.define('dhcp.view.ipmanagement.IPManagement', {
  extend: 'Ext.Container',
  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.tab.Panel',
    'dhcp.view.ipmanagement.IPManagementController',
    'dhcp.view.ipmanagement.IPManagementModel',
    'dhcp.view.ipmanagement.ippoolsetting.IPPoolSetting',
    'dhcp.view.ipmanagement.dhcptemplatesmanagement.DHCPTemplatesManagement'
  ],
  xtype: 'ipmanagement',
  viewModel: { type: 'ipmanagement' },
  controller: 'ipmanagement',

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
          cls: 'dhcp__tab_panel',
          items: [
            { xtype: 'ippoolsetting' },
            { xtype: 'dhcptemplatesmanagement' }
          ]
        }
      ]
    }
  ]
});
