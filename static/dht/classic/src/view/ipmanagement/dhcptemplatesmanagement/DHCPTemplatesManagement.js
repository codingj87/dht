Ext.define(
  'dhcp.view.ipmanagement.dhcptemplatesmanagement.DHCPTemplatesManagement',
  {
    extend: 'Ext.panel.Panel',

    requires: [
      'Ext.button.Button',
      'Ext.container.Container',
      'Ext.form.Panel',
      'Ext.form.field.Text',
      'Ext.grid.Panel',
      'Ext.layout.container.HBox',
      'Ext.layout.container.VBox',
      'Ext.panel.Panel',
      'Ext.toolbar.Fill',
      'Ext.toolbar.Paging',
      'dht.ux.plugin.ClearButton',
      'dht.ux.plugin.EnterKeyHandler',
      'dht.view.common.SearchButton',
      'dhcp.view.ipmanagement.dhcptemplatesmanagement.DHCPTemplatesManagementController',
      'dhcp.view.ipmanagement.dhcptemplatesmanagement.DHCPTemplatesManagementModel'
    ],
    xtype: 'dhcptemplatesmanagement',
    viewModel: { type: 'dhcptemplatesmanagement' },
    controller: 'dhcptemplatesmanagement',
    title: '옵션 템플릿 설정',
    layout: { type: 'vbox', align: 'stretch' },
    items: [
      {
        xtype: 'panel',
        border: true,
        bodyPadding: 4,
        margin: '0 0 10 0',
        layout: { type: 'vbox', align: 'stretch' },
        items: [
          {
            xtype: 'form',
            reference: 'searchForm',
            layout: { type: 'vbox', align: 'stretch' },
            items: [
              {
                xtype: 'toolbar',
                layout: { type: 'hbox', align: 'stretch' },
                defaults: {
                  plugins: [
                    'clearbutton',
                    { ptype: 'enterkeyhandler', handler: 'onSearch' }
                  ]
                },
                items: [
                  { xtype: 'textfield', fieldLabel: '템플릿 명', name: 'name' },
                  {
                    xtype: 'searchbutton',
                    handler: 'onSearch',
                    reference: 'searchBT',
                    plugins: null
                  },
                  '->',
                  {
                    xtype: 'container',
                    margin: '0 0 0 10',
                    plugins: null,
                    layout: { type: 'hbox' },
                    style: {
                      float: 'right'
                    },
                    items: [
                      {
                        xtype: 'button',
                        iconCls: 'x-fa fa-plus',
                        text: '등록',
                        tooltip: '등록',
                        handler: 'onCreate'
                      },
                      {
                        xtype: 'button',
                        iconCls: 'x-fa fa-edit',
                        text: '수정',
                        tooltip: '수정',
                        handler: 'onUpdate'
                      },
                      {
                        xtype: 'button',
                        iconCls: 'x-fa fa-minus',
                        text: '삭제',
                        tooltip: '삭제',
                        handler: 'onDelete',
                        bind: { disabled: '{!grid.selection}' }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        xtype: 'grid',
        reference: 'grid',
        flex: 1,
        border: true,
        columns: {
          defaults: { align: 'center' },
          items: [
            { text: '옵션 템플릿 명', dataIndex: 'name', flex: 1 },
            {
              text: '옵션 템플릿',
              dataIndex: 'options',
              flex: 2,
              renderer: function(value) {
                return `<pre>${value
                  .map(item => `${item.value} => ${item.optionValue}`)
                  .join('\n')}</pre>`;
              },
              align: 'left'
            }
          ]
        },
        // viewConfig: {enableTextSelection: true},
        bbar: { xtype: 'pagingtoolbar', bind: { store: '{gridStore}' } },
        bind: { store: '{gridStore}' },
        listeners: {
          itemdblclick: 'onUpdate'
        }
      }
    ]
  }
);
