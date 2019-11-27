/**
 * Created by zen on 19. 4. 25.
 */
Ext.define(
  'dhcp.view.windows.ippoolsettingwindow.IPPoolSettingWindowController',
  {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ippoolsettingwindow',
    config: {
      totalPages: 3
    },
    /**
     * Called when the view is created
     */
    init: function() {
      const me = this;
      const viewModel = me.getViewModel(); // Get the viewModel to update the data
      const nextButton = me.lookupReference('nextButton');
      const multiplier = 100 / me.getTotalPages(); // Th multiplier used in calculating the progress
      nextButton.addCls('bg_info');
      viewModel.setData({ progress: multiplier / 100 });
    },

    /*
     * next button click method
     * */
    setIPGrid: function() {
      const viewModel = this.getViewModel();
      const data = viewModel.get('data');
      const store = viewModel.getStore('ipGridStore');
      store.getProxy().setData(data);
      store.loadPage(1);
    },

    onNext: async function(button) {
      const me = this; // Allows access to main scope in deep functions
      const viewModel = me.getViewModel(); // Get the viewModel to update the data
      const mainForm = me.lookupReference('main_form'); // Get the main form
      let index = me.getIndex(mainForm); // Get the current card index to be used in advancing the pages
      const multiplier = 100 / me.getTotalPages(); // Th multiplier used in calculating the progress
      let form;
      const wizard = me.getView();
      switch (index) {
        case 0:
          /*
           * This is how each form page is checked before advancing to the next page
           * */

          form = me.lookupReference('start');
          if (form.isValid()) {
            const {
              items: { items }
            } = form;
            const router = items.find(item => item.name === 'router');
            const isValidRouterIP = await this.getIsValidRouterIP(
              viewModel.get('subnet'),
              router.getValue(),
              viewModel.get('broadcastAddress')
            );
            if (!isValidRouterIP) {
              return Ext.Msg.alert('알림', '라우터 IP가 허용 범위 밖입니다.');
            }
            index += 1; // Increase the index by 1
            mainForm.setActiveItem(index); // Change the main form to the next page
            /*
             * Updating the viewModel data config to enable the prev button and set the current progress
             * */
            const data = {
              prevButton: false,
              progress: (multiplier * (index + 1)) / 100
            };
            viewModel.setData(data);
          }
          return true;
        case 1:
          form = me.lookupReference('intermediate');
          if (form.isValid()) {
            index += 1;
            mainForm.setActiveItem(index);
            viewModel.setData({
              progress: (multiplier * (index + 1)) / 100
            });
          }
          button.removeCls('bg_info');
          viewModel.setData({
            progress: (multiplier * (index + 1)) / 100,
            nextButtonText: '저장', // Last page of the form change the button text to 'submit'
            nextButtonIconCls: 'x-fa fa-save',
            nextButtonUserCls: 'bg_create'
          });
          return true;
        case 2:
          {
            const mask = new Ext.LoadMask({
              msg: 'Please wait...',
              target: wizard
            });
            mask.show();
            mask.destroy();
          }

          return true;
        default:
          return true;
      }
    },
    /*
     * prev button click method
     * */
    onPrev: function() {
      const me = this;
      const viewModel = me.getViewModel();
      const mainForm = me.lookupReference('main_form');
      const index = me.getIndex(mainForm);
      const multiplier = 100 / me.getTotalPages(); // Th multiplier used in calculating the progress
      mainForm.setActiveItem(index - 1); // Return to the previous form page

      switch (index) {
        case 1:
          /*
           * If you go back to the first page of the form the prev button is disabled
           * */
          viewModel.setData({
            prevButton: true,
            progress: (multiplier * index) / 100
          });
          break;

        case 2:
          viewModel.setData({
            nextButtonText: '다음', // Leaving last page of form change the button text to 'next'
            progress: (multiplier * index) / 100,
            nextButtonIconCls: 'x-fa fa-chevron-right',
            nextButtonUserCls: 'bg_info'
          });
          break;
        default:
          break;
      }
    },
    /*
     * Gets the current form page index.  The first card of a card layout is 0
     * */
    getIsValidRouterIP: async function(start, ip, end) {
      try {
        const response = await dht.ajax(
          '/ip_pool_setting/get_is_valid_router_ip',
          {
            start,
            ip,
            end
          }
        );
        if (response.success) {
          return response.data;
        }
        return false;
      } catch (e) {
        return Ext.Msg.alert('오류', e);
      }
    },

    getIndex: function(mainForm) {
      const layout = mainForm.getLayout();
      const { activeItem } = layout;
      return mainForm.items.indexOf(activeItem);
    },
    /*
     * The before close method to save progress
     * */
    onBeforeClose: function() {
      const me = this;
      const wizard = me.getView();
      wizard.clearListeners();
      wizard.close();
    },
    onSubnetChange: function(component, value) {
      const {
        items: { items }
      } = component.up();
      const netMask = items.find(item => item.name === 'net_mask');
      if (component.isValid()) {
        this.getViewModel().set('subnet', value);
        const firstNumberOfIP = Number(value.split('.')[0]);
        const data = this.getMask(firstNumberOfIP);
        netMask
          .getStore()
          .getProxy()
          .setData(data);
        netMask.getStore().loadPage(1);
        return netMask.setDisabled(false);
      }
      return netMask.setDisabled(true);
    },

    getMask: function(firstNumberOfIP) {
      const viewModel = this.getViewModel();
      const classA = viewModel.get('classA');
      const classB = viewModel.get('classB');
      const classC = viewModel.get('classC');
      if (firstNumberOfIP < 127) {
        return [...classC, ...classB, ...classA];
      }
      if (firstNumberOfIP < 192) {
        return [...classC, ...classB];
      }

      return [...classC];
    },
    onNetMaskChange: async function(component, value) {
      const {
        items: { items }
      } = component.up();
      const subnet = items.find(item => item.name === 'subnet');
      const router = items.find(item => item.name === 'router');
      if (component.isValid()) {
        try {
          const response = await dht.ajax('/ip_pool_setting/write_subnet', {
            subnet: subnet.getValue(),
            net_mask: value
          });
          if (response.success) {
            subnet.setValue(response.ip);
            const broadcastAddress = await this.getBroadcastAddress(
              response.ip,
              value
            );
            if (broadcastAddress) {
              this.getViewModel().set('broadcastAddress', broadcastAddress);
              return router.setEmptyText(
                `라우터는 ${
                  response.ip
                }와 ${broadcastAddress}의 사이 값으로 지정해야 합니다.`
              );
            }

            return Ext.Msg.alert('오류', '네트워크 이상');
          }
          return Ext.Msg.alert('오류', response.errmsg);
        } catch (e) {
          return Ext.Msg.alert('오류', e);
        }
      }
      return false;
    },
    getBroadcastAddress: async function(ip, mask) {
      try {
        const response = await dht.ajax(
          '/ip_pool_setting/get_broadcast_address',
          {
            ip,
            mask
          }
        );
        if (response.success) {
          return response.data;
        }
        return false;
      } catch (e) {
        return Ext.Msg.alert('오류', e);
      }
    }
  }
);
