Ext.define('dhcp.overrides.grid.column.Column', {
    override: 'Ext.grid.column.Column',

    style: 'text-align: center;',
    menuDisabled: true,
    sortable: false,
    // sortalbe 이 빌드 할 때 오류를 발생하기 때문에 아래 코드가 필요함,
    beforeRender: function () {
        var me = this,
            rootHeaderCt = me.getRootHeaderCt();
        if (rootHeaderCt && rootHeaderCt.grid) {
            me.callParent();
        }
        else {
            me.callSuper();
        }
    }
});