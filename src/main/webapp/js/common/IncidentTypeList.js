IncidentTypeList = function(id) {
	var jspid = id;
	// 事件工单类型树
	var treeRoot = new Ext.tree.AsyncTreeNode({
				text : '所有类型',
				id : -1,
				disabled : true,
				hasChildren : true,
				devNodeType : 'root',
				expanded : true
			});

	var treeLoader = new Ext.ux.DWRTreeLoader({
				preloadChildren : true,
				dwrCall : IssueTypeService.getIncidentTypes,
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
				height : 330,
				root : treeRoot
			});
	// panel.expandAll();
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
	panel.on('checkchange', selectSingleNode, panel);
	var win = new Ext.Window({
				title : '选择类型',
				height : 400,
				model : true,
				width : 300,
				items : panel,
				buttons : [sureBtn, cancelBtn],
				buttonAlign : 'center'
			})
	sureBtn.disable();
	// 单选
	function selectSingleNode(node, checked) {
		var rootNode = panel.getRootNode();
		disSelectChildNode(rootNode);
		node.getUI().checkbox.checked = checked;
		node.attributes.checked = checked;

		if (rootNode.text != node.text && node.text != '所有用户') {
			rootNode.attributes.checked = false;
		}
		if (checked) {
			sureBtn.setDisabled(false);
		} else {
			sureBtn.setDisabled(true);
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
			fixHander(checkedNodes[0].id)
			document.getElementById(jspid).focus();
		} else {
		}
		win.close();
	}
	function fixHander(id) {
		IssueTypeService.findWfDataTypeById(id, function(data) {
			if (data.principal) {

				document.getElementById("fixedHandler").value = data.principal.realName;
				document.getElementById("fixedHandlerName").value = data.principal.name;
			} else {
				document.getElementById("fixedHandler").value = "";
				document.getElementById("fixedHandlerName").value = "";
			}
		});
	}

	function cancelEvent() {
		win.close();
	}
	return win;
}