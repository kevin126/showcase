IncidentPool = function() {
	// 事件工单类型树
	var treeRoot = new Ext.tree.AsyncTreeNode({
				text : '事件类型',
				id : -1,
				hasChildren : true,
				devNodeType : 'root',
				expanded : true
			});

	var treeLoader = new Ext.ux.DWRTreeLoader({
				preloadChildren : true,
				dwrCall : IncidentService.gatAllIncidentType,
				waitMessage : new Ext.LoadMask(Ext.getBody(), {
							msg : "正在读取数据，请稍等..."
						})
			});
	var panel = new Ext.tree.TreePanel({
				title : '事件类型',
				loader : treeLoader,
				collapsible : true,
				rootVisible : false,
				autoScroll : true,
				margins : '5 0 0 5',
				frame : false,
				border:false,
				split : true,
				region : 'west',
				width : 200,
				root : treeRoot
			});
//	panel.expandAll();

	panel.on("click", fn);

	/** **************************grid************************* */
	var entity = new Apex.Task.TaskPool.Panel();// new
	var initPanel = entity.createPanel();
	var rightTabPanel = new Ext.Panel({
				region : 'center',
				border : false,
				margins : '5 0 0 0',
				layout : 'fit',
				items : [initPanel]
			});

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

	var finalPanel = new Ext.Panel({
				layout : 'border',
				width: innerWidth -3,
				height: innerHeight - 218,
				renderTo : 'mainBodyDiv',
				border : false,
				items : [panel, rightTabPanel]
			});
	return finalPanel;

	function fn(node, event) {
		// 这里需要传事件类型的id到taskpool中 如果是根节点就返回
		if (node.id != -1) {
//			panel.expandAll();
			// 参数为事件类型
			entity.LoadStoreByType(node.text);
		} else {
			entity.LoadStoreByType('all');
		}
	}
}

Ext.onReady(function() {
			SecurityService.getUserVoByUserName(null, {
						callback : function(user) {
							USER = new Apex.security.User({
										userName : user.userName,
										loginTime : user.loginTime,
										role : user.roleNames,
										permission : user.actionIds
									});

							var panel = new IncidentPool();
						}
					});
		});