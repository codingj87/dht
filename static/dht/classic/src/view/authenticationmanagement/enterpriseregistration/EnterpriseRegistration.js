/**
 * Created by zen on 19. 1. 28.
 */
Ext.define(
  'dhcp.view.authenticationmanagement.enterpriseregistration.EnterpriseRegistration',
  {
    extend: 'Ext.Container',

    requires: [
      'Ext.button.Button',
      'Ext.container.Container',
      'Ext.form.Panel',
      'Ext.form.field.Text',
      'Ext.grid.Panel',
      'Ext.layout.container.HBox',
      'Ext.layout.container.VBox',
      'Ext.toolbar.Fill',
      'Ext.toolbar.Paging',
      'Ext.toolbar.Toolbar',
      'dht.ux.plugin.ClearButton',
      'dht.ux.plugin.EnterKeyHandler',
      'dhcp.view.authenticationmanagement.enterpriseregistration.EnterpriseRegistrationController',
      'dhcp.view.authenticationmanagement.enterpriseregistration.EnterpriseRegistrationModel',
      'dht.view.common.SearchButton'
    ],

    xtype: 'enterpriseregistration',

    viewModel: {
      type: 'enterpriseregistration'
    },

    controller: 'enterpriseregistration',

    title: 'NAS TYPE',
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
            // defaults: {
            //   flex:2,
            //   plugins:[
            //     'clearbutton',
            //     {ptype: 'enterkeyhandler', handler: 'handleSearch'}
            //   ]
            // },
            items: [
              {
                xtype: 'textfield',
                labelWidth: 80,
                fieldLabel: 'NAS TYPE',
                name: 'type',
                // flex: 1,
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'handleSearch' }
                ]
              },
              {
                xtype: 'textfield',
                labelWidth: 80,
                fieldLabel: '비고',
                name: 'desc',
                // flex: 1,
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'handleSearch' }
                ]
              },
              // {
              //   xtype: 'textfield',
              //   labelWidth: 80,
              //   fieldLabel: '비고',
              //   name: 'remarks',
              //   // flex: 1,
              //   plugins: [
              //     'clearbutton',
              //     { ptype: 'enterkeyhandler', handler: 'handleSearch' }
              //   ]
              // },
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
        flex: 1,
        border: true,
        columns: {
          defaults: { align: 'center', flex: 1 },
          items: [
            { text: 'NAS TYPE', dataIndex: 'type' },
            { text: '비고', dataIndex: 'desc' }
            // { text: '비고', dataIndex: 'remarks' },
            // { text: '생성 시간', dataIndex: 'ctime' },
            // { text: '수정 시간', dataIndex: 'mtime' }
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
