/**
 * Created by parkyes90 on 18. 01. 09.
 */
Ext.define(
  'dhcp.view.ipmanagement.dhcptemplatesmanagement.DHCPTemplatesManagementModel',
  {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.dhcptemplatesmanagement',

    requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],
    stores: {
      gridStore: {
        proxy: {
          type: 'ajax',
          url: '/dhcp_templates/list_up/',
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
  }
);
