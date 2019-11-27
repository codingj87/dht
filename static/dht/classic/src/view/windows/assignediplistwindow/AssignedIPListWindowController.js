/**
 * Created by zen on 19. 1. 28.
 */
Ext.define(
  'dhcp.view.windows.assignediplistwindow.AssignedIPListWindowController',
  {
    extend: 'Ext.app.ViewController',
    alias: 'controller.assignediplistwindow',

    /**
     * Called when the view is created
     */
    init: function() {
      const vm = this.getViewModel();
      const ip_list = vm.get('ip_list');
      let store = vm.getStore('ipGridStore');
      store.getProxy().setData(ip_list);
      store.load();
    },

    onCancel: function() {
      this.getView().close();
    },

    onBoxReady: function() {
      const me = this,
        vm = me.getViewModel(),
        ip_list = vm.get('ip_list');
      let store = vm.getStore('ipGridStore');
      store.getProxy().setData(ip_list);
      store.load();
    }

    // onExcel: function () {
    //   const mode = 'xls', flag = 'AssignedIPList',
    //       store = this.lookupReference('grid').getStore(),
    //       vm = this.getViewModel(),
    //       params = vm.get('params');
    //
    //   if (store.getTotalCount() > 65536) {
    //     Ext.Msg.alert('오류', '엑셀 최대 레코드수를 초과했습니다.');
    //     return;
    //   }
    //   params['mode'] = mode;
    //   params['flag'] = flag;
    //   dht.excel('/ip_stats/excel', params);
    // }
  }
);
