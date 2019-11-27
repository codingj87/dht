/**
 * Created by zen on 19. 4. 12.
 */
Ext.define('dht.view.windows.clusterwindow.ClusterWindowController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.clusterwindow',

  /**
   * Called when the view is created
   */
  init: function() {},
  handleSave: async function() {
    const form = this.lookupReference('form');
    const type = this.getView().title === '수정' ? 'update' : 'create';
    const pk = this.getView()
      .getViewModel()
      .get('pk');

    let values = form.getValues();

    if (pk) {
      values = Object.assign(values, { pk });
    }

    const response = await dht.ajax(`/cluster/${type}`, values);

    if (!response.success) {
      return Ext.Msg.alert('오류', response.errMsg);
    }

    this.getView().fireEvent('save');
    return this.getView().close();
  },
  handleCancel: function() {
    this.getView().close();
  }
});
