/**
 * Created by jjol on 16. 10. 11.
 */

Ext.define("dhcp.view.logmanagement.LogManagement", {
  extend: "Ext.Container",
  requires: [
    "Ext.tab.Panel",
    "dhcp.view.logmanagement.LogManagementController",
    "dhcp.view.logmanagement.LogManagementModel",
    "dhcp.view.logmanagement.worklog.WorkLog",
    "dhcp.view.logmanagement.eventlog.EventLog"
  ],
  xtype: "logmanagement",
  viewModel: { type: "logmanagement" },
  controller: "logmanagement",

  layout: "fit",
  items: [
    {
      xtype: "container",
      layout: { type: "hbox", align: "stretch" },
      defaults: { margin: 10 },
      items: [
        {
          xtype: "tabpanel",
          flex: 1,
          cls: "dhcp__tab_panel",
          items: [{ xtype: "worklog" }, { xtype: "eventlog" }]
        }
      ]
    }
  ]
});
