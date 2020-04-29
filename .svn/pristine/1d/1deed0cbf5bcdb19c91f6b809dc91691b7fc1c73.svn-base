function addDate(date,days){ 
       var d=new Date(date); 
       d.setDate(d.getDate()+days); 
       var m=d.getMonth()+1; 
       return d.getFullYear()+'.'+m+'.'+d.getDate(); 
     } 
function DateDiff(sDate1, sDate2) { //sDate1和sDate2是2006.12.18格式
	var aDate, oDate1, oDate2, iDays
	aDate = sDate1.split(".")
	oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2006格式 
	aDate = sDate2.split(".")
	oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
	iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数 
	return iDays
}
//时间比较
function compareTime(startTime, endTime) {
	var startDate = startTime.substring(0, 10).split('-');
	var endDate = endTime.substring(0, 10).split('-');
	var startNum = startDate[1] + '-' + startDate[2] + '-' + startDate[0] + ' ' + startTime.substring(10, 16);
	var endNum = endDate[1] + '-' + endDate[2] + '-' + endDate[0] + ' ' + endTime.substring(10, 16);
	var disparityTime = (Date.parse(endNum) - Date.parse(startNum)) / 3600 / 1000;
	if(Number(disparityTime) < 0) {
		return false;
	} else {
		return true;
	}
}
// 存储对象
function storageObj(obj) {
	var checkedIdStr = JSON.stringify(obj);
	sessionStorage.setItem("key", checkedIdStr);
};
//将数据存储到本地缓存
function setData(type, value) {
	sessionStorage.setItem(type, value);
	// localStorage.setItem(type, value);
}
//取出缓存数据
function getData(type) {
	return sessionStorage.getItem(type);

}
//删除缓存数据
function ret(type) {
	sessionStorage.removeItem(type);
}

//跳转
function Jump(el) {
	mui.openWindow({
		url: el + ".html",
		id: el
	})
}