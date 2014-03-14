Ext.namespace('Apex.asset')
Apex.asset.AssetGridPanel = function(type) {
	/**
	 * add by jonim
	 * 
	 * for sort the asset code
	 */
	Ext.override(Ext.data.Store, {
				sortData : function(f, direction) {
					direction = direction || 'ASC';
					var fld = this.fields.get(f), st = fld.sortType;
					var fn = fld.comparator || function(r1, r2) {
						var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
						return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
					};
					this.data.sort(direction, fn);
					if (this.snapshot && this.snapshot != this.data) {
						this.snapshot.sort(direction, fn);
					}
				}
			});

	function compareField1(r1, r2) {
		var v1 = r1.data['code'], v2 = r2.data['code'];
		var v3 = v1, v4 = v2;
		if (v1.indexOf('-') != -1) {
			v3 = Ext.data.SortTypes.asInt(v1.substring(v1.indexOf('-') + 1));
		}
		if (v2.indexOf('-') != -1) {
			v4 = Ext.data.SortTypes.asInt(v2.substring(v2.indexOf('-') + 1));
		}
		return v3 > v4 ? 1 : (v3 < v4 ? -1 : 0);
	}

	var resultPanel;
	var assetTypeId = -1;
	if (type != null && type != '') {
		assetTypeId = type;
	}
	this.id = 'Apex.asset.AssetGridPanel';
	var mainPanel = null;
	var newWindow = null;
	var nodeId = '0';
	var treeRoot = new Ext.tree.AsyncTreeNode({
				text : '资产类型',
				id : '0',
				hasChildren : true,
				expandable : true,
				expanded : true
			});
	var treeLoader = new Ext.ux.DWRTreeLoader({
				dwrCall : AssetService.getAssetTypeTree
			});

	var selectNode = null;
	var assetContractId = null;
	var assetSupplierId = null;
	var assetsStatusStore = new Ext.data.SimpleStore({
				fields : ['status', 'state'],
				data : [['全部', 'all'], ['库存中', 'status_store'],
						['使用中', 'status_use'], ['借调中', 'status_borrow'],
						['报废', 'status_scrap']]
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
							contractCode.setValue(Ext.util.Format
									.htmlDecode(treeNode.text));
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
							supplierName.setValue(Ext.util.Format
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

	var assetTypeName = new Ext.form.TriggerField({
				id : 'assetTypeName',
				fieldLabel : '资产类型',
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
				fieldLabel : '购买日期从',
				dateRange : {
					begin : 'beginDate',
					end : 'endDate'
				},// 用于vtype类型dateRange
				vtype : 'dateRange',
				anchor : '90%'
			});
	var endTime = new Ext.ux.form.DateField({
				id : 'endDate',
				fieldLabel : '到',
				dateRange : {
					begin : 'beginDate',
					end : 'endDate'
				},// 用于vtype类型dateRange
				vtype : 'dateRange',
				anchor : '90%'
			});
	var AssetName = new Ext.form.TextField({
				fieldLabel : '资产名称',
				vtype : 'SpecialChar',
				anchor : '90%',
				name : 'AssetName',
				minLength : 0,
				maxLength : 255
			});
	var AssetCode = new Ext.form.TextField({
				fieldLabel : '资产编号',
				anchor : '90%',
				vtype : 'SpecialChar',
				name : 'AssetNum',
				minLength : 0,
				maxLength : 30
			});

	// gridpanel
	var addBtn = new Ext.Button({
				text : '添加',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.ADD_BUTTON_PNG,
				handler : function() {
					location.href = "/itsm/asset/assetCreate.do?method=enter";
				}
			})
	var delBtn = new Ext.Button({
				text : '删除',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				disabled : true,
				handler : delAsset
			});
	var scrapBtn = new Ext.Button({
				text : '报废',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.SCRAP_BUTTON_PNG,
				disabled : true,
				handler : scrapAssetsEvent
			});
	var editBtn = new Ext.Button({
				text : '编辑',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EDIT_BUTTON_PNG,
				disabled : true,
				handler : editAsset
			});
	var refreshBtn = new Ext.Button({
				text : '刷新',
				cls : 'x-btn-text-icon',
				disabled : true,
				icon : ResourceConstants.REFRESH_BUTTON_PNG,
				handler : loadData
			})
	var exportByExcelBtn = new Ext.Button({
				text : '导出为EXCEL',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EXPORT_EXCEL_BUTTON_PNG,
				disabled : true,
				handler : exportByExcel
			})
	var exportByPdfBtn = new Ext.Button({
				text : '导出为PDF',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EXPORT_PDF_BUTTON_PNG,
				disabled : true,
				handler : exportByPdf
			})
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false
			})

	var importBtn = new Ext.Button({
				text : '导入资产',
				disabled : false,
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.IMPORT_BUTTON_PNG,
				handler : function() {
					var myMask = new Ext.LoadMask(Ext.getBody(), {
								msg : "数据处理中，请稍后..."
							});
					myMask.show();
					ImportAssetService.insertAssetDateFromNM({
								callback : function() {
									Ext.Msg.show({
												title : '提示',
												msg : '导入成功！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.INFO
											});
									loadAssetData();
									myMask.hide();
								},
								errorHandler : function(errorString, exception) {
									Ext.Msg.show({
												title : '错误',
												msg : '没有与NM系统接口集成,导入失败！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.ERROR
											});
									myMask.hide();
								}

							})
				}
			});

	var importExcel = new Ext.Button({
				text : '导入EXCEL',
				disabled : false,
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.IMPORT_BUTTON_PNG,
				handler : function() {
					location.href = "/itsm/asset/assetCreate.do?method=importAsset";

					// window
					// .open(
					// '/itsm/asset/assetCreate.do?method=importAsset',
					// 'newwindow',
					// 'height=500,width=600,top=300,left=400,toolbar=no,menubar=no,scrollbars=no,
					// resizable=no,location=no, status=no')
				}
			});

	var statusStore = new Ext.data.SimpleStore({
				fields : ['statusName', 'statusValue'],
				data : [['库存中', 'status_store'], ['使用中', 'status_use'],
						['借调中', 'status_borrow'], ['报废', 'status_scrap'],
						['已批准', 'status_approved'], ['已归还', 'status_reback']]
			});
	var columns = [new Ext.grid.RowNumberer(), checkboxSelect, {
				header : "Id",
				dataIndex : 'id',
				width : 10,
				hidden : true,
				sortable : true
			}, {
				header : "资产名称",
				align : 'left',
				dataIndex : 'name',
				width : 100,
				sortable : true,
				renderer : function(data, element, config) {
					return '<a href="/itsm/asset/assetCreate.do?method=enterDetail&assetTypeId='
							+ assetTypeId
							+ '&id='
							+ config.data.stringId
							+ '">' + data + '</a>';

				}
			}, {
				header : "资产编号",
				dataIndex : 'code',
				align : 'left',
				width : 100,
				sortable : true,
				renderer : function(data, element, config) {
					return '<a href="/itsm/asset/assetCreate.do?method=enterDetail&assetTypeId='
							+ assetTypeId
							+ '&id='
							+ config.data.stringId
							+ '">' + data + '</a>';

				}
			}, {
				header : "资产类型",
				dataIndex : 'type',
				align : 'left',
				width : 100,
				sortable : true
			}, {
				header : "价格",
				dataIndex : 'price',
				align : 'left',
				width : 100,
				sortable : true,
				renderer : Ext.util.Format.cnMoney
			}, {
				header : "购买日期",
				dataIndex : 'purchaseDate',
				align : 'left',
				renderer : dateFormatSimple,
				width : 100,
				sortable : true
			}, {
				header : "保修期",
				dataIndex : 'warranty',
				renderer : dateFormatSimple,
				align : 'left',
				width : 100,
				sortable : true
			}, {
				header : "供应商",
				dataIndex : 'assetSupplier',
				align : 'left',
				width : 100,
				sortable : true,
				renderer : function(data, element, config) {
					return '<a href="/itsm/asset/supplierMgt.do?method=viewSuppler&supplierId='
							+ config.data.supplierId
							+ '&menuId=m9_0'
							+ '">'
							+ data + '</a>';

				}
			}, {
				header : "合同编号",
				dataIndex : 'assetContract',
				align : 'left',
				width : 100,
				sortable : true,
				renderer : function(data, element, config) {
					return '<a href="/itsm/asset/contractMgt.do?method=viewContract&contractId='
							+ config.data.contractId
							+ '&menuId=m9_0'
							+ '">'
							+ data + '</a>';
				}
			}, new Ext.grid.DictionaryColumn({
						id : 'statusValue',
						header : "状态",
						dataIndex : 'status',
						displayField : 'statusName',
						valueField : 'statusValue',
						editable : false,
						store : statusStore,
						sortable : true,
						width : 100
					}), {
				header : "位置",
				dataIndex : 'position',
				align : 'left',
				hidden : true,
				sortable : true
			}, {
				header : "StringId",
				dataIndex : 'stringId',
				align : 'center',
				width : 10,
				hidden : true,
				sortable : true
			}, {
				header : "资产负责人",
				dataIndex : 'user',
				align : 'left',
				width : 100,
				sortable : true,
				renderer : function(data, element, config) {
					return '<a href="/itsm/security/userMgt.do?method=userDetails&id='
							+ config.data.userId
							+ '" >'
							+ data + '</a>';
				}
			}];
	var assetItemRecord = Ext.data.Record.create([{
				name : 'id'
			}, {
				name : 'name'
			}, {
				name : 'code',
				comparator : compareField1
			}, {
				name : 'type',
				mapping : 'type.name'
			}, {
				name : 'price'
			}, {
				name : 'purchaseDate'
			}, {
				name : 'warranty'
			}, {
				name : 'assetSupplier',
				mapping : 'assetSupplierName'
			}, {
				name : 'assetContract',
				mapping : 'assetContractCode'
			}, {
				name : 'status'
			}, {
				name : 'position'
			}, {
				name : 'comment'
			}, {
				name : 'memo'
			}, {
				name : 'assetType',
				mapping : 'type'
			}, {
				name : 'supplier',
				mapping : 'assetSupplier'
			}, {
				name : 'contract',
				mapping : 'assetContract'
			}, {
				name : 'stringId',
				mapping : 'stringId'
			}, {
				name : 'supplierId'
			}, {
				name : 'contractId'
			}, {
				name : 'user',
				mapping : 'userRealName'
			}, {
				name : 'userId'
			}]);

	var reader = new Ext.data.JsonReader({
				totalProperty : "totalCount",
				root : "assetItemList",
				id : "id"
			}, assetItemRecord)
	var assetItemStore = new Ext.data.Store({
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
	var pagingBar = new Ext.PagingToolbar({
				id : 'assetListPagingBar',
				pageSize : 20,
				store : assetItemStore,
				displayInfo : true,
				displayMsg : '显示 {0} - {1} 条资产，共 {2}条资产',
				emptyMsg : "没有任何资产"
			})
	var queryConditionsPanel = createQueryPanel();
	var gridPanel = createGridPanel();
	var eastPanel = createEastPanel();
	var treePanel = createTreePanel();
	var mainPanel = createMainPanel();
	this.getPanel = function() {
		return mainPanel;
	}
	function createTreePanel() {
		var panel = new Ext.tree.TreePanel({
					loader : treeLoader,
					collapsible : true,
					title : '按资产类型分类',
					rootVisible : true,
					autoScroll : true,
					bodyStyle : 'padding:0px 5px 0px 0px',
					frame : false,
					split : true,
					margins : '5 0 5 5',
					region : 'west',
					width : 200,
					root : treeRoot
				});
		panel.on('click', selectAssetType, panel);
		// treeRoot.select();
		panel.expandAll();
		return panel;
	}

	function createQueryPanel() {
		var queryConditionsPanel = new Ext.form.FormPanel({
					frame : true,
					monitorValid : true,
					region : 'north',
					labelWidth : 70,
					margins : '1 0 0 0',
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
								handler : queryData,
								formBind : true
							}, {
								text : '重置',
								handler : function() {
									assetTypeId='-1';
									startTime.setValue('');
									endTime.setValue('');
									AssetName.setValue('');
									AssetCode.setValue('');
									contractCode.setValue('');
									assetContractId = '';
									supplierName.setValue('');
									assetSupplierId = '';
									assetsStatus.setValue('all');
									assetTypeName.setValue('');
								},
								formBind : true
							}]
				});
		return queryConditionsPanel;
	}

	function createGridPanel() {
		resultPanel = new Ext.grid.GridPanel({
					id : 'assetItemTable',
					region : "center",
					store : assetItemStore,
					columns : columns,
					sm : checkboxSelect,
					autoScroll : true,
					autoExpandColumn : 9,
					enableHdMenu : false,
					height : 530,
					// margins : '5 0 5 0',
					tbar : [addBtn, '-', delBtn, '-', 
							exportByExcelBtn, '-', exportByPdfBtn, '-',
							importBtn, '-', importExcel],
					bbar : pagingBar
				});
		loadAssetData();
		return resultPanel;
	};

	function createEastPanel() {
		var eastPanel = new Ext.Panel({
					id : 'eastAssetGridPanel',
					border : false,
					layout : 'border',
					region : 'center',
					items : [queryConditionsPanel, gridPanel]
				});
		return eastPanel;
	}

	function createMainPanel() {
		var panel = new Ext.Panel({
					layout : 'border',
					autoScroll : true,
					id : id,
					closable : false,
					border : false,
					items : [eastPanel]
				});
		return panel;
	}

	//查询数据时，应把指针重新置为0，否则影响分页；
	function queryData() {
		pagingBar.cursor = 0;
		loadAssetData();
	}
	function loadAssetData() {
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
					msg : "正在加载数据，请稍侯...",
					msgCls : 'ext-el-mask-msg'
				});
		loadMask.show();

		assetItemStore.load({
					params : {
						start : pagingBar.cursor,
						limit : 20
					},
					callback : function() {
						if (assetItemStore.getTotalCount() > 0&&assetTypeId!='-1') {
							exportByExcelBtn.setDisabled(false);
							exportByPdfBtn.setDisabled(false);
							refreshBtn.setDisabled(false);
						} else {
							exportByExcelBtn.setDisabled(true);
							exportByPdfBtn.setDisabled(true);
							refreshBtn.setDisabled(true);
						}
						loadMask.hide()
					}

				});
	};

	function scrapAssetsEvent() {
		Ext.Msg.confirm("确认", "您确定要报废选中的资产吗？", function(button) {
			if (button == 'yes') {
				var selectRows = resultPanel.getSelectionModel()
						.getSelections();
				if (selectRows) {
					var list = new Array();
					for (var i = 0; i < selectRows.length; i++) {
						list.push(selectRows[i].get('stringId'));
					}
					CreateFormService.scrapAssets(list, assetTypeId, {
								callback : function() {
									loadAssetData();
								},
								errorHandler : function(errorString, exception) {
									Ext.MessageBox.show({
												title : '错误',
												msg : exception.message,
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
									loadAssetData();
								}
							})
				}
			}
		});
	}

	checkboxSelect.on('selectionchange', handleCheckChange);
	function handleCheckChange(checkMode) {
		if (checkMode.getCount() == 0) {
			delBtn.setDisabled(true);
			editBtn.setDisabled(true);
		} else if (checkMode.getCount() == 1) {
			delBtn.setDisabled(false);
			editBtn.setDisabled(false);
		} else {
			delBtn.setDisabled(false);
			editBtn.setDisabled(true);
		}
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
			str7 = " AND asset_supplier=" + assetSupplierId;
		}
		if (!Ext.isEmpty(contractCode.getValue(), false)) {
			str8 = " AND asset_contract=" + assetContractId;
		}

		var str1 = " WHERE asset_type=" + assetTypeId;
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

	function exportByExcel() {
		assetItemStore.load({
			params : {
				start : 0,
				limit : 20
			},
			callback : function() {
				if (assetItemStore.getCount() == '0') {
					Ext.Msg.show({
								title : '错误',
								msg : '对不起，列表中数据已被别人清空，请联系管理员！',
								modal : true,
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.ERROR
							})
					return;
				} else {
					var str = createSql();
					location.href = '/itsm/asset/exportAsset.do?type=excel&sql='
							+ str + '&assetTypeId=' + assetTypeId;
				}
			}
		});
	};

	function exportByPdf() {
		assetItemStore.load({
					params : {
						start : 0,
						limit : 20
					},
					callback : function() {
						if (assetItemStore.getCount() == '0') {
							Ext.Msg.show({
										title : '错误',
										msg : '对不起，列表中数据已被别人清空，请联系管理员！',
										modal : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									})
							return;
						} else {
							var str = createSql();
							location.href = '/itsm/asset/exportAsset.do?type=pdf&sql='
									+ str + '&assetTypeId=' + assetTypeId;
						}
					}
				});
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
	function delAsset() {
		Ext.MessageBox.buttonText.yes = '确定';
		Ext.MessageBox.buttonText.no = '取消';
		Ext.MessageBox.show({
					title : '确认',
					msg : '该操作不可恢复，您确定要删除选中的资产吗？',
					model : true,
					fn : callBack,
					icon : Ext.Msg.INFO,
					buttons : Ext.Msg.OKCANCEL
				})

	}
	function callBack(id, msg) {
		if (id == 'ok') {
			var IdList = new Array();
			var statueList = new Array();
			var selectedRecord = checkboxSelect.getSelections();
			for (var i = 0; i < selectedRecord.length; i++) {
				IdList.push(selectedRecord[i].data.stringId);
				statueList.push(selectedRecord[i].data.status);
			}
			CreateFormService.checkAssetExist(IdList, function(
							returnValue) {
						if (!returnValue) {
							Ext.Msg.show({
										title : '错误',
										msg : '对不起，资产已被其他资产管理员删除，请联系管理员！',
										model : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									})
							loadAssetData();
						} else {
							for (var i = 0; i < statueList.length; i++) {
								if (!checkDeleteStatus(statueList[i])) {
									Ext.Msg.show({
												title : '错误',
												msg : '对不起，只能删除库存中和报废的资产！',
												model : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.ERROR
											});
									return;
								}
							}
							CreateFormService.deleteAssets(IdList, 
									function(returnValue) {
										if (!returnValue) {
											Ext.Msg.show({
														title : '错误',
														msg : '发生错误或异常，删除失败',
														model : true,
														buttons : Ext.Msg.OK,
														icon : Ext.Msg.ERROR
													})
										}
										loadAssetData();
									})
						}
					})

		}
	}

	function editAsset() {
		var selectRecord = checkboxSelect.getSelected();
		var id = selectRecord.get('stringId');
		location.href = ('/itsm/asset/assetCreate.do?menuId=m9_0&method=enterEdit&id='
				+ id + '&assetTypeId=' + assetTypeId);
	}

	checkboxSelect.on('selectionchange', function(selModel) {

				var selectios = resultPanel.getSelectionModel().getSelections().length;
				if (selectios < 1) {
					scrapBtn.setDisabled(true);
				} else {
					scrapBtn.setDisabled(false);
				}
			});

	function selectAssetType(selectedTreeNode) {
		assetTypeId = selectedTreeNode.id;
		assetTypeName.setValue(selectedTreeNode.text);
		if (selectedTreeNode.id != 0) {
			loadAssetData();
		} else {
			return;
		}
	}

	function loadData() {
		loadAssetData();
	}

	function checkDeleteStatus(status) {
		var flag = false;
		if (status == "status_store" || status == "status_scrap"
				|| status == null || status.toString() == "") {
			flag = true
		}
		return flag;
	}
}
