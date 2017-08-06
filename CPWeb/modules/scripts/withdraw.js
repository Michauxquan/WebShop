
//withdraw recharge bound-ank
$(function(){
        		$(".tx").on("click",function(event) {
        			var account = $(".account").val();
        			var phone = $(".phone").val();
        			var money = $(".money").val();
        			if (account=="") {
        				$(".acc").html("<p style='color: red;'>*提现账号  不能为空！</p>")
        				return false;
        			}else if(phone==""){
        				$(".phonel").html("<p style='color: red;'>*手机号  不能为空！</p>")
        				return false;
        			}else if(money==""){
        				$(".moneyl").html("<p style='color: red;'>*提现金额  不能为空！</p>")
        				return false;
        			}
        		});
        		 $(".account").focus(function(){
				        $(".acc").html(" ");
				    })
        		 $(".phone").focus(function(){
				        $(".phonel").html(" ");
				    })
        		 $(".money").focus(function(){
				        $(".moneyl").html(" ");
				    })
        	})
