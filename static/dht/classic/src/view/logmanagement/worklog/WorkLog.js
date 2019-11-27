/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dhcp.view.logmanagement.worklog.WorkLog', {
  extend: 'Ext.panel.Panel',

  requires: [
    'Ext.container.Container',
    'Ext.form.Panel',
    'Ext.form.field.Date',
    'Ext.grid.Panel',
    'Ext.grid.column.Widget',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'Ext.panel.Panel',
    'Ext.toolbar.Paging',
    'dht.view.common.SearchButton',
    'dhcp.view.logmanagement.worklog.WorkLogController',
    'dhcp.view.logmanagement.worklog.WorkLogModel'
  ],
  xtype: 'worklog',
  viewModel: { type: 'worklog' },
  controller: 'worklog',
  title: '작업 이력',
  layout: { type: 'vbox', align: 'stretch' },
  items: [
    {
      xtype: 'panel',
      border: true,
      bodyPadding: 10,
      layout: { type: 'vbox', align: 'stretch' },
      items: [
        {
          xtype: 'form',
          reference: 'searchForm',
          layout: { type: 'vbox', align: 'stretch' },
          items: [
            {
              xtype: 'container',
              layout: { type: 'hbox', align: 'stretch' },
              items: [
                {
                  xtype: 'datefield',
                  name: 'sdate',
                  fieldLabel: '기간(From)',
                  format: 'Y-m-d',
                  value: new Date(),
                  editable: false,
                  allowBlank: false,
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
                  maxValue: new Date(),
                  allowBlank: false,
                  bind: {
                    value: '{searchForm.edate}',
                    minValue: '{searchForm.sdate}'
                  },
                  margin: '0 10 0 0'
                },
                {
                  xtype: 'searchbutton',
                  handler: 'onSearch',
                  reference: 'searchBT'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      xtype: 'grid',
      margin: '10 0 0 0',
      reference: 'grid',
      flex: 1,
      border: true,
      columns: {
        defaults: { align: 'center', flex: 1 },
        items: [
          { text: '작업 시간', dataIndex: 'time', flex: 2 },
          { text: '작업자', dataIndex: 'worker' },
          { text: 'Shared Network', dataIndex: 'shared_network' },
          { text: '작업 유형', dataIndex: 'work_type' },
          {
            text: '작업 전',
            dataIndex: 'display_before_work',
            flex: 3,
            align: 'start',
            renderer: 'renderConfig'
          },
          {
            text: '작업 후',
            dataIndex: 'display_after_work',
            flex: 3,
            align: 'start',
            renderer: 'renderConfig'
          },
          {
            xtype: 'widgetcolumn',
            text: '작업 취소',
            widget: {
              xtype: 'button',
              text: '<span style="color:white;">Rollback</span>',
              handler: 'rollback',
              style: { 'background-color': '#f66' },
              listeners: {
                afterrender: function afterrender(cp) {
                  if (cp.$widgetRecord.data.is_rollback === '적용') {
                    cp.setDisabled(true);
                    cp.setText('Rollback 완료');
                  }
                }
              }
            }
          }
        ]
      },
      bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
      bind: { store: '{gridStore}' }
    }
  ]
});
