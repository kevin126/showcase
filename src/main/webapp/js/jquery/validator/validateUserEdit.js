/**
 * 运维人员验证 修改密码验证
 */

$(document).ready(function() {

	$.formValidator.initConfig({
				formid : "edituser",
				wideword : false,
				onerror : function(msg) {
				},
				onsuccess : function() {
					$("#table2").hide();
					$("#table1").show();
					$("#table4").hide();
					$("#table3").show();
					$("#table6").hide();
					$("#table5").show();
					return true;
				}
			});
	// 用户登录时输入的用户名，全局唯一，可输入英文、数字、下划线，长度范围1-20
	$("#username").formValidator({
				onshow : '请输入用户名',
				onfocus : '用户名不能为空',
				oncorrect : '合法'
			}).inputValidator({
				min : 1,
				max : 20,
				onerror : '长度范围1到20'
			}).regexValidator({
				regexp : "^[0-9|a-zA-Z|_]{1,20}$",
				onerror : "只能输入字母，数字，下划线"
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else {
				return true;
			}
		}
	});

	// 用户的姓名，必填，长度范围2-20，可重复
	$("#userrealName").formValidator({
				onshow : '请输入姓名',
				onfocus : '姓名不能为空',
				oncorrect : '合法'
			}).inputValidator({
				min : 2,
				max : 20,
				onerror : '不能为空，长度为2到20'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			}else{
			return true;
			}
		}
	});
	// 用户的工号，长度范围0-30
	$("#useremployeeNo").formValidator({
				onshow : '请输入工号',
				onfocus : '该项为非必须输入项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max : 30,
				onerror : '工号输入错误，最大长度为30'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else  {
				return true;
			} 
		}
	});

	// 上网账号 用户的上网唯一账号，字符串，长度范围0-30
	$("#internetAccount").formValidator({
				onshow : '请输入上网账号',
				onfocus : '该项为非必须输入项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max : 30,
				onerror : '上网账号输入错误，最大长度为30'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else{
				return true;
			} 
		}
	});

	// 工作组
	$("#selectWorkGroup").formValidator({
				onshow : '请选择工作组',
				onfocus : '该项为非必须输入项',
				oncorrect : '合法'
			}).inputValidator({
				onerror : '合法'
			});
	// 长度范围0-255
	$("#usertaskNotifier").formValidator({
				onshow : '请输入技能描述',
				onfocus : '该项为非必须输入项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max : 255,
				onerror : '输入错误，长度范围为0到255'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else {
				return true;
			} 
		}
	});

	$("#usermail").formValidator({
				onshow : '请输入Email',
				onfocus : '该项为非必填项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max :50,
				onerror : "邮箱长度不能超过50字符！"
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else {
				return true;
			}
		}
	}).regexValidator({
		regexp : "^(\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+)?$",
		onerror : "邮箱格式错误！"
	});

	// 用户的电子邮件，字符串格式，非必填，符合邮件地址格式，长度范围为6-50，全局唯一
	// 必填，长度范围1-50
	$("#usermobile").formValidator({
				onshow : '请输入手机号码',
				onfocus : '该项为非必须输入项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max :50,
				onerror : "输入错误，长度范围不超过50个字符."
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else  {
				return true;
			}
		}
	}).regexValidator({
		regexp : "^[0-9]*$",
		onerror : "手机号码格式错误！"
	});
	
	//可不填，格式不做校验，用户自己填，长度范围5-20
	$("#qq").formValidator({
				onshow : '请输入QQ号码',
				onfocus : '该项为非必须输入项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max :20,
				onerror : "输入错误，长度范围不超过20个字符."
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else  {
				return true;
			}
		}
	}).regexValidator({
		regexp : "^[0-9]*$",
		onerror : "QQ号码格式错误！"
	});

	// 可不填，格式不做校验，用户自己填，长度范围0-20
	$("#userfax").formValidator({
				onshow : '请输入传真',
				onfocus : '该项为非必须输入项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max :50,
				onerror : "传真输入错误，最大长度为50"
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else {
				return true;
			} 
		}
	});

	// 可不填，格式不做校验，用户自己填，长度范围0-20
	$("#useroffice").formValidator({
				onshow : '请输入固定电话',
				onfocus : '该项为非必须输入项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max :50,
				onerror : "固定电话输入错误，最大长度为50"
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else {
				return true;
			} 
		}
	});

	// 英文或数字，长度范围0-50
	$("#usermsn").formValidator({
				onshow : "请输入MSN",
				onfocus : "MSN为非必填项",
				oncorrect : "合法"
			}).inputValidator({
				min : 0,
				max :50,
				onerror : "MSN输入错误，最大长度50"
			}).functionValidator({
				fun : function(val, elem) {
					if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
							|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
						return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
					} else {
						return true;
					}
				}
	});

	// 可不填，任意字符串，长度范围0-10
	$("#usercountry").formValidator({
				onshow : '请输入国家名称',
				onfocus : '国家名称为非必须输入项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max :10,
				onerror : "国家名称输入错误，最大长度为10"
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else {
				return true;
			}
		}
	});

	// 可不填，任意字符串，长度范围0-50
	$("#useraddress").formValidator({
				onshow : '请输入地址',
				onfocus : '地址为非必填项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max :50,
				onerror : "地址输入错误，最大长度为50"
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
					|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
				return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
			} else {
				return true;
			}
		}
	});

	// 可不填，数字格式，比如200122，长度为5-20
	$("#userzipcode").formValidator({
				onshow : "请输入邮编",
				onfocus : "邮编为非必填项",
				oncorrect : "合法"
			}).inputValidator({
				min : 0,
				max :20,
				onerror : "邮编输入错误，最大长度为20"
			}).functionValidator({
				fun : function(val, elem) {
					if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
							|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
						return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
					} else {
						return true;
					} 
				}
	});

	// 可不填，任意字符串，长度范围0-10
	$("#usercity").formValidator({
				onshow : '请输入城市',
				onfocus : '城市为非必填项',
				oncorrect : '合法'
			}).inputValidator({
				min : 0,
				max :10,
				onerror : "城市输入错误，最大长度为10"
			}).functionValidator({
				fun : function(val, elem) {
					if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
							|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
						return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
					} else {
						return true;
					}
				}
	});
});