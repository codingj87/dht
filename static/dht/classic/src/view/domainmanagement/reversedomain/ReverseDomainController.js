/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.domainmanagement.reversedomain.ReverseDomainController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.reversedomain',

  requires: ['dhcp.view.windows.forwarddomainwindow.ForwardDomainWindow'],

  /**
   * Called when the view is created
   */
  init: function() {},
  onCreate: function(cp) {
    const store = this.lookupReference('grid').getStore();
    const height = Ext.getBody().getViewSize().height * 0.9;
    const width = Ext.getBody().getViewSize().width * 0.7;
    const viewModel = this.getView().getViewModel();
    new dhcp.view.windows.forwarddomainwindow.ForwardDomainWindow({
      animateTarget: cp,
      title: '도메인 생성',
      height,
      width,
      viewModel: {
        data: viewModel.get('reverseArgs')[0]
      },
      listeners: {
        save: function() {
          store.reload();
          Ext.Msg.alert('알림', '도메인 생성이 완료됐습니다.');
        }
      }
    }).show();
  },
  onBeforeload: function(store) {
    store.getProxy().setExtraParams(
      Object.assign(this.lookupReference('searchForm').getValues(), {
        is_reverse: true
      })
    );
  },
  onSearch: function() {
    this.lookupReference('grid')
      .getStore()
      .loadPage(1);
  },
  onDelete: function() {
    const grid = this.lookupReference('grid');
    const { id } = grid.getSelection()[0];
    Ext.Msg.confirm('확인', '정말 삭제하시겠습니까?', async function(btn) {
      if (btn !== 'yes') return;

      try {
        const response = await dht.ajax('/domain/delete/', { id });

        if (response.success) {
          grid.getStore().reload();
          Ext.Msg.alert('알림', '도메인 삭제가 완료됐습니다.');
        } else {
          Ext.Msg.alert('오류', response.errMsg);
        }
      } catch (e) {
        Ext.Msg.alert('오류', e);
      }
    });
  },
  onUpdate: async function(cp) {
    const grid = this.lookupReference('grid');
    const { id } = grid.getSelection()[0];
    const viewModel = this.getView().getViewModel();
    try {
      const response = await dht.ajax('/domain/read/', { id });

      if (response.success) {
        const { data } = response;
        const height = Ext.getBody().getViewSize().height * 0.9;
        const width = Ext.getBody().getViewSize().width * 0.7;
        const params = Object.assign(data, viewModel.get('forwardArgs')[0]);

        new dhcp.view.windows.forwarddomainwindow.ForwardDomainWindow({
          animateTarget: cp,
          title: '도메인 수정',
          height,
          width,
          viewModel: {
            data: params
          },
          listeners: {
            save: function() {
              grid.getStore().reload();
              Ext.Msg.alert('알림', '도메인 수정이 완료됐습니다.');
            }
          }
        }).show();
      } else {
        Ext.Msg.alert('오류', response.errMsg);
      }
    } catch (e) {
      Ext.Msg.alert('오류', e);
    }
  }
});
