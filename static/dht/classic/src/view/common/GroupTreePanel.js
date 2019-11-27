/**
 * Created by go on 16. 1. 12.
 */

Ext.define('dht.view.common.GroupTreePanel', {
    extend: 'Ext.tree.Panel',
    xtype: 'grouptree',
    requires: [
        'Ext.button.Button',
        'Ext.data.proxy.Ajax'
    ],
    uses: [
        'dht.view.common.GroupWindow'
    ],

    referenceHolder: true,
    defaultListenerScope: true,

    rootVisible: false,
    multiSelect: false,
    singleExpand: false,
    viewConfig: {
        toggleOnDblClick: false
    },

    tools: [
        {
            xtype: 'button',
            reference: 'createButton',
            iconCls: 'x-fa fa-plus',
            tooltip: '등록',
            handler: 'onCreate',
            disabled: true
        },
        {
            xtype: 'button',
            reference: 'updateButton',
            iconCls: 'x-fa fa-check',
            tooltip: '수정',
            handler: 'onUpdate',
            disabled: true
        },
        {
            xtype: 'button',
            reference: 'deleteButton',
            iconCls: 'x-fa fa-minus',
            tooltip: '삭제',
            handler: 'onDelete',
            disabled: true
        },
        {xtype: 'button', iconCls: 'x-fa fa-refresh', tooltip: '새로고침', handler: 'onRefresh'}
    ],

    viewModel: {
        data: {
            type: 'group' // group, dht
        }
    },

    bind: {
        store: {
            type: 'tree',
            //proxy: { type: 'ajax', url: '/group/group_list' },
            //root: { text: 'ALL', id: 'group-0', type: 'group', rid: '0', expanded: true },
            //folderSort: true,
            proxy: {type: 'ajax', url: '/treecache/{type}'},
            fields: ['text', 'type', 'desc', 'rid']
        }
    },

    listeners: {
        select: 'onSelect'
    },

    onSelect: function(tree, record) {
        var me = this,
            createButton = me.lookupReference('createButton'),
            updateButton = me.lookupReference('updateButton'),
            deleteButton = me.lookupReference('deleteButton');

        if(record.get('type') == 'group') {
            createButton.setDisabled(false);
            updateButton.setDisabled(false);
            deleteButton.setDisabled(false);
        } else {
            createButton.setDisabled(true);
            updateButton.setDisabled(true);
            deleteButton.setDisabled(true);
        }
    },

    onCreate: function() {
        var me = this,
            node = me.getSelection()[0],
            id = node.get('rid');

        new dhcp.view.common.GroupWindow({
            viewModel: {
                data: {
                    title: '그룹 - 등록',
                    mode: 'create',
                    groupId: id,
                    formData: {}
                }
            },
            listeners: {
                save: function(responseData) {
                    var store = me.getStore();
                    store.load({
                        callback: function() {
                            var node = store.getNodeById(responseData.id);
                            if(node) {
                                me.expandPath(node.getPath());
                            }
                        }
                    })
                }
            }
        }).show();
    },

    onUpdate: function() {
        var me = this,
            node = me.getSelection()[0],
            id = node.get('rid');

        dht.ajax('/group/read', {id: id}, function(r) {
            new dhcp.view.common.GroupWindow({
                viewModel: {
                    data: {
                        title: '그룹 - 수정',
                        mode: 'update',
                        groupId: id,
                        formData: r.data
                    }
                },
                listeners: {
                    save: function(responseData) {
                        var store = me.getStore();
                        store.load({
                            callback: function() {
                                var node = store.getNodeById(responseData.id);
                                if(node) {
                                    me.expandPath(node.getPath());
                                }
                            }
                        })
                    }
                }
            }).show();
        });
    },

    onDelete: function() {
        var me = this,
            node = me.getSelection()[0],
            id = node.get('rid');

        Ext.Msg.confirm('확인', '삭제하시겠습니까?', function(btn) {
            if(btn != 'yes')
                return;

            dht.ajax('/group/delete', {id: id}, function(r) {
                if(!r.success) {
                    if(r.errcode == 'GROUP_EXISTS' || r.errcode == 'HOST_EXISTS' || r.errcode == 'USER_EXISTS') {
                        Ext.Msg.show({
                            title: '오류',
                            msg: "해당 그룹에 하위노드(그룹/시스템/사용자)가 존재합니다.",
                            buttons: Ext.Msg.YESNO,
                            buttonText: {yes: '모두 삭제', no: '취소'},
                            fn: function(btn) {
                                if(btn == 'yes') {
                                    dht.ajax('/group/delete', {id: id, force: true}, function() {
                                        me.getStore().load({
                                            callback: function() {
                                                me.expandPath(node.parentNode.getPath());
                                            }
                                        });
                                        //me.getStore().load({ node: me.getRootNode().findChild('rid', id, true).parentNode });
                                    });
                                }
                            }
                        });
                    } else {
                        Ext.Msg.alert('알림', r.errmsg);
                    }
                } else {
                    me.getStore().load({
                        callback: function() {
                            me.expandPath(node.parentNode.getPath());
                        }
                    });
                }
            });
        });
    },

    onRefresh: function() {
        var me = this;

        me.getStore().reload({node: this.getRootNode()});
        me.lookupReference('createButton').setDisabled(true);
        me.lookupReference('updateButton').setDisabled(true);
        me.lookupReference('deleteButton').setDisabled(true);

        me.fireEvent('refresh');
    }
});