/**
 * 点击修改流程定义的基本属性
 */
function mdyBasicInfo(){
	$("#processName_edit").val($("#processName_view").html());
	$("#processDescription_edit").val($("#processDescription_view").html());
	$("#viewBasicDiv").hide();
	$("#mdyBasicDiv").show();
}

/**
 * 执行修改流程定义的基本属性
 */
function do_mdyBasicInfo(){
	var processType = {};
	var processId = $("#processTypeId_hidden").val();
	var processName = $("#processName_edit").val();
	var processDescription = $("#processDescription_edit").val();
	processType.id = processId;
	processType.processName = processName;
	processType.processDescription = processDescription;
	CwfService.mdyPrecessBasicInfo(processType,{
	callback : function(newProcessType){
			$("#processName_view").html(newProcessType.processName);
			$("#processDescription_view").html(newProcessType.processDescription);
			$("#viewBasicDiv").show();
			$("#mdyBasicDiv").hide();
		},
	errorHandler : function(errorString, exception) {
		$("#processNameError").text(exception.message);
		$("#processNameError").show();
	}
})
}

/**
 * 取消修改流程定义的基本属性
 */
function canceal_mdyBasicInfo(){
	$("#viewBasicDiv").show();
	$("#mdyBasicDiv").hide();
}

/**
 * 响应修改流程定义的流程图
 */
function editDefinitionJpdl(dfntId){
	var url = "/itsm/cwf/editDefinitionJpdl.do?dfntId="+dfntId;
	art.dialog.open(url,{limit: false,lock:true,title:'修改流程图',width:'1080px',height:getClientHeight() * 0.9});
	jQuery(".aui_close:last").click(function(){
		CwfService.removeCwfProcessInfoFromSession();
	});
}