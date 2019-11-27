Ext.define('dht.view.setting.general.GeneralController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.general',

    uses: [
        // 'dht.view.setting.general.SoundWindow',
        // 'dht.view.setting.general.TemplateWindow'
    ],

    onMenuSelect: function(tree, record) {
        var me = this,
            mainPanel = me.lookupReference('mainPanel'),
            target = me.lookupReference(record.get('name') + 'Panel');

        mainPanel.ownerCt.ownerCt.ownerCt.ownerCt.ownerCt.setScrollY(target.getLocalY());
    },

    // onEditTemplate: function(button) {
    //     var vm = button.getViewModel(),
    //         mode = vm.get('mode');
    //
    //     dht.ajax('/setting/readTemplate', { key: mode }, function(r) {
    //         if (r.success) {
    //             new dht.view.setting.general.TemplateWindow({
    //                 title: '템플릿', // mail, sms
    //                 viewModel: {
    //                     data: {
    //                         mode: mode,
    //                         hideSubject: (mode.indexOf('sms') > -1),
    //                         formData: r.data
    //                     }
    //                 }
    //             }).show();
    //         } else {
    //             Ext.Msg.alert('오류', r.errmsg);
    //         }
    //     });
    // },

    // onEditSound: function() {
    //     new dht.view.setting.general.SoundWindow({
    //     }).show();
    // },

    onSave: function() {
        var me = this,
            form = me.lookupReference('form'),
            params = form.getValues();

        if(form.isValid()) {
            form.submit({
                url: '/setting/update',
                params: params,
                success: function() {
                    SESSION_IDLE_TIME = parseInt(params.session_idle_time);
                    SESSION_IDLE_TIME_CHECK = parseInt(params.session_idle_time_check);
                    dhcp.app.getMainView().getController().sessionLogout();
                    Ext.Msg.alert('확인', '설정 정보가 저장되었습니다.');
                },
                failure: function(form, action) {
                    Ext.Msg.alert('오류', action.result.errmsg);
                }
            });
        }
    },

    onRefresh: function() {
        var me = this,
            form = me.lookupReference('form').getForm();
        form.load({url: '/setting/read'});
    },

    // onPeriodChange: function() {
    //     var me = this,
    //         form = me.lookupReference('form'),
    //         backup_date = me.lookupReference('backup_date'),
    //         backup_days_group = me.lookupReference('backup_days_group'),
    //         backup_interval = form.getValues().backup_interval;
    //
    //     if (backup_interval == 'monthly') {
    //         backup_date.show();
    //     } else {
    //         backup_date.hide();
    //     }
    //     if (backup_interval == 'weekly') {
    //         backup_days_group.show();
    //     } else {
    //         backup_days_group.hide();
    //     }
    // },

    // onChangeBackup: function(combo, newVal) {
    //     var me = this,
    //         ip = me.lookupReference('backup_ip'),
    //         port = me.lookupReference('backup_port'),
    //         path = me.lookupReference('backup_path'),
    //         userid = me.lookupReference('backup_userid'),
    //         passwd = me.lookupReference('backup_passwd');
    //
    //     if (newVal != 'none') {
    //         if (newVal == 'ftp') {
    //             port.setValue('21');
    //         } else if (newVal == 'sftp') {
    //             port.setValue('22');
    //         } else {
    //             port.setValue('');
    //         }
    //         ip.setDisabled(false);
    //         port.setDisabled(false);
    //         path.setDisabled(false);
    //         userid.setDisabled(false);
    //         passwd.setDisabled(false);
    //     } else { // disabled
    //         ip.setDisabled(true);
    //         port.setDisabled(true);
    //         path.setDisabled(true);
    //         userid.setDisabled(true);
    //         passwd.setDisabled(true);
    //     }
    // },

    onSessionChange: function(radio) {
        var me = this,
            session_idle_time = me.lookupReference('session_idle_time');

        session_idle_time.setDisabled(radio.getValue());
        if(radio.getValue()) {
            session_idle_time.setValue(0);
        } else {
            session_idle_time.setValue(1800);
        }
    },

    onActivate: function() {
        this.onRefresh();
    }
});
