/**
 * Created by jjol on 16. 10. 27.
 */

Ext.define('dht.view.common.Renderer', {
    requires: [],
    uses: [],
    singleton: true,

    renderNumberInt: function(value) {
        return Ext.util.Format.number(value, '1,000,000,000,000,000,000');
    },
    renderNumberFloat: function(value) {
        return Ext.util.Format.number(value, '1,000,000,000,000,000,000.00');
    },
    renderConverterFloat: function(size) {
        var unitSeq = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z'],
            last = Math.abs(size),
            unit = unitSeq.shift(),
            rest;

        while(true) {
            // rest = last / 1024.0;
            rest = last / 1000.0;
            if(rest<1) {
                break;
            }
            last = rest;
            unit = unitSeq.shift();
        }
        return Ext.String.format('{0} {1}', Ext.util.Format.number(last, '1,000,000,000,000.00'), unit);
    },
    renderConverterInt: function(size) {
        var unitSeq = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z'],
            last = Math.abs(size),
            unit = unitSeq.shift(),
            rest;

        while(true) {
            // rest = last / 1024.0;
            rest = last / 1000.0;
            if(rest<1) {
                break;
            }
            last = rest;
            unit = unitSeq.shift();
        }
        return Ext.String.format('{0} {1}', Ext.util.Format.number(last, '1,000,000,000,000'), unit);
    },
    renderDate: function(value) {
        if(value == null || value == '') {
            return;
        }
        return Ext.Date.format(new Date(value * 1000), 'Y-m-d H:i:s');
    },
    renderDuration: function(value, meta, record) {
        if(value == 0) {
            value = parseInt((new Date().getTime() / 1000) - record.get('ctime'));
        }
        var h = parseInt(value / 3600),
            m = parseInt((value % 3600) / 60),
            s = value % 60,
            str = '';

        if(h>0) {
            str += h>=24 ? Ext.String.format('{0}일 {1}시간', parseInt(h / 24), h % 24) : Ext.String.format('{0}시간', h);
        }
        if(m>0) {
            str += Ext.String.format(' {0}분', m);
        }
        str += Ext.String.format(' {0}초', s<10 ? '0' + s : s);
        return str;
    },
    renderPowerStatus: function(value) {
        return {
            0: '<span style="color: #bb4b39"><i class="fa fa-circle"></i></span> 실행중지',
            1: '<span style="color: #79C447"><i class="fa fa-circle"></i></span> 정상 실행',
            2: '<span style="color: #79C447"><i class="fa fa-circle-o-notch fa-spin"></i></span> 비정상 실행'
        }[value];
    },
    humanSize: function(size) {
        var unitSeq = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB'],
            last = size,
            unit = unitSeq.shift(),
            rest;

        while(true) {
            rest = last / 1024.0;
            if(rest<1) {
                break;
            }
            last = rest;
            unit = unitSeq.shift();
        }
        return Ext.String.format('{0} {1}', parseInt(last), unit);
    },
    humanSizeN: function(size) {
        var unitSeq = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB'],
            last = size,
            unit = unitSeq.shift(),
            rest;

        while(true) {
            rest = last / 1000;
            if(rest<1) {
                break;
            }
            last = rest;
            unit = unitSeq.shift();
        }
        return Ext.String.format('{0} {1}', parseInt(last), unit);
    }
});

dht.renderNumberInt = dht.view.common.Renderer.renderNumberInt;
dht.renderNumberFloat = dht.view.common.Renderer.renderNumberFloat;
dht.renderConverterFloat = dht.view.common.Renderer.renderConverterFloat;
dht.renderConverterInt = dht.view.common.Renderer.renderConverterInt;
dht.renderDate = dht.view.common.Renderer.renderDate;
dht.renderDuration = dht.view.common.Renderer.renderDuration;
dht.renderPowerStatus = dht.view.common.Renderer.renderPowerStatus;
dht.humanSize = dht.view.common.Renderer.humanSize;
dht.humanSizeN = dht.view.common.Renderer.humanSizeN;