/**
 * Created by jjol on 16. 10. 25.
 */

Ext.define('dhcp.view.ipassignedstatus.ipsearch.IPSearch', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.container.Container',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'dht.view.common.SearchButton',
        'dhcp.view.ipassignedstatus.ipsearch.IPSearchController',
        'dhcp.view.ipassignedstatus.ipsearch.IPSearchModel'
    ],
    xtype: 'ipsearch',
    viewModel: {type: 'ipsearch'},
    controller: 'ipsearch',
    title: 'IP 할당 검색',
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
                                {xtype: 'textfield', fieldLabel: 'IP', name: 'ip', labelWidth: 20},
                                // {xtype: 'textfield', fieldLabel: 'MAC', name: 'mac'},
                                // {xtype: 'textfield', fieldLabel: 'Vendor Class', name: 'vendor'},
                                {xtype: 'searchbutton', handler: 'onSearch', reference:'searchBT'}
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'grid',
            margin: '10 0 0 0',
            reference: 'grid',
            flex: 1,
            border: true,
            columns: {
                defaults: {align: 'center', flex: 1},
                items: [
                    {text: 'IP', dataIndex: 'ip'},
                    {text: 'MAC', dataIndex: 'mac'},
                    {text: 'Vendor Class ID', dataIndex: 'vendor_class_id'},
                    {text: 'Pool Class', dataIndex: 'class'},
                    {text: 'State', dataIndex: 'state'},
                    {text: 'Lease Start', dataIndex: 'start_time'},
                    {text: 'Lease End', dataIndex: 'end_time'},
                    {text: 'Last Update', dataIndex: 'update_time'}
                ]
            },
            viewConfig: {enableTextSelection: true},
            bbar: {xtype: 'pagingtoolbar', bind: {store: '{gridStore}'}},
            bind: {store: '{gridStore}'}
        }
    ]
});