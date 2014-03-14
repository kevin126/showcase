Ext.namespace('Apex.Desk.Personal');

Apex.Desk.Personal.ManagePanel = function(id) {

	// Id
	this.id = id;

	// Property
	var operateTreePanel = createOperateTreePanel();
	var operateNoticePanel = createOperateNoticePanel();
	var operateMainPanel = createOperateMainPanel();
	var centerTabbedPanel = createCenterTabbedPanel();
	var mainPanel = createMainPanel();
	var previousNode = null;

	// Method
	function createOperateTreePanel() {
		var root = new Ext.tree.TreeNode({
					text : '',
					id : 0,
					hasChildren : true,
					expanded : true
				});
		var submitTaskNode = new Ext.tree.TreeNode({
					text : '我提交的请求',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : true
				});
		var unsubmitTaskNode = new Ext.tree.TreeNode({
					text : '我的草稿',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : true
				});
		var waitTaskNode = new Ext.tree.TreeNode({
					text : '待处理的请求',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var processTaskNode = new Ext.tree.TreeNode({
					text : '处理中的请求',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var completeTaskNode = new Ext.tree.TreeNode({
					text : '已处理的请求',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var faqListNode = new Ext.tree.TreeNode({
					text : 'FAQ列表',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var ntcNode = new Ext.tree.TreeNode({
					text : '系统公告',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var adaNode = new Ext.tree.TreeNode({
					text : '资产领用',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var adbNode = new Ext.tree.TreeNode({
					text : '资产借调',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		root.appendChild(submitTaskNode);
		root.appendChild(unsubmitTaskNode);
		root.appendChild(waitTaskNode);
		root.appendChild(processTaskNode);
		root.appendChild(completeTaskNode);
		root.appendChild(faqListNode);
		root.appendChild(ntcNode);
		root.appendChild(adaNode);
		root.appendChild(adbNode);
		var panel = new Ext.tree.TreePanel({
					title : '操作列表',
					autoScroll : true,
					width : 200,
					region : 'west',
					margins : '5 0 5 5',
					frame : false,
					split : true,
					rootVisible : false,
					collapsible : true,
					root : root
				});
		panel.on('click', handleClickTreeNode, panel);
		return panel;
	};

	function createOperateNoticePanel() {
		var panel = new Apex.Desk.Notice.Panel();
		return panel.getPanel();
	}

	function createOperateMainPanel() {
		var panel = new Ext.Panel({
					layout : 'border',
					region : 'west',
					margins : '5 0 5 5',
					width : 270,
					closable : false,
					split : true,
					collapsible : true,
					items : [operateTreePanel]
				});
		return panel;
	};

	function createCenterTabbedPanel() {
		var panel = new Ext.Panel({
					id : 'Apex.Desk.Personal.CenterTabPanel',
					region : 'center',
					margins : '5 5 5 0',
					deferredRender : false,
					layout : 'fit',
					frame : true,
					border : false,
					enableTabScroll : true
				});
		return panel;
	};

	function createMainPanel() {
		var panel = new Ext.Panel({
					id : 'Apex.Desk.Personal.CenterTabbedPanel',
					layout : 'border',
					closable : true,
					items : [operateTreePanel, centerTabbedPanel]
				});
		return panel;
	}

	this.getPanel = function() {
		var panel = new Apex.Desk.Submit.Panel().getPanel();
		centerTabbedPanel.add(panel);
		return mainPanel;
	};

	function handleClickTreeNode(selectedTreeNode) {
		centerTabbedPanel.removeAll(true);

		if (selectedTreeNode.text == '提交服务请求') {
			var panel = new Apex.Desk.Submit.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}

		if (selectedTreeNode.text == '我的草稿') {
			var panel = new Apex.Desk.Unsubmit.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}

		if (selectedTreeNode.text == '待处理的请求') {
			var panel = new Apex.Desk.Wait.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}

		if (selectedTreeNode.text == '处理中的请求') {
			var panel = new Apex.Desk.Process.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}

		if (selectedTreeNode.text == '已处理的请求') {
			var panel = new Apex.Desk.Complete.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}

		if (selectedTreeNode.text == 'FAQ列表') {
			var panel = new Apex.Desk.Faq.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}

		if (selectedTreeNode.text == '系统公告') {
			var panel = new Apex.Desk.Notice.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '资产领用') {
			var panel = new Apex.Desk.AssetApply.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '资产借调') {
			var panel = new Apex.Desk.AssetBorrow.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '资产领用') {
			var panel = new Apex.Desk.AssetApply.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}

		centerTabbedPanel.doLayout();
		previousNode = selectedTreeNode;
	};
}