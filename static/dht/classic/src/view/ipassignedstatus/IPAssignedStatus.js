/**
 * Created by jjol on 16. 10. 11.
 */

Ext.define('dhcp.view.ipassignedstatus.IPAssignedStatus', {
  extend: 'Ext.Container',
  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.tab.Panel',
    'dhcp.view.ipassignedstatus.IPAssignedStatusController',
    'dhcp.view.ipassignedstatus.IPAssignedStatusModel',
    'dhcp.view.ipassignedstatus.iplog.IPLog',
    'dhcp.view.ipassignedstatus.ipsearch.IPSearch',
    'dhcp.view.ipassignedstatus.ipstats.IPStats'
  ],
  xtype: 'ipassignedstatus',
  viewModel: { type: 'ipassignedstatus' },
  controller: 'ipassignedstatus',

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
            { xtype: 'ipstats' },
            { xtype: 'iplog' },
            { xtype: 'ipsearch' }
          ]
        }
      ]
    }
  ]
});
