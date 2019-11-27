/**
 * Created by zen on 19. 4. 12.
 */
Ext.define('dht.view.windows.clusterwindow.ClusterWindow', {
  extend: 'Ext.window.Window',

  requires: [
    'Ext.form.Panel',
    'Ext.form.field.Text',
    'Ext.layout.container.VBox',
    'dht.view.windows.clusterwindow.ClusterWindowController',
    'dht.view.windows.clusterwindow.ClusterWindowModel',
    'Ext.button.Button'
  ],

  xtype: 'clusterwindow',

  viewModel: {
    type: 'clusterwindow'
  },
  width: 600,
  height: 250,
  modal: true,
  scrollable: true,
  controller: 'clusterwindow',
  iconCls: 'x-fa fa-plus',

  items: [
    {
      xtype: 'form',
      reference: 'form',
      layout: { type: 'vbox', align: 'stretch' },
      bodyPadding: 10,
      border: false,
      defaults: {
        allowBlank: false,
        xtype: 'textfield'
      },
      items: [
        {
          name: 'name',
          fieldLabel: '호스트 명',
          bind: '{name}'
        },
        {
          name: 'vip',
          fieldLabel: 'VIP',
          bind: '{vip}',
          vtype: 'IPAddress'
        }
      ]
    }
  ],
  buttons: [
    { xtype: 'button', text: '저장', handler: 'handleSave' },
    { xtype: 'button', text: '취소', handler: 'handleCancel' }
  ]
});
