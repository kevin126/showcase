Ext.namespace('Apex.ssd');
Apex.ssd.AssetApplyPanel = function() {
	var treePanel = createTreePanel();
	var centerPanel = createCenterPanel();
	this.getPanel = function() {
		var mainPanel = new Ext.Panel({
					id : 'assetApplyMainPanel',
					layout : 'border',
					border : false,
					items : [treePanel, centerPanel]
				})
		return mainPanel;
	}

	function createTreePanel() {
		var root = new Ext.tree.TreeNode({
					text : '领用借用管理',
					id : 'AssetApplyPanel_rootNode',
					hasChildren : true,
					expanded : true
				});
		var myUsedApplyNode = new Ext.tree.TreeNode({
					text : '我的领用申请单',
					id : 'myUsedApplyNode',
					leaf : true
				});
		var myBorrowedApplyNode = new Ext.tree.TreeNode({
					text : '我的借用申请单',
					id : 'myBorrowedApplyNode',
					leaf : true
				});
		var createUsedNode = new Ext.tree.TreeNode({
					text : '创建领用申请单',
					id : 'createUsedNode',
					leaf : true
				});
		var createBorrowNode = new Ext.tree.TreeNode({
					text : '创建借用申请单',
					id : 'createBorrowNode',
					leaf : true
				})
		root.appendChild(myUsedApplyNode);
		root.appendChild(myBorrowedApplyNode);
		root.appendChild(createUsedNode);
		root.appendChild(createBorrowNode);

		var treePanel = new Ext.tree.TreePanel({
					id : 'assetApplyTreePanel',
					root : root,
					autoScroll : true,
					width : 200,
					margins : '5 0 5 5',
					frame : false,
					split : true,
					collapsible : true,
					rootVisible : false,
					region : 'west'
				});
		treePanel.on('click', handlClickChange, treePanel);
		myUsedApplyNode.select();
		return treePanel;
	}

	function createCenterPanel() {
		var myUserAsset = new Apex.ssd.MyAssetApplyGrid();
		var panel = new Ext.Panel({
					id : 'assetApplyCenterPanel',
					region : 'center',
					deferredRender : false,
					layoutOnTabChange : true,
					frame : false,
					border : false,
					layout : 'fit',
					items : myUserAsset,
					border : false
				})
		return panel;
	}

	function handlClickChange(selectedTreeNode) {
		centerPanel.removeAll();
		if (selectedTreeNode.id == 'myUsedApplyNode') {
			var myUsedApplyPanel = new Apex.ssd.MyAssetApplyGrid();
			centerPanel.add(myUsedApplyPanel);
			centerPanel.doLayout();
		} else if (selectedTreeNode.id == 'myBorrowedApplyNode') {
			var myBorrowedApplyPanel = new Apex.ssd.MyAssetBorrowGrid();
			centerPanel.add(myBorrowedApplyPanel);
			centerPanel.doLayout();
		} else if (selectedTreeNode.id == 'createUsedNode') {
			window.location.href="/itsm/asset/assetApply.do?method=enter"

		} else if (selectedTreeNode.id == 'createBorrowNode') {

		}
		
	}

}