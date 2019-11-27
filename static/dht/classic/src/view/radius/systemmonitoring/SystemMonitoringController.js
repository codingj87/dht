/**
 * Created by parkyes90 on 18. 01. 09.
 */

Ext.define('dhcp.view.radius.systemmonitoring.SystemMonitoringController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.systemmonitoring',

  uses: ['Ext.util.Format'],

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

    const dataList = [];
    let dataMap = {};

    for (let i = 0; i < record.items.length; i++) {
      const decimal = 0.01;
      const data = record.items[i].data;

      dataMap = {
        server_status: data.server_status,
        hostname: data.hostname,
        ip: data.ip,
        cpu: Math.round(data.cpu) * decimal,
        memory: Math.round(data.memory) * decimal,
        disk: Math.round(data.disk) * decimal,
        process_check: ''
      };

      if (data.process_check) {
        for (const [key, value] of Object.entries(data.process_check)) {
          let icon;
          if (value === true) {
            icon =
              '<span class="x-fa fa-3x fa-check-circle" style="color:#40AFE2;"></span>';
          } else {
            icon =
              '<span class="x-fa fa-3x fa-stop-circle" style="color:#F64C4C;"></span>';
          }
          dataMap.process_check += `<div style="width:80px;height:60px;float:left;">${icon}<br>${key}</div>`;
        }
      }

      dataList.push(dataMap);
    }
    records.loadData(dataList);

    if (ip) {
      const vm = this.getViewModel();
      vm.set('ip', ip);
      this.onSearch();
    } else {
      Ext.Msg.alert('알림', '현재 실행 중인 서버가 없습니다.');
    }
  },

  serverGridStoreSelect: function(view, record) {
    const ip = record.get('ip');
    const state = record.get('server_status');
    const vm = this.getViewModel();

    vm.set('ip', ip);
    if (state === -1) {
      vm.set('chart_flag', 'chart_off');
    } else {
      vm.set('chart_flag', 'chart_on');
    }
    this.onSearch();
  },

  getTime: function() {
    const formValues = this.lookupReference('searchForm').getValues();
    const stime = moment(formValues.sdate).startOf('day');
    let etime = moment(formValues.sdate).endOf('day');
    let resolution = 300;

    if (formValues.edate === Ext.Date.format(new Date(), 'Y-m-d')) {
      etime = moment();
    }
    const diff_day = moment.duration(etime.diff(stime)).as('day');
    if (diff_day > 31) {
      Ext.Msg.alert('알림', '조회 가능 기간은 최대 30일입니다.');
      return;
    }
    if (diff_day < 3) {
      resolution = 300;
    }

    return { stime: stime.unix(), etime: etime.unix(), resolution };
  },

  onSearch: function() {
    let me = this,
      view = this.getView();
    let { stime, etime, resolution } = this.getTime();
    let vm = this.getViewModel();
    let params = {
      stime: stime,
      etime,
      resolution: resolution,
      ip: vm.get('ip')
    };
    // const params = {stime: stime.unix(), etime: etime.unix(), resolution: resolution, ip: vm.get('ip')};

    Ext.Array.each(view.query('echarts'), function(c) {
      if (c.$chart) {
        c.$chart.clear();
      }
    });

    let chart_flag = vm.get('chart_flag');
    let chartArea = me.lookupReference('chartArea');
    if (chart_flag === 'chart_off') {
      chartArea.hide();
    } else {
      chartArea.show();
    }

    let p = dht.ajax('/server_status/list_up', params);
    vm.set('chart_promise', p);
    p.then(function(r) {
      let data = r.data;
      const series = {
        type: 'line',
        stack: 'a',
        areaStyle: {},
        symbolSize: 0,
        animation: true,
        smooth: true
      };

      let cpu = data.cpu;
      let memory = data.memory;
      let disk = data.disk;

      const cpu_iowait_data_list = cpu.series[1].data,
        cpu_kernel_data_list = cpu.series[2].data,
        cpu_user_data_list = cpu.series[3].data;
      let cpu_used_data_list = [];
      for (let i = 0; i < cpu_user_data_list.length; i++) {
        cpu_used_data_list.push(
          (
            cpu_iowait_data_list[i] +
            cpu_kernel_data_list[i] +
            cpu_user_data_list[i]
          ).toFixed(2)
        );
      }

      vm.set('cpu_category', { data: cpu.category });
      vm.set(
        'cpu_series',
        Object.assign({ name: 'used', data: cpu_used_data_list }, series)
      );

      vm.set('memory_category', { data: memory.category });
      vm.set(
        'memory_series',
        Object.assign(
          { name: memory.series[1].name, data: memory.series[1].data },
          series
        )
      );

      vm.set('disk_category', { data: disk.category });
      vm.set(
        'disk_series',
        Object.assign({ name: 'used', data: disk.series[0].data }, series)
      );
    });
  }
});
