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
$(function() {

	var objAfter = JSON.parse(sessionStorage.getItem("key")); //获取存储的session对象
	var members = getData("members") //套餐
	var moviesMembers = getData("moviesMembers") //会员混合单点
	$.ajax({
		url: "data.json",
		type: "get",
		dataType: "json",
		success: function(data) {
			if(objAfter.isvip == "false") {
				$(".package").addClass("payPackage") // 支付成功页面会员权益信息
				switch(objAfter.classification) {
					case "continuous":
						$(".dealWith .package").css("display", "block") //显示会员权益
						$(".dealWith .payFinshed").addClass("non-members")
						$(".Ticket").css("display", "none")
						$(".membersSuccess").css("display", "block") //单独购买会员只显示会员购买成功信息
						$("#memberstime").html(objAfter.end) //会员到期时间
						if(members == data.continuous[0].price || members == data.discontinuous[0].price) { //连续包年	
							$("#mon").prepend("12") //包年购买
						} else if(members == data.continuous[1].price || members == data.discontinuous[1].price) { //连续包季
							$("#mon").prepend("3") //包季购买
						} else if(members == data.continuous[2].price || members == data.discontinuous[2].price) {
							$("#mon").prepend("1") //包月购买	
						} else {
							$("#mon").prepend("12")
						}
						break;
					case "hybrid":
						$(".ticketsName").html(objAfter.moviesName)
						$(".ticketsTime").html(objAfter.ticketsEnd)
						$(".Ticket").css("display", "block") //显示观影券购买成功
						$("#time").html(objAfter.end)
						if(moviesMembers == data.hybrid[0].title1) {
							$(".dealWith .package").css("display", "block") //显示会员权益
							$(".membersAndTicket").css("display", "block") //显示会员混合点击购买成功
							$(".dealWith .payFinshed").addClass("non-members")
							$("#num").prepend("12") //
						} else if(moviesMembers == data.hybrid[1].title1) {
							$(".dealWith .package").css("display", "block") //显示会员权益
							$(".membersAndTicket").css("display", "block") //显示会员混合点击购买成功
							$(".dealWith .payFinshed").addClass("non-members")
							$("#num").prepend("1") //单月购买
						} else {
							$(".dealWith").addClass("soleWaiting")
							$("#num").prepend("12") //单月购买
						}
						break;
				}
			} else {
				$(".Ticket").css("display", "block") //显示观影券购买成功
				$(".ticketsName").html(objAfter.moviesName)
				$(".ticketsTime").html(objAfter.ticketsEnd)
			}
		}
	})
})