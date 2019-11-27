/**
 * Created by go on 16. 4. 8.
 */
Ext.define('dht.view.setting.Setting', {
  extend: 'Ext.Container',
  requires: [
    'Ext.layout.container.Fit',
    'Ext.tab.Panel',
    'dht.view.setting.SettingController',
    'dht.view.setting.SettingModel',
    'dht.view.setting.general.General',
    'dht.view.setting.replication.Replication',
    'dht.view.setting.user.User',
    'Ext.container.Container',
    'Ext.layout.container.HBox',
    'dht.view.dhcp.clustermanagement.ClusterManagement'
  ],
  xtype: 'setting',

  viewModel: { type: 'setting' },
  controller: 'setting',

  layout: 'fit',
  items: [
    {
      xtype: 'container',
      layout: { type: 'hbox', align: 'stretch' },
      defaults: { margin: 10 },
      items: [
        {
          xtype: 'tabpanel',
          flex: 1,
          cls: 'dhcp__tab_panel',
          reference: 'tabpanel',
          items: [
            { xtype: 'user', title: '사용자 관리' },
            // { xtype: 'general', title: '일반 설정', width: 50 },
            // { xtype: 'clustermanagement' },
            { xtype: 'replication', title: 'DB 이중화', itemId: 'replication' }
          ],
          listeners: { beforerender: 'showDBReplication' }
        }
      ]
    }
  ]
});
