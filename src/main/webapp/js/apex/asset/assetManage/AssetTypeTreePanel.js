Ext.namespace('Apex.asset')
Apex.asset.AssetTypeTreePanel = function() {
	var treeRoot = new Ext.tree.AsyncTreeNode({
				text : '资产类型',
				id : '0',
				hasChildren : true,
				expanded : true
			});
	var treeLoader = new Ext.ux.DWRTreeLoader({
				dwrCall : AssetService.getAssetTypeTreeAll
			});
	var panel = new Ext.tree.TreePanel({
				loader : treeLoader,
				autoScroll : true,
				lines : true,
				frame : false,
				width : 240,
				height : 340,
				root : treeRoot
			});
	panel.expandAll();
	return panel;
}