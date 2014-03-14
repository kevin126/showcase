
$(document).ready(function() {

	$.formValidator.initConfig({
				formid : "addDeptFormId",
				wideword : false,
				onerror : function(msg) {
				},
				onsuccess : function() {
					$("#addDeptsubmitButton").attr("disabled", true);
					return true;
				}
			});
	$("#deptNameId").formValidator({
				onshow : '请输入部门名称',
				onfocus : '部门名称为必填项',
				oncorrect : '合法'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else if ($.trim(val).length <= 30 && $.trim(val).length >= 1) {
				return true;
			} else {
				return '部门名称输入错误，长度在1到30之间';
			}
		}
	});
	$("#deptMemoId").formValidator({
				onshow : '请输入部门描述',
				onfocus : '部门描述为必填项',
				oncorrect : '合法'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val))) {
				return  "不能包含<，&，>，\'，\"，\\";
			} else if ($.trim(val).length <= 255 && $.trim(val).length >=1) {
				return true;
			} else {
				return '部门描述输入错误，长度在1到255之间';
			}
		}
	});
});