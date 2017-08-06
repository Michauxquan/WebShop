
 var numArry= ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
 var options1= {
 	           "sanxing1":{"firstNum":"1782-4%","lastNum":"1861.2-0%"},
               "sanxing2":{"firstNum":"297-4%","lastNum":"310.2-0%"},
               "erxing1":{"firstNum":"198-4%","lastNum":"206.8-0%"},
               "erxing2":{"firstNum":"99-4%","lastNum":"103.4-0%"},
               "dingweidan":{"firstNum":"19.8-4%","lastNum":"20.68-0%"},
               "budingwei":{"firstNum":"6.6-4%","lastNum":"6.89-0%"},
               "renxuan1":{"firstNum":"3.9-4%","lastNum":"4.07-0%"},
               "renxuan2":{"firstNum":"9.9-4%","lastNum":"10.34-0%"},
               "renxuan3":{"firstNum":"29.7-4%","lastNum":"31.02-0%"},
               "renxuan4":{"firstNum":"118-4%","lastNum":"123.28-0%"},
               "renxuan5":{"firstNum":"831-4%","lastNum":"867.96-0%"},
               "renxuan6":{"firstNum":"138-4%","lastNum":"144.16-0%"},
               "renxuan7":{"firstNum":"39.6-4%","lastNum":"41.36-0%"},
               "renxuan8":{"firstNum":"14.8-4%","lastNum":"15.46-0%"}
            };
 var arrSelectNum = [], items = [], selectbettnum = '';
 var lottery = {}
 lottery.CPCode;
 lottery.CPName;
 var reg=/^[0-9]*$/;
 $(function() {
     //选号：
     $(".num-select li div.numbers").find("span").click(function() {
         $(this).toggleClass("clicked");
         getsumnum();
     });
     //全大小奇偶清：
     $(".sel-actions").find("span").click(function() {
         $(this).addClass("clicked").siblings().removeClass("clicked");
         var $numbers = $(this).parent().siblings(".numbers");
         $numbers.find("span").removeClass("clicked");
         switch ($(this).index()) {
         case 0:
             $numbers.find("span").addClass("clicked");
             break;
         case 1:
             $numbers.find("span:gt(4)").addClass("clicked");
             break;
         case 2:
             $numbers.find("span:lt(5)").addClass("clicked");
             break;
         case 3:
             $numbers.find("span:odd").addClass("clicked");
             break;
         case 4:
             $numbers.find("span:even").addClass("clicked");
             break;
         }
         getsumnum();
     }); 
     //加1减1：
     $("img[alt='plus']").click(function() {
         var _this = $(this);
         plusormin(_this, 'plus', true);
     });
     $("img[alt='minus']").click(function() {
         var _this = $(this);
         plusormin(_this, 'minus', true);
     });

     //手动修改倍数改变钱数：
     $(".times").keyup(function() {
         var _this = $(this);
         handchange(_this, true);
     });
     $(".times").blur(function() {
         var nums = $(".play-action").find("p span:first-child").text();
         if ($(this).val() == "") {
             $(this).val("1");
             $(this).siblings("p").find("span:last-child").text(nums * ($(this).val()) * 2);
         }
     });

     //追号3个导航：
     $(".chase-action>ul li").click(function() {
         $(this).addClass("chase-action-cur").siblings().removeClass("chase-action-cur");
         $(".lrl-chase select").val("请选择");
         $(".select-table table tbody tr").find("input[type='checkbox']").prop("checked", false);
         $(".totle em").eq(0).text("0");
         $(".totle em").eq(1).text("0");
         $(".select-table table tbody tr").each(function() {
             $(this).find("td").eq(2).find("input").val("0").eq(3).text("&yen;0.00");
             $(this).find("td").eq(3).text("￥0.00");
         })
         switch ($(this).index()) {
         case 0:
             $(".lrl-chase p:nth-child(2)").html('起始倍数：<img src="/modules/images/minus.png" alt="minus" width="27"><input type="text" class="times" value="1" id="bmuch" /><img src="/modules/images/plus.png" alt="plus" width="27">倍<span>最低收益率：<input type="text" value="50" id="profits" />%</span><span>追号期数：</span><input type="text" value="0" id="bettNum" />');
             times();
             break;
         case 1:
             $(".lrl-chase p:nth-child(2)").html('起始倍数：<img src="/modules/images/minus.png" alt="minus" width="27"><input type="text" class="times" value="1" id="bmuch" /><img src="/modules/images/plus.png" alt="plus" width="27">倍<span>追号期数：</span><input type="text" value="0" id="bettNum" />');
             $(".select-table table tbody tr").each(function() {
                 $(this).find("td").eq(2).find("input").val("1");
             });
             break;
         case 2:
             $(".lrl-chase p:nth-child(2)").html('隔&nbsp;<img src="/modules/images/minus.png" alt="minus" width="27"><input type="text" value="1" class="times" id="profits"/><img src="/modules/images/plus.png" alt="plus" width="27">期<span>倍数：</span><input type="text" value="2" id="bmuch" /><span>追号期数：</span><input type="text" value="0" id="bettNum" />');
             $("#bmuch").keyup(function() {
                 var nums = $(this).val();
                 if (!reg.test(nums) || nums == "") {
                     $(this).val("0");
                 } else {
                     if (nums.split("")[0] == "0" && nums.length > 1) {
                         $(this).val(nums.substring(1));
                     }
                     if ($(this).val().length > 5) {
                         $(this).val(parseInt($(this).val().substring(0, 5)));
                     } else if ($(this).val() > 99999) {
                         $(this).val("99999");
                     }
                 }
                 addTimes($("#profits").val(), $("#bmuch").val());
             });
             break;
         }
         BettHtml();
         bindselectnavs();
         $(".totle em").text('0');
         ////加减1倍数：   
         //$(".lrl-chase p:nth-child(2)").find('img').click(function() {
         //    var _this = $(this);
         //    plusormin(_this, _this.attr('alt'), false);
         //    var times3 = $(".lrl-chase .times#bmuch").val();
         //    if (times3) {
         //        if (_this.parents(".chase-action").find(".chase-action-cur").text() == "同倍追号") { //若是同倍追号，所有倍数同时改变
         //            $(".select-table table tbody tr").each(function() {
         //                $(this).find("td").eq(2).find("input").val(times3).change();
         //            });
         //        } else {
         //            $(".select-table table tbody tr:first-child td").eq(2).find("input").val(times3).change();
         //            times();
         //        }
         //    } else {
         //        addTimes($("#profits").val(), $("#bmuch").val());
         //    }
         //    //console.log(times3);
         //});
         ////手动改变 加减的倍数
         //$(".lrl-chase .times").keyup(function() {
         //    //alert(456);
         //    var _this = $(this);
         //    handchange(_this, false);
         //    var times3 = $(".lrl-chase .times#bmuch").val();
         //    if (times3) {
         //        if (_this.parents(".chase-action").find(".chase-action-cur").text() == "同倍追号") {
         //            $(".select-table table tbody tr").each(function() {
         //                $(this).find("td").eq(2).find("input").val(times3).change();
         //            })
         //        } else {
         //            $(".select-table table tbody tr:first-child td").eq(2).find("input").val(times3).change();
         //        }
         //    } else {
         //        addTimes($("#profits").val(), $("#bmuch").val());
         //    }
         //});
         ////手动修改times框失去焦点时，操作利润率追号和同倍追号的下边各tr里的倍数
         //$(".lrl-chase .times").blur(function() {
         //    if ($(this).val() == "") {
         //        $(this).val("1");
         //        var times3 = $(".lrl-chase .times#bmuch").val();
         //        if (times3) {
         //            if (_this.parents(".chase-action").find(".chase-action-cur").text() == "同倍追号") {
         //                $(".select-table table tbody tr").each(function() {
         //                    $(this).find("td").eq(2).find("input").val(times3).change(); //转至change，金额计算处
         //                })
         //            } else {
         //                $(".select-table table tbody tr:first-child td").eq(2).find("input").val(times3).change();
         //            }
         //        } else {
         //            addTimes($("#profits").val(), $("#bmuch").val());
         //        }
         //    }
         //})
         //$("#bettNum").keyup(function() { //追号期数手动输入
         //    var nums = $(this).val();
         //    $(".select-table table tbody tr").find("input[type='checkbox']").prop("checked", false);
         //    if (!reg.test(nums) || nums == "") {
         //        $(this).val("0");
         //    } else {
         //        if (nums.split("")[0] == "0" && nums.length > 1) {
         //            $(this).val(nums.substring(1));
         //        }
         //        $(".select-table table tbody tr:lt(" + nums + ")").find("input[type='checkbox']").prop("checked", true);
         //    }
         //    nums = $(this).val();
         //    $(".totle em").eq(0).text(nums);
         //    $(".select-table table tbody tr input[type='checkbox']").change();
         //});
     });
     bindselectnavs(); 
     //选择追号期数：
     $(".lrl-chase select").change(function () {
         var selOption = $(".lrl-chase select").val();
         if (selOption == '0') {
             $(".totle em").text('0');
             BettHtml();
         }
         var stype = $(".chase-action .chase-action-cur").data('type');
         if (stype == "2") {
             addTimes($("#profits").val(), $("#bmuch").val());
         } else if (stype == "1") {
             $('.select-table table tbody tr input[type="text"]').val($('#bmuch').val());
         }
         $("#bettNum").val(selOption);
         $("#bettNum").keyup();
         BettNumChange();
     }); 
     //发起追号：
     $(".chase-num").find("input[type='button']").click(function() {
         $this = $(this);
         console.log($(".num-selected table tbody tr:first-child").find("td").eq(0).text());
         if ($(".num-selected table tbody tr:first-child").find("td").eq(0).text() != "") {
             $this.toggleClass("up");
             $(".chase-action").toggle();
             if ($this.hasClass("up")) {
                 $this.siblings().find("input[type='checkbox']").prop("checked", true);
             } else {
                 $this.siblings().find("input[type='checkbox']").prop("checked", false);
             }
         } else {
             if ($(".chase-action").css('display') == "none") {
                 $('#basic-dialog-ok').modal({
                     "opacity": 30
                 });
                 $('#basic-dialog-ok').find(".tips-title span.tip1").text("请先添加投注内容");
             } else {
                 $this.toggleClass("up");
                 $(".chase-action").toggle();
                 $this.siblings().find("input[type='checkbox']").prop("checked", false);
             }
             return false;
         }
     });
     //选号入框：
     $(".additems").click(function() { 
         var type = $(this).data('type');
         if ($(this).siblings("p").find("span").eq(0).text() > 0) {
             if ($(".num-selected tbody tr:first-child").find("td").eq(0).text() == "") {
                 $(".num-selected tbody tr:first-child").remove();
             }
             var item = {};
             item.PayFee = $(".play-action p span").eq(1).text();
             item.Num = $(".play-action p span").eq(0).text();
             item.pMuch = $(".play-action .times").val();
             item.TypeName = type;
             if (type.split("_")[1] == "混合组选" || type.split("_")[1] == "组选和值") {
                 item.WinFee = 0;
                 item.RPoint = 1;
                 var msg = "<tr title='" + ('投注模式：' + type + '\n' + '投注信息：' + arrSelectNum) + "'><td width='130'>" + type + "</td><td width='200' style='word-break:break-all;'>" + arrSelectNum + "</td><td width='73.3'>" + item.Num + "注" + "</td><td width='73.3'>" + item.pMuch + "倍" + "</td><td width='73.3'>" + item.PayFee + "元" + "</td><td width='73.3'>0</td><td width='73.3'>100%</td><td width='73.3'><span>删除</span></td></tr>";
                 $(".num-selected tbody").append(msg);
             } else {
                 var tempr = $(".play-action select").find("option:selected").text().split("-");
                 item.WinFee = tempr[0];
                 item.RPoint = (parseFloat(tempr[1].replace('%', '')) / 100).toFixed(2);
                 var msg = "<tr title='" + ('投注模式：' + type + '\n' + '投注信息：' + arrSelectNum) + "'><td width='130'>" + type + "</td><td width='200' style='word-break:break-all;'>" + arrSelectNum + "</td><td width='73.3'>" + item.Num + "注" + "</td><td width='73.3'>" + item.pMuch + "倍" + "</td><td width='73.3'>" + item.PayFee + "元" + "</td><td width='73.3'>" + tempr[0] + "元" + "</td><td width='73.3'>" + tempr[1] + "</td><td width='73.3'><span>删除</span></td></tr>";
                 $(".num-selected tbody").append(msg);
             }
             $(".num-selected table tbody tr td span").unbind('click').bind('click', function() {
                 var index = $(this).parent().parent().index();
                 $('#totalnum').html(parseInt($('#totalnum').html()) - parseInt(items[index].Num));
                 $('#totalfee').html(parseFloat(parseFloat($('#totalfee').html()) - parseFloat(items[index].PayFee)).toFixed(2));
                 items.splice(index, 1);
                 if ($(".num-selected tbody tr").length == 1) {
                     $(".num-selected table tbody").html("<tr><td width='96.25'></td><td width='96.25'></td><!-- <td></td> --><td width='96.5'></td><td width='193' title='暂无投注项'>暂无投注项</td><td width='96.5'></td><td width='96.5'></td><td width='96.5'></td></tr>");
                 } else {
                     $(this).parent().parent().remove();
                     lvhide();
                 }
             });
             $('#totalnum').html(parseInt(item.Num) + parseInt($('#totalnum').html()));
             $('#totalfee').html(parseFloat(parseFloat(item.PayFee) + parseFloat($('#totalfee').html())).toFixed(2));
             $(".play-action .times").val("1");
             $(".play-section textarea").val("");
             $(this).siblings("p").find("span").text("0");
             $(".num-select span").removeClass("clicked");
             item.CPCode = lottery.CPCode;
             item.CPName = lottery.CPName;
             item.IssueNum = $('#issueslt').val();
             var typeid = (typeof ($('.all-ways .all-ways-cur')) != 'undefined' && typeof ($('.all-ways .all-ways-cur').data('sid')) != 'undefined') ? $('.all-ways .all-ways-cur').data('sid') : $('.navs .navs-cur').data('sid');
             item.Type = typeid;
             item.Content = JSON.stringify(arrSelectNum);
             items.push(item);
             lvhide();
         } else {
             $('#basic-dialog-ok')
                 .modal({
                     "opacity": 30
                 });
             $('#basic-dialog-ok').find(".tips-title span.tip1").text("号码选择不完整，请重新选择");
             return false;
         }
     }); 
     //清空选号：
     $(".num-selected table tfoot tr td a").click(function() {
         $("body").append("<div class='cover-layer'></div>");
         $(".alert1").show().css("z-index", "10001");
         $(".alert1 p .btn").eq(0).unbind("click").bind("click", function () {
             $(".num-selected table tbody").html("<tr><td width='96.25'></td><td width='96.25'></td><!-- <td></td> --><td width='96.5'></td><td width='193' title='暂无投注项'>暂无投注项</td><td width='96.5'></td><td width='96.5'></td><td width='96.5'></td></tr>");
             items = [];
             lvhide();
             $('#totalnum').html("0");
             $('#totalfee').html("0.00");
             $(".alert1").hide();
             $(".cover-layer").remove();
             return;
         });
     });
     //弹出框操作：(清空所有，立即投注，)
     $(".alert1 h3 img,.alert1 p .btn:last-child").click(function() {
         $(".alert1").hide();
         $(".cover-layer").remove();
         if ($(".alert1 p:last-child span").length != 0) {
             $(".alert1 p:last-child span").remove();
         }
         $(".alert1").css({ "width": "300px", "height": "160px", "top": "40%" });
         $(".alert1 h3+p").html('<img src="/modules/images/tips.png" width="40"><span>是否清空确认区中所有投注内容？</span>').css("text-align", "center");
         $(".alert1 p:last-child span").remove();
         $(".alert1 p:last-child").css({ "text-align": "center", "margin-top": "-10px" });
         $(".alert1 p .btn").eq(0).css("margin-left", "35px");
     });
     //立即投注：
     $("#btnSave").click(function () {
         if ($(".num-selected table tbody tr:first-child").find("td").eq(1).text() == "") {
             $('#basic-dialog-ok').modal({
                 "opacity": 30
             });
             $('#basic-dialog-ok').find(".tips-title span.tip1").text("请先添加投注内容");
             return false;
         } else {
             $("body").append("<div class='cover-layer'></div>");
             $(".alert1").show().css("z-index", "10001");
             $(".alert1").css({ "width": "464px", "height": "286px", "top": "35%" });
             $(".alert1 h3+p").html('<img src="/modules/images/tips2.png" width="40" style="margin-left:-10px;"><span>你确定加入<strong>' + $('#issueslt').val() + '</strong>期？</span><br/><textarea style="width:90%;height:100px;margin:0 auto;margin-top:-10px;"></textarea>').css("text-align", "center");
             var incontent = '';
             $('.num-selected tbody tr').each(function (i, v) {
                 var s = $(v).attr('title');
                 s = s.replace('投注模式:', '').replace('\n', '').replace('投注信息:', '      ');
                 incontent += s + '\n';
             });
             $(".alert1 h3+p textarea").text(incontent);
             $(".alert1 p:last-child").prepend('<span class="totle-money">投注总金额<strong style="margin:0 5px;">' + $('#totalfee').html() + '</strong>元</span>');
             $(".alert1 p:last-child").css({ "text-align": "center", "margin-top": "10px" });
             $(".alert1 p .btn").eq(0).css("margin-left", "45px").unbind("click").bind("click",function() {
                 //投注进去：
                 $(".alert1").hide();
                 $(".cover-layer").remove();
                 $(".alert1 p:last-child span").remove();
                 //恢复弹出框原样：
                 $(".alert1").css({ "width": "300px", "height": "160px", "top": "40%" });
                 $(".alert1 h3+p").html('<img src="/modules/images/tips.png" width="40"><span>是否清空确认区中所有投注内容？</span>').css("text-align", "center");
                 $(".alert1 p:last-child span").remove();
                 $(".alert1 p:last-child").css({ "text-align": "center", "margin-top": "-10px" });
                 $(".alert1 p .btn").eq(0).css("margin-left", "35px");
                 lottery.saveItems();
                 return;
             });
         }
     });
     //手工选号：
     $(".play-section>div textarea").keyup(function() {
         var content = $(this).val();
         var typelen = $(this).parents(".select-nums").find(".all-ways .all-ways-cur").data("type").indexOf("sanxing") > -1 ? 3 : 2;
         var whichtype = $(this).parents(".select-nums").find(".all-ways .all-ways-cur").data("type");
         var arrDel = [];
         var w = 0;
         var arrSame = [];
         var r = 0;
         arrSelectNum = $.trim(content).split(",");
         for (var e = 0; e < arrSelectNum.length; e++) {
             arrSelectNum[e] = $.trim(arrSelectNum[e]);
         }

         for (var k = 0; k < arrSelectNum.length; k++) {
             for (var v = 0; v < arrSelectNum.length; v++) {
                 if (v > k) {
                     if ($.trim(arrSelectNum[k]) === $.trim(arrSelectNum[v])) {
                         // arrSelectNum.splice(v,1);  
                         arrSame[r] = arrSelectNum[v];
                         r++;
                         break;
                     }
                 }
             }
         }

         for (var i = 0; i < arrSelectNum.length; i++) { //遍历每一注
             var single = $.trim(arrSelectNum[i]);

             if (!reg.test(single)) {

                 arrDel[w] = arrSelectNum[i];
                 w++;
             } else {
                 if (single.length != typelen) {
                     arrDel[w] = arrSelectNum[i];
                     w++;
                 } else if (whichtype == "handin-sanxingz" || whichtype == "handin-erxinghz" || whichtype == "handin-erxingqz") {
                     var regs = new RegExp(single.substring(0, 1), "g");
                     if (single.replace(regs, "").length == 0) {
                         arrDel[w] = arrSelectNum[i];
                         w++;
                     }
                 }
             }
             getsumnum();
         }
         for (var l = 0; l < arrSelectNum.length; l++) { //除去错误的号码
             for (var d = 0; d < arrDel.length; d++) {
                 if (arrSelectNum[l] == arrDel[d]) {
                     arrSelectNum.splice(l, 1);
                     l--;
                 }
             }
         }
         for (var t = 0; t < arrSame.length; t++) { //除去相同的号码
             for (var u = 0; u < arrSelectNum.length; u++) {
                 if (arrSelectNum[u] == arrSame[t]) {
                     arrSelectNum.splice(u, 1);
                     u--;
                     break;
                 }
             }
         }
         //console.log(arrSelectNum);
         $(".play-action").find("p span:first-child").text(arrSelectNum.length);
         var times = $(".play-action").find(".times").val();
         $(".play-action").find("p span:last-child").text(arrSelectNum.length * times * 2);
     });
     //手动选号的清空：
     $(".play-section textarea+input+input+input").click(function() {
         $(this).siblings("textarea").val("");
         $(".play-action").find("p span:first-child").text("0");
         $(".play-action").find("p span:last-child").text("0");
     });
     //手动选号的删除重复号：
     $(".play-section textarea+input").click(function() {
         var contents = $(this).siblings("textarea").val();
         var arrNums = $.trim(contents).split(",");
         for (var k = 0; k < arrNums.length; k++) {
             for (var v = 0; v < arrNums.length; v++) {
                 if (v > k) {
                     if ($.trim(arrNums[k]) === $.trim(arrNums[v])) {
                         arrNums.splice(v, 1);
                         v--;
                         $(this).siblings("textarea").val(arrNums);
                         // break;
                     }
                 }
             }
         }
     });
 });
//外部函数：

//利润率追号倍数实现(20%及以上)：
 function times(num) {
    var prpfits = Math.ceil(parseInt($('#profits').val()) / 10);
    $(".select-table table tbody tr input[type='text']").each(function (i, v) {
        if (i > 0) {
            $(v).val(num * Math.ceil(prpfits * Math.pow((prpfits + 1), i - 1)));
        }
    });
}


function bindselectnavs() {
    //加减1倍数：   
    $(".lrl-chase p:nth-child(2)").find('img').click(function () {
        var _this = $(this);
        plusormin(_this, _this.attr('alt'), false);
        BettNumChange();
    });
    //手动改变 加减的倍数
    $(".lrl-chase .times").keyup(function () {
        var _this = $(this);
        handchange(_this, false);
        BettNumChange();
    });
    //手动修改times框失去焦点时，操作利润率追号和同倍追号的下边各tr里的倍数
    $(".lrl-chase .times").blur(function () {
        if ($(this).val() == "") {
            $(this).val("1");
            BettNumChange();
        }

    });
    $("#bettNum").keyup(function () { //追号期数手动输入
        var nums = $(this).val();
        if (!reg.test(nums) || nums == "") {
            $(".select-table table tbody tr").find("input[type='checkbox']").prop("checked", false);
            $(this).val("0");
        } else {
            if (nums.split("")[0] == "0" && nums.length > 1) {
                $(this).val(nums.substring(1));
            }
            $(".select-table table tbody tr:lt(" + nums + ")").find("input[type='checkbox']").each(function (i, v) {
                if ($(this).prop("checked") == false) {
                    $(this).prop("checked", true).change();
                }
            });
            $(".select-table table tbody tr:gt(" + (nums - 1) + ")").find("input[type='checkbox']").each(function (i, v) {
                if ($(this).prop("checked") == true) {
                    $(this).prop("checked", false).change();
                }
            });
        }
        nums = $(this).val();
        $(".totle em").eq(0).text(nums);
    });
}

function BettNumChange() {
    var times3 = $(".lrl-chase .times#bmuch").val();
    if (times3) {
        if ($(".chase-action .chase-action-cur").data('type') == "1") { //若是同倍追号，所有倍数同时改变
            $(".select-table table tbody tr input[type='text']").each(function (i, v) {
                $(v).val($(".lrl-chase .times#bmuch").val());
                if ($(v).parent().parent().data('ck') == 'checked') {
                    $(v).val($(".lrl-chase .times#bmuch").val()).change();
                } else {
                    $(v).val($(".lrl-chase .times#bmuch").val());
                }
            });
        } else {
            times(times3);
            $(".select-table table tbody tr:first-child td").eq(2).find("input").val(times3).change();

        }
    } else if ($(".chase-action .chase-action-cur").data('type') == "2") {
        addTimes($("#profits").val(), $("#bmuch").val());
    }
}

//翻倍倍数实现：
function addTimes(m,n) {
        $(".select-table table tbody tr input[type='text']").each(function(i, v) {
            var j = (i + 1) / m;
            var times5 = Math.pow(n, Math.ceil(j) - 1);
            $(v).val(times5);
        });
    }
function bindnavs() {
    $(".navs").find("li").click(function () {
        var _this = $(this);
        var names = _this.data("name");
        if (typeof (names) != 'undefined' && names != '') {
            if (typeof (options1[names]) != 'undefined') {
                $(".play-action select option").eq(0).text(options1[names].firstNum);
                $(".play-action select option").eq(1).text(options1[names].lastNum);
            }
        }
        _this.addClass("navs-cur").siblings().removeClass("navs-cur");
        $(".numbers span,.sel-actions span").removeClass("clicked");
        $(".play-action .times").val("1");
        $(".play-action p span").text("0");
        $(".additems").data("type", '');
        $("textarea").val("");
        $('.' + _this.data('id')).show().siblings("div").hide();
        $(".all-ways").css("height", "40px").html("").show();
        $(".play-action .select-fan,.play-action select").show();
        var html = '';
        switch (names) {
            case 'sanxing1':
                $(".n-star .play-section .zhifu").find("p").eq(0).html("从第一位、第二位、第三位中至少各选择1个号码。");
                $(".n-star .play-section .zhidan").find("p").eq(0).html("手动输入号码，至少输入1个三位数号码组成一注。");
                $(".n-star .play-section .zufu").find("p").eq(0).html("从01-11中任意选择3个或3个以上号码。");
                $(".n-star .play-section .zudan").find("p").eq(0).html("手动输入号码，至少输入1个三位数号码组成一注。");
                $(".n-star .zhifu li").eq(2).show();
                $(".all-ways").css("height", "80px").html("").show();
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    html += '<div class="' + (tempitem.PCode == '2ZHIX' ? 'zhixuan' : 'zuxuan') + '"><span data-sid="' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';
                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3ZHIXFS') {
                            html += '<li class="all-ways-cur" data-type="zhifu-sanxing" data-name="1QIANS1" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZHIXDS') {
                            html += '<li  data-name="1QIANS1"  data-type="handin-sanxingd" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZHIXHZ') {
                            html += '<li data-name="1QIANS1"  data-type="zhi-hezhi" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUS') {
                            html += '<li  data-id="zufu" data-name="1QIANS1"  data-type="zuxuans-sanxing" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUL') {
                            html += '<li  data-name="1QIANS1"  data-type="zuxuanl-sanxing" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3HHZUX') {
                            html += '<li  data-type="handin-sanxingz" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUXHZ') {
                            html += '<li  data-type="zu-hezhi" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }
                    }
                    html += '</ul>';
                }
                $(".all-ways").html(html);
                break;
            case 'erxing1':
                $(".n-star .play-section .zhifu").find("p").eq(0).html("从第一位、第二位中至少各选择1个号码。");
                $(".n-star .play-section .zhidan").find("p").eq(0).html("手动输入号码，至少输入1个两位数号码组成一注。");
                $(".n-star .play-section .zufu").find("p").eq(0).html("从01-11中任意选择2个或2个以上号码。");
                $(".n-star .play-section .zudan").find("p").eq(0).html("手动输入号码，至少输入1个两位数号码组成一注。");
                $(".n-star .zhifu li").eq(2).hide();
                $(".all-ways").css("height", "80px").html("").show();
                var isfrist = false;
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    html += '<div class="' + (tempitem.PCode == '2HE' ? 'houer' : 'qianer') + '"><span data-sid="' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';
                    var tp = (tempitem.PCode == '2HE' ? 'h' : 'q');
                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3ZHIXFS') {
                            html += '<li class="' + (!isfrist ? "all-ways-cur" : "") + '"  data-type="zhifu-erxing'+ tp + '" data-name="erxing1" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                            isfrist = true;
                        } else if (titem.PCode == '3ZHIXDS') {
                            html += '<li data-name="erxing1"  data-type="handin-erxing' + tp + 'zhi" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUXFS') {
                            html += '<li data-type="zuxuan-erxing' + tp + '" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else {
                            html += '<li data-name="erxing2"  data-type="handin-erxing' + tp + 'z" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }
                    }
                    html += '</ul>';
                }
                $(".all-ways").html(html);
                break;
            case 'dingweidan':
                    $('.' + _this.data('id')).show().siblings("div").hide();
                break;
            case 'budingwei':
                $(".all-ways").css("height", "80px").html("").show();
                var isfrist = false;
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    html += '<div class="' + (tempitem.PCode == '2YM' ? 'yima' : 'erma') + '"><span data-sid="' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';
                    var tp = (tempitem.PCode == '2YM' ? 'yi' : 'er');
                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3HSYMBDW') {
                            html += '<li class="' + (!isfrist ? "all-ways-cur" : "") + '"  data-type="' + tp + 'ma" data-name="erxing1" data-sid="' + titem.PIDS + '" style="width:120px;">' + titem.PName + '</li>';
                            isfrist = true;
                        } else if (titem.PCode == '3HSEMBDW') {
                            html += '<li data-name="erxing1"  data-type="' + tp + 'ma" data-sid="' + titem.PIDS + '" style="width:120px;">' + titem.PName + '</li>';
                        }  
                    }
                    html += '</ul>';
                }
                $(".all-ways").html(html);
                break; 
            case '':
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    html += '<span data-sid="' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';
                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3QEDXDS') {
                            html += '<li class="all-ways-cur"  data-type="qdxds" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == "3HEDXDS") {
                            html += '<li data-type="hdxds" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }
                    }
                    html += '</ul>';
                }
                $(".all-ways").html(html);
                $(".play-action .select-fan,.play-action select").hide();
                break;
        }
        $(".all-ways").find("li").click(function () {
            var allwaysType = $(this).data("type");
            $(".play-action .select-fan,.play-action select").show();
            if (allwaysType.indexOf("zhifu") > -1) {
                $(".n-star .play-section .zhifu").show().siblings().hide();
                $(".zhifu li").show();
                if (allwaysType == "zhifu-sanxing") {
                    $(".zhifu>p").text("从百位、十位、个位中至少各选1个号码。");
                } else if (allwaysType == "zhifu-erxingh") {
                    $(".zhifu>p").text("从十位和个位上至少各选1个号码。");
                    $(".zhifu li").eq(0).hide();
                } else if (allwaysType == "zhifu-erxingq") {
                    $(".zhifu>p").text("从百位和十位上至少各选1个号码。");
                    $(".zhifu li").eq(2).hide();
                }

            } else if (allwaysType.indexOf("handin") > -1) {
                $(".n-star .play-section .handin").show().siblings().hide();
                if (allwaysType.indexOf("sanxing") > -1) {
                    $(".handin p:first-child").text("手动输入号码，至少输入1个三位数号码。");
                    //混合组选去掉返点select。
                    if (allwaysType.indexOf("handin-sanxingz") > -1) {
                        $(".play-action .select-fan,.play-action select").hide();
                    }
                } else if (allwaysType.indexOf("erxing") > -1) {
                    $(".handin p:first-child").text("手动输入号码，至少输入1个两位数号码。");
                }
            } else if (allwaysType.indexOf("-hezhi") > -1) {
                $(".n-star .play-section .hezhi").show().siblings().hide();
                if (allwaysType.indexOf("zu") > -1) {
                    $(".hezhi>p").text("从1-26中任意选择1个或1个以上号码。");
                    $(".zh-hezhi").hide();
                    $(".zu-hezhi").show();
                    $(".play-action .select-fan,.play-action select").hide();
                } else {
                    $(".hezhi>p").text("从0-27中任意选择1个或1个以上号码。");
                    $(".zu-hezhi").hide();
                    $(".zh-hezhi").show();
                }
            } else if (allwaysType.indexOf("zuxuan") > -1) {
                $(".n-star .play-section .zuxuans").show().siblings().hide();
                if (allwaysType.indexOf("l") == -1) {
                    $(".zuxuans>p").text("从0-9中任意选择2个或2个以上号码。");
                    if (allwaysType.indexOf("zuxuans") > -1) {
                        $(".zuxuans li p").text("组三");
                    } else {
                        $(".zuxuans li p").text("组选");
                    }
                } else {
                    $(".zuxuans>p").text("从0-9中任意选择3个或3个以上号码。");
                    $(".zuxuans li p").text("组六");
                }
            } else if (allwaysType.indexOf("yima") > -1) {
                $(".non-fixed .play-section>p").text("从0-9中任意选择1个或1个以上号码。");
                $(".non-fixed .play-section ul p").text("一码");
            } else if (allwaysType.indexOf("erma") > -1) {
                $(".non-fixed .play-section>p").text("从0-9中任意选择2个或2个以上号码。");
                $(".non-fixed .play-section ul p").text("二码");
            } else if (allwaysType.indexOf("qdxds") > -1) {
                $(".interests .play-section>p").text("从百位、十位中的“大、小、单、双”中至少各选一个组成一注。");
                $(".interests .num-select li").show().eq(2).hide();
            } else if (allwaysType.indexOf("hdxds") > -1) {
                $(".interests .play-section>p").text("从十位、个位中的“大、小、单、双”中至少各选一个组成一注。");
                $(".interests .num-select li").show().eq(0).hide();
            }


            $(".additems").data("type", '');
            var names = $(this).data("name");
            if (typeof (names) != 'undefined' && names != '') {
                if (typeof (options1[names]) != 'undefined') {
                    $(".play-action select option").eq(0).text(options1[names].firstNum);
                    $(".play-action select option").eq(1).text(options1[names].lastNum);
                }
            }

            $(".numbers span,.sel-actions span").removeClass("clicked");
            $(".play-action .times").val("1");
            $(".play-action p span").text("0");
            $(this).addClass("all-ways-cur").parents(".all-ways").find("li").not($(this)).removeClass("all-ways-cur");
            $(".n-star textarea").val("");
        });
        $(".all-ways").find("li").eq(0).click();
    });
}
    //加减倍数
function plusormin(obj,type,issum){	
	var $val=parseInt(obj.siblings(".times").val());  
	if(type=='plus'){	
	    if ($val<99999) {
	        $val=$val+1;
	        obj.siblings(".times").val($val);        
	    }
	}else{
		if ($val>1) {
            $val=$val-1;
			obj.siblings(".times").val($val);
		}
	}
    if(issum){
		var nums=$(".play-action").find("p span:first-child").text();
	    $(".play-action").find("p span:last-child").text(nums*$val*2);
	}
}

//手动改变倍数
function handchange(obj,issums){
    var times2=obj.val();
    if (!reg.test(times2)) {
        times2=1;
    }else{
        if (times2.length>5) {
            times2=parseInt(times2.substring(0,5));
        }else if (times2>99999) {
            times2=99999;
        }
    }
    obj.val(times2);
    if (issums) {
    	var nums=$(".play-action").find("p span:first-child").text();
	    obj.siblings("p").find("span:last-child").text(nums*times2*2);
    }
}

function lvhide() {
     var k = 0;
     if (items.length > 0) {
         for (var i = 0; i < items.length; i++) {
             if (items[i].TypeName == items[0].TypeName) {
                 k++;
             } else {
                 break;
             }
         }
     }
     if (k == items.length) {
         $(".chase-action>ul li:first-child").show().click();
     } else {
         $(".chase-action>ul li:nth-child(2)").click();
         $(".chase-action>ul li:first-child").hide();
     }
 }

function getsumnum(){
    var type="";
    type=$(".navs-cur").html()+$(".all-ways-cur").parent().siblings("span").text()+"_"+$(".all-ways-cur").text();


	var types="";
    types=typeof($(".all-ways-cur").data("type"))!="undefined"?$(".all-ways-cur").data("type"):"";
    var times=$("img[alt='plus']").siblings(".times").val();
    var s=0;
    //console.log(types);
    if (types.indexOf("zhifu")>-1) {  //三星、二星直选复式
       var whichplay=$(".all-ways").siblings("div:visible").attr("class");
       var $numbers=$("."+whichplay+" .numbers:visible");
       var $span1=$numbers.eq(0).find("span.clicked");
       var $span2=$numbers.eq(1).find("span.clicked");
       
       for (var i = 0; i < $span1.length; i++) {
            for (var j = 0; j < $span2.length; j++) {
                if($numbers.length==3){
                	var $span3=$numbers.eq(2).find("span.clicked");
                    for (var k = 0; k < $span3.length; k++) {
                        s++;
                    }
                }else{
                        s++;
                }
            }
        }
        //console.log(arrSelectNum);

    }

    else if (types.indexOf("handin")>-1) {//手动输入
        if (types.indexOf("sanxing")>-1) {        //直选单式和混合组选
            
            // if (types.indexOf("handin-sanxingz")>-1) {//混合组选
                
            // }
        }else if (types.indexOf("erxing")>-1) {   //二星直选单式和组选单式4个
            
        }
    }else if (types.indexOf("-hezhi")>-1) {//和值
        var $span=$(".n-star .hezhi .numbers:visible").find("span");
        var s=0;

        if (types.indexOf("zu")>-1) {              //组选和值
            $span.each(function(i,v){
        		if($(v).hasClass('clicked')){
        			if (i>12) {i=25-i;}
                    if (i==0) {
                    	s+=1
                    }else if (i==1) {
        				s+=2;
        			}else if (i==2) {
        				s+=2;
        			}else if (i==3) {
        				s+=4;
        			}else if (i==4) {
        				s+=5;
        			}else if (i==5) {
        				s+=6;
        			}else if (i==6) {
        				s+=8;
        			}else if (i==7) {
        				s+=10;
        			}else if (i==8) {
        				s+=11;
        			}else if (i==9) {
        				s+=13;
        			}else if (i==10) {
        				s+=14;
        			}else if (i==11) {
        				s+=14;
        			}else if (i==12) {
        				s+=15;
        			}
        		}
        	});
        	
        }else{                                     //直选和值
        	$span.each(function(i,v){
        		if($(v).hasClass('clicked')){
        			if (i>13) {i=27-i;}
        			if (i==10) {
        				s+=63;
        			}else if (i==11) {
        				s+=69;
        			}else if (i==12) {
        				s+=73;
        			}else if (i==13) {
        				s+=75;
        			}else{
        				s+=0.5*(i+1)*(i+2);
        			}
        		}
        	});
        }
    }else if (types.indexOf("zuxuan")>-1) {//组选
        var $span=$(".zuxuans .numbers span.clicked").length;
        var s=0;
        if (types.indexOf("l")==-1) {              //组三和二星的组选复式
            if (types.indexOf("zuxuans")>-1) {       //组三
                if ($span>1) {
                	s=$span*($span-1);
                }
            }else{                                   //二星的两个组选复式
                if ($span>1) {
                	s=$span*($span-1)/2;
                }
            }
        }else{            //组六
        	if ($span>2) {
                s=$span*($span-1)*($span-2)/6;
        	}          
        }
    }else if (types.indexOf("ma")>-1) { //不定位

        type=$(".navs-cur").html()+$(".all-ways-cur").parent().siblings("span").text()+"_"+"三星";

    	var $span=$(".non-fixed .numbers span.clicked").length;
    	var s=0;
    	if (types.indexOf("yima")>-1) {          //不定位一码
    		s=$span;
    	}else{                                   //不定位二码
            if ($span>1) {
            	s=$span*($span-1)/2;
            }
    	}  
    }else if (types.indexOf("dxds")>-1) { //大小单双

        type=$(".navs-cur").html()+"_"+$(".all-ways-cur").text();

    	var $numbers=$(".interests .numbers:visible");
    	var s=0;
    	s=$numbers.eq(0).find("span.clicked").length*$numbers.eq(1).find("span.clicked").length;
        if (types.indexOf("qdxds")>-1) {         //前大小单双
            
        }else{                                   //后大小单双

        }
    }else if (types=="") {                         //定位胆

        type=$(".navs-cur").html()+"_"+"三星";

        var s=0;
        var $span=$(".fixed .numbers span.clicked");
        s=$span.length;
    }

    /********************** 下，算所选号码：***********************/
    if (types.indexOf("zhifu")>-1||types.indexOf("dxds")>-1||types=="") {//三星直复1，二星直复2，大小单双2，定位胆1
    	var whichplay=$(".all-ways").siblings("div:visible").attr("class");
        arrSelectNum=[];      
        var selectNum1="";
    	var selectNum2="";
    	var selectNum3="";
    	var $numbers=$("."+whichplay+" .numbers:visible");
        for (var m = 0; m < $numbers.length; m++) {
        	var s2=$numbers.eq(m).find("span.clicked");
        	//console.log(s2);
        	for (var n = 0; n < s2.length; n++) {
        		if (m==0) {
        			selectNum1+=s2.eq(n).text();
        		}else if (m==1) {
        			selectNum2+=s2.eq(n).text();
        		}else if (m==2) {
        			selectNum3+=s2.eq(n).text();
        		}
        	}
        }

        selectNum1==""?selectNum1="_":selectNum1=selectNum1;
        selectNum2==""?selectNum2="_":selectNum2=selectNum2;
        selectNum3==""?selectNum3="_":selectNum3=selectNum3;

        if (types=="zhifu-sanxing"||types=="") {             //三星直复，定位胆
            arrSelectNum=[selectNum1,selectNum2,selectNum3];
        }else if (types=="zhifu-erxingh"||types.indexOf("hdxds")>-1) {       //后二直复，后二大小单双
            arrSelectNum=["_",selectNum1,selectNum2];
        }else if(types=="zhifu-erxingq"||types.indexOf("qdxds")>-1) {        //前二直复，前二大小单双
            arrSelectNum=[selectNum1,selectNum2,"_"];
        }
    }
    if (types.indexOf("zuxuan")>-1||types.indexOf("ma")>-1||types.indexOf("-hezhi")>-1) {//组三，组六，二星组选复式2，不定位2，和值2
        arrSelectNum=[];  
        var whichplay=$(".all-ways").siblings("div:visible").find(".numbers:visible");
        var $span=whichplay.find("span.clicked");
    	$span.each(function(i,v){
            arrSelectNum[i]=$(v).text();
    	})
    }

    //console.log(s);
    $(".play-action").find("p span:first-child").text(s);
	$(".play-action").find("p span:last-child").text(2*s*times);

	$('.additems').data('type',type);

} 



function fibonacci(a, b) {
    if (a < b) {
        return 0;
    } else {
        if (b > a / 2) {
            return fibonacci(a, a - b);
        }
        return up(a, b) / up(b, b);
    }
}
function up(a, b) {
    var c = 1;
    for (var i = 0; i < b; i++) {
        c = c * a;
        a--;
    }
    return c;
}

lottery.bindEvent = function (code, name) {
    lottery.CPCode = code;
    lottery.CPName = name;
    lottery.GetLottery();
    lottery.GetlotteryResult();
    lottery.getLotteryList();
    $('#saveBett').click(function () {
        lottery.saveBett();
    });
}
lottery.CPTypes = {};
lottery.GetLottery = function () {
    $.post('/Lottery/GetNavsList', { cpcode: lottery.CPCode }, function (data) {
        var html = '';
        for (var i = 0; i < data.items.length; i++) {
            lottery.CPTypes[data.items[i].PCode] = data.items[i].ChildPlays;
            switch (data.items[i].PCode) {
                case "1SANX":
                    html += '<li data-id="n-star" data-name="sanxing1" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break;
                case "1ERX":
                    html += '<li data-id="n-star" data-name="erxing1" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break;
                case "1DWEID":
                    html += '<li data-id="fixed" data-name="dingweidan" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break;
                case "1BUDW":
                    html += '<li data-id="non-fixed" data-name="budingwei" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break;
                case "1RENX":
                    html += '<li data-id="optional" data-name="renxuan1" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break;
                case "1QUWEIX":
                    html += '<li data-id="interests" data-name="" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break;
            }
        }
        $('.navs').html(html);
        bindnavs();
        $('.navs li:first-child').click();
    });
}
var kkk;
lottery.GetlotteryResult = function () {
    $.post('/Lottery/GetlotteryResult', { cpcode: lottery.CPCode }, function (data) {
        var html = '';
        for (var i = 0; i < data.items.length; i++) {
            var nums = data.items[i].ResultNum.split(' ');
            if (i == 0) {
                if (nums.length > 1) {
                    $('#lotteryp span').each(function (i, v) {
                        if (i > 1) {
                            $(v).html(nums[i-2]);
                        } else {
                            $(v).html('--');
                        }
                    });
                }
                $('#lotterypnum').html(data.items[i].IssueNum);
            }
            html += ' <li><span>第<strong>' + data.items[i].IssueNum + '</strong>期号码</span>';
            if (nums.length > 1) {
                html += '<span>--</span><span>--</span><span>' + nums[0] + '</span><span>' + nums[1] + '</span><span>' + nums[2] + '</span></li>';
            } else {
                html += '<span>' + data.items[i].ResultNum + '</span></li>';
            }
        }
        $('#prizeul').html(html);
        lottery.getDifDate(data.item);
    });
    lottery.GetIssNum();
}

lottery.getDifDate = function (item) {
    if (item != null) {
        if (kkk != null && item.AutoID>0) {
            clearTimeout(kkk);
        }
        $('#cpissue').html(item.IssueNum);
        if (item.CPCode != 'FC3D') {
            $('#openlottery').html(item.Num - 1);
        }  
        var time1 = getparamsdate(item.OpenTime, true);
        var date3 = time1.getTime() - (new Date()).getTime(); //时间差秒  
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数 
        
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数 

        if (item.CPCode === "SHSSL") { leave2 = leave2 - (35 * 1000); }

        var hours = leave1 / (3600 * 1000);
      
        hours = hours > 10 ? parseInt(hours) : '0' + Math.floor(hours);
        //leave2 = leave2 - (35 * 1000);
        var minutes = Math.floor(leave2 / (60 * 1000));
        minutes = minutes > 9 ? minutes : '0' + minutes;
        if (leave2)
            //计算相差秒数
            var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
        console.log(leave2);
        var seconds = Math.round(leave3 / 1000);
        if (seconds > 0) {
            seconds = seconds - 1;
        }
        seconds = seconds > 9 ? seconds : '0' + seconds;
        if (seconds > -1 && minutes > -1 ) {
            $('#lotteryhour').html(hours);
            $('#lotterymin').html(minutes);
            $('#lotterysec').html(seconds);
            setTimeout(function () { lottery.getDifDate(item) }, 1000);
        } else {
            //if (seconds == 0 && minutes == 0 && hours == 0) {
            if (kkk != null) {
                kkk = setTimeout(function() { lottery.GetlotteryResult(); }, 3000);
            }
            //}
        }
    }
}
lottery.GetIssNum = function () {
    var date = new Date();
    date.setTime((date.getTime() - 40 * 60 * 1000));
    $.post('/Lottery/GetlotteryResult', {
        cpcode: lottery.CPCode, status: 0, pagesize: lottery.CPCode == "GD11X5" ? 84 : 78, orderby: true, btime: date.format('yyyy-MM-dd hh:mm:ss') , etime: new Date().format('yyyy-MM-dd')
    }, function (data) {
        var html = '';
        var zhhtml = '';
        for (var i = 0; i < data.items.length; i++) {
            html += '<option value="' + data.items[i].IssueNum + '">' + data.items[i].IssueNum + (i == 0 ? "(当前期)" : "") + '</option >';
            zhhtml += '<tr data-ck=""><td><input type="checkbox"></td><td>' + data.items[i].IssueNum + '</td><td><input type="text" value="0">倍</td>' +
                '<td>¥0.00</td><td>' + convertdateTostring(data.items[i].OpenTime, true, "yyyy-MM-dd hh:mm:ss") + '</td></tr>';
        }
        $('#issueslt').html(html);

        selectbettnum = zhhtml;
        BettHtml();
    });
}

function BettHtml() {
    $('.select-table tbody').html(selectbettnum);
    if (selectbettnum != '') {
        //金额计算：
        $(".select-table table tbody tr input[type='text']").change(function () {
            var _this = $(this);
            var nums = _this.val();
            if (!reg.test(nums) || nums == "") {
                _this.val("0");
            } else {
                if (nums.split("")[0] == "0" && nums.length > 1) {
                    _this.val(nums.substring(1));
                }
            }
            var totalfee = $("#totalfee").text();
            var times4 = _this.parent().parent().find("td").eq(2).find("input").val();
            _this.parent().parent().find("td").eq(3).text("￥" + totalfee * times4 + ".00");
            sumtotalFee();
        });
        //操作checkbox改变追号期数
        $(".select-table table tbody tr input[type='checkbox']").change(function () {
            if ($(this).parent().parent().data('ck') == '') {
                $(this).parent().parent().data('ck', 'checked');
            } else {
                $(this).parent().parent().data('ck', '');
            }
            var totalfee = $("#totalfee").text();
            var times4 = $(this).parent().parent().find("td").eq(2).find("input").val();
            if (times4 < 1) {
                $(this).parent().parent().find("td").eq(2).find("input").val(1);
                times4 = 1;
            }
            $(this).parent().parent().find("td").eq(3).text("￥" + totalfee * times4 + ".00");
            var num = $(".select-table table tbody tr input[type='checkbox']:checked").length;
            $("#bettNum").val(num);
            $(".totle em").eq(0).text(num);
            sumtotalFee();
        });
    }
}

function sumtotalFee() {
    var q = 0;
    $(".select-table table tbody tr").each(function () {
        if ($(this).data('ck') == 'checked') {
            var fee = $(this).find("td").eq(3).text().substring(1);
            q += parseInt(fee);
        }
        $(".totle em").eq(1).text(q);
    });
}

lottery.saveItems = function () { 
    for (var i = 0; i < items.length; i++) {
        items[i].IssueNum = $('#issueslt').val();
    }
    $.post('/Lottery/AddLotteryOrders', { list: JSON.stringify(items), usedisFee: $('#isusedic').prop('checked') ? 1 : 0 }, function (data) {
        if (data.result > 0) {
            items = [];
            $(".num-selected table tbody").html('');
        } else {
            alert(data.ErrMsg);
        }
    });
}

lottery.getLotteryList = function () {
    $.post('/Lottery/GetUserLottery', { cpcode: lottery.CPCode }, function (data) {
        var html = '';
        for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            html += ' <tr><td class="width140">' + item.LCode + '</td><td class="width120">' + convertdateTostring(item.CreateTime, true, "yyyy-MM-dd hh:mm:ss") + '</td><td class="width130">' + item.TypeName + '</td><td class="width85">' + item.IssueNum + '</td><td class="width200">' + item.Content + '</td>' +
                '<td class="width60">' + item.PMuch + '</td><td class="width40">元</td><td class="width65">' + item.PayFee + '</td><td class="width85">' + item.WinFee + '</td><td class="width40">' + (item.Status == 0 ? "未开奖" : (item.Status == 2 ? "已中奖" : (item.Status == 1 ? "未中奖" : (item.Status == 3 ? "已撤单" : "已删除")))) + '</td></tr>';
        }
        if (html == "") {
            html += '<tr><td></td><td></td><td></td><td></td><td>暂无投注记录</td><td></td><td></td><td></td><td></td><td></td></tr>';
        }
        $('.bet-record tbody').html(html);
    });
}
lottery.saveBett = function () {
    var bettlist = [];
    var jsoncontent = "";
    var tmucj = 1;
    var startnum = '';
    $(".select-table table tbody tr").each(function () {
        var _this = $(this);
        if (_this.data('ck') == 'checked') {
            var num = _this.find('input[type="text"]').val();
            jsoncontent += _this.find('td').eq(1).html() + "," + num + "|";
            if (tmucj == 1) {
                startnum = _this.find('td').eq(1).html();
            }
            tmucj += parseInt(num);
        }
    });
    for (var i = 0; i < items.length; i++) {
        var m = items[i];
        m.BettNum = $('#bettNum').val();
        m.BMuch = $('#bmuch').val();
        m.StartNum = startnum;
        m.TotalFee = parseFloat(tmucj * m.PayFee).toFixed(2);
        m.Profits = typeof ($('#profits').val()) != 'undefined' ? parseFloat(parseFloat($('#profits').val()) / 100).toFixed(2) : 0;
        m.JsonContent = jsoncontent;
        m.BettType = $('.chase-action .chase-action-cur').data('type');
        bettlist.push(m);
    }
    if (bettlist.length > 0) {
        $.post('/Lottery/AddLotteryBett', { list: JSON.stringify(bettlist), isStart: $(".chase-num input[type='checkbox']").prop('checked') == true ? 1 : 0 }, function (data) {
            if (data.result > 0) {
                alert('追号单生成成功');
                $(".chase-num").find("input[type='button']").click();
            } else {
                alert(data.ErrMsg);
            }
        });
    }
}

