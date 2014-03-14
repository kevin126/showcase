QueryUserByRole = function(id, userId) {
	var jspid = id;
	rootNodeId = null != userId ? userId : -1;
	var sureBtn = new Ext.Button({
				text : '确定',
				minWidth : 65,
				handler : sureEvent
			});
	var cancelBtn = new Ext.Button({
				text : '取消',
				minWidth : 65,
				handler : cancelEvent
			});
	var treeRoot = new Ext.tree.AsyncTreeNode({
				text : '角色列表',
				id : rootNodeId,
				disabled : true,
				hasChildren : true,
				devNodeType : 'root',
				expanded : true
			});

	var treeLoader = new Ext.ux.DWRTreeLoader({
				preloadChildren : true,
				dwrCall : SecurityService.getAllRoleNames,
				waitMessage : new Ext.LoadMask(Ext.getBody(), {
							msg : "正在读取数据，请稍等..."
						})
			});
	var panel = new Ext.tree.TreePanel({
				loader : treeLoader,
				collapsible : true,
				rootVisible : true,
				autoScroll : true,
				border : false,
				margins : '5 5 5 5',
				frame : false,
				split : true,
				region : 'west',
				width : 284,
				height : 350,
				root : treeRoot
			});
	panel.expandAll();
	var rootNode = panel.getRootNode();
	var selectRecord = [];

	// 获得所有已经选中的书节点的信息
	function getResultData(node) {
		node.eachChild(function(child) {
					if (child.attributes.checked) {
						selectRecord.push(child.text);
					} else {
						if (!Ext.isEmpty(child.childNodes))
							getResultData(child);
					}
				});
	}

	var win = new Ext.Window({
				title : '角色列表',
				height : 410,
				model : true,
				width : 300,
				items : panel,
				buttons : [sureBtn, cancelBtn],
				buttonAlign : 'center'
			});
	function sureEvent() {
		getResultData(rootNode);
		if (!Ext.isEmpty(selectRecord) && selectRecord.length > 0) {
			document.getElementById(jspid).value = selectRecord;
			document.getElementById(jspid).focus();
		} else {

		}
		win.close();
	}
	function cancelEvent() {
		win.close();
	}
	return win;
}