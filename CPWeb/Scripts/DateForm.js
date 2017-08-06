Date.prototype.format = function (format) {
        /* 
        * format="yyyy-MM-dd hh:mm:ss"; 
        */
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
            - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
}
//日期字符串转换日期格式
String.prototype.toDate = function (format) {
    var d = new Date();
    d.setTime(this.match(/\d+/)[0]);
    return (!!format) ? d.toString(format) : d;
}

//截取字符串
String.prototype.subString = function (len) {
    if (this.length > len) {
        return this.substr(0, len - 1) + "...";
    }
    return this;
}
//判断字符串是否整数
String.prototype.isInt = function () {
    return this.match(/^(0|([1-9]\d*))$/);
}
//判断字符串是否数字
String.prototype.isDouble = function () {
    return this.match(/^\d+(.\d+)?$/);
}
String.prototype.guid = function () {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (guid = S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
//判断字符串是否只有数字和小数点【金钱数】
String.prototype.isMoneyNumber = function () {
    return this.match(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/);
}
jQuery.fn.addFavorite = function (l, h) {
    return this.click(function () {
        var obj = $(this);
        if ($.browser.msie) {
            window.external.addFavorite(h, l);
        } else if (jQuery.browser.mozilla || jQuery.browser.opera) {
            obj.attr("rel", "sidebar");
            obj.attr("title", l);
            obj.attr("href", h);
        } else {
            alert("请使用Ctrl+D将本页加入收藏夹！");
        }
    });
}; 

function DateDiff(sDate1, sDate2) { //sDate1和sDate2是字符串 yyyy-MM-dd格式 
    var aDate, oDate1, oDate2, iDays, ihours, iminutes, iseconds;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);//转换为MM-dd-yyyy格式 
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    var timeSpan = {};
    var TotalMilliseconds = Math.abs(oDate1 - oDate2);//相差的毫秒数
    timeSpan.Days = parseInt(TotalMilliseconds / 1000 / 60 / 60 / 24);
    timeSpan.TotalHours = parseInt(TotalMilliseconds / 1000 / 60 / 60);
    timeSpan.Hours = timeSpan.TotalHours % 24;
    timeSpan.TotalMinutes = parseInt(TotalMilliseconds / 1000 / 60);
    timeSpan.Minutes = timeSpan.TotalMinutes % 60;
    timeSpan.TotalSeconds = parseInt(TotalMilliseconds / 1000);
    timeSpan.Seconds = timeSpan.TotalSeconds % 60;
    timeSpan.TotalMilliseconds = TotalMilliseconds;
    timeSpan.Milliseconds = TotalMilliseconds % 1000;
    return timeSpan;
}
 /** 
  * @param {} btime 
  * @param {} etime 
  * @param {} type  是否时间戳
  * @returns {} 
  */
 function getdiff(btime, type, etime) {
     btime = btime.replace("年", "/").replace("月", "/").replace("日", "");
     if (type) {
         btime = parseInt(btime.replace("/Date(", '').replace(")/", ''));
     }
     var days = 0;
     var edntime = new Date();
     if (etime != null && etime != '') {
         etime = etime.replace("年", "/").replace("月", "/").replace("日", "");
         if (type) {
             etime = parseInt(etime.replace("/Date(", '').replace(")/", ''));
         }
         edntime = new Date(etime);
     }
     days = edntime.getDate() - new Date(btime).getDate();
     if (days < 1) {
         days = edntime.getHours() - new Date(btime).getHours();
         if (days < 1) {
             days = (edntime.getMinutes() - new Date(btime).getMinutes()) + '分钟';
         } else {
             days = days + '小时';
         }
     } else {
         days = days + '天';
     }
     return days;
 }

 function convertdate(btime, type) {
     btime = btime.replace("年", "/").replace("月", "/").replace("日", "");
     if (type) {
         btime = parseInt(btime.replace("/Date(", '').replace(")/", ''));
     }
     return new Date(btime).format("yyyy-MM-dd");
 }
 function convertdateTostring(btime, type, tformat) {
     btime = btime.replace("年", "/").replace("月", "/").replace("日", "");
     if (type) {
         btime = parseInt(btime.replace("/Date(", '').replace(")/", ''));
     }
     return new Date(btime).format(tformat);
 }
 function getparamsdate(btime, type) {
     btime = btime.replace("年", "/").replace("月", "/").replace("日", "");
     if (type) {
         btime = parseInt(btime.replace("/Date(", '').replace(")/", ''));
     }
     return new Date(btime);
 }
 /*重写alert*/
 window.alert = function (msg, type, url) {
     $("#window_alert").remove();
     var _alter = $("<div id='window_alert' class='alert'></div>");
     var _wrap = $("<div class='alert-wrap'></div>");
     var _wrapIcon = $("<div class='" + (type == 2 ? "alert-icon-warn" : "alert-icon-right") + " iconfont'></div>"),
         _wrapMsg = $("<div class='alert-msg'></div>").html(msg),
         __wrapClose = $("<div class='alert-close right iconfont'></div>");
     _wrap.append(_wrapIcon).append(_wrapMsg).append(__wrapClose);
     _alter.append(_wrap);
     _alter.appendTo("body");

     var left = $(window).width() / 2 - (_alter.width() / 2);
     _alter.offset({ left: left });
     __wrapClose.click(function () {
         _alter.remove();
         if (url) {
             location.href = url;
         }
     });
     setTimeout(function () {
         _alter.remove();
         if (url) {
             location.href = url;
         }
     }, 3000);
 }

 window.confirm = function (msg, confirm, sureBtnTxt, cancel) {
     $("#window_confirm").remove();
     var _layer = $("<div class='confirm-layer'><div>")
     var window_confirm = $("<div id='window_confirm' class='confirm'></div>");
     var _wrap = $("<div class='confirm-wrap'></div>").html(msg);
     var _bottom = $("<div class='confirm-bottom'></div>"),
         _close = $("<div class='close'>取消</div>"),
         _confirm = $("<div class='sure'>" + (sureBtnTxt ? sureBtnTxt : "确认") + "</div>");

     _bottom.append(_close).append(_confirm);
     window_confirm.append(_wrap).append(_bottom);

     _layer.appendTo("body");
     window_confirm.appendTo("body");

     $("input").blur();

     var left = $(window).width() / 2 - (window_confirm.width() / 2);
     window_confirm.offset({ left: left });

     _close.click(function () {
         _layer.remove();
         window_confirm.remove();
         cancel && cancel();
     });
     _confirm.click(function () {
         _layer.remove();
         window_confirm.remove();
         confirm && confirm();
     });
 }