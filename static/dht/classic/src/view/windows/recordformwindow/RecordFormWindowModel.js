/**
 * Created by zen on 19. 5. 13.
 */
Ext.define('dhcp.view.windows.recordformwindow.RecordFormWindowModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.recordformwindow',

  requires: [
    'Ext.form.field.ComboBox',
    'Ext.form.field.Number',
    'Ext.form.field.Text',
    'dht.ux.plugin.ClearButton'
  ],

  stores: {},

  data: {
    record_type: 'A',
    forwardForm: [
      {
        xtype: 'textfield',
        emptyText: 'HOST',
        bind: '{record_host}',
        name: 'record_host'
      },
      {
        xtype: 'combo',
        emptyText: '레코드 유형',
        flex: 1,
        reference: 'recordType',
        name: 'record_type',
        bind: {
          store: '{recordTypeStore}',
          value: '{record_type}'
        },
        plugins: ['clearbutton']
      },
      {
        xtype: 'textfield',
        emptyText: 'VALUE',
        reference: 'recordValue',
        bind: '{record_value}',
        name: 'record_value'
      }
    ],
    reverseForm: [
      {
        xtype: 'numberfield',
        emptyText: 'HOST',
        bind: '{record_host}',
        name: 'record_host',
        minValue: 0,
        maxValue: 255
      },
      {
        xtype: 'combo',
        emptyText: '레코드 유형',
        flex: 1,
        reference: 'recordType',
        name: 'record_type',
        bind: {
          store: '{recordTypeStore}',
          value: '{record_type}'
        },
        plugins: ['clearbutton']
      },
      {
        xtype: 'textfield',
        emptyText: 'VALUE',
        reference: 'recordValue',
        vtype: 'domain',
        bind: '{record_value}',
        name: 'record_value'
      }
    ]
  }
});
