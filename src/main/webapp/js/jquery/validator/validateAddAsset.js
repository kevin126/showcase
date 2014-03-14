/**
 * 创建资产模块的验证
 */
$(document).ready(function() {
	$.formValidator.initConfig({
		formid : "assetForm",
		wideword : false,
		onerror : function(msg) {
			//alert(msg)
		},
		onsuccess : function() {
			next();
			return false;
		}
	});
	
	$("#assetName").formValidator({
		onshow : JS_I18N.asset_property_name_input,
		onfocus : "不得为空，且不能超过50个字符",//不得为空且不得超过255个字符。
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 1,
		max :50,
		onerrormin : JS_I18N.asset_property_name_not_null,
		onerrormax :"错误，长度不能超过50！"
	}).functionValidator({
				fun : notNull
	});
	/*.ajaxValidator({
		type : "post",
		url : "/itsm/AjaxValidateServlet",
		success : function(data) {
			alert(data);
			if (data == "true") {
				return true; 
			} else {
				return false;
			}
		},
		buttons : $("#submitButton"),
		error : function() {
			alert("服务器没有返回数据，可能服务器忙，请重试");
		},
		onerror : "该用户名不可用，请更换用户名",
		onwait : "正在对用户名进行合法性校验，请稍候..."
	})*/
	$("#assetTypeName").formValidator({
		onshow : JS_I18N.asset_property_type_input,
		onfocus : JS_I18N.asset_property_type_not_null,
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 1,
		onerror : JS_I18N.asset_property_type_not_null 
	});
	
	$("#price").formValidator({
		onshow : JS_I18N.asset_property_price_input,
		onfocus : JS_I18N.asset_property_price_not_null,
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 0,
		max :999999999,
		type : "number",
		onerror : JS_I18N.asset_property_must_number,
		onerrormin :JS_I18N.asset_property_price_too_small,
		onerrormax :JS_I18N.asset_property_price_too_long
	}).functionValidator({
		fun : function(val, elem) {
			var value="";
			if (val != ""&& val!=null&&val!="undefined") {
				if(val.indexOf(".")==-1){
						val+=".00";
				}
				var flag = true;
				for (var index = 0; index < val.length; index++) {
					var iv = val.charAt(index);
					if(iv=="0"&&flag){
						var i1v = val.charAt(index+1);
						if(i1v=="."){
							value +=iv;
							flag = false;
						}
					}else{
						flag = false;
						value +=iv;
					}
				}
			}else{
				value = 0;
			}
			$("#price").val(value);
		}
	});
	
	$("#purchaseDate").formValidator({
		onshow : JS_I18N.asset_property_purchase_date_input,
		onfocus : JS_I18N.asset_property_purchase_date_not_null,
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 0,
		onerror : JS_I18N.asset_property_purchase_date_not_null 
	});
	
	$("#warranty").formValidator({
		onshow : JS_I18N.asset_property_warranty_input,
		onfocus : JS_I18N.asset_property_warranty_not_null,
		oncorrect : JS_I18N.issue_legal 
	}).inputValidator({
		min : 0,
		onerror : JS_I18N.asset_property_warranty_not_null 
	});
	
	$("#codeId").formValidator({
		oncorrect : JS_I18N.issue_legal ,
		onfocus : JS_I18N.asset_property_code_is_null
	}).inputValidator({
		min : 0,
		max : 20,
		onerrormax : "错误，长度不能超过20！"
	}).regexValidator({
		regexp : regexEnum.vtype,
		onerror : JS_I18N.asset_property_quantity_is_vtype
	});
	
	$("#storeQuantity").formValidator({
		oncorrect : JS_I18N.issue_legal,
		onfocus : JS_I18N.asset_property_quantity_is_null
	}).inputValidator({
		min : 1,
		max : 500,
		type : "number",
		onerror : JS_I18N.asset_property_must_number,
		onerrormin:JS_I18N.asset_property_min_1,
		onerrormax :JS_I18N.asset_property_long_500
	}).functionValidator({
		fun : function(val, elem) {
			var value="";
			if (val != ""&& val!=null&&val!="undefined") {
				for (var index = 0; index < val.length; index++) {
					var iv = val.charAt(index);
					if(iv!="0"){
						value +=iv;
					}else if(value!=""){
						value +=iv;
					}
				}
			}
			$("#storeQuantity").val(value);
		}
	}).regexValidator({
		regexp : regexEnum.intege1,
		onerror : JS_I18N.asset_property_quantity_is_integer
	});
	
	$("#description").formValidator({
		oncorrect : JS_I18N.issue_legal,
		onfocus : JS_I18N.asset_property_description_is_null
	}).inputValidator({
		min : 0,
		max : 100,
		onerrormax : "错误，长度不能超过100！"
	});
	
	$("#memo").formValidator({
		oncorrect : JS_I18N.issue_legal,
		onfocus : JS_I18N.asset_property_memo_is_null
	}).inputValidator({
		min : 0,
		max : 2000,
		onerror : '错误，长度不能超过2000！' 
	});
	
	$("#place").formValidator({
		oncorrect : JS_I18N.issue_legal,
		onfocus : JS_I18N.asset_property_place_is_null
	}).inputValidator({
		min : 0,
		max : 255,
		onerror : JS_I18N.asset_property_long_256 
	});
	
	$("#sequence").formValidator({
		oncorrect : JS_I18N.issue_legal,
		onfocus : JS_I18N.asset_property_sequence_is_null
	}).inputValidator({
		min : 0,
		max : 255,
		onerror : JS_I18N.asset_property_long_256 
	});
});