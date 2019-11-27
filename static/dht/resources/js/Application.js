function ajax(url, params, callback, opts) {
    var base = {
        url: url,
        timeout: 600000, // 10min
        method: 'POST',
        params: params,
        success: function(response) {
            var obj = Ext.decode(response.responseText);
            callback(obj);
        },
        failure: function(response) {
        }
    };
    if(opts) {
        for(var o in opts) {
            base[o] = opts[o];
        }
    }
    return Ext.Ajax.request(base);
}

function check_passwd(passwd) {
    var ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var NUMBER = '1234567890';
    var SPECIAL = '!@#$%^&*()-_+=[]{}';

    if(stringByteSize(passwd)>16) {
        return {error: 'TOOLENGTH'};
    }

    if(PASSWD_LENGTH>passwd.length) {
        return {error: 'LENGTH'};
    }

    var types = [];
    if(PASSWD_ALPHA == 'on') {
        types.push(ALPHA);
    }
    if(PASSWD_NUMBER == 'on') {
        types.push(NUMBER);
    }
    if(PASSWD_SPECIAL == 'on') {
        types.push(SPECIAL);
    }

    for(var i = 0; i<types.length; i++) {
        var found = false;
        for(var j = 0; j<passwd.length; j++) {
            if(types[i].indexOf(passwd.charAt(j))> -1) {
                found = true;
                break;
            }
        }

        if(!found) {
            if(types[i] == ALPHA) {
                return {error: 'ALPHA'}
            } else if(types[i] == NUMBER) {
                return {error: 'NUMBER'}
            } else if(types[i] == SPECIAL) {
                return {error: 'SPECIAL'}
            }
        }
    }

    return {error: ''};
}

function charByteSize(ch) {
    if(ch == null || ch.length == 0) {
        return 0;
    }

    var charCode = ch.charCodeAt(0);

    if(charCode<=0x00007F) {
        return 1;
    } else if(charCode<=0x0007FF) {
        return 2;
    } else if(charCode<=0x00FFFF) {
        return 3;
    } else {
        return 4;
    }
}

function stringByteSize(str) {
    if(str == null || str.length == 0) {
        return 0;
    }

    var size = 0;
    for(var i = 0; i<str.length; i++) {
        size += charByteSize(str.charAt(i));
    }
    return size;
}

function modalShow(message) {
    $('#alert-form-message').text(message);
    $('#successModal').modal()
}

function closeWindow() {
    window.close()
}

function apply() {
    var csrf = $('#csrfmiddlewaretoken').val(),
        userID = $("#userID").val(),
        passwd1 = $("#passwd").val(),
        passwd2 = $("#passwd2").val(),
        name = $("#name").val(),
        email = $("#email").val(),
        tel = $("#phone").val(),
        depart = $("#depart").val(),
        desc = $("#desc").val(),
        admin = $("#admin").val(),
        ip = $("#ip").val();

    if(!userID) {
        modalShow('사용자 ID를 입력하세요.');
        return false;
    }
    if(!passwd1) {
        modalShow('암호를 입력하세요.');
        return false;
    }
    if(passwd1 != passwd2) {
        modalShow('암호 확인이 다릅니다.');
        return false;
    }
    if(!name) {
        modalShow('이름을 입력하세요.');
        return false;
    }
    if(!tel) {
        modalShow('휴대전화를 입력하세요.');
        return false;
    }
    if(!email) {
        modalShow('이메일을 입력하세요.');
        return false;
    }
    if(!depart) {
        modalShow('부서를 입력하세요.');
        return false;
    }
    if(!desc) {
        modalShow('신청사유를 입력하세요.');
        return false;
    }
    if(!admin) {
        modalShow('관리자여부를 선택하세요.');
        return false;
    }

    var fields = [
        ['userID', 'ID를'],
        ['passwd', '비밀번호를'],
        ['passwd2', '비밀번호 확인을'],
        ['name', '이름을'],
        ['phone', '휴대폰번호를'],
        ['email', '이메일을'],
        ['depart', '부서를'],
        ['desc', '신청사유를']
    ];
    for(var i = 0; i<fields.length; i++) {
        var o = fields[i][0];
        if(!$('#' + o).val()) {
            modalShow('필수항목을 모두 입력해주세요.');
            $('#' + o).focus();
            return;
        }
    }

    if(userID == 'packet' || userID == 'session' || userID == 'process') {
        modalShow('시스템 예약어(session, process, packet)는 사용할 수 없습니다.');
        $('#userID').val('');
        $('#userID').focus();
        return;
    }
    if(/[^(a-zA-Z0-9_@\.\-)]/.test(userID)) {
        modalShow('ID를 영문자/숫자/_으로 입력해주세요.');
        $('#userID').val('');
        $('#userID').focus();
        return;
    }
    if(userID.length<6) {
        modalShow('ID를 6자리 이상 입력해주세요.');
        $('#userID').focus();
        return;
    }
    if(passwd1 != passwd2) {
        modalShow('비밀번호가 일치하지 않습니다.');
        $('#passwd1').val('');
        $('#passwd2').val('');
        $('#passwd1').focus();
        return;
    }

    var result = check_passwd(passwd1);
    if(result.error) {
        if(result.error == 'LENGTH') {
            modalShow('비밀번호를 ' + PASSWD_LENGTH + '자리 이상 입력해주세요');
        } else if(result.error == 'ALPHA' || result.error == 'NUMBER' || result.error == 'SPECIAL') {
            var buf = '';
            if(PASSWD_ALPHA == 'on') {
                buf += '알파벳';
            }
            if(PASSWD_NUMBER == 'on') {
                if(buf != '') {
                    buf += ' + ' + '숫자';
                } else {
                    buf += '숫자';
                }
            }
            if(PASSWD_SPECIAL == 'on') {
                if(buf != '') {
                    buf += ' + ' + '특수문자';
                } else {
                    buf += '특수문자';
                }
            }
            modalShow('비밀번호를 ' + buf + ' (을)를 포함한 문자열로 입력해주세요');
        }
        return;
    }

    tel = isValidPhoneNumber(tel);
    if(!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3,4})[-. ]?([0-9]{4})$/.test(tel)) {
        modalShow('올바른 휴대폰번호가 아닙니다.');
        $('#phone').focus();
        return;
    }

    if(!isValidEmail(email)) {
        modalShow('올바른 이메일주소가 아닙니다.');
        $('#email').val('');
        $('#email').focus();
        return;
    }

    if(ip && !isValidIP(ip)) {
        modalShow('올바른 IP주소가 아닙니다.');
        $('#ip').val('');
        $('#ip').focus();
        return;
    }

    // var checkedRootNode = getCheckedRoot(groupTreeStore.getRootNode());
    // if(checkedRootNode == null) {
    //     alert('lang.application.select_group');
    //     return;
    // }

    $.ajax({
        url: '/application/create',
        type: "POST",
        data: {
            userID: userID,
            passwd: CryptoJS.SHA512(passwd1).toString(),
            name: name,
            email: email,
            phone: tel,
            depart: depart,
            desc: desc,
            admin: admin,
            ip: ip,
            status: 0,
            csrfmiddlewaretoken: csrf
        },
        success: function(data, textStatus, jqXHR) {
            if(data.success) {
                $('#finishModal').modal();
                // closeWindow();
            } else if(data.success === false) {
                modalShow('생성 실패 :' + data.msg);
                return false;
            } else {
                modalShow('서버와 네트워크 상태 이상');
                return false;
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            modalShow('서버와 네트워크 상태 이상');
        }
    });
}

// var CHECKED_ROOT_NODE = null;
// function getCheckedRoot(node) {
//     CHECKED_ROOT_NODE = null;
//
//     function findChecked(node) {
//         node.eachChild(function(n) {
//             if(n.hasChildNodes())
//                 findChecked(n);
//             if(n.get('checked')) {
//                 CHECKED_ROOT_NODE = n.data.id;
//                 return false;
//             }
//         });
//     }
//
//     findChecked(node);
//     return CHECKED_ROOT_NODE;
// }


function isValidPhoneNumber(originTel) {
    var telnumber = '';
    var localNum = ["02", "031", "032", "033", "041", "042", "043", "051", "052", "053", "054", "055", "061", "062", "063", "064", "012", "015", "070", "010", "011", "016", "017", "018", "019", "0502"];
    var tel1 = "";
    var tel2 = '';
    var tel3;
    var i;

    for(i = 0; i<originTel.length; i++) {
        if(originTel.charCodeAt(i)>47 && originTel.charCodeAt(i)<58) {
            telnumber = telnumber + originTel.charAt(i);
        }
    }

    for(i = 0; i<localNum.length; i++) {
        if(telnumber.substr(0, 3) == localNum[i]) {
            tel1 = telnumber.substr(0, 3);
            tel2 = telnumber.substr(3, telnumber.length);
            break;
        }
    }
    if(tel1 == "") {
        for(i = 0; i<localNum.length; i++) {
            if(telnumber.substr(0, 2) == localNum[i]) {
                tel1 = telnumber.substr(0, 2);
                tel2 = telnumber.substr(2, telnumber.length);
                break;
            }
        }
    }
    if(tel1 == "") {
        for(i = 0; i<localNum.length; i++) {
            if(telnumber.substr(0, 4) == localNum[i]) {
                tel1 = telnumber.substr(0, 4);
                tel2 = telnumber.substr(4, telnumber.length);
                break;
            }
        }
    }
    if(tel1 == "" || tel2.length>8) {
        return false;
    }
    tel3 = tel2.substr(tel2.length - 4, 4);
    tel2 = tel2.substr(0, tel2.length - 4);
    return tel1 + "-" + tel2 + "-" + tel3;
}

function isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function isValidIP(ip) {
    var expUrl = /^(1|2)?\d?\d([.](1|2)?\d?\d){3}$/;
    return expUrl.test(ip);
}

// function load_groups() {
//     var lastGroup = '';
//     var panel = new Ext.tree.TreePanel({
//         id: 'groupTree',
//         renderTo: 'groups',
//         width: 400,    //'400px',
//         height: 220,   //'220px',
//         autoScroll: true,
//         store: groupTreeStore,
//         rootVisible: false,
//         useArrows: false,
//         collapsed: false,
//         listeners: {
//             checkchange: function(node, checked, opts) {
//                 function getRootNode(node) {
//                     var curNode = node;
//                     while(true) {
//                         if(curNode.parentNode) {
//                             curNode = curNode.parentNode;
//                             if(curNode.data.id == '-1') {
//                                 return curNode;
//                             }
//                         } else {
//                             return curNode;
//                         }
//                     }
//                 }
//
//                 function setCheckedSubnodes(root, val) {
//                     root.set('checked', val);
//                     root.eachChild(function(n) {
//                         if(n.hasChildNodes()) {
//                             setCheckedSubnodes(n, val);
//                         }
//                         n.set('checked', val);
//                     });
//                 }
//
//                 var record = node.data;
//                 if(lastGroup == record.id) {
//                     setCheckedSubnodes(node, checked);
//                 } else {
//                     setCheckedSubnodes(getRootNode(node), false);
//                     setCheckedSubnodes(node, true);
//                 }
//
//                 if(checked) {
//                     lastGroup = record.id;
//                 } else {
//                     lastGroup = '';
//                 }
//             }
//         }
//     });
// }
//
// function onSdateChange(datefield, newValue, oldValue) {
//     Ext.getCmp('block_edate').setMinValue(newValue);
//     if(Ext.getCmp('block_sdate').getRawValue() == Ext.getCmp('block_edate').getRawValue()) {
//         Ext.getCmp('block_etime').setMinValue(Ext.getCmp('block_stime').getValue());
//         Ext.getCmp('block_stime').setMaxValue(Ext.getCmp('block_etime').getValue());
//     } else {
//         Ext.getCmp('block_etime').setMinValue('00:00');
//         Ext.getCmp('block_stime').setMaxValue('23:00');
//     }
// }
//
// function onEdateChange(datefield, newValue, oldValue) {
//     Ext.getCmp('block_sdate').setMaxValue(newValue);
//     if(Ext.getCmp('block_sdate').getRawValue() == Ext.getCmp('block_edate').getRawValue()) {
//         Ext.getCmp('block_etime').setMinValue(Ext.getCmp('block_stime').getValue());
//         Ext.getCmp('block_stime').setMaxValue(Ext.getCmp('block_etime').getValue());
//     } else {
//         Ext.getCmp('block_etime').setMinValue('00:00');
//         Ext.getCmp('block_stime').setMaxValue('23:00');
//     }
// }
//
// function onStimeChange(timefield, newValue, oldValue) {
//     if(Ext.getCmp('block_sdate').getRawValue() == Ext.getCmp('block_edate').getRawValue()) {
//         Ext.getCmp('block_etime').setMinValue(newValue);
//     } else {
//         Ext.getCmp('block_etime').setMinValue('00:00');
//     }
// }
//
// function onEtimeChange(timefield, newValue, oldValue) {
//     if(Ext.getCmp('block_sdate').getRawValue() == Ext.getCmp('block_edate').getRawValue()) {
//         Ext.getCmp('block_stime').setMaxValue(newValue);
//     } else {
//         Ext.getCmp('block_stime').setMaxValue('23:00');
//     }
// }

/*Ext.define('AccountPanel', {
 extend: 'Ext.panel.Panel',
 initComponent: function() {
 var me = this;
 var REQUIRED = '<img src="/static/img/icons/bullet_red.png" style= "vertical-align:bottom;">';
 var REQUIRED_bule = '<img src="/static/img/icons/bullet_blue.png" style= "vertical-align:bottom;">';

 me.user_id = new Ext.form.TextField({
 fieldLabel: '사용자ID',
 beforeLabelTextTpl: REQUIRED,
 maskRe: /[a-zA-Z0-9_]+/,
 fieldStyle: "ime-mode: disabled;",
 maxLength: 21,
 enforceMaxLength: true
 });
 me.pw = new Ext.form.TextField({
 fieldLabel: '비밀번호',
 beforeLabelTextTpl: REQUIRED,
 maxLength: 16,
 enforceMaxLength: true
 //inputType: "password"
 });
 me.pwC = new Ext.formTextField({
 fieldLabel: '비밀번호',
 beforeLabelTextTpl: REQUIRED,
 maxLength: 16,
 enforceMaxLength: true,
 margin: '0 0 0 10',
 validator: function(value) {
 return (value == me.pw.getValue()) ?  true : false;
 }
 });
 me.name = new Ext.form.TextField({
 fieldLabel: '이름',
 beforeLabelTextTpl: REQUIRED,
 maxLength: 32,
 enforceMaxLength: true
 });
 me.phone = new Ext.form.TextField({
 fieldLabel: '휴대폰번호',
 beforeLabelTextTpl: REQUIRED,
 maskRe: /[0-9\-]+/,
 fieldStyle: "ime-mode: disabled;",
 maxLength: 23,
 enforceMaxLength: true
 });
 me.email = new Ext.form.TextField({
 fieldLabel: '메일',
 beforeLabelTextTpl: REQUIRED,
 fieldStyle: "ime-mode: disabled;",
 maxLength: 75,
 enforceMaxLength: true,
 });
 me.depart = new Ext.form.TextField({
 fieldLabel: '소속',
 beforeLabelTextTpl: REQUIRED,
 maxLength: 64,
 enforceMaxLength: true
 });
 me.desc = new Ext.form.TextField({
 fieldLabel: '신청사유',
 beforeLabelTextTpl: REQUIRED_blud,
 maxLength: 128
 });
 me.ip = new Ext.form.TextField({
 fieldLabel: 'IP Addr 제한',
 beforeLabelTextTpl: REQUIRED_blue,
 maxLength: 15,
 readOnly: true
 });
 me.admin = new Ext.form.ComboBox({
 fieldLLabel: '관리자여부',
 beforeLabelTextTpl: REQUIRED,
 store: new Ext.date.ArrayStore({
 fields: ['value', 'display']
 data: [[ 0, '일반'], [2, '그룹관리자'], [1, '최고관리자']]
 }),
 value: '',
 valueField: 'value',
 displayField: 'display',
 editable: false,
 triggerAction: 'all'
 });
 me.theme = new Ext.form.ComboBox({
 fieldLabel: '테마',
 beforeLabelTextTpl: REQUIRED_blue,
 store: new Ext.date.ArrayStore({
 fields: ['value', 'display']
 data: [[ 'blue', 'Blue'], ['gray', 'Gray']]
 }),
 value: '',
 valueField: 'value',
 displayField: 'display',
 editable: false,
 triggerAction: 'all'
 });
 me.language = new Ext.form.ComboBox({
 fieldLable: 'Language',
 beforeLabelTextTpl: REQUIRED_blue,
 store: new Ext.date.ArrayStore({
 fields: ['value', 'display']
 data: [[ 'ko', '한국어'], ['en', 'English']]
 }),
 value: '',
 valueField: 'value',
 displayField: 'display',
 editable: false,
 triggerAction: 'all'
 });

 me.items = [
 {
 xtype: 'container',
 anchor: '100%',
 layout: { type: 'vbox' , align: 'stretch'},
 items: [
 me.user_id, me.pw, me.pwC,
 me.name, me.name, me.phone,
 me.email, me.depart, me.desc,
 me.ip, me.admin, me.theme, me.language
 ]
 }
 ];
 me.callParent(arguments);
 }
 });*/

//var groupTreeStore =Ext.create('Ext.data.TreeStore', {
//    proxy: { type: 'ajax', url: 'application/group_list'},
//    root: {text: '전체', id: 0, checked: fasle, expanded: true }
//});
//Ext.onReady(function() {
//    var ap = new AcccountPanel({});
//    load_groups();
//});

// EOF
