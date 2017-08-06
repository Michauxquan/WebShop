function selectAll(e) {
    jQuery(":checkbox[id!='" + e + "']").attr("checked", jQuery("#" + e).attr("checked")) 
} 
function validateUserName(e) {
    var t = /^[0-9a-zA-Z]{6,16}$/;
    return t.exec(e) ? !0 : !1 
} 
function validateUserPss(e) {
    var t = /^[0-9a-zA-Z]{6,16}$/;
    return t.exec(e) ? (t = /^\d+$/, t.exec(e) ? !1 : (t = /^[a-zA-Z]+$/, t.exec(e) ? !1 : (t = /(.)\1{2,}/, t.exec(e) ? !1 : !0))) : !1 
} 
function validateNickName(e) {
    var t = /^(.){2,8}$/;
    return t.exec(e) ? !0 : !1 
} 
function validateBranch(e) {
    var t = /^(.){2,24}$/;
    return t.exec(e) ? !0 : !1 
} 
function validateInputDate(e) {
    if (e = e.trim(), "" == e || null == e) return !0;
    var t = e.split(" "), r = new Array, n = new Array;
    if (-1 != t[0].indexOf("-")) r = t[0].split("-");
    else if (-1 != t[0].indexOf("/")) r = t[0].split("/");
    else {
        if (t[0].toString().length < 8) return !1;
        r[0] = t[0].substring(0, 4), r[1] = t[0].substring(4, 6), r[2] = t[0].substring(6, 8) 
    } 
    if ((void 0 == t[1] || null == t[1]) && (t[1] = "00:00:00"), -1 != t[1].indexOf(":") && (n = t[1].split(":")), void 0 != r[2] && ("" == r[0] || "" == r[1])) return !1;
    if (void 0 != r[1] && "" == r[0]) return !1;
    if (void 0 != n[2] && ("" == n[0] || "" == n[1])) return !1;
    if (void 0 != n[1] && "" == n[0]) return !1;
    r[0] = void 0 == r[0] || "" == r[0] ? 1970 : r[0], r[1] = void 0 == r[1] || "" == r[1] ? 0 : r[1] - 1, r[2] = void 0 == r[2] || "" == r[2] ? 0 : r[2], n[0] = void 0 == n[0] || "" == n[0] ? 0 : n[0], n[1] = void 0 == n[1] || "" == n[1] ? 0 : n[1], n[2] = void 0 == n[2] || "" == n[2] ? 0 : n[2];
    var a = new Date(r[0], r[1], r[2], n[0], n[1], n[2]);
    return a.getFullYear() == r[0] && a.getMonth() == r[1] && a.getDate() == r[2] && a.getHours() == n[0] && a.getMinutes() == n[1] && a.getSeconds() == n[2] ? !0 : !1 
} 
function JsRound(e, t, r) {
    if (t = parseInt(t, 10), 0 > t) return t = Math.abs(t), Math.round(Number(e) / Math.pow(10, t)) * Math.pow(10, t);
    if (0 == t) return Math.round(Number(e));
    if (e = Math.round(Number(e) * Math.pow(10, t)) / Math.pow(10, t), r && 1 == r) {
        var n = "", a = 0;
        for (e = e.toString(), -1 == e.indexOf(".") && (e = "" + e + ".0"), data = e.split("."), a = data[1].length;
        t > a;
        a++) n += "0";
        return "" + e + n 
    } 
    return e 
} 
function checkMoney(e) {
    e.val() = formatFloat(e.val())
} 
function checkWithdraw(e, t, r) {
    e.val() = formatFloat(e.val()), parseFloat(e.val()) > parseFloat(r) && (alert("输入金额超出了可用余额"), e.val() = r), jQuery("#" + t).html(changeMoneyToChinese(e.val()))
} 
function checkOnlineWithdraw(e, t) {
    e.val() = formatFloat(e.val()), parseFloat(e.val()) > parseFloat(t) && (alert("提现金额超出了可提现限额"), e.val() = t, e.focus());
} 
function checkIntWithdraw(e, t, r) {
    e.val() = parseInt(e.val(), 10), e.val() = isNaN(e.val()) ? 0 : e.val(), parseFloat(e.val()) > parseFloat(r) && (alert("输入金额超出了可用余额"), e.val() = parseInt(r, 10)), jQuery("#" + t).html(changeMoneyToChinese(e.val())) 
} 
function moneyFormat(e) {
    if (sign = Number(e) < 0 ? "-" : "", e = e.toString().replace(/[^\d.]/g, ""), e = e.replace(/\.{2,}/g, "."), e = e.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."), -1 != e.indexOf(".")) {
        var t = e.split(".");
        t[0] = t[0].substr(0, 15);
        var r = [];
        for (i = t[0].length;i > 0;i -= 3) r.unshift(t[0].substring(i, i - 3));
        t[0] = r.join(","), e = t[0] + "." + t[1].substr(0, 4) 
    } 
    else {
        e = e.substr(0, 15);
        var r = [];
        for (i = e.length;i > 0;i -= 3) r.unshift(e.substring(i, i - 3));
        e = r.join(",") + ".0000" 
    } 
    return sign + e 
} 
function formatFloat(e) {
    if (e = e.replace(/^[^\d]/g, ""), e = e.replace(/[^\d.]/g, ""), e = e.replace(/\.{2,}/g, "."), e = e.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."), -1 != e.indexOf(".")) {
        var t = e.split(".");
        e = t[0].substr(0, 15) + "." + t[1].substr(0, 2) 
    } 
    else e = e.substr(0, 15);
    return e 
} 
function changeMoneyToChinese(e) {
    var t, r, a, o = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"), u = new Array("", "拾", "佰", "仟"), s = new Array("", "万", "亿", "兆"), l = new Array("角", "分", "厘", "毫"), c = "整", f = "元", d = 1e15, g = "";
    if ("" == e) return "";
    if (e = parseFloat(e), e >= d) return alert("超出最大处理数字"), "";
    if (0 == e) return g = o[0] + f + c;
    if (e = e.toString(), -1 == e.indexOf(".") ? (t = e, r = "") : (a = e.split("."), t = a[0], r = a[1].substr(0, 4)), parseInt(t, 10) > 0) {
        for (zeroCount = 0, IntLen = t.length, i = 0;IntLen > i;i++) n = t.substr(i, 1), p = IntLen - i - 1, q = p / 4, m = p % 4, "0" == n ? zeroCount++ : (zeroCount > 0 && (g += o[0]), zeroCount = 0, g += o[parseInt(n)] + u[m]), 0 == m && 4 > zeroCount && (g += s[q]);
        g += f 
    } 
    if ("" != r) for (decLen = r.length, i = 0;decLen > i;i++) n = r.substr(i, 1), "0" != n && (g += o[Number(n)] + l[i]);
    return "" == g ? g += o[0] + f + c : "" == r && (g += c), g 
} 
function replaceHTML(e) {
    return e = e.replace(/[&]/g, "&amp;"), e = e.replace(/[\"]/g, "&quot;"), e = e.replace(/[\']/g, "&#039;"), e = e.replace(/[<]/g, "&lt;"), e = e.replace(/[>]/g, "&gt;"), e = e.replace(/[ ]/g, "&nbsp;") 
} 
function replaceHTML_DECODE(e) {
    return e = e.replace(/&amp;/g, "&"), e = e.replace(/&quot;/g, '"'), e = e.replace(/&#039;/g, "'"), e = e.replace(/&lt;/g, "<"), e = e.replace(/&gt;/g, ">"), e = e.replace(/&nbsp;/g, " ") 
} 
function copyToClipboard(e, t) {
    if (txt = jQuery("#" + e).html(), window.clipboardData) window.clipboardData.clearData(), window.clipboardData.setData("Text", txt);
    else if (-1 != navigator.userAgent.indexOf("Opera")) window.location = txt;
    else if (window.netscape) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect") 
        } 
        catch (r) {
            return alert("您的firefox安全限制限制您进行剪贴板操作，请在地址栏中输入“about:config”将“signed.applets.codebase_principal_support”设置为“true”之后重试"), !1 
        } 
        var n = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
    if (!n) return;
        var a = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    if (!a) return;
        a.addDataFlavor("text/unicode");
        var i = new Object, i = (new Object, Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString)), o = txt;
        i.data = o, a.setTransferData("text/unicode", i, 2 * o.length);
        var u = Components.interfaces.nsIClipboard;
        if (!n) return !1;
        n.setData(a, null, u.kGlobalClipboard) 
    } 
    t && alert(t + " 复制成功") 
} 
function SetCookie(e, t, r) {
    var n = new Date;
    n.setTime(n.getTime() + 1e3 * r), document.cookie = e + "=" + escape(t) + ";expires=" + n.toUTCString() 
} 
function getCookie(e) {
    var t = document.cookie.match(new RegExp("(^| )" + e + "=([^;]*)(;|$)"));
    return null != t ? unescape(t[2]) : null 
} 
function delCookie(e) {
    var t = new Date;
    t.setTime(t.getTime() - 1);
    var r = getCookie(e);
    null != r && (document.cookie = e + "=" + r + ";expires=" + t.toGMTString()) 
} 
function addItem(e, t, r) {
    var n = new Option(t, r);
    e.options.add(n) 
} 
function SelectItem(e, t) {
    for (var r = e.options.length, n = 0;r > n;n++) if (e.options[n].val() == t) return e.options[n].selected = !0, !0 
} 
function Combination(e, t) {
    if (t = parseInt(t), e = parseInt(e), 0 > t || 0 > e) return !1;
    if (0 == t || 0 == e) return 1;
    if (t > e) return 0;
    t > e / 2 && (t = e - t);
    var r = 0;
    for (i = e;i >= e - t + 1;i--) r += Math.log(i);
    for (i = t;i >= 1;i--) r -= Math.log(i);
    return r = Math.exp(r), Math.round(r) 
} 
function GetCombinCount(e, t) {
    if (t > e) return 0;
    if (e == t || 0 == t) return 1;
    if (1 == t) return e;
    for (var r = 1, n = 1, a = 0;t > a;a++) r *= e - a, n *= t - a;
    return r / n 
} 
function movestring(e) {
    for (var t = "", r = "01", n = "", a = "", i = "", o = !1, u = !1, s = 0;s < e.length;s++) 0 == o && (t += e.substr(s, 1)), 0 == o && "1" == e.substr(s, 1) ? u = !0 : 0 == o && 1 == u && "0" == e.substr(s, 1) ? o = !0 : 1 == o && (n += e.substr(s, 1));
    t = t.substr(0, t.length - 2);
    for (var l = 0;l < t.length;l++) "1" == t.substr(l, 1) ? a += t.substr(l, 1) : "0" == t.substr(l, 1) && (i += t.substr(l, 1));
    return t = a + i, t + r + n 
} 
function getCombination(e, t) {
    {
        var r = e.length, n = new Array;
        new Array 
    } 
    if (t > r) return n;
    if (1 == t) return e;
    if (r == t) return n[0] = e.join(","), n;
    for (var a = "", i = "", o = "", u = 0;t > u;u++) a += "1", i += "1";
    for (var s = 0;r - t > s;s++) a += "0";
    for (var l = 0;t > l;l++) o += e[l] + ",";
    n[0] = o.substr(0, o.length - 1);
    var c = 1;
    for (o = "";a.substr(a.length - t, t) != i;) {
        a = movestring(a);
        for (var l = 0;
        r > l;
        l++) "1" == a.substr(l, 1) && (o += e[l] + ",");
        n[c] = o.substr(0, o.length - 1), o = "", c++ 
    } 
    return n 
} 
function showCombination(e, t) {
    for (var r = e.split(","), n = getCombination(r, t), a = "<tr><td>号码组合如下：</td></tr>", i = 1;
    i <= n.length;
    i++) a += "<tr><td>" + i + ":" + n[i - 1] + "</td></tr>";
    return a 
} 
String.prototype.trim = function () {
    return this.replace(/(?:^\s*)|(?:\s*$)/g, "")
};
var TimeCountDown = function (e, t, r) {
    function n(e) {
        return Number(e) < 10 ? "0" + Number(e) : Number(e) 
    } 
    function a(e) {
        return e > 0 ? {
            day: Math.floor(e / 86400), hour: Math.floor(e % 86400 / 3600), minute: Math.floor(e % 3600 / 60), second: Math.floor(e % 60) 
        } 
       : {
           day: 0, hour: 0, minute: 0, second: 0 
       } 

    } 
    var i = parseInt(t, 10), o = window.setInterval(function () {
        0 >= i && (clearInterval(o), r && "function" == typeof r && r());
        var t = a(i--);
        document.getElementById(e).innerHTML = "" + (t.day > 0 ? t.day + "天 " : "") + (t.hour > 0 ? n(t.hour) + ":" : "") + n(t.minute) + ":" + n(t.second)
    }, 1e3)};
