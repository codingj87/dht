/**
 * Created by zen on 18. 7. 10.
 */
Ext.define('dht.view.setting.replication.Replication', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.replication',
    requires: [
        'Ext.container.Container',
        'Ext.grid.Panel',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Fill',
        'dht.view.setting.replication.ReplicationModel',
		'dht.view.setting.replication.ReplicationController'
    ],

    xtype: 'replication',

    viewModel: {
        type: 'replication'
    },

    controller: 'replication',
    layout: {type: 'vbox', align: 'stretch'},
    border: true,
    items: [
        {
            xtype: 'grid',
            tbar:['->',{
                iconCls:'x-fa fa-refresh',
                tool: '새로고침',
                handler:'onRefresh'
            }],
            reference: 'replication_grid_main',
            style: 'z-index:10',
            columns: {
                defaults: {align: 'center'},
                items: [
                    {text: 'HOST', width: 160, dataIndex: 'hostname'},
                    {text: 'PORT', dataIndex: 'port'},
                    {text: 'STATUS', width: 400, dataIndex: 'status'},
                    {text: 'DB', dataIndex: 'db_active', renderer: 'renderDBStatus'},
                    {text: 'Action', flex: 1}
                ]
            },
            bind: {
                store: '{nodeInfo}'
            }
        },
        {
            xtype: 'container',
            layout: {type: 'vbox', align: 'middle'},
            items: [{
                xtype: 'box', width: 800, reference: 'myCanvas'
            }]
        }
    ],
    listeners: {
        activate: 'repeatRequestStart',
        deactivate: 'repeatRequestStop'
    }
});