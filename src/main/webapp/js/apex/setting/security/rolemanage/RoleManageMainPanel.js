Ext.namespace('Apex.security');
/**
 * 角色管理主函数
 * @param {}
 *            cfg
 * @return {}
 */
Apex.security.RoleManageMainPanel = function(cfg) {
	cfg = cfg || {};
	this.id = '-1';
	this.panelName = '角色管理';
	Ext.apply(this, cfg);
	var asyncRoot = new Ext.tree.AsyncTreeNode({
				expanded : true,
				children : [{
							id : 'createrole',
							text : '创建角色',
							leaf : true
						}, {
							id : 'viewrole',
							text : '角色列表',
							leaf : true
						}]
			});

	var tree = new Ext.tree.TreePanel({
		region : "west",
		root : asyncRoot,
		width : 220,
		loadMask : {
			msg : 'Loading Tree...'
		},
		split : true,// 可拖动
		rootVisible : false,
		margins : '5 0 5 5',
		// autoScroll : true,
		title : '功能列表',
		collapsible : true// 是否可以展开收起
			// enableColumnMove : false
		});
	tree.on("click", fn);

	function fn(node, event) {
		var bool = rightTabPanel.getItem(node.id);
		if (bool == null || bool == "undefined") {
			rightTabPanel.removeAll(true);
			if (node.id == 'createrole') {
		
				rightTabPanel.add(new Apex.security.RoleCreatePanel({}));
			} else if (node.id == 'viewrole') {
				rightTabPanel.add(new Apex.security.RoleViewPanel({}));
			}
			rightTabPanel.setActiveTab(node.id);
			rightTabPanel.doLayout(true);
		}
	}

	/** **************************grid************************* */

	var initPanel = new Ext.Panel({
		id : 'initPanel',
		frame : true,
		border : false,
		height : 700,
		width : 700,
		title : '功能说明',
		html : '<table width="100%" height="100%" background="#0072BC"><tr><td width="35%"><img alt="" src="images/icons/help_info.png"/></td><td width="5%"></td><td width="60%"><img alt="" src="images/icons/tips-32.png"/><b><font color="#0072BC">功能说明：</font><br><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<li>单击左侧树菜单进入对应的用户管理页面。</td></tr></table>'
	});
	var rightTabPanel = new Ext.TabPanel({
				id : "roleRightTabPanel",
				title : 'Test',
				region : 'center',
				deferredRender : false,
				activeTab : 0,
				items : [initPanel],
				enableTabScroll : true,// tab页可以左右滚动
				margins : '5 5 5 0'
			});
	this.panel = new Ext.Panel({
				id : this.id,
				name : this.panelName,
				layout : "border",
				closable : true,
				width : 1000,
				height : 600,
				items : [tree, rightTabPanel]
			});
}