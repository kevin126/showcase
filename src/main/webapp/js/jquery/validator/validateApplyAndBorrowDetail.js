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

	$("#assetCode").formValidator({
				onshow : JS_I18N.asset_apply_assetCode_input_assetCode,
				oncorrect : JS_I18N.issue_legal
			}).inputValidator({
				min : 0,
				max : 100,
				onerrormax : JS_I18N.asset_apply_assetCode_long_100
			});
	// .functionValidator({
	// fun : notNull
	// });

	$("#assetName").formValidator({
				onshow : JS_I18N.asset_apply_assetName_input_assetName,
				oncorrect : JS_I18N.issue_legal
			}).inputValidator({
				min : 0,
				max : 100,
				onerrormax : JS_I18N.asset_apply_assetName_long_100
			});
	// .functionValidator({
	// fun : notNull
	// });

	$("#assetTypeName").formValidator({
				onshow : JS_I18N.asset_apply_assetTypeId_input_assetTypeId,
				onfocus : JS_I18N.asset_apply_assetTypeId_not_null,
				oncorrect : JS_I18N.issue_legal
			}).inputValidator({
				min : 1,
				max : 100,
				onerrormin : "不能为空",
				onerrormax : JS_I18N.asset_apply_assetTypeId_long_100
			});
	$("#approveOfficer").formValidator({
				onshow : JS_I18N.asset_apply_approveOfficer_input_approveOfficer,
				onfocus : JS_I18N.asset_apply_approveOfficer_not_null,
				oncorrect : JS_I18N.issue_legal
			}).inputValidator({
				min : 0,
				max : 100,
				onerrormax : JS_I18N.asset_apply_approveOfficer_long_100
			});
	// .functionValidator({
	// fun : notNull
	// });
	$("#comment").formValidator({
				onshow : JS_I18N.asset_apply_comment_input_assetTypeId,
				oncorrect : JS_I18N.issue_legal
			}).inputValidator({
				min : 0,
				max : 20000,
				onerrormax : JS_I18N.asset_apply_comment_long_20000
			});
		// .functionValidator({
		// fun : notNull
		// });

});