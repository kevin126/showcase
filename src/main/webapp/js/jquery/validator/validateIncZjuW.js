function setErrorClass(id,title){
	$("#"+id).attr("title",title);
	$("#"+id).removeClass("all_input");
	$("#"+id).addClass("snmp_in1_4_err");
}

function setCorrectClass(id,title){
	$("#"+id).attr("title",title);
	$("#"+id).removeClass("snmp_in1_4_err");
	$("#"+id).addClass("all_input");
}
    
/**
 * 创建事件工单的验证模块
 */
 function validateDataFormat(){
 	$.formValidator.initConfig({
		formid : "incForm",
		validatorgroup : "1",
		onerror : function(msg) {
			if(msg=="请选择故障类别！"){
				alert(msg);
				$('#issueTypeDiv').find('select').get(0).focus();
			}
			return false;
		},
		onsuccess : function() {
			//$("#fixedHandlerRealName").formValidator();
			$("#incidentType").formValidator();
			$("#department").formValidator();
			var sele = document.getElementById("addresDiv").getElementsByTagName("SELECT");
			for(var i = sele.length-1;i>-1;i--){
				var te = $(sele[i]).find("option:selected").text();
				$('#address').val( te+ ' '+$('#address').val());
			}
			return true;
			//$("#submitButton").attr("disabled", true);
			//document.getElementById("incForm").submit();
			//return true;
		}
	});
	
	$("#requestUser").formValidator({
		onshow : JS_I18N.issue_please_input_request_user,//请填写请求用户
		onfocus : JS_I18N.issue_request_user_Not_null,//"用户不得为空",
		oncorrect : function(){
			setCorrectClass("requestUser","");
		}
	}).functionValidator({
	    fun : function(val, elem) {
	    	var regu = "^[ ]+$";
		    var reg_normal = new RegExp(regu);
		    var result = reg_normal.test(val);
		    if(!result){
		    	setCorrectClass("requestUser","");
		    	return true;
		    }else{
		    	setErrorClass("requestUser","请求用户不能全为空格！");
		    	return false;
		    }
	    }
	});
	
	$("#department").formValidator({
		onshow : "请输入部门！",
		onfocus : "部门非必填, 最多30个字符！",
		oncorrect : "部门合法！"
	}).functionValidator({
		fun : function(val){
			var sele = document.getElementById("deptDiv").getElementsByTagName("SELECT");
			for(var i = sele.length-1;i>-1;i--){
				$('#department').val($(sele[i]).find("option:selected").text());
				break;
			}
			return true;
		},
		onerror : "" 
	});
	
	
	$("#email").formValidator({
		onshow : "请输入邮箱！",
		onfocus : "邮箱非必填, 最多50个字符！",
		oncorrect : function(msg,obj){
			setCorrectClass("email","");
			return "";
		}
	}).inputValidator({
//		min : 6,
		max : 50,
		onerror :  function(msg,obj){
			setErrorClass("email","邮箱非必填, 最多50个字符！");
			return "";
		}
	}).functionValidator({
		fun : function(val){
			if(val != ''){
				if(val.match(regexEnum.email)){
					setCorrectClass("email","");
					return true;
				}
				setErrorClass("email","邮箱格式不正确！");
				return false;
			}else{
				setCorrectClass("email","");
				return true;
			}
		}
	});
	
	$("#ip").formValidator({
		onshow : "请输入IP地址！",
		onfocus : "IP地址非必填, 最多15个字符！",
		oncorrect : function(msg,obj){
			setCorrectClass("ip","");
			return "";
		}
	}).inputValidator({
		max : 15,
		onerror :  function(msg,obj){
			setErrorClass("email"," ");
			return "";
		}
	}).functionValidator({
		fun : function(val){
			if(val != ''){
				if(val.match(regexEnum.ip4)){
					setCorrectClass("email","");
					return true;
				}
				setErrorClass("ip","IP地址格式不正确！");
				return false;
			}else{
				setCorrectClass("ip","");
				return true;
			}
		}
	});
	
	$("#mac").formValidator({
		onshow : "请输入MAC地址！",
		onfocus : "MAC地址非必填, 最多17个字符！",
		oncorrect : function(msg,obj){
			setCorrectClass("mac","");
			return "";
		}
	}).inputValidator({
		max : 17,
		onerror :  function(msg,obj){
			setErrorClass("email"," ");
			return "";
		}
	}).functionValidator({
		fun : function(val){
			if(val != ''){
				if(val.match(regexEnum.mac)){
					setCorrectClass("email","");
					return true;
				}
				setErrorClass("mac","MAC地址格式不正确！");
				return false;
			}else{
				setCorrectClass("mac","");
				return true;
			}
		}
	});
	
	
	
	$("#fixedHandlerRealName").formValidator({
		onshow : "处理人必填！",
		onfocus : "处理人必填！",
		oncorrect :  function(msg,obj){
			setCorrectClass("fixedHandlerRealName","");
			return "";
		}
	}).functionValidator({
	    fun : function(val, elem) {
	    	var regu = "^[ ]+$";
		    var reg_normal = new RegExp(regu);
		    var result = reg_normal.test(val);
		    if(!result&& val !=''){
		    	setCorrectClass("fixedHandlerRealName","");
		    	return true;
		    }else{
		    	setErrorClass("fixedHandlerRealName","处理人必选，不能全为空格！");
		    	return false;
		    }
	    	return true;
	    }
	});
	
	$("#incidentType").formValidator({
		onshow : "请选择故障类别！",//
		onfocus : JS_I18N.incident_incident_type_Not_null,//
		oncorrect :  function(msg,obj){
			setCorrectClass("issueTypeDiv","");
			return "";
		}
	}).functionValidator({
		fun : function(val){
			var sele = document.getElementById("issueTypeDiv").getElementsByTagName("SELECT");
			for(var i = sele.length-1;i>-1;i--){
				$('#incidentType').val($(sele[i]).val());
				$(sele[i]).bind('change',function(){
					setCorrectClass("issueTypeDiv","");
				})
				break;
			}
			var b =$('#incidentType').val().replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>') != '';
			
			if(!b){
				setErrorClass("issueTypeDiv","请选择故障类别！");
			}
			return b;
		},
		onerror :  "请选择故障类别！" //"用户不得为空"
	});
	
	
	
	
	
	
	$("#description").formValidator({
		onshow : "请输入详细描述！",
		onfocus : "详细描述非必填, 最多20000个字符！",
		oncorrect : function(msg,obj){
			$("#description").attr("title","详细描述非必填, 最多20000个字符！");
			$("#description").removeClass("snmp_in1_4_err");
			$("#description").addClass("all_textarea");
			return "";
		}
	}).inputValidator({
		max : 20000,
		onerror : function(msg,obj){
			$("#description").attr("title","详细描述非必填, 最多20000个字符！");
			$("#description").removeClass("all_textarea");
			$("#description").addClass("snmp_in1_4_err");
			return "详细描述非必填, 最多20000个字符！";
		}
	});

 
 ///////////////////////////////////////////////////
 
 $.formValidator.initConfig({
		formid : "requestUserForm",
		validatorgroup : "2",
		onerror : function(msg) {
			return false;
		},
		onsuccess : function() {
			return true;
		}
	});
	
$("#requestUserName_").formValidator({
		validatorgroup : "2",
		onshow : JS_I18N.issue_please_input_request_user,//请填写请求用户
		onfocus : JS_I18N.issue_request_user_Not_null,//"用户不得为空",
		oncorrect : function(){
			setCorrectClass("requestUserName_","");
		}
}).functionValidator({
    fun : function(val, elem) {
    	var regu = "^[ ]+$";
	    var reg_normal = new RegExp(regu);
	    var result = reg_normal.test(val);
	    if(!result){
	    	setCorrectClass("requestUserName_","");
	    	return true;
	    }else{
	    	setErrorClass("requestUserName_","请求用户不能全为空格！");
	    	return false;
	    }
    }
});
	
	
	
	$("#email_").formValidator({
		validatorgroup : "2",
		onshow : "请输入邮箱！",
		onfocus : "邮箱非必填, 最多50个字符！",
		oncorrect : function(msg,obj){
			setCorrectClass("email","");
			return "";
		}
	}).inputValidator({
		max : 50,
		onerror :  function(msg,obj){
			setErrorClass("email_","邮箱非必填, 最多50个字符！");
			return "";
		}
	}).functionValidator({
		fun : function(val){
			if(val != ''){
				if(val.match(regexEnum.email)){
					setCorrectClass("email_","");
					return true;
				}
				setErrorClass("email_","邮箱格式不正确！");
				return false;
			}else{
				setCorrectClass("email_","");
				return true;
			}
		}
	});
	
	 $("#ip_").formValidator({
 		validatorgroup : "2",
		onshow : "请输入IP地址！",
		onfocus : "IP地址非必填, 最多15个字符！",
		oncorrect : function(msg,obj){
			setCorrectClass("ip_","");
			return "";
		}
	}).inputValidator({
		max : 15,
		onerror :  function(msg,obj){
			setErrorClass("ip_"," ");
			return "";
		}
	}).functionValidator({
		fun : function(val){
			if(val != ''){
				if(val.match(regexEnum.ip4)){
					setCorrectClass("ip_","");
					return true;
				}
				setErrorClass("ip_","IP地址格式不正确！");
				return false;
			}else{
				setCorrectClass("ip_","");
				return true;
			}
		}
	});
	
	$("#mac_").formValidator({
		validatorgroup : "2",
		onshow : "请输入MAC地址！",
		onfocus : "MAC地址非必填, 最多17个字符！",
		oncorrect : function(msg,obj){
			setCorrectClass("mac_","");
			return "";
		}
	}).inputValidator({
		max : 17,
		onerror :  function(msg,obj){
			setErrorClass("mac_"," ");
			return "";
		}
	}).functionValidator({
		fun : function(val){
			if(val != ''){
				if(val.match(regexEnum.mac)){
					setCorrectClass("mac_","");
					return true;
				}
				setErrorClass("mac_","MAC地址格式不正确！");
				return false;
			}else{
				setCorrectClass("mac_","");
				return true;
			}
		}
	});
 
	
	
	
	$("#address_").formValidator({
		validatorgroup : "2",
		onshow : function(){
			return "请输入地址！";
		},
		onfocus : "地址为非必填！",
		oncorrect : function(){
			setCorrectClass("address_","");
			return "请输入地址！";
		}
	}).inputValidator({
		max : 150,
		onerror : function(msg,obj){
			setErrorClass("address_","地点不超过30个字符！");
			return "";
		}
	});
	
	
	
	$("#detail_").formValidator({
		validatorgroup : "2",
		onshow : "请输入详细描述！",
		onfocus : "详细描述非必填, 最多20000个字符！",
		oncorrect : function(msg,obj){
			$("#detail_").attr("title","详细描述非必填, 最多20000个字符！");
			$("#detail_").removeClass("snmp_in1_4_err");
			$("#detail_").addClass("all_textarea");
			return "详细描述非必填, 最多20000个字符！";
		}
	}).inputValidator({
		max : 20000,
		onerror : function(msg,obj){
			$("#detail_").attr("title","详细描述非必填, 最多20000个字符！");
			$("#detail_").removeClass("all_textarea");
			$("#detail_").addClass("snmp_in1_4_err");
			return "详细描述非必填, 最多20000个字符！";
		}
	});
 
 }
 

$(document).ready(function(){
	validateDataFormat();
});