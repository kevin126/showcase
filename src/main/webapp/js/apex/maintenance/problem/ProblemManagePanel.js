Ext.namespace('Apex.maintenance.problem');

Apex.maintenance.problem.ProblemManagePanel = function(id) {
	this.id = id;
	var checkboxSelect = null;
	var problemItemRecord = null;
	var problemItemStore = null;
	var previousNode = null;
	var operateTreePanel = null;
	var centerPanel = null;
	var problemItemPanel = null;
	var waitPanel = null;

	this.getPanel = function() {
		operateTreePanel = createOperateTreePanel();
		centerPanel = createCenterPanel();
		var problemManagePanel = new Ext.Panel({
					id : id,
					layout : 'border',
					closable : true,
					border : false,
					items : [operateTreePanel, centerPanel]
				});
		return problemManagePanel;
	}

	this.loadData = function() {
		waitPanel.loadData();
	}

	function createOperateTreePanel() {
		var root = new Ext.tree.TreeNode({
					text : '问题类型',
					id : 0,
					hasChildren : true,
					expanded : true
				});
		/*
		 * var waitDisposeNode = new Ext.tree.TreeNode({ id :
		 * 'resolving_problemNode', text : '待处理工单', cls : 'treeNodeBackground',
		 * leaf : true }); var waitCloseNode = new Ext.tree.TreeNode({ id :
		 * 'closing_problemNode', text : '待关闭工单', leaf : true });
		 * root.appendChild(waitDisposeNode); root.appendChild(waitCloseNode);
		 */
		var myNode = new Ext.tree.TreeNode({
			id : 'myself_problemNode',
			text : '我创建的工单',
			cls : document.getElementById("issueTypeFlag")
					&& document.getElementById("issueTypeFlag").innerHTML == 1
					? ''
					: 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected',
			leaf : true
		});
		var createNode = new Ext.tree.TreeNode({
			id : 'create_problemNode',
			text : '创建工单',
			href : '/itsm/servicedesk/creatIssueProWiz.do?menuId=m3_1&next=1&processType=PRO',
			leaf : true
		});
		var configTypeNode = new Ext.tree.TreeNode({
			id : 'configType_problemNode',
			text : '配置问题类型',
			cls : document.getElementById("issueTypeFlag")
					&& document.getElementById("issueTypeFlag").innerHTML == 1
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		});
		root.appendChild(myNode);
		root.appendChild(createNode);
		if (USER.isAble(PermissionId.SETTING_SYSTEM_PARAMETERS))
			root.appendChild(configTypeNode);
		var panel = new Ext.tree.TreePanel({
					id : 'problemOperateTree',
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
		if (document.getElementById("issueTypeFlag")
				&& document.getElementById("issueTypeFlag").innerHTML == 1) {
			configTypeNode.select();
			previousNode = configTypeNode;
		} else {
			myNode.select();
			previousNode = myNode;
		}
		return panel;
	}

	function createCenterPanel() {
		if (document.getElementById("issueTypeFlag")
				&& document.getElementById("issueTypeFlag").innerHTML == 1) {
			waitPanel = new Apex.maintenance.Issue.Type.Panel("PRO");
		} else {
			waitPanel = new Apex.maintenance.problem.CreateProblemItem();
		}
		var centerTabPanel = new Ext.Panel({
					id : "centerTabPanel",
					region : 'center',
					margins : '5 5 5 0',
					deferredRender : false,
					layoutOnTabChange : true,
					frame : false,
					border : false,
					layout : 'fit',
					items : waitPanel.getPanel(),
					enableTabScroll : true
				});
		return centerTabPanel;
	}

	function handleClickTreeNode(selectedTreeNode) {
		// previousNode.ui.removeClass('treeNodeBackground');
		if (selectedTreeNode.text == '创建工单') {
			// var addItemPanel = new Apex.maintenance.problem.AddProblemItem();
			// addItemPanel.showAddPanel();
		} else {
			if (previousNode == null
					|| previousNode.text != selectedTreeNode.text) {// 选择与上一次相同
				centerPanel.removeAll(true);
				if (selectedTreeNode.text == '待处理工单') {
					// var waitResolvePanel = new
					// Apex.maintenance.problem.WaitResolveProblemItem();
					// centerPanel.add(waitResolvePanel.getPanel());
					// waitResolvePanel.loadData();
				} else if (selectedTreeNode.text == '我创建的工单') {
					var problemItemPanel = new Apex.maintenance.problem.CreateProblemItem();
					centerPanel.add(problemItemPanel.getPanel());
				} else if (selectedTreeNode.text == '待关闭工单') {
					// var waitClosePanel = new
					// Apex.maintenance.problem.WaitCloseProblemItem();
					// centerPanel.add(waitClosePanel.getPanel());
				} else if (selectedTreeNode.text == '配置问题类型') {
					var itPanel = new Apex.maintenance.Issue.Type.Panel("PRO");
					centerPanel.add(itPanel.getPanel());
				}
				centerPanel.doLayout();
			}
		}
		previousNode = selectedTreeNode;
	}
}