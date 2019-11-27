/**
 * Created by jjol on 16. 7. 29.
 */

Ext.define('dht.view.common.Math', {
    requires: [],
    uses: [
        'Ext.util.Format'
    ],
    singleton: true,

    // kB (킬로바이트) 1000^1 = 10^3  KB 1024^1 = 2^10 KiB (키비바이트) 2^10
    // MB (메가바이트) 1000^2 = 10^6  MB 1024^2 = 2^20 MiB (메비바이트) 2^20
    // GB (기가바이트) 1000^3 = 10^9  GB 1024^3 = 2^30 GiB (기비바이트) 2^30
    // TB (테라바이트) 1000^4 = 10^12 TB 1024^4 = 2^40 TiB (테비바이트) 2^40
    // PB (페타바이트) 1000^5 = 10^15 PB 1024^5 = 2^50 PiB (페비바이트) 2^50
    // EB (엑사바이트) 1000^6 = 10^18 EB 1024^6 = 2^60 EiB (엑스비바이트) 2^60
    // ZB (제타바이트) 1000^7 = 10^21 ZB 1024^7 = 2^70 ZiB (제비바이트) 2^70
    // YB (요타바이트) 1000^8 = 10^24 YB 1024^8 = 2^80 YiB (요비바이트) 2^80

    /**
     * @param {int} value
     * @param {string, int} unit = kb, mb, gb, tb, pb, kib, mib, gib, tib, pib, auto, number
     * @param {string} mode = int, decimal, natural
     * @param {int} length decimal length
     * @param {bool} flag ture false
     */
    numberUnitConverter: function(value, unit, mode, length, flag) {
        var UNIT_MAP = {
            kb: 'KB', mb: 'MB', gb: 'GB', tb: 'TB', pb: 'PB', eb: 'EB', zb: 'ZB', yb: 'YB',
            kib: 'KiB', mib: 'MiB', gib: 'GiB', tib: 'TiB', pib: 'PiB', eib: 'EiB', zib: 'ZiB', yib: 'YiB'
        };

        unit = unit ? unit : 1024;
        mode = mode ? mode : 'int';
        length = length ? length : 2;

        if(Ext.typeOf(unit) == 'string' && unit != 'auto') {
            value = value / {
                    kb: 1000,
                    mb: 1000000,
                    gb: 1000000000,
                    tb: 1000000000000,
                    pb: 1000000000000000,
                    eb: 1000000000000000000,
                    zb: 1000000000000000000000,
                    yb: 1000000000000000000000000,
                    kib: 1024,
                    mib: 1048576,
                    gib: 1073741824,
                    tib: 1099511627776,
                    pib: 1125899906842624,
                    eib: 1125899906842624 * 1024,
                    zib: 1125899906842624 * 1024 * 1024,
                    yib: 1125899906842624 * 1024 * 1024 * 1024
                }[unit.toLocaleLowerCase()];
        } else if(unit == 'auto') {
            var level = ['yib', 'zib', 'eib', 'pib', 'tib', 'gib', 'mib', 'kib', ''];

            while(1) {
                if(value<unit) {
                    break;
                } else {
                    value = value / unit;
                    level.pop();
                }
            }
            unit = level[level.length - 1];
        } else if(Ext.typeOf(unit) == 'number') {
            value = value / unit;
        }

        var format = '1,000';
        if(length != 0 && mode == 'decimal') {
            format += '.';
            for(var i = 0; i<length; i += 1) {
                format += '0';
            }
        }
        if(mode == 'natural') {
            value = Math.abs(value);
            format = '1,000';
        }

        var val;
        if(flag != false) {
            val = Ext.String.format('{0} {1}', Ext.util.Format.number(value, format), UNIT_MAP[unit]);
        } else {
            val = mode == 'int' || mode == 'natural' ? parseFloat(value.toFixed(0)) : parseFloat(value.toFixed(length));
        }
        return val;
    },
    round: function(value) {
        return value<0 ? Math.round(value * -1) * -1 : Math.round(value);
    }
});

dht.numberUnitConverter = dht.view.common.Math.numberUnitConverter;
dht.round = dht.view.common.Math.round;