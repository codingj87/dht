/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.domainmanagement.cachedomain.CacheDomainModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.cachedomain',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],

  stores: {
    gridStore: {
      proxy: {
        type: 'ajax',
        url: '/cache_domain/list_up/',
        reader: {
          type: 'json',
          rootProperty: 'data',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: true
    }
    /*
        A declaration of Ext.data.Store configurations that are first processed as binds to produce an effective
        store configuration. For example:

        users: {
            model: 'CacheDomain',
            autoLoad: true
        }
        */
  },

  data: {
    sdate: new Date(),
    edate: new Date()
    /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
  }
});
