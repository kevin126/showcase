Ext.namespace('Apex.apex');
Apex.asset.AssetSearchManagePanel = function() {
	this.id = id;
	var previousNode = null;
	var operateTreePanel = null;
	var centerPanel = null;
	var AssetQueryPanel = null;
	this.getPanel = function() {
		operateTreePanel = createOperateTreePanel();
		centerPanel = createCenterPanel();
		var noticeManagePanel = new Ext.Panel({
					id : id,
					layout : 'border',
					closable : true,
					border:false,
					items : [operateTreePanel, centerPanel]
				});
		return noticeManagePanel;
	}

	function createOperateTreePanel() {
		var root = new Ext.tree.TreeNode({
					text : '资产操作',
					id : 0,
					hasChildren : true,
					expanded : true
				});
		var assetSerachNode = new Ext.tree.TreeNode({
					text : '资产查询',
					id : 'assetSerachNode',
					leaf : true
				});
		var assetCountNode = new Ext.tree.TreeNode({
					text : '资产统计',
					id : 'assetCountNode',
					leaf : true
				});

		root.appendChild(assetSerachNode);
		root.appendChild(assetCountNode);
		var panel = new Ext.tree.TreePanel({
					id : 'noticeOperateTree',
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
		assetSerachNode.select();
		previousNode = assetSerachNode;
		return panel;
	}

	function createCenterPanel() {
		AssetQueryPanel = new Apex.asset.AssetQueryPanel();
		var centerTabPanel = new Ext.Panel({
					id : "centerTabPanel",
					region : 'center',
					margins : '5 5 5 0',
					deferredRender : false,
					layoutOnTabChange : true,
					frame : false,
					border : false,
					layout : 'fit',
					items : AssetQueryPanel,
					enableTabScroll : true
				});
		return centerTabPanel;
	}

	function handleClickTreeNode(selectedTreeNode) {
			centerPanel.removeAll(true);
			if (selectedTreeNode.text == '资产查询') {
				var assetSearchPanel = new Apex.asset.AssetQueryPanel();
				centerPanel.add(assetSearchPanel);
			} else if (selectedTreeNode.text == '资产统计') {
				var assetCountPanel = new Apex.asset.AssetCountPanel();
				centerPanel.add(assetCountPanel);
			} 
			centerPanel.doLayout();
		previousNode = selectedTreeNode;
	}
}