Ext.namespace('Apex.desk.usermgmt');
Apex.desk.usermgmt.DepartmentTreePanel = function() {
	var root = new Ext.tree.AsyncTreeNode({
		id : "-1",
		hasChildren : true,
		expanded : true
	});
	var treeLoader = new Ext.ux.DWRTreeLoader({
		dwrCall : SecurityService.getDeptTree
	});
	var panel = new Ext.tree.TreePanel({
		title : '按部门分类',
		rootVisible : false,
		collapsible : true,
		loader : treeLoader,
		loadMask : {
			msg : 'Loading Tree...'
		},
		region : 'west',
		margins : '5 0 5 5',
		autoScroll : true,
		split : true,
		lines : true,
		frame : false,
		width : 200,
		root : root
	});
//	panel.expandAll();
	return panel;
}