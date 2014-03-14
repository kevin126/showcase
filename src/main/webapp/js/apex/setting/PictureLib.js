function selectPictureLib() {
	var pictureLibType = $("#pictureSelect").val();
	location.href = "/itsm/common/selectImage.do?method=enterGrid&pictureLibType="
			+ pictureLibType;
}

function showLoad() {
	if ($("#flag").val() == 1) {
		$("#upLoading").attr("style", "display: block");
	}
}

function deleteList() {
	var list = new Array();
	var elements = document.getElementsByTagName("input");
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].name == 'pictureCheck' && elements[i].checked == true) {
			list.push(elements[i].value);
		}
	}
	location.href = "/itsm/common/selectImage.do?method=deleteList&ids=" + list;
}

function selectUp() {
	start--;
	setImageValue();
};

function selectDown() {
	start++;
	setImageValue();
}

function setImageValue() {
	$("#href1").attr(
			"href",
			"/itsm/common/selectImage.do?method=enterDetail&dataId="
					+ idArray[start]);
	$("#img1").attr("src", imgPathArray[start]);
	$("#href2").attr(
			"href",
			"/itsm/common/selectImage.do?method=enterDetail&dataId="
					+ idArray[start + 1]);
	$("#img2").attr("src", imgPathArray[start + 1]);
	$("#href3").attr(
			"href",
			"/itsm/common/selectImage.do?method=enterDetail&dataId="
					+ idArray[start + 2]);
	$("#img3").attr("src", imgPathArray[start + 2]);
	$("#href4").attr(
			"href",
			"/itsm/common/selectImage.do?method=enterDetail&dataId="
					+ idArray[start + 3]);
	$("#img4").attr("src", imgPathArray[start + 3]);
	if (start == 0) {
		$("#pictureUp").attr("href", "#");
	} else {
		$("#pictureUp").attr("href", "javascript:selectUp();");
	}
	if (start == limit) {
		$("#pictureDown").attr("href", "#");
	} else {
		$("#pictureDown").attr("href", "javascript:selectDown();");
	}
	for (var i = 1; i <= $(".browseEachPic").length; i++) {
		if ($("#img" + i).attr('src') == "#") {
			$($(".browseEachPic").get(i - 1)).attr("style", "display:none;");
		}
	}
}

function checkDelete() {
	// var elements = document.getElementsByTagName("input");
	var elements = $("input");
	var flag = true;
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].type == "checkbox"
				&& elements[i].name == 'pictureCheck'
				&& elements[i].checked == true) {
			$("#deleteButton").attr("disabled", false);
			flag = false;
		}
	}
	if (flag) {
		$("#deleteButton").attr("disabled", true);
	}

}

function checkButtonState(){
	var files=$("input[type=file]");
	var flag=false;
	for(var i=0;i<files.length;i++){
		if($(files[i]).val()!=''){
			flag=true;
			break;
		}
	}
	if(!flag){
		$("#submitButton").attr("disabled",true);
	}else{
		$("#submitButton").attr("disabled",false);
	}
	
}
