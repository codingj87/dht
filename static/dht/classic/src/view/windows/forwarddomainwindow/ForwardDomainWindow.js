/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.windows.forwarddomainwindow.ForwardDomainWindow', {
  extend: 'Ext.window.Window',

  requires: [
    'Ext.button.Button',
    'Ext.form.Panel',
    'Ext.form.field.Number',
    'Ext.form.field.Text',
    'Ext.grid.Panel',
    'Ext.layout.container.VBox',
    'Ext.toolbar.Paging',
    'dhcp.view.windows.forwarddomainwindow.ForwardDomainWindowController',
    'dhcp.view.windows.forwarddomainwindow.ForwardDomainWindowModel'
  ],

  xtype: 'forwarddomainwindow',

  viewModel: {
    type: 'forwarddomainwindow'
  },

  controller: 'forwarddomainwindow',
  modal: true,
  scrollable: true,
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
      items: [
        {
          xtype: 'textfield',
          reference: 'domainRef',
          bind: {
            fieldLabel: '{label}',
            name: '{name}',
            vtype: '{vtype}',
            value: '{domain}'
          }
        },
        {
          name: 'email',
          xtype: 'textfield',
          fieldLabel: '이메일',
          vtype: 'email'
        },
        {
          name: 'master',
          xtype: 'textfield',
          fieldLabel: 'Master',
          vtype: 'domain'
        },
        {
          name: 'slave',
          xtype: 'textfield',
          fieldLabel: 'Slave',
          vtype: 'domain'
        },
        {
          name: 'refresh',
          fieldLabel: 'Refresh'
        },
        {
          name: 'retry',
          fieldLabel: 'Retry'
        },
        {
          name: 'expire',
          fieldLabel: 'Expire'
        },
        {
          name: 'minimum_ttl',
          fieldLabel: 'Minimum TTL'
        },
        {
          name: 'ttl',
          fieldLabel: 'Default TTL'
        }
      ]
    },
    {
      xtype: 'grid',
      height: 500,
      padding: 10,
      title: '레코드 입력',
      reference: 'grid',
      scrollable: true,
      listeners: {
        itemdblclick: 'onUpdate'
      },
      border: true,
      bind: { store: '{recordStore}' },
      bbar: { xtype: 'pagingtoolbar', bind: { store: '{recordStore}' } },
      tools: [
        {
          xtype: 'button',
          text: '레코드 생성',
          cls: 'bg_create',
          margin: 5,
          iconCls: 'x-fa fa-plus',
          handler: 'onCreate'
        },
        {
          xtype: 'button',
          text: '레코드 변경',
          cls: 'bg_update',
          handler: 'onUpdate',
          margin: 5,
          bind: { disabled: '{!grid.selection}' },
          iconCls: 'x-fa fa-edit'
        },
        {
          xtype: 'button',
          text: '레코드 삭제',
          cls: 'bg_delete',
          bind: { disabled: '{!grid.selection}' },
          margin: 5,
          handler: 'onRemove',
          iconCls: 'x-fa fa-minus'
        }
      ],
      columns: {
        defaults: { align: 'center', flex: 1 },
        items: [
          { text: 'HOST', dataIndex: 'record_host' },
          { text: 'TYPE', dataIndex: 'record_type' },
          { text: 'VALUE', dataIndex: 'record_value' }
        ]
      }
    }
  ],
  buttons: [
    { xtype: 'button', text: '저장', handler: 'handleSave' },
    { xtype: 'button', text: '취소', handler: 'handleCancel' }
  ]
});
