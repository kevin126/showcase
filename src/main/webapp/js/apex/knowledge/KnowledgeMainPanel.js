Ext.namespace('Apex.maintenance.knowledge');
Apex.maintenance.knowledge.KnowledgeMainPanel = function(id) {
	this.id = id;
	var operateTreePanel = null;
	var centerPanel = null;
	var previousNode = null;
	var waitApprovePanel = null;
	var initShowPanel = null;
	this.getPanel = function() {
		operateTreePanel = createOperateTreePanel();
		centerPanel = createCenterPanel();

		var innerWidth;
		if (window.innerWidth) {
			innerWidth = window.innerWidth;
		} else {
			innerWidth = document.body.clientWidth;
		}

		var innerHeight;
		if (window.innerHeight) {
			innerHeight = window.innerHeight;
		} else {
			innerHeight = document.body.clientHeight;
		}
		var incidentManagePanel = new Ext.Panel({
					id : id,
					layout : 'border',
					border : false,
					width : innerWidth,
					height : innerHeight - 214,
					renderTo : 'mainBodyDiv',
					items : [operateTreePanel, centerPanel]
				});
		return incidentManagePanel;
	}
	this.loadData = function() {
		if (initShowPanel.loadData)
			initShowPanel.loadData();
	}
	function createOperateTreePanel() {
		var root = new Ext.tree.TreeNode({
					text : '操作列表',
					id : 0,
					hasChildren : true,
					expanded : true
				});
		waitApproveNode = new Ext.tree.TreeNode({
			id : 'waitApprove_knowledgeNode',
			text : '待审核知识库',
			cls : nowMenuTreeId == 'waitApprove_knowledgeNode'
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		});

		myNode = new Ext.tree.TreeNode({
			id : 'myCreate_knowledgeNode',
			text : '我的知识库',
			expanded : true,
			cls : nowMenuTreeId == 'myCreate_knowledgeNode'
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : false
		});
		editingNode = new Ext.tree.TreeNode({
			id : 'myDraft_knowledgeNode',
			text : '草稿',
			cls : nowMenuTreeId == 'myDraft_knowledgeNode'
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		})
		approvingNode = new Ext.tree.TreeNode({
			id : 'myApproving_knowledgeNode',
			text : '审核中',
			cls : nowMenuTreeId == 'myApproving_knowledgeNode'
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		});
		rejectedNode = new Ext.tree.TreeNode({
			id : 'myRejected_knowledgeNode',
			text : '已退回',
			cls : nowMenuTreeId == 'myRejected_knowledgeNode'
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		});
		publishedNode = new Ext.tree.TreeNode({
			id : 'myPublished_knowledgeNode',
			text : '已发布',
			cls : nowMenuTreeId == 'myPublished_knowledgeNode'
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		});
		createNode = new Ext.tree.TreeNode({
			id : 'create_knowledgeNode',
			text : '创建知识库',
			cls : nowMenuTreeId == 'create_knowledgeNode'
					? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected'
					: '',
			leaf : true
		});

		configTypeNode = new Ext.tree.TreeNode({
					id : 'configType_knowledgeNode',
					text : '配置知识库类型',
					leaf : true
				});

		knowledgeItems = new Ext.tree.TreeNode({
					id : 'conknowledgeItems',
					text : '知识库列表',
					leaf : true
				});
		root.appendChild(createNode);

		if (USER.isAble(PermissionId.MODIFY_PUBLISHED_KNOWLEGE)) {// 判断知识库审批权限
			root.appendChild(waitApproveNode);
			previousNode = waitApproveNode;// 当前节点
		} else {
			previousNode = myNode;
		}

		if (nowMenuTreeId == 'waitApprove_knowledgeNode') {
			previousNode = waitApproveNode;
		} else if (nowMenuTreeId == 'myCreate_knowledgeNode') {
			previousNode = myNode;
		} else if (nowMenuTreeId == 'myDraft_knowledgeNode') {
			previousNode = editingNode;
		} else if (nowMenuTreeId == 'myApproving_knowledgeNode') {
			previousNode = approvingNode;
		} else if (nowMenuTreeId == 'myRejected_knowledgeNode') {
			previousNode = rejectedNode;
		} else if (nowMenuTreeId == 'myPublished_knowledgeNode') {
			previousNode = publishedNode;
		} else if (nowMenuTreeId == 'conknowledgeItems') {
			if (USER.hasFixedRole('普通用户')) {
				previousNode = knowledgeItems;
			}
		}

		previousNode.ui.addClass('treeNodeBackground');

		myNode.appendChild(editingNode);
		myNode.appendChild(approvingNode);
		myNode.appendChild(rejectedNode);
		myNode.appendChild(publishedNode);
		root.appendChild(myNode);
		if (USER.isAble(PermissionId.CONFIGURATION_KNOWLEGE_BASE_TYPES)) {
			root.appendChild(configTypeNode);
		}
		// 普通人员加载这个
		if (USER.hasFixedRole('普通用户')) {
			root.appendChild(knowledgeItems);
		}
		var panel = new Ext.tree.TreePanel({
					id : 'knowledgeOperateTree',
					title : '操作列表',
					autoScroll : true,
					width : 200,
					margins : '5 0 5 5',
					region : 'west',
					frame : false,
					border : false,
					split : true,
					collapsible : true,
					rootVisible : false,
					root : root
				});
		panel.on('click', handleClickTreeNode, panel);
		previousNode.select();
		// previousNode = waitApproveNode;
		return panel;
	}

	function createCenterPanel() {
		
		if (nowMenuTreeId) {// 该用户上一次点击知识库维护节点id
			waitApprovePanel = getPanelObjectByNodeId(nowMenuTreeId);
			initShowPanel = waitApprovePanel;
		} else {
			if (USER.isAble(PermissionId.MODIFY_PUBLISHED_KNOWLEGE)) {// 判断知识库审批权限
				waitApprovePanel = new Apex.maintenance.knowledge.WaitApproveKnowledgeItem();// 待审核知识库
				initShowPanel = waitApprovePanel;
			} else {
				initShowPanel = new Apex.maintenance.knowledge.MyKnowledgeItemPanel('myCreate_knowledgeNode');// 我创建的知识库
			}
		}
		
		var centerTabPanel = new Ext.Panel({
					id : "centerKnowledgePanel",
					region : 'center',
					margins : '5 5 5 0',
					border : false,
					layout : 'fit',
					items : initShowPanel.getPanel()
				});
		return centerTabPanel;
	}

	function handleClickTreeNode(selectedNode) {
		if (previousNode)
			previousNode.ui.removeClass('treeNodeBackground');
		if (selectedNode.id == 'create_knowledgeNode') {
			var addKnowledgePanel = new Apex.maintenance.knowledge.CreateKnowledgeItem();
			nowMenuTreeId = null;
			window.location.href = mainpath
					+ "knowledge/knowledgeCreate.do?to=befor";
			// addKnowledgePanel.showAddPanel();
		} else {
			centerPanel.removeAll(true);
			var nodeText = selectedNode.text;
			var nodeId = selectedNode.id;
			var addPanel = null;
			if (nodeId == 'waitApprove_knowledgeNode') {// 待审核知识库
				var waitApprovePanel = new Apex.maintenance.knowledge.WaitApproveKnowledgeItem();
				addPanel = waitApprovePanel.getPanel();
				waitApprovePanel.loadData();
			} else if (nodeId == 'myCreate_knowledgeNode'
					|| nodeId == 'myDraft_knowledgeNode'
					|| nodeId == 'myApproving_knowledgeNode'
					|| nodeId == 'myRejected_knowledgeNode'
					|| nodeId == 'myPublished_knowledgeNode') {
				var myTotalItemPanel = new Apex.maintenance.knowledge.MyKnowledgeItemPanel(nodeId);
				addPanel = myTotalItemPanel.getPanel();
				myTotalItemPanel.loadData();
			} else if (nodeId == 'configType_knowledgeNode') {// 配置知识库类型
				var typePanel = new Apex.maintenance.knowledge.KnowledgeTypePanel();
				addPanel = typePanel.getPanel();
			} else if (nodeId == 'conknowledgeItems') {// 得到发布到自助式服务台的知识库记录
				
				var conPanel = new Apex.ssd.knowledgeItems();
				addPanel = conPanel.getPanel();
			}
			KnowledgeService.setMenuTreeId(nodeId);
			centerPanel.add(addPanel);
			centerPanel.doLayout();
			nowMenuTreeId = nodeId;
		}
		previousNode = selectedNode;
	}

	function getPanelObjectByNodeId(nodeId) {
		var panel;
		if (nodeId == 'waitApprove_knowledgeNode') {// 待审核知识库
			panel = new Apex.maintenance.knowledge.WaitApproveKnowledgeItem();
		} else if (nodeId == 'myCreate_knowledgeNode'
				|| nodeId == 'myDraft_knowledgeNode'
				|| nodeId == 'myApproving_knowledgeNode'
				|| nodeId == 'myRejected_knowledgeNode'
				|| nodeId == 'myPublished_knowledgeNode') {
			panel = new Apex.maintenance.knowledge.MyKnowledgeItemPanel(nodeId);
		} else if (nodeId == 'configType_knowledgeNode') {// 配置知识库类型
			panel = new Apex.maintenance.knowledge.KnowledgeTypePanel();
		} else if (nodeId == 'conknowledgeItems') {// 得到发布到自助式服务台的知识库记录
			var panel = new Apex.ssd.knowledgeItems();
//			panel=obj.getPanel();
		}
		return panel;

	}
}

// 全局
var maintenanceMainPanel = null;
dwr.engine.setErrorHandler(errorHandler);
Ext.onReady(function() {
	SecurityService.getUserVoByUserName(null, {
		callback : function(user) {

			USER = new Apex.security.User({
						userName : user.userName,
						loginTime : user.loginTime,
						role : user.roleNames,
						permission : user.actionIds
					});
			maintenanceMainPanel = new Apex.maintenance.knowledge.KnowledgeMainPanel("knowledgePanel");
			var knowledgePanel = maintenanceMainPanel.getPanel();
			maintenanceMainPanel.loadData();
		}
	});

});
function changeMaintenanceMenu(panelName, id) {
	maintenanceMainPanel.addPanel(panelName, id);
}
