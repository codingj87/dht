/**
 * Created by zen on 19. 1. 30.
 */
Ext.define(
  'dhcp.view.authenticationmanagement.devicemacregistration.DeviceMacRegistrationController',
  {
    extend: 'Ext.app.ViewController',
    alias: 'controller.devicemacregistration',

    uses: ['dhcp.view.windows.devicemacwindow.DeviceMacWindow'],
    /**
     * Called when the view is created
     */
    init: function() {},

    gridStoreBeforeload: function(store) {
      store
        .getProxy()
        .setExtraParams(this.lookupReference('searchForm').getValues());
    },

    handleSearch: function() {
      const form = this.lookupReference('searchForm').getValues();
      const { mac, ip } = form;

      if (mac && dhcp.checkSearchMacForm(mac)) return;
      if (ip && dhcp.checkSearchIpForm(ip, 'normal')) return;

      this.getViewModel()
        .getStore('gridStore')
        .loadPage(1);
    },

    handleExcel: function() {
      const mode = 'xls';
      const store = this.lookupReference('grid').getStore();
      const params = this.lookupReference('searchForm').getValues();

      if (store.getTotalCount() > 65536) {
        Ext.Msg.alert('오류', '엑셀 최대 레코드수를 초과했습니다.');
        return;
      }
      params.mode = mode;
      dhcp.excel('/supplicant/excel/', params);
    },

    handleCreate: function(cp) {
      const me = this;
      new dhcp.view.windows.devicemacwindow.DeviceMacWindow({
        title: '단말 등록',
        animateTarget: cp,
        viewModel: {
          data: {
            mode: 'create'
          }
        },
        listeners: {
          save: function() {
            me.getViewModel()
              .getStore('gridStore')
              .loadPage(1);
          }
        }
      }).show();
    },

    handleUpdate: async function(cp) {
      try {
        const me = this;
        const grid = me.lookupReference('grid');
        const {
          data: { id }
        } = grid.getSelection()[0];
        const response = await dht.ajax(`/supplicant/read/${id}/`);
        if (response.success) {
          const { data } = response;
          data.mode = 'update';
          new dhcp.view.windows.devicemacwindow.DeviceMacWindow({
            title: '단말 수정',
            animateTarget: cp,
            viewModel: {
              data
            },
            listeners: {
              save: function() {
                me.getViewModel()
                  .getStore('gridStore')
                  .loadPage(1);
              }
            }
          }).show();
        } else {
          Ext.Msg.alert('오류', response.errMsg);
        }
      } catch (e) {
        console.log(e);
      }
    },

    handleDelete: function() {
      const grid = this.lookupReference('grid');
      const {
        data: { id, mac }
      } = grid.getSelection()[0];
      Ext.Msg.confirm('알림', `${mac}을/를 삭제 하시겠습니가?`, async function(
        text
      ) {
        if (text === 'yes') {
          try {
            const response = await dht.ajax(`/supplicant/delete/${id}/`);
            if (response.success) {
              grid.getStore().reload();
              Ext.Msg.alert('알림', `${mac} 삭제 완료`);
            } else {
              Ext.Msg.alert('오류', response.errMsg);
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    }
  }
);
