/**
 * Created by go on 15. 12. 30.
 */
Ext.define('dhcp.overrides.form.field.VTypes', {
  override: 'Ext.form.field.VTypes',

  datetime: function(value) {
    return this.datetimeRe.test(value);
  },
  datetimeRe: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  datetimeText: '올바른 포맷이 아닙니다.',
  datetimeMask: /[\d\- :]/,

  CheckIPAddress: function(value) {
    return this.CheckIPAddressRe.test(value);
  },
  // CheckIPAddressRe: /^(1|2)?\d?\d([.](1|2)?\d?\d){3}$/,
  CheckIPAddressRe: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])((\/)([0-9]|[1-2][0-9]|3[0-2]){2}){0,1}$/,
  CheckIPAddressText: '올바른 포맷이 아닙니다.',
  // CheckIPAddressMask: /[\d.]/i,

  CheckMacAddress: function(value) {
    return this.CheckMacAddressRe.test(value);
  },
  CheckMacAddressRe: /^([0-9a-fA-F][0-9a-fA-F]){5}[0-9a-fA-F]{2}$/,
  CheckMacAddressText: '올바른 포맷이 아닙니다.'
});
