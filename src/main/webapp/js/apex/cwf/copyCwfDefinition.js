function do_copyCwfDefinition(){
	var processTypeId = $("#processTypeId").val();
	var processKey = $("#processKey").val();
	var processName = $("#processName").val();
	var processDescription = $("#description").val();
	CwfService.copyCwfDefinition(processTypeId,processKey,processName,processDescription,{
		callback : function(){
				parent.location.reload();
				art.dialog.close();
			},
		errorHandler : function(errorString, exception) {
		    var errorTip = exception.errorParam;
		    var errMsg = exception.message;
		    $("#"+errorTip).attr("class","onError");
		    $("#"+errorTip).text(errMsg);
		}
	})
}