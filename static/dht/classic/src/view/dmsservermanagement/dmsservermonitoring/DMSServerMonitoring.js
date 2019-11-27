/**
 * Created by zen on 19. 5. 10.
 */
Ext.define(
  'dhcp.view.dmsservermanagement.dmsservermonitoring.DMSServerMonitoring',
  {
    extend: 'Ext.Container',

    requires: [
      'Ext.button.Button',
      'Ext.button.Segmented',
      'Ext.chart.series.Line',
      'Ext.container.Container',
      'Ext.form.field.Date',
      'Ext.grid.Panel',
      'Ext.layout.container.HBox',
      'Ext.layout.container.VBox',
      'Ext.panel.Panel',
      'Ext.util.Format',
      'dhcp.ux.echarts.Echarts',
      'dhcp.ux.echarts.Theme',
      'dhcp.view.dmsservermanagement.dmsservermonitoring.DMSServerMonitoringController',
      'dhcp.view.dmsservermanagement.dmsservermonitoring.DMSServerMonitoringModel'
    ],

    xtype: 'dmsservermonitoring',

    viewModel: {
      type: 'dmsservermonitoring'
    },

    controller: 'dmsservermonitoring',
    scrollable: true,
    title: '시스템 모니터링',
    layout: { type: 'vbox', align: 'stretch' },
    defaults: { margin: '5 5 5 5' },
    initComponent: function() {
      Ext.apply(this, {
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
                { text: 'Server', dataIndex: 'ip', flex: 1 },
                {
                  text: '상태',
                  dataIndex: 'server_status',
                  width: 90,
                  renderer: 'renderPowerStatus',
                  align: 'left'
                },
                {
                  text: 'CPU 사용률',
                  dataIndex: 'cpu',
                  flex: 1,
                  renderer: 'renderPercent'
                },
                {
                  text: 'Memory 사용률',
                  dataIndex: 'mem',
                  flex: 1,
                  renderer: 'renderPercent'
                },
                {
                  text: 'Swap 사용률',
                  dataIndex: 'swap',
                  flex: 1,
                  renderer: 'renderPercent'
                },
                {
                  text: 'Disk 사용률',
                  dataIndex: 'disk',
                  flex: 1,
                  renderer: 'renderPercent'
                },
                { text: 'Uptime', dataIndex: 'mtime', flex: 1 },
                { text: '이중화', dataIndex: 'replication', flex: 1 }
              ]
            },
            bind: { store: '{serverGridStore}' },
            listeners: { itemclick: 'serverGridStoreSelect' }
          },
          {
            xtype: 'container',
            items: [
              {
                xtype: 'container',
                margin: 0,
                layout: { type: 'hbox', align: 'middle' },
                items: [
                  {
                    xtype: 'segmentedbutton',
                    reference: 'searchRange',
                    items: [
                      {
                        text: '오늘',
                        pressed: true,
                        value: 'today'
                      },
                      {
                        text: '어제',
                        value: 'last_2_days'
                      },
                      {
                        text: '최근 7일',
                        value: 'last_7_days'
                      },
                      {
                        text: '최근 30일',
                        value: 'last_30_days'
                      },
                      {
                        text: '선택',
                        value: 'custom'
                      }
                    ],
                    publish: ['value'],
                    listeners: {
                      change: 'onChangeSearchRange'
                    }
                  },
                  {
                    xtype: 'datefield',
                    margin: '0 0 0 10',
                    reference: 'customDate',
                    disabled: true,
                    fieldLabel: '기준일',
                    labelWidth: 'auto',
                    format: 'Y-m-d',
                    value: new Date(),
                    maxValue: new Date(),
                    bind: {
                      disabled: '{searchRange.value != "custom"}'
                    },
                    listeners: {
                      select: 'onSearch'
                    }
                  },
                  {
                    xtype: 'button',
                    margin: '0 0 0 10',
                    iconCls: 'x-fa fa-refresh',
                    handler: 'onSearch'
                  }
                ]
              }
            ]
          },
          {
            xtype: 'container',
            reference: 'chartArea',
            scrollable: true,
            layout: { type: 'hbox', align: 'stretch' },
            items: [
              {
                xtype: 'panel',
                margin: 0,
                scrollable: true,
                // minWidth: 300,
                flex: 5,
                height: 600,
                layout: { type: 'vbox', align: 'stretch' },
                items: [
                  {
                    xtype: 'echarts',
                    height: 605,
                    title: 'Resource 사용률 (%)',
                    options: {
                      title: [
                        {
                          text: 'CPU',
                          top: 15
                        },
                        {
                          text: 'Memory',
                          top: 175
                        },
                        {
                          text: 'Swap',
                          top: 340
                        }
                      ],
                      grid: [
                        {
                          right: 15,
                          left: 55,
                          top: 15,
                          height: 140
                        },
                        {
                          right: 15,
                          left: 55,
                          top: 175,
                          height: 140
                        },
                        {
                          right: 15,
                          left: 55,
                          top: 340,
                          height: 140
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
                        },
                        formatter: function(params) {
                          if (params instanceof Array) {
                            const groups = [
                              {
                                text: 'CPU',
                                group: 'cpu',
                                data: []
                              },
                              {
                                text: 'Memory',
                                group: 'memory',
                                data: []
                              },
                              {
                                text: 'Swap',
                                group: 'swap',
                                data: []
                              }
                            ];
                            const time = params[0].axisValue;
                            for (let i = 0; i < params.length; i += 1) {
                              const groupName = params[i].seriesId.split(
                                '_'
                              )[0];
                              const o = _.findWhere(groups, {
                                group: groupName
                              });
                              if (o) {
                                o.data.push({
                                  marker: params[i].marker,
                                  seriesName: params[i].seriesName,
                                  value: params[i].data
                                    ? `${params[i].data} %`
                                    : '-'
                                });
                              }
                            }
                            return dhcp.ux.echarts.Theme.groupTooltipTemplate.apply(
                              {
                                title: time,
                                groups: groups
                              }
                            );
                          }
                          return {};
                        }
                      },
                      xAxis: [
                        {
                          type: 'category',
                          show: false
                        },
                        {
                          type: 'category',
                          show: false,
                          gridIndex: 1
                        },
                        {
                          type: 'category',
                          gridIndex: 2
                        }
                      ],
                      yAxis: [
                        {
                          type: 'value',
                          min: 0,
                          max: 100
                        },
                        {
                          type: 'value',
                          min: 0,
                          max: 100,
                          gridIndex: 1
                        },
                        {
                          type: 'value',
                          min: 0,
                          max: 100,
                          gridIndex: 2
                        }
                      ],
                      series: [
                        {
                          id: 'cpu_kernel',
                          name: 'kernel',
                          type: 'line',
                          areaStyle: {},
                          stack: 'cpu',
                          symbolSize: 0,
                          animation: false
                        },
                        {
                          id: 'cpu_user',
                          name: 'user',
                          type: 'line',
                          areaStyle: {},
                          stack: 'cpu',
                          symbolSize: 0,
                          animation: false
                        },
                        {
                          id: 'cpu_idle',
                          name: 'idle',
                          type: 'line',
                          color: '#DBDBDB',
                          areaStyle: { opacity: 0.4 },
                          stack: 'cpu',
                          symbolSize: 0,
                          animation: false
                        },
                        {
                          id: 'memory_used',
                          name: 'used',
                          color: '#3fb1e3',
                          type: 'line',
                          areaStyle: {},
                          stack: 'memory',
                          symbolSize: 0,
                          animation: false,
                          xAxisIndex: 1,
                          yAxisIndex: 1
                        },
                        {
                          id: 'memory_free',
                          name: 'free',
                          color: '#DBDBDB',
                          type: 'line',
                          areaStyle: { opacity: 0.4 },
                          stack: 'memory',
                          symbolSize: 0,
                          animation: false,
                          xAxisIndex: 1,
                          yAxisIndex: 1
                        },
                        {
                          id: 'swap_used',
                          name: 'used',
                          color: '#3fb1e3',
                          type: 'line',
                          areaStyle: {},
                          stack: 'swap',
                          symbolSize: 0,
                          animation: false,
                          xAxisIndex: 2,
                          yAxisIndex: 2
                        },
                        {
                          id: 'swap_free',
                          name: 'free',
                          color: '#DBDBDB',
                          type: 'line',
                          areaStyle: { opacity: 0.4 },
                          stack: 'swap',
                          animation: false,
                          symbolSize: 0,
                          xAxisIndex: 2,
                          yAxisIndex: 2
                        }
                      ],
                      axisPointer: {
                        link: {
                          xAxisIndex: [0, 1, 2]
                        }
                      },
                      legend: {
                        bottom: 0,
                        data: ['kernel', 'user', 'idle', 'used', 'free']
                      },
                      dataZoom: [
                        {
                          zoomOnMouseWheel: 'shift',
                          xAxisIndex: [0, 1, 2],
                          bottom: 30
                        }
                      ]
                    },
                    bind: {
                      promise: '{chart_promise}',
                      category: '{chart_category}',
                      seriesData: '{chart_seriesData}'
                    }
                  },
                  {
                    xtype: 'echarts',
                    title: 'DISK (%)',
                    margin: '0 0 10 0',
                    height: 300,
                    theme: 'zen',
                    options: {
                      grid: [{ top: 15, right: 15, bottom: 50, left: 55 }],
                      tooltip: {
                        trigger: 'axis',
                        position: function() {
                          return { top: '1%', left: '15%' };
                        },
                        axisPointer: {
                          type: 'cross',
                          label: {
                            backgroundColor: '#6a7985'
                          }
                        },
                        formatter: function(params) {
                          return dhcp.ux.echarts.Theme.tooltipTemplate2.apply({
                            title: params[0].axisValue,
                            series: params
                          });
                        }
                      },
                      legend: { bottom: 0, type: 'scroll' },
                      xAxis: [
                        {
                          type: 'category'
                        }
                      ],
                      yAxis: [{ type: 'value', max: 100 }],
                      defaultSeries: {
                        type: 'line',
                        symbolSize: 0
                      }
                    },
                    bind: {
                      promise: '{chart_promise}',
                      category: '{disk_category}',
                      legend: '{disk_legend}',
                      seriesData: '{disk_seriesData}'
                    }
                  },
                  {
                    xtype: 'echarts',
                    title: 'Network',
                    reference: 'networkChart',
                    hidden: true,
                    height: 400,
                    theme: 'zen',
                    options: {
                      grid: [
                        {
                          right: 5,
                          left: 80,
                          top: 15,
                          height: 130
                        },
                        {
                          right: 5,
                          left: 80,
                          top: 145,
                          height: 130
                        }
                      ],
                      tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                          type: 'cross',
                          label: {
                            backgroundColor: '#6a7985'
                          }
                        },
                        position: function(pos, params, dom, rect, size) {
                          const obj = { top: '10%' };
                          if (size.viewSize[0] > pos[0] + size.contentSize[0]) {
                            [obj.left, ,] = pos;
                          } else {
                            obj.left = pos[0] - size.contentSize[0];
                          }
                          return obj;
                        }
                      },
                      legend: { bottom: 0, type: 'scroll' },
                      xAxis: [
                        {
                          type: 'category',
                          show: false
                        },
                        {
                          type: 'category',
                          gridIndex: 1
                        }
                      ],
                      yAxis: [
                        {
                          type: 'value',
                          axisLabel: {
                            formatter: Ext.util.Format.bpsSize
                          }
                        },
                        {
                          type: 'value',
                          gridIndex: 1,
                          inverse: true,
                          axisLabel: {
                            formatter: Ext.util.Format.bpsSize
                          }
                        }
                      ],
                      defaultSeries: {
                        type: 'line',
                        symbolSize: 0,
                        areaStyle: {}
                      },
                      axisPointer: {
                        link: { xAxisIndex: 'all' }
                      },
                      dataZoom: [
                        {
                          type: 'inside',
                          xAxisIndex: [0, 1]
                        },
                        {
                          xAxisIndex: [0, 1],
                          bottom: 30
                        }
                      ]
                    },
                    bind: {
                      promise: '{chart_promise}',
                      category: '{network_category}',
                      legend: '{network_legend}',
                      seriesData: '{network_seriesData}'
                    }
                  }
                ]
              },
              {
                xtype: 'panel',
                margin: '0 5 5 5',
                // minWidth: 240,
                flex: 4,
                height: 590,
                layout: { type: 'vbox', align: 'stretch' },
                items: [
                  {
                    xtype: 'echarts',
                    title: '패킷 처리수 (pkt / sec)',
                    height: 590,
                    theme: 'zen',
                    options: {
                      grid: [{ top: 15, right: 5, bottom: 50, left: 55 }],
                      tooltip: {
                        trigger: 'axis',
                        position: function() {
                          return { top: '5%', left: '12%' };
                        },
                        axisPointer: {
                          type: 'cross',
                          label: {
                            backgroundColor: '#6a7985'
                          }
                        },
                        formatter: function(params) {
                          return dhcp.ux.echarts.Theme.tooltipTemplate2.apply({
                            title: params[0].axisValue,
                            series: params
                          });
                        }
                      },
                      legend: { bottom: 0, type: 'scroll' },
                      xAxis: [
                        {
                          type: 'category'
                        }
                      ],
                      // yAxis: [{type: 'value', max: 0.1}],
                      yAxis: [{ type: 'value' }],
                      defaultSeries: {
                        type: 'line',
                        symbolSize: 0
                      }
                    },
                    bind: {
                      promise: '{chart_promise}',
                      category: '{stat_category}',
                      legend: '{stat_legend}',
                      seriesData: '{stat_seriesData}'
                    }
                  }
                ]
              }
            ]
          }
        ]
      });
      this.callParent();
    }
  }
);
