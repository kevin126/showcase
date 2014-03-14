
function save() {
	var form = document.getElementById("klAnswerForm");
	form.submit();
}
function supplementary() {
	$("#askQuestion").hide();
	$("#supplementaryProblem").show();
}
function cancelSupplementary() {
	document.getElementById("supplementaryProblem").style.display = "none";
	$("#askQuestion").show();
//	if(document.getElementById('askQuestion')!=null){
//		document.getElementById('askQuestion').style.display='block';
//	}
}
function saveSupplementary() {
	var form = document.getElementById("knowledgeProblemForm");
	form.submit();
}
function problemToSubject() {
	var subjectId = $("#subjectId").val();
	location.href = "/itsm/knowledge/knowledgeMgt.do?method=addToSubject&subjectId=" + subjectId;
}
function addToKlFavoriten() {
	location.href = "/itsm/knowledge/knowledgeMgt.do?method=addToKlFavoriten";
}
function problemToVote() {
	location.href = "/itsm/knowledge/knowledgeMgt.do?method=problemToVote";
}
function problemToClosed() {
	location.href = "/itsm/knowledge/knowledgeMgt.do?method=problemToClosed";
}
function problemToDelete() {
	location.href = "/itsm/knowledge/knowledgeMgt.do?method=deleteProblem";
}
function hideSupplementary() {
	$("#supplementaryProblem").hide();
}
function bestAnswerConfirm() {
	location.href = "/itsm/knowledge/klAnswer.do?method=answerToBest&dataId=" + currAnswerId;
}
var currAnswerId = null;
function showConfirm(answerId) {
	currAnswerId = answerId;
	showOssConfirmDialog("\u4f60\u786e\u8ba4\u8981\u63a8\u8350\u8be5\u95ee\u9898\u4e3a\u6700\u4f73\u7b54\u6848\u5417\uff1f ", bestAnswerConfirm);
}
function submitDisabled(id) {
	if ($.trim($("#answerContent").val()) == "") {
		showOssErrorDialog("\u5bf9\u4e0d\u8d77\uff0c\u7b54\u6848\u4e0d\u5f97\u4e3a\u7a7a\u3002 ");
	} else {
		if ($("#answerContent").val().length > 20000) {
			showOssErrorDialog("\u5bf9\u4e0d\u8d77\uff0c\u7b54\u6848\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc720000\u3002 ");
		} else {
			var elems = document.getElementsByTagName("input");
			var allowSubmit = false;
			for (var k = 0; k < elems.length; k++) {
				if (elems[k].type == "file") {
					val = elems[k].value;
					if (!val) {
						allowSubmit = true;
						continue;
					}
					extArray = new Array(".gif", ".jpg", ".png", ".wmv", ".mp4", ".mkv", ".flv", ".swf");
					if (val.indexOf("\\") != -1) {
						val = val.slice(val.indexOf("\\") + 1);
						ext = val.slice(val.indexOf(".")).toLowerCase();
						for (var i = 0; i < extArray.length; i++) {
							if (extArray[i] == ext) {
								allowSubmit = true;
								break;
							}
							allowSubmit = false;
						}
						if (!allowSubmit) {
					showOssErrorDialog("抱歉,请上传图片及视频文件!");
					return;
						}
					}
				}
			}
			document.getElementById("klAnswerForm").submit();
		}
	}
}
function modifyAnswer() {
	if ($.trim($("#answerContentId").val()) == "") {
		showOssErrorDialog("\u5bf9\u4e0d\u8d77\uff0c\u7b54\u6848\u4e0d\u5f97\u4e3a\u7a7a\u3002 ");
	} else {
		if ($("#answerContentId").val().length > 20000) {
			showOssErrorDialog("\u5bf9\u4e0d\u8d77\uff0c\u7b54\u6848\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc720000\u3002 ");
		} else {
				var elems = document.getElementsByTagName("input");
			var allowSubmit = false;
			for (var k = 0; k < elems.length; k++) {
				if (elems[k].type == "file") {
					val = elems[k].value;
					if (!val) {
						allowSubmit = true;
						continue;
					}
					extArray = new Array(".gif", ".jpg", ".png", ".wmv", ".mp4", ".mkv", ".flv", ".swf");
					if (val.indexOf("\\") != -1) {
						val = val.slice(val.indexOf("\\") + 1);
						ext = val.slice(val.indexOf(".")).toLowerCase();
						for (var i = 0; i < extArray.length; i++) {
							if (extArray[i] == ext) {
								allowSubmit = true;
								break;
							}
							allowSubmit = false;
						}
						if (!allowSubmit) {
					showOssErrorDialog("抱歉,请上传图片及视频文件!");
					return;
						}
					}
				}
			}
			document.getElementById("klAnswerFormId").submit();
		}
	}
}
function submitSupplement() {
	if ($.trim($("#supplementary").val()) == "") {
		showOssErrorDialog("\u5bf9\u4e0d\u8d77\uff0c\u5185\u5bb9\u4e0d\u5f97\u4e3a\u7a7a\u3002 ");
	} else {
		if ($("#supplementary").val().length > 200) {
			showOssErrorDialog("\u5bf9\u4e0d\u8d77\uff0c\u8865\u5145\u95ee\u9898\u7684\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc7200\u3002 ");
		} else {
			document.getElementById("knowledgeProblemForm").submit();
		}
	}
}
function showAnswer(obj) {
	document.getElementById("modifyAnswer").parentNode.getElementsByTagName("DIV")[0].style.display = "block";
	// obj.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('DIV')[0].style.display='block';
}

