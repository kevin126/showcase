Ext.namespace('Apex.maintenance.type');

Apex.maintenance.type.TypeManagePanel = function(id) {
	this.id = id;
	var previousNode = null;
	var operateTreePanel = null;
	var centerPanel = null;
	var waitPanel = null;

	this.getPanel = function() {
		operateTreePanel = createOperateTreePanel();
		centerPanel = createCenterPanel();
		var typeManagePanel = new Ext.Panel({
			id : id,
			layout : 'border',
			closable : true,
			border : false,
			items : [operateTreePanel, centerPanel]
		});
		return typeManagePanel;
	}

	this.loadData = function() {
		waitPanel.loadData();
	}

	function createOperateTreePanel() {
		var root = new Ext.tree.TreeNode({
			text : '故障类型',
			id : 0,
			hasChildren : true,
			expanded : true
		});
		var configIncidentTypeNode = new Ext.tree.TreeNode({
			id : 'configType_incidentNode',
			text : '配置事件类型',
			cls : document.getElementById("issueTypeFlag")
					&& document.getElementById("issueTypeFlag").innerHTML == 1
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		});
		var configProblemTypeNode = new Ext.tree.TreeNode({
			id : 'configType_problemNode',
			text : '配置问题类型',
			cls : document.getElementById("issueTypeFlag")
					&& document.getElementById("issueTypeFlag").innerHTML == 1
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		});
		var configRFCTypeNode = new Ext.tree.TreeNode({
			id : 'configType_rfcNode',
			text : '配置变更类型',
			cls : document.getElementById("issueTypeFlag")
					&& document.getElementById("issueTypeFlag").innerHTML == 1
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		});
		var configRelTypeNode = new Ext.tree.TreeNode({
			id : 'configType_relNode',
			text : '配置发布类型',
			cls : document.getElementById("issueTypeFlag")
					&& document.getElementById("issueTypeFlag").innerHTML == 1
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		});
		if (USER.isAble(PermissionId.SETTING_SYSTEM_PARAMETERS)){
			root.appendChild(configIncidentTypeNode);
			root.appendChild(configProblemTypeNode);
			root.appendChild(configRFCTypeNode);
			root.appendChild(configRelTypeNode);
		}
		var panel = new Ext.tree.TreePanel({
			id : 'typeOperateTree',
			title : '操作列表',
			autoScroll : true,
			width : 200,
			margins : '5 0 5 5',
			region : 'west',
			frame : false,
			split : true,
			border : false,
			collapsible : true,
			rootVisible : false,
			root : root
		});
		panel.on('click', handleClickTreeNode, panel);
		configIncidentTypeNode.select();
		previousNode = configIncidentTypeNode;
		return panel;
	}

	function createCenterPanel() {
		var typePanel11 = new Apex.maintenance.Issue.Type.Panel("INC");
		var centerTabPanel = new Ext.Panel({
			id : "centerTabPanel",
			region : 'center',
			margins : '5 5 5 0',
			deferredRender : false,
			layoutOnTabChange : true,
			frame : false,
			border : false,
			layout : 'fit',
			items : typePanel11.getPanel(),
			enableTabScroll : true
		});
		return centerTabPanel;
	}

	function handleClickTreeNode(selectedTreeNode) {
		if (previousNode == null || previousNode.text != selectedTreeNode.text) {// 选择与上一次相同
			centerPanel.removeAll(true);
			if (selectedTreeNode.text == '配置事件类型') {
				var itPanel = new Apex.maintenance.Issue.Type.Panel("INC");
				centerPanel.add(itPanel.getPanel());
			}else if (selectedTreeNode.text == '配置问题类型') {
				var itPanel = new Apex.maintenance.Issue.Type.Panel("PRO");
				centerPanel.add(itPanel.getPanel());
			}else if (selectedTreeNode.text == '配置变更类型') {
				var itPanel = new Apex.maintenance.Issue.Type.Panel("RFC");
				centerPanel.add(itPanel.getPanel());
			}else if (selectedTreeNode.text == '配置发布类型') {
				var itPanel = new Apex.maintenance.Issue.Type.Panel("REL");
				centerPanel.add(itPanel.getPanel());
			}
			centerPanel.doLayout();
		}
		previousNode = selectedTreeNode;
	}
}