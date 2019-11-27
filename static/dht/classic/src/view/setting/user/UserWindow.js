Ext.define('dht.view.setting.user.UserWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.button.Button',
        'Ext.form.FieldSet',
        'Ext.form.field.Text',
        'Ext.form.field.TextArea',
        'Ext.layout.container.Table',
        'Ext.layout.container.VBox'
    ],

    title: '사용자 ',
    iconCls: 'x-fa fa-user',
    width: 650,
    bodyPadding: 10,
    layout: {type: 'vbox', align: 'stretch'},
    referenceHolder: true,
    defaultListenerScope: true,

    viewModel: {
        data: {
            mode: 'create',
            disabled: false
        }
    },

    items: [
        {
            xtype: "fieldset",
            title: '사용자 정보',
            layout: {type: 'table', columns: 2, tableAttrs: {style: {width: '100%'}}},
            defaults: {width: '100%', style: {padding: '0 10px 0 0'}},
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: '사용자ID',
                    maskRe: /[a-zA-Z0-9_]+/,
                    fieldStyle: "ime-mode: disabled;",
                    maxLength: 32,
                    enforceMaxLength: true,
                    reference: 'user_id',
                    bind: {value: '{formData.user_id}', hidden: '{disabled}'}
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '이름',
                    maxLength: 32,
                    enforceMaxLength: true,
                    reference: 'name',
                    bind: {value: '{formData.name}', hidden: '{disabled}'}
                },
                {
                    xtype: 'textfield',
                    reference: 'pw',
                    fieldLabel: '비밀번호',
                    inputType: "password",
                    maxLength: 16,
                    enforceMaxLength: true
                },
                {
                    xtype: 'textfield',
                    reference: 'pwChk',
                    fieldLabel: '비밀번호(확인)',
                    inputType: "password",
                    maxLength: 16,
                    enforceMaxLength: true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '전화번호 ',
                    maskRe: /[0-9\-]+/,
                    fieldStyle: "ime-mode: disabled;",
                    maxLength: 32,
                    enforceMaxLength: true,
                    reference: 'phone',
                    bind: '{formData.phone}'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'E-mail',
                    fieldStyle: "ime-mode: disabled;",
                    preventMark: true,
                    maxLength: 75,
                    enforceMaxLength: true,
                    reference: 'email',
                    bind: '{formData.email}'
                },
                {
                    xtype: 'textarea',
                    fieldLabel: '내용',
                    maxLength: 128,
                    height: 54,
                    reference: 'desc',
                    colspan: 2,
                    bind: {value: '{formData.desc}', hidden: '{disabled}'}
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: '사용 여부',
                    preventMark: true,
                    maxLength: 75,
                    reference: 'enable',
                    bind: '{formData.enable}'
                }
            ]
        }
    ],
    buttons: [
        {xtype: 'button', text: '저장', handler: 'onSave'},
        {xtype: 'button', text: '취소', handler: 'onCancel'}
    ],

    onSave: function() {
        var me = this,
            vm = me.getViewModel(),
            mode = vm.get('mode'),
            user_id = me.lookupReference('user_id').getValue(),
            name = me.lookupReference('name').getValue(),
            pw = me.lookupReference('pw').getValue(),
            pwChk = me.lookupReference('pwChk').getValue(),
            phone = me.lookupReference('phone').getValue(),
            email = me.lookupReference('email').getValue(),
            desc = me.lookupReference('desc').getValue(),
            enable = me.lookupReference('enable').getValue() === true ? 1 : 0,
            params;

        if(!name) {
            Ext.Msg.alert('확인', '이름을 입력하세요.');
            return;
        }

        if(name.length>=32) {
            Ext.Msg.alert('확인 ', "이름은 32자 미만이어야합니다.");
            return;
        }

        if(pw!=pwChk) {
            Ext.Msg.alert('확인', '비밀번호가 일치하지 않습니다.');
            return;
        }

        var regex_phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3,4})[-. ]?([0-9*]{4})$/;
        if(!regex_phone.test(phone)) {
            Ext.Msg.alert('확인', '휴대폰번호가 유효하지 않습니다.');
            return;
        }

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        if(!validateEmail(email)) {
            Ext.Msg.alert('확인', '메일주소가 유효하지 않습니다. ');
            return;
        }
        if(email.length>=75) {
            Ext.Msg.alert('확인', "메일은 75자 미만이어야합니다.");
            return;
        }

        if(desc.length>=128) {
            Ext.Msg.alert('확인', "내용은 128자 미만이어야합니다.");
            return;
        }

        params = {
            name: name,
            pw: pw,
            phone: phone,
            email: email,
            desc: desc,
            enable: enable
        };

        if(mode == 'create') {
            params['user_id'] = user_id;
        } else if(mode == 'update') {
            params['id'] = vm.get('formData.id');
        }

        dht.ajax('/user/' + mode, params, function(r) {
            if(r.success) {
                me.fireEvent('save', me);
                me.close();
            } else {
                Ext.Msg.alert('오류', r.errmsg);
            }
        });
    },

    onCancel: function() {
        this.close();
    }
});
