Ext.namespace('Apex.asset');
Apex.asset.AssetApplyAndBorrowPanel = function() {
	var treePanel = createTreePanel();
	var centerPanel = createCenterPanel();
	this.getPanel = function() {
		var mainPanel = new Ext.Panel({
					id : 'assetApplyAndBorrowMainPanel',
					layout : 'border',
					border : false,
					items : [treePanel, centerPanel]
				})
		return mainPanel;
	}

	function createTreePanel() {
		var root = new Ext.tree.TreeNode({
					text : '领用借用管理',
					id : 'AssetApplyAndBorrowPanel_rootNode',
					hasChildren : true,
					expanded : true
				});
		var myUsedAssetNode = new Ext.tree.TreeNode({
					text : '我使用的资产',
					id : 'myUsedAssetNode',
					leaf : true
				});
		var myBorrowedAssetNode = new Ext.tree.TreeNode({
					text : '我借用的资产',
					id : 'myBorrowedAssetNode',
					leaf : true
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
		var usedApplyGridNode = new Ext.tree.TreeNode({
					text : '领用申请列表',
					id : 'usedApplyGridNode',
					leaf : true
				});
		var approvedUsedApplyGridNode = new Ext.tree.TreeNode({
					text : '已批准的领用申请',
					id : 'approvedUsedApplyGridNode',
					leaf : true
				});
		var borrowedApplyGridNode = new Ext.tree.TreeNode({
					text : '借用申请列表',
					id : 'borrowedApplyGridNode',
					leaf : true
				});
		var unReturnBorrowedApplyGridNode = new Ext.tree.TreeNode({
					text : '逾期未归还的资产',
					id : 'unReturnBorrowedApplyGridNode',
					leaf : true
				});
		root.appendChild(myUsedAssetNode);
		root.appendChild(myBorrowedAssetNode);
		root.appendChild(myUsedApplyNode);
		root.appendChild(myBorrowedApplyNode);
		root.appendChild(usedApplyGridNode);
		root.appendChild(approvedUsedApplyGridNode);
		root.appendChild(borrowedApplyGridNode);
		root.appendChild(unReturnBorrowedApplyGridNode);
		var treePanel = new Ext.tree.TreePanel({
					id : 'assetApplyAndBorrowTreePanel',
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
		myUsedAssetNode.select();
		return treePanel;
	}

	function createCenterPanel() {
		var myUserAsset = new Apex.asset.MyUsedAsset();
		var panel = new Ext.Panel({
					id : 'assetApplyAndBorrowCenterPanel',
					region : 'center',
					deferredRender : false,
					layoutOnTabChange : true,
					frame : false,
					border : false,
					layout : 'fit',
					items : myUserAsset.getPanel(),
					border : false
				})
		return panel;
	}

	function handlClickChange(selectedTreeNode) {
		centerPanel.removeAll();
		if (selectedTreeNode.id == 'myUsedAssetNode') {
			var myUsedAssetPanel = new Apex.asset.MyUsedAsset();
			centerPanel.add(myUsedAssetPanel.getPanel());
		} else if (selectedTreeNode.id == 'myBorrowedAssetNode') {
			var myBorrowedAssetPanel = new Apex.asset.MyBorrowedAsset();
			centerPanel.add(myBorrowedAssetPanel);
		} else if (selectedTreeNode.id == 'myUsedApplyNode') {
			var myUsedApplyPanel = new Apex.asset.MyApplyAsset();
			centerPanel.add(myUsedApplyPanel);
		} else if (selectedTreeNode.id == 'myBorrowedApplyNode') {
			var myBorrowedApplyPanel = new Apex.asset.MyAssetBorrowGrid();
			centerPanel.add(myBorrowedApplyPanel);
		} else if (selectedTreeNode.id == 'usedApplyGridNode') {
			var usedApplyGridPanel = new Apex.asset.AssetApplyGrid();
			centerPanel.add(usedApplyGridPanel);
		} else if (selectedTreeNode.id == 'approvedUsedApplyGridNode') {
			var approvedUsedApplyGridPanel = new Apex.asset.ApprovalApplyGrid();
			centerPanel.add(approvedUsedApplyGridPanel);
		} else if (selectedTreeNode.id == 'borrowedApplyGridNode') {
			var borrowedApplyGridPanel = new Apex.asset.AssetBorrowGrid();
			centerPanel.add(borrowedApplyGridPanel);
		} else if (selectedTreeNode.id == 'unReturnBorrowedApplyGridNode') {
			var unReturnBorrowedApplyGridPanel = new Apex.asset.AssetLateReturn();
			centerPanel.add(unReturnBorrowedApplyGridPanel);
		}
		centerPanel.doLayout();
	}

}