function enterDelete(deleteId) {
	$("#deleteId").attr("value", deleteId);
	$("#delete").attr("style", "display: block");
}

function deleteSupplier() {
	var deleteId = $("#deleteId").val();
	location.href = "/itsm/asset/supplierMgt.do?method=deleteSupplier&supplierId="
			+ deleteId;
}