/**
 * Created by zen on 19. 4. 25.
 */
Ext.define('dhcp.view.windows.ippoolsettingwindow.IPPoolSettingWindow', {
  extend: 'Ext.window.Window',

  requires: [
    'Ext.button.Button',
    'Ext.form.Panel',
    'Ext.form.field.ComboBox',
    'Ext.form.field.Hidden',
    'Ext.form.field.Text',
    'Ext.grid.Panel',
    'Ext.layout.container.Card',
    'Ext.layout.container.VBox',
    'Ext.panel.Panel',
    'Ext.toolbar.Fill',
    'Ext.toolbar.Paging',
    'Ext.toolbar.TextItem',
    'dhcp.view.windows.ippoolsettingwindow.IPPoolSettingWindowController',
    'dhcp.view.windows.ippoolsettingwindow.IPPoolSettingWindowModel'
  ],

  xtype: 'ippoolsettingwindow',

  viewModel: {
    type: 'ippoolsettingwindow'
  },

  controller: 'ippoolsettingwindow',
  autoShow: true,
  height: 800,
  width: 1000,
  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  scrollable: true,
  modal: true,
  bodyPadding: 10,
  items: [
    {
      /*
       * This the main form with a card layout.  Each additional page in the form is a form panel
       * */
      xtype: 'form',
      layout: 'card',
      /*
       * The reference config allows you to easily grab this component in the viewController using the
       * lookupReference() method
       * */
      reference: 'main_form',
      defaults: {
        layout: {
          type: 'vbox',
          align: 'stretch',
          pack: 'center'
        }
      },
      items: [
        {
          /*
           * First page of the main form
           * */
          xtype: 'form',
          bodyPadding: 10,
          title: 'Shared Network 설정',
          reference: 'start',
          defaults: {
            margin: 10,
            labelWidth: 120,
            flex: 1,
            allowBlank: false,
            msgTarget: 'under'
          },
          items: [
            {
              xtype: 'textfield',
              name: 'shared_network',
              fieldLabel: 'Shared Network',
              emptyText: 'ex) _10_40_0_0',
              allowBlank: false,
              enforceMaxLength: true
            },
            {
              xtype: 'textfield',
              name: 'subnet',
              fieldLabel: 'Subnet',
              emptyText: 'ex) 10.40.0.0',
              enableKeyEvents: true,
              vtype: 'IPAddress',
              listeners: {
                change: 'onSubnetChange'
              }
            },
            {
              xtype: 'combobox',
              name: 'net_mask',
              disabled: true,
              valueField: 'value',
              displayField: 'display',
              fieldLabel: 'Net Mask',
              bind: { store: '{netMaskStore}' },
              listeners: {
                change: 'onNetMaskChange'
              }
            },
            {
              xtype: 'textfield',
              name: 'router',
              fieldLabel: 'Router',
              emptyText: 'ex) 10.40.0.1',
              vtype: 'IPAddress',
              enableKeyEvents: true
            }
          ]
        },
        {
          /*
           * Second page of the main form
           * */
          xtype: 'panel',
          bodyPadding: 5,
          layout: {
            type: 'vbox',
            align: 'stretch'
          },
          reference: 'intermediate',
          defaults: { margin: 10 },
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
                itemdblclick: 'onsShowIPList'
              },
              bbar: {
                xtype: 'pagingtoolbar',
                bind: { store: '{ipGridStore}' }
                // listeners: {
                //   beforechange: 'onPageChange'
                // }
              },
              bind: { store: '{ipGridStore}' }
            }
          ]
        },
        {
          xtype: 'form',
          title: 'final',
          reference: 'final',
          margin: '20 0 0 0',
          layout: {
            type: 'vbox',
            align: 'stretch'
          },
          items: []
        },
        /*
         * This hidden field is bound to progress in the viewModel.  This will be submitted along with the
         * other form fields
         * */
        {
          xtype: 'hiddenfield',
          name: 'progress',
          bind: {
            value: '{progress}'
          }
        }
      ]
    }
  ],
  dockedItems: [
    {
      xtype: 'toolbar',
      dock: 'bottom',
      items: [
        {
          xtype: 'tbtext',
          html: '진행률: '
        },
        {
          xtype: 'progressbar',
          flex: 1,
          /*
           * The progress bar value is bound to progress in the viewModel
           * */
          bind: {
            value: '{progress}'
          }
        },
        {
          xtype: 'tbfill'
        },
        {
          xtype: 'button',
          text: '이전',
          handler: 'onPrev',
          width: 120,
          userCls: 'bg_download',
          iconCls: 'x-fa fa-chevron-left',
          /*
           * The disabled config is bound to prevButton in the viewModel and is updated via the viewController
           * */
          bind: {
            disabled: '{prevButton}'
          }
        },
        {
          xtype: 'button',
          handler: 'onNext',
          reference: 'nextButton',
          width: 120,
          /*
           * The disabled and text config are bound to nexButton in the viewModel and is updated via the
           * viewController
           * */
          bind: {
            text: '{nextButtonText}',
            iconCls: '{nextButtonIconCls}',
            userCls: '{nextButtonUserCls}'
          }
        }
      ]
    }
  ],
  listeners: {
    beforeclose: 'onBeforeClose'
  }
});
