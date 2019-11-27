/**
 * Created by go on 16. 4. 12.
 */
Ext.define('dht.view.setting.user.User', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Paging',
        'dht.ux.plugin.ClearButton',
        'dht.ux.plugin.EnterKeyHandler',
        'dht.view.common.SearchButton',
        'dhcp.view.setting.user.UserController',
        'dht.view.setting.user.UserModel'
    ],
    xtype: 'user',
    viewModel: {type: 'user'},
    controller: 'user',
    layout: {type: 'vbox', align: 'stretch'},
    items: [
        {
            xtype: 'panel',
            border: true,
            bodyPadding: 4,
            margin:'0 0 10 0',
            layout: {type: 'vbox', align: 'stretch'},
            items: [
                {
                    xtype: 'form',
                    reference: 'searchForm',
                    layout: {type: 'vbox', align: 'stretch'},
                    items: [
                        {
                            xtype: 'toolbar',
                            layout: {type: 'hbox', align: 'stretch'},
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'userid',
                                    fieldLabel: '사용자 ID',
                                    plugins: ['clearbutton', {ptype: 'enterkeyhandler', handler: 'onSearch'}]
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'name',
                                    fieldLabel: '이름',
                                    plugins: ['clearbutton', {ptype: 'enterkeyhandler', handler: 'onSearch'}]
                                },
                                {xtype: 'searchbutton', handler: 'onSearch', reference: 'searchBT'},
                                '->',
                                {
                                    xtype: 'container',
                                    margin: '0 0 0 10',
                                    layout: {type:'hbox'},
                                    items:[
                                        {
                                            xtype: 'button',
                                            tooltip: '등록',
                                            text:'등록',
                                            iconCls: 'x-fa fa-plus',
                                            handler: 'onCreate'
                                        },
                                        {
                                            xtype: 'button',
                                            reference: 'updateBT',
                                            text:'수정',
                                            tooltip: '수정',
                                            iconCls: 'x-fa fa-check',
                                            bind: {disabled: '{!grid.selection}'},
                                            handler: 'onUpdate'
                                        },
                                        {
                                            xtype: 'button',
                                            text:'삭제',
                                            tooltip: '삭제',
                                            iconCls: 'x-fa fa-minus',
                                            bind: {disabled: '{!grid.selection}'},
                                            handler: 'onDelete'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'grid',
            reference: 'grid',
            border: true,
            flex: 1,
            columns: {
                defaults: {flex: 1, align: 'center'},
                items: [
                    {text: '사용 여부',dataIndex: 'enable', renderer: 'renderEnable'},
                    {text: '사용자ID', dataIndex: 'userid'},
                    {text: '이름', dataIndex: 'name'},
                    {text: '휴대전화', dataIndex: 'phone'},
                    {text: '이메일', dataIndex: 'email'},
                    {text: '생성일자', dataIndex: 'ctime'},
                    {text: '비고', dataIndex: 'desc', flex: 3}
                ]
            },
            bind: {store: '{gridStore}'},
            bbar: {xtype: 'pagingtoolbar', bind: {store: '{gridStore}'}},
            listeners: {itemdblclick: 'onUpdate'}
        }
    ]
});