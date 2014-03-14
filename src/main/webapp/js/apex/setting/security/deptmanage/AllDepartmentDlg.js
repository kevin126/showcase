AllDepartmentDlg = function(id) {
var jspid=id;
	var treeRoot = new Ext.tree.AsyncTreeNode({
				text : '部门列表',
				id : -1,
				disabled : true,
				hasChildren : true,
				devNodeType : 'root',
				expanded : true
			});

	var treeLoader = new Ext.ux.DWRTreeLoader({
				preloadChildren : true,   
				dwrCall : SecurityService.getAllDepartmentNames,
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
//	panel.expandAll();
	panel.on('checkchange', selectSingleNode, panel);
	var win = new Ext.Window({
				title : '部门列表',
				height : 410,
				modal:true,
				width : 300,
				items : panel,
				buttons : [{
							text : '确定',
							handler : sureEvent
						}, {
							text : '取消',
							handler : cancelEvent
						}],
				buttonAlign : 'center'
			})
	// 单选
	function selectSingleNode(node, checked) {
		var rootNode = panel.getRootNode();
		disSelectChildNode(rootNode);
		node.getUI().checkbox.checked = checked;
		node.attributes.checked = checked;
		if (rootNode.text != node.text && node.text != '部门列表') {
			rootNode.attributes.checked = false;
		}
	}

	function disSelectChildNode(node) {
		node.eachChild(function(child) {
					child.getUI().checkbox.checked = false;
					child.attributes.checked = false;
					if (!Ext.isEmpty(child.childNodes))
						disSelectChildNode(child)
				});
	}
	function sureEvent() {
		var checkedNodes = panel.getChecked();
		if (!Ext.isEmpty(checkedNodes) && checkedNodes.length == 1) {
			document.getElementById(jspid).value = checkedNodes[0].text;
			$("#"+jspid).blur();
			//document.getElementById(jspid).blur();
		} else {
		}
		win.close();
	}
	function cancelEvent() {
		win.close();
	}
	return win;
}