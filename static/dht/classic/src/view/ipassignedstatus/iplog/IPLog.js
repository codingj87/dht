/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dhcp.view.ipassignedstatus.iplog.IPLog', {
  extend: 'Ext.panel.Panel',

  requires: [
    'Ext.container.Container',
    'Ext.button.Button',
    'Ext.form.Panel',
    'Ext.form.field.ComboBox',
    'Ext.form.field.Date',
    'Ext.form.field.Display',
    'Ext.form.field.Text',
    'Ext.grid.Panel',
    'Ext.layout.container.Table',
    'Ext.layout.container.VBox',
    'Ext.panel.Panel',
    'Ext.toolbar.Paging',
    'dht.view.common.SearchButton',
    'dhcp.view.ipassignedstatus.iplog.IPLogController',
    'dhcp.view.ipassignedstatus.iplog.IPLogModel',
    'dht.ux.plugin.ClearButton'
  ],
  xtype: 'iplog',
  viewModel: { type: 'iplog' },
  controller: 'iplog',
  title: 'IP 할당 로그',
  layout: { type: 'vbox', align: 'stretch' },
  items: [
    {
      xtype: 'panel',
      border: true,
      bodyPadding: '10 10 0 10',
      layout: { type: 'vbox', align: 'stretch' },
      items: [
        {
          xtype: 'form',
          reference: 'searchForm',
          layout: {
            type: 'table',
            columns: 5,
            tableAttrs: { style: { width: '100%' } }
          },
          defaults: { labelWidth: 100, width: '100%' },
          items: [
            {
              xtype: 'datefield',
              name: 'sdate',
              fieldLabel: '기간(From)',
              format: 'Y-m-d',
              value: new Date(),
              plugins: ['clearbutton'],
              editable: false,
              bind: {
                value: '{searchForm.sdate}',
                maxValue: '{searchForm.edate}'
              }
            },
            {
              xtype: 'datefield',
              name: 'edate',
              fieldLabel: '기간(To)',
              format: 'Y-m-d',
              editable: false,
              value: new Date(),
              plugins: ['clearbutton'],
              maxValue: new Date(),
              bind: {
                value: '{searchForm.edate}',
                minValue: '{searchForm.sdate}'
              }
            },
            { xtype: 'textfield', fieldLabel: 'IP', name: 'ip' },
            { xtype: 'textfield', fieldLabel: 'MAC', name: 'mac' },
            {
              xtype: 'searchbutton',
              reference: 'searchBT',
              width: 125,
              margin: '-10 0 0 10',
              handler: 'onSearch'
            },

            {
              xtype: 'combobox',
              fieldLabel: '유형',
              name: 'type',
              displayField: 'display',
              valueField: 'value',
              store: {
                fields: ['value', 'display'],
                data: [
                  { display: 'all', value: null },
                  { display: 'Ack', value: 'Ack' },
                  { display: 'Request', value: 'Request' },
                  { display: 'Offer', value: 'Offer' },
                  { display: 'Discover', value: 'Discover' }
                ]
              }
            },
            {
              xtype: 'textfield',
              fieldLabel: '벤더 클래스',
              name: 'vendor_class'
            },
            { xtype: 'textfield', fieldLabel: 'Host name', name: 'hostname' },
            { xtype: 'displayfield' },
            {
              xtype: 'button',
              iconCls: 'x-fa fa-file-excel-o',
              tooltip: '엑셀 다운로드',
              text: '엑셀 다운로드',
              handler: 'onExcel',
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
      margin: '10 0 0 0',
      flex: 1,
      border: true,
      columns: {
        defaults: { minWidth: 150, align: 'center', flex: 1 },
        items: [
          { text: '요청 시간', dataIndex: 'time' },
          { text: '유형', dataIndex: 'type' },
          { text: 'Client IP', dataIndex: 'ci' },
          { text: 'MAC 주소', dataIndex: 'mac' },
          { text: 'Your IP', dataIndex: 'yi' },
          { text: '벤더 클래스', dataIndex: 'vendor_class' },
          { text: 'Host name', dataIndex: 'hostname' },
          { text: '서버 IP', dataIndex: 'ip' }
        ]
      },
      viewConfig: { enableTextSelection: true },
      bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
      bind: { store: '{gridStore}' }
    }
  ]
});
