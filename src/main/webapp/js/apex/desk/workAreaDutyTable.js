var operateDay_total;//用于记录当时是在操作哪一天的日志，全局变量
var deleteLogId_total;//用于保存待删除的值班日志记录，全局变量
var permit_total = true;//用于控制同时只能打开一个窗口
var top_total;//DIV显示的上坐标
var left_total;////DIV显示的左坐标
jQuery(function(){
		var date = new Date();
		var year = date.getUTCFullYear();
		var month = date.getUTCMonth()+1;
		jQuery("#viewLogYear").text(year);
		jQuery("#viewLogMonth").text(month);
		if(month < 10)
			month = '0'+month;
		var param = year+"-"+month;
		jQuery("#historyDutyLogSelect").val(month);
		jQuery("#queryHistoryYear").val(year);
		var recordtPosition = jQuery("#dutyRecordList").offset();
		var top = recordtPosition.top+100;
	    var left = recordtPosition.left+130;
		jQuery("#dutyLoading").css({
				    	"top" : top+"px",
				    	"left" : left+"px"
				    }).show("100", reloadDutyTableData);
		
	});
	
function reflushDutyTable(dutyTable){
   		jQuery("#userRealName").val(dutyTable.realName);
   		jQuery("#userId").val(dutyTable.userId);
   		for(var i=1;i<43;i++){
   			jQuery("#record"+i).empty();
			var className = "";
			var dutyRecord = dutyTable.dutyUnits[i-1];
			if(null != dutyRecord && dutyRecord.monthType == 'current' && !dutyRecord.today){//当月
				className = "everyday";
			}else if(null != dutyRecord && dutyRecord.today){//当天
				className = "everyday_today";
			}else{
				className = "everyday_history";
			}
			if(i%7 == 0){
				className = className + " borderRightNone";
			}
			jQuery("#record"+i).attr("class",className);
			jQuery("#record"+i).append(createRecord(dutyRecord));
   			
   		}
   		jQuery("#dutyLoading").css("display","none");
}

function handleSelectChange(){
	var date = new Date();
	var year = date.getUTCFullYear();
	var month = jQuery("#dutyTableMonthSelect").val();
	var param = year+"-"+month;
    DutyService.getFixedMonthDutyRecords(param,function(data){
   	    reflushDutyTable(data);
   });
}
	
function createRecord(duty){
	var oBuffer = new Array(); 
	oBuffer.push("<h1>"+duty.dayNumber+"</h1>");
	var units = duty.dutyUnits;
	if(0 == units.length){//不需要值班
		//oBuffer.push("<div class='workPlan' style='background-color: rgb(0, 153, 51);'>休息</div>");
	}else{
		for(var i=0;i<units.length;i++){
			var uint = units[i];
			oBuffer.push("<div class='workPlan' style='background-color: "+uint.colorValue+"'>"+uint.name+"</div>");
			break;
		}
		//oBuffer.push(" <div class='logPic'> <a href='#' onclick='showWriteLogDiv(\""+duty.dayNumber+"\",\""+duty.monthType+"\",event)'><img src='/itsm/images/workarea/log.gif' alt='写日志'  title='写日志'/></a></div>");
	}
   return oBuffer.join("");
}

function showWriteLogDiv(day,monthType,event){
	if(permit_total){
		jQuery("#errorTr").hide();
	    jQuery("#writeLogTitle").val("");
		jQuery("#writeLogContent").val("");
		operateDay_total = day;
		if(jQuery.browser.msie){
			top_total = event.clientY;
			left_total = event.clientX;
		}else{
			top_total = event.clientY+30;
			left_total = event.clientX-120;
		}
		jQuery("#writeLog").css({
				    	"top" : top_total +"px",
				    	"left" : left_total+"px"
				    }).show("fast");
		permit_total = false;
	}
}

function writeDutyLog(){
	var result = validateWriteLog();
	if(result != true){//表单格式验证不通过
		jQuery("#writeLogErrMessage").text(result);
		jQuery("#errorTr").show();
		return;
	}
	DutyService.writeDutyLog(jQuery("#writeLogTitle").val(),jQuery("#writeLogContent").val(),function(){
		viewHistoryDutyLog();
//		hideDutyTableDiv("writeLog");
	});
}

function validateWriteLog(){
	var title = jQuery("#writeLogTitle").val().trim();
	var content = jQuery("#writeLogContent").val().trim();
	if(Ext.isEmpty(title))
		return "标题不能为空";
	if(title.length > 30)
		return "标题不超过30字符";
	if(Ext.isEmpty(content))
		return "内容不能为空";
	if(content.length > 20000)
		return "内容不能20000字符";
	return true;
}

function hideDutyTableDiv(divId){
	jQuery("#"+divId).hide();
	permit_total = true;
}
/**
 * 产看历史记录
 */
function viewHistoryDutyLog(){
	var totalWidth  = getTotalWidth();
	var left = left_total;
	if (jQuery.browser.msie) {
		if(left_total + 520 > totalWidth)
			left = totalWidth-520;
	}else{
		if(left_total + 665 > totalWidth)
			left = totalWidth-665;
	}
	jQuery("#historyDutyLogList").empty();
	jQuery("#historyDutyLogDiv").css({
			    	"top" : top_total +"px",
			    	"left" : left+"px"
			    }).show("fast");
	jQuery("#historyDutyLogList").ajaxStart(function(){
			jQuery(this).html("<div><img src='/itsm/images/035.gif'/>加载中，请稍候…</div>");
		});
	var date = new Date();
	var year = date.getUTCFullYear();
	var month = date.getUTCMonth()+1;
	if(month < 10)
		month = '0'+month;
		jQuery("#queryHistoryYear").val(year);
	jQuery("#historyDutyLogSelect").val(month);
	var monthAndYear = year + "-" + month
	var userId = jQuery("#userId").val();
	jQuery("#historyDutyLogList").load("/itsm/duty/viewDutyLog.do?monthAndYear="+monthAndYear+"&userId="+userId,function(){
			if(jQuery.browser.version == '7.0'){
			jQuery("#historyLogTable").css("width","96.5%");
		}
	});
	jQuery("#writeLog").hide();
	jQuery("#taskList").hide();
}

/**
 * 
 */
function viewWriteLog(){
	jQuery("#writeLogTitle").val("");
	jQuery("#writeLogContent").val("");
	jQuery("#historyDutyLogDiv").hide();
	jQuery("#taskList").hide();
	jQuery("#writeLog").css({
		    	"top" : top_total +"px",
		    	"left" : left_total+"px"
		    }).show("fast");
}

function queryHistoryDutyLog(){
	var date = new Date();
	var year = jQuery("#queryHistoryYear").val().trim();
	var month = jQuery("#historyDutyLogSelect").val();
	var monthAndYear = year + "-" + month
	var userId = jQuery("#userId").val();
	jQuery("#historyDutyLogList").load("/itsm/duty/viewDutyLog.do?monthAndYear="+monthAndYear+"&userId="+userId);
}

function selectUser(){
	var url='/itsm/common/userQuery.do?selectOne=1&auto=Y&enter=enter';
 tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}

function doCallBack(rtValue){
	for(var i=0;i<rtValue.length;i++){
	    for(var j=0;j<rtValue[i].length;j++){
	        if(j==1){
	        	jQuery("#userRealName").val(Ext.util.Format.htmlDecode(rtValue[i][j].realName));
	         	continue;
	        }else if(j==9){
	        	jQuery("#userId").val(rtValue[i][j].id);
	         	continue;
	        }
	    }
	}
}

function editDutyLog(logId){
	if(jQuery.browser.msie){
		jQuery("#editTitle").val(document.getElementById('title'+logId).innerText);
		jQuery("#editContent").val(document.getElementById('content'+logId).innerText);
	}else{
		var htmlTitle = jQuery("#title"+logId).text();
		var textTitle = htmlTitle.replace(new RegExp("<br>","g"),"\n");
		jQuery("#editTitle").val(textTitle);
		
		var htmlContent = jQuery("#content"+logId).html();
		var textContent = htmlContent.replace(new RegExp("<br>","g"),"\n");
		jQuery("#editContent").html(textContent);
	}
	jQuery("#operateLogId").val(logId);
	jQuery("#editLogDiv").show();
}

function validateEditDutyLog(){
	var title = jQuery("#editTitle").val().trim();
	var content = jQuery("#editContent").val().trim();
	if(Ext.isEmpty(title))
		return "标题不能为空";
	if(title.length > 30)
		return "标题不超过30字符";
	if(Ext.isEmpty(content))
		return "内容不能为空";
	if(content.length > 20000)
		return "内容不能20000字符";
	return true;
}

function saveEdit(){
	var result = validateEditDutyLog();
	if(result != true){
		jQuery("#editLodErrorMessage").text(result);
		jQuery("#editLogErrorTr").show();
		return;
	}
	var logId = jQuery("#operateLogId").val();
	var title = jQuery("#editTitle").val().trim();
	var content = jQuery("#editContent").val().trim();
	DutyService.editDutyLog(logId,title,content,function(result){
		if(result){
			var date = new Date();
			var year = date.getUTCFullYear();
			var month = jQuery("#historyDutyLogSelect").val();
			var monthAndYear = year + "-" + month
			var userId = jQuery("#userId").val();
			jQuery("#historyDutyLogList").load("/itsm/duty/viewDutyLog.do?monthAndYear="+monthAndYear+"&userId="+userId);
		}else{
			jQuery("#editLodErrorMessage").text('该值班日志已被删除');
			jQuery("#editLogErrorTr").show();
		}
	})
}

function deleteDutyLog(logId){
	deleteLogId_total = logId;
	jQuery("#confirmDelete").show();
}

function do_delete(){
	DutyService.deleteDutyLog(deleteLogId_total,function(){
		var date = new Date();
		var year = date.getUTCFullYear();
		var month = jQuery("#historyDutyLogSelect").val();
		var monthAndYear = year + "-" + month
		var userId = jQuery("#userId").val();
		jQuery("#historyDutyLogList").load("/itsm/duty/viewDutyLog.do?monthAndYear="+monthAndYear+"&userId="+userId);
	})
}
/**
 * 下一个月的值班记录
 */
function nextMonthLog(){
	var curMonth = parseInt(jQuery("#viewLogMonth").text());
	if(curMonth == 12){
		jQuery("#viewLogMonth").text('1');
		var curYear = parseInt(jQuery("#viewLogYear").text());
		curYear++;
		jQuery("#viewLogYear").text(curYear);
	}else{
		jQuery("#viewLogMonth").text(curMonth+1);
	}
	reloadDutyTableData();
}

/**
 * 上一个月的值班记录
 */
function preciousMonthLog(){
	var curMonth = parseInt(jQuery("#viewLogMonth").text());
	if(curMonth == 1){
		jQuery("#viewLogMonth").text('12');
		var curYear = parseInt(jQuery("#viewLogYear").text());
		curYear--;
		jQuery("#viewLogYear").text(curYear);
	}else{
		jQuery("#viewLogMonth").text(curMonth-1);
	}
	reloadDutyTableData();
}

/**
 * 重新加载值班表的数据
 */
function reloadDutyTableData(){
	var year = jQuery("#viewLogYear").text();
	var month = parseInt(jQuery("#viewLogMonth").text());
	if(month < 10)
		month = "0"+month;
	var param = year+"-"+month;
	 DutyService.getFixedMonthDutyRecords(param,function(data){
	   		jQuery("#dutyLoading").show();
	   	    reflushDutyTable(data);
	   });
}

/**
 * 查询日志时给年份加1
 */
function addQueryYear(){
	var curYear = parseInt(jQuery("#queryHistoryYear").val());
	jQuery("#queryHistoryYear").val(curYear+1);
}

/**
 * 查询日志时给年份减1
 */
function minusQueryYear(){
	var curYear = parseInt(jQuery("#queryHistoryYear").val());
	curYear = curYear -1;
	if(curYear>=0)
		jQuery("#queryHistoryYear").val(curYear);
}

/**
 * 显示当天的任务
 */
function showTaskListDiv(day,monthType,event){
	if(permit_total){
		jQuery("#historyDutyLogDiv").hide();
		jQuery("#writeLog").hide();
		var year = parseInt(jQuery("#viewLogYear").text());
		var month = parseInt(jQuery("#viewLogMonth").text());
		day = parseInt(day);
		if(day < 10)
			day = '0'+day;
		if(monthType == 'previous'){//上一个月
			if(month == 1){
				month = 12;
				year = year-1;
			}else{
				month = month -1;
			}
		}
		if(monthType == 'next'){//上一个月
			if(month == 12){
				month = 1;
				year = year+1;
			}else{
				month = month+1;
			}
		}
		var date = year+"-"+month+"-"+day;
		jQuery("#taskListTable").empty();
			if(jQuery.browser.msie){
			top_total = event.clientY;
			left_total = event.clientX;
		}else{
			top_total = event.clientY+30;
			left_total = event.clientX-120;
		}
		jQuery("#taskList").css({
				    	"top" : top_total +"px",
				    	"left" : left_total+"px"
				    }).show("fast");
		DutyService.getFixedDayTask(date,function(result){
			for(var i=0;i<result.length;i++){
				var task = result[i];
				if(i%2==0)
					var tr = jQuery("<tr><td width='60%' height='25' class='t14'><a href='#' onclick='showTaskDetailWindow(\""+task[0]+"\")'>"+Ext.util.Format.htmlDecode(task[1])+"</a></td><td align='right' class='t14'>"+task[2]+"</td></tr>");
				else
					var tr = jQuery("<tr><td width='60%' height='25'><a href='#' onclick='showTaskDetailWindow(\""+task[0]+"\")'>"+Ext.util.Format.htmlDecode(task[1])+"</a></td><td align='right'>"+task[2]+"</td></tr>");
				jQuery("#taskListTable").append(tr);
			}
		});
		permit_total = false;
	}
}

function showTaskDetailWindow(taskId){
	window.parent.location.href = "/itsm/task/taskMgt.do?method=viewTaskInfor&id="+taskId+"&menuId=m10";
}

function getTotalWidth() {
    if (jQuery.browser.msie) {
        return document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth : document.body.clientWidth;
    }
    else {
        return self.innerWidth;
    }
}
