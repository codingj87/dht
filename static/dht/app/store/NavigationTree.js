Ext.define('dht.store.NavigationTree', {
  extend: 'Ext.data.TreeStore',

  storeId: 'NavigationTree',

  fields: [
    {
      name: 'text'
    }
  ],

  root: {
    expanded: true,
    children: [
      // DHCP === '1' && {
      //   text: 'DHCP',
      //   iconCls: 'x-fa fa-server',
      //   children: [
      //     {
      //       text: 'IP 할당 현황',
      //       iconCls: 'x-fa fa-signal',
      //       viewType: 'ipassignedstatus',
      //       leaf: true
      //     },
      //     {
      //       text: 'IP 관리',
      //       iconCls: 'x-fa fa-sitemap',
      //       viewType: 'ipmanagement',
      //       leaf: true
      //     },
      //     {
      //       text: '이력 관리',
      //       iconCls: 'x-fa fa-history',
      //       viewType: 'logmanagement',
      //       leaf: true
      //     },
      //     {
      //       text: '설정 관리',
      //       iconCls: 'x-fa fa-database',
      //       viewType: 'dht',
      //       leaf: true
      //     }
      //   ]
      // },
      // DMS === '1' && {
      //   text: 'DNS',
      //   iconCls: 'x-fa fa-desktop',
      //   // viewType: "dht",
      //   children: [
      //     {
      //       text: '도메인 관리',
      //       iconCls: 'x-fa fa-book',
      //       viewType: 'domainmanagement',
      //       leaf: true
      //     }
      //     // {
      //     //   text: '서버 관리',
      //     //   iconCls: 'x-fa fa-database',
      //     //   viewType: 'dmsservermanagement',
      //     //   leaf: true
      //     // }
      //   ]
      // },
      // RADIUS === '1' && {
      //   text: 'RADIUS',
      //   iconCls: 'x-fa fa-lock',
      //   // viewType: "dht",
      //   children: [
      //     {
      //       text: '정책 관리',
      //       iconCls: 'x-fa fa-sitemap',
      //       viewType: 'authenticationmanagement',
      //       leaf: true
      //     },
      //     // {
      //     //   text: 'IP 할당 현황',
      //     //   iconCls: 'x-fa fa-signal',
      //     //   viewType: 'ipaddressmanagement',
      //     //   leaf: true
      //     // },
      //     {
      //       text: '이력 관리',
      //       iconCls: 'x-fa fa-history',
      //       viewType: 'logsearch',
      //       leaf: true
      //     }
      //     // {
      //     //   text: '서버 관리',
      //     //   iconCls: 'x-fa fa-database',
      //     //   viewType: 'radius',
      //     //   leaf: true
      //     // }
      //   ]
      // },
      {
        text: '환경설정',
        iconCls: 'x-fa fa-cogs',
        viewType: 'setting',
        leaf: true
      }
      // {
      //     text: '연동데이터 현황조회',
      //     iconCls: 'x-fa fa-search',
      //     viewType: 'traffic',
      //     leaf: true
      // },
      // LEVEL == '1' ? {
      //     text: '환경설정',
      //     iconCls: 'x-fa fa-wrench',
      //     viewType: 'setting',
      //     leaf: true
      // } : {}
    ]
  }
});
