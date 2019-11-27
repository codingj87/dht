/**
 * Created by go on 15. 12. 9.
 */
Ext.define('dhcp.overrides.picker.Date', {
    override: 'Ext.picker.Date',
    
    fullUpdate: function(date) {
        var me = this;
        me.fireEvent('monthchange', me, date);
        return me.callParent([date]);
    },
    monthYearFormat: 'Y F'
});