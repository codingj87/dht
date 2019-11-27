/**
 * Created by zen on 18. 4. 23.
 */
Ext.define(
  'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.iplistwindow.IPListWindowModel',
  {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.iplistwindow',

    requires: ['Ext.data.proxy.Memory'],

    stores: {
      ipGridStore: {
        autoLoad: false,
        pageSize: 256,
        proxy: {
          type: 'memory',
          enablePaging: true
        }
      },
      classStore: {
        fields: ['value', 'display'],
        data: [
          { value: '', display: 'default' },
          { value: 'win', display: 'win' },
          { value: 'PREMIUM', display: 'premium' }
        ]
      },
      typeStore: {
        fields: ['value', 'display'],
        data: [
          { value: 'dynamic', display: '유동 IP' },
          { value: 'manual', display: '고정 IP' }
        ]
      },
      templateStore: {
        fields: ['value', 'text'],
        proxy: {
          type: 'ajax',
          url: '/dhcp_templates/templates_combo/',
          reader: {
            type: 'json',
            rootProperty: 'data'
          }
        },
        autoLoad: true
      }
    },
    data: {}
  }
);
