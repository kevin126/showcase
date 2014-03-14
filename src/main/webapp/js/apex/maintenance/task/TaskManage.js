Ext.namespace('Apex.Task');

Apex.Task.TaskManagePanel = function(id) {

	// Id
	this.id = id;

	// Property
	var operateTreePanel = createOperateTreePanel();
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
		var taskPoolNode = new Ext.tree.TreeNode({
					text : '工单池',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : true
				});
		var incNode = new Ext.tree.TreeNode({
					text : '事件工单',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : true
				});
		var proNode = new Ext.tree.TreeNode({
					text : '问题工单',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : true
				});
		var rfcNode = new Ext.tree.TreeNode({
					text : '变更工单',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : true
				});
		var myNode = new Ext.tree.TreeNode({
					text : '分配给我的工单',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var taskMineCreateNode = new Ext.tree.TreeNode({
					text : '我创建的工单',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var taskAllNode = new Ext.tree.TreeNode({
					text : '全部工单',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var taskLastResolveNode = new Ext.tree.TreeNode({
					text : '最近解决的工单',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var taskLastCreateNode = new Ext.tree.TreeNode({
					text : '最近创建的工单',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var taskLastModifyNode = new Ext.tree.TreeNode({
					text : '最近更新的工单',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var taskByUserNode = new Ext.tree.TreeNode({
					text : '按运维人员统计',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var taskByPriorNode = new Ext.tree.TreeNode({
					text : '按优先级统计',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var taskByCriticalNode = new Ext.tree.TreeNode({
					text : '按严重度统计',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var taskByStatelNode = new Ext.tree.TreeNode({
					text : '按工单状态统计',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : false
				});
		var taskQueryNode = new Ext.tree.TreeNode({
					text : '工单查询',
					expanded : true,
					icon : 'images/default/tree/leaf.gif',
					leaf : true
				});
		root.appendChild(taskPoolNode);
		myNode.appendChild(incNode);
//		myNode.appendChild(proNode);
//		myNode.appendChild(rfcNode);
		root.appendChild(myNode);
		root.appendChild(taskMineCreateNode);
		root.appendChild(taskAllNode);
		root.appendChild(taskLastResolveNode);
		root.appendChild(taskLastCreateNode);
		root.appendChild(taskLastModifyNode);
		root.appendChild(taskByUserNode);
		root.appendChild(taskByPriorNode);
		root.appendChild(taskByCriticalNode);
		root.appendChild(taskByStatelNode);
		root.appendChild(taskQueryNode);
		var panel = new Ext.tree.TreePanel({
					title : '操作列表',
					autoScroll : true,
					width : 200,
					margins : '5 0 5 5',
					region : 'west',
					frame : false,
					split : true,
					collapsible : true,
					rootVisible : false,
					root : root
				});
		panel.on('click', handleClickTreeNode, panel);
		return panel;
	};

	function createCenterTabbedPanel() {
		var panel = new Ext.Panel({
					id : 'Apex.Task.CenterTabPanel',
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
					id : this.id,
					layout : 'border',
					closable : true,
					items : [operateTreePanel, centerTabbedPanel]
				});
		// Init task pool interface
		var subPanel = new Apex.Task.TaskPool.Panel().getPanel();
		centerTabbedPanel.add(subPanel);
		return panel;
	}

	this.getPanel = function() {
		return mainPanel;
	};

	function handleClickTreeNode(selectedTreeNode) {
		if (previousNode != null && previousNode.text == selectedTreeNode.text && selectedTreeNode.text != '按运维人员统计')
			return;
		centerTabbedPanel.removeAll(true);
		if (selectedTreeNode.text == '工单池') {
			var panel = new Apex.Task.TaskPool.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '分配给我的工单') {
			var panel = new Apex.Task.TaskMine.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '事件工单') {
			var panel = new Apex.Task.TaskMineIncident.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '问题工单') {
			Ext.Msg.show({
				title : '提示',
				msg : '该功能尚未实现！',
				modal : true,
				buttons : Ext.Msg.OK,
				icon : Ext.Msg.INFO
			});
		}
		if (selectedTreeNode.text == '变更工单') {
			Ext.Msg.show({
				title : '提示',
				msg : '该功能尚未实现！',
				modal : true,
				buttons : Ext.Msg.OK,
				icon : Ext.Msg.INFO
			});
		}
		if (selectedTreeNode.text == '工单查询') {
			var panel = new Apex.Task.TaskQuery.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '我创建的工单') {
			var panel = new Apex.Task.TaskMineCreate.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '全部工单') {
			var panel = new Apex.Task.TaskAll.Panel().getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '最近解决的工单') {
			var panel = new Apex.Task.TaskLast.Panel(LastTaskConstant.LAST_MODE_RESOLVE).getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '最近创建的工单') {
			var panel = new Apex.Task.TaskLast.Panel(LastTaskConstant.LAST_MODE_CREATE).getPanel();
			centerTabbedPanel.add(panel);
		}
		if (selectedTreeNode.text == '最近更新的工单') {
			var panel = new Apex.Task.TaskLast.Panel(LastTaskConstant.LAST_MODE_MODIFY).getPanel();
			centerTabbedPanel.add(panel);
		}
		
		if (selectedTreeNode.text == '按运维人员统计') {
			var panel = new Apex.Task.TaskStat.Panel(StatisticTaskItem.STAT_USER).getPanel();
			centerTabbedPanel.add(panel);
		}
		
		if (selectedTreeNode.text == '按优先级统计') {
			var panel = new Apex.Task.TaskStat.Panel(StatisticTaskItem.STAT_PRIOR).getPanel();
			centerTabbedPanel.add(panel);
		}
		
		if (selectedTreeNode.text == '按严重度统计') {
			var panel = new Apex.Task.TaskStat.Panel(StatisticTaskItem.STAT_SEVERITY).getPanel();
			centerTabbedPanel.add(panel);
		}
		
		if (selectedTreeNode.text == '按工单状态统计') {
			var panel = new Apex.Task.TaskStat.Panel(StatisticTaskItem.STAT_STATE).getPanel();
			centerTabbedPanel.add(panel);
		}
		
		centerTabbedPanel.doLayout();
		previousNode = selectedTreeNode;
	};
}