Ext.namespace('Apex.security');
/**
 * 在线用户查看
 * 
 * @param {}
 *            cfg
 * @return {}
 */
Apex.security.UserOnLinePanel = function() {
	var reader = new Ext.data.JsonReader({
				id : "sessionId",
				fields : [{
							name : 'sessionId'
						}, {
							name : 'userName'
						}, {
							name : 'ipAddress'
						}, {
							name : 'loginTimeStr'
						}]
			});
	var store = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : SecurityService.viewOnlineUsers
						}),
				reader : reader
			});
	store.setDefaultSort('loginTimeStr', 'asc');
	var columns = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : "用户名",
				sortable : true,
				dataIndex : 'userName',
				align : 'center'
			}, {
				header : "登录IP",
				sortable : true,
				dataIndex : 'ipAddress',
				align : 'center'
			}, {
				header : "最后登录时间",
				sortable : true,
				dataIndex : 'loginTimeStr',
				align : 'center'
			}]);
	var netGrid1 = new Ext.grid.GridPanel({
				region : "center",
				width : 500,
				autoExpandColumn : 3,
				store : store,
				enableHdMenu : false,
				cm : columns,
				border : false
//				bbar : [{},'当前共有0个用户在线']
			});
	store.load();
	var panel = new Ext.Panel({
				id : 'onlineuser',
				layout : "border",
				border : false,
				items : [netGrid1]
			});
	return panel;
}