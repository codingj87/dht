/**
 * Created by go on 15. 12. 9.
 */
Ext.define('dhcp.overrides.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',
    displayInfo: true,
    displayMsg: '전체({2}) 중 {0} - {1} 표시',
    emptyMsg: '표시 할 정보가 없습니다.'
});