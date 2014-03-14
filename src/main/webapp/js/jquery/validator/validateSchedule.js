$(document).ready(function() {

	$.formValidator.initConfig({
				formid : "scheduleFormId",
				wideword : false,
				onerror : function(msg) {
				},
				onsuccess : function() {
					$("#submitButton").attr("disabled", true);
					return true;
				}
			});
	$("#scheduleTitle").formValidator({
				onshow : '请输入作业计划标题',
				onfocus : '作业计划标题不能为空',
				oncorrect : '合法'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "输入不能包含&，\\，|，<，>，\'，\"，和连续两个空格";
			} else if ($.trim(val).length <= 100 && $.trim(val).length >= 1) {
				return true;
			} else {
				return '作业计划标题不能为空，长度为1到100';
			}
		}
	});
		$("#createScheduleExecutorsId").formValidator({
				onshow : '请选择作业计划执行人',
				onfocus : '作业计划执行人不能为空',
				oncorrect : '合法'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else if (val.length >= 1) {
				return true;
			} else {
				return '作业计划执行人不能为空';
			}
		}
	});
	$("#expectedCompleteDayId").formValidator({
			onshow : '请输入预期完成时间',
			onfocus : '预期完成为必须填项',
			oncorrect : '合法'
		}).functionValidator({
			fun : function(){
				var expectedCompleteDay = $("input[name='expectedCompleteDay']").attr("value");
				var expectedCompleteHour = $("input[name='expectedCompleteHour']").attr("value");
				
				if(expectedCompleteDay && !$.trim(expectedCompleteDay).match("^[0-9]{0,2}$")){
					return "输入错误，预期完成天数只能输入数字";
				}
				
				if(expectedCompleteHour && !$.trim(expectedCompleteHour).match("^[0-9]{0,2}$")){
					return "输入错误，预期完成小时数只能输入数字";
				}
				if(expectedCompleteHour && expectedCompleteHour>=24){
					return  '预期完成小时数的值不能大于等于24小时';
				}
				if($.trim(expectedCompleteDay)<1 && $.trim(expectedCompleteHour)<1){
					return  '请输入预期完成时间！';
				}
				return true;
			},
			onerror: '输入错误'
		});
	
	$("#expectedCompleteHourId").formValidator({
			onshow : '请输入预期完成时间',
			onfocus : '预期完成时间为必须填项',
			oncorrect : '合法'
	}).functionValidator({
		fun : function(){
			$("#expectedCompleteDayId").blur();
		}
	});
	$("#selectScheduleTypeid").formValidator({
				onshow : '请选择作业计划类型',
				onfocus : '作业计划类型不能为空',
				oncorrect : '合法'
			}).functionValidator({
		fun : function(val, elem) {
			 if ($.trim(val).length >= 1) {
				return true;
			} else {
				return '作业计划类型不能为空';
			}
		}
	});
	$("#scheduleContentId").formValidator({
				onshow : '请输入作业计划内容',
				onfocus : '作业计划内容不能为空',
				oncorrect : '合法'
			}).functionValidator({
		fun : function(val, elem) {
			if ($.trim(val).length <= 20000 && $.trim(val).length >= 1) {
				return true;
			} else {
				return '作业计划内容输入错误，长度范围为1到20000';
			}
		}
	});
	
	$("#taskExcuteResultId").formValidator({
				onshow : '请输入任务执行结果内容',
				onfocus : '任务执行结果内容不能为空',
				oncorrect : '合法'
			}).functionValidator({
		fun : function(val, elem) {
			if ($.trim(val).length <= 20000 && $.trim(val).length >= 1) {
				return true;
			} else {
				return '任务执行结果内容输入错误，长度范围为1到20000';
			}
		}
	});
	$("#scheduleByHour").formValidator({
				onshow : '请输入任务执行时间',
				onfocus : '任务执行时间不能为空',
				oncorrect : '合法'
				}).functionValidator({
			fun : function(){
				var expectedCompleteDay = $("#scheduleByHour").attr("value");
				//判断是否含“：”
				if(expectedCompleteDay && !$.trim(expectedCompleteDay).match("^([0-1][0-9]|[2][0-3])[:|：]([0-5][0-9])$")){
					return "输入错误，小时00-23，分00-59，例如00:00";
				}
				return true;
			},
			onerror: '输入错误'
		});
	
	$("#taskCommentId").formValidator({
				onshow : '请输入备注信息',
				onfocus : '备注信息不能为空',
				oncorrect : '合法'
			}).functionValidator({
		fun : function(val, elem) {
			if ($.trim(val).length <= 20000 && $.trim(val).length >= 1) {
				return true;
			} else {
				return '备注信息输入错误，长度范围为1到20000';
			}
		}
	});
	
});