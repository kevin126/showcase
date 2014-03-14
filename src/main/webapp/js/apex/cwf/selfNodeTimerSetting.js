$(function(){
	if($("#dayClock").val()==0)
		$("#dayClock").val("");
	if($("#hourClock").val()==0)
		$("#hourClock").val("");
	if($("#minuteClock").val()==0)
		$("#minuteClock").val("");
	if($("#dayDuedate").val()==0)
		$("#dayDuedate").val("");
	if($("#hourDuedate").val()==0)
		$("#hourDuedate").val("");
	if($("#minuteDuedate").val()==0)
		$("#minuteDuedate").val("");
	if($("#dayRepeat").val()==0)
		$("#dayRepeat").val("");
	if($("#hourRepeat").val()==0)
		$("#hourRepeat").val("");
	if($("#minuteRepeat").val()==0)
		$("#minuteRepeat").val("");
	if($("#clockTimerDisable").attr("checked")==true){//计时定时器禁用
		setClockTimerUsable(true);
	}
	if($("#actionTimerDisable").attr("checked")==true){//动作定时器禁用
		setActionTimerUsable(true)
	}
})

/**
 * 启用计时定时器
 */
function enableClockTimer(){
	if($("#clockTimerEnable").attr("checked")==true){
		setClockTimerUsable(false);
	}else{
		setClockTimerUsable(true);
	}
}

/**
 * 禁用计时定时器
 */
function disableClockTimer(){
	if($("#clockTimerDisable").attr("checked")==true){
		setClockTimerUsable(true);
	}else{
		setClockTimerUsable(false);
	}
}

/**
 * 启用动作定时器
 */
function enableActionTimer(){
	if($("#actionTimerEnable").attr("checked")==true){
		setActionTimerUsable(false);
	}else{
		setActionTimerUsable(true);
	}
}

/**
 * 禁用动作定时器
 */
function disableActionTimer(){
	if($("#actionTimerDisable").attr("checked")==true){
		setActionTimerUsable(true);
	}else{
		setActionTimerUsable(false);
	}
}

/**
 * 设置计时定时器各属性的可用性
 */
function setClockTimerUsable(trueOrFalse){
	$("#dayClock").attr("disabled",trueOrFalse);
	$("#hourClock").attr("disabled",trueOrFalse);
	$("#minuteClock").attr("disabled",trueOrFalse);
	$("#transitionName").attr("disabled",trueOrFalse);
}

/**
 * 设置动作定时器各属性的可用性
 */
function setActionTimerUsable(trueOrFalse){
	$("#dayDuedate").attr("disabled",trueOrFalse);
	$("#hourDuedate").attr("disabled",trueOrFalse);
	$("#minuteDuedate").attr("disabled",trueOrFalse);
	$("#dayRepeat").attr("disabled",trueOrFalse);
	$("#hourRepeat").attr("disabled",trueOrFalse);
	$("#minuteRepeat").attr("disabled",trueOrFalse);
	$("#excuteEmail").attr("disabled",trueOrFalse);
	$("#excuteMessage").attr("disabled",trueOrFalse);
	$("#excutePrompt").attr("disabled",trueOrFalse);
}

function saveNodeTimerSetting(){
	if(validateNodeTimerSetting()){
		var nodeTimerSetting = {};
		nodeTimerSetting.nodeName = $("#nodeName_hidden").val();
		nodeTimerSetting.actionTimerEnable = $("#actionTimerEnable").attr("checked");
		nodeTimerSetting.dayDuedate = $("#dayDuedate").val();
		nodeTimerSetting.hourDuedate = $("#hourDuedate").val();
		nodeTimerSetting.minuteDuedate = $("#minuteDuedate").val();
		nodeTimerSetting.dayRepeat = $("#dayRepeat").val();
		nodeTimerSetting.hourRepeat = $("#hourRepeat").val();
		nodeTimerSetting.minuteRepeat = $("#minuteRepeat").val();
		nodeTimerSetting.excuteEmail = $("#excuteEmail").attr("checked");
		nodeTimerSetting.excuteMessage = $("#excuteMessage").attr("checked");
		nodeTimerSetting.excutePrompt = $("#excutePrompt").attr("checked");
		nodeTimerSetting.clockTimerEnable = $("#clockTimerEnable").attr("checked");
		nodeTimerSetting.dayClock = $("#dayClock").val();
		nodeTimerSetting.hourClock = $("#hourClock").val();
		nodeTimerSetting.minuteClock = $("#minuteClock").val();
		nodeTimerSetting.transitionName = $("#transitionName").val();
		CwfService.saveSelfNodeTimerSetting(nodeTimerSetting,{
			callback : function(nodeTimerSettings){
					parent.nodeTimerSettings_total = nodeTimerSettings;
					art.dialog.close();
				},
			errorHandler : function(errorString, exception) {
				art.dialog({
					    content: exception.message,
					    yesFn: true
					});
			}
		})
	}
}

/**
 * 验证节点定时器输入是否合法
 */
function validateNodeTimerSetting(){
	if($("#clockTimerEnable").attr("checked")==true){
		var dayClockInvalid = $("#dayClock").val().trim()=='' || Number($("#dayClock").val())==0;
		var hourClockInvalid = $("#hourClock").val().trim()=='' || Number($("#hourClock").val())==0
		var minuteClockInvalid = $("#minuteClock").val().trim()=='' || Number($("#minuteClock").val())==0
		if(dayClockInvalid && hourClockInvalid && minuteClockInvalid){
			$('#clockTimerTip').attr("class","onError");
			$('#clockTimerTip').text("请输入超过时间");
			return false;
		}
	}
	if($("#actionTimerEnable").attr("checked")==true){
		var dayDuedateInvalid = $("#dayDuedate").val().trim()=='' || Number($("#dayDuedate").val())==0;
		var hourDuedateInvalid = $("#hourDuedate").val().trim()=='' || Number($("#hourDuedate").val())==0
		var minuteDuedateInvalid = $("#minuteDuedate").val().trim()=='' || Number($("#minuteDuedate").val())==0
		if(dayDuedateInvalid && hourDuedateInvalid && minuteDuedateInvalid){
			$('#duedateTimerTip').attr("class","onError");
			$('#duedateTimerTip').text("请输入延后时间");
			return false;
		}
		if($("#excuteEmail").attr("checked")==false && $("#excuteMessage").attr("checked")==false && $("#excutePrompt").attr("checked")==false){
			$('#actionTimerTip').attr("class","onError");
			$('#actionTimerTip').text("请选择执行的动作");
			return false;
		}
	}
	
	if($("#actionTimerEnable").attr("checked")==true && $("#clockTimerEnable").attr("checked")==true){
		var dayClock = $("#dayClock").val().trim()==''?0:Number($("#dayClock").val());
		var hourClock = $("#hourClock").val().trim()==''?0:Number($("#hourClock").val());
		var minuteClock = $("#minuteClock").val().trim()==''?0:Number($("#minuteClock").val());
		var timeClock = dayClock*24*60+hourClock*60+minuteClock;
		
		var dayDuedate = $("#dayDuedate").val().trim()==''?0:Number($("#dayDuedate").val());
		var hourDuedate = $("#hourDuedate").val().trim()==''?0:Number($("#hourDuedate").val());
		var minuteDuedate = $("#minuteDuedate").val().trim()==''?0:Number($("#minuteDuedate").val());
		var timeDuedate  = dayDuedate*24*60+hourDuedate*60+minuteDuedate;
		if(timeClock==timeDuedate){
			$('#totalTimerTip').attr("class","onError");
			$('#totalTimerTip').text("计时定时器与动作定时的延迟时间不能相同");
			return false;
		}
	}
	return true;
}