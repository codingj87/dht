// noinspection UnknownClassInspection
/**
 * Created by zen on 18. 4. 23.
 */
Ext.define(
  'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.SubnetWindow',
  {
    extend: 'Ext.window.Window',

    requires: [
      'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.SubnetWindowModel',
      'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.SubnetWindowController',
      'Ext.button.Button',
      'Ext.grid.Panel',
      'Ext.toolbar.Paging',
      'src.form.field.VTypes'
    ],

    /*
    Uncomment to give this component an xtype
    xtype: 'subnetwindow',
    */

    viewModel: {
      type: 'subnetwindow'
    },

    controller: 'subnetwindow',
    title: 'IP Pool',
    iconCls: 'x-fa fa-cog',
    bodyPadding: '10 20 10 20',
    items: [
      {
        xtype: 'grid',
        margin: '10 0 0 0',
        reference: 'grid',
        flex: 1,
        columns: {
          defaults: { align: 'center', flex: 1 },
          items: [
            {
              text: 'Start',

              dataIndex: 'start'
            },
            {
              text: 'End',
              dataIndex: 'end'
            },
            {
              text: '사용여부',
              dataIndex: 'used'
            }
          ]
        },
        listeners: {
          itemdblclick: 'show_ip_list',
          rowkeydown: 'onShiftDown'
        },
        bbar: {
          xtype: 'pagingtoolbar',
          bind: { store: '{ipGridStore}' },
          listeners: {
            beforechange: 'onPageChange'
          }
        },
        bind: { store: '{ipGridStore}' }
      }
    ],

    buttons: [
      { xtype: 'button', text: '저장', handler: 'onSave' },
      { xtype: 'button', text: '취소', handler: 'onCancel' }
    ],
    listeners: {
      boxready: 'onBoxReady'
    }
  }
);
