/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.domainmanagement.DomainManagement', {
  extend: 'Ext.Container',

  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.tab.Panel',
    'dhcp.view.domainmanagement.DomainManagementController',
    'dhcp.view.domainmanagement.DomainManagementModel',
    'dhcp.view.domainmanagement.cachedomain.CacheDomain',
    'dhcp.view.domainmanagement.forwarddomain.ForwardDomain',
    'dhcp.view.domainmanagement.reversedomain.ReverseDomain'
  ],

  xtype: 'domainmanagement',

  viewModel: {
    type: 'domainmanagement'
  },

  controller: 'domainmanagement',
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
            { xtype: 'forwarddomain' },
            { xtype: 'reversedomain' },
            { xtype: 'cachedomain' }
          ]
        }
      ]
    }
  ]
});
