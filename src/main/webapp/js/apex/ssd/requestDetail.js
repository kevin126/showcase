var wait_delete_commentId_total = null;//全局变量，删除被指的Id
$(function(){
	$("#commentContent").bind("blur",function(){
		var commentContent = $(this).val();
		if(Ext.isEmpty(commentContent)){
			$("#commentError").text("备注不能为空");
			$("#commentError").show();
			return;
		}
		if(commentContent.length>20000){
			$("#commentError").text("备注不能超过20000字符");
			$("#commentError").show();
			return;
		}
		$("#commentError").hide();
	});
	
	
	$("#attachComment").bind("blur",function(){
		var commentContent = $(this).val();
		if(commentContent.length>20000){
			$("#attachError").text("备注不能超过20000字符");
			$("#attachError").show();
			return;
		}
		$("#attachError").hide();
	});
	
	
	$("#pingjiaComment").bind("blur",function(){
		var commentContent = $(this).val();
		if(commentContent.length>20000){
			$("#pingjiaError").text("备注不能超过20000字符");
			$("#pingjiaError").show();
			return;
		}
		$("#pingjiaError").hide();
	});
	
	$("a[rel=attachment]").fancybox({
		'transitionIn'		: 'elastic',
		'transitionOut'		: 'elastic',
		'hideOnContentClick' : true,
		'titleShow'		: true
	});
})
function showAddCommentDiv(){
	clearAllInfo();
	$("#commentDiv").show();
	$("#attachDiv").hide();
	$("#pingjiaDiv").hide();
}

function operateRequestComment(){
	var procId = $("#requestProceeCode").text().trim();
	var content = $("#commentContent").val().trim();
	var commentId = $("#commentId").val();
	if(Ext.isEmpty(content)){
		$("#commentError").text("备注不能为空");
		$("#commentError").show();
		return;
	}
	if(content.length>20000){
		$("#commentError").text("备注不能超过20000字符");
		$("#commentError").show();
		return;
	}
	CommentService.operateRequestComment(commentId,procId,content,{
		callback : function(){
			location.href = "/itsm/ssd/viewRequestDetail.do?comm=1&menuId=m2&ISSUE_CODE="+procId;
		},
		errorHandler : function(errorString, exception) {
			$("#commentError").text(exception.message);
			$("#commentError").show();
		}
	});
}

function modifyRequestComment(commentId){
	showAddCommentDiv();
	$("#commentId").val(commentId);
	CommentService.getComment(commentId,{
		callback : function(comment){
			$("#commentContent").val(comment.commentContent);
		},
		errorHandler : function(errorString, exception) {
			$("#commentError").text("改备注已被删除");
			$("#commentError").show();
		}
	});
}

function deleteRequestComment(commentId){
	wait_delete_commentId_total = commentId;
	showOssConfirmDialog("您确定要删除该备注？",do_deleteComment);
}

function do_deleteComment(){
	if(null != wait_delete_commentId_total){
	CommentService.deleteComment(wait_delete_commentId_total, function(returnValue){
			var processCode = $("#requestProceeCode").text().trim();
			if(returnValue){
				location.href = "/itsm/ssd/viewRequestDetail.do?comm=1&menuId=m2&ISSUE_CODE="+processCode;
			}else{
				//以后给出错误提示
				showOssErrorDialog("该备注已被他人删除！",function(){location.href = "/itsm/ssd/viewRequestDetail.do?comm=1&menuId=m2&ISSUE_CODE="+processCode;})
			}
		});
	}
}

function showAttachDiv(){
	clearAllInfo();
	$("#attachDiv").show();
	$("#commentDiv").hide();
	$("#pingjiaDiv").hide();
}

function uploadFile(){
	var fileName = $("#attachFile").val();
	if(Ext.isEmpty(fileName)){
		$("#attachError").text("请选择上传的附件");
		$("#attachError").show();
		return;
	}
	document.getElementById("attachmentForm").submit();
}

function showPingjiaDiv(){
	clearAllInfo();
	$("#pingjiaDiv").show();
	$("#feedbackLevel").show();
	$("#attachDiv").hide();
	$("#commentDiv").hide();
}

function addPingjia(){ 
	var procId = $("#requestProceeCode").text().trim();
	var content = $("#pingjiaComment").val().trim();
	if(content.length > 20000){
		$("#pingjiaError").text("备注不能超过20000字符");
		$("#pingjiaError").show();
		return;
	}
	var feedbackLevel = $("#feedbackLevel").val();
	CommentService.addRequestFeedBack(procId,feedbackLevel,content,{
		callback : function(){
			location.href = "/itsm/ssd/viewRequestDetail.do?comm=1&menuId=m2&ISSUE_CODE="+procId;
		},
		errorHandler : function(errorString, exception) {
			$("#pingjiaError").text(exception.message);
		}
	});
}

function editRequest(){
	var code = $("#requestProceeCode").text().trim();
	location.href = "/itsm/ssd/submitservicerequest.do?method=modifyRequest&code="+code;
}

function deleteRequest(){
  showOssConfirmDialog("您确定要删除该IT服务请求？",do_deleteRequest);
}

function do_deleteRequest(){
	var code = $("#requestProceeCode").text().trim();
	IncidentService.deleteIncidentByProcessCode(code,{
		callback : function(){
			location.href = "/itsm/ssd/self_servicedesk.do?method=viewRequestList&status=slef_dafts&pn=0";
		},
		errorHandler : function(errorString, exception) {
			showOssErrorDialog("该用户请求已被他人删除！",function(){location.href = "/itsm/ssd/self_servicedesk.do?method=viewRequestList&status=slef_dafts&pn=0";})
		}
	});
}

function directSubmitRequest(){
	  showOssConfirmDialog("您确定要提交该用户请求？",do_submitRequest);
}

function do_submitRequest(){
	var code = $("#requestProceeCode").text().trim();
	IncidentService.directSubmitRequestDraft(code,{
		callback : function(processCode){
			location.href = "/itsm/ssd/viewRequestDetail.do?comm=1&menuId=m2&ISSUE_CODE="+processCode;
		},
		errorHandler : function(errorString, exception) {
			if(exception.message == 'request.not.exist'){
				showOssErrorDialog("该用户请求已被删除，提交失败！",function(){location.href = "/itsm/ssd/self_servicedesk.do?method=viewRequestList&status=slef_dafts&pn=0";});
			}else{
			   showOssErrorDialog("JBPM引擎出错，提交失败！",function(){location.href = "/itsm/ssd/self_servicedesk.do?method=viewRequestList&status=slef_dafts&pn=0";})
			}
			
		}
	});
}

/**
 * 删除附件
 */
function deleteAttachmentById(attachmentId){
	showOssConfirmDialog("您确定删除该附件？",function(){
		var procId = $("#requestProceeCode").text().trim();
		IncidentService.deleteRequestAttachment(attachmentId,{
			callback : function(processCode){
				location.href = "/itsm/ssd/viewRequestDetail.do?comm=1&menuId=m2&ISSUE_CODE="+procId;
			},
			errorHandler : function(errorString, exception) {
				if(exception.message == 'attach.not.exist'){
					showOssErrorDialog("该附件已被他人删除，删除失败！",function(){location.href = "/itsm/ssd/viewRequestDetail.do?comm=1&menuId=m2&ISSUE_CODE="+procId;})
				}else{
				   	showOssErrorDialog("发生不明错误或异常，删除失败！",function(){location.href = "/itsm/ssd/viewRequestDetail.do?comm=1&menuId=m2&ISSUE_CODE="+procId;})
				}
			}
		});
	});
}

function clearAllInfo(){
	$("#commentContent").val("");
	$("#attachFile").val("");
	$("#attachComment").val("");
	$("#commentError").text("");
	$("#commentError").hide();
	$("#attachComment").val("");
	$("#attachError").text("");
	$("#attachError").hide();
	$("#pingjiaComment").text("");
	$("#pingjiaError").text("");
	$("#pingjiaError").hide();
}