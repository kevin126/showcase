SupplerMainPanel = function() {
	this.id = '-1';
	var asyncRoot = new Ext.tree.AsyncTreeNode({
				expanded : true,
				children : [{
							id : 'suppliersView',
							text : '供应商列表',
							leaf : true
						}, {
							id : 'addSuppler',
							text : '添加供应商',
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
				split : true,
				rootVisible : false,
				margins : '5 0 5 5',
				title : '操作列表',
				collapsible : true
			});
	tree.on("click", fn);

	function fn(node, event) {
		var bool = rightTabPanel.findById(node.id);
		if (bool == null || bool == "undefined") {
			rightTabPanel.removeAll(true);
			if (node.id == 'suppliersView') {
				tree.expandAll();
				var supplierViewPanel = new Apex.asset.SupplierViewPanel();
				rightTabPanel.add(supplierViewPanel.getPanel());
				rightTabPanel.doLayout(true);
				return false;
			} else if (node.id == 'addSuppler') {
				location.href = '/itsm/asset/supplierMgt.do?menuId=m5_3&method=firstAdd';
			}
		}
	}
	/** **************************grid************************* */

	var entity = new Apex.asset.SupplierViewPanel();// new
	var initPanel = entity.getPanel();
	var rightTabPanel = new Ext.Panel({
				region : 'center',
				layout : 'fit',
				items : [initPanel],
				margins : '5 5 5 0'
			});
	this.panel = new Ext.Panel({
				layout : 'border',
				border : false,
				items : [tree, rightTabPanel]
			});
	return this.panel;
}

Ext.onReady(function() {
			var panel = new SupplerMainPanel();
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
						renderTo :'content_SupplierMgt',
						items : panel
					});
		});