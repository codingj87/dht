/**
 * Created by zen on 19. 5. 13.
 */
Ext.define('dhcp.view.logsearch.accountlogsearch.AccountLogSearch', {
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
    'dhcp.view.logsearch.accountlogsearch.AccountLogSearchModel',
    'dhcp.view.logsearch.accountlogsearch.AccountLogSearchController'
  ],
  xtype: 'accountlogsearch',
  viewModel: {
    type: 'accountlogsearch'
  },

  controller: 'accountlogsearch',
  title: 'account_log',
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
              fieldLabel: 'calling station id',
              name: 'calling_station_id',
              plugins: [
                'clearbutton',
                { ptype: 'enterkeyhandler', handler: 'handleSearch' }
              ]
            },
            {
              xtype: 'textfield',
              fieldLabel: 'NAS IP',
              name: 'nas_ip',
              plugins: [
                'clearbutton',
                { ptype: 'enterkeyhandler', handler: 'handleSearch' }
              ]
            },
            // {
            //   xtype: 'textfield',
            //   fieldLabel: '사용자 MAC',
            //   name: 'mac',
            //   plugins: [
            //     'clearbutton',
            //     { ptype: 'enterkeyhandler', handler: 'handleSearch' }
            //   ]
            // },
            {
              xtype: 'searchbutton',
              reference: 'searchBT',
              width: 125,
              margin: '-10 0 0 10',
              handler: 'handleSearch'
            },
            {
              xtype: 'combobox',
              fieldLabel: 'account_status',
              name: 'account_status',
              reference: 'account_status',
              displayField: 'display',
              valueField: 'value',
              value: '*',
              store: {
                fields: ['value', 'display'],
                data: [
                  { display: 'all', value: '*' },
                  { display: 'Accounting', value: 'Accounting' },
                  { display: 'Accounted', value: 'Accounted' }
                ]
              },
              listeners: { change: 'handleChangeAccountCombo' }
            },
            {
              xtype: 'combobox',
              fieldLabel: 'status_type',
              name: 'status_type',
              reference: 'status_type',
              displayField: 'display',
              valueField: 'value',
              value: '*',
              bind: { store: '{statusComboStore}' },
              listeners: { change: 'handleChangeStatusCombo' }
            },
            {
              xtype: 'combobox',
              reference: 'terminate_cause',
              fieldLabel: 'terminate_cause',
              name: 'terminate_cause',
              value: '*',
              displayField: 'display',
              valueField: 'value',
              bind: { store: '{terminateComboStore}' }
            },
            // {
            //   xtype: 'combobox',
            //   fieldLabel: 'terminate_cause',
            //   name: 'terminate_cause',
            //   displayField: 'display',
            //   valueField: 'value',
            //   value: '*',
            //   store: {
            //     fields: ['value', 'display'],
            //     data: [
            //       { display: 'all', value: '*' },
            //       { display: 'Session-Timeout', value: 'Session-Timeout' },
            //       { display: 'Idle-Timeout', value: 'Idle-Timeout' }
            //     ]
            //   }
            // },
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
          { text: 'userid', dataIndex: 'userid' },
          { text: 'calling_station_id', dataIndex: 'calling_station_id' },
          { text: 'nas_ip', dataIndex: 'nas_ip' },
          { text: 'status_type', dataIndex: 'status_type' },
          { text: 'output_octets', dataIndex: 'output_octets' },
          { text: 'input_octets', dataIndex: 'input_octets' },
          { text: 'output_packets', dataIndex: 'output_packets' },
          { text: 'input_packets', dataIndex: 'input_packets' },
          { text: 'session_time', dataIndex: 'session_time' },
          { text: 'terminate_cause', dataIndex: 'terminate_cause' },
          { text: 'ctime', dataIndex: 'ctime' }
        ]
      },
      viewConfig: { enableTextSelection: false },
      bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
      bind: { store: '{gridStore}' }
    }
  ]
});
