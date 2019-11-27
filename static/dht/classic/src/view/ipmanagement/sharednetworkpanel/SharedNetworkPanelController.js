/**
 * Created by zen on 19. 2. 20.
 */
Ext.define(
  'dhcp.view.ipmanagement.sharednetworkpanel.SharedNetworkPanelController',
  {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sharednetworkpanel',

    requires: [
      'Ext.button.Button',
      'Ext.container.Container',
      'Ext.form.FieldSet',
      'Ext.form.Panel',
      'Ext.form.field.ComboBox',
      'Ext.form.field.Text',
      'Ext.layout.container.HBox',
      'Ext.layout.container.VBox',
      'src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.SubnetWindow'
    ],

    /**
     * Called when the view is created
     */
    init: function() {
      const me = this;
      const vm = me.getViewModel();
      const update = vm.get('update');
      vm.get('form_id_set').clear();
      vm.set('optionData', {});
      vm.set('optionSaveFlag', {});

      if (update === true) {
        const subnet = vm.get('subnet');
        for (item of subnet) {
          me.addCell('update');
        }
      } else {
        vm.set('network', null);
        me.addCell();
      }
    },
    onSave: async function() {
      const me = this;
      const form = me.lookupReference('form');
      const params = form.getValues();
      const vm = me.getViewModel();
      const mode = vm.get('mode');
      const update = vm.get('update');
      const url = Ext.String.format('/ip_pool_setting/{0}', mode);
      const shared_network = params.shared_network;
      const option = vm.get('optionData');
      const set = vm.get('form_id_set');
      if (set.size > 0) {
        if (form.isValid()) {
          const data = [];
          // noinspection JSUnresolvedFunction
          for (const [index, value] of Array.from(set).entries()) {
            const id = `subnet_form-${value}`;
            const { router, net_mask, subnet } = Ext.getCmp(id).getValues();
            if (me.isContainRouter(me, subnet, net_mask, router)) {
              return false;
            }
            me.ipFilter(me, id, subnet, net_mask);
            if (!(option[id] === undefined || option[id] === null)) {
              data.push(Ext.getCmp(id).getValues());
              data[index].option = [];
              option[id].sort(
                (a, b) =>
                  a.range_start.split('.')[2] - b.range_start.split('.')[2]
              );
              for (const item of option[id]) {
                data[index].option.push(item);
              }
              if (!data[index].option.length > 0) {
                Ext.Msg.alert(
                  '알림',
                  `생성한 서브넷 ${subnet}의 IP 풀을 설정해주세요.`
                );
                return false;
              }
              if (me.deleteRouter(me, router, data[index].option)) {
                return false;
              }
            } else {
              Ext.Msg.alert(
                '알림',
                Ext.String.format(
                  '생성한 서브넷 ({0})의 IP 풀을 설정해주세요.',
                  subnet
                )
              );
              return false;
            }
          }
          const myMask = new Ext.LoadMask({
            msg: 'Please wait...',
            target: me.getView()
          });
          myMask.show();

          const response = await dht.ajax(url, {
            params: JSON.stringify(data),
            shared_network,
            update
          });

          if (response.success) {
            if (response.data[0] === 0) {
              Ext.Msg.alert('알림', response.data[1]);
              me.close();
            }
            const tanPanel = this.getView().up();
            const {
              items: { items }
            } = tanPanel;
            if (items) {
              const ipPoolSettingPanel = items.find(
                item => item.xtype === 'ippoolsetting'
              );
              if (ipPoolSettingPanel) {
                ipPoolSettingPanel
                  .getViewModel()
                  .getStore('gridStore')
                  .reload();
              }
            }
            // me.getView().fireEvent('save', response.data);
            dhcp.getLicenseInfo();
            Ext.Msg.alert('알림', '저장 되었습니다.');
          } else {
            Ext.Msg.alert('오류', response.errmsg);
          }
          myMask.destroy();
        }
      } else {
        Ext.Msg.alert('알림', '서브넷을 1개 이상 등록 해주세요.');
      }
    },

    onCancel: function() {
      this.getViewModel()
        .get('form_id_set')
        .clear();
    },

    addCell: function(arg) {
      const me = this;
      const vm = me.getViewModel();
      let update = vm.get('update');
      const array = new Int8Array(1);
      let crypto_number = null;
      vm.set('subnet_value', update ? item.subnet : null);
      while (true) {
        const number = window.crypto.getRandomValues(array);
        if (!vm.get('form_id_set').has(Math.abs(number[0]))) {
          crypto_number = Math.abs(number[0]);
          vm.get('form_id_set').add(Math.abs(number[0]));
          break;
        }
      }
      const id = `subnet_form-${crypto_number}`;
      if (arg !== 'update') {
        update = false;
      } else {
        vm.get('optionData')[id] = item.option;
        vm.get('optionSaveFlag')[id] = true;
      }
      me.lookupReference('form').add({
        xtype: 'form',
        reference: id,
        id: id,
        items: [
          {
            xtype: 'fieldset',
            margin: '15 0 0 0',
            title: 'Subnet',
            layout: { type: 'hbox', align: 'stretch' },
            defaults: { margin: '5 0 0 0' },
            items: [
              {
                xtype: 'container',
                flex: 1,
                layout: { type: 'vbox', align: 'stretch' },
                id: `subnet_container-${crypto_number}`,
                defaults: { allowBlank: false, flex: 1 },
                items: [
                  {
                    xtype: 'textfield',
                    name: 'subnet',
                    fieldLabel: 'Subnet',
                    emptyText: 'ex) 10.40.0.0',
                    enableKeyEvents: true,
                    bind: update ? item.subnet : '',
                    flex: 3,
                    vtype: 'IPAddress',
                    listeners: {
                      change: {
                        fn: 'insertSubnet',
                        me: me,
                        id: id
                      }
                    }
                  },
                  {
                    xtype: 'combobox',
                    name: 'net_mask',
                    valueField: 'value',
                    displayField: 'display',
                    fieldLabel: 'Net Mask',
                    bind: {
                      value: update ? item.net_mask : ' '
                    },
                    flex: 4,
                    listeners: {
                      afterRender: {
                        fn: 'renderNetMask',
                        me: me,
                        update: update,
                        item: update ? item : ''
                      },
                      change: {
                        fn: 'changeNetMask',
                        me: me,
                        crypto_number: crypto_number,
                        id: id
                      }
                    }
                  },
                  {
                    xtype: 'textfield',
                    name: 'router',
                    fieldLabel: 'Router',
                    emptyText: 'ex) 10.40.0.1',
                    bind: update ? item.router : '',
                    flex: 3,
                    vtype: 'IPAddress',
                    enableKeyEvents: true,
                    listeners: {
                      afterRender: {
                        fn: 'renderRouter',
                        me: me,
                        update: update,
                        item: update ? item : ''
                      }
                    }
                  },
                  {
                    xtype: 'button',
                    iconCls: 'x-fa fa-cog',
                    tooltip: 'IP Pool 설정',
                    text: 'IP Pool 설정',
                    handler: 'show_ip_list'
                  },
                  {
                    xtype: 'button',
                    iconCls: 'x-fa fa-minus',
                    tooltip: 'Subnet 삭제',
                    text: 'Subnet 삭제',
                    handler: 'deleteCell'
                  }
                ],
                listeners: {
                  afterRender: {
                    fn: 'setNetMask',
                    me: me,
                    update: update,
                    item: update ? item : ''
                  }
                }
              }
              // {
              //   xtype: 'container',
              //   flex: 1,
              //   layout: {
              //     type: 'vbox',
              //     align: 'stretch'
              //   },
              //   default: {
              //     flex: 1
              //   },
              //   items: [
              //     {
              //       xtype: 'combobox',
              //       valueField: 'value',
              //       fieldLabel: '옵션 템플릿',
              //       name: 'template',
              //       displayField: 'text',
              //       allowBlank: true,
              //       listeners: {
              //         change: function(cp, value) {
              //           const { items } = cp.getStore().getData();
              //           const targetData = items.find(item => {
              //             const { data } = item;
              //             return data.value === value;
              //           });
              //           const {
              //             data: { options }
              //           } = targetData;
              //           const optionsTemplates = options
              //             .map(item => `${item.value} => ${item.optionValue}`)
              //             .join('\n');
              //           const {
              //             items: { items: container }
              //           } = cp.up();
              //           const display = container[1];
              //           display.setValue(optionsTemplates);
              //         }
              //       },
              //       bind: {
              //         store: '{templateStore}'
              //       }
              //     },
              //     {
              //       xtype: 'textarea',
              //       readOnly: true,
              //       fieldLabel: '옵션 템플릿 값',
              //       name: 'optionValue',
              //       allowBlank: true
              //     }
              //   ]
              // }
            ]
          }
        ]
      });
    },
    deleteCell: function(cp) {
      const me = this;

      const vm = me.getViewModel();

      const id = cp
        .up()
        .up()
        .up().id;
      vm.get('form_id_set').delete(parseInt(id.split('-')[1]));
      delete vm.get('optionData')[id];
      delete vm.get('optionSaveFlag')[id];
      me.lookupReference('form').remove(id, true);
    },

    onBoxReady: function() {
      const me = this;

      const vm = me.getViewModel();

      const update = vm.get('update');
      vm.set('optionData', {});
      vm.set('optionSaveFlag', {});
      if (update === true) {
        const subnet = vm.get('subnet');
        for (item of subnet) {
          me.addCell('update');
        }
      } else {
        vm.set('network', null);
        me.addCell();
      }
    },
    get_ip_pool: function(subnet, mask) {
      const me = this;

      const vm = me.getViewModel();

      const netMaskMap = vm.get('netMaskMap');

      const ip_address = `${subnet}/${netMaskMap[mask]}`;

      const ip_address_m = ip_address.match(/\d+/g);

      const broad_cast = ip_address_m
        .slice(0, 4)
        .reduce((a, o) => me.unSinged(+a << 8) + +o);

      const convert_mask = me.unSinged(~0 << (32 - +ip_address_m[4]));
      const start = me.getIp(me.unSinged(broad_cast & convert_mask));

      const end = me.getIp(me.unSinged(broad_cast | ~convert_mask));
      return { start: start.split('.'), end: end.split('.') };
    },

    setMask: function(value, classA, classB, classC, cmb, store) {
      if (value < 127) {
        for (const item of classC.concat(classB, classA)) {
          store.data.push(item);
        }
        cmb.setStore(store);
      } else if (value < 192) {
        for (const item of classC.concat(classB)) {
          store.data.push(item);
        }
        cmb.setStore(store);
      } else {
        for (const item of classC) {
          store.data.push(item);
        }
        cmb.setStore(store);
      }
    },

    show_ip_list: function(cp) {
      const me = this;
      const pointer = cp
        .up()
        .up()
        .up();
      const id = pointer.id;
      const crypto_number = parseInt(id.split('-')[1]);
      const form = me.lookupReference(id);
      if (form.isValid()) {
        const router = pointer.getValues().router;
        const vm = me.getViewModel();
        const update = vm.get('update');
        const current_subnet = pointer.getValues().subnet;
        const current_net_mask = pointer.getValues().net_mask;
        const current_router = pointer.getValues().router;
        const available_ip = me.get_ip_pool(current_subnet, current_net_mask);
        const ip_list = me.getIPList(me, available_ip.start, available_ip.end);
        let option_list = [];
        let expand_option_list = [];
        me.ipFilter(me, crypto_number, id);
        if (
          me.isContainRouter(
            me,
            current_subnet,
            current_net_mask,
            current_router
          )
        ) {
          return false;
        }
        if (vm.get('optionSaveFlag')[id]) {
          option_list = vm.get('optionData')[id];
        } else {
          option_list = [];
        }
        if (option_list.length > 0) {
          if (me.deleteRouter(me, current_router, option_list)) {
            return false;
          }
        }
        for (const option of option_list) {
          const start = option.range_start.split('.');

          const end = option.range_end.split('.');
          if (start[2] === end[2]) {
            expand_option_list.push(option);
          } else {
            const ip_list = me.getIPList(me, start, end, 'expand', option);
            expand_option_list = expand_option_list.concat(ip_list);
          }
        }

        const broad_cast = available_ip.end.toString().replace(/,/g, '.');
        new src.view.ipmanagement.ippoolsetting.configwindow.subnetwindow.SubnetWindow(
          {
            animateTarget: cp,
            viewModel: {
              data: {
                data: ip_list,
                subnet: current_subnet,
                option: expand_option_list,
                router: router,
                update: update,
                broad_cast: broad_cast
              }
            },
            width: 1000,
            height: 800,
            modal: true,
            autoScroll: true,
            listeners: {
              save: function(data) {
                vm.get('optionData')[id] = data;
                vm.get('optionSaveFlag')[id] = true;
              }
            }
          }
        ).show();
      } else {
        Ext.Msg.alert('알림', '유효하지 않은 양식입니다.');
      }
    },
    setNetMask: (cp, arg) => {
      const me = arg.me;
      const vm = me.getViewModel();
      const update = arg.update;
      const item = arg.item;
      vm.set(
        'disabled_flag',
        !vm.get('ipv4_pattern').test(update ? item.subnet : '')
      );
      if (!vm.get('disabled_flag')) {
        me.setMask(
          parseInt(vm.get('subnet_value').split('.')[0]),
          vm.get('classA'),
          vm.get('classB'),
          vm.get('classC'),
          cp.items.items[1],
          vm.get('mask')
        );
      }
    },
    renderRouter: (cp, arg) => {
      const me = arg.me;

      const update = arg.update;

      const vm = me.getViewModel();

      const item = arg.item;
      vm.set(
        'disabled_flag',
        !vm.get('ipv4_pattern').test(update ? item.subnet : '')
      );
      if (!vm.get('disabled_flag')) {
        cp.setDisabled(false);
      } else {
        cp.setDisabled(true);
      }
    },
    insertSubnet: (cp, value, event, arg) => {
      const me = arg.me;

      const vm = me.getViewModel();
      vm.set('disabled_flag', !vm.get('ipv4_pattern').test(value));
      if (!vm.get('disabled_flag')) {
        cp.up().items.items[1].setDisabled(false);
        cp.up().items.items[2].setDisabled(false);
        me.setMask(
          parseInt(value.split('.')[0]),
          vm.get('classA'),
          vm.get('classB'),
          vm.get('classC'),
          cp.up().items.items[1],
          vm.get('mask')
        );
      } else {
        cp.up().items.items[1].setDisabled(true);
        cp.up().items.items[2].setDisabled(true);
      }
    },
    renderNetMask: function(cp, arg) {
      const me = arg.me;
      const update = arg.update;
      const vm = me.getViewModel();
      const item = arg.item;
      vm.set(
        'disabled_flag',
        !vm.get('ipv4_pattern').test(update ? item.subnet : '')
      );
      if (!vm.get('disabled_flag')) {
        cp.setDisabled(false);
      } else {
        cp.setDisabled(true);
      }
    },
    changeNetMask: (cp, value, event, arg) => {
      const me = arg.me;
      const id = arg.id;
      const subnet = cp.up().items.items[0];
      if (value.replace(/ /gi, '') !== '') {
        dht.ajax(
          '/ip_pool_setting/write_subnet',
          {
            subnet: subnet.value,
            net_mask: value
          },
          function(response) {
            if (response.success) {
              subnet.setValue(response.ip);
            } else {
              Ext.Msg.alert('오류', '네트워크 이상');
            }
          }
        );
      }
      me.ipFilter(me, id, subnet.value, value);
    },
    ipFilter: (me, id, subnet, netMask) => {
      const vm = me.getViewModel();
      if (vm.get('optionSaveFlag')[id] === true) {
        const available_ip = me.get_ip_pool(subnet, netMask);
        const filtered_option = [];
        for (const option of vm.get('optionData')[id]) {
          const range_start = option.range_start.split('.');
          const range_end = option.range_end.split('.');
          let is_contain = true;
          for (const [start, end, pool_start, pool_end] of me.zip([
            range_start,
            range_end,
            available_ip.start,
            available_ip.end
          ])) {
            if (
              !(
                parseInt(start) >= parseInt(pool_start) &&
                parseInt(end) <= parseInt(pool_end)
              )
            ) {
              is_contain = false;
            }
          }
          if (is_contain) {
            filtered_option.push(option);
          }
        }
        vm.get('optionData')[id] = filtered_option;
      }
    },
    isContainRouter: (me, subnet, netMask, router) => {
      const available_ip = me.get_ip_pool(subnet, netMask);

      const start = available_ip.start
        .slice(0, 3)
        .concat(parseInt(available_ip.start[3]) + 1);

      const end = available_ip.end
        .slice(0, 3)
        .concat(parseInt(available_ip.end[3]) - 1);
      if (router === available_ip.start.join('.')) {
        Ext.Msg.alert(
          '알림',
          `${subnet}의 라우터: ${router}의 주소가 서브넷과 동일합니다. `
        );
        return true;
      }
      if (router === available_ip.end.join('.')) {
        Ext.Msg.alert(
          '알림',
          `${subnet}의 라우터: ${router}의 주소가 서브넷의 브로드캐스트와 동일합니다. `
        );
        return true;
      }
      for (const [ip, pool_start, pool_end] of me.zip([
        router.split('.'),
        available_ip.start,
        available_ip.end
      ])) {
        if (
          !(
            parseInt(ip) >= parseInt(pool_start) &&
            parseInt(ip) <= parseInt(pool_end)
          )
        ) {
          Ext.Msg.alert(
            '알림',
            `서브넷 ${subnet}의 라우터 ${router}가 서브넷 범위(${start.join(
              '.'
            )} ~ ${end.join('.')})에 없습니다. `
          );
          return true;
        }
      }
    },
    deleteRouter: (me, router, option) => {
      for (const item of option) {
        const range_start = item.range_start.split('.');

        const range_end = item.range_end.split('.');

        const split_router = router.split('.');
        const router_Decimal = me.convertFromIPtoDecimal(split_router);

        const start_Decimal = me.convertFromIPtoDecimal(range_start);

        const end_Decimal = me.convertFromIPtoDecimal(range_end);
        if (router_Decimal >= start_Decimal && router_Decimal <= end_Decimal) {
          Ext.Msg.alert(
            '알림',
            `선택하신 라우터 ${router} 는 설정하신 사용 IP Range (${range_start.join(
              '.'
            )} ~ ${range_end.join('.')}) 에 포함됩니다.<br>
                        라우터 IP를 재 설정해주세요.`
          );
          return true;
        }
      }
    },
    convertFromIPtoDecimal: ip =>
      ((+ip[0] * 256 + +ip[1]) * 256 + +ip[2]) * 256 + +ip[3],
    unSinged: n => n >>> 0,
    getIp: n =>
      [
        (n >>> 24) & 0xff,
        (n >>> 16) & 0xff,
        (n >>> 8) & 0xff,
        (n >>> 0) & 0xff
      ].join('.'),
    zip: rows => rows[0].map((_, c) => rows.map(row => row[c])),
    convertBinary: (ip, addZeros) => {
      let ipSnippet = '';
      for (const snippet of ip) {
        ipSnippet += addZeros((parseInt(snippet) >>> 0).toString(2), 8);
      }
      return ipSnippet;
    },
    addZeros: (num, digit) => {
      let zero = '';
      num = num.toString();
      if (num.length < digit) {
        for (let i = 0; i < digit - num.length; i++) {
          zero += '0';
        }
      }
      return zero + num;
    },
    getIPList: (me, start, end, type, option) => {
      const ipList = [];

      const diffList = [];
      for (const [value1, value2] of me.zip([start, end])) {
        const difference = parseInt(value2) - parseInt(value1);
        diffList.push(difference);
      }
      for (let i = 0; i <= diffList[1]; i++) {
        for (let j = 0; j <= diffList[2]; j++) {
          if (type === 'expand') {
            for (let k = 0; k < parseInt(end[3]); k += 255) {
              const ip =
                `${start[0]}.` +
                `${parseInt(start[1]) + i}.` +
                `${parseInt(start[2]) + j}.` +
                `${!(i === 0 && j === 0) ? k : parseInt(start[3]) + k}`;
              ipList.push({
                range_start: ip,
                range_end:
                  j !== diffList[2]
                    ? `${ip.substr(0, ip.lastIndexOf('.'))}.255`
                    : `${ip.substr(0, ip.lastIndexOf('.'))}.${parseInt(
                        end[3]
                      )}`,
                type: option.type,
                class: option.class,
                mac: option.mac
              });
            }
          } else {
            for (let k = 0; k < parseInt(end[3]); k += parseInt(end[3])) {
              const ip =
                `${start[0]}.` +
                `${parseInt(start[1]) + i}.` +
                `${parseInt(start[2]) + j}.` +
                `${parseInt(start[3]) + k}`;
              ipList.push({
                start: ip,
                end: `${ip.substr(0, ip.lastIndexOf('.'))}.${parseInt(end[3])}`,
                used: ''
              });
            }
          }
        }
      }
      return ipList;
    }
  }
);
