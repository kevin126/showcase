ContractMainPanel = function() {
	this.id = '-1';
	var asyncRoot = new Ext.tree.AsyncTreeNode({
				expanded : true,
				children : [{
							id : 'contractsView',
							text : '合同列表',
							leaf : true
						}, {
							id : 'addContract',
							text : '添加合同',
							leaf : true
						}, {
							id : 'searchContract',
							text : '合同查询',
							leaf : true
						}]
			});

	var tree = new Ext.tree.TreePanel({
				region : 'west',
				root : asyncRoot,
				width : 200,
				loadMask : {
					msg : 'Loading Tree...'
				},
				split : true,// 可拖动
				rootVisible : false,
				margins : '5 0 1 5',
				title : '功能列表',
				collapsible : true
			});
	tree.on("click", fn);

	function fn(node, event) {
		var bool = rightTabPanel.findById(node.id);
		if (bool == null || bool == "undefined") {
			rightTabPanel.removeAll(true);
			if (node.id == 'contractsView') {
				tree.expandAll();
				var supplierViewPanel = new Apex.asset.ContractViewPanel();
				rightTabPanel.add(supplierViewPanel.getPanel());
				rightTabPanel.doLayout(true);
				return false;
			} else if (node.id == 'addContract') {
				tree.expandAll();
				// 设置超链接
				location.href = '/itsm/asset/contractMgt.do?menuId=m5_4&method=addContract';
				return false;
			} else if (node.id == 'searchContract') {
				tree.expandAll();
				var panel = new ContractQueryPanel();
				rightTabPanel.add(panel);
				rightTabPanel.doLayout(true);
				return false;
			}
			rightTabPanel.doLayout(true);
		}
	}
	/** **************************grid************************* */

	var entity = new Apex.asset.ContractViewPanel();// new
	var initPanel = entity.getPanel();
	var rightTabPanel = new Ext.Panel({
				region : 'center',
				layout : 'fit',
				items : [initPanel],
				margins : '5 5 0 0'
			});
	this.panel = new Ext.Panel({
				layout : 'border',
				border : false,
				closable : true,
				items : [tree, rightTabPanel]
			});
	return this.panel;
}

Ext.onReady(function() {
			var panel = new ContractMainPanel();
			var innerWidth;
			if (window.innerWidth) {
				innerWidth = window.innerWidth;
			} else {
				innerWidth = document.body.clientWidth;
			}
			var innerHeight;
			if (window.innerHeight) {
				innerHeight = window.innerHeight;
			} else {
				innerHeight = document.body.clientHeight;
			}
			var mainPanel = new Ext.Panel({
						autoScroll : false,
						width : innerWidth,
						height : innerHeight - 218,
						frame : false,
						border : false,
						layout : 'fit',
						renderTo :'contractManager',
						items : panel
					});
		});