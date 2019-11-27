/**
 * Created by jjol on 16. 7. 14.
 */

Ext.define('dht.view.common.SearchButton', {
    extend: 'Ext.button.Button',

    xtype: 'searchbutton',

    ui: 'searchButton',
    margin: '0 0 0 10',
    iconCls: 'x-fa fa-search',
    width: 100,
    text: '조회'
});