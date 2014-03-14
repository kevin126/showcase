Ext.namespace('Apex.security');
/**
 * 用户管理主函数
 * 
 * @param {}
 *            cfg
 * @return {}
 */
Apex.security.UserManageMainPanel = function(cfg) {
	cfg = cfg || {};
	this.id = '-1';
	this.panelName = '用户管理';
	Ext.apply(this, cfg);
	var asyncRoot = new Ext.tree.AsyncTreeNode({
				expanded : true,
				children : [{
							id : 'accountManage',
							text : '用户管理',
							expanded : true,
							children : [
									{
								id : 'mantenanceuser',
								text : '运维人员',
								leaf : true
							},	{
								id : 'commonuser',
								text : '普通用户',
								leaf : true
							}]
						}, {
							id : 'roleManage',
							text : '角色管理',
							expanded : true,
							children : [{
										id : 'viewrole',
										text : '角色列表',
										leaf : true
									}]
						}, {
							id : 'deptManage',
							text : '部门管理',
							leaf : true
						}, {
							id : 'workGroupManage',
							text : '工作组管理',
							leaf : true
						}, {
							id : 'addressManage',
							text : '地点管理',
							leaf : true
						}]
			});

	var tree = new Ext.tree.TreePanel({
				region : "west",
				root : asyncRoot,
				width : 200,
				loadMask : {
					msg : 'Loading Tree...'
				},
				split : true,// 可拖动
				rootVisible : false,
				margins : '5 0 5 5',
				title : '功能列表',
				border : false,
				collapsible : true
			});
//	Ext.getCmp('mantenanceuser').select();
	tree.on("click", fn);

	function fn(node, event) {
		var bool = rightTabPanel.findById(node.id);
		if (bool == null || bool == "undefined") {
			rightTabPanel.removeAll(true);
			if (node.id == 'accountManage') {
				tree.expandAll();
				var userViewPanel = new Apex.security.UserViewPanel('operatorUser');
				rightTabPanel.add(userViewPanel);
				rightTabPanel.doLayout(true);
				return false;
			} else if (node.id == 'roleManage') {
				tree.expandAll();
				var createrole = node.findChild('id', 'viewrole');
				tree.getSelectionModel().select(createrole);
				var viewrolePanel = new Apex.security.RoleViewPanel({});
				rightTabPanel.add(viewrolePanel);
				rightTabPanel.doLayout(true);
				return false;
			} else if (node.id == 'mantenanceuser') {
				var userViewPanel = new Apex.security.UserViewPanel('operatorUser');
				rightTabPanel.add(userViewPanel);
			}  else if (node.id == 'commonuser') {
				var userViewPanel = new Apex.security.UserViewPanel('commonUser');
				rightTabPanel.add(userViewPanel);
				
			} else if (node.id == 'onlineuser') {
				var onlineUserPanel = new Apex.security.UserOnLinePanel({});
				rightTabPanel.add(onlineUserPanel);
			} else if (node.id == 'viewrole') {
				rightTabPanel.add(new Apex.security.RoleViewPanel({}));
			} else if (node.id == 'deptManage') {
				var panel = new Apex.security.DeptManageMainPanel({
							id : node.id,
							border:false,
							panelName : '部门管理'
						});
				rightTabPanel.add(panel);
				rightTabPanel.doLayout(true);
			} else if (node.id == 'workGroupManage') {
				var panel = new Apex.security.WorkGroupManageMainPanel({
							id : node.id,
							border:false,
							panelName : '工作组管理'
						})
				rightTabPanel.add(panel);
				rightTabPanel.doLayout(true);
			} else if(node.id == 'addressManage'){
				var panel = new Apex.security.AddressManageMainPanel()
				rightTabPanel.add(panel.getPanel());
			}
			rightTabPanel.doLayout(true);
		}
	}

	/** **************************grid************************* */

	var initPanel;
	if(document.getElementById("flag") && document.getElementById("flag").innerHTML == 1){
		initPanel = new Apex.security.AddressManageMainPanel().getPanel();
	}else{
		initPanel = new Apex.security.UserViewPanel('mainBodyDiv');// new
	}
	var rightTabPanel = new Ext.Panel({
				id : "rightTabPanel",
				region : 'center',
				layout : "fit",
				border:false,
				items : [initPanel],
				margins : '5 5 5 0'
			});
	this.panel = new Ext.Panel({
				id : 'Apex.security.UserManageMainPanel',
				name : this.panelName,
				layout : "border",
				border:false,
				items : [tree, rightTabPanel]
			});
}