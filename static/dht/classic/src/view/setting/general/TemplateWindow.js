Ext.define('dht.view.setting.general.TemplateWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.button.Button',
        'Ext.form.Label',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.VBox'
    ],

    iconCls: 'x-fa fa-scissors',
    width: 500,
    bodyPadding: 10,
    layout: { type: 'vbox', align: 'stretch' },
    referenceHolder: true,
    defaultListenerScope: true,

    items: [
        {
            xtype: 'textfield',
            fieldLabel: '제목',
            reference: 'subject',
            bind: {
                hidden: '{hideSubject}',
                value: '{formData.subject}'
            }
        },
        { xtype: 'textarea', fieldLabel: '내용', height: 200, reference: 'content', bind: '{formData.content}' },
        {
            xtype: 'label',
            html: '매크로' +
                '<br> - <b>%DATE%</b>: 현재날짜 (Y-m-d)' +
                '<br> - <b>%DATETIME%</b>: 현재일시 (Y-m-d H:i)' +
                '<br> - <b>%RECEIVER%</b>: 수신인' +
                '<br> - <b>%SENDER%</b>: 발신인' +
                '<br> - <b>%ID%</b>: ID'
        }
    ],

    buttons: [
        { xtype: 'button', text: '확인', handler: 'onSave' },
        { xtype: 'button', text: '취소', handler: 'onCancel' }
    ],

    onSave: function() {
        var me = this,
            subject = me.lookupReference('subject').getValue(),
            content = me.lookupReference('content').getValue(),
            vm = me.getViewModel(),
            mode = vm.get('mode'),
            value;

        if (mode.indexOf('mail') > -1) {
            value = subject + '<sep>' + content;
        } else {
            value = content;
        }

        dht.ajax('/settings/updateTemplate', { key: mode, value: value }, function() {
            me.close();
        });
    },

    onCancel: function() {
        this.close();
    }
});
