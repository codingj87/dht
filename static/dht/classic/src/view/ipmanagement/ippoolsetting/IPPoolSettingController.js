/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dhcp.view.ipmanagement.ippoolsetting.IPPoolSettingController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.ippoolsetting',

  requires: [
    // 'dht.view.ipmanagement.ippoolsetting.CreateConfigWindow',
  ],

  uses: [
    'dhcp.view.ipmanagement.sharednetworkpanel.SharedNetworkPanel',
    'dhcp.view.windows.ippoolsettingwindow.IPPoolSettingWindow'
  ],

  gridStoreBeforeload: function(store) {
    store
      .getProxy()
      .setExtraParams(this.lookupReference('searchForm').getValues());
  },

  gridStoreLoad: function() {
    this.lookupReference('searchBT').setLoading(false, null);
  },

  onSearch: function() {
    this.lookupReference('searchBT').setLoading(false, null);
    this.getViewModel()
      .getStore('gridStore')
      .loadPage(1);
  },

  onExcel: function() {
    const mode = 'xls';
    const store = this.lookupReference('grid').getStore();
    const params = this.lookupReference('searchForm').getValues();

    if (store.getTotalCount() > 65536) {
      Ext.Msg.alert('오류', '엑셀 최대 레코드수를 초과했습니다.');
      return;
    }
    params.mode = mode;
    dhcp.excel('/ip_pool_setting/excel', params);
  },

  onCreateConfig: function() {
    const me = this;
    const tabPanel = me.getView().up();

    if (me.getViewModel().get('tab')) {
      tabPanel.remove(me.getViewModel().get('tab'));
    }

    const tab = tabPanel.add(1, {
      closable: true,
      xtype: 'sharednetworkpanel',
      title: '추가',
      viewModel: {
        data: {
          mode: 'create_config',
          update: false
        }
      },
      tabConfig: {
        height: '32px'
      }
    });
    me.getViewModel().set('tab', tab);
    tabPanel.setActiveTab(tab);
  },
  onDeleteConfig: function() {
    const me = this;
    const sharedNetwork = me
      .lookupReference('grid')
      .getSelection()[0]
      .get('shared_network');

    Ext.Msg.confirm(
      '알림',
      Ext.String.format('삭제 하시겠습니까?', sharedNetwork),
      function(text) {
        if (text === 'yes') {
          const grid = me.lookupReference('grid').getEl();
          const myMask = new Ext.LoadMask({
            msg: 'Please wait...',
            target: grid
          });
          myMask.show();
          dht.ajax(
            '/ip_pool_setting/delete_config',
            {
              shared_network: sharedNetwork
            },
            function(response) {
              if (response.success === true) {
                me.getViewModel()
                  .getStore('gridStore')
                  .loadPage(1);
                Ext.Msg.alert('알림', '삭제 되었습니다.');
                dhcp.getLicenseInfo();
              } else {
                Ext.Msg.alert('오류', '네트워크 이상');
              }
              myMask.destroy();
            }
          );
        }
      }
    );
  },
  onUpdateConfig: async function() {
    const me = this;
    const sharedNetwork = me
      .lookupReference('grid')
      .getSelection()[0]
      .get('shared_network');
    let response;

    try {
      response = await dht.ajax('/ip_pool_setting/read_config', {
        shared_network: sharedNetwork
      });
    } catch (e) {
      return Ext.Msg.alert('오류', e);
    }

    if (response.success) {
      const subnet = response.data;
      const network = response.shared_network;
      const name = response.shared_network_name;
      const tabPanel = me.getView().up();

      if (me.getViewModel().get('tab')) {
        tabPanel.remove(me.getViewModel().get('tab'));
      }

      const tab = tabPanel.add(1, {
        closable: true,
        xtype: 'sharednetworkpanel',
        title: network,
        viewModel: {
          data: {
            mode: 'create_config',
            title: '수정',
            subnet,
            network,
            name,
            update: true
          }
        },
        tabConfig: {
          height: '32px'
        }
      });
      me.getViewModel().set('tab', tab);
      return tabPanel.setActiveTab(tab);
    }
    return Ext.Msg.alert('오류', '네트워크 이상');
  }
});
