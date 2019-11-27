/**
 * Created by jjol on 16. 10. 17.
 */

Ext.define('dht.view.dhcp.settingmanagement.CompareSettingWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.button.Button',
        'Ext.form.FieldSet',
        'Ext.form.Panel',
        'Ext.form.field.Text',
        'Ext.grid.plugin.CellEditing',
        'Ext.layout.container.VBox',
    ],
    title: '설정 비교',
    iconCls: 'x-fa fa-check',
    referenceHolder: true,
    defaultListenerScope: true,
    items: [
        {
            xtype: 'displayfield',
            title: 'after',
            reference: 'after',
            value: '<div id="display"></div>'
        }
    ],
    buttons: [
        {xtype: 'button', text: '닫기', handler: 'onCancel'}
    ],

    onCancel: function () {
        this.close();
    },

    onBoxReady: function() {
        const me = this,
            vm = me.getViewModel(),
            data = vm.data;
        let base = difflib.stringAsLines(data.before);
        let newtxt = difflib.stringAsLines(data.after);
        let sm = new difflib.SequenceMatcher(base, newtxt);
        let opcodes = sm.get_opcodes();
        const height = sm.a.length > sm.b.length ? sm.a.length : sm.b.length;
        const copy = JSON.parse(JSON.stringify(opcodes));
        const add_lines = copy.map(item => {
            if (item[0] === 'insert' || item[0] === 'delete') {
                let before_diff = Math.abs(item[1] - item[2]);
                let after_diff = Math.abs(item[3] - item[4]);
                return before_diff + after_diff;
            } else {
                return 0;
            }
        });
        const sum = add_lines.reduce((a,b) => a + b, 0);
        me.lookupReference('after').setHeight((height + sum) * 22);
        let diffoutputdiv = document.getElementById('display');
        while (diffoutputdiv.firstChild) diffoutputdiv.removeChild(diffoutputdiv.firstChild);
        diffoutputdiv.appendChild(diffview.buildView({
            baseTextLines: base,
            newTextLines: newtxt,
            opcodes: opcodes,
            baseTextName: "Before",
            newTextName: "After",
            contextSize: data.size,
            viewType: 0
        }));
    }

});