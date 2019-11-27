/**
 * Created by zen on 19. 1. 31.
 */
Ext.define('dhcp.view.logsearch.authlogsearch.AuthLogSearch', {
  extend: 'Ext.Container',

  requires: [
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
    'dht.ux.plugin.ClearButton',
    'dht.ux.plugin.EnterKeyHandler',
    'dht.view.common.SearchButton',
    'dhcp.view.logsearch.authlogsearch.AuthLogSearchController',
    'dhcp.view.logsearch.authlogsearch.AuthLogSearchModel'
  ],
  xtype: 'authlogsearch',
  viewModel: {
    type: 'authlogsearch'
  },
  controller: 'authlogsearch',
  title: '인증 이력 조회',
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
            {
              xtype: 'textfield',
              fieldLabel: 'NAS IP',
              name: 'ip',
              plugins: [
                'clearbutton',
                { ptype: 'enterkeyhandler', handler: 'onSearch' }
              ]
            },
            {
              xtype: 'textfield',
              fieldLabel: '사용자 MAC',
              name: 'mac',
              plugins: [
                'clearbutton',
                { ptype: 'enterkeyhandler', handler: 'onSearch' }
              ]
            },
            {
              xtype: 'searchbutton',
              reference: 'searchBT',
              width: 125,
              margin: '-10 0 0 10',
              handler: 'onSearch'
            },
            {
              xtype: 'combobox',
              fieldLabel: '인증 유형',
              name: 'certification_type',
              displayField: 'display',
              valueField: 'value',
              value: '*',
              store: {
                fields: ['value', 'display'],
                data: [
                  { display: 'all', value: '*' },
                  { display: '장비 인증', value: 'equipment' },
                  { display: '사용자 인증', value: 'user' }
                ]
              },
              listeners: { change: 'onchangeCombo' }
            },
            {
              xtype: 'combobox',
              reference: 'packet_type_combo',
              fieldLabel: '요청 유형',
              name: 'packet_type',
              value: '*',
              displayField: 'display',
              valueField: 'value',
              bind: { store: '{comboStore}' }
            },
            {
              xtype: 'combobox',
              fieldLabel: '응답 유형',
              name: 'response',
              displayField: 'display',
              valueField: 'value',
              value: '*',
              store: {
                fields: ['value', 'display'],
                data: [
                  { display: 'all', value: '*' },
                  { display: 'Accept', value: 'accept' },
                  { display: 'Reject', value: 'reject' }
                ]
              }
            },
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
            // {
            //   xtype: 'button',
            //   iconCls: 'x-fa fa-calendar-times-o',
            //   tooltip: '이력 초기화',
            //   text: '이력 초기화',
            //   handler: 'handleLogReset',
            //   margin: '-10 0 0 10',
            //   width: 125,
            //   cls: 'button-excel',
            //   plugins: null
            // }
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
          { text: '요청 시간', dataIndex: 'ctime' },
          { text: '요청 유형', dataIndex: 'packet_type' },
          { text: '응답 유형', dataIndex: 'response' },
          // { text: 'NAS ID', dataIndex: 'lte_id' },
          { text: 'NAS', dataIndex: 'emhs' },
          // { text: 'NAS MAC', dataIndex: 'emhs_mac' },
          { text: 'NAS IP', dataIndex: 'emhs_ip' },
          { text: '사용자 MAC', dataIndex: 'supplicant' }
        ]
      },
      viewConfig: { enableTextSelection: false },
      bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
      bind: { store: '{gridStore}' }
    }
  ]
});
