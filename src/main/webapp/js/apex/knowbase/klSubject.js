function enterAdded() {
	location.href = "/itsm/knowledge/klSubject.do?method=enterAdded";
}
function showDiv(divId) {
	$("#" + divId).show();
}
function hideDiv(divId) {
	$("#" + divId).hide();
}

function selectIcon(imageId, imagePath) {
	$("#subjectImagePath").attr('src', imagePath);
	$("#subjectImageName").attr('value', imageId);
	$("#slaLevelChoiceBoxDiv").hide();
}

function modifySubject(subjectId) {
	location.href = "/itsm/knowledge/klSubject.do?method=enterEdit&dataId="
			+ subjectId;
}

function addToSubject() {
	var problemIds = new Array();
	for (var i = 0; i < $("input:checked").length; i++) {
		if ($($("input:checked").get(i)).attr('name') == 'problemCheckbox') {
			problemIds.push($($("input:checked").get(i)).val());
		}
	}
	location.href = "/itsm/knowledge/klSubject.do?method=addProblemsToSubject&problemIds="
			+ problemIds;
}

function deleteSubject(subjectId) {
	if (confirm('确认删除该专题吗？')) {
		location.href = "/itsm/knowledge/klSubject.do?method=deleteSubject&dataId="
				+ subjectId;
	}
}

function deleteSubjects() {
	if (confirm('确认删除这些选中的专题吗？')) {
		var subjectIds = new Array();
		for (var i = 0; i < $("input:checked").length; i++) {
			if ($($("input:checked").get(i)).attr('name') == 'problemCheckbox') {
				subjectIds.push($($("input:checked").get(i)).val());
			}
		}
		location.href = "/itsm/knowledge/klSubject.do?method=deleteSubjects&dataId="
				+ subjectIds;
	}
}

function problemToTop(klproblemSubjectId) {
	if (confirm('确认置顶该问题吗？')) {
		location.href = "/itsm/knowledge/klSubject.do?method=problemToTop&dataId="
				+ klproblemSubjectId;
	}
}
function cancelTop(problemId) {
	if (confirm('确认将该问题取消置顶吗？')) {
		location.href = "/itsm/knowledge/klSubject.do?method=problemToTop&iscancel=true&dataId="
				+ problemId;
	}
}

function deleteKlsp(klproblemSubjectId) {
	if (confirm("确认将该问题从专题中移除吗？")) {
		location.href = "/itsm/knowledge/klSubject.do?method=deleteKlSubjectProblem&dataId="
				+ klproblemSubjectId;
	}
}

function allDeleteCheck() {
	var flag = false;
	for (var i = 0; i < $("input:checked").length; i++) {
		if ($($("input:checked").get(i)).attr('name') == 'problemCheckbox') {
			flag = true;
			break;
		}
	}
	if (flag == true) {
		$("#allDelete").attr("disabled", false);
	} else {
		$("#allDelete").attr("disabled", true);
	}
}

function toSecondCategory() {
	var categoryId = $("#firstCateGory").val();
	CategoryService.queryChildCategoryList(categoryId, function(returnValue) {
				$("#secondCategory").empty();
				$("#secondCategory").append("<option value='0'>二级分类</option>");
				if (returnValue.length != 0) {
					for (var i = 0; i < returnValue.length; i++) {
						if (childId == returnValue[i].categoryId) {
							$("#secondCategory")
									.append("<option selected value='"
											+ returnValue[i].categoryId + "'>"
											+ returnValue[i].name + "</option>");
						} else {
							$("#secondCategory").append("<option value='"
									+ returnValue[i].categoryId + "'>"
									+ returnValue[i].name + "</option>");
						}
					}
					childId = '0';
				}
			})
}

function queryProblem(pn) {
	var firstCategoryId = $("#firstCateGory").val();
	var secondCategoryId = $("#secondCategory").val();
	var keyWord = $("#problemKeyWord").val();
	if (firstCategoryId == '0' && secondCategoryId == '0'
			&& $.trim(keyWord) == '') {
		Ext.MessageBox.show({
					title : '错误',
					msg : '请先选择搜索条件！',
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
	} else {
		var url = "/itsm/knowledge/klSubject.do?method=enterProblemList&pn2="
				+ pn + "&firstCategoryId=" + firstCategoryId
				+ "&secondCategoryId=" + secondCategoryId + "&keyWord="
				+ encodeURIComponent(keyWord);
		$('#queryProblemTable').load(url + " #problemListTable");
	}
}

function displayState() {
	if ($("#displayState").val() == 'true') {
		$("#add_an").show();
	}
}

function allChecked() {
	if ($("#allChecked").attr('checked') == true) {
		$(":checkbox").attr('checked', true);
	} else {
		$(":checkbox").attr('checked', false);
	}
	allDeleteCheck();
}

function selectProblemList() {
	var checkboxs = document.getElementById("problemListTable")
			.getElementsByTagName("INPUT");
	for (var i = 0; i < checkboxs.length; i++) {
		if (checkboxs[i].checked && checkboxs[i].id != 'allChecked') {
			if (window.parent.ProMap[checkboxs[i].value + ''])
				continue;
			var tr = checkboxs[i].parentNode.parentNode.cloneNode(true);
			tr.removeChild(tr.getElementsByTagName("TD")[0]);
			$(tr)
					.append("<td><input type='button' class='tuo_but_2' value='删除' onclick='removeProblem(this)' /></td>");
			window.parent.$("#subjectConProblemList")
					.append("<tr class='t_b_tbody'>" + tr.innerHTML + "</tr>");
			window.parent.ProMap[checkboxs[i].value + ''] = 'checkboxs[i].value';
		}
	}
	closedWindow();
}

function addedProblem() {
	var url = '/itsm/knowledge/klSubject.do?method=enterProblemList';
	win = tipsWindown('', 'iframe:' + url, '880', '698', 'true', '', 'true',
			'leotheme');
}
function closedWindow() {
	window.parent.$("#windownbg").remove();
	window.parent.$("#windown-box").fadeOut("slow", function() {
				$(this).remove();
			});
}

function removeProblem(obj) {
	var tr = obj.parentNode.parentNode
	tr.parentNode.removeChild(tr);
	var input = tr.getElementsByTagName("input");
	var id = null;
	for (var i = 0; i < input.length; i++) {
		if (input[i].type == 'hidden') {
			id = input[i].value;
		}
	}
	delete ProMap[id + ''];
}
