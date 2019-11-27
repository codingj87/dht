/**
 * Created by jjol on 16. 10. 18.
 */

Ext.define('dhcp.view.ipassignedstatus.ipstats.IPStats', {
  extend: 'Ext.panel.Panel',

  requires: [
    'Ext.container.Container',
    'Ext.form.Panel',
    'Ext.form.field.Radio',
    'Ext.form.field.Text',
    'Ext.grid.Panel',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'dht.view.common.SearchButton',
    'dhcp.view.ipassignedstatus.ipstats.IPStatsController',
    'dhcp.view.ipassignedstatus.ipstats.IPStatsModel'
  ],
  xtype: 'ipstats',
  viewModel: { type: 'ipstats' },
  controller: 'ipstats',
  title: 'IP 할당 현황',
  layout: { type: 'vbox', align: 'stretch' },
  scrollable: true,
  items: [
    {
      xtype: 'form',
      reference: 'searchForm',
      height: 55,
      border: true,
      bodyPadding: 10,
      layout: { type: 'vbox', align: 'stretch' },
      items: [
        {
          xtype: 'container',
          layout: { type: 'hbox', align: 'stretch' },
          items: [
            {
              xtype: 'textfield',
              labelWidth: 120,
              fieldLabel: 'Shared-Network',
              name: 'shared_network'
            },
            { xtype: 'textfield', fieldLabel: 'IP', name: 'ip' },
            { xtype: 'textfield', fieldLabel: 'Class', name: 'class' },
            { xtype: 'textfield', fieldLabel: '사용률', name: 'usage' },
            {
              xtype: 'radiofield',
              name: 'type',
              margin: '0 0 0 10',
              boxLabel: '이상',
              inputValue: 'over',
              checked: true
            },
            {
              xtype: 'radiofield',
              name: 'type',
              margin: '0 0 0 5',
              boxLabel: '이하',
              inputValue: 'under'
            },
            {
              xtype: 'searchbutton',
              handler: 'onSearch',
              reference: 'searchBT'
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
            }
          ]
        }
      ]
    },
    {
      xtype: 'grid',
      margin: '10 0 0 0',
      reference: 'grid',
      minHeight: 250,
      flex: 1,
      border: true,
      columns: {
        defaults: { minWidth: 150, align: 'center', flex: 1 },
        items: [
          // {text: 'Name', dataIndex: 'shared_network_name', minWidth: 150},
          { text: 'Shared_Network', dataIndex: 'shared_network' },
          { text: 'Class', dataIndex: 'class' },
          { text: '사용률(%)', dataIndex: 'usage' },
          { text: '전체', dataIndex: 'total' },
          { text: '할당', dataIndex: 'uses' },
          { text: '미할당', dataIndex: 'free' },
          { text: 'IP충돌', dataIndex: 'ip_collision' }
        ]
      },
      viewConfig: { enableTextSelection: true },
      bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
      bind: { store: '{gridStore}' },
      listeners: {
        itemclick: 'gridStoreSelect',
        itemdblclick: 'showAssignedIP'
      }
    },
    {
      xtype: 'container',
      layout: { type: 'hbox', align: 'center' },
      defaults: { margin: '20 0 0 0', align: 'center' },
      items: [
        {
          xtype: 'form',
          reference: 'chartSearchForm',
          height: 50,
          layout: { type: 'hbox', align: 'center' },
          defaults: { margin: '20 0 0 0', align: 'center' },
          items: [
            {
              xtype: 'datefield',
              name: 'sDay',
              width: 125,
              format: 'Y-m-d',
              editable: false,
              maxValue: new Date()
            },
            {
              xtype: 'numberfield',
              name: 'sHour',
              width: 60,
              minValue: 0,
              maxValue: 23
            },
            {
              xtype: 'numberfield',
              name: 'sMin',
              width: 60,
              minValue: 0,
              maxValue: 59
            },
            { xtype: 'displayfield', margin: '0 5 0 5', value: '~' },
            {
              xtype: 'datefield',
              name: 'eDay',
              width: 125,
              format: 'Y-m-d',
              editable: false,
              maxValue: new Date()
            },
            {
              xtype: 'numberfield',
              name: 'eHour',
              width: 60,
              minValue: 0,
              maxValue: 23
            },
            {
              xtype: 'numberfield',
              name: 'eMin',
              width: 60,
              minValue: 0,
              maxValue: 59
            },
            {
              xtype: 'searchbutton',
              reference: 'chartSearchBT',
              handler: 'onChartSearch',
              plugins: null
            }
          ]
        },
        {
          xtype: 'displayfield',
          margin: '0 0 0 100',
          fieldLabel: 'Shared_Network',
          bind: { value: '<b>{shared_network}</b>' }
        }
      ]
    },
    {
      xtype: 'panel',
      height: 400,
      layout: { type: 'vbox', align: 'stretch' },
      defaults: { margin: '5 5 5 5' },
      items: [
        {
          xtype: 'container',
          reference: 'sharedNetworkStatsTitle',
          layout: { type: 'hbox', align: 'stretch' },
          items: [
            {
              xtype: 'displayfield',
              fieldStyle: 'color: #646464; font-size: 16px; font-weight: bold;',
              value: 'IP 사용률 (%)'
            }
          ]
        },
        {
          xtype: 'container',
          reference: 'sharedNetworkStatsChart',
          height: 340,
          cls: 'system-container-border'
        }
      ]
    }
  ]
});
