Ext.define('dht.view.setting.general.SoundWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.button.Button',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.form.Panel',
        'Ext.form.field.File',
        'Ext.form.field.Hidden',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'Ext.util.Cookies'
    ],

    title: '사운드 관리',
    iconCls: 'x-fa fa-music',
    width: 600,
    height: 400,
    allowDomMove: true,
    bodyPadding: 10,
    layout: { type: 'vbox', align: 'stretch'},
    referenceHolder: true,
    defaultListenerScope: true,

    items: [
        {
            xtype: 'form',
            reference: 'form',
            layout: { type: 'hbox', align: 'stretch' },
            items: [
                {
                    xtype: 'filefield',
                    reference: 'soundfile',
                    name: 'sound',
                    fieldLabel: '첨부파일',
                    labelWidth: 80,
                    msgTarget: 'side',
                    allowBlank: false,
                    flex:1,
                    buttonText: '찾기'
                },
                { xtype: 'hidden', name: 'csrfmiddlewaretoken', value: Ext.util.Cookies.get('csrftoken')},
                { xtype: 'button', margin: '0 0 0 10', text: '추가', handler: 'onSoundAdd' }
            ]
        },
        {
            xtype: 'grid',
            reference: 'grid',
            margin: '5 0 0 0',
            flex: 1,
            store: {
                fields: [ 'value', 'display' ],
                proxy: { type: 'ajax', url: '/combo/alarmsound', reader: { type: 'json', rootProperty: 'data' } },
                autoLoad: true
            },
            columns: [
                { text: '파일명',  dataIndex: 'display', flex:1 }
            ],
            tbar: [
                { xtype: 'button', text: '재생', bind: { disabled: '{!grid.selection}' }, handler: 'onSoundPlay' },
                { xtype: 'button', text: '정지', bind: { disabled: '{!grid.selection}' }, handler: 'onSoundStop' },
                '->',
                { xtype: 'button', text: '삭제', bind: { disabled: '{!grid.selection}' }, handler: 'onSoundRemove' }
            ],
            listeners: {
                itemdblclick: 'onSoundPlay'
            }
        }
    ],

    buttons: [
        { xtype: 'button', text: '닫기', handler: 'onClose' }
    ],

    onSoundAdd: function() {
        var me = this,
            form = me.lookupReference('form').getForm(),
            store = me.lookupReference('grid').getStore();

        form.submit({
            url: '/settings/sound_upload',
            waitMsg: '업로드 중...',
            success: function() {
                store.load();
            }
        });
    },

    onSoundPlay: function() {
        var me = this,
            file = '/static/sound/' + me.lookupReference('grid').getSelection()[0].get('value');
        dhcp.playSound(file, { loop: 1, volume: 1 });
    },

    onSoundStop: function() {
        dhcp.stopSound();
    },

    onSoundRemove: function() {
        var me = this,
            grid = me.lookupReference('grid'),
            store = grid.getStore(),
            record = grid.getSelection()[0];

        Ext.Msg.confirm('확인', "삭제 하시겠습니까?", function(btn) {
            if (btn == 'no')
                return;

            dht.ajax('/settings/sound_delete', {name: record.get('value')}, function(r) {
                if (r.success) {
                    store.load();
                }
            });
        });
    },

    onClose: function() {
        this.close();
    }
});
