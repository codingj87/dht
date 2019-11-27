/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.domainmanagement.forwarddomain.ForwardDomainController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.forwarddomain',

  uses: ['dhcp.view.windows.forwarddomainwindow.ForwardDomainWindow'],

  /**
   * Called when the view is created
   */
  init: function() {},
  onCreate: function(cp) {
    const store = this.lookupReference('grid').getStore();
    const viewModel = this.getView().getViewModel();
    const height = Ext.getBody().getViewSize().height * 0.9;
    const width = Ext.getBody().getViewSize().width * 0.7;
    new dhcp.view.windows.forwarddomainwindow.ForwardDomainWindow({
      animateTarget: cp,
      title: '도메인 생성',
      height,
      width,
      viewModel: {
        data: viewModel.get('forwardArgs')[0]
      },
      listeners: {
        save: function() {
          store.reload();
          Ext.Msg.alert('알림', '도메인 생성이 완료됐습니다.');
        }
      }
    }).show();
  },
  onSearch: function() {
    const store = this.lookupReference('grid').getStore();
    store
      .getProxy()
      .setExtraParams(this.lookupReference('searchForm').getValues());
    store.loadPage(1);
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

        new dhcp.view.windows.forwarddomainwindow.ForwardDomainWindow({
          animateTarget: cp,
          title: '도메인 수정',
          height,
          width,
          viewModel: {
            data: Object.assign(data, viewModel.get('forwardArgs')[0])
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
