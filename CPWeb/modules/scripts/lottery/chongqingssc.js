
 var numArry= ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
 var options1 = {
     "1WUX": { "firstNum": "180000-4%", "lastNum": "1861.2-0%" },
     "1SIX1": { "firstNum": "180000-4%", "lastNum": "1861.2-0%" },
     "1QIANS1": { "firstNum": "1782-4%", "lastNum": "1861.2-0%" },
     "1ZHONGS": { "firstNum": "1782-4%", "lastNum": "1861.2-0%" },
     "1HS1": { "firstNum": "1782-4%", "lastNum": "1861.2-0%" },
     "sanxing1": { "firstNum": "1782-4%", "lastNum": "1861.2-0%" },
     "sanxing2": { "firstNum": "297-4%", "lastNum": "310.2-0%" },
     "sanxing3": { "firstNum": "297-4%", "lastNum": "310.2-0%" },
     "erxing1": { "firstNum": "198-4%", "lastNum": "206.8-0%" },
     "erxing2": { "firstNum": "99-4%", "lastNum": "103.4-0%" },
     "dingweidan": { "firstNum": "19.8-4%", "lastNum": "20.68-0%" },
     "budingwei": { "firstNum": "6.6-4%", "lastNum": "7-0%" },
     "budingwei2": { "firstNum": "33-4%", "lastNum": "35.03-0%" },
     "renxuan1": { "firstNum": "3.9-4%", "lastNum": "4.07-0%" },
     "renxuan2": { "firstNum": "9.9-4%", "lastNum": "10.34-0%" },
     "renxuan3": { "firstNum": "29.7-4%", "lastNum": "31.02-0%" },
     "renxuan4": { "firstNum": "118-4%", "lastNum": "123.28-0%" },
     "renxuan5": { "firstNum": "831-4%", "lastNum": "867.96-0%" },
     "renxuan6": { "firstNum": "138-4%", "lastNum": "144.16-0%" },
     "renxuan7": { "firstNum": "39.6-4%", "lastNum": "41.36-0%" },
     "renxuan8": { "firstNum": "14.8-4%", "lastNum": "15.46-0%" },
     "1QUWEIX": { "firstNum": "7.2-4%", "lastNum": "7.64-0%" }
 };
 var arrSelectNum = [], items = [], selectbettnum = '';
 var lottery = {}
 lottery.CPCode;
 lottery.CPName;
var reg=/^[0-9]*$/;
 $(function(){
 	//选号：
     $(".num-select li div.numbers").find("span").click(function() {
         $(this).toggleClass("clicked");
         getsumnum();
     });
	//全大小奇偶清：
	$(".sel-actions").find("span").click(function(){
		$(this).addClass("clicked").siblings().removeClass("clicked");
		var $numbers=$(this).parent().siblings(".numbers");
		$numbers.find("span").removeClass("clicked");
		switch($(this).index()){
            case 0:$numbers.find("span").addClass("clicked");break;
            case 1:$numbers.find("span:gt(4)").addClass("clicked");break;
            case 2:$numbers.find("span:lt(5)").addClass("clicked");break;
            case 3:$numbers.find("span:odd").addClass("clicked");break;
            case 4:$numbers.find("span:even").addClass("clicked");break;
	    }
		getsumnum();
	})
	 
	//加1减1：
     $("img[alt='plus']").click(function() {
         var _this = $(this);
         plusormin(_this, 'plus', true);
     });
    $("img[alt='minus']").click(function(){
        var _this=$(this);
        plusormin(_this,'minus',true);
    }); 

	//手动修改倍数改变钱数：
    $(".times").keyup(function(){
    	var _this=$(this);
        handchange(_this,true);
    })
    $(".times").blur(function(){
        var nums=$(".play-action").find("p span:first-child").text();
        if ($(this).val()=="") {
            $(this).val("1");
            $(this).siblings("p").find("span:last-child").text(nums*($(this).val())*2);
        }
    })
    
	//追号3个导航：
     $(".chase-action>ul li").click(function() {
         $(this).addClass("chase-action-cur").siblings().removeClass("chase-action-cur");
         $(".select-table table tbody tr").find("input[type='checkbox']").prop("checked", false);
         switch ($(this).index()) {
         case 0:
             $(".lrl-chase p:nth-child(2)").html('起始倍数：<img src="/modules/images/minus.png" alt="minus" width="27"><input type="text" class="times" value="1" id="bmuch" /><img src="/modules/images/plus.png" alt="plus" width="27">倍<span>最低收益率：<input type="text" value="50" id="profits" />%</span><span>追号期数：</span><input type="text" value="0" id="bettNum" />');
             break;
         case 1:
             $(".lrl-chase p:nth-child(2)").html('起始倍数：<img src="/modules/images/minus.png" alt="minus" width="27"><input type="text" class="times" value="1" id="bmuch" /><img src="/modules/images/plus.png" alt="plus" width="27">倍<span>追号期数：</span><input type="text" value="0" id="bettNum" />');
             break;
         case 2:
             $(".lrl-chase p:nth-child(2)").html('隔&nbsp;<img src="/modules/images/minus.png" alt="minus" width="27"><input type="text" value="1" id="profits"/><img src="/modules/images/plus.png" alt="plus" width="27">期<span>倍数：</span><input type="text" value="2" id="bmuch" /><span>追号期数：</span><input type="text" value="0" id="bettNum" />');
             break;
         }
         $(".lrl-chase p:nth-child(2)").find('img').click(function() {
             var _this = $(this);
             plusormin(_this, _this.attr('alt'), false);
         });
         $(".lrl-chase .times").keyup(function() { 
             var _this = $(this);
             handchange(_this, false);
         })
         $(".lrl-chase .times").blur(function() {
             if ($(this).val() == "") {
                 $(this).val("1");
             }
         })
         $("#bettNum").keyup(function() { //追号期数手动输入
             var nums = $(this).val();
             $(".select-table table tbody tr").find("input[type='checkbox']").prop("checked", false);
             if (!reg.test(nums) || nums == "") {
                 $(this).val("0");
             } else {
                 if (nums.split("")[0] == "0" && nums.length > 1) {
                     $(this).val(nums.substring(1));
                 }
                 $(".select-table table tbody tr:lt(" + nums + ")").find("input[type='checkbox']").prop("checked", true);
             }
         });
     });
    //选择追号期数：
    $(".lrl-chase select").change(function(){
        var selOption=$(".lrl-chase select").find("option:selected").text();
        if (selOption=="请选择") {
            $("#bettNum").val("0");
        }else{
        $("#bettNum").val(selOption.replace(/[^0-9]/ig, ""));   
        }
        $("#bettNum").keyup();
    })
     $(".select-table table tbody tr input[type='checkbox']").click(function() { //操作checkbox改变追号期数
         var num = $(".select-table table tbody tr input[type='checkbox']:checked").length;
         $("#bettNum").val(num);
     });

    //发起追号：
    $(".chase-num").find("input[type='button']").click(function() {
         $this = $(this); 
         if ($(".num-selected table tbody tr:first-child").find("td").eq(0).text() != "") {
             $this.toggleClass("up");
             $(".chase-action").toggle();
             if ($this.hasClass("up")) {
                 $this.siblings().find("input[type='checkbox']").prop("checked", true);
             } else {
                 $this.siblings().find("input[type='checkbox']").prop("checked", false);
             }
         } else {
             if ($(".chase-action").css('display')=="none") {
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
         if ($(this).siblings("p").find("span").eq(1).text() > 0) {
             if ($(".num-selected tbody tr:first-child").find("td").eq(0).text() == "") {
                 $(".num-selected tbody tr:first-child").remove();
             }
             var item = {};
             item.PayFee = $(".play-action p span").eq(1).text();
             item.Num = $(".play-action p span").eq(0).text();
             item.pMuch = $(".play-action .times").val();
             item.TypeName = type;
             var location = [];
             if (type.split("_")[1] == "混合组选" || type.split("_")[1] == "组选和值" || type.split("_")[1] == "四星组合" || type.split("_")[1] == "五星组合") {
                 item.WinFee = 0;
                 item.RPoint = 1;
                 var msg = "<tr title='" + ('投注模式：' + type + '\n' + '投注信息：' + arrSelectNum) + "'><td width='130'>" + type + "</td><td width='200' style='word-break:break-all;'>" + arrSelectNum + "</td><td width='73.3'>" + item.Num + "注" + "</td><td width='73.3'>" + item.pMuch + "倍" + "</td><td width='73.3'>" + item.PayFee + "元" + "</td><td width='73.3'>0</td><td width='73.3'>100%</td><td width='73.3'><span>删除</span></td></tr>";
                 $(".num-selected tbody").append(msg);
             } else {
                 var tempr = $(".play-action select").find("option:selected").text().split("-");
                 item.WinFee = tempr[0];
                 item.RPoint = (parseFloat(tempr[1].replace('%', '')) / 100).toFixed(2);
                 if ($(".all-ways .all-ways-cur").data("type") && $(".all-ways .all-ways-cur").data("type").indexOf("renxuan") > -1) {
                   
                     var j = 0;
                     $(".optional .play-section>div:visible").find("input[type='checkbox']").each(function(i, v) {
                         var loc = "";
                         if ($(v).prop("checked") == true) {
                             switch (i) {
                             case 0: loc = "万位";  break;
                             case 1: loc = "千位";  break;
                             case 2: loc = "百位";  break;
                             case 3: loc = "十位";  break;
                             case 4: loc = "个位";  break;
                             }
                             location[j] = loc;
                             j++;
                         }
                     }); 
                     var msg = "<tr title='" + ('投注模式：' + type + '\n' + '选择位置：' + location + '\n' + '投注信息：' + arrSelectNum) + "'><td width='130'>" + type + "</td><td width='200px' style='word-break:break-all;'>" + arrSelectNum + "</td><td width='73.3'>" + item.Num + "注" + "</td><td width='73.3'>" + item.pMuch + "倍" + "</td><td width='73.3'>" + item.PayFee + "元" + "</td><td width='73.3'>" + tempr[0] + "元" + "</td><td width='73.3'>" + tempr[1] + "</td><td width='73.3'><span>删除</span></td></tr>";
                 } else {
                     var msg = "<tr title='" + ('投注模式：' + type + '\n' + '投注信息：' + arrSelectNum) + "'><td width='130'>" + type + "</td><td width='200px' style='word-break:break-all;'>" + arrSelectNum + "</td><td width='73.3'>" + item.Num + "注" + "</td><td width='73.3'>" + item.pMuch + "倍" + "</td><td width='73.3'>" + item.PayFee + "元" + "</td><td width='73.3'>" + tempr[0] + "元" + "</td><td width='73.3'>" + tempr[1] + "</td><td width='73.3'><span>删除</span></td></tr>";
                 }
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
             item.Content = JSON.stringify(arrSelectNum) + (location.length > 0 ? JSON.stringify(location) : "");
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
	$(".num-selected table tfoot tr td a").click(function(){
		$("body").append("<div class='cover-layer'></div>");
        $(".alert1").show().css("z-index","10001");
        $(".alert1 p .btn").eq(0).click(function () {
			$(".num-selected table tbody").html("<tr><td width='96.25'></td><td width='96.25'></td><!-- <td></td> --><td width='96.5'></td><td width='193' title='暂无投注项'>暂无投注项</td><td width='96.5'></td><td width='96.5'></td><td width='96.5'></td></tr>");
            items=[];
            lvhide();
            $('#totalnum').html("0");
            $('#totalfee').html("0.00");
            $(".alert1").hide();
            $(".cover-layer").remove();
			return;
		})
	})
	//弹出框操作：(清空所有，立即投注，)
	$(".alert1 h3 img,.alert1 p .btn:last-child").click(function () {
    	$(".alert1").hide();
    	$(".cover-layer").remove();
    	if ($(".alert1 p:last-child span").length!=0) {
    		$(".alert1 p:last-child span").remove();
    	}
    	$(".alert1").css({"width":"300px","height":"160px","top":"40%"});
        $(".alert1 h3+p").html('<img src="/modules/images/tips.png" width="40"><span>是否清空确认区中所有投注内容？</span>').css("text-align","center");
        $(".alert1 p:last-child span").remove();
        $(".alert1 p:last-child").css({"text-align":"center","margin-top":"-10px"});
        $(".alert1 p .btn").eq(0).css("margin-left", "35px");
    })
    //立即投注：
	$("#btnSave").click(function () {
    	if ($(".num-selected table tbody tr:first-child").find("td").eq(0).text()=="") {
            $('#basic-dialog-ok').modal({
                "opacity":30
	        });
    		$('#basic-dialog-ok').find(".tips-title span.tip1").text("请先添加投注内容");
	        return false;
    	}else{
    		$("body").append("<div class='cover-layer'></div>");
            $(".alert1").show().css("z-index","10001");
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
            $(".alert1 p:last-child").css({"text-align":"center","margin-top":"10px"});
            $(".alert1 p .btn").eq(0).css("margin-left", "45px").unbind("click").bind("click", function () {
				//投注进去：
	            $(".alert1").hide();
	            $(".cover-layer").remove();
	            $(".alert1 p:last-child span").remove();
	            //恢复弹出框原样：
	            $(".alert1").css({"width":"300px","height":"160px","top":"40%"});
	            $(".alert1 h3+p").html('<img src="/modules/images/tips.png" width="40"><span>是否清空确认区中所有投注内容？</span>').css("text-align","center");
	            $(".alert1 p:last-child span").remove();
	            $(".alert1 p:last-child").css({"text-align":"center","margin-top":"-10px"});
	            $(".alert1 p .btn").eq(0).css("margin-left", "35px");
	            lottery.saveItems();
			    return;
		    })
    	}
    })

    var reg=/^[0-9]*$/;
    //手工选号：
    $(".play-section>div textarea").keyup(function(){
        var content = $(this).val();
        var whichtype = $(this).parents(".select-nums").find(".all-ways .all-ways-cur").data("type");
        var typenum = $(this).parents(".select-nums").find(".all-ways .all-ways-cur").data("nums");  //对任选里的2/3/4区别定义
        var typelen=0;
        //indexOf("sanxing")>-1?3:2;
        if (whichtype.indexOf("wuxing")>-1) {
            typelen=5;
        }else if (whichtype.indexOf("sixing")>-1) {
            typelen=4;
        }else if (whichtype.indexOf("sanxing")>-1) {
            typelen=3;
        }else if (whichtype.indexOf("erxing")>-1) {
            typelen=2;
        }
        var arrDel=[];
        var w=0;
        var arrSame=[];
        var r=0; 
        arrSelectNum = $.trim(content).split(",");
        for (var e = 0; e < arrSelectNum.length; e++) {
            arrSelectNum[e]=$.trim(arrSelectNum[e]);
        }

        for (var k = 0; k < arrSelectNum.length; k++) {   
    		for (var v = 0; v < arrSelectNum.length; v++) {
    		    if (v>k) {
                    if ($.trim(arrSelectNum[k])===$.trim(arrSelectNum[v])) {
                        // arrSelectNum.splice(v,1);  
                        arrSame[r]=arrSelectNum[v];
                        r++;             
                        break;
                    }
    		    }
    	    }
    	}

    	for (var i = 0; i < arrSelectNum.length; i++) {  //遍历每一注
    		var single=$.trim(arrSelectNum[i]);
    		if (!reg.test(single)) {
                arrDel[w]=arrSelectNum[i];
                w++;
    		}else { 
                if (whichtype.indexOf("erxing")>-1||whichtype.indexOf("sanxing")>-1||whichtype.indexOf("sixing")>-1||whichtype.indexOf("wuxing")>-1) {
                    if(single.length!=typelen){ 
                        arrDel[w]=arrSelectNum[i];
                        w++;
                    }else if(whichtype=="handin-zhsanxingz"||whichtype=="handin-qsanxingz"||whichtype=="handin-hsanxingz"||whichtype=="handin-erxinghz"||whichtype=="handin-erxingqz"){   
                        var regs=new RegExp(single.substring(0,1),"g");
                        if (single.replace(regs,"").length==0) {
                            arrDel[w]=arrSelectNum[i];
                            w++;
                        }
                    }
                }else if (whichtype.indexOf("renxuan")>-1) { //任选的手动输入 
                    if(single.length!=typenum){
                        arrDel[w]=arrSelectNum[i];
                        w++;
                    }else if ((whichtype.indexOf("zudan")>-1)&&(whichtype.indexOf("san")==-1)) {//互不重复的任二的组选单式，任三的组六单式，任四的组选单式。
                        for (var t = 0; t < single.length; t++) {
                            for (var u = 0; u < single.length; u++) {
                                if (u>t) {
                                    if (single.split("")[t]==single.split("")[u]) {
                                        arrDel[w]=arrSelectNum[i];
                                        w++;continue;
                                    }
                                }
                            }
                        }
                    }else if (whichtype=="renxuan-zudansan") {   //任三的组三单式，一对重复加一个不重复的三位数。
                        var v=0;
                        for (var t = 0; t < single.length; t++) {
                            for (var u = 0; u < single.length; u++) {
                                if (u>t) {
                                    if (single.split("")[t]==single.split("")[u]) {
                                        v++;
                                    }
                                }
                            }
                        }
                        if (v!=1) {
                            arrDel[w]=arrSelectNum[i];
                            w++;continue;
                        }
                    }
                }
            }
	        getsumnum();
    	} 
	    for (var l = 0; l < arrSelectNum.length; l++) {  //除去错误的号码
	    	for (var d = 0; d < arrDel.length; d++) {
	    		if (arrSelectNum[l]==arrDel[d]) {
	    			arrSelectNum.splice(l,1);l--;
	    		}
	    	}
	    }
	    for (var t = 0; t < arrSame.length; t++) {   //除去相同的号码
	    	for (var u = 0; u < arrSelectNum.length; u++) {
	    		if (arrSelectNum[u]==arrSame[t]) {
	    			arrSelectNum.splice(u,1);u--;break;
	    		}
	    	}
	    }  
        var times=$(".play-action").find(".times").val();
        if (whichtype.indexOf("renxuan")>-1) {
            $(".play-action").find("p span:first-child").text($(".tip22").find("strong").eq(1).text()*arrSelectNum.length);
            $(".play-action").find("p span:last-child").text($(".tip22").find("strong").eq(1).text()*arrSelectNum.length*times*2);
        }else{
            $(".play-action").find("p span:first-child").text(arrSelectNum.length);
            $(".play-action").find("p span:last-child").text(arrSelectNum.length*times*2);
        }
	    
    })

    //手动选号的清空：
    $(".play-section textarea+input+input+input").click(function(){
        $(this).siblings("textarea").val("");
        $(".play-action").find("p span:first-child").text("0");
        $(".play-action").find("p span:last-child").text("0");
    })
    //手动选号的删除重复号：
    $(".play-section textarea+input").click(function(){
        var contents=$(this).siblings("textarea").val();
        var arrNums = $.trim(contents).split(",");
        for (var k = 0; k < arrNums.length; k++) {
    		for (var v = 0; v < arrNums.length; v++) {
    		    if (v>k) {
                    if ($.trim(arrNums[k])===$.trim(arrNums[v])) {
                        arrNums.splice(v,1);v--;
                        $(this).siblings("textarea").val(arrNums);
                        // break;
                    }
    		    }
    	    }
    	}
    })
})
//外部函数：

//计算c mn组合
function fibonacci( a, b){  
    if (a<b) {
        return 0;
    }else{
        if(b>a/2){  
            return fibonacci(a,a-b);  
        }  
        return up(a,b)/up(b,b);  
    }
}  
function up( a, b){  
    var c = 1;  
    for(var i=0;i<b;i++){  
        c = c*a;  
        a--;  
    }  
    return c;  
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
    if (types.indexOf("zhifu")>-1) {  //五星、四星、三星、二星直选复式，和任选的直选复式
       var whichplay=$(".all-ways").siblings("div:visible").attr("class");
       var $numbers=$("."+whichplay+" .numbers:visible");
       var $span1=$numbers.eq(0).find("span.clicked");
       var $span2=$numbers.eq(1).find("span.clicked");
       var $span3=$numbers.eq(2).find("span.clicked");
       var $span4=$numbers.eq(3).find("span.clicked");
       var $span5=$numbers.eq(4).find("span.clicked"); 
       var $span=$numbers.find("span.clicked");

       if (types.indexOf("ren")>-1) {//待优化！
            var len=0;
            $numbers.each(function(){
                if ($(this).hasClass("have")) {
                    $(this).removeClass("have");
                }
                if ($(this).find("span.clicked").length>0) {
                    len++;
                    $(this).addClass("have");
                }
            }) 
            if ($(".all-ways-cur").data("nums")==4){
                if (len==4) {
                    s=1;
                    $numbers.each(function(){
                        if ($(this).find("span.clicked").length!=0) {
                            s*=$(this).find("span.clicked").length;
                        }
                    })
                }else if (len==5) {
                    s=$span1.length*$span2.length*$span3.length*$span4.length+$span1.length*$span2.length*$span3.length*$span5.length+$span1.length*$span2.length*$span4.length*$span5.length+$span5.length*$span2.length*$span3.length*$span4.length+$span1.length*$span5.length*$span3.length*$span4.length;
                }
            }else if ($(".all-ways-cur").data("nums")==3) {
                if (len==3) {
                    s=1;
                    $numbers.each(function(){
                        if ($(this).find("span.clicked").length!=0) {
                            s*=$(this).find("span.clicked").length;
                        }
                    })
                }else if (len==4) {
                    s=$(".have").eq(0).find("span.clicked").length*$(".have").eq(1).find("span.clicked").length*$(".have").eq(2).find("span.clicked").length+$(".have").eq(0).find("span.clicked").length*$(".have").eq(1).find("span.clicked").length*$(".have").eq(3).find("span.clicked").length+$(".have").eq(0).find("span.clicked").length*$(".have").eq(2).find("span.clicked").length*$(".have").eq(3).find("span.clicked").length+$(".have").eq(1).find("span.clicked").length*$(".have").eq(2).find("span.clicked").length*$(".have").eq(3).find("span.clicked").length;
                }else if (len==5) {
                    s=$span1.length*$span2.length*$span3.length+$span1.length*$span2.length*$span4.length+$span1.length*$span2.length*$span5.length+$span1.length*$span3.length*$span4.length+$span1.length*$span3.length*$span5.length+$span1.length*$span4.length*$span5.length+$span2.length*$span3.length*$span4.length+$span2.length*$span3.length*$span5.length+$span2.length*$span4.length*$span5.length+$span3.length*$span4.length*$span5.length;
                }
            }else if ($(".all-ways-cur").data("nums")==2){
                if (len==2) {
                    s=1;
                    $numbers.each(function(){
                        if ($(this).find("span.clicked").length!=0) {
                            s*=$(this).find("span.clicked").length;
                        }
                    })
                }else if (len==3) {
                    s=$(".have").eq(0).find("span.clicked").length*$(".have").eq(1).find("span.clicked").length+$(".have").eq(0).find("span.clicked").length*$(".have").eq(2).find("span.clicked").length+$(".have").eq(1).find("span.clicked").length*$(".have").eq(2).find("span.clicked").length;
                }else if (len==4) {
                    s=$(".have").eq(0).find("span.clicked").length*$(".have").eq(1).find("span.clicked").length+$(".have").eq(0).find("span.clicked").length*$(".have").eq(2).find("span.clicked").length+$(".have").eq(1).find("span.clicked").length*$(".have").eq(2).find("span.clicked").length+$(".have").eq(0).find("span.clicked").length*$(".have").eq(3).find("span.clicked").length+$(".have").eq(1).find("span.clicked").length*$(".have").eq(3).find("span.clicked").length+$(".have").eq(2).find("span.clicked").length*$(".have").eq(3).find("span.clicked").length;
                }else if (len==5) {
                    s=$span1.length*$span2.length+$span1.length*$span3.length+$span1.length*$span4.length+$span1.length*$span5.length+$span2.length*$span3.length+$span2.length*$span4.length+$span2.length*$span5.length+$span3.length*$span4.length+$span3.length*$span5.length+$span4.length*$span5.length;
                }
            }

       }else{
           if ($numbers.length==2) {
               if ($span1.length>0&&$span2.length>0) {
                   s=$span1.length*$span2.length;
               }
           }else if ($numbers.length==3) {
               if ($span1.length>0&&$span2.length>0&&$span3.length>0) {
                   s=$span1.length*$span2.length*$span3.length;
               }
           }else if ($numbers.length==4) {
               if ($span1.length>0&&$span2.length>0&&$span3.length>0&&$span4.length>0) {
                   s=$span1.length*$span2.length*$span3.length*$span4.length;
               }
           }else if ($numbers.length==5) {
               if ($span1.length>0&&$span2.length>0&&$span3.length>0&&$span4.length>0&&$span5.length>0) {
                   s=$span1.length*$span2.length*$span3.length*$span4.length*$span5.length;
               }
           }
           if (types.indexOf("zhifu-wuxingzu")>-1) {
                s=5*s;
            }else if (types.indexOf("zhifu-sixingzu")>-1) {
                s=4*s;
            }
       } 
    }

    else if (types.indexOf("handin")>-1) {//手动输入
        if (types.indexOf("sanxing") > -1) {        //直选单式和混合组选 

        }else if (types.indexOf("erxing")>-1) {   //二星直选单式和组选单式4个
            
        }
    }else if (types.indexOf("hezhi")>-1) {//和值
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

        type=$(".navs-cur").html()+$(".all-ways-cur").parent().siblings("span").text()+"_"+$(".all-ways-cur").text().substr(0,2);

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
        type=$(".navs-cur").html()+"_"+"五星";
        var s=0;
        var $span=$(".fixed .numbers span.clicked");
        s=$span.length;
    }else if (types.indexOf("zufu")>-1) {        //任选组选复式
        var s=0;
        var $span=$(".optional .renzu .numbers span.clicked");
        if (types=="renxuan-zufuer") {
            if ($span.length>1) {
                s=$span.length*($span.length-1)/2;
                s=s*$(".tip44").find("strong").eq(1).text();
            }
        }else if (types=="renxuan-zufusan") {
            if ($span.length>1) {
                s=$span.length*($span.length-1);
                s=s*$(".tip44").find("strong").eq(1).text();
            }
        }else if (types=="renxuan-zufusi") {
            if ($span.length>3) {
                s=fibonacci( $span.length, 4);
                s=s*$(".tip44").find("strong").eq(1).text();
            }
        }else if (types=="renxuan-zufuliu") {
            if ($span.length>2) {
                s=fibonacci( $span.length, 3);
                s=s*$(".tip44").find("strong").eq(1).text();
            }
        }
    } 
    /********************** 下，算所选号码：***********************/
    if (types.indexOf("zhifu")>-1||types.indexOf("dxds")>-1||types=="") {//五星直复和组选2，四星直复和组选2，前后三星直复2，二星直复2，大小单双2，定位胆1,任选7个
    	var whichplay=$(".all-ways").siblings("div:visible").attr("class");
        arrSelectNum=[];      
        var selectNum1="";
    	var selectNum2="";
    	var selectNum3="";
        var selectNum4="";
        var selectNum5="";
    	var $numbers=$("."+whichplay+" .numbers:visible"); 
        for (var m = 0; m < $numbers.length; m++) {
        	var s2=$numbers.eq(m).find("span.clicked"); 
        	for (var n = 0; n < s2.length; n++) {
        		if (m==0) {
        			selectNum1+=s2.eq(n).text();
        		}else if (m==1) {
        			selectNum2+=s2.eq(n).text();
        		}else if (m==2) {
        			selectNum3+=s2.eq(n).text();
        		}else if (m==3) {
                    selectNum4+=s2.eq(n).text();
                }else if (m==4) {
                    selectNum5+=s2.eq(n).text();
                }
        	}
        }

        selectNum1==""?selectNum1="_":selectNum1=selectNum1;
        selectNum2==""?selectNum2="_":selectNum2=selectNum2;
        selectNum3==""?selectNum3="_":selectNum3=selectNum3;
        selectNum4==""?selectNum4="_":selectNum4=selectNum4;
        selectNum5==""?selectNum5="_":selectNum5=selectNum5; 
       
        if (types.indexOf("sanxing")>-1||types==""||types.indexOf("zhifu-wuxing")>-1||types.indexOf("zhifu-sixing")>-1||types.indexOf("ren")>-1) {             //五星和四星的直选复式2个，和组合2个，前中后三星直复3个，定位胆1个，任选直复3个
            if (types.indexOf("zhifu-wuxing")>-1||types==""||types.indexOf("ren")>-1) {
                arrSelectNum=[selectNum1,selectNum2,selectNum3,selectNum4,selectNum5];
            }else if(types.indexOf("zhifu-sixing")>-1){
                arrSelectNum=[selectNum1,selectNum2,selectNum3,selectNum4];
            }else if (types.indexOf("-hsanxing")>-1) {
                arrSelectNum=[selectNum1,selectNum2,selectNum3];
            }else if (types.indexOf("-zhsanxing")>-1) {
                arrSelectNum=[selectNum1,selectNum2,selectNum3];
            }else if (types.indexOf("-qsanxing")>-1) {
                arrSelectNum=[selectNum1,selectNum2,selectNum3];
            }
        }else if (types=="zhifu-erxingh"||types.indexOf("hdxds")>-1) {       //后二直复1个，后二大小单双1个
            arrSelectNum=[selectNum1,selectNum2];
        }else if(types=="zhifu-erxingq"||types.indexOf("qdxds")>-1) {        //前二直复1个，前二大小单双1个
            arrSelectNum=[selectNum1,selectNum2];
        }
    }
    if (types.indexOf("zuxuan")>-1||types.indexOf("ma")>-1||types.indexOf("hezhi")>-1||types.indexOf("renxuan-zufu")>-1) {//组三3个，组六3个，二星组选复式2，不定位2，和值6个,任选组复4个
        arrSelectNum=[];  
        var whichplay=$(".all-ways").siblings("div:visible").find(".numbers:visible");
        var $span=whichplay.find("span.clicked");
        $span.each(function(i, v) {
            arrSelectNum[i] = $(v).text();
        });
    } 
    $(".play-action").find("p span:first-child").text(s);
	$(".play-action").find("p span:last-child").text(2*s*times);

	$('.additems').data('type',type);

} 


//翻倍倍数实现：
function addTimes(m, n) {
    $(".select-table table tbody tr input[type='text']").each(function (i, v) {
        var j = (i + 1) / m;
        var times5 = Math.pow(n, Math.ceil(j) - 1);
        if ($(v).parent().parent().data('ck') == 'checked') {
            $(v).val(times5).change();
        } else {
            $(v).val(times5);
        }
    });
}
//加减倍数
function plusormin(obj, type, issum) {
    var $val = parseInt(obj.siblings(".times").val());
    if (type == 'plus') {
        if ($val < 99999) {
            $val = $val + 1;
            obj.siblings(".times").val($val);
        }
    } else {
        if ($val > 1) {
            $val = $val - 1;
            obj.siblings(".times").val($val);
        }
    }
    if (issum) {
        var nums = $(".play-action").find("p span:first-child").text();
        $(".play-action").find("p span:last-child").text(nums * $val * 2);
    }
}
function times(num) {
    var prpfits = Math.ceil(parseInt($('#profits').val()) / 10);
    $(".select-table table tbody tr input[type='text']").each(function (i, v) {
        if (i > 0) {
            $(v).val(num * Math.ceil(prpfits * Math.pow((prpfits + 1), i - 1)));
        }
    });
}
//手动改变倍数
function handchange(obj, issums) {
    var times2 = obj.val(); 
    if (!reg.test(times2)) {
        times2 = 1;
    } else {
        if (times2.length > 5) {
            times2 = parseInt(times2.substring(0, 5));
        } else if (times2 > 99999) {
            times2 = 99999;
        }
    }
    obj.val(times2);
    if (issums) {
        var nums = $(".play-action").find("p span:first-child").text();
        obj.siblings("p").find("span:last-child").text(nums * times2 * 2);
    }
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

function bindnavs() {
    $(".navs").find("li").click(function () {
        var _this = $(this);
        var names = _this.data("name");
        if (typeof (names) != 'undefined' && names != '') { 
            $(".play-action select option").eq(0).text(options1[names].firstNum);
            $(".play-action select option").eq(1).text(options1[names].lastNum);
        }
        $(this).addClass("navs-cur").siblings().removeClass("navs-cur");
        $(".numbers span,.sel-actions span").removeClass("clicked");
        $(".play-action .times").val("1");
        $(".play-action p span").text("0");
        $(".additems").data("type", '');
        $(".n-star textarea").val("");
        $('.' + _this.data('id')).show().siblings("div").hide();
        $(".all-ways").css("height", "40px").html("").show();
        $(".play-action .select-fan,.play-action select").show();
        var html = '';
        switch (names) {
            case '1WUX':
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    html += '<span data-sid="' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';
                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3ZHIXFS') {
                            html += '<li class="all-ways-cur" data-type="zhifu-wuxing" data-name="1WUX" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZHIXDS') {
                            html += '<li data-name="1WUX"  data-type="handin-wuxingd" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3WUXZH') {
                            html += '<li data-type="zhifu-wuxingzu"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }
                    }
                    html += '</ul>';
                }
                $(".all-ways").html(html);
                break;
            case '1SIX1':
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    html += '<span data-sid="' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';
                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3ZHIXFS') {
                            html += '<li class="all-ways-cur" data-type="zhifu-sixing" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZHIXDS') {
                            html += '<li data-name="1SIX1" data-type="handin-sixingd"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3SIXZH') {
                            html += '<li data-type="zhifu-sixingzu"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }
                    }
                    html += '</ul>';
                }
                $(".all-ways").html(html);
                break;
            case '1HS1':
            case '1ZHONGS':
            case '1QIANS1':
                $(".all-ways").css("height", "80px");
                var tp = names == '1HS1' ? 'h' : (names == "1QIANS1" ? 'q' : 'zh');
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    html += '<div class="' + (tempitem.PCode == '2ZHIX' ? 'zhixuan' : 'zuxuan') + '"><span data-sid="' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';
                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3ZHIXFS') {
                            html += '<li class="all-ways-cur" data-type="zhifu-' + tp + 'sanxing" data-name="1QIANS1" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZHIXDS') {
                            html += '<li  data-name="1QIANS1"  data-type="handin-' + tp + 'sanxingd" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZHIXHZ') {
                            html += '<li data-name="1QIANS1"  data-type="zhi-' + tp + 'hezhi" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUS') {
                            html += '<li  data-id="zufu" data-name="1QIANS1"  data-type="zuxuans-' + tp + 'sanxing" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUL') {
                            html += '<li  data-name="1QIANS1"  data-type="zuxuanl-' + tp + 'sanxing" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3HHZUX') {
                            html += '<li  data-type="handin-' + tp + 'sanxingz" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUXHZ') {
                            html += '<li  data-type="zu-' + tp + 'hezhi" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }
                    }
                    html += '</ul></div>';
                }
                $(".all-ways").html(html);
                break;

            case 'erxing1':
                $(".all-ways").css("height", "80px");
                $(".play-section .zhifu>p").html("从十位和个位上至少各选1个号码。");
                var tp = names == '2QE' ? 'q' : 'h';
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    html += '<div class="' + (tempitem.PCode == "2QE" ? "qianer" : "houer") + '"><span data-sid="' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';
                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3ZHIXFS') {
                            html += '<li class="all-ways-cur" data-type="zhifu-erxing' + tp + '" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZHIXDS') {
                            html += '<li data-name="1SIX1" data-type="handin-erxing' + tp + 'zhi"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUXFS') {
                            html += '<li data-type="zuxuan-erxing' + tp + '"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUXDS') {
                            html += '<li data-type="handin-erxing' + tp + 'z"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }
                    }
                    html += '</ul></div>';
                }
                $(".all-ways").html(html);
                $(".play-action .select-fan,.play-action select").show();
                break;
            case 'dingweidan':
                $(".all-ways").css("height", "0px");
                $('.' + _this.data('id')).show().siblings("div").hide();
                break;
            case 'renxuan1':
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    var tname = (tempitem.PCode == "2RENE" ? "er" : (tempitem.PCode == "2RSAN" ? "san" : "si"));
                    var tnum = (tempitem.PCode == "2RENE" ? 2 : (tempitem.PCode == "2RSAN" ? 3 : 4));
                    html += '<div class="' + tname + '"><span data-sid="ren' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';

                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3ZHIXFS') {
                            html += '<li class="all-ways-cur" data-nums="' + tnum + '" data-type="zhifu-ren' + tname + '" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }else if (titem.PCode == '3ZHIXDS') {
                            html += '<li data-nums="' + tnum + '" data-type="renxuan-zhidan' + tname + '" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUXFS') {
                            html += '<li data-nums="' + tnum + '" data-type="renxuan-zufu' + tname + '" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUXDS') {
                            html += '<li data-nums="' + tnum + '" data-type="renxuan-zudan' + tname + '" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUSFS'){ 
                            html += '<li data-nums="' + tnum + '" data-type="renxuan-zufu' + tname + '"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZUSDS') {
                            html += '<li data-nums="' + tnum + '" data-type="renxuan-zudan' + tname + '"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZULFS') {
                            html += '<li data-nums="' + tnum + '" data-type="renxuan-zufuliu"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3ZULDS') {
                            html += '<li data-nums="' + tnum + '" data-type="renxuan-zudanliu"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }
                    } 
                    html += '</ul></div>';
                }
                $(".all-ways").html(html);
                $(".all-ways").css("height", "115px");
                $(".play-action .select-fan,.play-action select").show();
                break;
            case 'budingwei':
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    html += '<div class="' + (tempitem.PCode == "2ERMA" ? "erma" : "yima") + '"><span data-sid="' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';
                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3HSYMBDW' || titem.PCode == '3ZSYMBDW' || titem.PCode == '3QSYMBDW') {
                            html += '<li class="all-ways-cur" data-name="budingwei" data-type="yima" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3HSEMBDW' || titem.PCode == '3ZSEMBDW' || titem.PCode == '3QSEMBDW') {
                            html += '<li data-name="budingwei2" data-type="erma"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }
                    }
                    html += '</ul></div>';
                }
                $(".all-ways").css("height", "80px");
                $(".all-ways").html(html);
                break;
            case '1QUWEIX':
                for (var i = 0; i < lottery.CPTypes[$(this).data("sid")].length; i++) {
                    var tempitem = lottery.CPTypes[$(this).data("sid")][i];
                    html += '<span data-sid="' + tempitem.PIDS + '">' + tempitem.PName + '</span><ul>';
                    for (var j = 0; j < tempitem.ChildPlays.length; j++) {
                        var titem = tempitem.ChildPlays[j];
                        if (titem.PCode == '3QEDXDS') {
                            html += '<li class="all-ways-cur" data-name="1QUWEIX" data-type="qdxds" data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        } else if (titem.PCode == '3HEDXDS') {
                            html += '<li data-name="1QUWEIX" data-type="hdxds"  data-sid="' + titem.PIDS + '">' + titem.PName + '</li>';
                        }
                    }
                    html += '</ul>';
                }
                $(".all-ways").html(html);
                break;
        } 
        $(".all-ways").find("li").click(function() {
            var _this = $(this);
            var allwaysType = _this.data("type");
            $(".play-action .select-fan,.play-action select").show();
            if (allwaysType.indexOf("zhifu") > -1) { //五星、四星的直选复式和组选4个，三星后三和中三和前三3个、二星直选复式2个，外加任选直选复式3个
                $(".n-star .play-section .zhifu").show().siblings().hide();
                $(".zhifu li").show();
                if (allwaysType.indexOf("wuxing") > -1) { //五星的直选复式和组选
                    if (allwaysType == "zhifu-wuxing") { //五星直选复式
                        $(".zhifu>p").text("从万位、千位、百位、十位、个位中选择一个5位数号码组成一注。");
                    } else { //五星组选
                        $(".zhifu>p").text("从万位、千位、百位、十位、个位中至少各选1个号码组成1-5星的组合，共五注。");
                        $(".play-action .select-fan,.play-action select").hide();
                    }
                } else if (allwaysType.indexOf("sixing") > -1) { //四星的直选复式和组选
                    $(".zhifu li").eq(0).hide();
                    if (allwaysType == "zhifu-sixing") { //四星直选复式
                        $(".zhifu>p").text("从千位、百位、十位、个位中选择一个4位数号码组成一注。");
                    } else { //四星组选
                        $(".zhifu>p").text("从千位、百位、十位、个位中至少各选1个号码组成1-4星的组合，共四注。");
                        $(".play-action .select-fan,.play-action select").hide();
                    }
                } else if (allwaysType.indexOf("sanxing") > -1) { //三星直选复式
                    if (allwaysType == "zhifu-hsanxing") { //后三星直选复式
                        $(".zhifu>p").text("从百位、十位、个位中至少各选1个号码组成一注。");
                        $(".zhifu li").eq(0).hide().end().eq(1).hide();
                    } else if (allwaysType == "zhifu-qsanxing") { //前三星直选复式
                        $(".zhifu>p").text("从万位、千位、百位中至少各选1个号码组成一注。");
                        $(".zhifu li").eq(3).hide().end().eq(4).hide();
                    } else if (allwaysType == "zhifu-zhsanxing") { //中三星直选复式
                        $(".zhifu>p").text("从千位、百位、十位中至少各选1个号码组成一注。");
                        $(".zhifu li").eq(0).hide().end().eq(4).hide();
                    }
                } else if (allwaysType == "zhifu-erxingh") {
                    $(".zhifu>p").text("从十位和个位上至少各选1个号码。");
                    $(".zhifu li").eq(0).hide().end().eq(1).hide().end().eq(2).hide();
                } else if (allwaysType == "zhifu-erxingq") {
                    $(".zhifu>p").text("从万位和千位上至少各选1个号码。");
                    $(".zhifu li").eq(2).hide().end().eq(3).hide().end().eq(4).hide();
                } else if (allwaysType.indexOf("ren") > -1) { //任选的直选复式3个
                    $(".n-star").show().siblings("div").not(".all-ways").hide();
                    if (allwaysType == "zhifu-rener") {
                        $(".zhifu>p").text("从万位、千位、百位、十位、个位中至少两位上各选1个号码组成一注。");
                    } else if (allwaysType == "zhifu-rensan") {
                        $(".zhifu>p").text("从万位、千位、百位、十位、个位中至少三位上各选1个号码组成一注。");
                    } else if (allwaysType == "zhifu-rensi") {
                        $(".zhifu>p").text("从万位、千位、百位、十位、个位中至少四位上各选1个号码组成一注。");
                    }
                }

            } else if (allwaysType.indexOf("handin") > -1) { //手动输入 五星、四星直选单式2个，三星后三和中三和前三的 直选单式、混合组选6个，二星的直选单式和组选单式4个
                $(".n-star .play-section .handin").show().siblings().hide();
                $(".n-star .play-section .handin p:last-child").text("每注号码之间请使用英文逗号（,）隔开。");
                if (allwaysType.indexOf("wuxing") > -1) { //五星直选单式
                    $(".handin p:first-child").text("手动输入号码，至少输入1个五位数号码组成一注。");
                    $(".n-star .play-section .handin p:last-child").text("每注号码之间请使用英文逗号（,）隔开。(一次最大可投注5000注)")
                } else if (allwaysType.indexOf("sixing") > -1) { //四星直选单式
                    $(".handin p:first-child").text("手动输入号码，至少输入1个四位数号码组成一注。");
                    $(".n-star .play-section .handin p:last-child").text("每注号码之间请使用英文逗号（,）隔开。(一次最大可投注5000注)")
                } else if (allwaysType.indexOf("sanxing") > -1) { //三星后三和前三和中三
                    $(".handin p:first-child").text("手动输入号码，至少输入1个三位数号码组成一注。");
                    //混合组选去掉返点select。
                    if (allwaysType.indexOf("sanxingz") > -1) { //三星（前中后）的混合组选
                        $(".play-action .select-fan,.play-action select").hide();
                    }
                } else if (allwaysType.indexOf("erxing") > -1) {
                    $(".handin p:first-child").text("手动输入号码，至少输入1个两位数号码组成一注。");
                }
            } else if (allwaysType.indexOf("hezhi") > -1) { //和值  三星后三和中三和前三的 直选和值、组选和值6个
                $(".n-star .play-section .hezhi").show().siblings().hide();
                if (allwaysType.indexOf("zu") > -1) { //组选和值
                    $(".hezhi>p").text("从1-26中任意选择1个或1个以上号码。");
                    $(".zh-hezhi").hide();
                    $(".zu-hezhi").show();
                    $(".play-action .select-fan,.play-action select").hide();
                } else { //直选和值
                    $(".hezhi>p").text("从0-27中任意选择1个或1个以上号码。");
                    $(".zu-hezhi").hide();
                    $(".zh-hezhi").show();
                }
            } else if (allwaysType.indexOf("zuxuan") > -1) { //组选  三星后三和中三和前三的  组三、组六6个，二星的组选复式2个
                $(".n-star .play-section .zuxuans").show().siblings().hide();
                if (allwaysType.indexOf("l") == -1) { //三星后三和前三的  组三，二星的组选复式
                    $(".zuxuans>p").text("从0-9中任意选择2个或2个以上号码。");
                    if (allwaysType.indexOf("zuxuans") > -1) {
                        $(".zuxuans li p").text("组三");
                    } else {
                        $(".zuxuans li p").text("组选");
                    }
                } else { //组六
                    $(".zuxuans>p").text("从0-9中任意选择3个或3个以上号码。");
                    $(".zuxuans li p").text("组六");
                }
            } else if (allwaysType.indexOf("yima") > -1) { //不定位
                $(".non-fixed .play-section>p").text("从0-9中任意选择1个或1个以上号码。");
                $(".non-fixed .play-section ul p").text("一码");
            } else if (allwaysType.indexOf("erma") > -1) { //不定位
                $(".non-fixed .play-section>p").text("从0-9中任意选择2个或2个以上号码。");
                $(".non-fixed .play-section ul p").text("二码");
            } else if (allwaysType.indexOf("qdxds") > -1) { //前二大小单双
                $(".interests .play-section>p").text("从万位、千位中的“大、小、单、双”中至少各选一个组成一注。");
                $(".interests .num-select li").show().eq(2).hide().end().eq(3).hide().end().eq(4).hide();
            } else if (allwaysType.indexOf("hdxds") > -1) { //后二大小单双
                $(".interests .play-section>p").text("从十位、个位中的“大、小、单、双”中至少各选一个组成一注。");
                $(".interests .num-select li").show().eq(0).hide().end().eq(1).hide().end().eq(2).hide();
            } else if (allwaysType.indexOf("renxuan") > -1) { //任选
                $(".optional").show().siblings("div").not(".all-ways").hide();

                if (allwaysType.indexOf("dan") > -1) { //单式
                    $(".optional .play-section .shoudong").show().siblings("div").hide();
                    if (allwaysType.indexOf("er") > -1) { //任二的单式2个
                        $(".tip22").find("strong").eq(0).text("2").end().find("strong").eq(1).text("1");
                        //写checkbox选择。。。
                        if (allwaysType == "renxuan-zhidaner") {
                            $(".tip11").text("从万位、千位、百位、十位、个位中至少选择两个位置,至少手动输入两个号码构成一注。");
                        } else if (allwaysType == "renxuan-zudaner") {
                            $(".tip11").text("从万位、千位、百位、十位、个位中至少选择两个位置,至少手动输入两个不重复的号码构成一注。");
                        }
                    } else if (allwaysType.indexOf("san") > -1 || allwaysType.indexOf("liu") > -1) { //任三的单式3个
                        $(".tip22").find("strong").eq(0).text("3").end().find("strong").eq(1).text("1");
                        //写checkbox选择。。。
                        if (allwaysType == "renxuan-zhidansan") {
                            $(".tip11").text("从万位、千位、百位、十位、个位中至少选择三个位置,至少手动输入三个号码构成一注。");
                        } else if (allwaysType == "renxuan-zudansan") {
                            $(".tip11").text("从万位、千位、百位、十位、个位中至少选择三个位置,至少手动输入两个重复号码和一个不重复号码构成一注。");
                        } else if (allwaysType == "renxuan-zudanliu") {
                            $(".tip11").text("从万位、千位、百位、十位、个位中至少选择三个位置,手动至少输入三个不重复的号码构成一注。");
                        }
                    } else if (allwaysType.indexOf("si") > -1) { //任四的单式2个
                        $(".tip22").find("strong").eq(0).text("4").end().find("strong").eq(1).text("1");
                        //写checkbox选择。。。
                        if (allwaysType == "renxuan-zhidansi") {
                            $(".tip11").text("从万位、千位、百位、十位、个位中至少选择四个位置,至少手动输入四个号码构成一注。");
                        } else if (allwaysType == "renxuan-zudansi") {
                            $(".tip11").text("从万位、千位、百位、十位、个位中至少选择四个位置,至少手动输入四个不重复的号码构成一注。");
                        }
                    }
                } else if (allwaysType.indexOf("fu") > -1) { //组复4个
                    $(".optional .play-section .renzu").show().siblings("div").hide();
                    if (allwaysType.indexOf("er") > -1) { //任二的组复1个
                        $(".tip44").find("strong").eq(0).text("2").end().find("strong").eq(1).text("1");
                        //写checkbox选择。。。

                        $(".tip33").text("从万位、千位、百位、十位、个位中至少选择两个位置,号码区至少选择两个号码构成一注，不包括对子号码。");
                        $(".optional .play-section .renzu .num-select p").text("任二组选");
                    } else if (allwaysType.indexOf("san") > -1 || allwaysType.indexOf("liu") > -1) { //任三的组复2个
                        $(".tip44").find("strong").eq(0).text("3").end().find("strong").eq(1).text("1");
                        //写checkbox选择。。。
                        if (allwaysType == "renxuan-zufusan") {
                            $(".tip33").text("从万位、千位、百位、十位、个位中至少选择三个位置,号码区至少选择两个号码构成两注。");
                            $(".optional .play-section .renzu .num-select p").text("任三组三");
                        } else if (allwaysType == "renxuan-zufuliu") {
                            $(".tip33").text("从万位、千位、百位、十位、个位中至少选择三个位置,号码区至少选择三个号码构成一注。");
                            $(".optional .play-section .renzu .num-select p").text("任三组六");
                        }
                    } else if (allwaysType.indexOf("si") > -1) { //任四的组复1个
                        $(".tip44").find("strong").eq(0).text("4").end().find("strong").eq(1).text("1");
                        //写checkbox选择。。。

                        $(".tip33").text("从万位、千位、百位、十位、个位中至少选择四个位置,号码区至少选择四个号码构成一注，不包括任何重复号码。");
                        $(".optional .play-section .renzu .num-select p").text("任四组选");
                    }
                }

                var visdiv = $(".optional .play-section>div:visible");
                var labels = visdiv.find("label");

                var text1 = visdiv.find(".tip").eq("1").find("strong").eq(0);
                var text2 = visdiv.find(".tip").eq("1").find("strong").eq(1);
                visdiv.find("label").find("input").removeAttr("checked");

                if (allwaysType.indexOf("er") > -1) { //任二的3个的checkbox
                    visdiv.find("label:gt(2) input").prop("checked", "true");
                } else if (allwaysType.indexOf("san") > -1 || allwaysType.indexOf("liu") > -1) { //任三的5个的checkbox
                    visdiv.find("label:gt(1) input").prop("checked", "true");
                } else if (allwaysType.indexOf("si") > -1) { //任四的3个的checkbox
                    visdiv.find("label:gt(0) input").prop("checked", "true");
                }
                text2.text("1");

                $('.optional label').change(function() {
                    var checkedInput = 0;
                    labels.each(function() {
                        var inputs = $(this).find("input");
                        if (inputs.prop("checked") == true) {
                            checkedInput++;
                        }
                    })
                    text1.text(checkedInput);
                    if (checkedInput < _this.data("num")) {
                        text2.text("0");
                    } else {
                        text2.text(fibonacci(checkedInput, _this.data("nums")));
                    }
                    getsumnum();
                    $(this).parents(".tip22").siblings("textarea").keyup();
                });
            }
            $(".additems").data("type", '');
            var names = $(this).data("name");
            if (typeof(names) != 'undefined') {
                $(".play-action select option").eq(0).text(options1[names].firstNum);
                $(".play-action select option").eq(1).text(options1[names].lastNum);
            }

            $(".numbers span,.sel-actions span").removeClass("clicked");
            $(".play-action .times").val("1");
            $(".play-action p span").text("0");
            $(this).addClass("all-ways-cur").parents(".all-ways").find("li").not($(this)).removeClass("all-ways-cur");
            $("textarea").val("");
        });
        $(".all-ways").find("li").eq(0).click();
    })
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
                case "1WUX":
                    html += '<li data-id="n-star" data-name="1WUX" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break;
                case "1SIX":
                    html += '<li data-id="n-star" data-name="1SIX1" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break;
                case "1HS":
                    html += '<li data-id="n-star" data-name="1HS1" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break;
                case "1QIANS":
                    html += '<li data-id="n-star" data-name="1QIANS1" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break;
                case "1ZHONGS":
                    html += '<li data-id="n-star" data-name="1ZHONGS" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
                    break; 
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
                    html += '<li data-id="interests" data-name="1QUWEIX" data-sid="' + data.items[i].PIDS + '">' + data.items[i].PName + '</li>';
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
                        $(v).html(nums[i]);
                    });
                }
                $('#lotterypnum').html(data.items[i].IssueNum);
            }
            html += ' <li><span>第<strong>' + data.items[i].IssueNum + '</strong>期号码</span>';
            if (nums.length > 1) {
                html += '<span>' + nums[0] + '</span><span>' + nums[1] + '</span><span>' + nums[2] + '</span><span>' + nums[3] + '</span><span>' + nums[4] + '</span></li>';
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
        if (typeof (kkk) != 'undefined' && item.AutoID > 0) { 
            clearTimeout(kkk);
        }
        $('#cpissue').html(item.IssueNum);
        $('#openlottery').html(item.Num - 1);
        var time1 = getparamsdate(item.OpenTime, true);
        var date3 = time1.getTime() - (new Date()).getTime(); //时间差秒 
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        leave2 = leave2 - (35 * 1000);
        var minutes = Math.floor(leave2 / (60 * 1000));
        minutes = minutes > 9 ? minutes : '0' + minutes;
        if (leave2)
            //计算相差秒数
            var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数 
        var seconds = Math.round(leave3 / 1000);
        if (seconds > 0) {
            seconds = seconds - 1;
        }
        seconds = seconds > 9 ? seconds : '0' + seconds;
        var sssssss = seconds + ' ';
        var mmmmmmm = minutes + ' '; 
        if (sssssss.indexOf('-') == -1 && (mmmmmmm.indexOf('-') == -1 && minutes > -1)) {
            $('#lotterymin').html(minutes);
            $('#lotterysec').html(seconds);
            setTimeout(function () { lottery.getDifDate(item) }, 1000);
        } else { 
            if (typeof (kkk) == 'undefined') {
                kkk = setTimeout(function () { lottery.GetlotteryResult(); }, 3000);
            } 
        }
    }
}
lottery.GetIssNum = function () {
    var date = new Date();
    date.setTime((date.getTime() - 30 * 60 * 1000));
    $.post('/Lottery/GetlotteryResult', {
        cpcode: lottery.CPCode, status: 0, pagesize: lottery.CPCode == "TJSSC" ? 84 : 78, orderby: true, btime: date.format('yyyy-MM-dd hh:mm:ss'), etime: new Date().format('yyyy-MM-dd')
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
