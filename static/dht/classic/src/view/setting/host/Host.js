/**
 * Created by jjol on 16. 10. 26.
 */

Ext.define('dht.view.setting.host.Host', {
    extend: 'Ext.Container',
    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.layout.container.Fit',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Paging',
        'dht.ux.plugin.ClearButton',
        'dht.ux.plugin.EnterKeyHandler',
        'dht.view.common.GroupTreePanel',
        'dht.view.common.SearchButton',
        'dht.view.setting.host.HostController',
        'dht.view.setting.host.HostModel'
    ],
    xtype: 'host',
    viewModel: {type: 'host'},
    controller: 'host',

    layout: {type: 'fit'},
    items: [
        {
            xtype: 'container',
            layout: {type: 'hbox', align: 'stretch'},
            items: [
                {
                    xtype: 'grouptree',
                    reference: 'groupTree',
                    border: true,
                    scrollable: true,
                    resizable: true,
                    width: 240,
                    listeners: {
                        itemdblclick: 'groupTreeItemdblclick',
                        refresh: 'groupTreeRefresh'
                    }
                },
                {
                    xtype: 'container',
                    flex: 1,
                    margin: '0 0 0 10',
                    layout: {type: 'vbox', align: 'stretch'},
                    items: [
                        {
                            xtype: 'form',
                            reference: 'searchForm',
                            border: true,
                            bodyPadding: '10 10 10 10',
                            layout: {type: 'vbox'},
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {type: 'hbox'},
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'name',
                                            fieldLabel: '서버명',
                                            plugins: ['clearbutton', {ptype: 'enterkeyhandler', handler: 'onSearch'}]
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'ip',
                                            fieldLabel: 'Master IP',
                                            plugins: ['clearbutton', {ptype: 'enterkeyhandler', handler: 'onSearch'}]
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'port',
                                            fieldLabel: 'Master Port',
                                            plugins: ['clearbutton', {ptype: 'enterkeyhandler', handler: 'onSearch'}]
                                        },
                                        {xtype: 'searchbutton', handler: 'onSearch'}
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'grid',
                            reference: 'grid',
                            border: true,
                            margin: '10 0 0 0',
                            flex: 1,
                            minHeight: 500,
                            cls: 'shadow',
                            tools: [
                                {
                                    xtype: 'button',
                                    tooltip: '등록',
                                    iconCls: 'x-fa fa-plus',
                                    bind: {disabled: '{!selectGroupID}'},
                                    handler: 'onCreate'
                                },
                                {
                                    xtype: 'button',
                                    reference: 'updateBT',
                                    tooltip: '수정',
                                    iconCls: 'x-fa fa-check',
                                    bind: {disabled: '{!grid.selection}'},
                                    handler: 'onUpdate'
                                },
                                {
                                    xtype: 'button',
                                    tooltip: '삭제',
                                    iconCls: 'x-fa fa-minus',
                                    bind: {disabled: '{!grid.selection}'},
                                    handler: 'onDelete'
                                }
                            ],
                            columns: {
                                defaults: {sortable: false},
                                items: [
                                    {text: '서버명', dataIndex: 'name', width: 150},
                                    {text: '그룹', dataIndex: 'group_name', width: 150},
                                    {
                                        text: 'Master',
                                        columns: [
                                            {text: 'IP', dataIndex: 'master_ip', width: 150},
                                            {text: 'Port', dataIndex: 'master_port', width: 150}
                                        ]
                                    },
                                    {
                                        text: 'Slave',
                                        columns: [
                                            {text: 'IP', dataIndex: 'slave_ip', width: 150},
                                            {text: 'Port', dataIndex: 'slave_port', width: 150}
                                        ]
                                    },
                                    {text: '수정시간', dataIndex: 'mtime', width: 150, renderer: dhcp.renderDateTime},
                                    {text: '생성시간', dataIndex: 'ctime', width: 150, renderer: dhcp.renderDateTime}
                                ]
                            },
                            bind: {store: '{gridStore}', title: '{selectGroupName}'},
                            bbar: {xtype: 'pagingtoolbar', bind: {store: '{gridStore}'}},
                            listeners: {itemdblclick: 'onUpdate'}
                        }
                    ]
                }
            ]
        }
    ]
});