/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.domainmanagement.reversedomain.ReverseDomainModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.reversedomain',

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
      listeners: {
        beforeload: 'onBeforeload'
      },
      autoLoad: true
    }
  },

  data: {
    sdate: new Date(),
    edate: new Date(),
    reverseArgs: [
      {
        workType: 'reverse',
        label: 'IP',
        name: 'ip',
        vtype: 'ThreeLetterIPAddress'
      }
    ],
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
