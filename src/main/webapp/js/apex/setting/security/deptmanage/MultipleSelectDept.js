MultipleSelectDept = function(id) {
	var jspid = id;
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
	var win = new Ext.Window({
				title : '部门列表',
				height : 410,
				model : true,
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
	function sureEvent() {
		var checkedNodes = panel.getChecked();
		if (!Ext.isEmpty(checkedNodes) && checkedNodes.length > 0) {
			var deptStr = "";
			for (var i = 0; i < checkedNodes.length; i++) {
				if (i == 0) {
					deptStr = checkedNodes[i].text;
				} else {
					deptStr = deptStr + "," + checkedNodes[i].text;
				}
			}
			document.getElementById(jspid).value = deptStr;
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