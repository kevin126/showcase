/**
 * 创建工单模块的验证
 */
$(document).ready(function() {
	// $.formValidator.initConfig({onerror:function(){alert("校验没有通过，具体错误请看错误提示")}});
	$.formValidator.initConfig({
		formid : "issueForm",
		onerror : function(msg) {
			//alert(msg)
		},
		onsuccess : function() {
			doSubmit(2);//到下一步
			return false;
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
});