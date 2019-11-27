/**
 * Created by zen on 19. 1. 31.
 */
Ext.define('dhcp.view.windows.devicemacwindow.DeviceMacWindowModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.devicemacwindow',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],

  stores: {
    nasIdStore: {
      proxy: {
        type: 'ajax',
        url: '/nas/list/',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: true
    }
  },

  data: {
    form_id_set: new Set()
  }
});
