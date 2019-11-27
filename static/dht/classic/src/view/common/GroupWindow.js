Ext.define('dht.view.common.GroupWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.button.Button',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.VBox'
    ],

    width: 500,
    iconCls: 'x-fa fa-group',
    bind: {
        title: '{title}'
    },
    referenceHolder: true,
    defaultListenerScope: true,

    items: {
        xtype: 'form',
        reference: 'form',
        layout: {type: 'vbox', align: 'stretch'},
        bodyPadding: 10,
        border: false,
        fieldDefaults: {msgTarget: 'side'},
        items: [
            {
                xtype: 'textfield',
                fieldLabel: '이름',
                allowBlank: false,
                maxLength: 128,
                enforceMaxLength: true,
                name: 'name',
                bind: '{formData.name}'
            },
            {
                xtype: 'textarea',
                fieldLabel: '비고',
                flex: 1,
                maxLength: 256,
                enforceMaxLength: true,
                name: 'desc',
                bind: '{formData.desc}'
            }
        ]
    },

    buttons: [
        {xtype: 'button', text: '저장', handler: 'onSave'},
        {xtype: 'button', text: '취소', handler: 'onCancel'}
    ],

    onSave: function() {
        var me = this,
            form = me.lookupReference('form'),
            params = form.getValues(),
            vm = me.getViewModel(),
            mode = vm.get('mode'),
            groupId = vm.get('groupId'),
            url;

        if(mode == 'create') {
            params['pid'] = groupId;
            url = '/group/create';
        } else {
            params['id'] = groupId;
            url = '/group/update';
        }

        if(form.isValid()) {
            form.submit({
                url: url,
                params: params,
                success: function(form, response) {
                    me.fireEvent('save', response.result.data);
                    me.close();
                },
                failure: function(form, action) {
                    Ext.Msg.alert('오류', action.result.errmsg);
                }
            });
        }
    },

    onCancel: function() {
        this.close();
    }
});
