/**
 * Created by zen on 19. 5. 15.
 */
Ext.define('dhcp.view.windows.cachedomainwindow.CacheDomainWindow', {
  extend: 'Ext.window.Window',

  requires: [
    'Ext.button.Button',
    'Ext.form.Panel',
    'Ext.form.field.Tag',
    'Ext.form.field.Text',
    'Ext.layout.container.VBox',
    'dhcp.view.windows.cachedomainwindow.CacheDomainWindowController',
    'dhcp.view.windows.cachedomainwindow.CacheDomainWindowModel'
  ],

  xtype: 'cachedomainwindow',
  modal: true,
  scrollable: true,
  viewModel: {
    type: 'cachedomainwindow'
  },

  controller: 'cachedomainwindow',

  items: [
    {
      xtype: 'form',
      reference: 'form',
      layout: { type: 'vbox', align: 'stretch' },
      bodyPadding: 10,
      defaults: {
        flex: 1,
        msgTarget: 'under',
        allowBlank: false
      },
      items: [
        {
          xtype: 'textfield',
          vtype: 'KoreanDomain',
          fieldLabel: '도메인',
          name: 'domain'
        },
        {
          xtype: 'tagfield',
          name: 'forwarders',
          editable: true,
          store: {
            data: []
          },
          createNewOnBlur: true,
          createNewOnEnter: true,
          hideTrigger: true,
          validateOnBlur: false,
          valuesField: 'value',
          fieldLabel: 'Forward IP',
          listeners: {
            change: 'onChange'
          }
        }
      ]
    }
  ],
  buttons: [
    { xtype: 'button', text: '저장', handler: 'handleSave' },
    { xtype: 'button', text: '취소', handler: 'handleCancel' }
  ]
});
