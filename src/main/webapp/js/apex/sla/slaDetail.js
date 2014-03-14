/**
 * 显示指定的确认页面，并为按钮绑定处理函数
 */
function confirmOperate(operateName,slaCode){
	var parameters = new Array();
	parameters.push(slaCode);
	$("#doOperate").unbind('click');
	if('play'==operateName){//启用SLA
		$("#confirmTitle").text("启用SLA");
		$("#confirmMessage").text("您确定启用该SLA？");
		parameters.push('sla_play');
		$("#doOperate").bind('click',parameters,do_toggle);
	}else if('suspend'==operateName){//停用SLA
		$("#confirmTitle").text("停用SLA");
		$("#confirmMessage").text("您确定停用该SLA？");
		parameters.push('sla_suspend');
		$("#doOperate").bind('click',parameters,do_toggle);
	}else if('resume'==operateName){//恢复SLA
		$("#confirmTitle").text("恢复SLA");
		$("#confirmMessage").text("您确定恢复该SLA？");
		parameters.push('sla_play');
		$("#doOperate").bind('click',parameters,do_toggle);
	}else if('delete'==operateName){//删除SLA
		$("#confirmTitle").text("删除SLA");
		$("#confirmMessage").text("删除该协议，您与您的客户之间签订的服务水平将受到影响，请确认是否要真的删除选中的服务级别协议？");
		$("#doOperate").bind('click',parameters,do_delete);
	}
	$("#slaDetail").hide();
	$("#error").hide();
	$("#confirm").show(); 
}

/**
 * 执行切换SLA协议状态操作
 */
function do_toggle(event){
	var parameters = event.data;
	var slaCode = parameters[0];
	var status = parameters[1];
	SlaService.toggleSlaStatus(slaCode,status,{
		callback : function(){
			location.href = "/itsm/sla/viewSlaDetailAction.do?SLACODE="+slaCode;
		},
		errorHandler : function(errorString, exception) {
			if(exception.message == 'M0700007'){//SLA已被他人删除
				$("#errorMessage").text('该SLA协议已被删除，操作失败！');
			}else{//发生未知错误
			   	 $("#errorMessage").text('发生未知错误或异常，操作失败！');
			}
			$("#slaDetail").hide();
			$("#error").show();
			$("#confirm").hide(); 
		}
	});
}
/**
 * 执行删除SLA协议操作
 */
function do_delete(event){
	var parameters = event.data;
	var slaCode = parameters[0];
	SlaService.deleteSlaByCode(slaCode,{
		callback : function(){
			location.href = "/itsm/sla/slaManageAction.do?method=displaySla&menuId=m7_0";
		},
		errorHandler : function(errorString, exception) {
			if(exception.message == 'M0700007'){//SLA已被他人删除
				$("#errorMessage").text('该SLA协议已被删除，操作失败！');
			}else{//发生未知错误
			   	 $("#errorMessage").text('发生未知错误或异常，操作失败！');
			}
			$("#slaDetail").hide();
			$("#error").show();
			$("#confirm").hide(); 
		}
	});
}

/**
 * 隐藏确认DIV和错误信息DIV
 */
function hideConfirmDiv(){
	$("#slaDetail").show();
	$("#error").hide();
	$("#confirm").hide(); 
}