/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dht.view.dhcp.settingmanagement.SettingManagementController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.settingmanagement',

  requires: [
    // 'dht.view.dht.settingmanagement.CompareSettingWindow'
  ],

  gridStoreBeforeload: function(store) {
    store
      .getProxy()
      .setExtraParams(this.lookupReference('searchForm').getValues());
  },

  gridStoreLoad: function() {
    this.lookupReference('searchBT').setLoading(false);
  },

  onSearch: function() {
    this.lookupReference('searchBT').setLoading(false);
    this.getViewModel()
      .getStore('gridStore')
      .loadPage(1);
  },

  onDownload: function(cp) {
    const record = cp.$widgetRecord.data;
    dhcp.text('/setting_management/download_config', record);
  },

  onCompare: function(cp) {
    const me = this;
    const vm = me.getViewModel();
    const record = cp.selection.data;

    dht.ajax('/setting_management/compare_config', record, function(response) {
      if (response.success === true) {
        vm.set('compare_data', {
          after: response.data.after,
          before: response.data.before,
          size: response.data.size
        });
        me.onCompareShow();
      } else {
        Ext.Msg.alert('오류', '네트워크 이상');
      }
    });
  },

  onCompareShow: function() {
    const me = this;
    const vm = me.getViewModel();
    const compare_data = vm.data.compare_data;
    const base = difflib.stringAsLines(compare_data.before);
    const newtxt = difflib.stringAsLines(compare_data.after);
    const sm = new difflib.SequenceMatcher(base, newtxt);
    const opcodes = sm.get_opcodes();
    const height = sm.a.length > sm.b.length ? sm.a.length : sm.b.length;
    const copy = JSON.parse(JSON.stringify(opcodes));
    const addLines = copy.map(item => {
      if (item[0] === 'insert' || item[0] === 'delete') {
        const beforeDiff = Math.abs(item[1] - item[2]);
        const afterDiff = Math.abs(item[3] - item[4]);
        return beforeDiff + afterDiff;
      }
      return 0;
    });
    const sum = addLines.reduce((a, b) => a + b, 0);
    me.lookupReference('after').setHeight((height + sum) * 22);
    const afterEl = me.lookupReference('after').getEl().dom;
    while (afterEl.firstChild) afterEl.removeChild(afterEl.firstChild);
    afterEl.appendChild(
      diffview.buildView({
        baseTextLines: base,
        newTextLines: newtxt,
        opcodes: opcodes,
        baseTextName: 'Before',
        newTextName: 'After',
        contextSize: compare_data.size,
        viewType: 0
      })
    );
  }
});
