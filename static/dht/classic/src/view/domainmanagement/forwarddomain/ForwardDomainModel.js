/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.domainmanagement.forwarddomain.ForwardDomainModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.forwarddomain',

  requires: ['Ext.data.proxy.Ajax', 'Ext.data.reader.Json'],

  stores: {
    gridStore: {
      proxy: {
        type: 'ajax',
        url: '/domain/list_up/',
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
    sdate: new Date(),
    edate: new Date(),
    forwardArgs: [
      {
        workType: 'forward',
        label: '도메인',
        name: 'domain',
        vtype: 'KoreanDomain'
      }
    ]
  }
});
