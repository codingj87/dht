/**
 * Created by jjol on 16. 10. 17.
 */

Ext.define('dhcp.view.ipassignedstatus.ipstats.AssignedIPListWindow', {
    extend: 'Ext.window.Window',

    requires: [
      'Ext.button.Button',
      'Ext.grid.Panel',
      'Ext.toolbar.Paging',
    ],
    title: '할당 IP 목록',
    viewModel: {type: 'AssignedIPListWindowModel'},
    iconCls: 'x-fa fa-sitemap',
    bodyPadding: 10,
    referenceHolder: true,
    defaultListenerScope: true,
    items: [
        {
            xtype: 'grid',
            margin: '10 0 0 0',
            reference: 'grid',
            flex: 1,
            bbar: {xtype: 'pagingtoolbar', bind: {store: '{ipGridStore}'}},
            bind: {store: '{ipGridStore}'},
            columns: {
                defaults: {align: 'center', flex: 1},
                items: [
                    {
                        text: 'IP',
                        dataIndex: 'ip'
                    },
                    {
                        text: 'MAC',
                        dataIndex: 'mac'
                    },
                    {
                        text: 'Class',
                        dataIndex: 'class'
                    },
                    {
                        text: 'Lease Start',
                        dataIndex: 'start'
                    },
                    {
                        text: 'Lease End',
                        dataIndex: 'end'
                    }
                ]
            }
        }
    ],

    buttons: [
        {
            xtype: 'button',
            iconCls: 'x-fa fa-file-excel-o',
            tooltip: '엑셀 다운로드',
            text: '엑셀 다운로드',
            handler: 'onExcel',
            margin: '0 0 0 10',
            minWidth: 50,
            cls:'button-excel',
            plugins:null
        },
        {xtype: 'button', text: '닫기', handler: 'onCancel'}
    ],

    onCancel: function () {
        this.close();
    },

    onBoxReady: function() {
        const me = this,
            vm = me.getViewModel(),
            ip_list = vm.get('ip_list');
        let store = vm.getStore('ipGridStore');
        store.getProxy().setData(ip_list);
        store.load();
    },

    onExcel: function () {
        const mode = 'xls', flag = 'AssignedIPList',
            store = this.lookupReference('grid').getStore(),
            vm = this.getViewModel(),
            params = vm.get('params');

        if (store.getTotalCount() > 65536) {
            Ext.Msg.alert('오류', '엑셀 최대 레코드수를 초과했습니다.');
            return;
        }
        params['mode'] = mode;
        params['flag'] = flag;
        dhcp.excel('/ip_stats/excel', params);
    }
});

Ext.define('dhcp.view.ipassignedstatus.ipstats.AssignedIPListWindowModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.AssignedIPListWindowModel',

    requires: [
      'Ext.data.proxy.Memory'
    ],

    stores:{
        ipGridStore: {
            autoLoad: false,
            pageSize: 25,
            proxy: {
                type: 'memory',
                enablePaging: true
            }
        }
    },
    data: {
    }
});