/**
 * 知识库模块的验证
 */
$(document).ready(function() {
	// $.formValidator.initConfig({onerror:function(){alert("校验没有通过，具体错误请看错误提示")}});
	$.formValidator.initConfig({
		formid : "knoform",
		wideword : false,		
		onerror : function(msg,obj) {			
			//alert(msg);
			return false;
		},
		onsuccess : function() { 
			return true;
		}
	});
	$("#title").formValidator({	
		empty : false,
		onshow : "请填写\"标题\"。",
		onfocus : "\"标题\"不能为空，至少1个字符，最多100个字符。",
		oncorrect : "输入正确！"
	}).inputValidator({
		min : 1,
		max : 100,
		onerror : "\"标题\"长度不合法(至少1个字符，最多100个字符)，请确认！"
	}).defaultPassed();
	
	
	
	$("#typeID").formValidator({
		onshow : "请选择\"类型\"。",
		onfocus : "\"类型\"不能为空。" ,
		oncorrect:"输入正确！"
//		,forcevalid : true
	}).functionValidator({
		fun : function(val, elem) {
			if (!Ext.isEmpty(val)) {
				return true;
			} else {
				return "类型不能为空！"
			} 
		} 
	}).defaultPassed();
	
	$("#problemDescription").formValidator({
		onshow : "\"问题描述\"不能为空！",
		onfocus : "\"问题描述\"至少10个字符，最多20000个字符。" ,
		oncorrect:"输入正确！"
//		,forcevalid : true
	}).inputValidator({
		min : 10,
		max : 20000,
		onerror : "\"问题描述\"长度不合法(至少10个字符，最多20000个字符)，请确认！"
	}).defaultPassed();
	
	$("#resolveMethod").formValidator({ 
		onshow : "\"解决方案\"不能为空！",
		onfocus : "\"解决方案\"至少10个字符，最多20000个字符。",
		oncorrect:"输入正确！"
//		,forcevalid : true
	}).inputValidator({
		min : 10,
		max : 20000,
		onerror : "\"解决方案\"长度不合法(至少10个字符，最多20000个字符),请确认！"
	}).defaultPassed();	
});