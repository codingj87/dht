/**
 * Created by jjol on 16. 10. 26.
 */

Ext.define('dht.view.setting.host.HostController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.host',

    requires: [
        'dht.view.common.HostWindow'
    ],

    onSearch: function() {
        var me = this,
            values = me.lookupReference('searchForm').getValues(),
            vm = me.getViewModel(),
            store = vm.getStore('gridStore'),
            group_id = vm.get('selectGroupID');

        values['mode'] = 'grid';
        if(group_id && vm.get('selectGroupName')!='ALL') {
            values['id'] = group_id.split('-')[1];
        } else {
            values['id'] = null;
        }
        store.getProxy().setExtraParams(values);
        store.loadPage(1);
    },

    groupTreeItemdblclick: function(cp, record) {
        var me = this,
            vm = me.getViewModel(),
            data = record.getData();

        vm.set('selectGroupName', data.name);
        vm.set('selectGroupID', data.id);

        me.onSearch();
    },

    groupTreeRefresh: function() {
        var me = this,
            vm = me.getViewModel();

        vm.set('selectGroupName', 'ALL');
        vm.set('selectGroupID', null);

        me.onSearch();
    },

    onCreate: function(cp) {
        var me = this,
            vm = me.getViewModel();

        me.getView().add(
            new dhcp.view.common.HostWindow({
                animateTarget: cp,
                viewModel: {
                    data: {
                        mode: 'create',
                        title: '추가',
                        formData: {
                            group_id: vm.get('selectGroupID')
                        }
                    }
                },
                listeners: {
                    save: function() {
                        me.onSearch();
                    }
                }
            }).show()
        );
    },
    onUpdate: function() {
        var me = this,
            id = me.lookupReference('grid').getSelection()[0].get('id');

        dht.ajax('/host/read', {id: id}, function(r) {
            me.getView().add(
                new dhcp.view.common.HostWindow({
                    animateTarget: me.lookupReference('updateBT'),
                    viewModel: {
                        data: {
                            mode: 'update',
                            title: '수정',
                            formData: r.data
                        }
                    },
                    listeners: {
                        save: function() {
                            me.onSearch();
                        }
                    }
                }).show()
            );
        });
    },
    onDelete: function() {
        var me = this,
            id = me.lookupReference('grid').getSelection()[0].get('id');

        Ext.Msg.confirm('확인', '정말 삭제하시겠습니까?', function(btn) {
            if(btn != 'yes')
                return;

            dht.ajax('/host/delete', {id: id}, function(r) {
                if(r.success) {
                    me.onSearch();
                } else {
                    Ext.Msg.alert('오류', r.errmsg);
                }
            });
        });
    }
});