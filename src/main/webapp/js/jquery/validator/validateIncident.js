/**
 * 创建事件工单的验证模块
 */
 function validateDataFormat(){
 	$.formValidator.initConfig({
		formid : "incForm",
		onerror : function(msg) {
			return false;
		},
		onsuccess : function() {
			$("#submitButton").attr("disabled", true);
			document.getElementById("incForm").submit();
			return true;
		}
	});
	$("#requestUser").formValidator({
		onshow : JS_I18N.issue_please_input_request_user,//请填写请求用户
		onfocus : JS_I18N.issue_request_user_Not_null,//"用户不得为空",
		oncorrect : JS_I18N.issue_legal //合法"
	}).inputValidator({
//		min : 1,
		max : 20,
		onerror : JS_I18N.issue_request_user_Not_null //"用户不得为空"
	}).functionValidator({
	    fun : function(val, elem) {
	    	var regu = "^[ ]+$";
		    var reg_normal = new RegExp(regu);
		    var result = reg_normal.test(val);
		    if(!result){
		    	return true;
		    }else{
		    	return '请求用户不能全为空格';
		    }
	    }
	});
	
	$("#issueType").formValidator({
		onshow : "请选择工单类型！",
		onfocus : "工单类型必选！",
		oncorrect : "合法！"
	}).inputValidator({
//		min : 1,
		max : 30,
		onerror : "工单类型不能为空！"
	});
	
	$("#department").formValidator({
		onshow : "请输入部门！",
		onfocus : "部门非必填, 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
//		min : 1,
		max : 30,
		onerror : "部门非必填, 最多30个字符！"
	});
	
	$("#phone").formValidator({
		onshow : "请输入联系电话！",
		onfocus : "联系电话非必填, 最多50个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 50,
//		min : 1,
		onerror : "联系电话非必填, 最多50个字符！"
	});
	
	$("#email").formValidator({
		onshow : "请输入邮箱！",
		onfocus : "邮箱非必填, 最多50个字符！",
		oncorrect : "合法！"
	}).inputValidator({
//		min : 6,
		max : 50,
		onerror : "邮箱非必填, 最多50个字符！"
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
	});
	
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
		onshow : "请选择处理人！",
		onfocus : "处理人非必填！",
		oncorrect : "合法！"
	}).functionValidator({
		fun : function(val){
			if(roleNameOfSelectedUser != ''){
				if(roleNameOfSelectedUser.indexOf('普通用户') != -1){
					return false;
				}
				return true;
			}else{
				return true;
			}
		},
		onerror : "处理人不能为普通用户！"
	});
	
	$("#incidentType").formValidator({
		onshow : JS_I18N.incident_please_input_type,//请填写请求用户
		onfocus : JS_I18N.incident_incident_type_Not_null,//"用户不得为空",
		oncorrect : JS_I18N.issue_legal //合法"
	}).inputValidator({
		min : 1,
		onerror : JS_I18N.incident_incident_type_Not_null //"用户不得为空"
	});
	
	$("#address").formValidator({
		onshow : "请输入地点！",
		onfocus : "地点为非必填！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 30,
		onerror : "地点不超过30个字符！"
	});
	
	$("#incidentTitle").formValidator({
		onshow : JS_I18N.incident_please_input_title,
		onfocus : JS_I18N.incident_incident_tile_Information,
		oncorrect : JS_I18N.issue_legal
	}).inputValidator({
		max : 100,
		onerror : JS_I18N.incident_incident_tile_Too_long
	});
	
	$("#expectTime").formValidator({
		onshow : JS_I18N.incident_please_select_expected_time,
		onfocus : '非必填',
		oncorrect : JS_I18N.issue_legal
	}).inputValidator({
		onerror : ""
	});
	
	$("#description").formValidator({
		onshow : "请输入详细描述！",
		onfocus : "详细描述非必填, 最多20000个字符！",
		oncorrect : JS_I18N.issue_legal
	}).inputValidator({
		max : 20000,
		onerror : "详细描述非必填, 最多20000个字符！"
	});
 }

$(document).ready(function(){
	validateDataFormat();
});