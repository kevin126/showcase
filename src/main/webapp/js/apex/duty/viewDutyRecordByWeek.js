function previousWeek(){
	var curMonday = $("#startDate").html();
	var curMondayValue = new Date(Date.parse(curMonday.replace(/-/g,   "/"))).getTime(); 
	var preMondayValue = curMondayValue - 7*86400000;
	var preMonday = ChangeDateToString(new Date(preMondayValue));
	location.href = "/itsm/duty/viewDutyRecordByWeek.do?startDate="+preMonday;
	
}

function nextWeek(){
	var curSunday = $("#endDate").html();
	var curSundayValue = new Date(Date.parse(curSunday.replace(/-/g,   "/"))).getTime(); 
	var nextMondayValue = curSundayValue + 86400000;
	var nextMonday = ChangeDateToString(new Date(nextMondayValue));
	location.href = "/itsm/duty/viewDutyRecordByWeek.do?startDate="+nextMonday;
}

function currWeek(){
	location.href = "/itsm/duty/viewDutyRecordByWeek.do?startDate=";
}
function ChangeDateToString(DateIn) {
	var Year = 0;
	var Month = 0;
	var Day = 0;

	var CurrentDate = "";

	//初始化时间  
	Year = DateIn.getFullYear();
	Month = DateIn.getMonth() + 1;
	Day = DateIn.getDate();

	CurrentDate = Year + "-";
	if (Month >= 10) {
		CurrentDate = CurrentDate + Month + "-";
	} else {
		CurrentDate = CurrentDate + "0" + Month + "-";
	}
	if (Day >= 10) {
		CurrentDate = CurrentDate + Day;
	} else {
		CurrentDate = CurrentDate + "0" + Day;
	}

	return CurrentDate;
}  