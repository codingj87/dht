Ext.define('dht.view.main.Main', {
  extend: 'Ext.container.Viewport',

  requires: [
    'Ext.container.Container',
    'Ext.form.field.Display',
    'Ext.layout.container.Card',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'Ext.list.Tree',
    'Ext.toolbar.Fill',
    'Ext.toolbar.Toolbar',
    'dht.view.main.MainContainerWrap',
    'dht.view.main.MainController',
    'dht.view.main.MainModel',
    'Ext.form.field.ComboBox'
  ],

  controller: 'main',
  viewModel: 'main',

  cls: 'sencha-dash-viewport',
  itemId: 'mainView',

  layout: { type: 'vbox', align: 'stretch' },

  listeners: {
    render: 'onMainViewRender',
    boxready: 'onReady',
    resize: 'onResize'
  },

  items: [
    {
      xtype: 'toolbar',
      cls: 'sencha-dash-dash-headerbar',
      height: 64,
      reference: 'headerBar',
      itemId: 'headerBar',
      items: [
        {
          xtype: 'container',
          reference: 'senchaLogo',
          width: 200,
          height: 50,
          style: 'top: 0px !important',
          layout: { type: 'hbox' },
          items: [
            {
              xtype: 'displayfield',
              reference: 'logoIcon',
              margin: '5 0 0 10',
              value:
                '<a href="#ipassignedstatus">' +
                '<img style="height: 35px; width: 45px;" src="/static/dht/resources/images/logo_2.png">' +
                '</a>'
              // value: 'ZEN DHCP'
            },
            {
              xtype: 'displayfield',
              margin: '10 0 0 5',
              value:
                '<a href="#ipassignedstatus" style="text-decoration:none; color: black; font-size: 20pt; font-weight: 800;">' +
                // '<span style="font-size: 22px;">zen</span>' +
                '<span style="color:#E82733;">DHT</span></a>'
            }
          ]
        },
        {
          margin: '0 30 0 8',
          ui: 'header',
          iconCls: 'x-fa fa-angle-left',
          id: 'main-help-btn',
          handler: 'onToggleNavigationSize'
        },
        // {
        //   xtype: 'combobox',
        //   // emptyText: CLUSTER_NAME ? CLUSTER_NAME : '클러스터 선택',
        //   name: 'pk',
        //   displayField: 'name',
        //   valueField: 'id',
        //   reference: 'comboboxField',
        //   bind: { store: '{comboboxStore}' },
        //   listeners: {
        //     change: 'handleChangeCombobox'
        //   }
        // },
        // {
        //   xtype: 'displayfield',
        //   id: 'id_currentIPCount',
        //   fieldLabel: 'License(IP수) ',
        //   fieldStyle: 'color: #646464;',
        //   // value: IPCOUNT,
        //   listeners: { beforerender: 'checkLicense' }
        // },
        {
          xtype: 'displayfield',
          id: 'id_licenseCount',
          fieldStyle: 'color: #646464;',
          // value: ' / ' + LICENSE
        },
        {
          iconCls: 'x-fa fa-exclamation',
          id: 'id_alertLicenseIcon',
          scale: 'small',
          style: 'background-color: red;',
          hidden: true,
          tooltip: 'License수 초과'
        },
        '->',
        {
          xtype: 'displayfield',
          fieldStyle: 'color: #646464; margin-top: 15px;',
          bind: { value: '{time}' }
        },
        {
          xtype: 'displayfield',
          fieldStyle:
            'cursor: pointer; color: #646464; text-align: center; margin-top: 15px;',
          value: `<b>${USERNAME}</b> ${USERID}`,
          listeners: { afterrender: 'userIDClick' }
        },
        {
          xtype: 'displayfield',
          fieldStyle: 'color: #646464; font-size: 8px; margin-top: 15px;',
          bind: { value: '{logout_string}' }
        },
        {
          iconCls: 'x-fa fa-sign-out',
          ui: 'header',
          href: '/logout',
          hrefTarget: '_self',
          tooltip: '로그아웃'
        }
      ]
    },
    {
      xtype: 'maincontainerwrap',
      id: 'main-view-detail-wrap',
      reference: 'mainContainerWrap',
      flex: 1,
      layout: { type: 'hbox', align: 'stretch' },
      items: [
        {
          xtype: 'treelist',
          reference: 'navigationTreeList',
          itemId: 'navigationTreeList',
          ui: 'navigation',
          store: 'NavigationTree',
          width: 200,
          // hidden: true,
          expanderFirst: false,
          expanderOnly: false,
          singleExpand: true,
          listeners: { selectionchange: 'onNavigationTreeSelectionChange' }
        },
        {
          xtype: 'container',
          flex: 1,
          minWidth: 1040,
          padding: '0 0 0 5',
          reference: 'mainCardPanel',
          cls: 'sencha-dash-right-main-container',
          style: 'background-color: white;',
          itemId: 'contentPanel',
          layout: { type: 'card', anchor: '100%' },
          scrollable: true
        }
      ],
      listeners: { boxready: 'navigationBoxready' }
    }
  ]
});
