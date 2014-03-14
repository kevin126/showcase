Ext.namespace('Apex.asset');
Apex.asset.SupplierViewPanel = function(id) {
	this.id = id;
	var panel;
	var edit_supplier = new Ext.Button({
				text : '编辑',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.ADD_BUTTON_PNG,
				minWidth : 80
			});
	edit_supplier.setDisabled(true);
	var button_delete = new Ext.Button({
		text : '删除',
		cls : 'x-btn-text-icon',
		icon : ResourceConstants.DELETE_BUTTON_PNG,
		handler : function() {

			Ext.Msg.confirm("确认", "您确定要删除所选供应商吗？", function(button) {
				if (button == 'yes') {
					var selectRows = supplierGrid.getSelectionModel()
							.getSelections();
					if (selectRows) {
						var list = [];
						for (var i = 0; i < selectRows.length; i++) {
							list.push(selectRows[i].get('id'));
						}
						var myMask = new Ext.LoadMask(Ext.getBody(), {
									msg : "数据处理中，请稍后..."
								});
						myMask.show();
						AssetService.checkSupplierExist(list, function(
								returnValue) {
							if (!returnValue) {
								Ext.Msg.show({
											title : '错误',
											msg : '对不起，该供应商已被别人删除，请联系管理员！',
											modal : true,
											buttons : Ext.Msg.OK,
											icon : Ext.Msg.ERROR
										})
								store.load({
											params : {
												start : 0,
												limit : ApexConstants.PAGE_SIZE
											}
										});
								myMask.hide();
							} else {
								AssetService.deleteSupplers(list, {
									callback : function() {
										store.reload();
										myMask.hide();
									},
									errorHandler : function(errorString,
											exception) {
										myMask.hide();
										Ext.MessageBox.show({
													title : '错误',
													msg : '删除失败，删除的记录中可能存在与资产或合同有关联！',
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
									}
								});
							}
						})

					}
				}
			});

		},
		minWidth : 80
	});
	button_delete.setDisabled(true);
	var reader = new Ext.data.JsonReader({
				totalProperty : "totalCount",
				root : "dataList",
				id : "id",
				fields : [{
							name : 'id'
						}, {
							name : 'name'
						},
						// {
						// name : 'memo'
						// },
						{
							name : 'contact'
						},
						// {
						// name : 'address'
						// }, {
						// name : 'email'
						// }, {
						// name : 'post'
						// },
						{
							name : 'phone'
						}, {
							name : 'fax'
						}
				// , {
				// name : 'site'
				// }
				]
			});
	var store = new Ext.data.Store({
				storeId : 'SupplierViewPanel_store_id',
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : AssetService.getAllSupplierByPaging,
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
				header : "id",
				sortable : true,
				hidden : true,
				dataIndex : 'id'
			}, {
				header : "名称",
				sortable : true,
				dataIndex : 'name',
				renderer : function(data, element, config) {
					return '<a href="/itsm/asset/supplierMgt.do?method=viewSuppler&supplierId='
							+ config.data.id
							+ '&menuId=m5_3"'
							+ '">'
							+ data
							+ '</a>';
				}
			}, {
				header : "联系人",
				sortable : true,
				dataIndex : 'contact'
			},
			{
				header : "传真",
				sortable : true,
				dataIndex : 'fax',
				align : 'center'
			}, {
				header : "电话",
				sortable : true,
				dataIndex : 'phone',
				align : 'center'
			}
	]);

	var pagingBar = new Ext.PagingToolbar({
				pageSize : ApexConstants.PAGE_SIZE,
				store : store,
				displayInfo : true,
				displayMsg : '显示记录 {0} - {1} 共 {2} 条记录',
				emptyMsg : "无记录"
			});
	var supplierGrid = new Ext.grid.GridPanel({

				width : 1280,
				height : 700,
				store : store,
				border : false,
				autoExpandColumn : 3,
				loadMask : '正在加载数据，请稍候...',
				enableHdMenu : false,
				tbar : [edit_supplier, '-', button_delete],
				bbar : pagingBar,
				cm : columns,
				sm : checkboxSelect
			});
	store.load({
				params : {
					start : 0,
					limit : ApexConstants.PAGE_SIZE
				}
			});
	checkboxSelect.on('selectionchange', function(selModel) {

		var selectios = supplierGrid.getSelectionModel().getSelections().length;
		if (selectios < 1) {
			edit_supplier.setDisabled(true);
			button_delete.setDisabled(true);
		} else {
			if (selectios == 1) {
				edit_supplier.setDisabled(false);
			} else {
				edit_supplier.setDisabled(true);
			}
			button_delete.setDisabled(false);
		}
	});
	edit_supplier.on('click', clickEvent);
	function clickEvent() {
		var selectRow = supplierGrid.getSelectionModel().getSelections();
		var id = selectRow[0].get('id');
		location.href = '/itsm/asset/supplierMgt.do?method=modifySuppler&supplierId=' + id
				+ '+&menuId=m5_3';
	}
	panel = new Ext.Panel({
		id : 'suppliersViewPanel_id',
		border : false,
		layout : 'fit',
		region : "center",
		items : supplierGrid
			// ,
			// renderTo : 'content_SupplierMgt'
		});
	this.getPanel = function() {
		return panel;
	}
}