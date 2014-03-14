/**
 * 创建资产模块的验证
 */
$(document).ready(function() {
			$.formValidator.initConfig({
						formid : "assetRemindForm",
						wideword : false,
						onerror : function(msg) {
							return false;
						},
						onsuccess : function() {
							return true;
						}
					});

			$("#laterDays").formValidator({
						onshow : JS_I18N.assetRemind_input_laterDays,
						onfocus : JS_I18N.assetRemind_laterDays_not_null,
						oncorrect : JS_I18N.issue_legal
					}).inputValidator({
						type : "number",
						min : 1,
						max : 1000,
						onerrormax : JS_I18N.assetRemind_laterDays_long_1000
					}).functionValidator({
						fun : notNull
					}).regexValidator({
						regexp : regexEnum.intege1,
						onerror : JS_I18N.asset_property_quantity_is_integer
					});

			$("#returnDays").formValidator({
						onshow : JS_I18N.assetRemind_input_returnDays,
						onfocus : JS_I18N.assetRemind_returnDays_not_null,
						oncorrect : JS_I18N.issue_legal
					}).inputValidator({
						type : "number",
						min : 1,
						max : 10000,
						onerrormax : JS_I18N.assetRemind_returnDays_long_10000
					}).regexValidator({
						regexp : regexEnum.intege1,
						onerror : JS_I18N.asset_property_quantity_is_integer
					});

			$("#mailSender").formValidator({
						onshow : JS_I18N.assetRemind_input_mailSender,
						onfocus : JS_I18N.assetRemind_mailSender_not_null,
						oncorrect : JS_I18N.issue_legal
					}).inputValidator({
						min : 1
					});
		});