var flag_total = null; //全局变量，用于标识选择用户后，其结果应该显示的位置，因为在创建 SLA的界面中有多处选择用户
$(function(){ 
	var operateType = $("#operateType").val();
	if(operateType == 'edit'){//编辑SLA协议
		$("#titleName").text("编辑SLA");
		$("#slaName").attr("readonly",true); 
		$("#slaName").css("background","#ddd");
		$("#cancealBtn").attr("href","/itsm/sla/viewSlaDetailAction.do?SLACODE="+$("#slaCode").val()); 
		$("#slaForm").attr("action","/itsm/sla/operateSlaAction.do?method=saveEdit"); 	
	}else{//新增SLA协议
		$("#titleName").text("创建SLA");
		$("#allImpace").attr("checked",true);
		$("#cancealBtn").attr("href","/itsm/sla/slaManageAction.do?method=displaySla&menuId=m7_0"); 
		$("#slaForm").attr("action","/itsm/sla/operateSlaAction.do?method=saveCreate"); 
	}
	if($("#resolveDays").val()==0)
		$("#resolveDays").val("");
	if($("#resolveHours").val()==0)
		$("#resolveHours").val("");
	if($("#resolveMinutes").val()==0)
		$("#resolveMinutes").val("");
	if($("#pollCycleDays").val()==0)
		$("#pollCycleDays").val("");
	if($("#pollCycleHours").val()==0)
		$("#pollCycleHours").val("");
	if($("#pollCycleMinutes").val()==0)
		$("#pollCycleMinutes").val("");
	for(var i=1;i<5;i++){
		if($("#thresholdDays"+i).val()==0)
			$("#thresholdDays"+i).val("");
		if($("#thresholdHours"+i).val()==0)
			$("#thresholdHours"+i).val("");
	}
});

/**
 * 响应选择用户按钮
 */
function selectUser(flag){
	 flag_total = flag;
	 if(flag=="rquestUser")
		 var url = "/itsm/common/userQuery.do?selectOne=1&enter=enter";
	else
	     var url = "/itsm/common/userQuery.do?selectOne=2&auto=Y&status=submit&enter=enter";//auto=Y表示默认就查询出所有的运维人员
	// window.open(url, "", "height=420, width=1100, top=260, left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
	tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}

/**
 * 选完用户后的回调函数，即将选中的用户赋值到相应的输入框中
 */
function doCallBack(rtValue){
	var resultRealName = "";
	var resultName = "";
	for(var i=0;i<rtValue.length;i++){
	    for(var j=0;j<rtValue[i].length;j++){
	        if(j==1){
	        	resultRealName = resultRealName + ";" + Ext.util.Format.htmlDecode(rtValue[i][j].realName);
	         	continue;
	        }else if(j==0){
	        	resultName = resultName + ";" + Ext.util.Format.htmlDecode(rtValue[i][j].name);
	         	continue;
	        }
	    }
	}
	if(!Ext.isEmpty(resultRealName))
		resultRealName = resultRealName.substring(1,resultRealName.length);
	if(!Ext.isEmpty(resultName))
		resultName = resultName.substring(1,resultName.length);
	if('reportReceiver' == flag_total || flag_total.indexOf('emailReceiver') != -1){
		var oldRealNames = $("#"+flag_total).val();
		var oldNames = $("#"+flag_total+"_hidden").val();
		if(oldNames == 'null')
			oldNames = null;
		if(!Ext.isEmpty(oldNames) && !Ext.isEmpty(resultName)){
			var newRealNameArray = resultRealName.split(";");
			var newNameArray = resultName.split(";");
			for(var i=0;i<newNameArray.length;i++){
				if(oldNames.indexOf(newNameArray[i]) == -1){
					oldRealNames = oldRealNames+";"+newRealNameArray[i];
					oldNames = oldNames + ";" + newNameArray[i];
				}
			}
			if(!Ext.isEmpty(oldRealNames) && oldRealNames.substring(0,1) == ";")
				oldRealNames = oldRealNames.substring(1,oldRealNames.length);
			if(!Ext.isEmpty(oldNames) && oldNames.substring(0,1) == ";")
				oldNames = oldNames.substring(1,oldNames.length);
			
			$("#"+flag_total).val(oldRealNames);
			$("#"+flag_total+"_hidden").val(oldNames);
		}else{
			$("#"+flag_total).val(resultRealName);
			$("#"+flag_total+"_hidden").val(resultName);
		}
	}else{
		$("#"+flag_total).val(resultRealName);
		$("#"+flag_total+"_hidden").val(resultName);
	}
	if(flag_total.indexOf('emailReceiver') != -1){
		var obj = {};
		var str = flag_total.substring(flag_total.length-1,flag_total.length);
		var index = parseInt(str);
		var params = new Array();
		params.push(index);
		obj.data = params
		handleEmailRuleBlur(obj);
	}
	$("#"+flag_total).blur();
}

/**
 * 响应选择故障类型
 */
function selectType(){
	new Apex.common.TypeList("incidentType", "INC").showTypeList();
}

/**
 * 响应选择部门
 */
function selectDepartment(){
	var win=new AllDepartmentDlg('department');
	win.show();
}

/**
 * 
 */
function validate(){
	
}



/**
 * 清空指定输入域中的值
 */
function clearFixedField(fieldId){
	$("#"+fieldId).val("");
	$("#"+fieldId+"_hidden").val(null);
	$("#"+fieldId).blur();
}
