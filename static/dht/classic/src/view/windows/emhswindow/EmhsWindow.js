/**
 * Created by zen on 19. 1. 28.
 */
Ext.define('dhcp.view.windows.emhswindow.EmhsWindow', {
  extend: 'Ext.window.Window',

  requires: [
    'Ext.button.Button',
    'Ext.form.Panel',
    'Ext.form.field.ComboBox',
    'Ext.form.field.Hidden',
    'Ext.form.field.Text',
    'Ext.layout.container.VBox',
    'dhcp.view.windows.emhswindow.EmhsWindowController',
    'dhcp.view.windows.emhswindow.EmhsWindowModel'
  ],

  xtype: 'emhswindow',
  viewModel: {
    type: 'emhswindow'
  },
  controller: 'emhswindow',
  // bind: {title: '{GET_TITLE}'},
  autoShow: true,
  bodyPadding: 10,
  height: 320,
  width: 400,
  scrollable: true,
  modal: true,
  items: [
    {
      xtype: 'form',
      reference: 'form',
      layout: { type: 'vbox', align: 'stretch' },
      defaults: { labelWidth: 70 },
      items: [
        {
          xtype: 'textfield',
          fieldLabel: '장비명',
          name: 'name',
          msgTarget: 'under'
          // allowBlank: false
        },
        {
          xtype: 'textfield',
          fieldLabel: 'NAS IP',
          name: 'ip',
          // labelWidth: 100,
          vtype: 'CheckIPAddress',
          msgTarget: 'under'
          // allowBlank: false
        },
        {
          xtype: 'combobox',
          fieldLabel: 'NAS type',
          name: 'type',
          displayField: 'type',
          valueField: 'id',
          bind: { store: '{nasTypeStore}' },
          // labelWidth: 100,
          editable: false,
          emptyText: '선택하세요.',
          msgTarget: 'under'
          // allowBlank: false
        },
        // {
        //   xtype: 'textfield',
        //   fieldLabel: '장비 MAC',
        //   name: 'mac',
        //   // labelWidth: 100,
        //   vtype: 'CheckMacAddress',
        //   msgTarget: 'under',
        //   allowBlank: false
        // },
        // {
        //   xtype: 'textfield',
        //   fieldLabel: 'MSISDN',
        //   name: 'msisdn',
        //   // labelWidth: 100,
        //   msgTarget: 'under',
        //   allowBlank: false
        // },
        // {
        //   xtype: 'textfield',
        //   fieldLabel: 'IP',
        //   name: 'tunnel_ip',
        //   // labelWidth: 100,
        //   vtype: 'CheckIPAddress',
        //   msgTarget: 'under',
        //   allowBlank: false
        // },
        // {
        //   xtype: 'textfield',
        //   fieldLabel: '고객사 네트워크',
        //   name: 'eth_network',
        //   // labelWidth: 100,
        //   vtype: 'CheckIPAddress',
        //   msgTarget: 'under'
        // },
        {
          xtype: 'textfield',
          fieldLabel: '비고',
          name: 'desc'
          // labelWidth: 100,
        },
        {
          xtype: 'textfield',
          fieldLabel: 'Secret',
          name: 'secret',
          // labelWidth: 100,
          value: 'zensystems!1',
          msgTarget: 'under'
          // allowBlank: false
        }
        // {
        //   xtype: 'textfield',
        //   fieldLabel: 'status',
        //   name: 'status',
        //   hidden: true,
        //   value: 0
        // }
      ]
    }
  ],
  buttons: [
    { xtype: 'button', text: '등록', handler: 'onSave' },
    { xtype: 'button', text: '취소', handler: 'onCancel' }
  ]
});
