Ext.define('dht.view.charts.Gauge', {
    extend: 'dht.view.charts.ChartBase',
    xtype: 'chartsgaugepanel',

    requires: [
        'Ext.chart.PolarChart',
        'Ext.chart.series.Gauge'
    ],

    title: 'Gauge Chart',
    iconCls: 'x-fa fa-wifi',

    items: [{
        xtype: 'polar',
        colors: [
            '#6aa5db',
            '#aed581'
        ],
        bind: '{gaugeData}',
        series: [{
            type: 'gauge',
            angleField: 'position',
            needleLength: 100
        }]
    }]

});
