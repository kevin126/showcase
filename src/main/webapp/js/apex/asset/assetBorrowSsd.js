var wait_delete_commentId_total = null;// 全局变量，删除被指的Id
function setTab(m, n) {
	var tli = document.getElementById("menu" + m).getElementsByTagName("h3");
	var mli = document.getElementById("tab" + m).getElementsByTagName("ul");
	for (i = 0; i < tli.length; i++) {
		tli[i].className = i == n ? "hover" : "";
		mli[i].style.display = i == n ? "block" : "none";
	}
}

function showDiv(divId) {
	$("#commentDiv").hide();
	$("#attachDiv").hide();
	$("#applyIssueAgain").hide();
	$("#" + divId).show();
}

function displayOnload() {
	var flag = document.getElementById("assetFlag");
	if (flag != null) {
		var value = flag.value;
		if (value != null && value == "commentEdit") {
			document.getElementById("commentDiv").style.display = "block";
		}
	}
}

function modifyRequestComment(commentId) {
	$("#commentDiv").show();
	$("#commentId").val(commentId);
	CommentService.getComment(commentId, {
				callback : function(comment) {
					$("#addCommentNoteSsd").val(comment.commentContent);
					$("#commentId").val(comment.id);
				},
				errorHandler : function(errorString, exception) {
					$("#commentError").text("改备注已被删除");
					$("#commentError").show();
				}
			});
}

function deleteRequestComment(commentId) {
	wait_delete_commentId_total = commentId;
	showOssConfirmDialog("您确定要删除该备注？", do_deleteComment);
}

function do_deleteComment() {
	if (null != wait_delete_commentId_total) {
		CommentService.deleteComment(wait_delete_commentId_total, function(
				returnValue) {
			var dataId = $("#dataId").val();
			if (returnValue) {
				location.href = "/itsm/asset/assetBorrow.do?method=detailSsd&dataId="
						+ dataId;
			} else {
				// 以后给出错误提示
				showOssErrorDialog("该备注已被他人删除！", function() {
					location.href = "/itsm/asset/assetBorrow.do?method=detailSsd&dataId="
							+ dataId;
				})
			}
		});
	}
}

function uploadFile() {
	var fileName = $("#attachFile").val();
	if (Ext.isEmpty(fileName)) {
		$("#attachError").text("请选择上传的附件");
		$("#attachError").show();
		return;
	}
	document.getElementById("attachmentForm").submit();
}


function deleteBorrow(dataId) {
	showOssConfirmDialog("您确定要删除该申请单？", function() {
				location.href = "/itsm/asset/assetBorrow.do?method=delete&type=Ssd&dataId="
						+ dataId;
			});
}