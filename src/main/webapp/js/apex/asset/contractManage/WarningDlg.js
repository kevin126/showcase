/**
 * 比较合同的开始时间和结束时间，合同结束时间晚于开始时间
 * @author timy
 * @param {} startT 合同开始时间
 * @param {} endT 合同结束时间
 */
WarningDlg = function(startT, endT) {

	var result = false;
	var startTime;
	var endTime;
	//把string 时间类型转化为long类型
	var startDate = new Date(Date.parse(startT.replace(/-/g, "/")));
	startTime = startDate.getTime();

	var endDate = new Date(Date.parse(endT.replace(/-/g, "/")));
	endTime = endDate.getTime();
		//也往后long型时间也小
	if (endTime > startTime) {
		result = true;
	} else {
		result = false;
		Ext.MessageBox.show({
					title : '错误',
					msg : "合同结束日期应晚于开始日期！",
					model : true,
					icon : Ext.Msg.ERROR,
					buttons : Ext.Msg.OK
				});
	}
	 this.getBoolean=function() {
		return result;
	}
}


 