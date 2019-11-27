/**
 * Created by go on 16. 4. 12.
 */
Ext.define('dhcp.view.setting.user.UserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.user',

    uses: [
        'dht.view.setting.user.UserWindow'
    ],

    gridStoreBeforeload: function(store) {
        var me = this,
            params = me.lookupReference('searchForm').getValues();

        store.getProxy().setExtraParams(params);
    },
    onSearch: function() {
        this.getViewModel().getStore('gridStore').load();
    },

    renderEnable: function(value) {
        if (value === 1) {
            return '<span style="color: #79C447"><i class="fa fa-circle-o-notch fa-spin"></i></span> 사용중';
        } else {
            return '<span style="color: #bb4b39"><i class="fa fa-circle"></i></span> 미승인';
        }
    },

    onCreate: function() {
        var me = this,
            store = me.getViewModel().getStore('gridStore');

        me.getView().add(
            new dht.view.setting.user.UserWindow({
                viewModel: {data: {mode: 'create'}},
                listeners: {
                    save: function() {
                        store.loadPage(1);
                    }
                }
            }).show()
        );
    },

    onUpdate: function(cp) {
        var me = this,
            grid = me.lookupReference('grid'),
            bt = me.lookupReference('searchBT');
        console.log(grid);

        dht.ajax('/user/read', {id: grid.getSelection()[0].get('id')}, function(r) {
            me.getView().add(
                new dht.view.setting.user.UserWindow({
                    animateTarget: bt,
                    viewModel: {data: {mode: 'update', formData: r.data}},
                    listeners: {
                        save: function() {
                            grid.getStore().loadPage(1);
                        }
                    }
                }).show()
            );
        });
    },

    onDelete: function(cp) {
        var grid = this.lookupReference('grid');

        Ext.Msg.confirm('경고', '삭제 하시겠습니까?', function(btn) {
            if(btn == 'no') {
                return;
            }
            dht.ajax('/user/delete', {id: grid.getSelection()[0].get('id')}, function(r) {
                if(r.success) {
                    grid.getStore().loadPage(1);
                } else {
                    Ext.Msg.alert('오류', r.errmsg);
                }
            });
        });
    }
});