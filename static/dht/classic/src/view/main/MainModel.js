Ext.define('dht.view.main.MainModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.main',

  requires: ['Ext.data.reader.Json', 'Ext.data.proxy.Ajax'],

  stores: {
    // comboboxStore: {
    //   fields: ['id', 'name'],
    //   proxy: {
    //     type: 'ajax',
    //     url: '/cluster/list_up',
    //     reader: {
    //       type: 'json',
    //       rootProperty: 'data',
    //       totalProperty: 'totalCount'
    //     }
    //   },
    //   autoLoad: true
    // }
  },
  data: {
    currentView: null,
    treeWidth: 180,
    logout_time: '',
    time_int: '',
    time: ''
  },

  formulas: {
    logout_string: function(get) {
      if (SESSION_IDLE_TIME_CHECK) {
        return Ext.String.format(
          '세션만료시간: {0}',
          dht.renderDuration(
            parseInt((get('logout_time') - get('time_int')) / 1000)
          )
        );
      } else {
        return;
      }
    }
  }
});
