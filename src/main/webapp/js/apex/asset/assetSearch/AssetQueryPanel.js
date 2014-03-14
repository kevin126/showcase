Ext.namespace('Apex.asset')
Apex.asset.AssetQueryPanel = function() {
	// ******************资产查询条件panel***********************

	var selectNode = null;
	var assetContractId = null;
	var assetSupplierId = null;
	var assetTypeId = null;
	var assetsStatusStore = new Ext.data.SimpleStore({
				fields : ['status', 'state'],
				data : [['全部', 'all'], ['库存中', 'status_store'],
						['使用中', 'status_use'], ['借调中', 'status_borrow'],
						['已归还', 'status_reback'], ['维修中', 'status_fix'],
						['报废', 'status_scrap'], ['已批准', 'status_approved']]
			});
	var assetsStatus = new Ext.form.ComboBox({
				fieldLabel : '状态',
				anchor : '90%',
				store : assetsStatusStore,
				triggerAction : 'all',
				baseCls : 'x-plain',
				emptyText : '请选择资产状态...',
				valueField : 'state',
				displayField : 'status',
				mode : 'local',
				readOnly : true,
				value : 'all',
				selectOnFocus : true,
				editable : true
			});

	var contractCode = new Ext.form.TriggerField({
				id : 'contractCode',
				fieldLabel : '合同编号',
				readOnly : true,
				anchor : '90%',
				onTriggerClick : showContractCodeTree
			});
	function showContractCodeTree() {
		var contractCodeTree = new Apex.asset.AssetContractTreePanel();
		var treeWindow = new Ext.Window({
					id : 'contractCode.treeWindow',
					title : '选择合同',
					closable : false,
					border : false,
					plain : true,
					width : 250,
					height : 400,
					resizable : false,
					modal : true,
					items : [contractCodeTree],
					buttons : [{
						id : 'contractCode.yes',
						text : '确定',
						disabled : true,
						handler : function() {
							var treeNode = contractCodeTree.getSelectionModel()
									.getSelectedNode();
							if (treeNode.text == '合同编号') {
								return;
							}
							selectNode = treeNode;
							contractCode.setValue(treeNode.text);
							assetContractId = treeNode.id;
							treeWindow.close();
						}
					}, {
						text : '取消',
						handler : function() {
							treeWindow.close();
						}
					}],
					buttonAlign : 'center'
				});
		contractCodeTree.addListener('click', function(selectNode) {
					if (selectNode.id != '0')
						Ext.getCmp('contractCode.yes').setDisabled(false);
					else
						Ext.getCmp('contractCode.yes').setDisabled(true);
				});
		treeWindow.show();
	}

	var supplierName = new Ext.form.TriggerField({
				id : 'supplierName',
				fieldLabel : '供应商',
				readOnly : true,
				anchor : '90%',
				onTriggerClick : selectSupplierNode
			})
	function selectSupplierNode() {
		var supplierTree = new Apex.asset.AssetSupplierTreePanel();
		var treeWindow = new Ext.Window({
					id : 'supplierName.treeWindow',
					title : '选择供应商',
					closable : false,
					border : false,
					plain : true,
					width : 250,
					height : 400,
					resizable : false,
					modal : true,
					items : [supplierTree],
					buttons : [{
						id : 'supplierName.yes',
						text : '确定',
						disabled : true,
						handler : function() {
							var treeNode = supplierTree.getSelectionModel()
									.getSelectedNode();
							if (treeNode.text == '供应商')
								return;
							selectNode = treeNode;
							supplierName.setValue(treeNode.text);
							assetSupplierId = treeNode.id;
							treeWindow.close();
						}
					}, {
						text : '取消',
						handler : function() {
							treeWindow.close();
						}

					}],
					buttonAlign : 'center'
				})
		supplierTree.addListener('click', function(selectNode) {
					if (selectNode.id != '0')
						Ext.getCmp('supplierName.yes').setDisabled(false);
					else
						Ext.getCmp('supplierName.yes').setDisabled(true);
				})
		treeWindow.show();
	}

	var assetTypeName = new Ext.form.TriggerField({
				id : 'assetTypeName',
				fieldLabel : '资产类型<font color="#FF0000">*</font>',
				allowBlank : false,
				readOnly : true,
				anchor : '90%',
				onTriggerClick : selectAssetTypeNode
			})
	function selectAssetTypeNode() {
		var assetTypeTree = new Apex.asset.AssetTypeTreePanel();
		var treeWindow = new Ext.Window({
					id : 'assetTypeName.treeWindow',
					title : '选择资产类型',
					closable : false,
					resizable : false,
					border : false,
					plain : true,
					width : 250,
					height : 400,
					modal : true,
					items : [assetTypeTree],
					buttons : [{
						id : 'assetTypeName.yes',
						text : '确定',
						disabled : true,
						handler : function() {
							var treeNode = assetTypeTree.getSelectionModel()
									.getSelectedNode();
							if (treeNode.id == '0')
								return;
							selectNode = treeNode;
							assetTypeName.setValue(treeNode.text);
							assetTypeId = treeNode.id;
							treeWindow.close();
						}
					}, {
						text : '取消',
						handler : function() {
							treeWindow.close();
						}
					}],
					buttonAlign : 'center'
				})
		assetTypeTree.addListener('click', function(selectNode) {
					if (selectNode.id != '0')
						Ext.getCmp('assetTypeName.yes').setDisabled(false);
					else
						Ext.getCmp('assetTypeName.yes').setDisabled(true);
				})
		treeWindow.show();

	}

	var startTime = new Ext.ux.form.DateField({
				id : 'beginDate',
				fieldLabel : '购买开始时间',
				dateRange : {
					begin : 'beginDate',
					end : 'endDate'
				},// 用于vtype类型dateRange
				vtype : 'dateRange',
				anchor : '90%'
			});
	var endTime = new Ext.ux.form.DateField({
				id : 'endDate',
				fieldLabel : '购买结束时间',
				dateRange : {
					begin : 'beginDate',
					end : 'endDate'
				},// 用于vtype类型dateRange
				vtype : 'dateRange',
				anchor : '90%'
			});
	var AssetName = new Ext.form.TextField({
				fieldLabel : '资产名称 ',
				vtype : 'SpecialChar',
				anchor : '90%',
				name : 'AssetName',
				minLength : 0,
				maxLength : 255
			});
	var AssetCode = new Ext.form.TextField({
				fieldLabel : '资产编号 ',
				anchor : '90%',
				vtype : 'SpecialChar',
				name : 'AssetNum',
				minLength : 0,
				maxLength : 30
			});
	var queryConditionsPanel = new Ext.form.FormPanel({
				frame : true,
				monitorValid : true,
				region : 'north',
				labelWidth : 70,
				width : 600,
				height : 125,
				layout : 'column',
				items : [{
							columnWidth : .33,
							defaultType : 'textfield',
							layout : 'form',
							labelWidth : 80,
							items : [assetTypeName, AssetCode, AssetName]
						}, {
							columnWidth : .33,
							defaultType : 'textfield',
							layout : 'form',
							labelWidth : 80,
							items : [supplierName, startTime, assetsStatus]
						}, {
							columnWidth : .33,
							defaultType : 'textfield',
							layout : 'form',
							labelWidth : 80,
							items : [contractCode, endTime]
						}],
				buttons : [{
							text : '查询',
							handler : ExactQueryAssets,
							formBind : true
						}, {
							text : '重置',
							handler : function() {
								startTime.setValue('');
								endTime.setValue('');
								AssetName.setValue('');
								AssetCode.setValue('');
								contractCode.setValue('');
								assetContractId = '';
								supplierName.setValue('');
								assetSupplierId = '';
								assetsStatus.setValue('');
								assetTypeName.setValue('');
							},
							formBind : true
						}]
			});
	//

	function ExactQueryAssets() {
		var my_Mask = new Ext.LoadMask(Ext.getBody(), {
					msg : "数据处理中，请稍后..."
				});
		my_Mask.show();
		store.load({
					params : {
						start : 0,
						limit : 20
					},
					callback : function() {
						if (store.getTotalCount() > 0) {
							exportByExcelBtn.setDisabled(false);
							exportByPdfBtn.setDisabled(false);
						} else {
							exportByExcelBtn.setDisabled(true);
							exportByPdfBtn.setDisabled(true);
						};
						my_Mask.hide();
					}
				});
	}

	// ******************资产查询条件 return
	// queryConditionsPanel;***********************

	// ******************资产查询结果panel***********************

	var exportByExcelBtn = new Ext.Button({
				text : '导出为excel',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EXPORT_EXCEL_BUTTON_PNG,
				disabled : true,
				handler : exportByExcel
			})
	var exportByPdfBtn = new Ext.Button({
				text : '导出为pdf',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EXPORT_PDF_BUTTON_PNG,
				disabled : true,
				handler : exportByPdf
			})
	function exportByExcel() {
		var str1 = createSql();
		location.href = '/itsm/asset/exportAsset.do?type=excel&sql=' + str1
				+ '&assetTypeId=' + assetTypeId;
	}
	function exportByPdf() {
		var str1 = createSql();
		location.href = '/itsm/asset/exportAsset.do?type=pdf&sql=' + str1
				+ '&assetTypeId=' + assetTypeId;
	}
	function createSql() {
		var str1 = null;
		var str2 = null;
		var str3 = null;
		var str4 = null;
		var str5 = null;
		var str6 = null;
		var str7 = null;
		var str8 = null;
		if (!Ext.isEmpty(AssetCode.getValue(), false)) {
			str2 = " AND asset_code like '%" + AssetCode.getValue() + "%'";
		}
		if (!Ext.isEmpty(startTime.getValue(), false)) {
			var startDate = new Date(Date.parse(startTime.getValue().replace(
					/-/g, "/")));
			str3 = " AND asset_purchase>='" + startDate.getTime() + "'";
		}
		if (!Ext.isEmpty(endTime.getValue(), false)) {
			var endDate = new Date(Date.parse(endTime.getValue().replace(/-/g,
					"/")));
			str4 = " AND asset_purchase<='" + endDate.getTime() + "'";
		}
		if (!Ext.isEmpty(AssetName.getValue(), false)) {
			str5 = " AND asset_name like '%" + AssetName.getValue() + "%'";
		}
		if (!Ext.isEmpty(assetsStatus.getValue(), false)
				&& assetsStatus.getValue() != 'all') {
			str6 = " AND asset_status='" + assetsStatus.getValue() + "'";
		}
		if (!Ext.isEmpty(supplierName.getValue(), false)) {
			str7 = " AND asset_supplier='" + assetSupplierId + "'";
		}
		if (!Ext.isEmpty(contractCode.getValue(), false)) {
			str8 = " AND asset_contract='" + assetContractId + "'";
		}

		var str1 = " WHERE asset_type='" + assetTypeId + "'";
		if (!Ext.isEmpty(str2, false)) {
			str1 = str1 + str2;
		}
		if (!Ext.isEmpty(str3, false)) {
			str1 = str1 + str3;
		}
		if (!Ext.isEmpty(str4, false)) {
			str1 = str1 + str4;
		}
		if (!Ext.isEmpty(str5, false)) {
			str1 = str1 + str5;
		}
		if (!Ext.isEmpty(str6, false)) {
			str1 = str1 + str6;
		}
		if (!Ext.isEmpty(str7, false)) {
			str1 = str1 + str7;
		}
		if (!Ext.isEmpty(str8, false)) {
			str1 = str1 + str8;
		}
		str1 = encodeURI(str1);
		return str1;
	}
	function extractVisibleColumnString(start, panel) {
		var str = "";
		if (panel != null && panel.getColumnModel() != null && start > 0
				&& panel.getColumnModel().getColumnCount(false) > start) {
			var model = panel.getColumnModel();
			var count = model.getColumnCount(false);
			for (var id = start; id < count; id++) {
				if (!model.isHidden(id)) {
					str = str + model.getColumnHeader(id) + "，";
				}
			}
		}
		return str;
	}
	var reader = new Ext.data.JsonReader({
				totalProperty : "totalCount",
				root : "assetItemList",
				id : "id",
				fields : [{
							name : 'id'
						}, {
							name : 'name'
						}, {
							name : 'code'
						}, {
							name : 'type.name'
						}, {
							name : 'price'
						}, {
							name : 'purchaseDate'
						}, {
							name : 'warranty'
						}, {
							name : 'assetSupplierName'
						}, {
							name : 'assetContractCode'
						}, {
							name : 'status'
						}, {
							name : 'position'
						}, {
							name : 'userRealName'
						}]
			});
	var store = new Ext.data.Store({
				storeId : 'AssetsQueryResultPanel_store_id',
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : CreateFormService.queryAssetLists,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var starttime = startTime.getValue();
									var endtime = endTime.getValue();
									var assetName = AssetName.getValue();
									var assetCode = AssetCode.getValue();
									var AssetContractId = assetContractId;
									var AssetSupplierId = assetSupplierId;
									var AssetsStatus = assetsStatus.getValue();
									var AssetTypeId = assetTypeId;

									var loadArgs = [params.start, params.limit,
											starttime, endtime, assetName,
											assetCode, AssetContractId,
											AssetSupplierId, AssetsStatus,
											AssetTypeId];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});
	store.setDefaultSort('id', 'asc');
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();// table中显示checkbox
	var columns = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
				header : "索引号",
				dataIndex : 'id',
				width : 5,
				hidden : true,
				sortable : true
			}, {
				header : "资产名称",
				sortable : true,
				dataIndex : 'name'
			}, {
				header : "资产编号",
				sortable : true,
				dataIndex : 'code'
			}, {
				header : "资产类型",
				sortable : true,
				dataIndex : 'type.name'
			}, {
				header : "价格",
				sortable : true,
				dataIndex : 'price',
				align : 'center'
			}, {
				header : "购买日期",
				sortable : true,
				renderer : dateFormatSimple,
				dataIndex : 'purchaseDate',
				align : 'center'

			}, {
				header : "保修期",
				sortable : true,
				renderer : dateFormatSimple,
				dataIndex : 'warranty',
				align : 'center'

			}, {
				header : "供应商",
				sortable : true,
				dataIndex : 'assetSupplierName',
				align : 'center'

			}, {
				header : "合同编号",
				sortable : true,
				dataIndex : 'assetContractCode',
				align : 'center'

			}, new Ext.grid.DictionaryColumn({
						id : 'state',
						header : "状态",
						dataIndex : 'status',
						displayField : 'status',
						valueField : 'state',
						editable : false,
						store : assetsStatusStore,
						width : 100
					}), {
				header : "位置",
				sortable : true,
				dataIndex : 'position',
				hidden : true,
				align : 'center'

			}, {
				header : '资产负责人',
				sortable : true,
				dataIndex : 'userRealName',
				align : 'center',
				width : 100
			}]);

	var pagingBar = new Ext.PagingToolbar({
				storeId : 'AssetsQueryResultPanel_store_id',
				pageSize : ApexConstants.PAGE_SIZE,
				store : store,
				displayInfo : true,
				displayMsg : '显示记录 {0} - {1} 共 {2} 条记录',
				emptyMsg : "无记录"
			});
	var queryResultGrid = new Ext.grid.GridPanel({
				id : 'assetQueryResultPanel',
				autoScroll : true,
				height : 100,
				margins : '5 0 0 0',
				region : "center",
				width : 500,
				autoExpandColumn : 9,
				store : store,
				border : false,
				// loadMask : '正在加载数据，请稍候...',
				enableHdMenu : false,
				tbar : [exportByExcelBtn, '-', exportByPdfBtn],
				bbar : pagingBar,
				cm : columns
			});

	checkboxSelect.on('selectionchange', function(selModel) {
			});
	// ************资产查询结果panel return queryResultGrid*************

	// ******************资产查询 mainpanel***********************

	var queryPanel = new Ext.Panel({
				layout : 'border',
				autoScroll : true,
				region : 'center',
				frame : false,
				border : false,
				items : [queryConditionsPanel, queryResultGrid]
			});
	return queryPanel;
	// ******************资产查询mainpanel***********************
}