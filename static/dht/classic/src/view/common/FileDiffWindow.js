/**
 * Created by jjol on 16. 10. 25.
 */

Ext.define('dht.view.common.FileDiffWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'Ext.button.Button'
    ],

    referenceHolder: true,
    defaultListenerScope: true,

    width: 700,
    height: 600,
    items: [
        {
            xtype: 'component',
            reference: 'diffoutput',
            flex: 1,
            html: '<div id="diffoutput"></div>'
        }
    ],
    buttons: [
        {xtype: 'button', text: '취소', handler: 'onCancel'}
    ],
    listeners: {
        boxready: function() {
            var base = difflib.stringAsLines('aaaaa'),
                newtxt = difflib.stringAsLines('aabaa'),
                sm = new difflib.SequenceMatcher(base, newtxt),
                opcodes = sm.get_opcodes(),
                diffoutputdiv = document.getElementById('diffoutput');

            diffoutputdiv.innerHTML = "";

            diffoutputdiv.appendChild(diffview.buildView({
                baseTextLines: base,
                newTextLines: newtxt,
                opcodes: opcodes,
                baseTextName: "Base Text",
                newTextName: "New Text",
                contextSize: null,
                viewType: 0
            }));
        }
    },

    onCancel: function() {
        this.close();
    }
});
