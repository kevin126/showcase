/**
 * 配置LDAP服务器的验证文件
 */
$(document).ready(function() {
	$.formValidator.initConfig({
				formid : "ldapForm",
				onerror : function(msg) {
					// alert(msg)
				},
				onsuccess : function() {
					saveLdapSetting();
					return false;
				}
			});

	$("#serverIp").formValidator({
				onshow : '请输入服务器IP地址',
				onfocus : 'IP地址必填',
				oncorrect : JS_I18N.issue_legal
			}).inputValidator({
				min : 7,
				max : 15,
				onerror : 'IP为空或格式错误'
			}).functionValidator({
		fun : function(val, elem) {
			var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/ // 匹配IP地址的正则表达式
			if (re.test(val)) {
				var binaryValue = "";
				if (RegExp.$1.length > 1 && RegExp.$1.indexOf('0') == 0)
					return false;
				if (RegExp.$2.length > 1 && RegExp.$2.indexOf('0') == 0)
					return false;
				if (RegExp.$3.length > 1 && RegExp.$3.indexOf('0') == 0)
					return false;
				if (RegExp.$4.length > 1 && RegExp.$4.indexOf('0') == 0)
					return false;
				if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256
						&& RegExp.$4 < 256) {
					binaryValue = parseInt(RegExp.$1).toString(2)
							+ parseInt(RegExp.$2).toString(2)
							+ parseInt(RegExp.$3).toString(2)
							+ parseInt(RegExp.$4).toString(2);
					if (binaryValue.indexOf('1') < binaryValue.indexOf('0')) {// 指派给普通主机的IP地址网络号不能以0打头，子网号不能以0打头
						return true;
					}
				}
			}
			return 'IP格式错误';
		}
	});

	$("#port").formValidator({
				onshow : '请输入端口号',
				onfocus : '端口号必填',
				oncorrect : JS_I18N.issue_legal
			}).inputValidator({
				min : 1,
				max : 65536,
				type : "number",
				onerror : '端口号不得为空',
				onerrormax:'端口号超出合法范围'
			}).regexValidator({
				regexp : regexEnum.intege,
				onerror : '端口号必须为数字'
			});

	$("#principal").formValidator({
				onshow : '请输入用户DN',
				onfocus : '用户DN必填',
				oncorrect : JS_I18N.issue_legal
			}).inputValidator({
				min : 1,
				max : 100,
				onerror : '用户DN不得为空',
				onerrormax:'用户DN不得超过100个字符'
			});

	$("#credentieds").formValidator({
				onshow : '请输入用户密码',
				onfocus :'用户密码必填',
				oncorrect : JS_I18N.issue_legal
			}).inputValidator({
				min : 1,
				max : 20,
				onerror : '用户密码不得为空',
				onerrormax:'用户密码不得超过20个字符'
			});

	$("#dn").formValidator({
				onshow : '请输入查找DN',
				onfocus : '查找DN不得为空',
				oncorrect : JS_I18N.issue_legal
			}).inputValidator({
				min : 1,
				max : 100,
				onerror : '查找DN不得为空',
				onerrormax:'查找DN不得超过100个字符'
			});

});