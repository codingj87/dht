/**
 * Created by zen on 19. 5. 13.
 */
Ext.define('dhcp.view.windows.recordformwindow.RecordFormWindowController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.recordformwindow',

  /**
   * Called when the view is created
   */
  init: function() {
    const viewModel = this.getView().getViewModel();
    const form = this.lookupReference('form');
    let formElements;

    if (viewModel.get('record_type') === 'PTR') {
      formElements = viewModel.get('reverseForm');
    } else {
      formElements = viewModel.get('forwardForm');
    }

    formElements.forEach(element => form.add(element));
  },
  handleSave: function() {
    const form = this.lookupReference('form');
    if (form.isValid()) {
      this.addDot();
      this.getView().fireEvent('save', form.getValues());
      form.reset();
      this.getView().close();
    }
  },
  handleCancel: function() {
    this.getView().close();
  },
  addDot: function() {
    const addDotList = ['PTR', 'NS', 'MX', 'CNAME', 'SRV'];
    const recordType = this.lookupReference('recordType');
    const recordValue = this.lookupReference('recordValue');
    const originValue = recordValue.getValue();

    if (
      addDotList.includes(recordType.getValue()) &&
      !originValue.endsWith('.')
    ) {
      recordValue.setValue(`${originValue}.`);
    }
  }
});
