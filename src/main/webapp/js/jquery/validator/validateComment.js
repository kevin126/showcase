$(document).ready(function() {

	$.formValidator.initConfig({
				formid : "commentFormId",
				wideword : false,
				onerror : function(msg) {
					return false;
				},
				onsuccess : function() {
					return true;
				}
			});
			
	$("#commentContent").formValidator({
				onshow : '请填写备注。',
				onfocus : '备注必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 1,
				max : 20000,
				onerror : '备注必填，最多20000个字符！'
			}).functionValidator({
				fun : function(val, elem) {
					if (/[<|&|>|'|"|\\]+/.test(val) ) {
						return "不能包含&，\\，|，<，>，\'，\"等字符！";
					} else {
						return true;
					}
				}
			});
})


