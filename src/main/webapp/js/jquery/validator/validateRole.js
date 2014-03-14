
$(document).ready(function() {

	$.formValidator.initConfig({
				formid : "addRoleFormId",
				wideword : false,
				onerror : function(msg) {
				},
				onsuccess : function() {
					$("#assetsubmit").attr("disabled", true);
					return true;
				}
			});
	$("#roleName").formValidator({
				onshow : '请输入角色名称',
				onfocus : '角色名称为必填项',
				oncorrect : '合法'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else if ($.trim(val).length <= 20 && $.trim(val).length >= 1) {
				return true;
			} else {
				return '角色名称不能为空，长度为1到20';
			}
		}
	});
	$("#roleDiscription").formValidator({
				onshow : '请输入角色描述',
				onfocus : '角色描述为必填项',
				oncorrect : '合法'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val))) {
				return  "不能包含<，&，>，\'，\"，\\";
			} else if ($.trim(val).length <= 255 && $.trim(val).length >=1) {
				return true;
			} else {
				return '角色描述输入错误，长度范围为1到255';
			}
		}
	});

});