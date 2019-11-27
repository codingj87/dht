/**
 * Created by go on 16. 4. 11.
 */
Ext.define('dht.view.common.Util', {
  requires: [],

  uses: ['Ext.util.Cookies'],

  singleton: true,

  ajax: function(url, params, success, failure, opts) {
    const deferred = new Ext.Deferred();
    const base = {
      url: url,
      timeout: 600 * 1000,
      method: 'POST',
      params: params,
      success: function(response) {
        const obj = Ext.decode(response.responseText);
        if (success) {
          success(obj);
        }
        deferred.resolve(obj);
      },
      failure: function(response) {
        if (typeof failure === 'function') {
          failure(response);
        }
        try {
          const obj = Ext.decode(response.responseText);
          deferred.reject(obj);
        } catch (e) {
          deferred.reject(e);
        }
      }
    };
    if (opts) {
      opts.forEach(item => {
        base[item] = item;
      });
    }
    const xhr = Ext.Ajax.request(base);
    const { promise } = deferred;
    promise.xhr = xhr;
    return promise;
  },

  check_passwd: function(
    passwd,
    PASSWD_LENGTH,
    PASSWD_ALPHA,
    PASSWD_NUMBER,
    PASSWD_SPECIAL
  ) {
    var ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var NUMBER = '1234567890';
    var SPECIAL = '!@#$%^&*()-_+=[]{}';

    if (dht.stringByteSize(passwd) > 16) {
      return { error: 'TOOLENGTH' };
    }

    if (PASSWD_LENGTH > passwd.length) {
      return { error: 'LENGTH' };
    }

    var types = [];
    if (PASSWD_ALPHA == 'on') {
      types.push(ALPHA);
    }
    if (PASSWD_NUMBER == 'on') {
      types.push(NUMBER);
    }
    if (PASSWD_SPECIAL == 'on') {
      types.push(SPECIAL);
    }

    for (var i = 0; i < types.length; i++) {
      var found = false;
      for (var j = 0; j < passwd.length; j++) {
        if (types[i].indexOf(passwd.charAt(j)) > -1) {
          found = true;
          break;
        }
      }

      if (!found) {
        if (types[i] == ALPHA) {
          return { error: 'ALPHA' };
        } else if (types[i] == NUMBER) {
          return { error: 'NUMBER' };
        } else if (types[i] == SPECIAL) {
          return { error: 'SPECIAL' };
        }
      }
    }

    return { error: '' };
  },

  // excel -----------------------------------------------------------------------------------------------------------
  stringByteSize: function(str) {
    if (str == null || str.length == 0) {
      return 0;
    }

    var size = 0;
    for (var i = 0; i < str.length; i++) {
      size += dht.charByteSize(str.charAt(i));
    }
    return size;
  },
  charByteSize: function(ch) {
    if (ch == null || ch.length == 0) {
      return 0;
    }

    var charCode = ch.charCodeAt(0);

    if (charCode <= 0x00007f) {
      return 1;
    } else if (charCode <= 0x0007ff) {
      return 2;
    } else if (charCode <= 0x00ffff) {
      return 3;
    } else {
      return 4;
    }
  },

  findColumns: function(depth, columns, data, line, max) {
    var me = this;

    for (var i = 0, l = columns.length; i < l; i += 1) {
      var tempDepth =
        depth == ''
          ? columns[i].text
          : Ext.String.format('{0}%^&{1}', depth, columns[i].text);
      if (columns[i].hasOwnProperty('columns')) {
        max = me.findColumns(
          tempDepth,
          columns[i].columns,
          data,
          line + 1,
          max
        );
      } else {
        if (line + 1 > max) {
          max = line + 1;
        }
        data.push(tempDepth);
      }
    }
    return max;
  },
  getHeader: function(columns) {
    var me = this,
      tempData = [],
      max = 0,
      tempHeader = [],
      header = [],
      temp = [],
      i,
      l;

    max = me.findColumns('', columns, tempData, 0, max);
    for (i = 0, l = tempData.length; i < l; i += 1) {
      temp = tempData[i].split('%^&');
      for (var len = temp.length; len < max; len += 1) {
        temp.push(temp[len - 1]);
      }
      tempHeader.push(temp);
    }

    for (i = 0, l = max; i < l; i += 1) {
      temp = [];
      for (var j = 0, m = tempHeader.length; j < m; j += 1) {
        temp.push(tempHeader[j][i]);
      }
      header.push(temp);
    }
    return header;
  },
  getColumnInfo: function(columns) {
    var data = [];
    for (var i = 0, l = columns.length; i < l; i += 1) {
      data.push([columns[i].text, columns[i].dataIndex, columns[i].width]);
    }
    return data;
  },
  getColumnsData: function(grid) {
    var header = grid.headerCt.config.items,
      columns = grid.getColumns();
    return {
      header: Ext.encode(
        dht.view.common.Util.getHeader(header ? header : columns)
      ),
      columns: Ext.encode(dht.view.common.Util.getColumnInfo(columns))
    };
  },
  excel: function(url, params) {
    var $form = jQuery('<form>')
      .attr('method', 'post')
      .attr('action', url);
    jQuery("<input type='hidden'>")
      .attr('name', 'excel')
      .attr('value', '1')
      .appendTo($form);
    jQuery("<input type='hidden'>")
      .attr('name', 'csrfmiddlewaretoken')
      .attr('value', Ext.util.Cookies.get('csrftoken'))
      .appendTo($form);
    jQuery.each(params, function(name, value) {
      jQuery("<input type='hidden'>")
        .attr('name', name)
        .attr('value', value)
        .appendTo($form);
    });
    $form.appendTo('body');
    $form.submit();
  },
  text: function(url, params) {
    var $form = jQuery('<form>')
      .attr('method', 'post')
      .attr('action', url);
    jQuery("<input type='hidden'>")
      .attr('name', 'text')
      .attr('value', '1')
      .appendTo($form);
    jQuery("<input type='hidden'>")
      .attr('name', 'csrfmiddlewaretoken')
      .attr('value', Ext.util.Cookies.get('csrftoken'))
      .appendTo($form);
    jQuery.each(params, function(name, value) {
      jQuery("<input type='hidden'>")
        .attr('name', name)
        .attr('value', value)
        .appendTo($form);
    });
    $form.appendTo('body');
    $form.submit();
  },
  // excel -----------------------------------------------------------------------------------------------------------

  getLicenseInfo: function() {
    try {
      dht.ajax('/get_license', {}, function(response) {
        Ext.getCmp('id_currentIPCount').setValue(response.IPCOUNT);
        Ext.getCmp('id_licenseCount').setValue(' / ' + response.LICENSE);

        if (parseInt(response.IPCOUNT) > parseInt(response.LICENSE)) {
          Ext.getCmp('id_currentIPCount').setFieldStyle('color: red;');
          Ext.getCmp('id_alertLicenseIcon').setHidden(false);
        } else {
          Ext.getCmp('id_currentIPCount').setFieldStyle('color: #646464;');
          Ext.getCmp('id_alertLicenseIcon').setHidden(true);
        }
      });
    } catch (e) {
      console.log(e);
    }
  },

  // 조회 시 사용자가 입력한 mac 값 체크
  checkSearchMacForm: mac => {
    const macLen = mac.length;

    // #1
    if (/^-$/.test(mac)) {
      // '-'가 있을 때
      if (macLen === 1) {
        // '-' 만 들어올 때
        Ext.Msg.alert('오류', '올바른 mac 값을 입력해주세요.');
        return true;
      } else if (macLen > 17) {
        // '-' 가 있는데 17자리 초과할 때
        Ext.Msg.alert('오류', 'mac 값의 길이가 초과했습니다.');
        return true;
      }
    } else {
      // '-'가 없을 때
      if (macLen > 12) {
        // '-'가 없는데 12자리 초과할 때
        Ext.Msg.alert('오류', 'mac 값의 길이가 초과했습니다.');
        return true;
      }
    }

    // #2
    if (/^[-]{2}$/.test(mac)) {
      // '-'가 2개 연속 있을 때
      Ext.Msg.alert('오류', '올바른 mac 값을 입력해주세요.');
      return true;
    }

    // #3 mac에 포함되지 않는 문자열이 들어올 때
    mac = mac.replace(/-/gi, '');
    for (let m of mac) {
      const ret_m = /^[0-9a-f]$/.test(m);
      if (!ret_m) {
        Ext.Msg.alert('오류', '올바른 mac 값을 입력해주세요.');
        return true;
      }
    }
    return false;
  },

  // 조회 시 사용자가 입력한 ip 값 체크, 0-255 까지의 숫자
  checkSearchIpForm: (ip, type) => {
    ip = ip.split('.');
    let regEx =
      type === 'normal'
        ? /(^[0-9]$|^[1-9][0-9]$|^(1[0-9]{2}|2[0-5]{2})$)/
        : /(^[0-9]$|^[1-9][0-9]$|^(1[0-9]{2}|2[0-5]{2})$|^(\/[0-9]|\/[0-9]{2}))$/;
    for (let i of ip) {
      if (i === '') {
        continue;
      } else {
        const ret_i = regEx.test(i);
        if (!ret_i) {
          Ext.Msg.alert('오류', '올바른 ip 값을 입력해주세요.');
          return true;
        }
      }
    }
    return false;
  }
});

dht.ajax = dht.view.common.Util.ajax;
dht.check_passwd = dht.view.common.Util.check_passwd;
dht.getColumnsData = dht.view.common.Util.getColumnsData;
dht.excel = dht.view.common.Util.excel;
dht.text = dht.view.common.Util.text;
dht.stringByteSize = dht.view.common.Util.stringByteSize;
dht.charByteSize = dht.view.common.Util.charByteSize;
dht.getLicenseInfo = dht.view.common.Util.getLicenseInfo;
dht.checkSearchMacForm = dht.view.common.Util.checkSearchMacForm;
dht.checkSearchIpForm = dht.view.common.Util.checkSearchIpForm;
