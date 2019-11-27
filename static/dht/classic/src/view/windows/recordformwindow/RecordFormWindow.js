/**
 * Created by zen on 19. 5. 13.
 */
Ext.define('dhcp.view.windows.recordformwindow.RecordFormWindow', {
  extend: 'Ext.window.Window',

  requires: [
    'Ext.button.Button',
    'Ext.form.Panel',
    'Ext.form.field.Number',
    'Ext.layout.container.VBox',
    'dhcp.view.windows.recordformwindow.RecordFormWindowController',
    'dhcp.view.windows.recordformwindow.RecordFormWindowModel'
  ],

  xtype: 'recordformwindow',

  viewModel: {
    type: 'recordformwindow'
  },
  modal: true,
  scrollable: true,
  height: 250,
  width: 300,
  controller: 'recordformwindow',

  items: [
    {
      xtype: 'form',
      reference: 'form',
      layout: { type: 'vbox', align: 'stretch' },
      bodyPadding: 10,
      defaults: {
        flex: 1,
        xtype: 'numberfield',
        msgTarget: 'under',
        allowBlank: false
      },
      items: []
    }
  ],
  buttons: [
    { xtype: 'button', text: '저장', handler: 'handleSave' },
    { xtype: 'button', text: '취소', handler: 'handleCancel' }
  ]
});
