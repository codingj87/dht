/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dht.view.dhcp.systemlog.SystemLog', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.Radio',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.grid.Panel',
        'Ext.toolbar.Paging',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'dht.view.common.SearchButton',
        'dht.view.dhcp.systemlog.SystemLogController',
        'dht.view.dhcp.systemlog.SystemLogModel',
        'dht.ux.plugin.ClearButton',
        'dht.ux.plugin.EnterKeyHandler'
    ],
    xtype: 'systemlog',
    viewModel: {type: 'systemlog'},
    controller: 'systemlog',

    bodyPadding: 10,
    title: '시스템 로그',
    border: true,
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
                            allowBlank: false,
                            editable: false,
                            bind: {value: '{searchForm.sdate}', maxValue: '{searchForm.edate}'}
                        },{
                            xtype: 'datefield',
                            name: 'edate',
                            fieldLabel: '기간(To)',
                            format: 'Y-m-d',
                            editable: false,
                            allowBlank: false,
                            value: new Date(),
                            maxValue: new Date(),
                            bind: {value: '{searchForm.edate}', minValue: '{searchForm.sdate}'},
                            margin: '0 10 0 0'
                        },
                        {xtype: 'textfield', fieldLabel: 'IP', name: 'ip'},
                        {
                            xtype: 'combobox',
                            fieldLabel: '유형',
                            name: 'type',
                            displayField: 'display',
                            valueField: 'value',
                            store: {
                                fields: ['value', 'display'],
                                data: [
                                    {display: 'all', value: null},
                                    {display: 'normal', value: 20},
                                    {display: 'error', value: 40}
                                ]
                            }
                        },
                        {xtype: 'searchbutton', handler: 'onSearch', reference: 'searchBT'},
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-file-excel-o',
                            tooltip: '엑셀 다운로드',
                            text: '엑셀 다운로드',
                            handler: 'onExcel',
                            margin: '0 0 0 10',
                            minWidth: 50,
                            cls:'button-excel',
                            plugins:null
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
                    {text: '생성 시간', dataIndex: 'time'},
                    {text: '서버 IP', dataIndex: 'svr_ip'},
                    {text: '레벨', dataIndex: 'level'},
                    {text: '메시지', dataIndex: 'message', flex: 3, align: 'left'},
                    {text: '유형', dataIndex: 'type'}
                ]
            },
            bbar: {xtype: 'pagingtoolbar', bind: {store: '{gridStore}'}},
            bind: {store: '{gridStore}'}
        }
    ]
});