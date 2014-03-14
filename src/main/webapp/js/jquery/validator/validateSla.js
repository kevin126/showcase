/**
 * 创建或编辑时，对普通输入域的验证
 */
 function validateCommonDataFormat(){
 	$.formValidator.initConfig({
		formid : "slaForm",
		onerror : function(msg) {
			checkSpecailField();
			return false;
		},
		onsuccess : function() {
			var result = checkSpecailField();
			if(result){
				document.getElementById('slaForm').submit();
				$("#submitButton").attr("disabled", true);
			}
			return false;
		}
	});
	$("#slaName").formValidator({
		onshow : '请输入SLA名称',
		onfocus : '必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 1,
		max : 50,
		onerror : 'SLA名称不能为空，且最大长度为50' 
	});
	$("#firstName").formValidator({
		onshow : '请输入甲方名称',
		onfocus : '必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 1,
		max : 20,
		onerror : '甲方名称不能为空，且最大长度为20' 
	});
	$("#firstRepresentative").formValidator({
		onshow : '请输入授权代表',
		onfocus : '必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 1,
		max : 20,
		onerror : '授权代表不能为空，且最大长度为20' 
	});
	$("#firstDuty").formValidator({
		onshow : '请输入职务',
		onfocus : '必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 1,
		max : 20,
		onerror : '职务不能为空，且最大长度为20' 
	});
	$("#secondName").formValidator({
		onshow : '请输入乙方名称',
		onfocus : '必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 1,
		max : 20,
		onerror : '乙方名称不能为空，且最大长度为20' 
	});
	$("#secondRepresentative").formValidator({
		onshow : '请输入授权代表',
		onfocus : '必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 1,
		max : 20,
		onerror : '不能为空，且最大长度为20' 
	});
	$("#secondDuty").formValidator({
		onshow : '请输入职务',
		onfocus : '必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 1,
		max : 20,
		onerror : '不能为空，且最大长度为20' 
	});
	$("#reportTitle").formValidator({
		onshow : '请输入报告标题',
		onfocus : '必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 1,
		max : 100,
		onerror : '不能为空，且最大长度为100' 
	});
	$("#reportReceiver").formValidator({
		onshow : '请选择报告接收者',
		onfocus : '必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 1,
		onerror : '不能为空' 
	});
	
	$("#rquestUser").formValidator({
		onshow : '请选择请求用户',
		onfocus : '非必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 0,
		max : 20000,
		onerror : '不超过20000字符' 
	});
	
	$("#department").formValidator({
		onshow : '请选择部门',
		onfocus : '非必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 0,
		max : 20000,
		onerror : '不超过20000字符' 
	});
	
	$("#incidentType").formValidator({
		onshow : '请选择故障类型',
		onfocus : '非必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 0,
		max : 20000,
		onerror : '不超过20000字符' 
	});
	
	
	$("#description").formValidator({
		onshow : '请输入详细信息',
		onfocus : '非必填',
		oncorrect : '合法' 
	}).inputValidator({
		min : 0,
		max : 20000,
		onerror : '不超过20000字符' 
	});
 }
 /**
  * 创建或编辑SLA时，多特殊输入域的验证
  */
function validateSpecailDataFormat(){
	var daysParams = new Array();
	//为解决时间的各输入域注册"focus"事件
	daysParams.push('resolveTimeTip');
	daysParams.push('onFocus');
	daysParams.push('请输入天数');
	$("#resolveDays").bind("focus",daysParams,handleFocusEvent);

	var hoursParams = new Array();
	hoursParams.push('resolveTimeTip');
	hoursParams.push('onFocus');
	hoursParams.push('请输入小时数');
	$("#resolveHours").bind("focus",hoursParams,handleFocusEvent);
	
	var minutesParams = new Array();
	minutesParams.push('resolveTimeTip');
	minutesParams.push('onFocus');
	minutesParams.push('请输入分钟数');
	$("#resolveMinutes").bind("focus",minutesParams,handleFocusEvent);
	
	
	//为检测周期的各输入域注册"focus"事件
	var pollDaysParams = new Array();
	pollDaysParams.push('pollCycleTip');
	pollDaysParams.push('onFocus');
	pollDaysParams.push('请输入天数');
	$("#pollCycleDays").bind("focus",pollDaysParams,handleFocusEvent);

	var pollHoursParams = new Array();
	pollHoursParams.push('pollCycleTip');
	pollHoursParams.push('onFocus');
	pollHoursParams.push('请输入小时数');
	$("#pollCycleHours").bind("focus",pollHoursParams,handleFocusEvent);
	
	var pollMinutesParams = new Array();
	pollMinutesParams.push('pollCycleTip');
	pollMinutesParams.push('onFocus');
	pollMinutesParams.push('请输入分钟数');
	$("#pollCycleMinutes").bind("focus",pollMinutesParams,handleFocusEvent);
	
	
	//为有效期的开始时间注册"focus"事件
	var startParams = new Array();
	startParams.push('validTimeTip');
	startParams.push('onFocus');
	startParams.push('必填');
	$("#startTime").bind("focus",startParams,handleFocusEvent);
	
	//为有效期的结束时间注册"focus"事件
	var endParams = new Array();
	endParams.push('validTimeTip');
	endParams.push('onFocus');
	endParams.push('为空代表永久有效');
	$("#endTime").bind("focus",endParams,handleFocusEvent);
	
	//为解决时间的各输入域注册blur事件
	$("#resolveDays").bind("blur",handleResolveBlurEvent);
	$("#resolveHours").bind("blur",handleResolveBlurEvent);
	$("#resolveMinutes").bind("blur",handleResolveBlurEvent);
	
	//为检测周期的各输入域注册blur事件
	$("#pollCycleDays").bind("blur",handlePollCycleBlurEvent);
	$("#pollCycleHours").bind("blur",handlePollCycleBlurEvent);
	$("#pollCycleMinutes").bind("blur",handlePollCycleBlurEvent);
	
	//为有效期的各输入域注册blur事件
	$("#startTime").bind("blur",handleValidBlurEvent);
	$("#endTime").bind("blur",handleValidBlurEvent);
	
	//为各个邮件规则注册focus事件
	for(var i=1;i<5;i++){
		var dayParams = new Array();
		dayParams.push(i);
		dayParams.push('请输入天数');
		$("#thresholdDays"+i).bind("focus",dayParams,handleEmailRuleFocus);
		
		var hourParams = new Array();
		hourParams.push(i);
		hourParams.push('请输入小时数');
		$("#thresholdHours"+i).bind("focus",hourParams,handleEmailRuleFocus);
		
		var receiveParams = new Array();
		receiveParams.push(i);
		receiveParams.push('请选择邮件接收者');
		$("#emailReceiver"+i).bind("focus",receiveParams,handleEmailRuleFocus);
	}
	
   //为各个邮件规则注册blur事件
	for(var i=1;i<5;i++){
		var params = new Array();
		params.push(i);
		$("#thresholdDays"+i).bind("blur",params,handleEmailRuleBlur);
		$("#thresholdHours"+i).bind("blur",params,handleEmailRuleBlur);
		$("#emailReceiver"+i).bind("blur",params,handleEmailRuleBlur);
	}
	
}

/**
 * 响应格式检查的onfocus事件
 */
function handleFocusEvent(event){
	var params = event.data;
	setInfoForFixedField(params[0],params[1],params[2]);
}

/**
 * 响应解决时间的blur事件
 */
function handleResolveBlurEvent(){
	var result = checkResolveValid();
	if(result != true){
		$('#resolveTimeTip').attr("class","onError");
		$('#resolveTimeTip').text(result);
	}else{
		$('#resolveTimeTip').attr("class","onCorrect");
		$('#resolveTimeTip').text('合法');
	}
}

/**
 * 响应检测周期的blur事件
 */
function handlePollCycleBlurEvent(){
	var result = checkPollCycleValid();
	if(result != true){
		$('#pollCycleTip').attr("class","onError");
		$('#pollCycleTip').text(result);
	}else{
		$('#pollCycleTip').attr("class","onCorrect");
		$('#pollCycleTip').text('合法');
	}
}

/**
 * 检查解决时间的各输入域是否合法,如果全部正确，返回true,如果出错，则返回具体的错误信息
 */
function checkResolveValid(){
	var days = $("#resolveDays").val();
	var hours = $("#resolveHours").val();
	var minutes = $("#resolveMinutes").val();
	if(Ext.isEmpty(days) && Ext.isEmpty(hours) && Ext.isEmpty(minutes)){
		return '解决时间不能为空';
	}
	if(!Ext.isEmpty(hours) && hours>=24){
		return '小时数应小于24';
	}
	if(!Ext.isEmpty(minutes) && minutes>=60){
		return '分钟数应小于60';
	}
	if(days == 0 && hours == 0 && minutes == 0){
		return '解决时间不能为0';
	}
	return true;
}


/**
 * 检查检测周期的各输入域是否合法,如果全部正确，返回true,如果出错，则返回具体的错误信息
 */
function checkPollCycleValid(){
	var days = $("#pollCycleDays").val();
	var hours = $("#pollCycleHours").val();
	var minutes = $("#pollCycleMinutes").val();
	var emailRuleEmpty = isEmailRuleEmpty();
	if(Ext.isEmpty(days) && Ext.isEmpty(hours) && Ext.isEmpty(minutes) && emailRuleEmpty == false){
		return '检测周期不能为空';
	}
	if(!Ext.isEmpty(hours) && hours>=24){
		return '小时数应小于24';
	}
	if(!Ext.isEmpty(minutes) && minutes>=60){
		return '分钟数应小于60';
	}
	if(days == 0 && hours == 0 && minutes == 0 && !Ext.isEmpty(days)){
		return '检测周期不能为0';
	}
	return true;
}
/**
 * 响应有效期的blur事件,如果全部正确，返回true,如果出错，则返回具体的错误信息
 */
function handleValidBlurEvent(){
	var result = checkExpireValid();
	if(result != true){
		$('#validTimeTip').attr("class","onError");
		$('#validTimeTip').text(result);
	}else{
		$('#validTimeTip').attr("class","onCorrect");
		$('#validTimeTip').text('合法');
	}
}

/**
 * 检查有效期的格输入域是否正确,如果全部正确，返回true,如果出错，则返回具体的错误信息
 */
function checkExpireValid(){
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	if(Ext.isEmpty(startTime))
		return '开始日期不能为空'
	if(!Ext.isEmpty(endTime)){
		var startDate = new Date(Date.parse(startTime.replace(/-/g,   "/")));
		var endDate = new Date(Date.parse(endTime.replace(/-/g,   "/")));
		if(endDate.getTime() <= startDate.getTime())
			return '结束日期应晚于开始日期';
	}
	return true;
}

/**
 * 检查四个邮件规则是否完整，如果全都完整就返回true,否则返回错误规则的序号以及具体错误信息
 */
function checkEmailRulesValid(){
	var reslut = new Array();
	for(var i=1;i<5;i++){
		var temp = checkOneRuleValid(i);
		if(temp != true){
			reslut.push(i);
			reslut.push(temp);
			return reslut;
		}
	}
	return true;
}

function checkOneRuleValid(index){
	var days = $("#thresholdDays"+index).val();
	var hours = $("#thresholdHours"+index).val();
	var receivers = $("#emailReceiver"+index).val();
	if(!Ext.isEmpty(days) || !Ext.isEmpty(hours) || !Ext.isEmpty(receivers)){
		if(!Ext.isEmpty(hours) && hours >=24){
			return '小时数应小于24';
		}
		if(Ext.isEmpty(days) && Ext.isEmpty(hours)){
			return '时间阈值不能为空';
		}
		if(parseInt(days)==0 && parseInt(hours) == 0){
			return '时间阈值不能为0';
		}
		if(Ext.isEmpty(receivers)){
			return '邮件收件人不能为空';
		}
	}
	return true;
}

/**
 * 响应邮件规则的focus事件
 */
function handleEmailRuleFocus(event){
	var params = event.data;
	$("#emailRuleTip"+params[0]).attr("class","onFocus");
	$("#emailRuleTip"+params[0]).text(params[1]);
}
/**
 * 响应邮件规则的blur事件
 */
function handleEmailRuleBlur(event){
	var params = event.data;
	var index = params[0];
	var result = checkOneRuleValid(index);
	if(result != true){
		$("#emailRuleTip"+params[0]).attr("class","onError");
		$("#emailRuleTip"+params[0]).text(result);
	}else{
		$("#emailRuleTip"+params[0]).attr("class","onCorrect");
		$("#emailRuleTip"+params[0]).text('合法');
	}
}

/**
 * 检查所有的特殊字段的合法性
 */
function checkSpecailField(){
	var returnValue = true;
	var result1 = checkResolveValid();
	if(result1 != true){
		$('#resolveTimeTip').attr("class","onError");
		$('#resolveTimeTip').text(result1);
		returnValue = false;
	}else{
		$('#resolveTimeTip').attr("class","onCorrect");
		$('#resolveTimeTip').text('合法');
	}
	var result2 = checkExpireValid();
	if(result2 != true){
		$('#validTimeTip').attr("class","onError");
		$('#validTimeTip').text(result2);
		returnValue = false;
	}else{
		$('#validTimeTip').attr("class","onCorrect");
		$('#validTimeTip').text("合法");
	}
	var result3 = checkPollCycleValid();
	if(result3 != true){
		$('#pollCycleTip').attr("class","onError");
		$('#pollCycleTip').text(result3);
		returnValue = false;
	}else{
		$('#pollCycleTip').attr("class","onCorrect");
		$('#pollCycleTip').text('合法');
	}
	for(var i=1;i<5;i++){
		var result4 = checkOneRuleValid(i);
		if(result4 != true){
			$('#emailRuleTip'+i).attr("class","onError");
			$('#emailRuleTip'+i).text(result4);
			returnValue = false;
		}else{
			$('#emailRuleTip'+i).attr("class","onCorrect");
			$('#emailRuleTip'+i).text('合法');
		}
	}
	var pollCycleEmpty = isPollCycleEmpty();
	var emailRuleEmpty = isEmailRuleEmpty();
	if(pollCycleEmpty == true && emailRuleEmpty == false){
		$('#pollCycleTip').attr("class","onError");
		$('#emailRuleTip').text("邮件规则不为空时，需设置检测周期");
		returnValue = false;
	}else if(pollCycleEmpty == false && emailRuleEmpty == true){
		if($('#pollCycleTip').attr('class') != 'onError'){
			$('#pollCycleTip').attr("class","onError");
			$('#pollCycleTip').text("检测周期不为空时，需设置邮件规则");
		}
		returnValue = false;
	}else{
		$('#pollCycleTip').attr("class","onCorrect");
		$('#pollCycleTip').text('合法');
	}
	
	if(isPollCycleAllZero()){
		$('#pollCycleTip').attr("class","onError");
		$('#pollCycleTip').text("检测周期不能全为0");
	}
	return returnValue;
}

/**
 * 设置指定域的提示信息
 */
function setInfoForFixedField(fiedId,className,message){
	$("#"+fiedId).attr("class",className);
	$("#"+fiedId).text(message);
}
/**
 * 判断检查周期是否为空
 */
function isPollCycleEmpty(){
	var days = $("#pollCycleDays").val();
	var hours = $("#pollCycleHours").val();
	var minutes = $("#pollCycleMinutes").val();
	if(Ext.isEmpty(days) && Ext.isEmpty(hours) && Ext.isEmpty(minutes))
		return true;
	else
		return false;
}
/**
 * 判断检查周期是否全为0
 */
function isPollCycleAllZero(){
	if($("#pollCycleDays").text().trim() == "" && $("#pollCycleHours").text().trim() == "" && $("#pollCycleMinutes").text().trim() == ""){
		return false;
	}else{
		var days = $("#pollCycleDays").val();
		var hours = $("#pollCycleHours").val();
		var minutes = $("#pollCycleMinutes").val();
		if(0 == days && 0 == hours && 0 == minutes)
			return true;
		else
			return false;
	}
}

/**
 * 判断邮件规则是否为空
 */
function isEmailRuleEmpty(){
	for(var i=1;i<5;i++){
		var tempResult = isOneRuleEmpty(i);
		if(!tempResult)
			return false
	}
	return true;
}
/**
 * 判断某一个邮件规则是否为空
 */
function isOneRuleEmpty(index){
	var days = $("#thresholdDays"+index).val();
	var hours = $("#thresholdHours"+index).val();
	var receivers = $("#emailReceiver"+index).val();
	if(Ext.isEmpty(days) && Ext.isEmpty(hours) && Ext.isEmpty(receivers))
		return true;
	else
		return false;
	
}

$(document).ready(function(){
	validateCommonDataFormat();
	validateSpecailDataFormat();
});
