AllUserWindows = function(roleId, Store) {
	this.roleId = roleId;
	this.Store = Store;
	var newWidow;
	var typeTree;

	var root = new Ext.tree.AsyncTreeNode({
				text : '所有用户',
				checked : false,
				disabled : false,
				id : roleId + "roleId",// 不然点到相同id的用户会在加载的用户的
				expanded : true
			});
	// var paramArray = new Array();
	// paramArray.push(roleId);
	var panel = new Ext.tree.TreePanel({
				loader : new Ext.ux.DWRTreeLoader({
					// loadParams : paramArray,
					dwrCall : SecurityService.getAllUserTree
						// ,
					}),
				autoScroll : true,
				lines : true,
				height : 350,
				root : root
			});

	panel.on('checkchange', selectChildNodes, panel);
	panel.expandAll();
	function selectChildNodes(node, checked) {
		node.expand();
		node.attributes.checked = checked;
		node.eachChild(function(child) {
					child.ui.toggleCheck(checked);
					child.attributes.checked = checked;
					child.fireEvent('checkchange', child, checked);
				});
	}

	newWidow = new Ext.Window({
				title : '添加用户到角色',
				closable : true,
				width : 300,
				border : false,
				plain : true,
				resizable : false,
				modal : true,
				items : [panel],
				buttons : [{
							text : '确定',
							handler : sureEvent
						}, {
							text : '取消',
							handler : cancelEvent
						}],
				buttonAlign : 'center'
			});
	var selectNodeIds = new Array();
	function sureEvent() {
		var selectedNodes = panel.getChecked();
		// 包含普通用户则设为true
		var flag = false;
		for (var i = 0; i < selectedNodes.length; i++) {
			var node = selectedNodes[i];
			selectNodeIds[i] = node.attributes.id;
			if (node.attributes.icon == "/itsm/images/icons/commonuser.png") {
				flag = true;
			}
		}
		/**
		 * 硬编码
		 */
		// 用户不能同时具有普通用户角色和其他角色，顾提示操作是否进行
		if (roleId == 16) {
			addUsersEvent();
			/**
			 * 硬编码
			 */
		} else if (roleId == 15) {
			Ext.Msg.confirm("确认", "该步操作将导致用户失去已经具有的角色，操作是否继续？",
					function(button) {
						if (button == 'yes') {
							addUsersEvent();
						} else {
							return;
						}
					});
		} else {
			if (flag) {
				Ext.Msg.confirm("确认", "所选用户含有普通用户角色，该步操作将导致用户失去这一角色，操作是否继续？",
						function(button) {
							if (button == 'yes') {
								flag = false;
								addUsersEvent();
							} else {
								flag = false;
								return;
							}
						});
			} else {
				addUsersEvent();
			}
		}

	}
	function addUsersEvent() {

		SecurityService.moveUserToTheRole(selectNodeIds, roleId, {
					callback : function() {
						Store.load();
						newWidow.close();
					},
					errorHandler : function(errorString, exception) {
						Ext.MessageBox.show({
									title : '错误',
									msg : exception.message,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	}
	function cancelEvent() {
		newWidow.close();
	}
	return newWidow;
}