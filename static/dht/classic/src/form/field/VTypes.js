// custom Vtype for vtype:'IPAddress'
Ext.define('src.form.field.VTypes', {
  override: 'Ext.form.field.VTypes',

  IPAddress: function(value) {
    return this.IPAddressRe.test(value);
  },
  IPAddressRe: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  IPAddressText: 'Must be a numeric IP address',
  IPAddressMask: /[\d.]/i,

  MacAddress: function(value) {
    return this.MacAddressRe.test(value);
  },
  MacAddressRe: /^([0-9a-fA-F][0-9a-fA-F]){5}[0-9a-fA-F]{2}$/,
  MacAddressText: 'Must be a Mac address',

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
  CheckMacAddressText: '올바른 포맷이 아닙니다.',
  datetime: function(value) {
    return this.datetimeRe.test(value);
  },
  datetimeRe: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  datetimeText: '올바른 포맷이 아닙니다.',
  datetimeMask: /[\d\- :]/,

  IPv6Address: function(value) {
    return this.IPv6AddressRe.test(value);
  },

  IPv6AddressRe: /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9]).){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9]).){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])?)$/,
  IPv6AddressText: 'Must be a IPv6 address',

  password: function(value, field) {
    const passwordValue = field
      .up('form')
      .down('[name=password]')
      .getValue();
    return value === passwordValue;
  },
  passwordText: '패스워드가 일치하지 않습니다.',

  domain: function(value) {
    return this.domainRe.test(value);
  },
  domainRe: /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?.?$/,
  domainText: '도메인 형식이 아닙니다.',

  ThreeLetterIPAddress: function(value) {
    return this.ThreeLetterIPAddressRe.test(value);
  },
  ThreeLetterIPAddressRe: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  ThreeLetterIPAddressText: 'C 클래스의 IP address를 입력해주세요',
  ThreeLetterIPAddressMask: /[\d.]/i,

  TwoLetterIPAddress: function(value) {
    return this.TwoLetterIPAddressRe.test(value);
  },
  TwoLetterIPAddressRe: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.)(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  TwoLetterIPAddressText: 'B 클래스의 IP address를 입력해주세요',
  TwoLetterIPAddressMask: /[\d.]/i,

  RecordName: function(value) {
    return this.RecordNameRe.test(value);
  },
  RecordNameRe: /(^(?!.*-$)(?!-)[a-zA-Z0-9-.]{1,63}$|^@$)/,
  RecordNameText: '올바른 레코드 호스트 형식이 아닙니다.',

  SRVName: function(value) {
    return this.SRVNameRe.test(value);
  },
  SRVNameRe: /(^(?!.*-$)(?!-)[a-zA-Z0-9-._]{1,63}$|^@$)/,
  SRVNameText: '올바른 레코드 호스트 형식이 아닙니다.',

  KoreanDomain: function(value) {
    return this.KoreanDomainRe.test(value);
  },
  KoreanDomainRe: /(^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?.?$)|([\w\d.]*[가-힝].*\.([\w]|[가-힝]){1,3})/,
  KoreanDomainText: '도메인 형식이 아닙니다.'
});
