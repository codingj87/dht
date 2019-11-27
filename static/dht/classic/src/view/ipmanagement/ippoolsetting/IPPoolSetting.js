/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dhcp.view.ipmanagement.ippoolsetting.IPPoolSetting', {
  extend: 'Ext.panel.Panel',

  requires: [
    'Ext.button.Button',
    'Ext.container.Container',
    'Ext.form.Panel',
    'Ext.form.field.Text',
    'Ext.grid.Panel',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'Ext.panel.Panel',
    'Ext.toolbar.Fill',
    'Ext.toolbar.Paging',
    'dht.ux.plugin.ClearButton',
    'dht.ux.plugin.EnterKeyHandler',
    'dht.view.common.SearchButton',
    'dhcp.view.ipmanagement.ippoolsetting.IPPoolSettingController',
    'dhcp.view.ipmanagement.ippoolsetting.IPPoolSettingModel'
  ],
  xtype: 'ippoolsetting',
  viewModel: { type: 'ippoolsetting' },
  controller: 'ippoolsetting',
  title: 'IP 풀 설정',
  layout: { type: 'vbox', align: 'stretch' },
  items: [
    {
      xtype: 'panel',
      border: true,
      bodyPadding: 4,
      margin: '0 0 10 0',
      layout: { type: 'vbox', align: 'stretch' },
      items: [
        {
          xtype: 'form',
          reference: 'searchForm',
          layout: { type: 'vbox', align: 'stretch' },
          items: [
            {
              xtype: 'toolbar',
              layout: { type: 'hbox', align: 'stretch' },
              defaults: {
                plugins: [
                  'clearbutton',
                  { ptype: 'enterkeyhandler', handler: 'onSearch' }
                ]
              },
              items: [
                {
                  xtype: 'textfield',
                  labelWidth: 120,
                  fieldLabel: 'Shared-Network',
                  name: 'shared_network'
                },
                { xtype: 'textfield', fieldLabel: 'IP', name: 'subnet' },
                { xtype: 'textfield', fieldLabel: 'Class', name: 'class' },
                {
                  xtype: 'searchbutton',
                  handler: 'onSearch',
                  reference: 'searchBT',
                  plugins: null
                },
                {
                  xtype: 'button',
                  iconCls: 'x-fa fa-file-excel-o',
                  tooltip: '엑셀 다운로드',
                  text: '엑셀 다운로드',
                  handler: 'onExcel',
                  margin: '0 0 0 10',
                  minWidth: 50,
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
                      handler: 'onCreateConfig'
                      // bind: {disabled: '{!selectGroupID}'}
                    },
                    {
                      xtype: 'button',
                      reference: 'updateButton',
                      iconCls: 'x-fa fa-check',
                      text: '수정',
                      tooltip: '수정',
                      handler: 'onUpdateConfig',
                      bind: { disabled: '{!grid.selection}' }
                    },
                    {
                      xtype: 'button',
                      reference: 'deleteButton',
                      iconCls: 'x-fa fa-minus',
                      text: '삭제',
                      tooltip: '삭제',
                      handler: 'onDeleteConfig',
                      bind: { disabled: '{!grid.selection}' }
                    }
                  ]
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
          { text: 'Shared Network', dataIndex: 'shared_network' },
          { text: 'Type', dataIndex: 'type' },
          { text: 'Class', dataIndex: 'class' },
          { text: 'Subnet', dataIndex: 'subnet' },
          { text: 'Range Start', dataIndex: 'range_start' },
          { text: 'Range End', dataIndex: 'range_end' },
          {
            text: 'Domain Name Servers',
            dataIndex: 'domain_name_servers',
            flex: 2
          },
          { text: 'DHCP Lease Time', dataIndex: 'dhcp_lease_time' }
        ]
      },
      // viewConfig: {enableTextSelection: true},
      bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
      bind: { store: '{gridStore}' },
      listeners: { itemdblclick: 'onUpdateConfig' }
    }
  ]
});
