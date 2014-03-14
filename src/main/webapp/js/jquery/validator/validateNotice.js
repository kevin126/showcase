/**
 * 创建资产模块的验证
 */
$(document).ready(function() {
			$.formValidator.initConfig({
						formid : "noticeForm",
						wideword : false,
						onerror : function(msg) {
							// alert(msg)
						},
						onsuccess : function() {
							release();
							$("#submitButton").attr("disabled", true);
							return false;
						}
					});

			$("#title").formValidator({
						onshow : JS_I18N.notice_property_name_input,
						onfocus : JS_I18N.notice_property_name_not_null,
						oncorrect : JS_I18N.issue_legal
					}).inputValidator({
						min : 1,
						max : 35,
						onerror : JS_I18N.notice_property_name_not_null,
						onerrormax : JS_I18N.notice_property_name_max
		
					}).functionValidator({
						fun : notNull
					});

			$("#memo").formValidator({
						onshow : JS_I18N.notice_property_memo_input,
						onfocus : JS_I18N.notice_property_memo_not_null,
						oncorrect : JS_I18N.issue_legal
					}).inputValidator({
						min : 1,
						max : 20000,
						onerror : JS_I18N.notice_property_memo_not_null,
						onerrormax : JS_I18N.notice_property_memo_max
					}).functionValidator({
						fun : notNull
					});

		});