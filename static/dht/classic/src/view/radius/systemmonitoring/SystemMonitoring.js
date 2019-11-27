/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dhcp.view.radius.systemmonitoring.SystemMonitoring', {
  extend: 'Ext.panel.Panel',

  requires: [
    'Ext.container.Container',
    'Ext.form.Panel',
    'Ext.form.field.Date',
    'Ext.grid.Panel',
    'Ext.grid.column.Widget',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'Ext.panel.Panel',
    'Ext.toolbar.Fill',
    'Ext.toolbar.Fill',
    'dhcp.ux.echarts.Echarts',
    'dht.view.common.SearchButton',
    'dhcp.view.radius.systemmonitoring.SystemMonitoringController',
    'dhcp.view.radius.systemmonitoring.SystemMonitoringModel'
  ],
  xtype: 'systemmonitoring',
  title: '시스템 모니터링',
  viewModel: { type: 'systemmonitoring' },
  controller: 'systemmonitoring',
  scrollable: true,

  layout: { type: 'vbox', align: 'stretch' },
  defaults: { margin: '0 0 0 0' },
  items: [
    {
      xtype: 'grid',
      reference: 'serverGrid',
      minHeight: 105,
      maxHeight: 200,
      flex: 1,
      border: true,
      columns: {
        defaults: { align: 'center' },
        items: [
          { text: 'Server', dataIndex: 'hostname', flex: 1 },
          { text: 'IP', dataIndex: 'ip', flex: 1 },
          {
            text: 'CPU (%)',
            xtype: 'widgetcolumn',
            dataIndex: 'cpu',
            flex: 1,
            widget: {
              xtype: 'progressbarwidget',
              animate: true,
              textTpl: ['{percent:number("0")} %'],
              ui: 'blue_progress'
            }
          },
          {
            text: 'Memory (%)',
            xtype: 'widgetcolumn',
            dataIndex: 'memory',
            flex: 1,
            widget: {
              xtype: 'progressbarwidget',
              animate: true,
              textTpl: ['{percent:number(0)} %'],
              ui: 'green_progress'
            }
          },
          {
            text: 'Disk (%)',
            xtype: 'widgetcolumn',
            dataIndex: 'disk',
            flex: 1,
            widget: {
              xtype: 'progressbarwidget',
              animate: true,
              textTpl: ['{percent:number("0")} %'],
              ui: 'orange_progress'
            }
          },
          { text: '프로세스 상태', dataIndex: 'process_check', flex: 2 }
        ]
      },
      bind: { store: '{serverGridStore}' },
      listeners: { itemclick: 'serverGridStoreSelect' }
    },
    {
      xtype: 'form',
      reference: 'searchForm',
      border: true,
      bodyPadding: 10,
      margin: '10 0 0 0',
      layout: {
        type: 'hbox'
      },
      fieldDefaults: { margin: '0 0 0 0', labelWidth: 'auto', width: 250 },
      items: [
        {
          xtype: 'datefield',
          reference: 'stime',
          name: 'sdate',
          fieldLabel: '기간(From)',
          editable: true,
          format: 'Y-m-d',
          bind: {
            value: '{searchForm.sdate}',
            maxValue: '{searchForm.edate}'
          }
        },
        {
          xtype: 'datefield',
          reference: 'etime',
          name: 'edate',
          fieldLabel: '기간(To)',
          editable: true,
          format: 'Y-m-d',
          maxValue: new Date(),
          bind: {
            value: '{searchForm.edate}',
            minValue: '{searchForm.ssdate}'
          }
        },
        {
          xtype: 'tbfill'
        },
        {
          xtype: 'searchbutton',
          handler: 'onSearch'
        }
      ]
    },
    {
      xtype: 'container',
      margin: '10 0 0 0',
      reference: 'chartArea',
      flex: 2,
      layout: {
        type: 'hbox',
        align: 'stretch'
      },
      defaults: {
        xtype: 'echarts',
        border: '1',
        flex: 1,
        margin: '0 0 0 10'
      },
      items: [
        {
          title: 'CPU',
          margin: 0,
          options: {
            color: ['#26adc4'],
            title: [
              {
                text: ''
              }
            ],
            grid: [
              {
                top: 20,
                right: 10,
                left: 60
              }
            ],
            tooltip: {
              padding: [10, 20, 10, 20],
              textStyle: {
                fontSize: 12
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                animation: false,
                snap: false,
                label: {
                  backgroundColor: '#505765'
                }
              }
            },
            xAxis: [
              {
                type: 'category',
                show: true,
                boundaryGap: false
              }
            ],
            yAxis: [
              {
                type: 'value',
                min: 0,
                max: 100
              }
            ],
            axisPointer: {
              link: {
                xAxisIndex: [0]
              }
            },
            legend: {
              bottom: 10,
              data: []
            }
          },
          bind: {
            category: '{cpu_category}',
            series: '{cpu_series}'
          }
        },
        {
          title: 'Memory',
          options: {
            color: ['#97c043'],
            title: [
              {
                text: ''
              }
            ],
            grid: [
              {
                top: 20,
                right: 10,
                left: 60
              }
            ],
            tooltip: {
              padding: [10, 20, 10, 20],
              textStyle: {
                fontSize: 12
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                animation: false,
                snap: false,
                label: {
                  backgroundColor: '#505765'
                }
              }
            },
            xAxis: [
              {
                type: 'category',
                show: true,
                boundaryGap: false
              }
            ],
            yAxis: [
              {
                type: 'value',
                min: 0,
                max: 100
              }
            ],
            axisPointer: {
              link: {
                xAxisIndex: [0]
              }
            },
            legend: {
              bottom: 10,
              data: []
            }
          },
          bind: {
            category: '{memory_category}',
            series: '{memory_series}'
          }
        },
        {
          title: 'Disk',
          options: {
            color: ['#dc972c'],
            title: [
              {
                text: ''
              }
            ],
            grid: [
              {
                top: 20,
                right: 10,
                left: 60
              }
            ],
            tooltip: {
              padding: [10, 20, 10, 20],
              textStyle: {
                fontSize: 12
              },
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                animation: false,
                snap: false,
                label: {
                  backgroundColor: '#505765'
                }
              }
            },
            xAxis: [
              {
                type: 'category',
                show: true,
                boundaryGap: false
              }
            ],
            yAxis: [
              {
                type: 'value',
                min: 0,
                max: 100
              }
            ],
            axisPointer: {
              link: {
                xAxisIndex: [0]
              }
            },
            legend: {
              bottom: 10,
              data: []
            }
          },
          bind: {
            category: '{disk_category}',
            series: '{disk_series}'
          }
        }
      ]
    }
  ]
});
