/**
 * Created by zen on 19. 1. 28.
 */
Ext.define(
  'dhcp.view.authenticationmanagement.emhsregistration.EMHSRegistration',
  {
    extend: 'Ext.Container',

    requires: [
      'Ext.button.Button',
      'Ext.container.Container',
      'Ext.form.Panel',
      'Ext.form.field.Display',
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
      'dhcp.view.authenticationmanagement.emhsregistration.EMHSRegistrationController',
      'dhcp.view.authenticationmanagement.emhsregistration.EMHSRegistrationModel',
      'dht.view.common.SearchButton'
    ],

    xtype: 'emhsregistration',
    viewModel: {
      type: 'emhsregistration'
    },
    controller: 'emhsregistration',
    title: 'NAS',
    layout: { type: 'vbox', align: 'stretch' },
    items: [
      {
        xtype: 'form',
        reference: 'searchForm',
        border: true,
        margin: '0 0 10 0',
        bodyPadding: 4,
        layout: { type: 'vbox', align: 'stretch' },
        items: [
          {
            xtype: 'toolbar',
            layout: { type: 'hbox', align: 'stretch' },
            defaults: { labelWidth: 80 },
            items: [
              {
                xtype: 'textfield',
                fieldLabel: 'NAS',
                name: 'name',
                // flex: 1,
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'handleSearch' }
                ]
              },
              {
                xtype: 'textfield',
                fieldLabel: 'NAS IP',
                name: 'ip',
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'handleSearch' }
                ]
              },
              {
                xtype: 'textfield',
                fieldLabel: 'NAS TYPE',
                name: 'type',
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'handleSearch' }
                ]
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
              {
                xtype: 'searchbutton',
                reference: 'searchBT',
                width: 125,
                margin: '0 5 0 10',
                handler: 'handleSearch'
              },
              {
                xtype: 'button',
                iconCls: 'x-fa fa-file-excel-o',
                tooltip: '엑셀 다운로드',
                text: '엑셀 다운로드',
                handler: 'handleExcel',
                margin: '0 70 0 0',
                width: 125,
                cls: 'button-excel',
                plugins: null
              },
              '->',
              {
                xtype: 'container',
                margin: '0 0 0 10',
                plugins: null,
                layout: { type: 'hbox' },
                style: {
                  float: 'right'
                },
                items: [
                  {
                    xtype: 'button',
                    reference: 'createButton',
                    iconCls: 'x-fa fa-plus',
                    text: '등록',
                    tooltip: '등록',
                    handler: 'handleCreate'
                    // bind: {disabled: '{!selectGroupID}'}
                  },
                  {
                    xtype: 'button',
                    reference: 'updateButton',
                    iconCls: 'x-fa fa-check',
                    text: '수정',
                    tooltip: '수정',
                    handler: 'handleUpdate',
                    bind: { disabled: '{!grid.selection}' }
                  },
                  {
                    xtype: 'button',
                    reference: 'deleteButton',
                    iconCls: 'x-fa fa-minus',
                    text: '삭제',
                    tooltip: '삭제',
                    handler: 'handleDelete',
                    bind: { disabled: '{!grid.selection}' }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        xtype: 'grid',
        reference: 'grid',
        // margin: '10 0 0 0',
        // title: '※ 5G라우터를 관리합니다.',
        flex: 1,
        border: true,
        columns: {
          defaults: { align: 'center', flex: 1 },
          items: [
            { text: 'NAS', dataIndex: 'name' },
            { text: 'NAS IP', dataIndex: 'ip' },
            { text: 'NAS TYPE', dataIndex: 'type' },
            { text: '비고', dataIndex: 'desc' }
            // { text: '장비 MAC', dataIndex: 'mac' },
            // { text: 'MSISDN', dataIndex: 'msisdn' },
            // {
            //   text: 'Tunnel IP(/32기준)',
            //   dataIndex: 'tunnel_ip',
            //   tooltip: 'PPTP 터널링 IP 대역이며 /32 기준입니다.'
            // },
            // {
            //   text: '고객사 네트워크',
            //   dataIndex: 'eth_network',
            //   tooltip:
            //     '고객사에서 사용하는 네트워크이며 장비에서 자동으로 라우팅을 구성합니다.'
            // }
          ]
        },
        viewConfig: { enableTextSelection: false },
        bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
        bind: { store: '{gridStore}' },
        listeners: { itemdblclick: 'handleUpdate' }
      }
    ]
  }
);
