var selectedUserIdArray = new Array();
var selectedUserRealNameArray = new Array();
var flag = false;
var start = 1;
$(document).ready(function() {
	$("div[id^=day]").click(function(){
		if($(this).children().length == 2){
			$(this).children().each(function(index,ele){
			    if(1==index && !flag){
			           start = $(this).attr('id');
				       $(".every_date_content_yellow").attr("class", "");
				       $(this).addClass('every_date_content_yellow');
			    	}
			});
		}
		flag = false;
	});
	if(window.screen && window.screen.availHeight){
			$("#mainBodyDiv").css("height",window.screen.availHeight-406);
		}
});
function useCycle(){
	var cycleId = $("#cycleSelect").val();
	if(Ext.isEmpty(cycleId)){
		Ext.Msg.show({
			title : '提示',
			msg : '请先添加值班周期！',
			modal : true,
			buttons : Ext.Msg.OK,
			icon : Ext.Msg.INFO
		});
		return;
	}
	DutyService.getDutyUnitListByCycleId(cycleId,{
		callback : function(result){
				var number = 0;
				var size = result.length;
				for(var i=start;i<32;i++){
					if(null != $("#select"+i)){
						var index = number%size;
						$("#select"+i).attr("value",result[index].id);
						number++;
					}
				}
			},
		errorHandler : function(errorString, exception) {
			Ext.Msg.show({
						title : '错误',
						msg : '该值班周期已被刪除！',
						modal : true,
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.ERROR,
						fn : function() {
							 $("#cycleSelect").find("option:selected").remove(); 
						}
					});
		}
	});
}
function setFlag(){
	flag = true;
}
function selectDutyUser(){
   var url = "/itsm/common/userQuery.do?selectOne=2&auto=Y&status=submit&exclude=15,16&enter=enter";//auto=Y表示默认就查询出所有的运维人员
  // window.open(url, "", "height=420, width=1100, top=260, left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
   tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}

function clearDutyUser(){
	$("#selectedDutyUser").html("");
	selectedUserIdArray = new Array();
	selectedUserRealNameArray = new Array();
}

function doCallBack(rtValue){
	for(var i=0;i<rtValue.length;i++){
		var tempRealName = "";
    	var tempUserId = 0;
	    for(var j=0;j<rtValue[i].length;j++){
	        if(j==1){
	        	tempRealName = Ext.util.Format.htmlDecode(rtValue[i][j].realName);
	         	continue;
	        }else if(j==9){
	        	tempUserId = rtValue[i][j].id;
	         	continue;
	        }
	    }
	     if(0 != tempUserId && !isDutyPersonSelected(tempUserId)){
        	if(selectedUserRealNameArray.length == 0){//第一个值班人员
        		$("#selectedDutyUser").append(tempRealName);
        	}else{
        		$("#selectedDutyUser").append("，"+tempRealName);
        	}
        	selectedUserIdArray.push(tempUserId);
        	selectedUserRealNameArray.push(tempRealName);
        }
	}
	if(selectedUserIdArray.length == 1){
		 var monthValue = $("#monthValue").text().trim();
		 if(monthValue.length == 1)
		 	monthValue = "0"+monthValue;
		 var yearMonth = $("#yearValue").text()+"-"+monthValue;
		 DutyService.getFixedMonthRecordsByUserName(selectedUserIdArray[0],yearMonth,function(returnData){
		 	if(!Ext.isEmpty(returnData)){
	 		    var index = 0;
	 			for(var i=1;i<32;i++){
					if(null != $("#select"+i)){
						$("#select"+i).val(returnData[index]);
						index++;
					}
				}
		 	}
		 })
	}
}

/**
 * 判断选择的值班人是否已经包含
 */
function isDutyPersonSelected(userId){
	for(var i=0;i<selectedUserIdArray.length;i++){
		if(parseInt(selectedUserIdArray[i]) == parseInt(userId))
			return true;
	}
	return false;
}

function saveDutyRecord(){
  if(selectedUserIdArray.length == 0){
  		Ext.Msg.show({
			title : '提示',
			msg : '请选择值班人！',
			modal : true,
			buttons : Ext.Msg.OK,
			icon : Ext.Msg.INFO
		});
		return;
  }	  
  var monthValue = $("#monthValue").text().trim();
  if(monthValue.length == 1)
  	monthValue = "0"+monthValue;
  var yearMonth = $("#yearValue").text()+"-"+monthValue;
   var dutyUnitIdArray = new Array();
   var dutyUnitNameArray = new Array();
	for(var i=0;i<32;i++){
		if(null != document.getElementById("select"+i)){
			var selectedValue = $("#select"+i+" option:selected").val().trim();
			var selectedName = $("#select"+i+" option:selected").text().trim();
			if(Ext.isEmpty(selectedValue)){
				Ext.Msg.show({
					title : '提示',
					msg : '请先添加班次！',
					modal : true,
					buttons : Ext.Msg.OK,
					icon : Ext.Msg.INFO
				});
				return;
			}
			dutyUnitIdArray.push(selectedValue);
			dutyUnitNameArray.push(selectedName);
		}
	}
	
	DutyService.saveDutyRecord(yearMonth,selectedUserIdArray,dutyUnitIdArray,dutyUnitNameArray,selectedUserRealNameArray,{
		callback : function(result){
				Ext.Msg.show({
					title : '提示',
					msg : '保存成功！',
					modal : true,
					buttons : Ext.Msg.OK,
					icon : Ext.Msg.INFO
				});
			},
		errorHandler : function(errorString, exception) {
		    var errParam = exception.errorParam;
		    errParam = window.encodeURI(errParam);          
            errParam = window.encodeURI(errParam); 
			location.href = "/itsm/duty/showError.do?errMsg="+exception.message+"&errParam="+errParam;
		}
	});
}