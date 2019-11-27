/**
 * Created by zen on 18. 5. 31.
 */

Ext.define('dhcp.view.logmanagement.eventlog.EventLog', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.Date',
        'Ext.grid.Panel',
        'Ext.grid.column.Widget',
        'Ext.toolbar.Paging',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'dht.view.common.SearchButton',
        'dhcp.view.logmanagement.eventlog.EventLogController',
        'dhcp.view.logmanagement.eventlog.EventLogModel'
    ],
    xtype: 'eventlog',
    viewModel: {type: 'eventlog'},
    controller: 'eventlog',
    title: '이벤트 이력',
    layout: {type: 'vbox', align: 'stretch'},
    items: [
        {
            xtype: 'panel',
            border: true,
            bodyPadding: 10,
            layout: {type: 'vbox', align: 'stretch'},
            items: [
                {
                    xtype: 'form',
                    reference: 'searchForm',
                    layout: {type: 'vbox', align: 'stretch'},
                    items: [
                        {
                            xtype: 'container',
                            layout: {type: 'hbox', align: 'stretch'},
                            items: [
                                {
                                    xtype: 'datefield',
                                    name: 'sdate',
                                    fieldLabel: '기간(From)',
                                    format: 'Y-m-d',
                                    value: new Date(),
                                    editable: false,
                                    allowBlank: false,
                                    bind: {value: '{searchForm.sdate}', maxValue: '{searchForm.edate}'}
                                },{
                                    xtype: 'datefield',
                                    name: 'edate',
                                    fieldLabel: '기간(To)',
                                    format: 'Y-m-d',
                                    editable: false,
                                    value: new Date(),
                                    maxValue: new Date(),
                                    allowBlank: false,
                                    bind: {value: '{searchForm.edate}', minValue: '{searchForm.sdate}'},
                                    margin: '0 10 0 0'
                                },
                                {xtype: 'searchbutton', handler: 'onSearch', reference: 'searchBT'}
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'grid',
            reference: 'grid',
            margin: '10 0 0 0',
            flex: 1,
            border: true,
            columns: {
                defaults: {minWidth: 150, align: 'center', flex: 1},
                items: [
                    {text: '생성 시간', dataIndex: 'ctime'},
                    {text: '서버 IP', dataIndex: 'svr_ip'},
                    {text: '유형', dataIndex: 'type'},
                    {text: '메시지', dataIndex: 'msg', flex: 3, align: 'left'}
                ]
            },
            bbar: {xtype: 'pagingtoolbar', bind: {store: '{gridStore}'}},
            bind: {store: '{gridStore}'}
        }
    ]
});