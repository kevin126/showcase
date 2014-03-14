var selectedIds = new Array();
function selectedOutStore(obj) {
	if (obj.checked == true) {
		selectedIds.push(obj.value);
	} else {
		selectedIds.pop(obj.value);
	}
}
function outStoreAsset(dataId) {
	location.href = "/itsm/asset/processDeal.do?method=outStore&type=borrow&&assetListIds="
			+ selectedIds;
}

function outStoreApply() {
	location.href = "/itsm/asset/processDeal.do?method=outStore&assetListIds="
			+ selectedIds;
}

function outStoreApplyvar(assetid,type) {
	location.href = "/itsm/asset/processDeal.do?method=outStore&assetListIds="
			+assetid+"&type="+type;
}
function selectAll(obj) {
	var objs = $("input[type=checkbox][name=asset.flag]");
	if (obj.checked == true) {
		$(objs).attr("checked", true);
	} else {
		$(objs).attr("checked", false);
	}
	for (var i = 0; i < objs.length; i++) {
		var flag = false;
		for (var j = 0; j < selectedIds.length; j++) {
			if (objs[i].value == selectedIds[j]) {
				flag = true;
				break;
			}
		}
		if (!flag && obj.checked == true) {
			selectedIds.push(objs[i].value)
		}
		if (obj.checked == false) {
			selectedIds.pop(objs[i].value);
		}
	}
}