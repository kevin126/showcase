Ext.namespace('Apex.asset')
Apex.asset.AssetTypePanel = function() {
	var operateTreePanel = null;
	var centerPanel = null;
	var previousNode = null;
	this.getPanel = function() {
		operateTreePanel = createOperateTreePanel();
		centerPanel = createCenterPanel();
		var panel = new Ext.Panel({
					layout : 'border',
					closable : true,
					border:false,
					items : [operateTreePanel, centerPanel]
				})
		return panel;
	};
	function createOperateTreePanel() {
		var root = new Ext.tree.TreeNode({
					text : '配置列表',
					id : '0',
					hasChildren : true,
					expanded : true
				});
		var assetTypeConfigureNode = new Ext.tree.TreeNode({
					text : '配置资产类型',
					id : 'assetTypeConfigureNode',
					leaf : true
				})
		var flexValueNode = new Ext.tree.TreeNode({
					text : '配置值集',
					id : 'flexValueNode',
					leaf : true
				})
		root.appendChild(assetTypeConfigureNode);
		root.appendChild(flexValueNode);
		var panel = new Ext.tree.TreePanel({
					id : 'assetTypeOperateTree',
					title : '配置列表',
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
		assetTypeConfigureNode.select();
		previousNode = assetTypeConfigureNode;
		return panel;
	};
	function createCenterPanel() {
		var assetTypeConfigurePanel = new Apex.asset.AssetTypeConfigurePanel();
		var centerTabPanel = new Ext.Panel({
					id : "centerTabPanel",
					region : 'center',
					margins : '5 5 5 0',
					deferredRender : false,
					layoutOnTabChange : true,
					frame : false,
					border : false,
					layout : 'fit',
					items : assetTypeConfigurePanel,
					enableTabScroll : true
				});
		return centerTabPanel;
	};
	function handleClickTreeNode(selectedTreeNode) {
		centerPanel.removeAll(true);
		if (selectedTreeNode.text == '配置资产类型') {
			var assetTypeConfigurePanel = new Apex.asset.AssetTypeConfigurePanel();
			centerPanel.add(assetTypeConfigurePanel);
		}  else if (selectedTreeNode.text == '配置值集') {
			var flexValueGridPanel = new Apex.asset.FlexValueGridPanel();
			centerPanel.add(flexValueGridPanel);
		}
		centerPanel.doLayout();
		previousNode = selectedTreeNode;
	}
}