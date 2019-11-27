/**
 * Created by zen on 19. 5. 15.
 */
Ext.define('dhcp.view.windows.cachedomainwindow.CacheDomainWindowController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.cachedomainwindow',

  /**
   * Called when the view is created
   */
  init: function() {
    const viewModel = this.getView().getViewModel();
    if (viewModel.get('id')) {
      const form = this.lookupReference('form');
      const {
        items: { items }
      } = form;
      const { data } = viewModel;
      items.forEach(item => {
        if (Object.prototype.hasOwnProperty.call(data, item.name)) {
          item.setValue(data[item.name]);
        }
      });
    }
  },
  handleSave: async function() {
    const form = this.lookupReference('form');
    const viewModel = this.getView().getViewModel();

    if (form.isValid()) {
      let url = '/cache_domain/create/';
      const params = form.getValues();

      if (viewModel.get('id')) {
        params.id = viewModel.get('id');
        url = '/cache_domain/update/';
      }
      try {
        const response = await dht.ajax(url, JSON.stringify(params));
        if (response.success) {
          this.getView().fireEvent('save');
          this.getView().close();
        } else {
          Ext.Msg.alert('오류', response.errMsg);
        }
      } catch (e) {
        Ext.Msg.alert('오류', e);
      }
    }
  },
  handleCancel: function() {
    this.getView().close();
  },
  onChange: function(cp, value) {
    const IPAddressRe = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const lastValue = value[value.length - 1];
    if (!IPAddressRe.test(lastValue)) {
      Ext.Msg.alert('알림', 'IP만 추가 가능 합니다.');
      cp.setValue(value.splice(0, value.length - 1));
    }
  }
});
