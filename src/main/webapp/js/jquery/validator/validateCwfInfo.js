/**
 * 创建自定义流程第一步表单验证
 */
 function validateDataFormat(){
 	$.formValidator.initConfig({
		formid : "CwfInfoForm",
		onerror : function(msg) {
			return false;
		},
		onsuccess : function() {
			$("#submitButton").attr("disabled", true);
			document.getElementById("CwfInfoForm").submit();
			return true;
		}
	});
	$("#processName").formValidator({
		onshow : '请输入流程名称',
		onfocus : '流程名称不能为空',
		oncorrect : '合法'
	}).inputValidator({
		min : 1,
		max : 20,
		onerror : '流程名称不能为空，且最大长度不超过20字符' 
	}).functionValidator({
	    fun : function(val, elem) {
	    	var regu = "^[ ]+$";
		    var reg_normal = new RegExp(regu);
		    var result = reg_normal.test(val);
		    if(!result){
		    	return true;
		    }else{
		    	return '流程名称不能全为空格';
		    }
	    }
	}).functionValidator({
		fun : function(val){
			var reslut = true;
			dwr.engine.setAsync(false);
			CwfService.isProcessNameConflict(val,function(value){
				dwr.engine.setAsync(true);
				reslut = !value;
			});
			return reslut;
		},
		onerror : "流程名称已经存在，请重新输入！"
	});
	
	$("#processKey").formValidator({
		onshow : "请输入流程Key值",
		onfocus : "流程Key值不能为空",
		oncorrect : "合法！"
	}).inputValidator({
		min : 1,
		max : 5,
		onerror : "流程Key值不能为空，且最大长度不超过5个字符"
	}).functionValidator({
	    fun : function(val, elem) {
		    var patterns = /^[a-z]*$/i; 
			if(val.match(patterns)){
				return true;
			}else{
				return '流程Key只允许输入英文字母';
			}
	    }
	}).functionValidator({
		fun : function(val){
			var reslut = true;
			dwr.engine.setAsync(false);
			CwfService.isProcessKeyConflict(val,function(value){
				dwr.engine.setAsync(true);
				reslut = !value;
			});
			return reslut;
		},
		onerror : "流程Key值已经存在，请重新输入！"
	});
	
	$("#description").formValidator({
		onshow : "请输入描述信息！",
		onfocus : "描述信息非必填, 最多20000个字符！",
		oncorrect : '合法'
	}).inputValidator({
		max : 20000,
		onerror : "描述信息非必填, 最多20000个字符！"
	});
 }

$(document).ready(function(){
	validateDataFormat();
});