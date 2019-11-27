/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dhcp.view.logmanagement.worklog.WorkLogController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.worklog',

  me: this,

  gridStoreBeforeload: function gridStoreBeforeload(store) {
    store
      .getProxy()
      .setExtraParams(this.lookupReference('searchForm').getValues());
  },

  gridStoreLoad: function gridStoreLoad() {
    this.lookupReference('searchBT').setLoading(false, null);
  },

  onSearch: function onSearch() {
    if (this.lookupReference('searchForm').isValid()) {
      this.lookupReference('searchBT').setLoading(false, null);
      this.getViewModel()
        .getStore('gridStore')
        .loadPage(1);
    } else {
      Ext.Msg.alert('알림', '필요한 형식을 입력해주세요.');
    }
  },

  rollback: function rollback(cp) {
    Ext.Msg.confirm('확인', '롤백 하시겠습니까?', btn => {
      if (btn === 'yes') {
        const record = cp.$widgetRecord;
        if (record.get('is_rollback') === '미적용') {
          const grid = this.lookupReference('grid').getEl();
          const myMask = new Ext.LoadMask({
            msg: 'Please wait...',
            target: grid
          });
          myMask.show();
          setTimeout(function doRollback() {
            dht.ajax('/work_log/rollback', record.data, function ajax(r) {
              if (r.success === true) {
                Ext.Msg.alert(
                  '알림',
                  '롤백 되었습니다.',
                  function updateLicense() {
                    dhcp.getLicenseInfo();
                    window.location.reload();
                  }
                );
              } else {
                Ext.Msg.alert('알림', r.errmsg);
              }
              myMask.destroy();
            });
          }, 1000);
        } else {
          Ext.Msg.alert('알림', '이미 롤백이 적용된 작업입니다.');
        }
      }
    });
  },

  renderConfig: value => {
    if (value !== undefined && value !== null) {
      let displayConfig = '';
      const regEx = /((dynamic)|(manual))-dhcp.*/;
      value.forEach(item => {
        if (regEx.test(item))
          displayConfig += `${item.replace(/[}{]/gi, '')}<br>`;
      });
      return displayConfig;
    }
    return null;
  }
});
