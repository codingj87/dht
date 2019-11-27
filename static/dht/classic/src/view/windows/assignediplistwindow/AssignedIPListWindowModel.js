/**
 * Created by zen on 19. 1. 28.
 */
Ext.define('dhcp.view.windows.assignediplistwindow.AssignedIPListWindowModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.assignediplistwindow',

  requires: ['Ext.data.proxy.Memory'],

  stores: {
    ipGridStore: {
      autoLoad: false,
      pageSize: 25,
      proxy: {
        type: 'memory',
        enablePaging: true
      }
    }
  },
  data: {}
});
