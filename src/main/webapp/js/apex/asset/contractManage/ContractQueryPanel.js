ContractQueryPanel = function() {
	// ******************资产查询条件panel***********************
	var QueryCondition = Ext.data.Record.create([]);
	var defaultValue = new QueryCondition({
				contractCode : '',// 合同编号
				assetSupplierId : '',// 供应商
				startTime : '', // 开始时间
				endTime : '', // 结束时间
				ContractName : '',// 合同名称
				CreateMan : ''// 创建人

			});
	var assetSupplierId = '';// 供应商

	var contractCode = new Ext.form.TriggerField({
				id : 'contractCode',
				fieldLabel : '合同编号',
				readOnly : true,
				anchor : '78%',
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
							contractCode.setValue(Ext.util.Format.htmlDecode(treeNode.text));
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

	var supplier = new Ext.form.TriggerField({
				id : 'supplierName',
				fieldLabel : '供应商',
				readOnly : true,
				anchor : '78%',
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
					width : 200,
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
							supplier.setValue(Ext.util.Format
									.htmlDecode(treeNode.text));
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
	var startTime = new Ext.ux.form.DateField({
				name : 'startTime',
				fieldLabel : '开始日期',
				readOnly : true,
				width : 190
			});
	var endTime = new Ext.ux.form.DateField({
				name : 'endTime',
				fieldLabel : '结束日期',
				readOnly : true,
				width : 190
			});
	var ContractName = new Ext.form.TextField({
				fieldLabel : '合同名称 ',
				vtype : 'notEmptyChar',
				width : 190,
				name : 'ContractName',
				minLength : 0,
				maxLength : 255
			});
	var CreateMan = new Ext.form.TextField({
				fieldLabel : '创建人 ',
				width : 190,
				vtype : 'SpecialChar',
				name : 'CreateMan',
				minLength : 0,
				maxLength : 30
			});

	var queryConditionsPanel = new Ext.form.FormPanel({
				frame : true,
				monitorValid : true,
				region : 'north',
				labelWidth : 70,
				width : 600,
				border : false,
				height : 125,
				layout : 'column',
				items : [{
							columnWidth : .33,
							defaultType : 'textfield',
							layout : 'form',
							items : [ContractName, CreateMan]
						}, {
							columnWidth : .33,
							defaultType : 'textfield',
							layout : 'form',
							items : [supplier, startTime]
						}, {
							columnWidth : .33,
							defaultType : 'textfield',
							layout : 'form',
							items : [contractCode, endTime]
						}],
				buttons : [{
							text : '查询',
							handler : ExactQuery,
							formBind : true
						}, {
							text : '重置',
							handler : resetQueryCondition,
							formBind : true
						}]
			});
	//

	function ExactQuery() {
		var my_Mask = new Ext.LoadMask(Ext.getBody(), {
					msg : "数据处理中，请稍后..."
				});

		my_Mask.show();
		store.load({
					params : {
						start : 0,
						limit : 20,
						contractCode : Ext.util.Format.htmlDecode(contractCode.getValue()),// 合同编号
						supplierId : assetSupplierId,// 供应商
						startTime : getStartTime(), // 开始时间
						endTime : getEndTime(), // 结束时间
						ContractName : Ext.util.Format.htmlDecode(ContractName.getValue()),// 合同名称
						createMan : CreateMan.getValue()
						// 创建人
					},
					callback : function() {
						my_Mask.hide();
					}
				});
	}
	// 有效期
	function getEndTime() {
		var time = endTime.getValue();
		if (Ext.isEmpty(endTime.getValue()))
			return;
		else {
			var expectDate = new Date(Date.parse(time.replace(/-/g, "/")));
			return expectDate.getTime();;
		}
	}
	// 创建时间
	function getStartTime() {
		var time = startTime.getValue();
		if (Ext.isEmpty(time))
			return;
		else {
			var expectDate1 = new Date(Date.parse(time.replace(/-/g, "/")));
			return expectDate1.getTime();
		}
	}
	function resetQueryCondition() {
		queryConditionsPanel.getForm().loadRecord(defaultValue);
		supplier.setValue("");
	}

	// ******************资产查询条件 return
	// queryConditionsPanel;***********************

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
				root : "suplierItemList",
				id : "id",
				fields : [{
							name : 'id'
						}, {
							name : 'name'
						}, {
							name : 'code'
						}, {
							name : 'supplierName'
						}, {
							name : 'createManName'
						}, {
							name : 'beginTime'
						}, {
							name : 'endTime'
						}, {
							name : 'memo'
						}, {
							name : 'createContractTime'
						}]
			});

	var store = new Ext.data.Store({
				storeId : 'AssetsQueryResultPanel_store_id',
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : AssetService.ExactQueryContract,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									// var conditions = createQueryConditions();
									var loadArgs = [params.start, params.limit,
											params.contractCode, params.supplierId,
											params.startTime, params.endTime,
											params.ContractName,
											params.createMan];
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
				header : "索引号",
				dataIndex : 'id',
				width : 5,
				hidden : true,
				sortable : true
			}, {
				header : "名称",
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
				header : "供应商",
				sortable : true,
				dataIndex : 'supplierName'
			}, {
				header : "创建人",
				sortable : true,
				dataIndex : 'createManName',
				align : 'center'
			}, {
				header : "创建时间",
				sortable : true,
				renderer : dateFormatSimple,
				dataIndex : 'createContractTime',
				align : 'center'

			}, {
				header : "开始日期",
				sortable : true,
				renderer : dateFormatSimple,
				dataIndex : 'beginTime',
				align : 'center'

			}, {
				header : "结束日期",
				sortable : true,
				renderer : dateFormatSimple,
				dataIndex : 'endTime',
				align : 'center'

			}]);

	var pagingBar = new Ext.PagingToolbar({
				storeId : 'AssetsQueryResultPanel_store_id',
				pageSize : ApexConstants.PAGE_SIZE,
				store : store,
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
				enableHdMenu : false,
				bbar : pagingBar,
				cm : columns,
				sm : checkboxSelect
			});

	// ******************资产查询 mainpanel***********************

	var queryPanel = new Ext.Panel({
				layout : 'border',
				autoScroll : true,
				margins : '5 5 5 5',
				frame : false,

				border : false,
				items : [queryConditionsPanel, queryResultGrid]
			});
	return queryPanel;
}