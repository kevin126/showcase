function enterAdd() {
	$("#id").val("");
	$("#typeName").val("");
	$("#arrowType").val("");
	$("#lineType").val("");
	$("#lineWidth").val("");
	$("#viewDetail").val("");
	document.getElementById('editDiv').style.display = "block";
	document.getElementById('delete').style.display = "none";
}

function enterDelete(dataId) {
	document.getElementById('editDiv').style.display = "none";
	document.getElementById('delete').style.display = "block";
	document.getElementById('deleteId').value = dataId;
}

function enterModify(classId) {
	CiRelationService.getCiRelationTypeById(classId, function(returnValue) {
		if (returnValue != null) {
			document.getElementById('id').value = returnValue.id;
			document.getElementById('typeName').value = returnValue.typeName;
			document.getElementById('arrowType').value = returnValue.arrowType;
			document.getElementById('lineType').value = returnValue.lineType;
			document.getElementById('lineWidth').value = returnValue.lineWidth;
			document.getElementById('viewDetail').value = returnValue.viewDetail;

			document.getElementById('editDiv').style.display = "block";
			document.getElementById('delete').style.display = "none";
		} else {
			location.href = "/itsm/cmdb/ciRelationType.do?method=delete&dataId="
					+ classId;
		}
	});
}

function hideDiv(classId) {
	document.getElementById(classId).style.dispaly = "none";
}

function deleteCiType() {
	var id = document.getElementById('deleteId').value;
	location.href = "/itsm/cmdb/ciRelationType.do?method=delete&dataId=" + id;
}