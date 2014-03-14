Ext.namespace('Apex.security');
Apex.security.ShowDepartUsersPanel = function(cfg) {
	cfg = cfg || {};
	Ext.apply(this, cfg);

	var reader = new Ext.data.JsonReader({
				id : "id",
				fields : [{
							name : 'id',
							mapping : 'id',
							type : 'int'
						}, {
							name : 'name',
							mapping : 'name',
							type : 'string'
						}, {
							name : 'mail',
							mapping : 'mail',
							type : 'string'
						}, {
							name : 'mobile',
							mapping : 'mobile',
							type : 'string'
						}, {
							name : 'office',// 办公电话不知道是不是这个
							mapping : 'office',
							type : 'string'
						}]
			});

	var Store = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : SecurityService.getUsersByDepartment,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [cfg.deptId];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});
	Store.setDefaultSort('id', 'asc');
	// var checkboxSelect = new Ext.grid.CheckboxSelectionModel();
	var userGridPanel = new Ext.grid.GridPanel({

				columns : [new Ext.grid.RowNumberer(), {
							header : "序号",
							width : 50,
							hidden : true,
							dataIndex : 'id'
						}, {
							header : "姓名",
							width : 120,
							dataIndex : 'name'
						}, {
							header : "邮箱地址",
							width : 160,
							dataIndex : 'mail'
						}, {
							header : "手机号码",
							width : 140,
							dataIndex : 'mobile'
						}, {
							header : "办公电话",
							width : 140,
							dataIndex : 'office'
						}],
				store : Store,
				stripeRows : true,
				autoExpandColumn : 5,
				border : false,
				enableHdMenu : false,
				width : 625,
				height : 300
			});
	Store.load();
	var prompt = new Ext.Window({
		title : "部门成员列表",
		width : 660,
		height : 400,
		resizable : false,
		modal : true,
		border : false,
		plain : true,
		layout : 'fit',
		items : userGridPanel,
		buttons : [{
					text : '关闭',
					handler : cancelEvent
				}]
			// ,
			// buttonAlign : 'center'
		});
	// function deleteEvent(){
	// alert("TBD");
	// }
	function cancelEvent() {
		prompt.destroy();
	}
	return prompt;
}