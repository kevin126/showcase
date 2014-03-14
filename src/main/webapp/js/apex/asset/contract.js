var deleteFileFlag = false;
var fileNum = 1;
function fileChange() {
	var valueTable = document.getElementById('idTB');
	var totalNum = valueTable.rows.length;
	if (totalNum < 4) {
		fileNum++;
		var currentNum = totalNum;
		var newTR = valueTable.insertRow(currentNum);
		var newTD0 = newTR.insertCell(0);
		newTD0.className = "t8";
		newTD0.innerHTML = document.getElementById("attachment").innerHTML;
		var newTD1 = newTR.insertCell(1);
		newTD1.innerHTML = "<input type='file' name='uploadFile["
				+ (valueTable.rows.length - 1)
				+ "].file' value='' onchange='fileChange()' class='input_style'  style='width: 600px;'/>"
		var newTD2 = newTR.insertCell(2);
		newTD2.innerHTML = "<span>&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' onclick='setFlag()'>删除</a></span>"
	} else {
	}
}

function setFlag() {
	deleteFileFlag = true;
}

function deleteFile(index) {
	var valueTable = document.getElementById('idTB');
	if (1 == fileNum) {
		valueTable.deleteRow(index);
		var newTR = valueTable.insertRow(index);
		var newTD0 = newTR.insertCell(0);
		newTD0.className = "t8";
		newTD0.innerHTML = "附件";
		var newTD1 = newTR.insertCell(1);
		newTD1.innerHTML = "<input type='file' name='uploadFile["
				+ (valueTable.rows.length - 7)
				+ "].file' onkeydown='return false'  onpaste='return false' value='' onchange='fileChange()' class='input_style'  style='width: 600px;'/>"
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
			if (deleteFileFlag == true) {
				var rowIndex = objTR.rowIndex;
				deleteFile(rowIndex);
			}
		}
	}
	deleteFileFlag = false;
}

function submitInfor() {
	var form = document.getElementById("ContractActionForm");
	form.submit();
}

function checkSubmitState(){
	if($("#attachment").val()==""){
		$("#addcomments").attr("disabled",true);
	}else{
		$("#addcomments").attr("disabled",false);
	}
}