Ext.namespace('Apex.configuration')
Apex.configuration.selectedImageTree = function() {
	var treeRoot = new Ext.tree.AsyncTreeNode({
				text : 'CMDB图片列表',
				id : '0',
				hasChildren : true,
				expanded : true
			});
	var treeLoader = new Ext.ux.DWRTreeLoader({
				dwrCall : ConfigurationService.getCiTypeImageTree
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