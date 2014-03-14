function saveJoinNodeMultiplicity(){
	if(validateMultiplicity()){
		var processParameter = {};
		processParameter.elementName = $("#nodeName_hidden").val();
		processParameter.parameterKey = "cwf_multiplicity";
		processParameter.parameterValue = $("#joinNum").val();
		CwfService.saveProcessParameter(processParameter,{
			callback : function(){
					art.dialog.close();
				},
			errorHandler : function(errorString, exception) {
				art.dialog({
					    content: exception.message,
					    yesFn: true
					});
			}
		});
	}
}

function validateMultiplicity(){
	if($("#joinNum").val().trim()==""){
		$('#joinTip').attr("class","onError");
		$('#joinTip').text("请输入汇聚分支数目");
		return false;
	}
	if(Number($("#joinNum").val())==0){
		$('#joinTip').attr("class","onError");
		$('#joinTip').text("汇聚分支数目不能为0");
		return false;
	}
	var maxNum = Number($("#maxNum").val());
	if(Number($("#joinNum").val())>maxNum){
		$('#joinTip').attr("class","onError");
		$('#joinTip').text("汇聚分支数目不能超过"+maxNum);
		return false;
	}
	return true;
}