/**
 * Created by jjol on 16. 10. 18.
 */

Ext.define('dhcp.view.ipassignedstatus.ipstats.IPStatsController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.ipstats',

  requires: ['dhcp.view.ipassignedstatus.ipstats.AssignedIPListWindow'],

  gridStoreBeforeload: function(store) {
    store
      .getProxy()
      .setExtraParams(this.lookupReference('searchForm').getValues());
  },

  gridStoreLoad: function(records) {
    this.lookupReference('searchBT').setLoading(false);

    const record = records.getData();
    const vm = this.getViewModel();
    let shared_network = '';
    let found = false;
    for (let i = 0; i < record.items.length; i++) {
      for (
        let j = 0, assignedIP = record.items[i].data.uses.split('<br>');
        j < assignedIP.length;
        j++
      ) {
        if (assignedIP[j] !== '0') {
          shared_network = record.items[i].data.shared_network;
          this.lookupReference('grid').ensureVisible(record.items[i], {
            animate: true,
            highlight: true,
            select: true,
            focus: true
          });
          found = true;
          break;
        }
      }
    }

    if (!found) {
      if (record.items[0]) {
        shared_network = record.items[0].data.shared_network;
        this.lookupReference('grid')
          .getSelectionModel()
          .select(0);
      }
    }
    vm.set('shared_network', shared_network);
    this.getChartSearchForm();
  },

  gridStoreSelect: function(view, record) {
    const shared_network = record.get('shared_network'),
      vm = this.getViewModel();

    vm.set('shared_network', shared_network);
    this.getChartSearchForm();
  },

  onSearch: function() {
    if (this.lookupReference('searchForm').isValid()) {
      this.lookupReference('searchBT').setLoading(false);
      this.getViewModel()
        .getStore('gridStore')
        .loadPage(1);
    } else {
      Ext.Msg.alert('알림', '필요한 형식을 입력해주세요.');
    }
  },

  onExcel: function() {
    const mode = 'xls',
      store = this.lookupReference('grid').getStore(),
      params = this.lookupReference('searchForm').getValues();

    if (store.getTotalCount() > 65536) {
      Ext.Msg.alert('오류', '엑셀 최대 레코드수를 초과했습니다.');
      return;
    }
    params['mode'] = mode;
    dhcp.excel('/ip_stats/excel', params);
  },

  showAssignedIP: function(cp) {
    const me = this,
      shared_network = me
        .lookupReference('grid')
        .getSelection()[0]
        .get('shared_network'),
      ip_assigned = me
        .lookupReference('grid')
        .getSelection()[0]
        .get('uses'),
      limit = me
        .lookupReference('grid')
        .getSelection()[0]
        .get('total');
    dht.ajax(
      '/ip_stats/get_ip_assigned',
      {
        shared_network: shared_network,
        limit: limit,
        ip_assigned: ip_assigned
      },
      function(response) {
        if (response.success === true) {
          new dhcp.view.ipassignedstatus.ipstats.AssignedIPListWindow({
            animateTarget: cp,
            viewModel: {
              data: {
                ip_list: response.data,
                params: {
                  shared_network: shared_network,
                  ip_assigned: ip_assigned,
                  limit: limit
                }
              }
            },
            y: 100,
            width: 1000,
            height: 600,
            modal: true,
            autoScroll: true
          }).show();
        } else {
          Ext.Msg.alert('알림', response['errmsg']);
        }
      }
    );
  },

  getChartSearchForm: function() {
    const me = this,
      searchForm = me.lookupReference('chartSearchForm'),
      end = Ext.Date.add(new Date(), Ext.Date.MINUTE, -0),
      start = Ext.Date.add(end, Ext.Date.DAY, -7);

    searchForm.getForm().setValues({
      sDay: new Date(start),
      sHour: start.getHours(),
      sMin: start.getMinutes(),
      eDay: end,
      eHour: end.getHours(),
      eMin: end.getMinutes()
    });
    this.onChartSearch();
  },

  onChartSearch: function() {
    const me = this,
      formData = me.lookupReference('chartSearchForm').getValues(),
      vm = this.getViewModel(),
      shared_network = vm.get('shared_network');

    formData.sMin = this.addZeros(formData.sMin, 2);
    formData.eMin = this.addZeros(formData.eMin, 2);
    const stime = Ext.Date.parse(
        Ext.String.format(
          '{0} {1}:{2}',
          formData.sDay,
          formData.sHour,
          formData.sMin
        ),
        'Y-m-d G:i'
      ).getTime(),
      etime = Ext.Date.parse(
        Ext.String.format(
          '{0} {1}:{2}',
          formData.eDay,
          formData.eHour,
          formData.eMin
        ),
        'Y-m-d G:i'
      ).getTime(),
      refs = me.getReferences(),
      // type, chartTitle, chartPanel, renderType
      type = [
        'sharedNetworkStats',
        refs.sharedNetworkStatsTitle,
        refs.sharedNetworkStatsChart,
        me.renderChartTypesharedNetworkStats
      ];
    const params = {
      stime: stime / 1000,
      etime: etime / 1000,
      shared_network: shared_network
    };
    dht.ajax('/ip_stats/chart_list_up', params, function(r) {
      let ctime = [];
      me.charts = [];

      type[1].show();
      type[2].show();

      for (let i = 0; i < r.data.sharedNetworkStats.length; i++) {
        ctime.push(r.data.sharedNetworkStats[i].ctime * 1000);
        delete r.data.sharedNetworkStats[i].ctime;
      }
      //            function(type, chartPanel, data, category )
      me.charts.push(type[3](type[0], type[2], r.data, ctime));
      for (let i = 0, l = me.charts.length; i < l; i += 1) {
        me.charts[i].on('mouseover', function(record) {
          for (let ii = 0; ii < l; ii += 1) {
            if (i != ii) {
              me.charts[ii].dispatchAction({
                type: 'showTip',
                dataIndex: record.dataIndex
              });
            }
          }
        });
      }
    });
  },

  renderChartTypesharedNetworkStats: function(type, panel, data, category) {
    // var colors = data.info[type], // rrd에서 가져오는 컬러. 배열이 아님.
    let colors = [
        '#2f7ed8',
        '#0d233a',
        '#8bbc21',
        '#910000',
        '#1aadce',
        '#492970',
        '#f28f43',
        '#77a1e5',
        '#c42525',
        '#a6c96a'
      ],
      series = [],
      legend = [];

    if (!data[type]) {
      return;
    }
    for (let index in data[type][0]) {
      legend.push(index);
    }
    for (let i = 0, l = legend.length; i < l; i += 1) {
      series.push({
        name: legend[i],
        type: 'line',
        // stack: 'a',
        symbolSize: 1,
        itemStyle: { normal: { color: colors[i] } },
        // areaStyle: {normal: {color: colors[i]}},
        data: []
      });
    }

    for (let i = 0, l = data[type].length; i < l; i += 1) {
      for (let ii = 0, ll = legend.length; ii < ll; ii += 1) {
        series[ii]['data'].push(
          data[type][i][legend[ii]] ? data[type][i][legend[ii]] : 0
        ); // 0 대신 ''를 넣으면 차트가 안그려짐.
      }
    }

    let chart = echarts.init(panel.getEl().dom);
    chart.setOption({
      title: false,
      toolbox: false,
      grid: [{ top: 5, right: 5, bottom: 40, left: 60 }],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textStyle: { color: 'black' },
        formatter: function(value) {
          let str = Ext.Date.format(
            new Date(parseInt(value[0].name)),
            'Y-m-d H:i:s'
          );
          for (let i = 0, l = value.length; i < l; i += 1) {
            if (value[i].data) {
              str += Ext.String.format(
                '<br><b><span style="color: {0}">{1}</span></b>: {2}',
                colors[value[i].seriesIndex],
                value[i].seriesName,
                Ext.util.Format.number(value[i].data, '1,000.00')
              );
            }
          }
          return str;
        }
      },
      color: colors,
      legend: {
        data: legend,
        bottom: 0,
        selected: { idle: false, IDLE: false }
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: category,
          axisLabel: {
            formatter: function(value) {
              return Ext.Date.format(new Date(parseInt(value)), 'H:i');
            }
          }
        }
      ],
      yAxis: [{ type: 'value', max: 100 }],
      series: series
    });
    return chart;
  },

  addZeros: function(num, digit) {
    let zero = '';
    num = num.toString();
    if (num.length < digit) {
      for (let i = 0; i < digit - num.length; i++) {
        zero += '0';
      }
    }
    return zero + num;
  }
});
