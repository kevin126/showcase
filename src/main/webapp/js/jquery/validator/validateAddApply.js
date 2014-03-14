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
			return true;
		}
	});
	
	$("#title").formValidator({
		onshow : JS_I18N.asset_apply_input_title,
		onfocus : JS_I18N.asset_apply_not_null,
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 1,
		max :100,
		onerrormin:"不能为空！",
		onerrormax :JS_I18N.asset_apply_long_100
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
	});
	
	$("#applyDate").formValidator({
		onshow : "请输入申请日期！",
		onfocus : "申请日期不能为空！",
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 1,
		max :20,
		onerrormin:"不能为空！"
	});
	
	$("#backDate").formValidator({
		onshow : "如果有借用类型请输入归还日期！",
		onfocus : "请输入归还日期！",
		oncorrect : JS_I18N.issue_legal 
	}).functionValidator({
	fun : function (val,elem){
	var headings = document.getElementsByTagName("input");
    for (var i = 0; i < headings.length; i++)  {
           var h = headings[i];
           if(h.type=="radio"){
           if(h.checked&&h.value=="1"&&(val==null||val=="")){
           return "如果有借用类型请输入归还日期！"
           }
             }
                             }
           return true;
		}
	});
});