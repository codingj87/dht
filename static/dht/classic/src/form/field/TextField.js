Ext.define('dhcp.form.field.TextField', {
  override: 'Ext.form.field.Text',

  setAllowBlank: function(value) {
    this.allowBlank = value;
    // this.validate();
  },

  getAllowBlank: function() {
    return this.allowBlank;
  },

  // setSubmitValue: function(value) {
  //   this.submitValue = value;
  //   // this.validate();
  // },
  // getSubmitValue: function() {
  //   return this.submitValue;
  //   // this.validate();
  // },

  setName: function(value) {
    this.name = value;
    // this.validate();
  },

  getName: function() {
    return this.name;
  },

  setVtype: function(value) {
    this.vtype = value;
    // this.validate();
  },

  getVtype: function() {
    return this.vtype;
  },

  setEmptyText: function(value) {
    this.emptyText = value;
  },
  getEmptyText: function() {
    return this.emptyText;
  }
});
