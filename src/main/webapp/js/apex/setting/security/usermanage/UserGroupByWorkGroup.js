Ext.namespace('Apex.common');
/**
 * 自助式服务台 得到处普通用户之外的所有用户
 */
Apex.common.selfUserGtoupByWorkGroup = function(fieldId, flag) {
	this.fieldId = fieldId;
	this.flag = flag;
	var treePanel = null;
	var newWindow = null;
	this.showUserList = function() {
		treePanel = createTreePanel();
		newWindow = new Ext.Window({
					title : '选择用户',
					closable : true,
					border : false,
					modal : true,
					resizable : false,
					width : 250,
					items : [treePanel],
					buttons : [{
								id : 'confirmSelectUser',
								text : '确定',
								disabled : true,
								handler : confirmSelectUser
							}, {
								text : '取消',
								handler : function() {
									newWindow.close();
								}
							}],
					buttonAlign : 'center'
				});
		newWindow.show();
	}
	// Ext.getCmp('confirmSelectUser').setDisabled(true);
	function createTreePanel() {
		var root = new Ext.tree.AsyncTreeNode({
					text : '所有用户',
					id : '0',
					hasChildren : true,
					expanded : true
				});
		var treeLoader = new Ext.ux.DWRTreeLoader({
					dwrCall : CommonService.getUserListGrooupByWorkGroup
				});
		var panel = new Ext.tree.TreePanel({
					loader : treeLoader,
					split : true,
					collapsible : true,
					rootVisible : true,
					border : false,
					lines : true,
					frame : false,
					width : 240,
					height : 340,
					root : root
				});
		panel.expandAll();
		panel.on('dblclick', handleDbClick);
		panel.on('click', function(selectdeNode) {
					if (selectdeNode.hasChildNodes() || selectdeNode.id == '0')
						Ext.getCmp('confirmSelectUser').setDisabled(true);
					else
						Ext.getCmp('confirmSelectUser').setDisabled(false);
				})
		return panel;
	}

	function handleDbClick() {
		var treeNode = treePanel.getSelectionModel().getSelectedNode();
		if (treeNode.hasChildNodes() || treeNode.id == '0') {
			Ext.getCmp('confirmSelectUser').setDisabled(true);
		} else {
			document.getElementById(fieldId).value = treeNode.text;
			if (flag)
				SecurityService.getUserBaseInfoVo(treeNode.text,
						function(user) {
							if (user.department
									&& document.getElementById("department"))
								document.getElementById("department").value = user.department;
							if (user.mobile && document.getElementById("phone"))
								document.getElementById("phone").value = user.mobile;
							if (user.mail && document.getElementById("email"))
								document.getElementById("email").value = user.mail;
							if (user.employeeNo
									&& document.getElementById("jobNumber"))
								document.getElementById("jobNumber").value = user.employeeNo;
						});
			newWindow.close();
		}
	}

	function confirmSelectUser() {
		var treeNode = treePanel.getSelectionModel().getSelectedNode();
		document.getElementById(fieldId).value = treeNode.text;
		if (flag)
			SecurityService.getUserBaseInfoVo(treeNode.text, function(user) {
				if (user.department && document.getElementById("department"))
					document.getElementById("department").value = user.department;
				if (user.mobile && document.getElementById("phone"))
					document.getElementById("phone").value = user.mobile;
				if (user.mail && document.getElementById("email"))
					document.getElementById("email").value = user.mail;
				if (user.employeeNo && document.getElementById("jobNumber"))
					document.getElementById("jobNumber").value = user.employeeNo;
			});
		newWindow.close();
	}
}