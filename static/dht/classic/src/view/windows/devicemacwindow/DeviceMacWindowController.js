/**
 * Created by zen on 19. 1. 31.
 */
Ext.define('dhcp.view.windows.devicemacwindow.DeviceMacWindowController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.devicemacwindow',

  /**
   * Called when the view is created
   */
  init: function() {
    const viewModel = this.getViewModel();
    if (viewModel.get('mode') === 'update') {
      const form = this.lookupReference('form');
      const {
        items: { items }
      } = form;
      const { data } = viewModel;

      items.forEach(item => {
        const { name } = item;
        try {
          console.log(name);
          if (name === 'nas') {
            item.setValue(data[name] ? data[name]['id'] : null);
          } else {
            item.setValue(data[name] ? data[name] : null);
          }
        } catch (e) {
          console.log(`not exist ${name} data`);
        }
      });
    }
  },

  onSave: async function() {
    try {
      let url;
      const form = this.lookupReference('form');
      const viewModel = this.getViewModel();
      const modal = this.getView();
      if (viewModel.get('mode') === 'create') {
        url = '/supplicant/create/';
      } else {
        url = `/supplicant/update/${viewModel.get('id')}/`;
      }

      if (!form.isValid()) {
        return;
      }

      const response = await dht.ajax(url, form.getValues());
      if (response.success) {
        modal.fireEvent('save');
        this.lookupReference('form').reset(true);
        this.getView().close();
      } else {
        Ext.Msg.alert('오류', response.errMsg);
      }
    } catch (e) {
      console.log(e);
    }
  },

  onCancel: function() {
    this.lookupReference('form').reset(true);
    this.getView().close();
  }
});
