/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define(
  'dhcp.view.ipmanagement.dhcptemplatesmanagement.DHCPTemplatesManagementController',
  {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dhcptemplatesmanagement',
    requires: ['dhcp.view.windows.dhcptemplateswindow.DHCPTemplatesWindow'],

    onUpdate: async function() {
      const grid = this.lookupReference('grid');
      const pk = grid.getSelection()[0].get('id');
      const response = await dht.ajax('/dhcp_templates/read/', { pk });
      if (response.success) {
        new dhcp.view.windows.dhcptemplateswindow.DHCPTemplatesWindow({
          title: 'DHCP 템플릿 수정',
          viewModel: {
            data: {
              mode: 'update',
              pk,
              isData: true,
              options: response.data.options || [],
              name: response.data.name
            }
          },
          listeners: {
            save: function() {
              grid.getStore('gridStore').reload();
              Ext.Msg.alert('알림', 'DHCP 템플릿 수정이 완료됐습니다.');
            }
          }
        }).show();
      } else {
        Ext.Msg.alert('알림', response.errMsg);
      }
    },
    onCreate: function() {
      const grid = this.lookupReference('grid');
      new dhcp.view.windows.dhcptemplateswindow.DHCPTemplatesWindow({
        title: 'DHCP 템플릿 생성',
        viewModel: {
          data: {
            mode: 'create'
          }
        },
        listeners: {
          save: function() {
            grid.getStore('gridStore').reload();
            Ext.Msg.alert('알림', 'DHCP 템플릿 생성이 완료됐습니다.');
          }
        }
      }).show();
    },
    onDelete: function() {
      const grid = this.lookupReference('grid');
      const pk = grid.getSelection()[0].get('id');
      Ext.Msg.confirm('확인', '삭제 하시겠습니까?', async function(text) {
        if (text === 'yes') {
          const response = await dht.ajax('/dhcp_templates/delete/', { pk });
          if (response.success) {
            Ext.Msg.alert('알림', '템플릿 삭제가 완료됐습니다.');
            grid.getStore().reload();
          } else {
            Ext.Msg.alert('알림', response.errMsg);
          }
        }
      });
    },
    onSearch: function() {
      const form = this.lookupReference('searchForm');
      const grid = this.lookupReference('grid');
      grid
        .getStore()
        .getProxy()
        .setExtraParams(form.getValues());
      grid.getStore().loadPage(1);
    }
  }
);
