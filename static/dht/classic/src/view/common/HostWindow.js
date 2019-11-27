/**
 * Created by jjol on 16. 10. 17.
 */

Ext.define('dht.view.common.HostWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.button.Button',
        'Ext.form.FieldSet',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.VBox'
    ],

    width: 500,
    iconCls: 'x-fa fa-sitemap',
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
        items: [
            {
                xtype: 'textfield',
                name: 'name',
                labelWidth: 75,
                fieldLabel: '서버명',
                maxLength: 64,
                allowBlank: false,
                enforceMaxLength: true,
                bind: {value: '{formData.name}'}
            },
            {
                xtype: 'combobox',
                name: 'group_id',
                labelWidth: 75,
                fieldLabel: '그룹',
                maxLength: 64,
                displayField: 'display',
                value: {
                    fields: ['value', 'display'],
                    data: [
                        {value: null, display: 'All'},
                        {value: 1, display: 'A팀'},
                        {value: 2, display: 'B팀'},
                        {value: 3, display: 'C팀'},
                        {value: 4, display: 'D팀'}
                    ]}
            },
            {
                xtype: 'fieldset',
                title: 'Master',
                layout: {type: 'vbox', align: 'stretch'},
                defaults: {maxLength: 64, labelWidth: 60/*, allowBlank: false, enforceMaxLength: true*/},
                items: [
                    {
                        xtype: 'textfield',
                        name: 'master_ip',
                        fieldLabel: 'IP',
                        bind: {value: '{formData.master_ip}'}
                    },
                    {
                        xtype: 'textfield',
                        name: 'master_port',
                        fieldLabel: 'Port',
                        bind: {value: '{formData.master_port}'}
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Slave',
                layout: {type: 'vbox', align: 'stretch'},
                defaults: {maxLength: 64, labelWidth: 60/*, allowBlank: false, enforceMaxLength: true*/},
                items: [
                    {
                        xtype: 'textfield',
                        name: 'slave_ip',
                        fieldLabel: 'IP',
                        bind: {value: '{formData.slave_ip}'}
                    },
                    {
                        xtype: 'textfield',
                        name: 'slave_port',
                        fieldLabel: 'Port',
                        bind: {value: '{formData.slave_port}'}
                    }
                ]
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
            formData = vm.get('formData'),
            mode = vm.get('mode'),
            url = Ext.String.format('/host/{0}', mode);

        if(mode=='update') {
            params['id'] = formData.id;
        } else {
            params['group_id'] = formData.group_id.split('-')[1];
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
