/**
 * Created by jjol on 16. 10. 18.
 */

Ext.define('dhcp.view.ipaddressmanagement.ipstatus.IPStatus', {
  extend: 'Ext.panel.Panel',

  requires: [
    'Ext.button.Button',
    'Ext.container.Container',
    'Ext.form.Panel',
    'Ext.form.field.Date',
    'Ext.form.field.Display',
    'Ext.form.field.Number',
    'Ext.form.field.Radio',
    'Ext.form.field.Text',
    'Ext.grid.Panel',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'Ext.panel.Panel',
    'Ext.toolbar.Paging',
    'dht.ux.plugin.ClearButton',
    'dht.ux.plugin.EnterKeyHandler',
    'dht.view.common.SearchButton',
    'dhcp.view.ipaddressmanagement.ipstatus.IPStatusController',
    'dhcp.view.ipaddressmanagement.ipstatus.IPStatusModel'
  ],
  xtype: 'ipstatus',
  viewModel: { type: 'ipstatus' },
  controller: 'ipstatus',
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
              fieldLabel: 'Shared Network',
              name: 'shared_network',
              width: 400,
              plugins: [
                'clearbutton',
                { ptype: 'enterkeyhandler', handler: 'onSearch' }
              ]
            },
            {
              xtype: 'textfield',
              fieldLabel: 'IP 할당 대역',
              name: 'subnet',
              width: 400,
              plugins: [
                'clearbutton',
                { ptype: 'enterkeyhandler', handler: 'onSearch' }
              ]
            },
            // {xtype: 'textfield', fieldLabel: 'Class', name: 'class'},
            // {xtype: 'textfield', fieldLabel: '사용률', name: 'usage'},
            // {
            //   xtype: 'radiofield',
            //   name: 'type',
            //   margin: '0 0 0 10',
            //   boxLabel: '이상',
            //   inputValue: 'over',
            //   checked: true
            // },
            // {xtype: 'radiofield', name: 'type', margin: '0 0 0 5', boxLabel: '이하', inputValue: 'under'},
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
          {
            text: 'Shared Network',
            dataIndex: 'shared_network',
            tooltip: 'IP 주소 할당 대역에 대한 명칭입니다.'
          },
          // {text: 'Class', dataIndex: 'class'},
          { text: 'IP 할당 대역', dataIndex: 'subnet' },
          { text: '서브넷', dataIndex: 'net_mask' },
          // {text: '사용률(%)', dataIndex: 'usage'},
          { text: '전체 IP 개수', dataIndex: 'total' },
          { text: '할당 개수', dataIndex: 'uses' },
          { text: '미할당 개수', dataIndex: 'free' }
          // {text: 'IP충돌', dataIndex: 'ip_collision'}
        ]
      },
      viewConfig: { enableTextSelection: false },
      bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
      bind: { store: '{gridStore}' },
      listeners: { itemdblclick: 'showAssignedIP' }
    }
  ]
});
