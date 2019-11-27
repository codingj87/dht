/**
 * Created by jjol on 16. 6. 17.
 */

Ext.define('dht.view.common.ExcelDownloadWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.field.ComboBox',
        'Ext.form.field.ComboBox',
        'Ext.grid.Panel',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.util.Format',
        'dht.ux.plugin.ClearButton'
    ],

    uses: [
        'Ext.data.Store'
    ],

    viewModel: {
        stores: {
            gridStore: {}
        }
    },
    referenceHolder: true,
    defaultListenerScope: true,

    width: 800,
    height: 800,
    // resizable: true,
    // draggable: true,
    maximizable: true,

    layout: {type: 'vbox', align: 'stretch'},
    items: [
        {
            xtype: 'container',
            layout: {type: 'hbox', align: 'stretch'},
            defaults: {margin: '5 5 5 5'},
            items: [
                {xtype: 'container', flex: 1},
                {
                    xtype: 'combobox',
                    reference: 'unit',
                    plugins: ['clearbutton'],
                    store: {
                        fields: ['value', 'display'],
                        data: [
                            // {value: 'yib', display: 'YiB'},
                            // {value: 'zib', display: 'ZiB'},
                            // {value: 'eib', display: 'EiB'},
                            {value: 'pib', display: 'PiB'},
                            {value: 'tib', display: 'TiB'},
                            {value: 'gib', display: 'GiB'},
                            {value: 'mib', display: 'MiB'},
                            {value: 'kib', display: 'KiB'},
                            // {value: 'yb', display: 'YB'},
                            // {value: 'zb', display: 'ZB'},
                            // {value: 'eb', display: 'EB'},
                            {value: 'pb', display: 'PB'},
                            {value: 'tb', display: 'TB'},
                            {value: 'gb', display: 'GB'},
                            {value: 'mb', display: 'MB'},
                            {value: 'kb', display: 'KB'}
                        ]
                    },
                    listeners: {change: 'changeUNIT'}
                },
                {
                    xtype: 'button',
                    iconCls: 'x-fa fa-file-excel-o',
                    tooltip: '엑셀 다운로드',
                    text: '엑셀 다운로드',
                    handler: 'excelDownload'
                }
            ]
        },
        {xtype: 'grid', reference: 'grid', flex: 1}
    ],
    buttons: [
        {xtype: 'button', text: '닫기', handler: 'onClose'}
    ],
    bind: {title: Ext.String.format('리스트 보기 - {0}', '{title}')},
    listeners: {boxready: 'onBoxready'},

    onBoxready: function() {
        var me = this,
            vmData = me.getViewModel().getData(),
            chartData = me.makeGridData(vmData);

        me.renderGrid(chartData[0], chartData[1], chartData[2]);
        me.params = {
            title: Ext.Date.format(new Date, 'Ymd_His'),
            data: Ext.encode(me.setGridData(chartData[1], chartData[2]))
        };
    },
    changeUNIT: function(cp, newValue) {
        var me = this;

        me.UNIT = newValue;
        me.onBoxready();
    },
    renderGrid: function(legend, date, data) {
        var me = this,
            grid = me.lookupReference('grid'),
            fields = [],
            columns = [{text: '', dataIndex: 'date', width: 100, renderer: dhcp.renderFloat}],
            i, l,
            gridData = [];

        // fields
        for(i = 0, l = data.length; i<l; i += 1) {
            fields.push('index' + i);
        }

        // columns
        for(i = 0, l = legend.length; i<l; i += 1) {
            columns.push({
                text: legend[i],
                dataIndex: 'index' + i,
                align: 'right',
                renderer: me.renderNumber
            });
        }

        me.DECIMAL = false;
        var renderUnit = function(value) {
            return value;
        };
        if(me.UNIT) {
            renderUnit = function(value) {
                return dht.numberUnitConverter(value, me.UNIT, 'decimal', 2, false);
            }
        }

        for(i = 0, l = date.length; i<l; i += 1) {
            var tempData = {date: date[i].replace('\n', ' ')};
            for(var j = 0, m = data.length; j<m; j += 1) {
                if(data[j] && data[j][i]) {
                    if(!me.DECIMAL && Math.floor(data[j][i]) != data[j][i]) {
                        me.DECIMAL = true;
                    }
                    tempData['index' + j] = renderUnit(data[j][i]);
                }
            }
            gridData.push(tempData);
        }

        grid.reconfigure(new Ext.data.Store({field: fields, data: gridData}), columns);
        me.columns = grid.getColumns();
        setTimeout(function() {
            for(i = 1, l = me.columns.length; i<l; i += 1) {
                me.columns[i].autoSize();
                me.columns[i].setWidth(me.columns[i].getWidth() + 2);
            }
        }, 1000);
    },
    makeGridData: function(chartData) {
        var legend = [],
            categories = [],
            data = [],
            i, l;

        for(i = 0, l = chartData.xAxis[0].data.length; i<l; i += 1) {
            categories.push(chartData.xAxis[0].data[i]);
        }

        for(i = 0, l = chartData.series.length; i<l; i += 1) {
            if(chartData.series[i].name != '이벤트' && chartData.series[i].name != undefined) {
                legend.push(chartData.series[i].name);
                data.push(chartData.series[i].data);
            }
        }
        return [legend, categories, data];
    },
    setGridData: function(date, data) {
        var me = this,
            vm = this.getViewModel(),
            store = vm.getStore('gridStore'),
            storeData = [];

        var renderUnit = function(value) {
            return value;
        };
        if(me.UNIT) {
            renderUnit = function(value) {
                return dht.numberUnitConverter(value, me.UNIT, 'decimal', 2, false);
            }
        }

        for(var i = 0, l = date.length; i<l; i += 1) {
            var tempData = {date: date[i].replace('\n', ' ')};
            for(var j = 0, m = data.length; j<m; j += 1) {
                if(data[j] && data[j][i]) {
                    tempData['index' + j] = renderUnit(data[j][i]);
                }
            }
            store.add(tempData);
            storeData.push(tempData);
        }
        return storeData;
    },
    excelDownload: function() {
        var me = this,
            grid = me.lookupReference('grid'),
            columnsData = dhcp.getColumnsData(grid),
            vmData = me.getViewModel().getData();

        me.params['excel'] = 1;
        me.params['header'] = columnsData.header;
        me.params['columns'] = columnsData.columns;
        me.params['title'] = vmData.title;
        if(vmData.option && vmData.option.unit) {
            me.params['unit'] = vmData.option.unit;
        }
        if(me.UNIT) {
            me.params['unit'] = me.lookupReference('unit').getRawValue();
        }

        var cell = [];
        for(var i = 1, l = me.columns.length; i<l; i += 1) {
            cell.push(i)
        }
        if(me.UNIT) {
            me.params['number'] = Ext.encode({
                int_cell: [],
                float_cell: cell
            });
        } else {
            me.params['number'] = Ext.encode({
                int_cell: me.DECIMAL ? [] : cell,
                float_cell: me.DECIMAL ? cell : []
            });
        }

        dht.excel('/download/excel', me.params);
    },
    onClose: function() {
        this.close();
    },
    renderNumber: function(value) {
        if(Ext.isNumeric(value)) {
            if(Math.floor(value) == value) {
                value = String(value);
                return value.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            } else {
                return Ext.util.Format.number(value, '1,000,000,000,000,000,000,000.00');
            }
        }
        return value;
    }
});
