/**
 * Created by zen on 19. 1. 30.
 */
Ext.define(
  'dhcp.view.authenticationmanagement.devicemacregistration.DeviceMacRegistration',
  {
    extend: 'Ext.Container',

    requires: [
      'Ext.button.Button',
      'Ext.container.Container',
      'Ext.form.Panel',
      'Ext.form.field.Text',
      'Ext.grid.Panel',
      'Ext.layout.container.HBox',
      'Ext.layout.container.Table',
      'Ext.layout.container.VBox',
      'Ext.panel.Panel',
      'Ext.toolbar.Fill',
      'Ext.toolbar.Paging',
      'Ext.toolbar.Toolbar',
      'dht.ux.plugin.ClearButton',
      'dht.ux.plugin.EnterKeyHandler',
      'dhcp.view.authenticationmanagement.devicemacregistration.DeviceMacRegistrationController',
      'dhcp.view.authenticationmanagement.devicemacregistration.DeviceMacRegistrationModel',
      'dht.view.common.SearchButton'
    ],

    xtype: 'devicemacregistration',
    viewModel: {
      type: 'devicemacregistration'
    },
    controller: 'devicemacregistration',
    title: '사용자',
    layout: { type: 'vbox', align: 'stretch' },
    items: [
      {
        xtype: 'panel',
        border: true,
        bodyPadding: '10 5 0 10',
        layout: { type: 'vbox', align: 'stretch' },
        items: [
          {
            xtype: 'form',
            reference: 'searchForm',
            layout: {
              type: 'table',
              columns: 8,
              tableAttrs: { style: { width: '100%' } }
            },
            defaults: { labelWidth: 110, width: '100%' },
            items: [
              {
                xtype: 'textfield',
                fieldLabel: '사용자 ID',
                name: 'userid',
                // flex: 1,
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'handleSearch' }
                ]
              },
              {
                xtype: 'textfield',
                fieldLabel: '사용자 MAC',
                name: 'mac',
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'handleSearch' }
                ]
              },
              {
                xtype: 'textfield',
                fieldLabel: '사용자 IP',
                name: 'ip',
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'handleSearch' }
                ]
              },
              {
                xtype: 'textfield',
                fieldLabel: 'NAS',
                name: 'nas',
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'handleSearch' }
                ]
              },
              {
                xtype: 'searchbutton',
                reference: 'searchBT',
                width: 125,
                margin: '-10 100 0 10',
                handler: 'handleSearch'
              },
              {
                xtype: 'button',
                reference: 'createButton',
                iconCls: 'x-fa fa-plus',
                margin: '-10 0 0 0',
                position: '0 10 0 0',
                text: '등록',
                tooltip: '등록',
                handler: 'handleCreate'
              },
              {
                xtype: 'button',
                reference: 'updateButton',
                iconCls: 'x-fa fa-check',
                margin: '-10 0 0 0',
                text: '수정',
                tooltip: '수정',
                handler: 'handleUpdate',
                bind: { disabled: '{!grid.selection}' }
              },
              {
                xtype: 'button',
                reference: 'deleteButton',
                iconCls: 'x-fa fa-minus',
                margin: '-10 0 0 0',
                text: '삭제',
                tooltip: '삭제',
                handler: 'handleDelete',
                bind: { disabled: '{!grid.selection}' }
              },
              {
                xtype: 'textfield',
                fieldLabel: '비고',
                name: 'desc',
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'handleSearch' }
                ]
              },
              // {
              //   xtype: 'textfield',
              //   fieldLabel: 'Tunnel IP',
              //   name: 'tunnel_ip',
              //   plugins: [
              //     'clearbutton',
              //     { ptype: 'enterkeyhandler', handler: 'handleSearch' }
              //   ]
              // },
              // {
              //   xtype: 'textfield',
              //   fieldLabel: '고객사 네트워크',
              //   name: 'eth_network',
              //   plugins: [
              //     'clearbutton',
              //     { ptype: 'enterkeyhandler', handler: 'handleSearch' }
              //   ]
              // },
              { xtype: 'displayfield' },
              { xtype: 'displayfield' },
              { xtype: 'displayfield' },
              {
                xtype: 'button',
                iconCls: 'x-fa fa-file-excel-o',
                tooltip: '엑셀 다운로드',
                text: '엑셀 다운로드',
                handler: 'handleExcel',
                margin: '-10 0 0 10',
                width: 125,
                cls: 'button-excel',
                plugins: null
              }
            ]
          }
        ]
      },
      {
        xtype: 'grid',
        reference: 'grid',
        flex: 1,
        border: true,
        columns: {
          defaults: { align: 'center', flex: 1 },
          items: [
            { text: '사용자 ID', dataIndex: 'userid' },
            { text: '사용자 MAC', dataIndex: 'mac' },
            { text: '사용자 IP', dataIndex: 'ip' },
            { text: 'NAS', dataIndex: 'nas' },
            { text: '비고', dataIndex: 'desc' }
          ]
        },
        // viewConfig: {enableTextSelection: true},
        bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
        bind: { store: '{gridStore}' },
        listeners: { itemdblclick: 'handleUpdate' }
      }
    ]
  }
);
