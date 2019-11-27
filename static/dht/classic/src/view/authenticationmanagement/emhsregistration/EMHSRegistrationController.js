/**
 * Created by zen on 19. 1. 28.
 */
Ext.define(
  'dhcp.view.authenticationmanagement.emhsregistration.EMHSRegistrationController',
  {
    extend: 'Ext.app.ViewController',
    alias: 'controller.emhsregistration',

    uses: ['dhcp.view.windows.emhswindow.EmhsWindow'],
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
      const { ip } = form;

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
      dhcp.excel('/nas/excel/', params);
    },

    handleCreate: function(cp) {
      const me = this;
      new dhcp.view.windows.emhswindow.EmhsWindow({
        title: 'NAS 추가',
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
        const grid = this.lookupReference('grid');
        const {
          data: { id }
        } = grid.getSelection()[0];
        const response = await dht.ajax(`/nas/read/${id}/`);
        if (response.success) {
          const { data } = response;
          data.mode = 'update';
          data.status += '';
          new dhcp.view.windows.emhswindow.EmhsWindow({
            title: 'NAS 수정',
            animateTarget: cp,
            viewModel: {
              data: data
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
        data: { id, name }
      } = grid.getSelection()[0];
      Ext.Msg.confirm('알림', `${name}을/를 삭제 하시겠습니까?`, async function(
        text
      ) {
        if (text === 'yes') {
          try {
            const response = await dht.ajax(`/nas/delete/${id}/`);
            if (response.success) {
              grid.getStore().reload();
              Ext.Msg.alert('알림', `${name} 삭제 완료`);
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
