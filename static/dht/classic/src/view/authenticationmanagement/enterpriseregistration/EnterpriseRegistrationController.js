/**
 * Created by zen on 19. 1. 28.
 */
Ext.define(
  'dhcp.view.authenticationmanagement.enterpriseregistration.EnterpriseRegistrationController',
  {
    extend: 'Ext.app.ViewController',
    alias: 'controller.enterpriseregistration',

    uses: ['dhcp.view.windows.enterprisewindow.EnterpriseWindow'],

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
      dhcp.excel('/nas_type/excel/', params);
    },

    handleCreate: function(cp) {
      const me = this;
      new dhcp.view.windows.enterprisewindow.EnterpriseWindow({
        title: 'NAS Type 추가',
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

    handleDelete: function() {
      const grid = this.lookupReference('grid');
      const {
        data: { id, type }
      } = grid.getSelection()[0];
      Ext.Msg.confirm('알림', `${type}을 삭제 하시겠습니까?`, async function(
        text
      ) {
        if (text === 'yes') {
          try {
            const response = await dht.ajax(`/nas_type/delete/${id}/`);
            if (response.success) {
              grid.getStore().reload();
              Ext.Msg.alert('알림', `${type} 삭제 완료`);
            } else {
              Ext.Msg.alert('오류', response.errMsg);
            }
          } catch (e) {
            console.log(e);
          }
        }
      });
    },
    handleUpdate: async function(cp) {
      try {
        const me = this;
        const grid = this.lookupReference('grid');
        const {
          data: { id }
        } = grid.getSelection()[0];
        const response = await dht.ajax(`/nas_type/read/${id}/`);
        if (response.success) {
          const { data } = response;
          data.mode = 'update';
          new dhcp.view.windows.enterprisewindow.EnterpriseWindow({
            title: 'NAS Type 수정',
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
    }
  }
);
