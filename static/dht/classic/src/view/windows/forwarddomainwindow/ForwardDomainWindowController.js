/**
 * Created by zen on 19. 5. 10.
 */
Ext.define(
  'dhcp.view.windows.forwarddomainwindow.ForwardDomainWindowController',
  {
    extend: 'Ext.app.ViewController',
    alias: 'controller.forwarddomainwindow',

    uses: ['dhcp.view.windows.recordformwindow.RecordFormWindow'],

    /**
     * Called when the view is created
     */
    init: function() {
      const viewModel = this.getView().getViewModel();
      if (viewModel.get('id')) {
        const form = this.lookupReference('form');
        const domainRef = this.lookupReference('domainRef');
        const {
          items: { items }
        } = form;
        const { data } = viewModel;
        items.forEach(item => {
          if (Object.prototype.hasOwnProperty.call(data, item.name)) {
            item.setValue(data[item.name]);
          }
        });
        const store = viewModel.getStore('recordStore');
        const record = viewModel.get('record');
        domainRef.setReadOnly(true);
        store.getProxy().setData(record);
        store.load();
      } else {
        viewModel.set('domain', '');
      }
    },
    getRecordData: function() {
      const { items } = this.lookupReference('grid')
        .getStore()
        .getData();
      return items.map(item => {
        const {
          record_value: recordValue,
          record_type: recordType,
          record_host: recordHost
        } = item.data;
        return {
          record_value: recordValue,
          record_type: recordType,
          record_host: recordHost
        };
      });
    },
    handleSave: async function() {
      const form = this.lookupReference('form');
      const viewModel = this.getView().getViewModel();
      const dataOfRecord = this.getRecordData();

      if (form.isValid()) {
        let url = '/domain/create/';
        const params = { dataOfSOA: form.getValues(), dataOfRecord };

        if (viewModel.get('id')) {
          params.id = viewModel.get('id');
          url = '/domain/update/';
        }

        try {
          const response = await dht.ajax(url, JSON.stringify(params));
          if (response.success) {
            this.getView().fireEvent('save');
            return this.getView().close();
          }
          return Ext.Msg.alert('오류', response.errMsg);
        } catch (e) {
          return Ext.Msg.alert('오류', e);
        }
      }
      return Ext.Msg.alert(
        '알림',
        '작성되지 않거나 잘못된 형식인 항목이 있습니다.'
      );
    },
    handleCancel: function() {
      this.getView().close();
    },
    onCreate: function(cp) {
      const viewModel = this.getView().getViewModel();
      const store = viewModel.getStore('recordStore');
      let recordTypeStore;
      let defaultType;
      if (viewModel.get('workType') === 'forward') {
        recordTypeStore = viewModel.getStore('forwardRecordTypeStore');
        defaultType = 'A';
      } else {
        recordTypeStore = viewModel.getStore('reverseRecordTypeStore');
        defaultType = 'PTR';
      }

      new dhcp.view.windows.recordformwindow.RecordFormWindow({
        animateTarget: cp,
        title: '레코드 생성',
        viewModel: {
          stores: {
            recordTypeStore
          },
          data: {
            record_type: defaultType,
            record_value: '',
            record_host: ''
          }
        },
        listeners: {
          save: function(params) {
            const { items } = store.getData();
            store.getProxy().setData([...items, params]);
            store.load();
          }
        }
      }).show();
    },
    onRemove: function() {
      const grid = this.lookupReference('grid');
      const { id } = grid.getSelection()[0];
      const { items } = grid.getStore().getData();
      const removedData = items.filter(item => item.id !== id);
      grid
        .getStore()
        .getProxy()
        .setData(removedData);
      grid.getStore().load();
    },
    onUpdate: function(cp) {
      const grid = this.lookupReference('grid');
      const data = grid.getSelection()[0].getData();
      const recordTypeStore = this.getView()
        .getViewModel()
        .getStore('forwardRecordTypeStore');

      new dhcp.view.windows.recordformwindow.RecordFormWindow({
        animateTarget: cp,
        title: '레코드 변경',
        viewModel: {
          stores: {
            recordTypeStore
          },
          data
        },
        listeners: {
          save: function(params) {
            const { id } = data;
            const store = grid.getStore();
            const { items } = store.getData();
            const dataWithId = Object.assign({ id }, params);
            const updatedData = items.map(item => {
              if (item.id === id) {
                return dataWithId;
              }
              return item;
            });
            store.getProxy().setData(updatedData);
            store.load();
          }
        }
      }).show();
    }
  }
);
