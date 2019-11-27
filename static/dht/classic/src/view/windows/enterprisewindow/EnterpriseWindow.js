/**
 * Created by zen on 19. 1. 28.
 */
Ext.define('dhcp.view.windows.enterprisewindow.EnterpriseWindow', {
  extend: 'Ext.window.Window',

  requires: [
    'Ext.button.Button',
    'Ext.form.Panel',
    'Ext.form.field.Text',
    'Ext.layout.container.VBox',
    'dhcp.view.windows.enterprisewindow.EnterpriseWindowController',
    'dhcp.view.windows.enterprisewindow.EnterpriseWindowModel'
  ],

  xtype: 'enterprisewindow',

  viewModel: {
    type: 'enterprisewindow'
  },

  controller: 'enterprisewindow',

  autoShow: true,
  bodyPadding: 10,
  height: 200,
  width: 400,
  scrollable: true,
  modal: true,
  items: [
    {
      xtype: 'form',
      reference: 'form',
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      items: [
        {
          xtype: 'textfield',
          labelWidth: 80,
          name: 'type',
          fieldLabel: 'NAS Type',
          // allowBlank: false,
          msgTarget: 'under'
        },
        {
          xtype: 'textfield',
          labelWidth: 80,
          name: 'desc',
          fieldLabel: '비고'
        }
      ]
    }
  ],
  buttons: [
    { xtype: 'button', text: '실행', handler: 'onSave' },
    { xtype: 'button', text: '취소', handler: 'onCancel' }
  ]
});
