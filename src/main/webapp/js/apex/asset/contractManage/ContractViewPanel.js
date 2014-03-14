Ext.namespace('Apex.asset');
Apex.asset.ContractViewPanel = function(id) {
	this.id = id;

	var edit_contract = new Ext.Button({
				text : '编辑',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.ADD_BUTTON_PNG,
				minWidth : 80
			});
	edit_contract.setDisabled(true);
	var button_delete = new Ext.Button({
				text : '删除',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				handler : deleteContractEvent,
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
							name : 'sysCode'
						}, {
							name : 'name'
						}, {
							name : 'code'
						}, {
							name : 'memo'
						}, {
							name : 'createManName'
						}, {
							name : 'createContractTime'
						}, {
							name : 'supplierName'
						}, {
							name : 'beginTime'
						}, {
							name : 'endTime'
						}]
			});
	var store = new Ext.data.Store({
				storeId : 'ContractViewPanel_store_id',
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : AssetService.getAllContractsByPaging,
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
			 {
				header : "id",
				sortable : true,
				hidden : true,
				dataIndex : 'id'
			}, {
				header : "sysCode",
				sortable : true,
				hidden : true,
				dataIndex : 'sysCode'
			}, {
				header : "名称 ",
				sortable : true,
				dataIndex : 'name',
				renderer : function(data, ele, config) {
					return '<a href="/itsm/asset/contractMgt.do?method=viewContract&contractId='
							+ config.data.id + '&menuId=m5_4">' + data + '</a>';
				}
			}, {
				header : "编号",
				sortable : true,
				dataIndex : 'code'
			}, {
				header : "创建人",
				sortable : true,
				dataIndex : 'createManName',
				align : 'center'
			}, {
				header : "创建时间",
				renderer : dateFormatSimple,
				sortable : true,
				dataIndex : 'createContractTime'
			}, {
				header : "供应商",
				sortable : true,
				dataIndex : 'supplierName',
				align : 'center'
			}, {
				header : "开始日期",
				renderer : dateFormatSimple,
				sortable : true,
				dataIndex : 'beginTime'
			}, {
				header : "结束日期",
				renderer : dateFormatSimple,
				sortable : true,
				dataIndex : 'endTime'
			}]);

	var pagingBar = new Ext.PagingToolbar({
				pageSize : ApexConstants.PAGE_SIZE,
				store : store,
				displayInfo : true,
				displayMsg : '显示记录 {0} - {1} 共 {2} 条记录',
				emptyMsg : "无记录"
			});
	var contractGrid = new Ext.grid.GridPanel({
				layout : 'form',
				border : false,
				margins : '5 5 5 5',
				autoExpandColumn : 4,
				store : store,
				border : false,
				loadMask : '正在加载数据，请稍候...',
				enableHdMenu : false,
//				tbar : [edit_contract],// , '-', button_delete
				bbar : pagingBar,
				cm : columns
			});
	store.load({
				params : {
					start : 0,
					limit : ApexConstants.PAGE_SIZE
				}
			});
	function addContractEvent() {
		var createContract = new Apex.asset.ContractCreateDig();
		createContract.show();
	}
	function deleteContractEvent() {
		var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : "数据处理中，请稍后..."
				});
		Ext.Msg.confirm("确认", "您确定要删除所选合同信息吗？", function(button) {
			if (button == 'yes') {
				var selectRows = contractGrid.getSelectionModel()
						.getSelections();
				// var contractNames = [];
				var contractSysCode = [];
				var contractId = [];
				for (var i = 0; i < selectRows.length; i++) {
					// contractNames.push(selectRows[i].get('name'));
					contractSysCode.push(selectRows[i].get('sysCode'));
					contractId.push(selectRows[i].get('id'));
				}
				AssetService.deleteContracts(contractId, {
					callback : function(returnValue) {
						store.load({
									params : {
										start : 0,
										limit : ApexConstants.PAGE_SIZE
									}
								});
					},
					errorHandler : function(errorString, exception) {
						Ext.MessageBox.show({
									title : Common_I18N.errMsg,
									msg : exception.message,
									buttons : Ext.MessageBox.OK,
									fn : function() {
										store.load({
													params : {
														start : 0,
														limit : ApexConstants.PAGE_SIZE
													}
												});
									},
									icon : Ext.MessageBox.ERROR
								});
					}
				});
			}
		});

	}

	checkboxSelect.on('selectionchange', function(selModel) {
		var selectios = contractGrid.getSelectionModel().getSelections().length;
		if (selectios < 1) {
			edit_contract.setDisabled(true);
			button_delete.setDisabled(true);
		} else {
			if (selectios == 1) {
				edit_contract.setDisabled(false);
			} else {
				edit_contract.setDisabled(true);
			}
			button_delete.setDisabled(false);
		}
	});
	edit_contract.on('click', clickEvent);
	function clickEvent() {
		var selectRow = contractGrid.getSelectionModel().getSelections();
		var contractId = selectRow[0].get('id');
		location.href = '/itsm/asset/contractMgt.do?contractId=' + contractId
				+ '&menuId=m5_4&method=modifyContract';
	}
	var panel = new Ext.Panel({
				id : 'queryuser',
				border : false,
				layout : 'fit',
				margins : '5 5 5 5',
				items : [contractGrid]
			});

	this.getPanel = function() {
		return panel;
	}
}