/**
 * Created by zen on 19. 1. 28.
 */
Ext.define(
  'dhcp.view.authenticationmanagement.emhsregistration.EMHSRegistrationModel',
  {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.emhsregistration',

    requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],
    stores: {
      gridStore: {
        proxy: {
          type: 'ajax',
          url: '/nas/list/',
          reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'totalCount'
          }
        },
        autoLoad: true,
        listeners: { beforeload: 'gridStoreBeforeload' }
      }
    },
    data: {}
  }
);
