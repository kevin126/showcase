var generateStyle_total = true;//全局变量，标识报告的生成方式，如果为true，则表示是系统自动产生的报告，为false，则表示手动产生的报告
var isOpened_total = false;//全局变量，是否已经打开报告统计界面，该变量主要是控制在FireFox中只能打开一个统计界面

/**
 * 页面加载时就执行，完成让页面上Table的奇偶行以不同的颜色显示
 */
$(function(){ 
		toggleTableColor("reportTable");
	})

/**
 * 响应生成报告按钮
 */
function generateReport(){
	if(!isOpened_total){
		var startTime = 0;//统计的开始时间
		var endTime = 0;//统计的结束时间
		var slaId = $("#slaLevel").val();
		if(Ext.isEmpty(slaId)){//sla协议为空
			$("#errMessage").text('SLA协议不能为空');
			$("#errMessage").show();
			return;
		}
		var startTime_str =  $("#startTime").val();
		if(Ext.isEmpty(startTime_str)){//开始时间为空
			$("#errMessage").text('开始日期不能为空');
			$("#errMessage").show();
			return;
		}
		var startDate = new Date(Date.parse(startTime_str.replace(/-/g,   "/")));
		startTime = startDate.getTime();
		var endTime_str =  $("#endTime").val();
		if(!Ext.isEmpty(endTime_str)){//当结束时间不为空时，开始时间应小于结束时间
			var endDate = new Date(Date.parse(endTime_str.replace(/-/g,   "/")));
			endTime = endDate.getTime();
			if(endTime <= startTime){
				$("#errMessage").text('结束日期应晚于开始日期');
				$("#errMessage").show();
				return;
			}
		}
		Ext.Msg.show({
			title : '等待',
			width : 200,
			modal : true,
			closable : true,
			wait : true,
			msg : '正在生成报告，请稍后......'
		});
		SlaService.generateReport(slaId,startTime,endTime,{
			callback : function(){
				Ext.Msg.hide();
				$("#errMessage").hide();
				generateStyle_total = false;
				if($.browser.msie){
					window.showModalDialog('/itsm/sla/generateReportAction.do?isAuto=false',window,"dialogHeight:700px;dialogWidth:1210px;center:yes;help:No;resizable:No;status:No;");
					clearGarbage();
				}else{
					openCenterWindow("/itsm/sla/generateReportAction.do?isAuto=fasle",1110,700);
					isOpened_total = true;
				}
			},
			errorHandler : function(errorString, exception) {
				Ext.Msg.hide();
				$("#errMessage").hide();
				if(exception.message == 'M0700007'){//等级名称重复
				   	$("#errorContent").text('所选SLA协议已被删除！');
				  	$("#errorDiv").show(); 
				}else if(exception.message == 'M0700012'){
					$("#errorContent").text('该时段无任何故障！');
				  	$("#errorDiv").show(); 
				}else{
					$("#errorContent").text('发生未知异常或错误，统计失败！');
				  	$("#errorDiv").show();
				}
			}
		});
	}
}

/**
 *  响应报告列表上的超链接，即展示该报告的详情
 */
function showSlaReport(reportId){
	SlaService.showSlaReport(reportId,function(){
		if($.browser.msie){
			window.showModalDialog('/itsm/sla/generateReportAction.do?isAuto=true',window,"dialogHeight:700px;dialogWidth:1210px;center:yes;help:No;resizable:No;status:No;");
			clearGarbage();
		}else{
			if(!isOpened_total){
				openCenterWindow("/itsm/sla/generateReportAction.do?isAuto=true",1110,700);
				isOpened_total = true;
			}
		}	
	});
}
/**
 * 在生成SLA报告时，为了加快速度，将整个SLAReport对象存放在Session中，所以当统计完毕，须将统计信息从Session中删除,如果是手动生成报告，
 * 还要将临时生成的统计图片予以删除
 */
function clearGarbage(){
	SlaService.clearGarbage(generateStyle_total,null);
}