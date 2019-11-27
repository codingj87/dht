/**
 * Created by zen on 18. 4. 23.
 */
Ext.define(
  'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.SubnetWindowController',
  {
    extend: 'Ext.app.ViewController',
    alias: 'controller.subnetwindow',

    requires: [
      'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.iplistwindow.IPListWindow'
    ],

    /**
     * Called when the view is created
     */
    init: function() {},
    option: [],

    onSave: function() {
      const me = this;
      me.getView().fireEvent('save', me.option);
      me.getView().close();
    },

    onCancel: function() {
      this.getView().close();
    },

    show_ip_list: function(cp) {
      const me = this;

      const start = me
        .lookupReference('grid')
        .getSelection()[0]
        .get('start');

      const end = me
        .lookupReference('grid')
        .getSelection()[0]
        .get('end');

      const vm = me.getViewModel();

      const subnet = vm.get('subnet');

      const broad_cast = vm.get('broad_cast');

      const router = vm.get('router');

      const saved_data = me.option.filter(
        item =>
          item.range_start.substr(0, item.range_start.lastIndexOf('.')) ===
          start.substr(0, start.lastIndexOf('.'))
      );
      let option_list = [];

      let data = [];

      let tmp = [];

      const ip_list = me.getIPList(me, start, end);

      if (saved_data.length > 0) {
        option_list = saved_data;
      } else {
        option_list.push({
          type: 'dynamic',
          range_start: start,
          range_end: end,
          class: '',
          mac: ''
        });
      }
      for (const option of option_list) {
        const start_index = ip_list.indexOf(option.range_start);

        const end_index = ip_list.indexOf(option.range_end);
        if (start_index !== -1 || end_index !== -1) {
          const ip = me.insertIP(start_index, end_index, ip_list, option);
          [tmp, data] = [tmp.concat(ip[0]), data.concat(ip[1])];
        }
      }
      for (const ip of ip_list) {
        if (!tmp.includes(ip)) {
          data.push({
            ip: ip,
            class: '',
            type: 'dynamic',
            used: false,
            mac: ''
          });
        }
      }
      const filtered_data = data.filter(a => {
        return !(a.ip === router || a.ip === subnet || a.ip === broad_cast);
      });
      filtered_data.sort((a, b) => a.ip.split('.')[3] - b.ip.split('.')[3]);
      new src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.iplistwindow.IPListWindow(
        {
          animateTarget: cp,
          viewModel: {
            data: {
              ip_list: filtered_data
            }
          },
          width: 1000,
          height: 600,
          modal: true,
          autoScroll: true,
          listeners: {
            save: function(data) {
              let ip = '';
              if (data[0] !== 'delete') {
                ip = data[0].range_start;
              } else {
                ip = data[1];
              }
              const remove_before_update_data = me.option.filter(
                item =>
                  item.range_start.substr(
                    0,
                    item.range_start.lastIndexOf('.')
                  ) !== ip.substr(0, start.lastIndexOf('.'))
              );
              if (data[0] !== 'delete') {
                me.option = remove_before_update_data.concat(data);
              } else {
                me.option = remove_before_update_data;
              }
              const store = vm.getStore('ipGridStore');
              me.check_used(store, me.option);
            }
          }
        }
      ).show();
    },
    onBoxReady: function() {
      const me = this;

      const vm = me.getViewModel();

      const data = vm.get('data');
      me.option = vm.get('option');
      const store = vm.getStore('ipGridStore');
      store.getProxy().setData(data);
      store.load();
      me.check_used(store, me.option);
    },

    onPageChange: function() {
      const me = this;

      const vm = me.getViewModel();
      const store = vm.getStore('ipGridStore');
      me.check_used(store, me.option);
    },
    onShiftDown: function(cp, record, el, idx, e) {
      if (e.browserEvent.key === 'Shift') {
        const me = this;
        const store = cp.store.data;
        const list = [];

        if (record.data.used === 'O') {
          const data = me.option.filter(
            item =>
              item.range_start.substr(0, item.range_start.lastIndexOf('.')) ===
              record.data.start.substr(0, record.data.start.lastIndexOf('.'))
          );
          store.each(rec => {
            if (rec.internalId < record.internalId) {
              if (rec.data.used === 'O') {
                list.push(rec);
              }
            }
          });
          if (list.length > 0) {
            const nearest_rec = list.sort(
              (a, b) => b.internalId - a.internalId
            )[0];
            store.each(rec => {
              if (
                rec.internalId >= nearest_rec.internalId &&
                rec.internalId < record.internalId
              ) {
                const copy = JSON.parse(JSON.stringify(data));
                const add_data = copy.map(item => {
                  item.range_start =
                    rec.data.start.substr(
                      0,
                      rec.data.start.lastIndexOf('.') + 1
                    ) + item.range_start.split('.')[3];
                  item.range_end =
                    rec.data.start.substr(
                      0,
                      rec.data.start.lastIndexOf('.') + 1
                    ) + item.range_end.split('.')[3];
                  return item;
                });
                add_data.map(item => {
                  me.option.push(item);
                });
                rec.set('used', 'O');
              }
            });
          }
        } else {
          store.each(rec => {
            if (rec.internalId < record.internalId) {
              if (rec.data.used !== 'O') {
                list.push(rec);
              }
            }
          });
          if (list.length > 0) {
            const nearest_rec = list.sort(
              (a, b) => b.internalId - a.internalId
            )[0];
            store.each(rec => {
              if (
                rec.internalId >= nearest_rec.internalId &&
                rec.internalId < record.internalId
              ) {
                me.option = me.option.filter(
                  item =>
                    item.range_start.substr(
                      0,
                      item.range_start.lastIndexOf('.')
                    ) !==
                    rec.data.start.substr(0, rec.data.start.lastIndexOf('.'))
                );
                rec.set('used', '');
              }
            });
          }
        }
      }
    },
    zip: rows => rows[0].map((_, c) => rows.map(row => row[c])),
    check_used: (store, option) => {
      if (option.length > 0) {
        let is_include = [];
        store.each(rec => {
          is_include = option.filter(
            item =>
              item.range_start.substr(0, item.range_start.lastIndexOf('.')) ===
              rec.data.start.substr(0, rec.data.start.lastIndexOf('.'))
          );
          if (is_include.length > 0) {
            rec.set('used', 'O');
          } else {
            rec.set('used', '');
          }
        });
      }
    },
    getIPList: (me, start, end) => {
      const diffList = [];

      const ipList = [];
      for (const [value1, value2] of me.zip([
        start.split('.'),
        end.split('.')
      ])) {
        const difference = parseInt(value2) - parseInt(value1);
        diffList.push(difference);
      }
      for (let i = 0; i <= diffList[1]; i++) {
        for (let j = 0; j <= diffList[2]; j++) {
          for (let k = 0; k <= diffList[3]; k++) {
            const ip =
              `${start.split('.')[0]}.` +
              `${parseInt(start.split('.')[1]) + i}.` +
              `${parseInt(start.split('.')[2]) + j}.` +
              `${parseInt(start.split('.')[3]) + k}`;
            ipList.push(ip);
          }
        }
      }
      return ipList;
    },
    insertIP: (start_index, end_index, list, option) => {
      const temp = [];

      const data = [];
      for (const item of list.splice(
        start_index,
        end_index - start_index + 1
      )) {
        temp.push(item);
        data.push({
          ip: item,
          class: option.class,
          type: option.type,
          domain_name_servers: option.domain_name_servers,
          dhcp_lease_time: option.dhcp_lease_time,
          used: true,
          mac: option.mac.replace(/-/g, '')
        });
      }
      return [temp, data];
    },
    pushRange: (list, type, row, count) => {
      if (type === 'start') {
        list.push({
          group: count,
          range_start: row.range_start,
          class: row.class,
          type: row.type,
          mac: row.mac
        });
      } else {
        list.push({
          group: count,
          range_end: row.range_end
        });
      }
    }
  }
);
