/**
 * Created by zen on 19. 1. 28.
 */
Ext.define('dhcp.view.windows.assignediplistwindow.AssignedIPListWindow', {
  extend: 'Ext.window.Window',

  requires: [
    'Ext.button.Button',
    'Ext.grid.Panel',
    'Ext.toolbar.Paging',
    'dhcp.view.windows.assignediplistwindow.AssignedIPListWindowController',
    'dhcp.view.windows.assignediplistwindow.AssignedIPListWindowModel'
  ],

  xtype: 'assignediplistwindow',

  viewModel: {
    type: 'assignediplistwindow'
  },

  controller: 'assignediplistwindow',
  title: '할당 IP 목록',
  iconCls: 'x-fa fa-sitemap',
  bodyPadding: 10,
  referenceHolder: true,
  defaultListenerScope: true,
  items: [
    {
      xtype: 'grid',
      margin: '10 0 0 0',
      reference: 'grid',
      flex: 1,
      bbar: { xtype: 'pagingtoolbar', bind: { store: '{ipGridStore}' } },
      bind: { store: '{ipGridStore}' },
      columns: {
        defaults: { align: 'center', flex: 1 },
        items: [
          {
            text: 'IP',
            dataIndex: 'ip'
          },
          {
            text: 'MAC',
            dataIndex: 'mac'
          },
          {
            text: 'Class',
            dataIndex: 'class'
          },
          {
            text: 'Lease Start',
            dataIndex: 'start'
          },
          {
            text: 'Lease End',
            dataIndex: 'end'
          }
        ]
      }
    }
  ],

  buttons: [
    // {
    //   xtype: 'button',
    //   iconCls: 'x-fa fa-file-excel-o',
    //   tooltip: '엑셀 다운로드',
    //   text: '엑셀 다운로드',
    //   handler: 'onExcel',
    //   margin: '0 0 0 10',
    //   minWidth: 50,
    //   cls:'button-excel',
    //   plugins:null
    // },
    { xtype: 'button', text: '취소', handler: 'onCancel' }
  ]
});
