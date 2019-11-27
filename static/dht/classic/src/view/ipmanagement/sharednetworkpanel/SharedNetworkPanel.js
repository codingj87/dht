/**
 * Created by zen on 19. 2. 20.
 */
Ext.define('dhcp.view.ipmanagement.sharednetworkpanel.SharedNetworkPanel', {
  extend: 'Ext.Container',

  requires: [
    'Ext.button.Button',
    'Ext.container.Container',
    'Ext.form.Panel',
    'Ext.form.field.Display',
    'Ext.form.field.Text',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'dhcp.view.ipmanagement.sharednetworkpanel.SharedNetworkPanelController',
    'dhcp.view.ipmanagement.sharednetworkpanel.SharedNetworkPanelModel'
  ],

  xtype: 'sharednetworkpanel',

  viewModel: {
    type: 'sharednetworkpanel'
  },

  controller: 'sharednetworkpanel',

  items: {
    xtype: 'form',
    reference: 'form',
    layout: { type: 'vbox', align: 'stretch' },
    bodyPadding: 10,
    border: false,
    items: [
      {
        xtype: 'container',
        layout: { type: 'hbox' },
        items: [
          {
            xtype: 'textfield',
            name: 'shared_network',
            labelWidth: 120,
            fieldLabel: 'Shared Network',
            emptyText: 'ex) _10_40_0_0',
            allowBlank: false,
            flex: 2,
            enforceMaxLength: true,
            bind: { value: '{network}', hidden: '{update}' }
          },
          {
            xtype: 'displayfield',
            name: 'shared_network',
            labelWidth: 120,
            flex: 2,
            fieldLabel: 'Shared Network',
            bind: { value: '<b>{network}</b>', hidden: '{!update}' }
          },
          {
            xtype: 'button',
            iconCls: 'x-fa fa-plus',
            tooltip: 'Subnet 추가',
            margin: '0 0 0 10',
            flex: 1,
            handler: 'addCell'
            // bind: {disabled: '{!selectGroupID}'}
          },
          {
            xtype: 'button',
            iconCls: 'x-fa fa-save',
            tooltip: '저장',
            margin: '0 0 0 10',
            flex: 1,
            handler: 'onSave'
            // bind: {disabled: '{!selectGroupID}'}
          },
          {
            xtype: 'container',

            flex: 4
            // bind: {disabled: '{!selectGroupID}'}
          }
        ]
      }
    ]
  },
  listeners: {
    beforeclose: 'onCancel',
    beforeremove: 'onCancel'
  }
});
