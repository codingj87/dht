/**
 * Created by zen on 19. 1. 31.
 */
Ext.define('dhcp.view.logsearch.authlogsearch.AuthLogSearchController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.authlogsearch',

  /**
   * Called when the view is created
   */
  init: function() {},
  gridStoreBeforeload: function(store) {
    store
      .getProxy()
      .setExtraParams(this.lookupReference('searchForm').getValues());
  },

  gridStoreLoad: function() {
    this.lookupReference('searchBT').setLoading(false);
  },

  onSearch: function() {
    const form = this.lookupReference('searchForm'),
      mac = form.getValues()['mac'],
      ip = form.getValues()['ip'];

    if (form.isValid()) {
      if (ip && dhcp.checkSearchIpForm(ip, 'normal')) return;
      if (mac && dhcp.checkSearchMacForm(mac)) return;

      this.lookupReference('searchBT').setLoading(false);
      this.getViewModel()
        .getStore('gridStore')
        .loadPage(1);
    } else {
      Ext.Msg.alert('알림', '필요한 형식을 입력해주세요.');
    }
  },
  onExcel: function() {
    const mode = 'xls',
      store = this.lookupReference('grid').getStore(),
      params = this.lookupReference('searchForm').getValues();

    if (store.getTotalCount() > 65536) {
      Ext.Msg.alert('오류', '엑셀 최대 레코드수를 초과했습니다.');
      return;
    }
    params['mode'] = mode;
    dhcp.excel('/log_search/excel/', params);
  },
  onchangeCombo: function(record, data) {
    const vm = this.getViewModel();
    const packet_type_combo = this.lookupReference('packet_type_combo');

    if (data === 'equipment') {
      vm.set('comboStore', {
        fields: ['value', 'display'],
        data: [
          { display: 'all', value: '*' },
          { display: 'Account On', value: 'Accounting-On' },
          { display: 'Account Off', value: 'Accounting-Off' }
        ]
      });
      packet_type_combo.setConfig('value', '*');
    } else if (data === 'user') {
      vm.set('comboStore', {
        fields: ['value', 'display'],
        data: [
          { display: 'all', value: '*' },
          { display: 'Access Request', value: 'Access-Request' },
          { display: 'Interim Update', value: 'Interim-Update' },
          { display: 'Start', value: 'Start' },
          { display: 'Stop', value: 'Stop' }
        ]
      });
      packet_type_combo.setConfig('value', '*');
    } else if (data === '*') {
      vm.set('comboStore', {
        fields: ['value', 'display'],
        data: [
          { display: 'all', value: '*' },
          { display: 'Account On', value: 'Accounting-On' },
          { display: 'Account Off', value: 'Accounting-Off' },
          { display: 'Access Request', value: 'Access-Request' },
          { display: 'Interim Update', value: 'Interim-Update' },
          { display: 'Start', value: 'Start' },
          { display: 'Stop', value: 'Stop' }
        ]
      });
      packet_type_combo.setConfig('value', '*');
    }
  },

  handleLogReset: function() {
    const grid = this.lookupReference('grid');
    Ext.Msg.confirm('알림', `이력을 초기화 하시겠습니까?`, async function(
      text
    ) {
      if (text === 'yes') {
        try {
          const response = await dht.ajax(`/log_search/log_reset/`);
          if (response.success) {
            grid.getStore().reload();
            Ext.Msg.alert('알림', `이력 초기화 완료`);
          } else {
            Ext.Msg.alert('오류', response.errMsg);
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  }
});
