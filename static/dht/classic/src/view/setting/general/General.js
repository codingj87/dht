Ext.define("dht.view.setting.general.General", {
    extend: "Ext.container.Container",

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.FieldSet',
        'Ext.form.Panel',
        'Ext.form.RadioGroup',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Date',
        'Ext.form.field.Number',
        'Ext.form.field.TextArea',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.tree.Panel',
        'dht.view.setting.general.GeneralController',
        'dht.view.setting.general.GeneralModel'
    ],
    xtype: 'general',
    viewModel: {type: 'general'},
    controller: 'general',

    layout: {type: 'hbox', align: 'stretch'},
    items: [
        {
            xtype: 'treepanel',
            margin: '0 10 0 0',
            tools: [
                {xtype: 'button', iconCls: 'x-fa fa-refresh', text: '초기화', handler: 'onRefresh'},
                {xtype: 'button', iconCls: 'x-fa fa-save', text: '저장', handler: 'onSave'}
            ],
            width: 250,
            rootVisible: false,
            bind: '{menuStore}',
            border: true,
            listeners: {select: 'onMenuSelect'}
        },
        {
            xtype: 'container',
            reference: 'mainPanel',
            autoScroll: true,
            flex: 1,
            items: [
                {
                    xtype: 'form',
                    reference: 'form',
                    width: 700,
                    bodyStyle: 'background: transparent;',
                    layout: {type: 'vbox', align: 'stretch'},
                    defaults: {
                        xtype: 'fieldset',
                        defaults: {labelAlign: 'right', labelWidth: 130},
                        layout: {type: 'vbox', align: 'stretch'}
                    },
                    items: [
                        {
                            title: '세션 설정',
                            reference: 'sessionPanel',
                            items: [
                                {
                                    xtype: 'radiogroup',
                                    fieldLabel: '브라우저 세션만료',
                                    labelWidth: 140,
                                    flex: 1,
                                    items: [
                                        {
                                            name: 'session_idle_time_check',
                                            boxLabel: '사용안함',
                                            inputValue: 0,
                                            width: 80,
                                            handler: 'onSessionChange'
                                        },
                                        {name: 'session_idle_time_check', boxLabel: '사용 (초)', inputValue: 1, flex: .5},
                                        {
                                            xtype: 'numberfield',
                                            reference: 'session_idle_time',
                                            name: 'session_idle_time',
                                            width: 100,
                                            maxLength: 5,
                                            enforceMaxLength: true,
                                            maxValue: 86400,
                                            minValue: 10,
                                            step: 10,
                                            maskRe: /[0-9]/,
                                            fieldStyle: 'ime-mode: disabled;',
                                            enableKeyEvents: true//,
                                            //listeners: { 'keydown': dht.numberfieldKeydown } // 이 코드 오류 발생함
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: '사용자인증',
                            reference: 'authPanel',
                            defaults: {minValue: 1, labelWidth: 130, labelAlign: 'right'},
                            items: [
                                {xtype: 'numberfield', name: 'auth_fail_count', fieldLabel: '로그인 재시도(회)', width: 80},
                                {
                                    xtype: 'radiogroup',
                                    fieldLabel: '로그인실패 액션',
                                    flex: 1,
                                    items: [
                                        {
                                            boxLabel: '계정차단',
                                            name: 'auth_fail_action',
                                            inputValue: 'disable',
                                            maxWidth: 110
                                        },
                                        {boxLabel: '일시차단', name: 'auth_fail_action', inputValue: 'delay', maxWidth: 110}
                                    ]
                                },
                                {xtype: 'numberfield', name: 'auth_block_time', fieldLabel: '차단시간 (분)', width: 90}
                            ]
                        },
                        {
                            title: '비밀번호 정책',
                            reference: 'passwdPanel',
                            defaults: {minValue: 1, labelWidth: 130, labelAlign: 'right'},
                            items: [
                                {
                                    xtype: 'checkbox',
                                    name: 'passwd_alpha',
                                    fieldLabel: '알파벳',
                                    boxLabel: '포함여부 확인',
                                    uncheckedValue: ''
                                },
                                {
                                    xtype: 'checkbox',
                                    name: 'passwd_number',
                                    fieldLabel: '숫자',
                                    boxLabel: '포함여부 확인',
                                    uncheckedValue: ''
                                },
                                {
                                    xtype: 'checkbox',
                                    name: 'passwd_special',
                                    fieldLabel: '특수문자',
                                    boxLabel: '포함여부 확인',
                                    uncheckedValue: ''
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'passwd_length',
                                    fieldLabel: '비밀번호 길이',
                                    width: 100,
                                    value: 7,
                                    minValue: 7,
                                    editable: false
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    listeners: {activate: 'onActivate'}
});
