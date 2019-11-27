/**
 * Created by zen on 18. 4. 23.
 */
Ext.define(
  'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.iplistwindow.IPListWindowController',
  {
    extend: 'Ext.app.ViewController',
    alias: 'controller.iplistwindow',

    /**
     * Called when the view is created
     */
    init: function() {},
    onCancel: function() {
      this.getView().close();
    },

    onSave: function() {
      const me = this;
      const selected_row = me.lookupReference('grid').getSelection();
      const vm = me.getViewModel();
      const store = vm.getStore('ipGridStore');
      let count = 0;
      let save_flag = true;
      const grouped_list = [];
      if (selected_row.length > 0) {
        selected_row.sort(
          (a, b) => a.get('ip').split('.')[3] - b.get('ip').split('.')[3]
        );
        selected_row.forEach(rec => {
          if (
            rec.get('type') === 'manual' &&
            rec.get('mac').replace(/ /gi, '') === ''
          ) {
            me.lookupReference('grid')
              .getView()
              .focusRow(rec);
            Ext.Msg.alert('알림', '고정 IP의 MAC 주소를 입력해 주세요.');
            save_flag = false;
          } else if (
            !rec.get('domain_name_servers') ||
            !rec.get('dhcp_lease_time')
          ) {
            save_flag = false;
            me.lookupReference('grid')
              .getView()
              .focusRow(rec);
            Ext.Msg.alert('알림', '작성되지 않은 레코드가 있습니다.');
          }
        });
        me.pushRange(grouped_list, 'start', selected_row[0], count);
        for (let i = 1; i < selected_row.length; i += 1) {
          if (
            selected_row[i - 1].get('class') !== selected_row[i].get('class') ||
            selected_row[i - 1].get('type') !== selected_row[i].get('type') ||
            selected_row[i].get('ip').split('.')[3] -
              selected_row[i - 1].get('ip').split('.')[3] >
              1 ||
            selected_row[i].get('type') === 'manual' ||
            selected_row[i - 1].get('domain_name_servers') !==
              selected_row[i].get('domain_name_servers') ||
            selected_row[i - 1].get('dhcp_lease_time') !==
              selected_row[i].get('dhcp_lease_time')
          ) {
            me.pushRange(grouped_list, 'end', selected_row[i - 1], count);
            count += 1;
            me.pushRange(grouped_list, 'start', selected_row[i], count);
          }
        }
        me.pushRange(
          grouped_list,
          'end',
          selected_row[selected_row.length - 1],
          count
        );
      }

      if (save_flag) {
        let merged_data = [];
        if (grouped_list.length > 0) {
          for (
            let i = grouped_list[0].group;
            i <= grouped_list[grouped_list.length - 1].group;
            i++
          ) {
            const reduced = grouped_list.filter(item => item.group === i);
            merged_data.push(Object.assign(reduced[0], reduced[1]));
          }
          merged_data = merged_data.map(item => {
            if (item.mac.replace(/ /gi, '') !== '') {
              item.mac = me.renderMac(item.mac);
            }
            delete item.group;
            return item;
          });
        } else {
          merged_data = ['delete', store.getData().items[0].data.ip];
        }
        me.getView().fireEvent('save', merged_data);
        me.getView().close();
      }
    },

    onBoxReady: function() {
      const me = this;
      const vm = me.getViewModel();
      const ip_list = vm.get('ip_list');
      const store = vm.getStore('ipGridStore');
      store.getProxy().setData(ip_list);
      store.load();
      store.each(rec => {
        if (rec.data.used === true) {
          me.lookupReference('grid')
            .getSelectionModel()
            .select(rec, true);
        }
      });
    },
    renderClass: value => {
      return value.replace(/ /gi, '') === '' ? 'default' : value;
    },
    renderMac: value => {
      if (value.replace(/ /gi, '') !== '') {
        let mac = '';
        for (let i = 0; i <= value.length - 2; i += 2) {
          mac += `${value.substr(i, 2)}-`;
        }
        return mac.slice(0, mac.length - 1);
      }
    },
    renderType: value => {
      return value === 'dynamic' ? '유동 IP' : '고정 IP';
    },
    pushRange: (list, type, row, count) => {
      if (type === 'start') {
        list.push({
          group: count,
          range_start: row.get('ip'),
          class: row.get('class'),
          type: row.get('type'),
          mac: row.get('mac'),
          domain_name_servers: row.get('domain_name_servers'),
          dhcp_lease_time: row.get('dhcp_lease_time')
        });
      } else {
        list.push({
          group: count,
          range_end: row.get('ip')
        });
      }
    }
  }
);
