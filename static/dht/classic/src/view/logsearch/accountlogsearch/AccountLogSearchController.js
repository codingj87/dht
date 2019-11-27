/**
 * Created by zen on 19. 5. 13.
 */
Ext.define('dhcp.view.logsearch.accountlogsearch.AccountLogSearchController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.accountlogsearch',

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

  handleSearch: function() {
    const me = this;
    const form = this.lookupReference('searchForm');
    const {
      nas_ip: nasIp,
      calling_station_id: callingStationId
    } = form.getValues();

    if (form.isValid()) {
      if (nasIp && dhcp.checkSearchIpForm(nasIp, 'narmal')) return;
      if (
        callingStationId &&
        dhcp.checkSearchIpForm(callingStationId, 'narmal')
      )
        return;

      me.lookupReference('searchBT').setLoading(false);
      me.getViewModel()
        .getStore('gridStore')
        .loadPage(1);
    } else {
      Ext.Msg.alert('알림', '필요한 형식을 입력해주세요.');
    }
  },

  handleChangeAccountCombo: function(record, accountStatusValue) {
    const me = this;
    const vm = me.getViewModel();
    const statusType = me.lookupReference('status_type');

    function setStatusCombo(statusList) {
      const data = [{ display: 'all', value: '*' }];

      statusList.forEach((item, idx) => {
        data[idx + 1] = { display: item, value: item };
      });

      vm.set('statusComboStore', {
        fields: ['value', 'display'],
        data: data
      });
      statusType.setConfig('value', '*');
      me.handleChangeStatusCombo();
    }

    if (accountStatusValue === 'Accounting') {
      setStatusCombo(['Start', 'Interim-Update']);
    } else if (accountStatusValue === 'Accounted') {
      setStatusCombo(['Stop', 'Stop-abnormal']);
    } else {
      setStatusCombo(['Start', 'Interim-Update', 'Stop', 'Stop-abnormal']);
    }
  },

  handleChangeStatusCombo: function(record, statusTypeValue) {
    const me = this;
    const { value: accountStatusValue } = me.lookupReference('account_status');
    const terminateCause = me.lookupReference('terminate_cause');
    const vm = me.getViewModel();

    if (
      accountStatusValue === 'Accounting' ||
      statusTypeValue === 'Start' ||
      statusTypeValue === 'Interim-Update'
    ) {
      terminateCause.setConfig('readOnly', true);
      terminateCause.setConfig('value', '-');
    } else {
      vm.set('terminateComboStore', {
        fields: ['value', 'display'],
        data: [
          { display: 'all', value: '*' },
          { display: 'Session-Timeout', value: 'Session-Timeout' },
          { display: 'Idle-Timeout', value: 'Idle-Timeout' }
        ]
      });
      terminateCause.setConfig('readOnly', false);
      terminateCause.setConfig('value', '*');
    }
  }
});
