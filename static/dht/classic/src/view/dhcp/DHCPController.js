/**
 * Created by jjol on 16. 10. 11.
 */

Ext.define('dht.view.dhcp.DHCPController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dhcp',

    // requires: [
    //     'dht.view.common.HostWindow'
    // ],
    // onBoxready: function () {
    //
    // },
    // groupTreeItemdblclick: function(cp, record) {
    //     this.tabLoad(record.getData())
    // },
    // groupTreeRefresh: function() {
    //     var vm = this.getViewModel();
    //
    //     vm.set('selectGroupName', null);
    //     vm.set('selectGroupID', null);
    // }

    // onHostCreate: function(cp) {
    //     var me = this,
    //         vm = me.getViewModel(),
    //         hostGridStore = vm.getStore('hostGridStore');
    //
    //     me.getView().add(
    //         new dht.view.common.HostWindow({
    //             animateTarget: cp,
    //             viewModel: {
    //                 data: {
    //                     mode: 'create',
    //                     title: '추가',
    //                     formData: {
    //                         group_id: vm.get('selectGroupID')
    //                     }
    //                 }
    //             },
    //             listeners: {
    //                 save: function() {
    //                     me.hostGridStoreReload();
    //                 }
    //             }
    //         }).show()
    //     );
    // },
    // onHostUpdate: function(cp) {
    //     var me = this,
    //         vm = me.getViewModel(),
    //         id = me.lookupReference('hostGrid').getSelection()[0].get('id'),
    //         hostGridStore = vm.getStore('hostGridStore');
    //
    //     dht.ajax('/host/read', {id: id}, function(r) {
    //         me.getView().add(
    //             new dht.view.common.HostWindow({
    //                 animateTarget: cp,
    //                 viewModel: {
    //                     data: {
    //                         mode: 'update',
    //                         title: '수정',
    //                         formData: r.data
    //                     }
    //                 },
    //                 listeners: {
    //                     save: function() {
    //                         me.hostGridStoreReload();
    //                     }
    //                 }
    //             }).show()
    //         );
    //     });
    // },
    // onHostDelete: function() {
    //     var me = this,
    //         id = me.lookupReference('hostGrid').getSelection()[0].get('id');
    //
    //     Ext.Msg.confirm('확인', '정말 삭제하시겠습니까?', function(btn) {
    //         if(btn != 'yes')
    //             return;
    //
    //         dht.ajax('/host/delete', {id: id}, function(r) {
    //             if(r.success) {
    //                 me.hostGridStoreReload();
    //             } else {
    //                 Ext.Msg.alert('오류', r.errmsg);
    //             }
    //         });
    //     });
    // },
    //
    // tabLoad: function(data) {
    //     var me = this,
    //         dhcpTab = me.lookupReference('dhcpTab'),
    //         vm = me.getViewModel(),
    //         hostGridStore = vm.getStore('hostGridStore');
    //
    //     vm.set('selectGroupName', data.name);
    //     vm.set('selectGroupID', data.id);
    //
    //     me.hostGridStoreReload();
    //
    //     // console.log(data.name, data.id, dhcpTab.getActiveTab().title);
    // },
    // hostGridStoreReload: function() {
    //     var me = this,
    //         vm = me.getViewModel(),
    //         groupID = vm.get('selectGroupID'),
    //         hostGridStore = vm.getStore('hostGridStore');
    //
    //     hostGridStore.getProxy().setExtraParam('id', groupID.split('-')[1]);
    //     hostGridStore.load();
    // }
});