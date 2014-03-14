/**
 * 创建工单模块的验证
 */
 
 
function DateUtil(){
	this.getNowDateTime =function (){
		var datetime = new Date();
		var timeStr = '';
		
		if(window.navigator.appName=='Netscape') {
	        timeStr += (datetime.getYear()+1900) +'-'; 
	    }else {
         	timeStr += datetime.getYear() +'-'; 
	    } 
		timeStr += (datetime.getYear()+1900) +'-'; 
		timeStr +=(datetime.getMonth()+1)+'-';
		timeStr +=(datetime.getDay()+1)+' ';
		timeStr +=datetime.getHours()+':';
		timeStr +=datetime.getMinutes()
		return timeStr;
	}
	
	//将 日期格式为 yyyy-MM-dd mm:ss 2009-10-10 10:10 转化为  2009-10-10 10:10:00
	this.getDateTime = function(dateStr){
		dateStr +=":00";	 
		return new Date(Date.parse(dateStr.replace(/-/g, "/")));
	}
	
	//和当前时间比较 比当前时间大返回true 比当前时间小返回false
	this.compareWithNow =function(datestr){
		this.getDateTime(dateStr);
		var now = new Date();
		return this.compare(date ,now);		 		
	}
	
	//传入两个时间比较 比当第一个大返回true 第一个时间小返回false
	this.compareDate = function(starStr, endStr){
		//alert(starStr+"   "+ endStr);
		var start = this.getDateTime(starStr);
		var end = this.getDateTime(endStr);
		return this.compare(start ,end);
	}
	
	this.compare = function (start ,end){	 		
		if(start.getTime()> end.getTime()){
		 	return true;//开始时间大
		}else{
			return false;//开始前时间小
		}
	}
	/**
	*data = {
		start: "", 进行比较的两个日期的开始
		end :""  , 进行比较的两个日期的结束
		tipid:"" , 错误信息显示div标签id
		info :""   信息
	}
	*	
	*/
	
	this.validatorDateTime = function(data){
		try{
		
			if(data){				 
				//var obj = $("#planedStartTime").value; obj==undefine why?
				var obj;//失败后的焦点;
				var startObj = document.getElementById(data.start);
				var endObj = document.getElementById(data.end);
				var tip = document.getElementById(data.tipid);
				if(!startObj && !endObj){
					return false;//传入起始都为空
				}
				var start;
				var end;
				if(startObj){
					start = startObj.value;//开始时间
				}else{
					start = this.getNowDateTime();//传为空时取当前时间
				}
				
				if(endObj){
					end = endObj.value;//结束时间
				}else{
					end = this.getNowDateTime();//传为空时取当前时间
				}			 
				
				if(this.compareDate(start,end)){//传入比较开始的比结束的大 返回false并显示错误信息					
					//obj.focus();
					tip.focus();
					tip.innerHTML = data.info;					
				 	tip.className = "onError";
				 	return false;
				}else{
					return true;//传入比较开始的比结束的小 合法 返回true;		
				}
			}
			
		}catch(e){
			return false;
		}
	}
}
function validatorPlanedStartTime(){
	
	var flag = true;
	var st = document.getElementById('planedStartTime');
	if($.trim(st.value)==''){
		document.getElementById('planedStartTimeTip').className="onError";
		document.getElementById('planedStartTimeTip').innerHTML="计划开始时间不得为空！";
		flag= false;
	}else{
			document.getElementById('planedStartTimeTip').className="onCorrect";
	}
	
	var et = document.getElementById('planedFinishTime');
	if($.trim(et.value)==''){
		document.getElementById('planedFinishTimeTip').className="onError";
		document.getElementById('planedFinishTimeTip').innerHTML="计划结束时间不得为空！";
		flag= false;
	}else{
		document.getElementById('planedFinishTimeTip').className="onCorrect";
	}
	
	var dateUtil = new DateUtil();
	
	var valids = dateUtil.validatorDateTime({
		tipid :'planedStartTimeTip',
		end: "planedStartTime",//id
		   //id 传入""时为空时end去当前时间
		  
		info :"计划开始时间不能早于当前时间！"  //信息
	});
	 
	if(!valids){flag= false;}
	
	var valids = dateUtil.validatorDateTime({
		tipid :'planedFinishTimeTip',
		end: "planedFinishTime",//id					 
		info :"计划结束时间不能早于当前时间！"  //信息
	});
	if(!valids){flag= false;}
	 
	var valids = dateUtil.validatorDateTime({
		tipid :'planedStartTimeTip',
		start: "planedStartTime",//id
		end :"planedFinishTime",  //id 传入""时为空时end去当前时间
		info :"计划开始时间不能晚于计划结束时间！"  //信息
	});
	if(!valids){flag= false;}
	
	
	return flag;			
}
 

$(document).ready(function() {	
	// $.formValidator.initConfig({onerror:function(){alert("校验没有通过，具体错误请看错误提示")}});
	$.formValidator.initConfig({
		formid : "issueForm",
		wideword : false,
		onerror : function(msg) {
			validatorPlanedStartTime();
			return false;
		},
		onsuccess : function() {
			return validatorPlanedStartTime();		
		}
	});
	
	
	$("#requestUser").formValidator({
		onshow : JS_I18N.issue_please_input_request_user,//请填写请求用户
		onfocus : JS_I18N.issue_request_user_Not_null,//"用户不得为空",
		oncorrect : JS_I18N.issue_legal //合法"
	}).inputValidator({
		onerror : JS_I18N.issue_request_user_Not_null //"用户不得为空"
	}).defaultPassed();;
	
	$("#department").formValidator({
		onshow : "请填写部门！",
		onfocus : "部门必填， 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 30,
		onerror : "部门必填，最多30个字符！"
	}).defaultPassed();
	
	$("#phone").formValidator({
		onshow : "请填写联系电话！",
		onfocus : "联系电话必填， 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 30,
		onerror : "联系电话必填， 最多30个字符！"
	}).defaultPassed();
	
	$("#email").formValidator({
					onshow : "请填写邮箱！",
					onfocus : "邮箱非必填, 最多100个字符！",
					oncorrect : "合法！"
				}).inputValidator({
					min : 0,
					max : 100,
					onerror : "邮箱非必填, 最多100个字符！"
				}).functionValidator({
					fun : function(val){
						if(val != ''){
							if(val.match(regexEnum.email)){
								return true;
							}
							return false;
						}else{
							return true;
						}
					},
					onerror : "邮箱格式不正确！"
				}).defaultPassed();
	 
	$("#address").formValidator({
		onshow : "请填写地点！",
		onfocus : "地点非必填, 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 50,
		onerror : "地点不超过30个字符！"
	}).defaultPassed();
	
	$("#jobNumber").formValidator({
		onshow : "请输入工号！",
		onfocus : "工号非必填, 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 30,
		onerror : "工号非必填, 最多30个字符！"
	});
	
	$("#internetAccount").formValidator({
		onshow : "请输入上网账号！",
		onfocus : "上网账号非必填, 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 30,
		onerror : "上网账号非必填, 最多30个字符！"
	});
	
	$("#fixedHandler").formValidator({
		onshow : "请选择处理人。",
		onfocus : "处理人不得为空！",
		oncorrect : "合法！"
	}).inputValidator({
		min :1,
		onerror : "处理人不得为空！"
	}); 	
	 
	$("#source").formValidator({
		onshow:"请选择请求来源。",
		onfocus:"请求来源必须选择！",
		oncorrect:"合法！",
		defaultvalue:""
	}).inputValidator({
		min:1,
		onerror: "请求来源必须选择！"
	}).defaultPassed();
	
	$("#type").formValidator({
		tipid : "typeTip",
		onshow : "请填写类型。",
		onfocus : "类型不得为空！",
		oncorrect : "合法！"
	}).inputValidator({
		min :1,
		 
		onerror : "类型不得为空！"
	}).inputValidator({
		max :100,
		onerror :  "最多100个字符！"
	}).defaultPassed();
	
	$("#jobNumber").formValidator({
		onshow : "请填写工号！",
		onfocus : "工号非必填, 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 30,
		onerror : "工号非必填, 最多30个字符！"
	}).defaultPassed();
	 
	
	$("#risk").formValidator({ 		 
		onshow : "最多20000个字符！", 
		onfocus : "最多20000个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max :20000,
		onerror :  "最多20000个字符！"
	}).defaultPassed();
	
	$("#undoEffect").formValidator({ 		 
		onshow : "最多20000个字符！", 
		onfocus : "最多20000个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max :20000,
		onerror :  "最多20000个字符！"
	}).defaultPassed();
	
	$("#title").formValidator({ 		 
		onshow : "请填写标题。", 
		onfocus : "最多100个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max :100, 
		onerror :  "最多100字符！"
	}).defaultPassed();
	
	$("#detail").formValidator({ 		 
		onshow : "最多20000个字符！", 
		onfocus : "最多20000个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max :20000,
		onerror :  "最多20000个字符！"
	}).defaultPassed();
	
	$("#internetAccount").formValidator({
					onshow : "请输入上网账号！",
					onfocus : "上网帐号非必填, 最多100个字符！",
					oncorrect : "合法！"
				}).inputValidator({
					max : 100,
					onerror : "上网帐号非必填, 最多100个字符！"
				}).defaultPassed();
	
	 
});
 