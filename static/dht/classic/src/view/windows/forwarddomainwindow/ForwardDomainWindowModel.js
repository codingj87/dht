/**
 * Created by zen on 19. 5. 10.
 */
Ext.define('dhcp.view.windows.forwarddomainwindow.ForwardDomainWindowModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.forwarddomainwindow',

  requires: ['Ext.data.proxy.Memory', 'Ext.data.reader.Json'],

  stores: {
    recordStore: {
      remoteFilter: true,
      pageSize: 15,
      proxy: {
        type: 'memory',
        enablePaging: true,
        reader: { type: 'json' }
      }
    },
    forwardRecordTypeStore: {
      fields: ['value', 'display'],
      data: [
        { value: 'A', display: 'A' },
        { value: 'NS', display: 'NS' },
        { value: 'MX', display: 'MX' },
        { value: 'TXT', display: 'TXT' },
        { value: 'AAAA', display: 'AAAA' },
        { value: 'CNAME', display: 'CNAME' },
        { value: 'SRV', display: 'SRV' }
      ]
    },
    reverseRecordTypeStore: {
      fields: ['value', 'display'],
      data: [{ value: 'PTR', display: 'PTR' }]
    }
  },

  data: {}
});
