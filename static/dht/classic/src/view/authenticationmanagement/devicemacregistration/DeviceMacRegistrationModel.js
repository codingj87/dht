/**
 * Created by zen on 19. 1. 30.
 */
Ext.define(
  'dhcp.view.authenticationmanagement.devicemacregistration.DeviceMacRegistrationModel',
  {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.devicemacregistration',

    requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],

    stores: {
      gridStore: {
        proxy: {
          type: 'ajax',
          url: '/supplicant/list/',
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
