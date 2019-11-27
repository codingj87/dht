/**
 * Created by jjol on 16. 10. 11.
 */

Ext.define('dht.view.dhcp.DHCP', {
  extend: 'Ext.Container',
  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.tab.Panel',
    'dht.view.dhcp.DHCPController',
    'dht.view.dhcp.DHCPModel',
    'dht.view.dhcp.serverstatus.ServerStatus',
    'dht.view.dhcp.settingmanagement.SettingManagement'
  ],
  xtype: 'dhcp',
  viewModel: { type: 'dhcp' },
  controller: 'dhcp',

  layout: 'fit',
  items: [
    {
      xtype: 'container',
      layout: { type: 'hbox', align: 'stretch' },
      defaults: { margin: 10 },
      items: [
        {
          xtype: 'tabpanel',
          reference: 'dhcpTab',
          flex: 1,
          cls: 'dhcp__tab_panel',

          items: [
            // { xtype: 'serverstatus' },
            { xtype: 'settingmanagement' }
            // {xtype: 'systemlog'}
          ]
        }
      ]
    }
  ]
});
