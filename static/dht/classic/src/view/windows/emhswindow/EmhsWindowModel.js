/**
 * Created by zen on 19. 1. 28.
 */
Ext.define('dhcp.view.windows.emhswindow.EmhsWindowModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.emhswindow',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],

  stores: {
    nasTypeStore: {
      proxy: {
        type: 'ajax',
        url: '/nas_type/list/',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: true
    }
  },
  data: {}
  // formulas: {
  //     GET_TITLE: function(get) {
  //         return {create: 'eMHS 등록', update: 'eMHS 수정'}[get('mode')];
  //     }
  // }
});
