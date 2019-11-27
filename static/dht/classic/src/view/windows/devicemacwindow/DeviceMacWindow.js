/**
 * Created by zen on 19. 1. 31.
 */
Ext.define('dhcp.view.windows.devicemacwindow.DeviceMacWindow', {
  extend: 'Ext.window.Window',

  requires: [
    'Ext.button.Button',
    'Ext.form.Panel',
    'Ext.form.field.ComboBox',
    'Ext.form.field.Text',
    'Ext.layout.container.VBox',
    'dhcp.view.windows.devicemacwindow.DeviceMacWindowController',
    'dhcp.view.windows.devicemacwindow.DeviceMacWindowModel'
  ],

  xtype: 'devicemacwindow',
  viewModel: {
    type: 'devicemacwindow'
  },
  controller: 'devicemacwindow',
  // autoShow: true,
  bodyPadding: 10,
  height: 360,
  width: 450,
  scrollable: true,
  modal: true,
  items: [
    {
      xtype: 'form',
      reference: 'form',
      layout: { type: 'vbox', align: 'stretch' },
      // defaults: {allowBlank: false},
      items: [
        {
          xtype: 'textfield',
          fieldLabel: '사용자 ID',
          name: 'userid',
          labelWidth: 100
          // allowBlank: false
        },
        {
          xtype: 'textfield',
          fieldLabel: '사용자 비밀번호',
          name: 'password',
          labelWidth: 100
          // allowBlank: false
        },
        {
          xtype: 'textfield',
          fieldLabel: '사용자 MAC',
          name: 'mac',
          labelWidth: 100,
          // allowBlank: false,
          vtype: 'CheckMacAddress',
          msgTarget: 'under'
        },
        {
          xtype: 'textfield',
          fieldLabel: '사용자 IP',
          name: 'ip',
          labelWidth: 100,
          // allowBlank: false,
          vtype: 'CheckIPAddress',
          msgTarget: 'under'
        },
        {
          xtype: 'combobox',
          fieldLabel: 'NAS',
          name: 'nas',
          displayField: 'name',
          valueField: 'id',
          bind: { store: '{nasIdStore}' },
          labelWidth: 100,
          editable: false,
          // allowBlank: false,
          emptyText: '선택하세요.',
          msgTarget: 'under'
        },
        {
          xtype: 'textfield',
          fieldLabel: '비고',
          name: 'desc',
          labelWidth: 100
        }
      ]
    }
  ],
  buttons: [
    { xtype: 'button', text: '등록', handler: 'onSave' },
    { xtype: 'button', text: '취소', handler: 'onCancel' }
  ]
});
