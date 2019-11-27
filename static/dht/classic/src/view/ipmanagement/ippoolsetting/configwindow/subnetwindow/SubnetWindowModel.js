/**
 * Created by zen on 18. 4. 23.
 */
Ext.define(
  'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.SubnetWindowModel',
  {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.subnetwindow',

    requires: ['Ext.data.proxy.Memory'],

    stores: {
      ipGridStore: {
        autoLoad: false,
        pageSize: 256,
        proxy: {
          type: 'memory',
          enablePaging: true
        }
      }
    },
    data: {}
  }
);
