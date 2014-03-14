/**
 * 供应商验证
 */
$(document).ready(function() {
	// $.formValidator.initConfig({onerror:function(){alert("校验没有通过，具体错误请看错误提示")}});
	$.formValidator.initConfig({
				formid : "addsuppler",
				onerror : function(msg) {
					// Ext.MessageBox.show({
					// title : '错误',
					// msg : msg + "！",
					// model : true,
					// icon : Ext.Msg.ERROR,
					// buttons : Ext.Msg.OK
					// })
				},
				onsuccess : function() {
					return true;
				}
			});
	// 供应商的公司名称，字符串，全局唯一，长度范围1-255
	$("#supplername").formValidator({
				onshow : '请输入名称',
				onfocus : '名称不能为空',
				oncorrect : '合法'
			}).inputValidator({
				min : 1,
				max : 50,
				onerror : '名称不能为空',
				onerrormax:'名称长度不能超过50'
			}).functionValidator({
				fun : notNull
			});
	// 供应商所在地邮编，必填，数字格式，比如200122，长度为5-20
	$("#supplerpost").formValidator({
				onshow : "请输入邮编",
				onfocus : "邮编不得为空",
				oncorrect : "合法"
			}).inputValidator({
				min : 5,
				max : 20,
				onerror : "长度范围5到20"
			}).regexValidator({
				regexp : "^\\d{5,20}$",
				onerror : "错误，只能输入数字"
			});

	// 供应商联系人姓名，长度范围2-10，必填
	$("#supplercontract").formValidator({
				onshow : "请输入联系人",
				onfocus : "联系人不得为空",
				oncorrect : "合法"
			}).inputValidator({
				min : 2,
				max : 20,
				onerror : "联系人长度范围为2到20"
			});
	// 供应商电话，格式不做校验，长度范围1-20，必填
	$("#supplerphone").formValidator({
				onshow : "请输入联系电话",
				onfocus : "联系电话不得为空。",
				oncorrect : "合法"
			}).inputValidator({
				min : 1,
				max : 20,
				onerror : "联系电话长度范围为1到20"
			});
	// 能够联系到供应商的电子邮件，必填，长度范围6-50
	$("#suppleremail").formValidator({
				onshow : "请输入电子邮件",
				onfocus : "电子邮件不得为空！",
				oncorrect : "合法"
			}).inputValidator({
				min : 6,
				max : 50,
				onerrormin : "电子邮件不得为空,且不得小于6个字符！",
				onerrormax : "电子邮件过长,长度不得大于50个字符！"
			}).regexValidator({
		regexp : "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$",
		onerror : "Email格式不正确"
	});
	// 供应商商家地址，字符串，长度范围1-255，必填
	$("#suppleraddress").formValidator({
				onshow : "请输入地址",
				onfocus : "地址不得为空",
				oncorrect : "合法"
			}).inputValidator({
				min : 1,
				max : 255,
				onerror : "地址长度范围为1到255"
			}).functionValidator({
				fun : notNull
			});
	// 供应商的网站，字符串，长度范围0-30
	$("#supplersite").formValidator({
				empty : true,
				onshow : "请输入网址",
				onfocus : "网址为非必填项",
				oncorrect : "合法"
			}).inputValidator({
				min : 0,
				max : 30,
				onerror : "最大长度30"
			}).regexValidator({
				regexp : regexEnum.internet,
				onerror : "网址格式不正确"
			});

	// 供应商传真，格式不做校验，长度范围1-20，必填
	$("#supplerfax").formValidator({
				onshow : "请输入传真",
				onfocus : "传真不得为空。",
				oncorrect : "合法"
			}).inputValidator({
				min : 1,
				max : 20,
				onerror : "传真长度范围为1到20"
			});

	// 对供应商的概要描述，长度范围0-255.
	$("#supplermemo").formValidator({
				onshow : "请输入描述信息",
				onfocus : "描述项为非必填项",
				oncorrect : "合法"
			}).inputValidator({
				max : 5000,
				onerrormax : "描述信息最大长度为5000"
			});
});