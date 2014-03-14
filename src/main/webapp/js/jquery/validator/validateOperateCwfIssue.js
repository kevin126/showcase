$(document).ready(function() {	
		$.formValidator.initConfig({
			formid : "operateCwfIssueDataForm",
			wideword : false,	
			onerror : function(msg) {
				return false;
			},
			onsuccess : function() {		
				return true;				
			}				
		}); 	
			
		validateCustomInput();
		validateCommonInput();
		$("#submitButton").click(function(){
			var result =$.formValidator.pageIsValid("1");
			if(result){
				$('#operateCwfIssueDataForm').get(0).submit();
			}
											
		});
 	});
 	
 function validateCustomInput(){
 	var formId = $("#formId").val();
	CustomFormService.getColumnModelsByFormId(formId,function(data){
		if(data != null && data.length>0){	 				
				validateField(data);		
			}		
	});
 }
 
 function validateCommonInput() {
 	if($("#mutiFixedHandler").length > 0){
 		$("#mutiFixedHandler").formValidator({
			empty : false,
			onshow : "必填！",
			onfocus : "请选择处理人",
			oncorrect : "合法！"
		}).functionValidator({
		    fun : function(val, elem) {
		    	var tasks = $("input[type=input][name=taskDesc]");
		    	if(tasks.length ==0){
					return "请选择处理人";
				}
				var checkedRadio = $("input[@type=radio][name=pointProcessor][checked]");
				if(checkedRadio.length == 0){
					return "请指定一个负责人";
				}
		    	return true;
		    }
		});
 	}
	$("#comment").formValidator({
		empty : true,
		onshow : "非必填！",
		onfocus : "非必填！长度为0-100个字符",
		oncorrect : "合法！"
	}).inputValidator({
		max : 20000,
		min : 0,
		onerror : "非必填！长度为0-20000个字符"
	});
}
 
 function validateField(data) {
	for (var i = 0; i < data.length; i++) {
		var tips = "";
		var maxValue = 0;
		var minValue = 0;
		if (data[i].maxLength != null && data[i].minLength != null) {
			if (!data[i].allowedNull) {
				tips = data[i].displayName + "必填！" + data[i].minLength + "-"
						+ data[i].maxLength + "个字符！";
			} else {
				tips = data[i].displayName + "非必填！" + data[i].minLength + "-"
						+ data[i].maxLength + "个字符！";
			}
			maxValue = data[i].maxLength;
			minValue = data[i].minLength;
		} else if (data[i].maxLength == null && data[i].minLength == null) {
			if (!data[i].allowedNull) {
				tips = data[i].displayName + "必填！";
			} else {
				tips = data[i].displayName + "非必填！";
			}
			if (data[i].htmlType == 'integer') {
				maxValue = 2147483648;
			} else if (data[i].htmlType == 'float') {
				maxValue = 340282350000000000000000000000000000000;
			}
			minValue = 0;
		} else if (data[i].maxLength != null && data[i].minLength == null) {
			if (!data[i].allowedNull) {
				tips = data[i].displayName + "必填！" + "1-" + data[i].maxLength
						+ "个字符！";
			} else {
				tips = data[i].displayName + "非必填！" + "0-" + data[i].maxLength
						+ "个字符！";
			}
			maxValue = data[i].maxLength;
			minValue = 0;
		} else if (data[i].maxLength == null && data[i].minLength != null) {
			if (!data[i].allowedNull) {
				tips = data[i].displayName + "必填！" + "最少" + data[i].minLength
						+ "个字符！";
			} else {
				tips = data[i].displayName + "非必填！";
			}
			if (data[i].htmlType == 'integer') {
				maxValue = 2147483648;
			} else if (data[i].htmlType == 'float') {
				maxValue = 340282350000000000000000000000000000000;
			}
			minValue = data[i].minLength;
		}

		if (data[i].htmlType == 'one_string') {
			if (!data[i].allowedNull) {
				if (data[i].maxLength != null && data[i].minLength != null) {
					$("#" + data[i].dbColumn).formValidator({
						empty : false,
						onshow : tips,
						onfocus : tips,
						oncorrect : "合法！"
					}).inputValidator({
						max : data[i].maxLength,
						min : data[i].minLength,
						onerror : tips
					});
				} else if (data[i].maxLength == null
						&& data[i].minLength == null) {
					$("#" + data[i].dbColumn).formValidator({
						empty : false,
						onshow : tips,
						onfocus : tips,
						oncorrect : "合法！"
					});
				} else if (data[i].maxLength != null
						&& data[i].minLength == null) {
					$("#" + data[i].dbColumn).formValidator({
						empty : false,
						onshow : tips,
						onfocus : tips,
						oncorrect : "合法！"
					}).inputValidator({
						max : data[i].maxLength,
						onerror : tips
					});
				} else if (data[i].maxLength == null
						&& data[i].minLength != null) {
					$("#" + data[i].dbColumn).formValidator({
						empty : false,
						onshow : tips,
						onfocus : tips,
						oncorrect : "合法！"
					}).inputValidator({
						min : data[i].minLength,
						onerror : tips
					});
				}
			} else {
				if (data[i].maxLength != null) {
					$("#" + data[i].dbColumn).formValidator({
						empty : true,
						onshow : tips,
						onfocus : tips,
						oncorrect : "合法！"
					}).inputValidator({
						max : data[i].maxLength,
						min : 0,
						onerror : tips
					});
				} else if (data[i].maxLength == null) {
					$("#" + data[i].dbColumn).formValidator({
						empty : true,
						onshow : tips,
						onfocus : tips,
						oncorrect : "合法！"
					}).inputValidator({
						min : 0,
						onerror : tips
					});
				}
			}
		}
		if (data[i].htmlType == 'many_string') {
			if (!data[i].allowedNull) {
				if (data[i].maxLength != null && data[i].minLength != null) {
					$("#" + data[i].dbColumn).formValidator({
						empty : false,
						onshow : tips,
						onfocus : tips,
						oncorrect : "合法！"
					}).inputValidator({
						max : data[i].maxLength,
						min : data[i].minLength,
						onerror : tips
					});
				} else if (data[i].maxLength == null
						&& data[i].minLength == null) {
					$("#" + data[i].dbColumn).formValidator({
						empty : false,
						onshow : tips,
						onfocus : tips,
						oncorrect : "合法！"
					});
				} else if (data[i].maxLength != null
						&& data[i].minLength == null) {
					$("#" + data[i].dbColumn).formValidator({
						empty : false,
						onshow : tips,
						onfocus : tips,
						oncorrect : "合法！"
					}).inputValidator({
						max : data[i].maxLength,
						onerror : tips
					});
				} else if (data[i].maxLength == null
						&& data[i].minLength != null) {
					$("#" + data[i].dbColumn).formValidator({
						empty : false,
						onshow : tips,
						onfocus : tips,
						oncorrect : "合法！"
					}).inputValidator({
						min : data[i].minLength,
						onerror : tips
					});
				}
			} else {
				$("#" + data[i].dbColumn).formValidator({
					empty : true,
					onshow : tips,
					onfocus : tips,
					oncorrect : "合法！"
				}).inputValidator({
					max : data[i].maxLength,
					min : 0,
					onerror : tips
				});
			}
		}

		if (data[i].htmlType == 'float') {
			if (!data[i].allowedNull) {
				$("#" + data[i].dbColumn).formValidator({
					empty : false,
					onshow : data[i].displayName + "必填！",
					onfocus : data[i].displayName + "必填！",
					oncorrect : "合法！"
				}).inputValidator({
					min : minValue,
					max : maxValue,
					type : "number",
					onerror : "错误，只能输入浮点型数字！",
					onerrormin : "错误！" + data[i].displayName + "的最小值不能小于"
							+ minValue + "!",
					onerrormax : "错误！" + data[i].displayName + "的最大值不能大于"
							+ maxValue + "!"
				}).functionValidator({
					fun : function(val, elem) {
						var value = "";
						if (val != "" && val != null && val != "undefined") {
							if (val.indexOf(".") == -1) {
								val += ".00";
							}
							var flag = true;
							for (var index = 0; index < val.length; index++) {
								var iv = val.charAt(index);
								if (iv == "0" && flag) {
									var i1v = val.charAt(index + 1);
									if (i1v == ".") {
										value += iv;
										flag = false;
									}
								} else {
									flag = false;
									value += iv;
								}
							}
						} else {
							value = 0;
						}
						// $("#"+data[i].dbColumn).val(value);
					}
				});
			} else {
				$("#" + data[i].dbColumn).formValidator({
					empty : true,
					onshow : data[i].displayName + "非必填！",
					onfocus : data[i].displayName + "非必填！",
					oncorrect : "合法！"
				}).inputValidator({
					min : minValue,
					max : maxValue,
					type : "number",
					onerror : "错误，只能输入浮点型数字！",
					onerrormin : "错误！" + data[i].displayName + "的最小值不能小于"
							+ minValue + "!",
					onerrormax : "错误！" + data[i].displayName + "的最大值不能大于"
							+ maxValue + "!"
				}).functionValidator({
					fun : function(val, elem) {
						var value = "";
						if (val != "" && val != null && val != "undefined") {
							if (val.indexOf(".") == -1) {
								val += ".00";
							}
							var flag = true;
							for (var index = 0; index < val.length; index++) {
								var iv = val.charAt(index);
								if (iv == "0" && flag) {
									var i1v = val.charAt(index + 1);
									if (i1v == ".") {
										value += iv;
										flag = false;
									}
								} else {
									flag = false;
									value += iv;
								}
							}
						} else {
							value = 0;
						}
						// $("#"+data[i].dbColumn).val(value);
					}
				});
			}
		}

		if (data[i].htmlType == 'integer') {
			if (!data[i].allowedNull) {
				$("#" + data[i].dbColumn).formValidator({
					empty : false,
					onshow : data[i].displayName + "必填！",
					onfocus : data[i].displayName + "必填！",
					oncorrect : "合法！"
				}).inputValidator({
					min : minValue,
					max : maxValue,
					type : "number",
					onerror : "错误，只能输入整型数字！",
					onerrormin : "错误！" + data[i].displayName + "的最小值不能小于"
							+ minValue + "!",
					onerrormax : "错误！" + data[i].displayName + "的最大值不能大于"
							+ maxValue + "!"
				});
			} else {
				$("#" + data[i].dbColumn).formValidator({
					empty : true,
					onshow : data[i].displayName + "非必填！",
					onfocus : data[i].displayName + "非必填！",
					oncorrect : "合法！"
				}).inputValidator({
					min : minValue,
					max : maxValue,
					type : "number",
					onerror : "错误，只能输入整型数字！",
					onerrormin : "错误！" + data[i].displayName + "的最小值不能小于"
							+ minValue + "!",
					onerrormax : "错误！" + data[i].displayName + "的最大值不能大于"
							+ maxValue + "!"
				});
			}
		}

		if (data[i].htmlType == 'date') {
			if (!data[i].allowedNull) {
				$("#" + data[i].dbColumn).formValidator({
					empty : false,
					onshow : data[i].displayName + "必填!",
					onfocus : data[i].displayName + "必填！",
					oncorrect : "合法！"
				}).inputValidator({
					min : 1,
					onerror : data[i].displayName + "必填!"
				});
			} else {
				$("#" + data[i].dbColumn).formValidator({
					empty : true,
					onshow : data[i].displayName + "非必填！",
					onfocus : data[i].displayName + "非必填! ",
					oncorrect : "合法！"
				}).inputValidator({
					min : 0,
					onerror : data[i].displayName + "非必填! "
				});
			}
		}

		if (data[i].htmlType == 'radio') {
			//不需要Validator
		}
	}
}

var selectedField_total = '';//全局变量，用来区分是哪个域接收用户选择窗口返回的数据		 	
function selectUser() {
	var version = $("#version").val();
	selectedField_total = 'receiveUser';
	var url = "/itsm/cwf/front/queryTaskOperatableUser.do?selectOne=2&version="
			+ version + "&method=enter";
	tipsWindown('选择用户', 'iframe:' + url, '800', '420', 'true', '', 'true',
			'leotheme');
}

function doCallBack(rtValue) {
	if ('receiveUser' == selectedField_total) {
		var addedUser = $("input[type=hidden][name=userName]");
		for (var i = 0; i < rtValue.length; i++) {
			var hiddenName = "";
			var flag = false;
			for (var j = 0; j < rtValue[i].length; j++) {
				var htmTem = "";
				if (j == 0) {
					hiddenName = "<input name='userName' type='hidden'  value='"
							+ rtValue[i][j].name + "'/>";
					if (addedUser != null && addedUser.length > 0) {
						for (var k = 0; k < addedUser.length; k++) {
							if (rtValue[i][j].name != ""
									&& rtValue[i][j].name == addedUser[k].value) {
								flag = true;
							}
						}
					}
					if (flag) {
						break;
					}
				}
				if (j == 1) {
					if (flag) {
						break;
					}
					htmTem += "<tr class='xbiao_tr'><td><input type='checkbox' name='checkbox' id='checkbox2' />";
					htmTem += "</td>";
					htmTem += "<td>";
					htmTem += rtValue[i][j].realName;
					htmTem += "</td>";
					htmTem += "<td>";
					htmTem += hiddenName;
					htmTem += "<input type='input' name='taskDesc' class='all_input tar_wid90b'/>";
					htmTem += "<input type='hidden' name='taskDesc1'/></td>";
					htmTem += "<td>";
					htmTem += "<input type='radio' name='pointProcessor' onclick='$(\"#mutiFixedHandler\").blur();'/><input type='hidden' name='pointProcessor'/></td>";
					htmTem += "</tr>";
					$("#taskList").append(htmTem);
				}
			}
		}
		$("#mutiFixedHandler").blur();
	}
}

function selectAllRecords(obj, checkboxName) {
	//表头的checkbox
	var checkboxs = document.getElementsByName(checkboxName);
	for (var i = 0; i < checkboxs.length; i++) {
		checkboxs[i].checked = obj.checked;
	}
}

function deleteTask() {
	var checkboxs = $("input[type=checkbox][@name=checkbox][checked]");
	if (checkboxs.length == 0) {
			art.dialog({
				title : '提示',
			    content: '请选择需要删除的处理人！',
			    icon : 'info',
			    lock : true,
			    yesFn: true
			});
		return;
	} else {
		$("input[type=checkbox][@name=checkbox][checked]").each(function() {
			if (this.id != "titleCheckbox") {
				$(this).parent().parent().remove();
			}
		});

	}
}