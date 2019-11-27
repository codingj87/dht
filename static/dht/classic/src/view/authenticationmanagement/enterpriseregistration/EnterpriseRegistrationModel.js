/**
 * Created by zen on 19. 1. 28.
 */
Ext.define(
  'dhcp.view.authenticationmanagement.enterpriseregistration.EnterpriseRegistrationModel',
  {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.enterpriseregistration',

    requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],
    stores: {
      gridStore: {
        proxy: {
          type: 'ajax',
          url: '/nas_type/list/',
          reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'totalCount'
          }
        },
        autoLoad: true,
        listeners: { beforeload: 'gridStoreBeforeload' }
      },
      ipGridStore: {}
    },
    data: {}
  }
);
