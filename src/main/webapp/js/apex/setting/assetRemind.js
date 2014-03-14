function selectMail() {
	var url = "/itsm/common/userQuery.do?selectOne=2&enter=enter";
 	tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}

function doCallBack(rtValue) {
	var v1 = "";
	for (var i = 0; i < rtValue.length; i++) {
		for (var j = 0; j < rtValue[i].length; j++) {
			if (j == 0) {
				if (i == 0) {
					v1 = rtValue[i][j].name;
				} else {
					v1 = v1 + "," + rtValue[i][j].name;
				}
				break;
			}
		}
	}
	var v2 = $("#mailSender").val();
	if (v2 == null||v2=="") {
		$("#mailSender").attr("value", v1);
		$("#mailSender").blur();
	} else {
		var array1 = new Array();
		var array2 = new Array();
		array1 = v1.split(',');
		array2 = v2.split(',');
		for (var i = 0; i < array1.length; i++) {
			var flag = false;
			for (var j = 0; j < array2.length; j++) {
				if (array2[j] == array1[i]) {
					flag = true;
					break;
				}
			}
			if (flag == false) {
				v2 += "," + array1[i];
			}
		}
		$("#mailSender").attr("value", v2);
		$("#mailSender").blur();
	}
}
function save() {
	var msg = document.getElementById('showMsg').value;
	if (msg == 1) {
		Ext.Msg.show({
					title : '提示',
					msg : '资产提醒设置成功！',
					modal : true,
					buttons : Ext.Msg.OK,
					icon : Ext.Msg.INFO
				});
	}

}

function clearMails(){
	$("#mailSender").attr("value", "");
}