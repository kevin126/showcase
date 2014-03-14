// Ext.namespace('Ext.form');
/**
 * 输入框的校验（如有其他校验直接加入下面对象中） 用法 ： 无需调用，只要在控件中加入vtype属性，如
 * 
 * <pre>
 * new Ext.form.TextField({
 * 			id : 'mgtIp',
 * 			fieldLabel : '管理IP地址',
 * 			allowBlank : false,
 * 			anchor : '75%',
 * 			vtype : 'IPAddress'
 * 		})
 * </pre>
 */
Ext.apply(Ext.form.VTypes, {

	/**
	 * 子网地址的校验
	 * 
	 * @param {}
	 *            subnetId 输入的子网地址
	 * @return {Boolean} 合法返回true，否则返回false
	 */
	SubnetId : function(subnetId) {
		if (Ext.isEmpty(subnetId) || subnetId == '0.0.0.0'
				|| subnetId.indexOf('127.') == 0) {
			return false;
		}
		var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/ // 匹配IP地址的正则表达式
		if (re.test(subnetId)) {
			var binaryValue = "";
			if (RegExp.$1.length > 1 && RegExp.$1.indexOf('0') == 0)
				return false;
			if (RegExp.$2.length > 1 && RegExp.$2.indexOf('0') == 0)
				return false;
			if (RegExp.$3.length > 1 && RegExp.$3.indexOf('0') == 0)
				return false;
			if (RegExp.$4.length > 1 && RegExp.$4.indexOf('0') == 0)
				return false;
			return true;
		}
		return false;
	},

	SubnetIdText : '该输入项必须是合法的子网地址',
	/**
	 * IP地址校验
	 * 
	 * @param {}
	 *            strIP
	 * @return {Boolean}
	 */
	IPAddress : function(strIP) {
		if (Ext.isEmpty(strIP) || strIP == '0.0.0.0'
				|| strIP.indexOf('127.') == 0) {
			return false;
		}
		var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/ // 匹配IP地址的正则表达式
		if (re.test(strIP)) {
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
		return false;
	},
	IPAddressText : '该输入项必须是合法的IP地址',
	/**
	 * MAC地址校验
	 * 
	 * @param {}
	 *            strMAC
	 * @return {Boolean}
	 */
	MACAddress : function(strMAC) {
		if (Ext.isEmpty(strMAC)) {
			return false;
		}
		var re = /^([0-9a-fA-F]{2})(([0-9a-fA-F]{2}){5})$/ // 匹配IP地址的正则表达式
		// 支持XX-XX-XX-XX-XX-XX的表达式
		// var re =
		// /^(([0-9a-fA-F]{2})(([0-9a-fA-F]{2}){5})|((([0-9a-fA-F]{2})-){5}([0-9a-fA-F]{2})))$/
		// // 匹配IP地址的正则表达式
		if (re.test(strMAC)) {
			return true;
		}
		return false;
	},
	MACAddressText : '该输入项必须是MAC地址，格式如 ："00508D7E5D37"',

	/**
	 * 扫描参数中的扫描端口号的校验，必须为1 - 65535的整数，可以输入多个，以分号隔开
	 * 
	 * @param {}
	 *            scanPort
	 * @return {Boolean}
	 */
	SnmpScanPort : function(scanPort) {
		if (Ext.isEmpty(scanPort))
			return false;
		var scanPortArray = scanPort.split(";")
		var reg = /^\+?[1-9][0-9]*$/;
		for (var i = 0; i < scanPortArray.length; i++) {
			if (!reg.test(scanPortArray[i])
					|| parseInt(scanPortArray[i]) > 65535)
				return false;
		}
		return true;
	},
	SnmpScanPortText : '该输入项必须为1 - 65535的整数，以分号隔开',

	/**
	 * 控制输入不能全为空格
	 */

	AllSpaceInput : function(normalInput) {
		if (Ext.isEmpty(normalInput))
			return false;
		var regu = "^[ ]+$";
		var reg_normal = new RegExp(regu);
		return !reg_normal.test(normalInput);

	},
	AllSpaceInputText : '该输入项不能全部为空格',
	/**
	 * 控制端口格式，最大值为65535，且不能以0开头
	 */
	CommonPortText : function(portInput) {
		if (portInput > 65535)
			return false;
		var firstNum = portInput.substring(0, 1);
		if (firstNum == '0')
			return false;
		return true;
	},
	CommonPortTextText : '端口应为1-65535之间的数字，且不能以0开头',

	/**
	 * 控制输入字符的个数，当前是40个字符
	 * 
	 */
	CommonMaxLen : function(inputString) {
		if (Ext.isEmpty(inputString))
			return true;
		if (inputString.length > 40)
			return false;
		else if (/[<|>|'|"]+/.test(inputString) || /\s{2}/.test(inputString)
				|| /^\s/.test(inputString) || /\s$/.test(inputString)) {
			return false;
		} else
			return true;
	},
	CommonMaxLenText : '该输入项最多为40个合法字符',

	/**
	 * 针对邮件通知方式当中标题的验证
	 */
	EmailTitle : function(val, field) {
		if (field.EmailTitle) {
			var obj = field.EmailTitle.obj;
			if (Ext.isEmpty(obj))
				return true;
			if (val.length > 100) {
				obj.disable();
				return false;
			} else {
				obj.enable();
				return true;
			}
		}
	},
	EmailTitleText : '标题长度不超过100个字符',
	/**
	 * 针对起始时间的验证
	 */
	dateRange : function(val, field) {
		if (field.dateRange) {

			var beginId = field.dateRange.begin;
			this.beginField = Ext.getCmp(beginId);

			var endId = field.dateRange.end;
			this.endField = Ext.getCmp(endId);

			var beginDate_temp = this.beginField.getValue();
			var endDate_temp = this.endField.getValue();

			if (Ext.isEmpty(beginDate_temp) || Ext.isEmpty(endDate_temp))
				return true;

			var startDate = new Date(Date.parse(beginDate_temp.replace(/-/g,
					"/")));
			var longStartValue = startDate.getTime();
			var endDate = new Date(Date.parse(endDate_temp.replace(/-/g, "/")));
			var longEndValue = endDate.getTime();
		}

		if (longStartValue <= longEndValue) {
			return true;
		} else {
			return false;
		}
	},

	/**
	 * 特殊字符的校验，不允许输入<,>,",',"和连续2个以上的空格,首尾字符不得为空格
	 * 
	 * @param {}
	 *            inputValue
	 * @return {Boolean}
	 */
	SpecialChar : function(inputValue) {
		if (Ext.isEmpty(inputValue)) {
			return false;
		}
		if (/[<|&|>|'|"|\\]+/.test(inputValue) || /\s{2}/.test(inputValue)
				|| /^\s/.test(inputValue) || /\s$/.test(inputValue)) {
			return false;
		} else {
			return true;
		}
	},
	SpecialCharText : '该输入项不能包含&，\\，|，<，>，\'，\"，连续的2个空格,回车这样的特殊字符且首尾字符不得为空格',
	notEmptyChar : function(inputValue) {
		if (Ext.isEmpty(inputValue)) {
			return false;
		}
		if (/\s{2}/.test(inputValue) || /^\s/.test(inputValue)
				|| /\s$/.test(inputValue)) {
			return false;
		} else {
			return true;
		}
	},
	notEmptyCharText : '该输入项不能包含连续的2个空格这样的特殊字符且首尾字符不得为空格',
	/**
	 * 值班班次时间限制
	 * 
	 * @param {}
	 *            strTime
	 * @return {Boolean}
	 */
	DutySectTime : function(strTime) {
		if (Ext.isEmpty(strTime)) {
			return false;
		}
		if (strTime.length != 5 && strTime.length != 6) {
			return false;
		}
		var re = /^(\+{0,1}\d{1,2})(:{1}|：{1})(\d{1,2})$/
		var re2 = /^(\+)\.+/
		if (re.test(strTime)) {
			var sep = ':';
			if (strTime.indexOf(sep) == -1) {
				sep = '：';
			}
			var str = strTime
			if (re2.test(strTime)) {
				str = strTime.substring(1, strTime.length);
			}
			var strAry = str.split(sep);
			if (parseInt(strAry[0]) > -1 && parseInt(strAry[0]) < 24
					&& parseInt(strAry[1]) > -1 && parseInt(strAry[1]) < 60) {
				return true
			} else {
				return false;
			}
		}
		return false;
	},
	DutySectTimeText : '该输入项的格式为 ："10:30" 或者 "+10:30"，前面带+号表示第二天, 小时必须在00到23之间, 分钟必须在00到59之间。',

	/**
	 * 值班表年份输入框中，年份不能以0开始
	 */
	DutyYearValue : function(yearValue) {
		if (Ext.isEmpty(yearValue)) {
			return false;
		}
		var firstChar = yearValue.substring(0, 1);
		if (firstChar == '0')
			return false;
		else
			return true;
	},
	DutyYearValueText : '年份不能以0开头！',

	/**
	 * 控制输入字符的个数，当前是40个字符 /^(.1.3.6.1.4.1.)(\d+(\.\d+)*)+$/
	 */
	OidValue : function(inputString) {
		if (Ext.isEmpty(inputString))
			return false;
		else if (/^\.1\.3\.6\.1\.4\.1(\.\d+)*$/.test(inputString)) {
			return true;
		} else
			return false;
	},
	OidValueText : '该输入项必须是合法字符OID',

	/**
	 * 只能输入数字、英文字母或者下划线
	 * 
	 * @param {}
	 *            inputString
	 * @return {Boolean}
	 */
	CharAndNum : function(inputString) {
		if (Ext.isEmpty(inputString)) {
			return false;
		} else if (/^[a-zA-Z0-9_]+$/.test(inputString)) {
			return true;
		} else {
			return false;
		}
	},
	CharAndNumText : '该输入项必须只能输入数字、英文字母或者下划线',
	/**
	 * 只能输入数字、英文字母或者下划线，并且长度大于8小于40
	 * 
	 * @param {}
	 *            inputString
	 * @return {Boolean}
	 */
	CharAndNumAndMin8AndMax40 : function(inputString) {
		if (Ext.isEmpty(inputString)) {
			return false;
		} else if (inputString.length < 8 || inputString.length > 40) {
			return false;
		} else if (/^[a-zA-Z0-9_]+$/.test(inputString)) {
			return true;
		} else {
			return false;
		}
	},
	CharAndNumAndMin8AndMax40Text : '该输入项必须只能输入数字、英文字母或者下划线，并且长度在8到40之间',
	/**
	 * 只能输入数字、英文字母或者下划线，并且长度大于8小于20
	 * 
	 * @param {}
	 *            inputString
	 * @return {Boolean}
	 */
	CharAndNumAndMin8AndMax20 : function(inputString) {
		if (Ext.isEmpty(inputString)) {
			return false;
		} else if (inputString.length < 8 || inputString.length > 20) {
			return false;
		} else if (/^[a-zA-Z0-9_]+$/.test(inputString)) {
			return true;
		} else {
			return false;
		}
	},
	CharAndNumAndMin8AndMax20Text : '该输入项必须只能输入数字、英文字母或者下划线，并且长度在8到20之间',
	/**
	 * 只能输入数字、英文字母或者下划线，并且长度大于8小于20
	 * 
	 * @param {}
	 *            inputString
	 * @return {Boolean}
	 */
	CINameMin1AndMax10 : function(inputString) {
		if (Ext.isEmpty(inputString)) {
			return false;
		}else if (/^[^@#$%&<>|\<>^]{1,10}$/.test(inputString)) {
			return true;
		} else {
			return false;
		}
	},
	CINameMin1AndMax10Text : 'CI名称不能为空，最多10个字符！不能包括@#$%^&\\|<>\'，\等特殊字符！'
});