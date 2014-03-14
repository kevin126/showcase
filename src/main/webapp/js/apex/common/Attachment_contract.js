var deleteFileFlag = false;
var previousValue = "";//文件变化前的值
var tableRowIndex = 7;//当前操作的行号
var fileNum = 1;
var serialNum = 0;//文件序号，只加不减，以防止序号重复
function fileChange() {
	var nextIndex = tableRowIndex+1;
	var valueTable = document.getElementById('idTB');
	if (4 == fileNum)
		return;
	fileNum++;
	serialNum++;

	var totalNum = valueTable.rows.length;
	var currentNum = totalNum - 2;
	var newTR = valueTable.insertRow(nextIndex);
	var newTD0 = newTR.insertCell(0);	
	newTD0.innerHTML = '附件：';
	var newTD1 = newTR.insertCell(1);
	var attachFileWidth = '600px';
	if($("#draft").length >0)
		attachFileWidth = '400px';
	newTD1.innerHTML = "<input type='file' name='uploadFile["
			+ (serialNum)
			+ "].file' value='' onkeydown='return false' contenteditable='false' onpaste='return false' onchange='fileChange()' class='input_style'  style='width: "+attachFileWidth+";'/>"
	var newTD2 = newTR.insertCell(2);
	newTD2.innerHTML = "<span>&nbsp;&nbsp;&nbsp;&nbsp;<a href='###' onclick='setFlag()'>删除</a></span>"
}

function setFlag() {
	deleteFileFlag = true;
}

function deleteFile(index) {
	var valueTable = document.getElementById('idTB');
	if (1 == fileNum) {
		serialNum++;
		valueTable.deleteRow(index);
		var newTR = valueTable.insertRow(index);
		var newTD0 = newTR.insertCell(0);
		newTD0.className = "t8";
		newTD0.innerHTML = "";
		var newTD1 = newTR.insertCell(1);
		var attachFileWidth = '600px';
		if($("#draft").length >0)
		attachFileWidth = '400px';
		newTD1.innerHTML = "<input type='file' name='uploadFile["
				+ (serialNum)
				+ "].file' value='' onchange='fileChange()' onkeydown='return false' contenteditable='false'  onpaste='return false' class='input_style'  style='width: "+attachFileWidth+";'/>"
		var newTD2 = newTR.insertCell(2);
		newTD2.innerHTML = "<span>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='setFlag()'>删除</a></span>"
	} else {
		valueTable.deleteRow(index);
		fileNum--;
	}
}

function do_tableClick(evt) {
	evt = (evt) ? evt : ((window.event) ? window.event : "")
	var element = (evt.target) ? evt.target : evt.srcElement;
	if (element.tagName == "A") {
		var objSPAN = (element.parentNode)
				? element.parentNode
				: element.parentElement;
		var objTD = (objSPAN.parentNode)
				? objSPAN.parentNode
				: objSPAN.parentElement;
		if (objTD.tagName == "TD") {
			var objTR = (objTD.parentNode)
					? objTD.parentNode
					: objTD.parentElement;
			var rowIndex = objTR.rowIndex;
			if (deleteFileFlag == true) {
				deleteFile(rowIndex);
			}
		}
	} else if (element.tagName == "INPUT") {
		var objTD = (element.parentNode)
				? element.parentNode
				: element.parentElement;
		var objTR = (objTD.parentNode) ? objTD.parentNode : objTD.parentElement;
		tableRowIndex = objTR.rowIndex;
	}

	deleteFileFlag = false;
}

function do_fileClick(element) {
	previousValue = element.value;
}

function deleteIssueAttachment(){
	$("#Filetxt").attr("value","");
	$(".input_file").attr("value","");
}