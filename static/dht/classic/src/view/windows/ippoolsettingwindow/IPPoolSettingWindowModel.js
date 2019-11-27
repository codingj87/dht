/**
 * Created by zen on 19. 4. 25.
 */
Ext.define('dhcp.view.windows.ippoolsettingwindow.IPPoolSettingWindowModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.ippoolsettingwindow',

  requires: ['Ext.data.proxy.Memory', 'Ext.data.reader.Json'],

  stores: {
    netMaskStore: {
      fields: ['value', 'display'],
      proxy: {
        type: 'memory',
        reader: {
          type: 'json'
        }
      }
    },
    ipGridStore: {
      pageSize: 256,
      proxy: {
        type: 'memory',
        enablePaging: true,
        reader: {
          type: 'json'
        }
      }
    }
  },

  data: {
    classA: [
      { value: '255.254.0.0', display: '255.254.0.0' },
      { value: '255.252.0.0', display: '255.252.0.0' },
      { value: '255.248.0.0', display: '255.248.0.0' },
      { value: '255.240.0.0', display: '255.240.0.0' },
      { value: '255.224.0.0', display: '255.224.0.0' },
      { value: '255.192.0.0', display: '255.192.0.0' },
      { value: '255.128.0.0', display: '255.128.0.0' },
      { value: '255.0.0.0', display: '255.0.0.0' }
    ],
    classB: [
      { value: '255.255.254.0', display: '255.255.254.0' },
      { value: '255.255.252.0', display: '255.255.252.0' },
      { value: '255.255.248.0', display: '255.255.248.0' },
      { value: '255.255.240.0', display: '255.255.240.0' },
      { value: '255.255.224.0', display: '255.255.224.0' },
      { value: '255.255.192.0', display: '255.255.192.0' },
      { value: '255.255.128.0', display: '255.255.128.0' },
      { value: '255.255.0.0', display: '255.255.0.0' }
    ],
    classC: [
      { value: '255.255.255.254', display: '255.255.255.254' },
      { value: '255.255.255.252', display: '255.255.255.252' },
      { value: '255.255.255.248', display: '255.255.255.248' },
      { value: '255.255.255.240', display: '255.255.255.240' },
      { value: '255.255.255.224', display: '255.255.255.224' },
      { value: '255.255.255.192', display: '255.255.255.192' },
      { value: '255.255.255.128', display: '255.255.255.128' },
      { value: '255.255.255.0', display: '255.255.255.0' }
    ],
    prevButton: true,
    nextButtonText: '다음',
    progress: 0,
    nextButtonIconCls: 'x-fa fa-chevron-right',
    nextButtonUserCls: 'bg-info',
    keyId: null,
    checkAuthKey: true,
    recordIndex: -1,
    isCheckWhoIs: false,
    id: 0,
    updateRecordList: [],
    createRecordList: [],
    deleteRecordList: []
  }
});
