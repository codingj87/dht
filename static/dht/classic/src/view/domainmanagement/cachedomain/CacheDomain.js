/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.domainmanagement.cachedomain.CacheDomain', {
  extend: 'Ext.Container',

  requires: [
    'Ext.button.Button',
    'Ext.form.Panel',
    'Ext.form.field.Date',
    'Ext.form.field.Text',
    'Ext.grid.Panel',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'Ext.toolbar.Paging',
    'dht.ux.plugin.ClearButton',
    'dht.ux.plugin.EnterKeyHandler',
    'dht.view.common.SearchButton',
    'dhcp.view.domainmanagement.cachedomain.CacheDomainController',
    'dhcp.view.domainmanagement.cachedomain.CacheDomainModel'
  ],

  xtype: 'cachedomain',

  viewModel: {
    type: 'cachedomain'
  },

  controller: 'cachedomain',

  title: '캐시 도메인',
  layout: { type: 'vbox', align: 'stretch' },
  items: [
    {
      xtype: 'form',
      border: true,
      bodyPadding: 10,
      margin: '0 0 10 0',
      reference: 'searchForm',
      layout: { type: 'hbox', align: 'stretch' },
      defaults: {
        flex: 1,
        plugins: [
          'clearbutton',
          { ptype: 'enterkeyhandler', handler: 'onSearch' }
        ]
      },
      items: [
        { xtype: 'textfield', fieldLabel: '도메인', name: 'domain' },
        {
          xtype: 'datefield',
          name: 'sdate',
          fieldLabel: '기간(From)',
          format: 'Y-m-d',
          editable: false,
          bind: {
            maxValue: '{edate}'
          }
        },
        {
          xtype: 'datefield',
          name: 'edate',
          fieldLabel: '기간(To)',
          format: 'Y-m-d',
          editable: false,
          maxValue: new Date(),
          bind: {
            value: '{edate}',
            minValue: '{sdate}'
          }
        },
        {
          xtype: 'searchbutton',
          handler: 'onSearch',
          reference: 'searchBT',
          plugins: null
        }
      ]
    },

    {
      xtype: 'grid',
      reference: 'grid',
      title: '캐시 도메인 목록',
      flex: 1,
      tools: [
        {
          xtype: 'button',
          text: '도메인 생성',
          cls: 'bg_create',
          handler: 'onCreate',
          margin: 5,
          iconCls: 'x-fa fa-plus'
        },
        {
          xtype: 'button',
          text: '도메인 변경',
          cls: 'bg_update',
          margin: 5,
          iconCls: 'x-fa fa-edit',
          bind: {
            disabled: '{!grid.selection}'
          },
          handler: 'onUpdate'
        },
        {
          xtype: 'button',
          text: '도메인 삭제',
          cls: 'bg_delete',
          margin: 5,
          iconCls: 'x-fa fa-minus',
          bind: {
            disabled: '{!grid.selection}'
          },
          handler: 'onDelete'
        }
      ],
      border: true,
      columns: {
        defaults: { align: 'center', flex: 1 },
        items: [
          { text: '도메인', dataIndex: 'domain' },
          {
            text: 'Forwards',
            dataIndex: 'forwarders',
            renderer: function(value) {
              return `<pre>${JSON.stringify(value)}</pre>`;
            },
            flex: 3
          },
          { text: '최근 수정일', dataIndex: 'mtime' }
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
});
