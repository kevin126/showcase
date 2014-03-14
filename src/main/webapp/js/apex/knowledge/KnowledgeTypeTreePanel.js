Ext.namespace('Apex.maintenance.knowledge');
Apex.maintenance.knowledge.KnowledgeTypeTreePanel = function() {
	var root = new Ext.tree.AsyncTreeNode({
			text : '知识库类型',
			id : '0',
			hasChildren : true,
			expanded : true
		});
		var treeLoader = new Ext.ux.DWRTreeLoader({
			dwrCall : KnowledgeService.getKnowledgeTypeTree
			});
		var panel = new Ext.tree.TreePanel({
			loader : treeLoader,
			autoScroll : true,
			lines : true,
			frame : false,
			width : 240,
			height : 340,
			root : root
		});
		panel.expandAll();
		return panel;
}