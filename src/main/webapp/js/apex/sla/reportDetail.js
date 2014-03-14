var isClose_total = true;//全局变量，用来区分是关闭窗口还是刷新窗口
if(document.addEventListener){//为firefox注册监听事件：屏蔽右键和监听关闭
	window.onbeforeunload = onunload_handler;
	document.addEventListener("keypress",fireFoxHandler, true);
	document.oncontextmenu = function(e) {
	    if ( e && e.button == 2 && e.preventDefault )
	        e.preventDefault();
	    else
	        window.event.returnValue = false;
	}
}

/**
 * 关闭窗口后清理后台产生的临时文件
 */
function onunload_handler(){
	if(document.addEventListener && isClose_total) {
		clearGarbage();
	}
}

/**
 * 处理刷新事件
 */
function fireFoxHandler(evt){
   if(evt.keyCode == 116 || (evt.ctrlKey && evt.keyCode == 82))
      isClose_total = false;
}
/**
 * 响应导出按钮
 */
function exportPdf(){
	if(document.addEventListener)
		isClose_total = false;
	var isAuto = $("#improveAdvice").is(":visible");
	location.href = "/itsm/sla/exportReportAction.do?isAuto="+isAuto;
	isClose_total = true;
}
/**
 * 清理导出PDF后台产生的临时文件
 */
function clearGarbage(){
	window.opener.isOpened_total= false;
}

/**
 * 显示编辑改进意见的DIV
 */
function showEditImproveDiv(){
	$("#editDiv").show();
	$("#improveDisplayDiv").hide();
	$("#errMsg").hide();
	var old_improve = $("#improvment");
	if(old_improve.length > 0){//原来有内容
		if($.browser.msie){
			$("#newImprove").val(document.getElementById('improvment').innerText);
		}else{
			var htmlContent = $("#improvment").html();
			var textContent = htmlContent.replace(new RegExp("<br>","g"),"\n");
			$("#newImprove").html(textContent);
		}
	}
}

/**
 * 隐藏编辑改进意见的DIV
 */
function hideEditImproveDiv(){
	if($.browser.msie){
		$("#editDiv").hide();
		$("#improveDisplayDiv").show();
	}else{
		window.name="__self";
        window.open("/itsm/sla/generateReportAction.do?isAuto=true","__self") 
	}	
}

/**
 * 保存改进意见
 */
function saveImprovment(){
	var newImprove = $("#newImprove").val();
	var reportId = $("#reportId").val();
	if(Ext.isEmpty(newImprove)){
		$("#errMsg").text("改进意见不能为空");
		$("#errMsg").show();
		return;
	}
	if(newImprove.length > 20000){
		$("#errMsg").text("改进意见不超过20000个字符");
		$("#errMsg").show();
		return;
	}
	if(Ext.isEmpty($("#sendEmail").attr("checked")))
		var isSendEmail = false ;
	else
		var isSendEmail = true ;
	SlaService.editImprovment(reportId,newImprove,isSendEmail,{
		callback : function(){
			isClose_total = false;
			window.name="__self";
            window.open("/itsm/sla/generateReportAction.do?isAuto=true","__self") 

		},
		errorHandler : function(errorString, exception) {
			if(exception.message == 'M0700013'){
				$("#errMsg").text("该SLA报告已被删除");
		        $("#errMsg").show();
			}else{
			   	$("#errMsg").text("发生未知错误或异常");
		        $("#errMsg").show();
			}
		}
	});
}
