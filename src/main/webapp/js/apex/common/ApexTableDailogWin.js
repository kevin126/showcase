function dealTable(serviceMethod, title, hiddenId, inputNameId) {
	var id = '0';
	if (hiddenId.indexOf('department') != -1) {
		id = '-1';
	}
	var root = new Ext.tree.AsyncTreeNode({
				text : title,
				id : id,
				hasChildren : true,
				expanded : true
			});
	var treeLoader = new Ext.ux.DWRTreeLoader({
				dwrCall : serviceMethod
			});
	var panel = new Ext.tree.TreePanel({
				loader : treeLoader,
				autoScroll : true,
				lines : true,
				frame : false,
				width : 250,
				height : 340,
				root : root
			});
	panel.expandAll();

	var treeWindow = new Ext.Window({
				title : title,
				id : 'Apex.common.dealTableData',
				closable : true,
				width : 260,
				border : false,
				modal : true,
				plain : true,
				resizable : false,
				items : [panel],
				buttons : [{
					text : '确定',
					id : 'Apex.asset.AddAsset.OK',
					disabled : true,
					handler : function() {
						var treeNode = panel.getSelectionModel()
								.getSelectedNode();
						if (treeNode == null || treeNode.id == '0') {
							showErrMessage('请先选中节点！');
							return;
						}
						if (hiddenId != null) {
							document.getElementById(hiddenId).value = treeNode.id;
						}
						document.getElementById(inputNameId).value = Ext.util.Format
								.htmlDecode(treeNode.text);
						document.getElementById(inputNameId).focus();
						Ext.getCmp('Apex.common.dealTableData').close();
					}
				}, {
					text : '取消',
					handler : function() {
						document.getElementById(hiddenId).value = '';
						document.getElementById(inputNameId).value = '';
						document.getElementById(inputNameId).focus();
						treeWindow.close();
					}
				}],
				buttonAlign : 'center'
			});
	panel.addListener('click', function(selectedNode) {
				if (selectedNode.id != '0')
					Ext.getCmp('Apex.asset.AddAsset.OK').setDisabled(false);
				else
					Ext.getCmp('Apex.asset.AddAsset.OK').setDisabled(true);
			});
	treeWindow.show();
}

function showErrMessage(message) {
	Ext.Msg.show({
				title : '警告',
				msg : message,
				modal : true,
				buttons : Ext.Msg.OK,
				icon : Ext.Msg.WARNING
			});
};

function selectUser() {
	var url = "/itsm/common/userQuery.do?selectOne=1&enter=enter";
	tipsWindown('选择用户', 'iframe:' + url, '1100', '420', 'true', '', 'true',
			'leotheme');
}

function doCallBack(rtValue) {
	for (var i = 0; i < rtValue.length; i++) {
		for (var j = 0; j < rtValue[i].length; j++) {
			if (j == 9) {
				$("#userId").attr("value", rtValue[i][j].id);
				continue;
			} else if (j == 1) {
				$("#userName").attr("value", rtValue[i][j].realName);
				continue;
			}
		}
	}
	$("#userName").blur();
}

function clearCondition() {
	if ($("#name") != null)
		$("#name").attr("value", "");
	if ($("#code") != null)
		$("#code").attr("value", "");
	if ($("#supplierId") != null)
		$("#supplierId").attr("value", "");
	if ($("#supplierName") != null)
		$("#supplierName").attr("value", "");
	if ($("#userId") != null)
		$("#userId").attr("value", "");
	if ($("#userName") != null)
		$("#userName").attr("value", "");
	if ($("#startDate") != null)
		$("#startDate").attr("value", "");
	if ($("#endDate") != null)
		$("#endDate").attr("value", "");
}