Ext.define('dht.view.setting.general.GeneralModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.general',

    requires: [
        'Ext.data.TreeStore',
        'Ext.data.proxy.Ajax',
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json',
        'dht.model.Base'
    ],

    stores: {
        menuStore: {
            type: 'tree',
            model: 'Base',
            proxy: {type: 'memory'},
            data: [
                {
                    name: 'threshold',
                    text: '기본설정',
                    iconCls: 'x-fa fa-cogs',
                    expanded: true,
                    leaf: false,
                    children: [
                        {name: 'session', text: '세션설정', iconCls: 'x-fa fa-cog', leaf: true},
                        {name: 'auth', text: '사용자인증', iconCls: 'x-fa fa-cog', leaf: true},
                        {name: 'passwd', text: '비밀번호 정책', iconCls: 'x-fa fa-cog', leaf: true}
                    ]
                }
            ]
        },
        soundStore: {
            model: 'Base',
            proxy: {
                type: 'ajax',
                url: '/combo/alarmsound',
                reader: {type: 'json', rootProperty: 'data', totalProperty: 'totalCount'}
            },
            autoLoad: false
        }
    }
});
