Ext.namespace('Apex.security');
/**
 * 角色查看
 * 
 * @param {}
 *            cfg
 * @return {}
 */
Apex.security.RoleViewPanel = function(cfg) {
	cfg = cfg || {};
	Ext.apply(this, cfg);
	var reader = new Ext.data.JsonReader({
				totalProperty : "totalCount",
				root : "dataList",
				id : "id",
				fields : [{
							name : 'id'
						}, {
							name : 'roleName'
						}, {
							name : 'roleDescription'
						}]
			});
	var store = new Ext.data.Store({

				storeId : 'Apex.security.RoleViewPanel_store_id',
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : SecurityService.getAllRoleByPaging,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [params.start, params.limit];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});
	store.setDefaultSort('id', 'asc');
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();// table中显示checkbox
	var columns = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
			checkboxSelect, {
				header : "角色名",
				sortable : true,
				dataIndex : 'roleName',
				renderer : function(data, ele, config) {
					return '<a href=# onclick="var prompt = new Apex.security.RoleModifyPanel({roleId : \''
							+ config.data.id
							+ '\'}); prompt.show();">'
							+ data
							+ '</a>';
				}
			}, {
				header : "角色描述",
				sortable : true,
				dataIndex : 'roleDescription'
			}]);
	var button_delete = new Ext.Button({
				text : '删除',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				minWidth : 80
			});
	var add_role = new Ext.Button({
				text : '添加角色',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.ADD_BUTTON_PNG,
				minWidth : 80,
				handler : function() {
					var prompt = new Apex.security.RoleCreatePanel({},
							function() {
								store.reload();
							});
					prompt.show();
				}
			});
	button_delete.setDisabled(true);
	var pagingBar = new Ext.PagingToolbar({
				pageSize : ApexConstants.PAGE_SIZE,
				store : store,
				displayInfo : true,
				displayMsg : '显示记录 {0} - {1} 共 {2} 条记录',
				emptyMsg : "无记录"
			});
	var netGrid = new Ext.grid.GridPanel({
				region : "center",
				width : 500,
				border : false,
				autoExpandColumn : 3,
				store : store,
				enableHdMenu : false,
				tbar : [add_role, {
							xtype : 'tbseparator'
						}, button_delete],
				bbar : pagingBar,
				cm : columns,
				sm : checkboxSelect
			});
	var myMask = new Ext.LoadMask(Ext.getBody(), {
				msg : "数据加载中，请稍后..."
			});
	myMask.show();
	store.load({
				params : {
					start : 0,
					limit : ApexConstants.PAGE_SIZE
				},
				callback : function() {
					myMask.hide();
				},
				errorHandler : function(errorString, exception) {
					myMask.hide();
					Ext.MessageBox.show({
								title : '错误',
								msg : exception.message,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
	button_delete.on("click", function() {
		Ext.Msg.confirm("确认", "您确定要删除该角色吗？", function(button) {
			if (button == 'yes') {
				var selectRows = netGrid.getSelectionModel().getSelections();
				if (selectRows) {
					var list = [];
					for (var i = 0; i < selectRows.length; i++) {
						list.push(selectRows[i].get('roleName'));
					}
					var myMask = new Ext.LoadMask(
							'Apex.security.UserManageMainPanel', {
								msg : "数据处理中，请稍后..."
							});
					myMask.show();
					SecurityService.deleteRoles(list, {
								callback : function() {
									store.reload();
									myMask.hide();
								},
								errorHandler : function(errorString, exception) {
									myMask.hide();
									Ext.MessageBox.show({
												title : '错误',
												msg : exception.message,
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								}
							});
					Ext.StoreMgr.lookup('Apex.security.RoleViewPanel_store_id')
							.reload();
				}
			}
		});
	});
	var panel = new Ext.Panel({
				id : 'viewrole',
				layout : "border",
				border : false,
				items : [netGrid]
			});
	netGrid.on('rowclick', function(grid, rowIndex, e) {
				var selectios = grid.getSelectionModel().getSelections().length;
				if (selectios < 1) {
					button_delete.disable();
				} else {
					button_delete.enable();
				}
			});

	checkboxSelect.on('selectionchange', function(selModel) {
				var selectios = netGrid.getSelectionModel().getSelections().length;
				if (selectios < 1) {
					button_delete.disable();
				} else {
					button_delete.enable();
				}
			});
	// 公共空间
	return panel;
}