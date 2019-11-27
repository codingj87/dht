/**
 * Created by zen on 19. 4. 12.
 */
Ext.define('dht.view.dhcp.clustermanagement.ClusterManagementController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.clustermanagement',

  uses: ['dht.view.windows.clusterwindow.ClusterWindow'],

  /**
   * Called when the view is created
   */
  init: function() {},
  handleBeforeLoad: function(store) {
    const vm = this.getViewModel();
    const vip = vm.get('vip');
    store.getProxy().setExtraParams({ vip });
  },
  handleDelete: function() {
    const grid = this.lookupReference('grid');
    const { id: pk } = grid.getSelection()[0].data;
    Ext.Msg.confirm('확인', '삭제하시겠습니까?', async function(btn) {
      if (btn !== 'yes') return false;

      const response = await dht.ajax('/cluster/delete', { pk });
      if (!response.success) {
        return Ext.Msg.alert('오류', response.errMsg);
      }
      grid.getStore().reload();
      return Ext.Msg.alert('알림', '클러스터 삭제가 완료됐습니다.');
    });
  },
  handleCreate: function(cp) {
    const grid = this.lookupReference('grid');
    new dhcp.view.windows.clusterwindow.ClusterWindow({
      animateTarget: cp,
      title: '생성',
      listeners: {
        save: function() {
          Ext.Msg.alert('알림', '클러스터 생성이 완료됐습니다.');
          grid.getStore().reload();
        }
      }
    }).show();
  },
  handleUpdate: async function(cp) {
    const grid = this.lookupReference('grid');
    const { id: pk } = grid.getSelection()[0].data;
    const response = await dht.ajax('/cluster/read', { pk });

    if (!response.success) {
      Ext.Msg.alert('오류', response.errMsg);
    } else {
      const { data } = response;

      new dhcp.view.windows.clusterwindow.ClusterWindow({
        animateTarget: cp,
        title: '수정',
        viewModel: {
          data: Object.assign(data, { pk })
        },
        listeners: {
          save: function() {
            Ext.Msg.alert('알림', '클러스터 수정이 완료됐습니다.');
            grid.getStore().reload();
          }
        }
      }).show();
    }
  },
  gridStoreLoad: function(records) {
    const record = records.getData();
    let ip = '';

    for (let i = 0; i < record.items.length; i++) {
      if (record.items[i].data.server_status >= 1) {
        ip = record.items[i].data.ip;
        this.lookupReference('serverGrid')
          .getSelectionModel()
          .select(record.items[i]);
        break;
      }
    }

    if (ip) {
      let vm = this.getViewModel();
      vm.set('ip', ip);
      this.onSearch();
    } else {
      Ext.Array.each(this.getView().query('echarts'), function(c) {
        if (c.$chart) {
          c.$chart.clear();
        }
      });
      Ext.Msg.alert('알림', '현재 실행 중인 서버가 없습니다.');
    }
  },
  handleGridSelect: function(grid, record) {
    const vm = this.getViewModel();
    vm.set('vip', record.get('vip'));
    this.getViewModel()
      .getStore('serverGridStore')
      .load();
  },
  serverGridStoreSelect: function(view, record) {
    const ip = record.get('ip'),
      state = record.get('server_status'),
      vm = this.getViewModel();

    vm.set('ip', ip);
    if (state === -1) {
      vm.set('chart_flag', 'chart_off');
    } else {
      vm.set('chart_flag', 'chart_on');
    }
    this.onSearch();
  },

  renderPowerStatus: function(value) {
    if (value === -1) {
      return '<span style="color: #bb4b39"><i class="fa fa-circle"></i></span> off';
    } else if (value === 0) {
      return '<span style="color: #79C447"><i class="fa fa-circle-o-notch"></i></span> standby';
    } else {
      return '<span style="color: #79C447"><i class="fa fa-circle"></i></span> service';
    }
  },
  renderPercent: function(value) {
    if (value !== undefined) return `${value} %`;

    return '';
  },

  onChangeSearchRange: function(btn, newValue, oldValue) {
    // debugger;
    var view = this.getView();
    Ext.Array.each(view.query('echarts'), function() {
      this.action({
        type: 'dataZoom',
        start: 0,

        end: 100
      });
    });

    if (oldValue) {
      this.onSearch();
    }
  },
  getRange: function() {
    var range = this.lookupReference('searchRange').getValue();
    var etime = moment()
        .startOf('minute')
        .format('X'),
      stime,
      resolution;
    if (range === 'today') {
      stime = moment()
        .startOf('day')
        .format('X');
      resolution = 300;
    } else if (range === 'last_2_days') {
      stime = moment()
        .startOf('day')
        .add(-1, 'days')
        .format('X');
      resolution = 1000;
    } else if (range === 'last_7_days') {
      stime = moment()
        .add(-7, 'days')
        .format('X');
      resolution = 3600;
    } else if (range === 'last_30_days') {
      stime = moment()
        .add(-30, 'days')
        .format('X');
      resolution = 3600 * 4;
    } else if (range == 'last_year') {
      stime = moment()
        .startOf('year')
        .format('X');
      resolution = 3600 * 24;
    } else if (range === 'custom') {
      var t = this.lookupReference('customDate').getValue();
      stime = moment(Ext.Date.subtract(t, Ext.Date.DAY, 1)).format('X');
      etime = moment(Ext.Date.add(t, Ext.Date.DAY, 1)).format('X');
      now = moment().format('X');
      if (etime > now) etime = now;
      resolution = 300;
    }
    return { stime, etime, resolution };
  },

  onSearch: function() {
    var me = this,
      view = this.getView();
    var { stime, etime, resolution } = this.getRange();
    var vm = this.getViewModel();
    var params = {
      stime: stime,
      etime: etime,
      resolution: resolution,
      ip: vm.get('ip')
    };
    Ext.Array.each(view.query('echarts'), function(c) {
      if (c.$chart) {
        c.$chart.clear();
      }
    });

    var chart_flag = vm.get('chart_flag');
    var chartArea = me.lookupReference('chartArea');
    if (chart_flag === 'chart_off') {
      chartArea.hide();
    } else {
      chartArea.show();
    }

    var p = dht.ajax('/server_status/list_up', params);
    vm.set('chart_promise', p);
    p.then(function(r) {
      var data = r.data;
      var cpu = data.cpu;
      var memory = data.memory;
      var swap = data.swap;
      var disk = data.disk;
      var stat = data.stat;
      vm.set('chart_category', { data: cpu.category });

      vm.set(
        'chart_seriesData',
        cpu.series.concat(memory.series).concat(swap.series)
      );

      if (disk.legend.includes('_')) {
        var idx = disk.legend.indexOf('_');
        disk.legend.splice(idx, 1, '_root');
        disk.series[idx].id = 'disk__root';
        disk.series[idx].name = '_root';
      }
      vm.set('disk_legend', { data: disk.legend });
      vm.set('disk_category', { data: disk.category });
      vm.set('disk_seriesData', disk.series);
      vm.set('stat_legend', { data: stat.legend });
      vm.set('stat_category', { data: stat.category });
      vm.set('stat_seriesData', stat.series);

      var network = data.network;
      var networkChart = me.lookupReference('networkChart');
      if (network) {
        networkChart.show();
        Ext.Array.each(network.series, function(s) {
          if (/\w+(?:(?:out)|(?:tx))\w*/g.test(s.name)) {
            s.xAxisIndex = 1;
            s.yAxisIndex = 1;
            s.stack = 2;
          } else {
            s.stack = 1;
          }
        });
        vm.set('network_legend', { data: network.legend });
        vm.set('network_category', { data: network.category });
        vm.set('network_seriesData', network.series);
      } else {
        networkChart.hide();
      }
    });
  }
});
