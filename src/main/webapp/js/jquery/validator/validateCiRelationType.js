/**
 * 创建资产模块的验证
 */
$(document).ready(function() {
	$.formValidator.initConfig({
		formid : "ciRelationTypeForm",
		onerror : function(msg) {
			return false;
		},
		onsuccess : function() {
			return true;
		}
	});
	
	$("#typeName").formValidator({
		onshow : JS_I18N.ciRelationType_typeName_input,
		onfocus : JS_I18N.ciRelationType_typeName_not_null,//不得为空且不得超过255个字符。
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 1,
		max :10,
		onerrormax :JS_I18N.ciRelationType_typeName_long_10
	}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test(val) ) {
				return "不能包含&，\\，|，<，>，\'，\"等特殊字符";
			} else {
				return true;
			}
		}
	});

	$("#viewDetail").formValidator({
		onshow:JS_I18N.ciRelationType_viewDetail_input,
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 0,
		max: 255,
		onerror : JS_I18N.ciRelationType_viewDetail_long_255 
	});
	
});