/**
 * 创建资产模块的验证
 */
$(document).ready(function() {
	
	$.formValidator.initConfig({
		formid : "applyOrBorrowForm",
		wideword : false,
		onerror : function(msg) {
			return false;
		},
		onsuccess : function() {
			checkDate();
			return false;
		}
	});
	
	$("#title").formValidator({
		onshow : JS_I18N.asset_apply_input_title,
		onfocus : JS_I18N.asset_apply_not_null,
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 1,
		max :255,
		onerrormin:"不能为空！",
		onerrormax :JS_I18N.asset_apply_long_255
	}).functionValidator({
				fun : notNull
	});
	
	$("#memo").formValidator({
		onshow : JS_I18N.asset_apply_input_memo,
		onfocus : JS_I18N.asset_apply_not_null,
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 1,
		max :20000,
		onerrormin:"不能为空！",
		onerrormax :JS_I18N.asset_apply_long_20000
	}).functionValidator({
				fun : notNull
	});
	
		
	$("#rentDate").formValidator({
		onshow : "请输入借用日期！",
		onfocus : JS_I18N.asset_apply_not_null,
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 1,
		max :100,
		onerrormin:"不能为空！",
		onerrormax :JS_I18N.asset_apply_long_100
	}); 
	
	$("#backDate").formValidator({
		onshow : "请输入归还日期！",
		onfocus : "请输入归还日期！",
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 1,
		max :100,
		onerrormin:"不能为空！",
		onerrormax :JS_I18N.asset_apply_long_100
	});
});