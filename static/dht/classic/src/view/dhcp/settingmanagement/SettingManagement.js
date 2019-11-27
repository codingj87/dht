/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dht.view.dhcp.settingmanagement.SettingManagement', {
  extend: 'Ext.panel.Panel',

  requires: [
    'Ext.container.Container',
    'Ext.button.Button',
    'Ext.panel.Panel',
    'Ext.form.field.Date',
    'Ext.form.field.Display',
    'Ext.form.Panel',
    'Ext.grid.column.Widget',
    'Ext.grid.Panel',
    'Ext.toolbar.Paging',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'dht.view.common.SearchButton',
    'dht.view.dhcp.settingmanagement.SettingManagementController',
    'dht.view.dhcp.settingmanagement.SettingManagementModel',
    'dht.ux.plugin.ClearButton'
  ],
  xtype: 'settingmanagement',
  viewModel: { type: 'settingmanagement' },
  controller: 'settingmanagement',

  title: '설정파일 관리',
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
      xtype: 'container',
      flex: 1,
      scrollable: true,
      layout: { type: 'hbox', align: 'stretch' },
      items: [
        {
          xtype: 'grid',
          margin: '10 0 0 0',
          reference: 'grid',
          width: 300,
          border: true,
          scrollable: true,
          columns: {
            defaults: { align: 'center' },
            items: [
              {
                xtype: 'widgetcolumn',
                text: '저장',
                width: 90,
                widget: {
                  xtype: 'button',
                  iconCls: 'x-fa fa-save',
                  handler: 'onDownload'
                }
              },
              { text: '수정일시', dataIndex: 'm_time', flex: 1 }
            ]
          },
          bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
          bind: { store: '{gridStore}' },
          listeners: { itemclick: 'onCompare' }
        },
        {
          xtype: 'panel',
          title: '설정 비교',
          iconCls: 'x-fa fa-check',
          margin: '10 0 0 10',
          bodyPadding: '0 0 0 15',
          border: true,
          flex: 1,
          minWidth: 1270,
          scrollable: true,
          layout: { type: 'vbox', align: 'stretch' },
          items: [
            {
              xtype: 'displayfield',
              title: 'after',
              reference: 'after',
              value: '<div id="display"></div>'
            }
          ]
        }
      ]
    }
  ]
});
