/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.domainmanagement.cachedomain.CacheDomainController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.cachedomain',

  uses: ['dhcp.view.windows.cachedomainwindow.CacheDomainWindow'],

  /**
   * Called when the view is created
   */
  init: function() {},
  onSearch: function() {
    const store = this.lookupReference('grid').getStore();
    store
      .getProxy()
      .setExtraParams(this.lookupReference('searchForm').getValues());
    store.loadPage(1);
  },
  onCreate: function(cp) {
    const store = this.lookupReference('grid').getStore();
    const height = Ext.getBody().getViewSize().height * 0.22;
    const width = Ext.getBody().getViewSize().width * 0.5;
    new dhcp.view.windows.cachedomainwindow.CacheDomainWindow({
      animateTarget: cp,
      height,
      width,
      title: '캐시 도메인 생성',
      listeners: {
        save: function() {
          Ext.Msg.alert('알림', '캐시 도메인 생성이 완료됐습니다.');
          store.reload();
        }
      }
    }).show();
  },
  onDelete: function() {
    const grid = this.lookupReference('grid');
    const { id } = grid.getSelection()[0];
    Ext.Msg.confirm('확인', '정말 삭제하시겠습니까?', async function(btn) {
      if (btn !== 'yes') return;

      try {
        const response = await dht.ajax('/cache_domain/delete/', { id });

        if (response.success) {
          grid.getStore().reload();
          Ext.Msg.alert('알림', '캐시 도메인 삭제가 완료됐습니다.');
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
    try {
      const response = await dht.ajax('/cache_domain/read/', { id });

      if (response.success) {
        const { data } = response;
        const height = Ext.getBody().getViewSize().height * 0.22;
        const width = Ext.getBody().getViewSize().width * 0.5;

        new dhcp.view.windows.cachedomainwindow.CacheDomainWindow({
          animateTarget: cp,
          title: '도메인 수정',
          height,
          width,
          viewModel: {
            data
          },
          listeners: {
            save: function() {
              grid.getStore().reload();
              Ext.Msg.alert('알림', '캐시 도메인 수정이 완료됐습니다.');
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
