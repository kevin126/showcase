$(function(){
	if($("#mutiComplete").attr("checked")==true){
		$("#fixHandler").attr("disabled",true);
		$("#fetechHandler").attr("disabled",true);
		$("#randomHandler").attr("disabled",true);
	}
})
function saveTaskNodeSetting(){
	var taskNodeSetting = {};
	taskNodeSetting.nodeName = $("#nodeName_hidden").val();
	//设置任务类型
	if($("#aloneComplete").attr("checked")==true)
		taskNodeSetting.taskType = 0;
	if($("#mutiComplete").attr("checked")==true)
		taskNodeSetting.taskType = 1;	
	//设置任务分配方式	
	if($("#fixHandler").attr("checked")==true)
		taskNodeSetting.assignType = 0;	
	if($("#fetechHandler").attr("checked")==true)
		taskNodeSetting.assignType = 1;	
	if($("#randomHandler").attr("checked")==true)
		taskNodeSetting.assignType = 2;	
	//设置任务的其他属性
	if($("#allowDispatch").attr("checked")==true)
		taskNodeSetting.allowDispatch = true;	
	else
		taskNodeSetting.allowDispatch = false;
	if($("#allowOtherExcute").attr("checked")==true)
		taskNodeSetting.allowOtherExcute = true;	
	else
		taskNodeSetting.allowOtherExcute = false;
		
	CwfService.saveTaskNodeSetting(taskNodeSetting,{
		callback : function(taskNodeSettings){
				parent.taskNodeSettings_total = taskNodeSettings;
				art.dialog.close();
			},
		errorHandler : function(errorString, exception) {
			art.dialog({
				    content: exception.message,
				    yesFn: true
				});
		}
	})
}

function hadnleAloneChange(){
	if($("#aloneComplete").attr("checked")==true){
		$("#fixHandler").attr("disabled",false);
		$("#fetechHandler").attr("disabled",false);
		$("#randomHandler").attr("disabled",false);
	}else{
		$("#fixHandler").attr("disabled",true);
		$("#fetechHandler").attr("disabled",true);
		$("#randomHandler").attr("disabled",true);
	}
}

function hadnleMutiChange(){
	if($("#mutiComplete").attr("checked")==true){
		$("#fixHandler").attr("disabled",true);
		$("#fixHandler").attr("checked",true);
		$("#fetechHandler").attr("disabled",true);
		$("#randomHandler").attr("disabled",true);
	}else{
		$("#fixHandler").attr("disabled",false);
		$("#fetechHandler").attr("disabled",false);
		$("#randomHandler").attr("disabled",false);
	}
}