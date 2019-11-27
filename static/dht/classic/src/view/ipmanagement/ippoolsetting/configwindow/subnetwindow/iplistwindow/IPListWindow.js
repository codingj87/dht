/**
 * Created by zen on 18. 4. 23.
 */
Ext.define(
  'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.iplistwindow.IPListWindow',
  {
    extend: 'Ext.window.Window',

    requires: [
      'Ext.button.Button',
      'Ext.form.field.ComboBox',
      'Ext.form.field.Text',
      'Ext.grid.Panel',
      'Ext.grid.plugin.CellEditing',
      'Ext.selection.CheckboxModel',
      'Ext.toolbar.Paging',
      'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.iplistwindow.IPListWindowController',
      'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.iplistwindow.IPListWindowModel'
    ],

    /*
    Uncomment to give this component an xtype
    xtype: 'iplistwindow',
    */

    viewModel: {
      type: 'iplistwindow'
    },

    controller: 'iplistwindow',
    title: 'IP List',
    iconCls: 'x-fa fa-sitemap',
    bodyPadding: '10 20 10 20',
    items: [
      {
        xtype: 'grid',
        margin: '10 0 0 0',
        reference: 'grid',
        plugins: 'cellediting',
        flex: 1,
        selModel: {
          type: 'checkboxmodel',
          checkOnly: true,
          mode: 'MULTI'
        },
        bbar: { xtype: 'pagingtoolbar', bind: { store: '{ipGridStore}' } },
        bind: { store: '{ipGridStore}' },
        columns: {
          defaults: { align: 'center', width: 100 },
          items: [
            {
              text: 'IP',
              dataIndex: 'ip'
            },
            {
              text: 'Type',
              dataIndex: 'type',
              renderer: 'renderType',
              editor: {
                xtype: 'combobox',
                valueField: 'value',
                displayField: 'display',
                bind: {
                  store: '{typeStore}'
                }
              }
            },

            {
              text: 'Class',
              dataIndex: 'class',
              renderer: 'renderClass',
              editor: {
                xtype: 'combobox',
                valueField: 'value',
                displayField: 'display',
                bind: {
                  store: '{classStore}'
                }
              }
            },
            {
              text: 'MAC',
              dataIndex: 'mac',
              renderer: 'renderMac',
              width: 130,
              editor: {
                xtype: 'textfield',
                vtype: 'MacAddress',
                emptyText: 'ex) 0026c63082ba'
              }
            },
            {
              text: 'Domain Name Servers',
              width: 200,
              dataIndex: 'domain_name_servers',
              editor: {
                xtype: 'textfield'
              }
            },
            {
              text: 'DHCP LEASE TIME',
              width: 150,
              dataIndex: 'dhcp_lease_time',
              editor: {
                xtype: 'numberfield'
              }
            },
            {
              text: '옵션 템플릿',
              width: 150,
              dataIndex: 'option_template',
              editor: {
                xtype: 'combobox',
                valueField: 'value',
                name: 'template',
                displayField: 'text',
                allowBlank: true,
                // listeners: {
                //   change: function(cp, value) {
                //     const { items } = cp.getStore().getData();
                //     const targetData = items.find(item => {
                //       const { data } = item;
                //       return data.value === value;
                //     });
                //     const {
                //       data: { options }
                //     } = targetData;
                //     const optionsTemplates = options
                //       .map(item => `${item.value} => ${item.optionValue}`)
                //       .join('\n');
                //     const {
                //       items: { items: container }
                //     } = cp.up();
                //     const display = container[1];
                //     display.setValue(optionsTemplates);
                //   }
                // },
                bind: {
                  store: '{templateStore}'
                }
              }
            }
          ]
        }
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
