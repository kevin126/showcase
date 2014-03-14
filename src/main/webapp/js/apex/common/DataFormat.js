/**
 * 这个js文件是用来格式化表格字段的
 */

// 告警严重度格式化
function formServity(value, metadata) {
	switch (value) {
		case 1 : {
			metadata.attr = 'style="background-color:#FF0000"';
			return "紧急告警";
		}
		case 2 : {
			metadata.attr = 'style="background-color:#BFA320"';
			return "主要告警";
		}
		case 3 : {
			metadata.attr = 'style="background-color:#748F56"';
			return "次要告警";
		}
		case 4 : {
			metadata.attr = 'style="background-color:#5B9C87"';
			return "警告告警";
		}
		case 5 : {
			metadata.attr = 'style="background-color:#4E6847"';
			return "清除告警";
		}
		case 6 : {
			metadata.attr = 'style="background-color:#29F312"';
			return "不确定告警";
		}
		default : {
			metadata.attr = 'style="background-color:#0085E6"';
			return "严重度不详";
		}
	}
}

function convertServity(value) {
	switch (value) {
		case 1 :
			return "紧急告警";
		case 2 :
			return "主要告警";

		case 3 :
			return "次要告警";

		case 4 :
			return "警告告警";

		case 5 :
			return "清除告警";

		case 6 :
			return "显示信息";

		default :
			return "严重度不详";

	}
}

// 日期格式化
function dateFormat(value) {
//	aler(value);
	if (!Ext.isEmpty(value)&&value != 0) {
		var date = new Date(value);
		return Ext.util.Format.date(date, 'Y-m-d H:i:s')
	}else{
	return null;
	}
}
/**
 * 返回年月日 时分Y-m-d H:i
 * @param {} value
 * @return {}
 */
function dateFormatYMDHI(value) {
//	aler(value);
	if (!Ext.isEmpty(value)&&value != 0) {
		var date = new Date(value);
		return Ext.util.Format.date(date, 'Y-m-d H:i')
	}else{
	return null;
	}
}
function dateFormatSimple(value) {
	if (value != 0 && !Ext.isEmpty(value)) {
		var date = new Date(value);
		return Ext.util.Format.date(date, 'Y-m-d')
	} else {
		return;
	}
}

// 告警确认状态的格式化
function ackStateFormat(value) {
	if (value == true)
		return "已确认";
	else
		return "未确认";
}

function commandValidFormat(value, metadata) {
	if (value) {
		metadata.attr = 'style="background-color:#00FF00"';
		return "合法";
	} else {
		metadata.attr = 'style="background-color:#FF0000"';
		return "不合法";
	}
}

function handleClik() {
	Ext.Msg.alert('heheheh', 'hahaha');
}

// 告警清除状态格式化
function clearStateFormat(value) {
	if (value == true)
		return "已清除";
	else
		return "未清除";
}

// 告警是否上报格式化
function reportFormat(value) {
	if (value == true)
		return "上报";
	else
		return "不上报";
}

// 设备通断格式化
function connectFormat(value, metadata) {
	if (value == true) {
		metadata.attr = 'style="background-color:#00FF00"';
		return "通";
	} else {
		metadata.attr = 'style="background-color:#FF0000"';
		return "断";
	}
}
// Syslog严重度格式化
function syslogSeverityFormat(value, metadata) {
	switch (value) {
		case 0 : {
			metadata.attr = 'style="background-color:#FF0000"';
			return "紧急";
		}
		case 1 : {
			metadata.attr = 'style="background-color:#9F2300"';
			return "警告";
		}
		case 2 : {
			metadata.attr = 'style="background-color:#748F56"';
			return "危机";
		}
		case 3 : {
			metadata.attr = 'style="background-color:#5B9C87"';
			return "错误";
		}
		case 4 : {
			metadata.attr = 'style="background-color:#4E6847"';
			return "告警";
		}
		case 5 : {
			metadata.attr = 'style="background-color:#2923FE"';
			return "通知";
		}
		case 6 : {
			metadata.attr = 'style="background-color:#19836E"';
			return "信息";
		}
		case 7 : {
			metadata.attr = 'style="background-color:#101311"';
			return "调试";
		}
		default : {
			metadata.attr = 'style="background-color:#0085E6"';
			return "严重度不详";
		}
	}
}

/**
 * 事件工单优先级格式化
 */
function wfPriorFormat(value, metadata) {
	switch (value) {
		case 4 : {
			metadata.attr = 'style="background-image: url(/itsm/images/urgent.gif);background-repeat:no-repeat;"';
			return '';
		}
		case 3 : {
			metadata.attr = 'style="background-image: url(/itsm/images/high.gif);background-repeat:no-repeat;"';
			return '';
		}
		case 2 : {
			metadata.attr = 'style="background-image: url(/itsm/images/middle.gif);background-repeat:no-repeat;"';
			return '';
		}
		case 1 : {
			metadata.attr = 'style="background-image: url(/itsm/images/low.gif);background-repeat:no-repeat;"';
			return '';
		}
		default : {
			metadata.attr = 'style="background-image: url(/itsm/images/low.gif);background-repeat:no-repeat;"';
			return '';
		}
	}
}

function wfPriorFormat2(value, metadata) {
	switch (value) {
		case 1 : {
			return '<a href=# onclick="showPriorUnTask(1);">' + "紧急" + '</a>';
		}
		case 2 : {
			return '<a href=# onclick="showPriorUnTask(2);">' + "高" + '</a>';
		}
		case 3 : {
			return '<a href=# onclick="showPriorUnTask(3);">' + "中" + '</a>';
		}
		case 4 : {
			return '<a href=# onclick="showPriorUnTask(4);">' + "低" + '</a>';
		}
		default : {
			return "NA";
		}
	}
}

/**
 * 工单影响度格式化
 */
function wfImpactFormat(value, metadata) {
	switch (value) {
		case 3 : {
			metadata.attr = 'style="background-image: url(/itsm/images/duty/gao.gif);background-repeat:no-repeat;"';
			return '';
		}
		case 2 : {
			metadata.attr = 'style="background-image: url(/itsm/images/duty/zhong.gif);background-repeat:no-repeat;"';
			return '';
		}
		case 1 : {
			metadata.attr = 'style="background-image: url(/itsm/images/duty/di.gif);background-repeat:no-repeat;"';
			return '';
		}
		default : {
			metadata.attr = 'style="background-image: url(/itsm/images/duty/di.gif);background-repeat:no-repeat;"';
			return "NA";
		}
	}
}

/**
 * 影响度格式化
 * @param {} value
 * @param {} metadata
 * @return {}
 */
function wfImpactFormat2(value, metadata) {
	switch (value) {
		case 3 : {
			return '<a href="javascript:void(0);">' + "高" + '</a>';
		}
		case 2 : {
			return '<a href="javascript:void(0);">' + "中" + '</a>';
		}
		case 1 : {
			return '<a href="javascript:void(0);">' + "低" + '</a>';
		}
		default : {
			return "NA";
		}
	}
}

/**
 * 事件工单优先级格式化
 */
function wfSeverityFormat2(value, metadata) {
	switch (value) {
		case 1 : {
			return '<a href=# onclick="showSeverityUnTask(1);">' + "高" + '</a>';
		}
		case 2 : {
			return '<a href=# onclick="showSeverityUnTask(2);">' + "中" + '</a>';
		}
		case 3 : {
			return '<a href=# onclick="showSeverityUnTask(3);">' + "低" + '</a>';
		}
		default : {
			return "";
		}
	}
}

function wfSeverityFormat(value, metadata) {
	switch (value) {
		case 1 : {
			metadata.attr = 'style="background-image: url(images/gao.gif);background-repeat:no-repeat;"';
			return "";
		}
		case 2 : {
			metadata.attr = 'style="background-image: url(images/zhong.gif);background-repeat:no-repeat;"';
			return "";
		}
		case 3 : {
			metadata.attr = 'style="background-image: url(images/di.gif);background-repeat:no-repeat;"';
			return "";
		}
		default : {
			metadata.attr = 'style="background-image: url(images/di.gif);background-repeat:no-repeat;"';
			return "";
		}
	}
}

// Syslog等级格式化
function syslogFacilityEormat(value) {
	switch (value) {
		case 0 :
			return "kernel messages";
		case 1 :
			return "user-level messages";
		case 2 :
			return "mail system";
		case 3 :
			return "system daemons";
		case 4 :
			return "security/authorization messages";
		case 5 :
			return "messages generated internally by syslogd";
		case 6 :
			return "line printer subsystem";
		case 7 :
			return "network news subsystem";
		case 8 :
			return "UUCP subsystem";
		case 9 :
			return "clock daemon";
		case 10 :
			return "security/authorization messages";
		case 11 :
			return "FTP daemon";
		case 12 :
			return "NTP subsystem";
		case 13 :
			return "log audit";
		case 14 :
			return "log alert";
		case 15 :
			return "clock daemon";
		case 16 :
			return "local0";
		case 17 :
			return "local1";
		case 18 :
			return "local2";
		case 19 :
			return "local3";
		case 20 :
			return "local4";
		case 21 :
			return "local5";
		case 22 :
			return "local6";
		case 23 :
			return "local7";
		default :
			return "级别不详";
	}
}
function portStatusRender(value, metadata) {
	if (!value) {
		return;
	}
	var portStatus = value.split(':');
	var adminStatus = portStatus[0];
	var operStatus = portStatus[1];
	if (adminStatus == ApexChassisConstants.PortLinkStatus_Down_Value) {
		metadata.attr = 'style="background-color:yellow"';
	} else if (operStatus == ApexChassisConstants.PortLinkStatus_Down_Value) {
		metadata.attr = 'style="background-color:gray"';
	} else {
		metadata.attr = 'style="background-color:green"';
	}

}

function chassisTemplateTypeRender(value, metadata) {
	switch (value) {
		case ApexChassisConstants.ChassisTemplate_Shelf_Type : {
			// metadata.attr = 'style="background-color:gray"';
			return "机架";
		}
		case ApexChassisConstants.ChassisTemplate_Port_Type : {
			// metadata.attr = 'style="background-color:green"';
			return "端口";
		}
		case ApexChassisConstants.ChassisTemplate_Card_Type : {
			return "板卡";
		}
	}

}

function chassisIsisHorizontalRender(value, metadata) {
	switch (value) {
		case ApexChassisConstants.ChassisTemplate_VerticalLayout : {
			// metadata.attr = 'style="background-color:gray"';
			return "否";
		}
		case ApexChassisConstants.ChassisTemplate_HorizontalLayout : {
			// metadata.attr = 'style="background-color:green"';
			return "是";
		}
	}

}

function chassisTemplateBgcolorRender(value, metadata) {
	// metadata.attr = 'style=' + '"background-color:' + value + '"';
	metadata.attr = 'style="background-color:#B8CFEE"';
	return value;
}

function monthStatusRender(value, metadata) {
	if (value.indexOf('_selected') != -1)
		metadata.attr = 'style="background-color:#ABC8E6"';
	if (value == '已安排' || value == '已安排_selected') {
		return "<img src='/itsm/images/icons/arranged.gif'></img>";
	} else if (value == '未安排' || value == '未安排_selected') {
		return "<img src='/itsm/images/icons/noarranged.gif'></img>";
	} else if (value == '已过期' || value == '已过期_selected') {
		return "<img src='/itsm/images/icons/expire.gif'></img>";
	}
}

function convertbyteToByte(value) {// 将bps转化为Bps
	var numberValue = Number(value);
	var finalValue = numberValue / 8;
	return finalValue.toFixed(0);
}

function convertMillToDate(value) {// 毫秒数转换成year-month-day
	// hour:minute:second格式的Date
	if (value) {
		var date = new Date(value);
		value = date.format('y-m-d h:i:s');
		return value;
	}
}

function convertbyteToKByte(value) {// 将bps转化为KBps
	var numberValue = Number(value);
	var finalValue = numberValue / (8 * 1024);
	return finalValue.toFixed(0);
}

function convertByteToMega(value) {
	return value / (1000 * 1000);
}

function faqFormat(value, metadata) {
	if (value == true) {
		metadata.attr = 'style="background-color:#12BF0F"';
		return "已注冊";
	} else {
		metadata.attr = 'style="background-color:#BF0023"';
		return "未注冊";
	}
}

function noticeTopFormat(value, metadata) {
	if (value) {
		return "<img src='/itsm/images/icons/tn.gif'></img>";
	} else {
		return "";
	}
	return '';
}

/**
 * 工单状态格式化
 */
function statusFormat(value){
	if(value ){
		var state = Status_I18N[value];
		if(state){
			return state;
		}
	}
	return "";	
}

/**
 * 流量单位格式化
 */
function unitFormat(value){
	var tUnit = 1024*1024*1024*1024;
	var gUnit = 1024*1024*1024;
	var mUnit = 1024*1024;
	var kUnit = 1024;
	if(value/tUnit >= 1){
		return (value/tUnit).toFixed(2)+" TBps";
	}else if(value/gUnit >= 1){
		return (value/gUnit).toFixed(2)+" GBps";
	}else if(value/mUnit >= 1){
		return (value/mUnit).toFixed(2)+" MBps";
	}else if(value/kUnit >= 1){
		return (value/kUnit).toFixed(2)+" KBps";
	}else{
		return value +" Bps";
	}
}

/***
 * 表格中转义特殊字符
 */
function convertTextToHtml(value){
	return Ext.util.Format.htmlEncode(value);
}

