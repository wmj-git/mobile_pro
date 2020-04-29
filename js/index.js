function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for(var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable) {
			return pair[1];
		}
	}
	return(false);
}
/*模拟传参*/
var session = {
	islogin: getQueryVariable("islogin"), //是否登陆(true:已登录;false:未登录)
	classification: getQueryVariable("classification"), //非会员默认套餐单点hybrid ，continuous（连续）,sole(单独购买)
	moviesName: "《速度与激情：特别行动特别行动特别行动特别行动》",
	begin: "2020.04.03", //2020.04.03
	end: getQueryVariable("end"), //2020.04.20
	ticketsEnd: "2020.04.20 8:00",
	payStatus: getQueryVariable("payStatus"), //success:支付成功；failure:支付失败（未查询到支付信息）
	norepeat: getQueryVariable("norepeat"), //是否重新购买影片 true:未重复购买；false:重复购买
	isvip: getQueryVariable("isvip")
}

/*静态参数*/
/*var session = {
	islogin: ("true"), //是否登陆(true:已登录;false:未登录)
	classification: ("hybrid"), //非会员默认套餐单点hybrid ，continuous（连续）sole(单独购买)
	moviesName: "《速度与激情：特别行动特别行动特别行动特别行动》",
	begin: "2020.04.03", //2020.04.03
	end: ("2020.04.20"), //2020.04.20
	ticketsEnd: "2020.04.20 8:00",
	payStatus: ("success"), //success:支付成功；failure:支付失败（未查询到支付信息）
	norepeat: ("true"), //是否重新购买影片 true:未重复购买；false:重复购买
	isvip: ("true")
}*/

storageObj(session)
var objAfter = JSON.parse(sessionStorage.getItem("key")); //获取存储的session对象

$(function() {
	if(objAfter.islogin == "true") {
		$.ajax({
			url: "user.json",
			type: "get",
			dataType: "json",
			success: function(data) {
				$("#userName").text(data.userData.userName)
				$("#countBtn").html("切换账号")
				$("#userTel").html("(" + data.userData.userTel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + ")")
				$(".membersTitle").css("display", "none") //已经是会员-单独购买电影券

				$(".Ticket").css("display", "block")

				$("#presentPrice").html("2.5") //观影券价格
				$("#referentialPrice").html("2.5")

				var diff = DateDiff(objAfter.begin, objAfter.end)
				if(objAfter.isvip == "true") {
					/*激活码*/
					$("#activeBtn").click(function() {
						var diff = DateDiff(objAfter.begin, objAfter.end)
						$("#inputCode").val("")
						if(diff >= 0 && diff < 30) {
						var activeTime = addDate(objAfter.end,30)
							$("#countText").html("会员" + objAfter.end + "到期")
							$("#userRow").addClass("membersUser")
						    $("#userimgHead").attr('src', "images/icon_crown_colorful.svg")
							mui.toast('激活成功' + '<p class="active">会员' + activeTime + '到期</p>');
							$(".activeBtn").attr("disabled", true)
							$("#countText").html("会员" + activeTime + "到期")
						} else if(diff > 30) {
							mui.toast('激活码已过期');
							$(".activeBtn").attr("disabled", true)
						}
					})
					
					$(".movieName").html(objAfter.moviesName)
					$(".ticketsName").html(objAfter.moviesName) //观影券名称
					$(".ticketsTime").html(objAfter.ticketsEnd) // 有效期
					$(".moviesTicket").css("display", "block")
					$(".scrollHead").addClass("soleHead")
					$(".dealWith").addClass("soleWaiting")
					$(".pay").css("display", "none") //会员不展示支付方式
					$(".special").css("display", "none") //会员无需展示特权介绍
					$(".package").css("display", "none") // 会员无需展示会员权益
					if(data.userData.userImg !== "" && diff > 30) {
						// 会员有头像，已过期
						$("#userImg").attr('src', data.userData.userImg)
						$("#userimgHead").attr('src', "images/icon_crown_gray.svg")
						$("#countText").html("会员已到期")
					} else if(data.userData.userImg !== "" && diff >= 0 && diff < 30) {
						// 会员有头像，未过期
						$("#userImg").attr('src', data.userData.userImg)
						$("#userimgHead").attr('src', "images/icon_crown_colorful.svg")
						$("#countText").html("会员" + objAfter.end + "到期")
						$("#userRow").addClass("membersUser")
					} else if(data.userData.userImg == "" && diff > 30) {
						// 会员无头像，已过期
						$("#userImg").attr('src', "images/acount_avatar_default.svg")
						$("#userimgHead").attr('src', "images/icon_crown_gray.svg")
						$("#countText").html("会员已到期")
					} else {
						// 会员无头像，未过期
						$("#userImg").attr('src', "images/acount_avatar_default.svg")
						$("#userimgHead").attr('src', "images/icon_crown_colorful.svg")
						$("#countText").html("会员" + objAfter.end + "到期")
						$("#userRow").addClass("membersUser")
					}
				} else {

					/*已登录非会员*/
					$("#userimgHead").attr('src', "images/icon_crown_gray.svg")
					$("#userImg").attr('src', "images/acount_avatar_default.svg")
					$("#countText").html("尚未开通会员")
					switch(objAfter.classification) {
						/*case "sole":
							$(".movieName").html(objAfter.moviesName)
							$(".ticketsName").html(objAfter.moviesName) //观影券名称
							$(".ticketsTime").html(objAfter.ticketsEnd) // 有效期
							$(".moviesTicket").css("display", "block")
							break;*/
						case "continuous":
							$("#presentPrice").html("222")
							$(".members .membersType").css("display", "block")
							$(".membersTitle").css("display", "block")
							$("#referentialPrice").html("177")
							break;
						case "hybrid":
							$(".membersTitle").css("display", "none") //会员单点无需标题
							$(".movies").css("display", "block")
							$(".movieName").html(objAfter.moviesName)
							$("#movies li.moviesItem_active").each(function() {
								$("#referentialPrice").html("2.5")
								var ticN = $(this).find("span.new").html()
								$("#presentPrice").html(ticN)
							})
							break;
					}

					/*激活码*/
					$("#activeBtn").click(function() {
						var diff = DateDiff(objAfter.begin, objAfter.end)
						$("#inputCode").val("")
						if(diff >= 0 && diff < 30) {
							$("#userRow").addClass("membersUser")
						    $("#userimgHead").attr('src', "images/icon_crown_colorful.svg")
							mui.toast('激活成功' + '<p class="active">会员' + objAfter.end + '到期</p>');
							$(".activeBtn").attr("disabled", true)
							$("#countText").html("会员" + objAfter.end + "到期")
						} else if(diff > 30) {
							mui.toast('激活码已过期');
							$(".activeBtn").attr("disabled", true)
						}
					})

				}

				$("#activeOpen").click(function() {
					Jump("active")
				})

				$("#payBtn").click(function() {
					var val = $("#check").prop('checked')
					if(val == true && objAfter.norepeat == "true") {
						Jump('pay')
					} else if(val == false) {
						$("#payBtn").attr("disabled", true)
						layer.msg('请查看并同意《服务协议》', {
							time: 2000
						}, function() {
							$("#payBtn").attr("disabled", false)
						})
					} else if((objAfter.norepeat == "false") && (objAfter.classification == "hybrid")) {
						$("#payBtn").attr("disabled", true)
						layer.msg('您已购买过该影片，无需重复购买', {
							time: 2000
						}, function() {
							$("#payBtn").attr("disabled", false)
						})
					} else if((objAfter.classification == "continuous")) {
						Jump('pay')
					} else {
						$("#payBtn").attr("disabled", true)
						layer.msg('您已购买过该影片，无需重复购买', {
							time: 2000
						}, function() {
							$("#payBtn").attr("disabled", false)
						})
					}

				})

			},
			error: function() {
				$("#info").html("服务器发生错误");
			}

		})
	} else if(objAfter.islogin == "false") {
		$("#userName").html("尚未登录")
		$("#userImg").attr('src', "images/acount_avatar_default.svg")
		$("#userimgHead").attr('src', "images/icon_crown_gray.svg")
		$("#countBtn").html("去登录")
		$(".changeCount").addClass("loginBtn") //登录按钮
		$("#countText").html("登录后查看优惠信息")
		/*套餐分类显示-影响支付成功界面内容显示*/
		switch(objAfter.classification) {
			case "hybrid": //单点混合
				$(".membersTitle").css("display", "none") //会员单点无需标题
				$(".movies").css("display", "block")
				$(".movieName").html(objAfter.moviesName)
				$("#movies li.moviesItem_active").each(function() {
					$("#referentialPrice").html("2.5")
					var ticN = $(this).find("span.new").html()
					$("#presentPrice").html(ticN)
				})
				break;
			case "continuous": //连包
				$("#presentPrice").html("222")
				$(".members .membersType").css("display", "block")
				break;
			case "sole": //单独购买影片
				$(".movieName").html(objAfter.moviesName)
				$(".ticketsName").html(objAfter.moviesName) //观影券名称
				$(".ticketsTime").html(objAfter.ticketsEnd) // 有效期
				$(".moviesTicket").css("display", "block")
				break;
		}
		$("#time").html(objAfter.end)

		$("#activeOpen").click(function() {
			Jump("http://www.iqiyi.com/iframe/loginreg?show_back=1")
		}) //未登录时点击激活码兑换跳转至登录页面
		$("#payBtn").click(function() {
			var val = $("#check").prop('checked')
			if(val == false) {
				$("#payBtn").attr("disabled", true)
				layer.msg('请查看并同意《服务协议》', {
					time: 2000
				}, function() {
					$("#payBtn").attr("disabled", false)
				})
			} else {
				Jump("http://www.iqiyi.com/iframe/loginreg?show_back=1")
			}

		})
	}

	/*未输入激活码时禁用激活按钮*/
	$("#inputCode").bind('input propertychange', function() {
		var inpActive = $("#inputCode").val()
		if(inpActive.length > 0) {
			$(".activeBtn").attr("disabled", false)
		} else {
			$(".activeBtn").attr("disabled", true)
		}
	})

})

/*激活码激活是否成功*/
function activeFn() {
	var diff = DateDiff(objAfter.begin, objAfter.end)
	activeTime = "2020.06.06"
	$("#inputCode").val("")
	if(diff >= 0 && diff < 30) {
		mui.toast('激活成功' + '<p class="active">会员' + activeTime + '到期</p>');
		$(".activeBtn").attr("disabled", true)
		/*$("#inputCode").attr("placeholder","请输入激活码")*/
	} else if(diff > 30) {
		mui.toast('激活码已过期');
		$(".activeBtn").attr("disabled", true)
	}
}

/*重新支付*/
function repeatFn() {
	$(".footerL.repeatFooter").css("background-color", "#929292")
}

/*是否支付成功*/
function finshFn() {
	console.log(objAfter)
	if(objAfter.payStatus == "success") {
		Jump('pay_finsh')
		/*mui.openWindow({
			url: "pay_finsh.html",
		})*/
		$("#num").html(objAfter.end)
	} else {
		$(".finshBtn").attr("disabled", true)
		layer.msg('未检查到付款信息', {
			time: 2000
		}, function() {
			$(".finshBtn").attr("disabled", false)
		})
	}
}

/*套餐点击事件*/
function membersFn() {
	for(var i = 0; i < $(this).length; i++) {
		var membersTitle = $(this).find("span.title").html(); //套餐名字
		var presentPrice = $(this).find("span.new").html(); //现价
		var referentialPrice = $(this).find("span.old").html(); // 原价
		var lastPrice = Math.abs(referentialPrice - presentPrice); // 优惠价
		$("#save").html(lastPrice)
		$("#presentPrice").html(presentPrice)
		if(lastPrice <= 0 || $(".mebersCheck input").prop("checked") == false || referentialPrice == undefined) { // 没有优惠价时不显示优惠文本
			$(".preferential").css("display", "none")
			$("#save").html(lastPrice)
		} else {
			$(".preferential").css("display", "inline-block")
			$("#referentialPrice").html(lastPrice)
			$("#save").html(lastPrice)
		}
		setData("moviesMembers", $(this).find(".moviesMembers").html()) //存储会员混点
		setData("members", $(this).find(".new").html()) //存储套餐

	}
	$(this).addClass("membersItem_active").siblings().removeClass("membersItem_active")
	$(this).addClass("moviesItem_active").siblings().removeClass("moviesItem_active")
}

/*是否勾选到期自动续费复选框*/
function membersCheckFn() {
	var value = this.checked ? 'true' : 'false';
	$.ajax({
		url: "data.json",
		type: "get",
		dataType: "json",
		success: function(data) {
			for(var i in data) {
				var content = data.discontinuous[i]
				if(value === 'false') {
					$(".membersTooltip").css("display", "block");
					$(".preferential").css("display", "none")
					$(".oldPrice").css("display", "none") //取消连包不显示原价
					// 取消连包套餐标题
					var span1 = $("span[id*=title]");
            		$.each(span1,function(i,val){
                	$("#"+val.id).html(data.discontinuous[i].title1);
            		});
            		// 套餐价格
 					var span2 = $("span[id*=new]");
            		$.each(span2,function(i,val){
                	$("#"+val.id).html(data.discontinuous[i].price);
            		});
            		var span3 = $("span[id*=old]");
            		$.each(span3,function(i,val){
                	$("#"+val.id).html(data.discontinuous[i].oldPrice);
            		});
            		// 取消连包折扣
					var span4 = $("span[id*=save]");
            		$.each(span4,function(i,val){
                	$("#"+val.id).html(data.discontinuous[0].price / 12);
            		});
            		var span5 = $("span[id*=discount]");
            		$.each(span5,function(i,val){
                	$("#"+val.id).html(data.discontinuous[1].price / 3);
            		});
					$("#members .membersItem_active").each(function() {
						var newP = $(this).find("span.new").html()
						var oldP = $(this).find("span.old").html()
						$("#presentPrice").html(newP) // 取消连包总价
						$("#save").html(Math.abs(oldP - newP)) // 优惠价格
					})

				} else {
					$(".membersTooltip").css("display", "none");
					$(".membersItem").css("padding", "0");
					$(".preferential").css("display", "inline-block")
					$(".members").css("margin-bottom", "12px");
					$(".oldPrice").css("display", "block") //显示；连包原价
					// 连包标题
					var span1 = $("span[id*=title]");
            		$.each(span1,function(i,val){
                	$("#"+val.id).html(data.continuous[i].title1);
            		});
            		// 连包价格
 					var span2 = $("span[id*=new]");
            		$.each(span2,function(i,val){
                	$("#"+val.id).html(data.continuous[i].price);
            		});
            		// 连包原价
            		var span3 = $("span[id*=old]");
            		$.each(span3,function(i,val){
                	$("#"+val.id).html(data.continuous[i].oldPrice);
            		});
            		// 连包折扣
					var span4 = $("span[id*=save]");
            		$.each(span4,function(i,val){
                	$("#"+val.id).html(data.continuous[0].price / 12);
            		});
            		var span5 = $("span[id*=discount]");
            		$.each(span5,function(i,val){
                	$("#"+val.id).html((data.continuous[1].price / 3).toFixed(2));
            		});
					$("#members .membersItem_active").each(function() {
						var newP = $(this).find("span.new").html()
						var oldP = $(this).find("span.old").html()
						$("#presentPrice").html(newP)
						$("#referentialPrice").html(oldP - newP) // 优惠价格
						$("#num").html("12")
					})
				}
			}
		}
	})

}

function returnIndexFn() {
	mui.back({
		url: 'index.html', //通过URL传参
	})
}
/*服务协议*/
function agreementFn() {
	Jump('aggrement')
}

/*激活码格式*/
function inputCodeUp(e) {
	var inputCode = document.getElementById("inputCode");
	var val = inputCode.value;
	var str = val.split("")
	var targetStr = str[str.length - 1];
	if(targetStr == '-') {
		inputCode.value = val.substring(0, val.length - 1);
	} else if((event.keyCode == 8) && ((val.length + 1) % 5 == 0)) {
		inputCode.value = val.substring(0, val.length - 1);
	} else
	if((val != '-' && event.keyCode != 8)) {
		if(val.length % 5 == 0) {
			var strs = '';
			for(var i = 0; i < str.length - 1; i++) {
				strs += str[i];
			}
			inputCode.value = strs + "-" + targetStr;
		}
	}
}