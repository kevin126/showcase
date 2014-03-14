Ext.namespace('Apex.asset')
Apex.asset.AssetTypeConfigurePanel = function() {
	this.id = 'Apex.asset.AssetTypeConfigurePanel';
	var nodeId = '0';
	var popWin = null;
	var typeSelect = null;
	var treeRoot = new Ext.tree.AsyncTreeNode({
				text : '资产类型',
				id : '0',
				hasChildren : true,
				expanded : true
			});
	var treeLoader = new Ext.ux.DWRTreeLoader({
				dwrCall : AssetService.getAssetTypeTree
			});

	var assetTypeRecord = Ext.data.Record.create([{
				name : 'id'
			}, {
				name : 'parentId'
			}, {
				name : 'name'
			}, {
				name : 'memo'
			}, {
				name : 'prefix'
			}, {
				name : 'createFormId'
			}, {
				name : 'createFormEnabled'
			}, {
				name : 'createFromDbtbalename'
			}]);

	var typeReader = new Ext.data.JsonReader({
				totalProperty : "totalCount",
				root : 'typeList',
				id : 'id'
			}, assetTypeRecord);

	var typeStore = new Ext.data.Store({
				reader : typeReader,
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : AssetService.getFixedAssetTypeTree,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [nodeId];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						})
			});

	var treePanel = new Ext.tree.TreePanel({
				title : '资产类型列表',
				loader : treeLoader,
				collapsible : true,
				rootVisible : true,
				autoScroll : true,
				bodyStyle : 'padding:0px 5px 0px 0px',
				frame : false,
				split : true,
				root : treeRoot
			});
	treePanel.on('click', loadType);
	treeRoot.select();
	treePanel.expandAll();

	var treeNewPanel = new Ext.Panel({
				id : 'AssetTypeConfigurePanel.treePanel',
				layout : 'fit',
				autoScroll : true,
				border : false,
				region : 'west',
				closable : false,
				// margins : '5 5 5 5',
				width : 200,
				items : [treePanel]
			})

	var gridPanel = createGridPanel();

	function createGridPanel() {
		var addBtn = new Ext.Button({
					text : '添加',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addType
				});
		var delBtn = new Ext.Button({
					text : '删除',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.DELETE_BUTTON_PNG,
					disabled : true,
					handler : delType
				});
		var editBtn = new Ext.Button({
					text : '编辑',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.EDIT_BUTTON_PNG,
					disabled : true,
					handler : editType
				});

		typeSelect = new Ext.grid.CheckboxSelectionModel({
					listeners : {
						'selectionchange' : function(sm) {
							if (sm == null) {
								delBtn.setDisabled(true);
								editBtn.setDisabled(true);
							} else {
								if (sm.getSelections().length > 0) {
									delBtn.setDisabled(false);
									if (sm.getSelections().length < 2) {
										editBtn.setDisabled(false);
									} else {
										editBtn.setDisabled(true);
									}
								} else {
									delBtn.setDisabled(true);
									editBtn.setDisabled(true);
								}
							}
						}
					}
				});

		var gridPanelInner = new Ext.grid.GridPanel({
					margins : '5 5 5 0',
					store : typeStore,
					sm : typeSelect,

					columns : [typeSelect, new Ext.grid.RowNumberer(), {
								header : '名称',
								dataIndex : 'name',
								width : 230,
								sortable : true
							}, {
								header : '描述',
								dataIndex : 'memo',
								width : 360,
								hidden : true,
								sortable : false
							}, {
								header : '前缀',
								dataIndex : 'prefix',
								width : 150,
								sortable : false
							}, {
								header : '生成EXCEL导入模板',
								width : 150,
								dataIndex : 'id',
								renderer : function(value) {
									return '<a title="下载导入模板" href=# onclick="exportExcelModel(\''
											+ value
											+ '\');">'
											+ '<img src="/itsm/images/icons/export-excel16.png"/>'
											+ '</a>'
								}
							}],
					enableHdMenu : false,
					stripeRows : true,
					border : true,
					frame : false,
					autoExpandColumn : 2,
					tbar : [addBtn, '-', delBtn, '-', editBtn]
				});
		// typeStore.load({
		// params : {
		// parentId : nodeId
		// }
		// });
		return gridPanelInner;
	}
	var gridNewPanel = new Ext.Panel({
				id : 'AssetTypeConfigurePanel.gridPanel',
				layout : 'fit',
				// margins : '5 5 5 0',
				autoScroll : true,
				region : 'center',
				border : false,
				closable : false,
				items : [gridPanel]
			});
	loadAssetTypeData();

	function loadType(node, event) {
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
					msg : "正在加载数据，请稍侯...",
					msgCls : 'ext-el-mask-msg'
				});
		loadMask.show();
		gridNewPanel.removeAll(true);
		var gridOrdlePanel = createGridPanel();
		gridNewPanel.add(gridOrdlePanel);
		gridNewPanel.doLayout();
		if (node.parentNode == null) {
			nodeId = 0;
		} else {
			nodeId = node.id;
		}
		// Load data
		typeStore.load({
					params : {
						parentId : nodeId
					},
					callback : function() {
						loadMask.hide();
					}
				});
	};

	function loadAssetTypeData() {
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
					msg : "正在加载数据，请稍侯...",
					msgCls : 'ext-el-mask-msg'
				});
		loadMask.show();
		typeStore.load({
					params : {
						parentId : nodeId
					},
					callback : function() {
						loadMask.hide();
					}
				})
	};

	function addType() {
		var typePIdHiddenPop = new Ext.form.Hidden({
					value : nodeId
				});
		var typePrefixTextPop = new Ext.form.TextField({
					id : 'typePrefixTextPop',
					fieldLabel : '前缀',
					maxLength : 20,
					allowBlank : false,
					blankText : '前缀不能为空！',
					maxLengthText : '前缀长度不能超过20！',
					anchor : '90%',
					vtype : 'SpecialChar'
				})

		var typeNameTextPop = new Ext.form.TextField({
					id : 'typeNameTextPop',
					fieldLabel : '名称',
					maxLength : 50,
					allowBlank : false,
					blankText : '资产类型名不能为空！',
					maxLengthText : '资产类型名长度不能超过50！',
					anchor : '90%',
					vtype : 'SpecialChar'
				});
		var typeMemoTextPop = new Ext.form.TextArea({
					fieldLabel : '描述',
					maxLength : 255,
					allowBlank : true,
					blankText : '资产类型描述不能为空！',
					anchor : '96%',
					maxLengthText : '资产类型描述长度不能超过255！'
				});

		var inputPanel = new Ext.form.FormPanel({
					region : 'north',
					height : 140,
					margins : '0 0 5 0',
					monitorValid : true,
					frame : true,
					items : [{
								xtype : 'panel',
								layout : 'column',
								labelWidth : 80,
								defaults : {
									border : false,
									layout : 'form',
									labelWidth : 80,
									columnWidth : .50
								},
								items : [{
											items : typeNameTextPop
										}, {
											items : typePrefixTextPop
										}]
							}, {
								xtype : 'panel',
								layout : 'column',
								labelWidth : 80,
								defaults : {
									border : false,
									layout : 'form',
									labelWidth : 80,
									columnWidth : .99
								},
								items : [{
											items : typeMemoTextPop
										}]
							}],
					buttons : [{
								text : '下一步',
								id : 'inputPanel.next',
								disabled : true,
								// formBind : true,
								handler : save
							}],
					buttonAlign : 'center'
				});

		typePrefixTextPop.on('valid', function(obj) {
					if (typePrefixTextPop.isValid()
							&& typeMemoTextPop.isValid()) {
						Ext.getCmp('inputPanel.next').setDisabled(false);
					}
				});
		typeNameTextPop.on('valid', function(obj) {
					if (typePrefixTextPop.isValid()
							&& typeMemoTextPop.isValid()) {
						Ext.getCmp('inputPanel.next').setDisabled(false);
					}
				});
		typeMemoTextPop.on('valid', function(obj) {
					if (typeNameTextPop.isValid()
							&& typePrefixTextPop.isValid()) {
						Ext.getCmp('inputPanel.next').setDisabled(false);
					}
				})

		typePrefixTextPop.on('invalid', function(obj) {
					Ext.getCmp('inputPanel.next').setDisabled(true);
				});

		typeNameTextPop.on('invalid', function(obj) {
					Ext.getCmp('inputPanel.next').setDisabled(true);
				});
		typeMemoTextPop.on('invalid', function(obj) {
					Ext.getCmp('inputPanel.next').setDisabled(true);
				})

		var saveBtn = new Ext.Button({
					id : 'assetTypeConfigurePanel.saveBtn',
					text : '保存',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.SAVE_BUTTON_PNG,
					handler : saveAssetType
				});
		var addBtn = new Ext.Button({
					text : '添加',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addGridRow
				})

		var htmlTypeStore = new Ext.data.SimpleStore({
					fields : ['htmlType', 'type'],
					data : [['单行字符', 'one_string'], ['多行字符', 'many_string'],
							['整型', 'integer'], ['浮点型', 'float'],
							['日期', 'date'], ['下拉框', 'flex'], ['单选框', 'radio']]
				})
		var allowNullColumn = new Ext.grid.CheckColumn({
					header : "允许为空",
					dataIndex : 'allowedNull',
					width : 55
				});
		var enabledColumn = new Ext.grid.CheckColumn({
					header : "是否启用",
					dataIndex : 'enabled',
					width : 55
				})
		var columns = new Ext.grid.ColumnModel({
			defaults : {
				sortable : true
			},
			columns : [{
						header : '序列',
						dataIndex : 'columnSequence',
						align : 'center',
						width : 60
					}, {
						header : 'Id',
						dataIndex : 'id',
						width : 10,
						hidden : true
					}, {
						header : '名称',
						dataIndex : 'displayName',
						align : 'center',
						width : 90,
						editor : new Ext.form.TextField({
									maxLength : 15,
									vtype : 'SpecialChar',
									allowBlank : false
								})
					}, new Ext.grid.DictionaryColumn({
								id : 'htmlType',
								header : "页面表现形式",
								align : 'center',
								dataIndex : 'htmlType',
								displayField : 'htmlType',
								valueField : 'type',
								editable : true,
								store : htmlTypeStore,
								width : 90
							}), {
						header : '值集',
						dataIndex : 'flexValueSetName',
						align : 'center',
						width : 100,
						editor : new Ext.form.TriggerField({
									fieldLabel : '值集',
									hideTriger : false,
									readOnly : true,
									onTriggerClick : showFlexValueSetTree
								})
					}, {
						header : '最大长度/值',
						dataIndex : 'columnLength',
						align : 'center',
						width : 90,
						editor : new Ext.form.NumberField({
									minValue : 1,
									allowDecimals : false,
									minText : '输入值不能低于1！',
									maxValue : 999999999999999,
									maxText : '输入值不能超过999999999999999！'
								})
					}, {
						header : '最小长度/值',
						dataIndex : 'minLength',
						align : 'center',
						width : 90,
						editor : new Ext.form.NumberField({
									minValue : 1,
									allowDecimals : false,
									minText : '输入值不能低于1！',
									maxValue : 999999999999999,
									maxText : '输入值不能超过999999999999999！'
								})
					}, {
						header : '默认值',
						dataIndex : 'defaultValue',
						align : 'center',
						width : 90,
						editor : new Ext.form.TextField({
									vtype : 'SpecialChar',
									maxLength : 20
								})
					}, {
						header : '描述',
						dataIndex : 'discription',
						align : 'center',
						width : 90,
						editor : new Ext.form.TextField({
									vtype : 'SpecialChar',
									maxLength : 255
								})
					}, allowNullColumn, {
						header : '删除操作',
						dataIndex : 'columnSequence',
						width : 50,
						renderer : function(value) {
							return '<a href=# onclick="deleteAddCreateColumn(\''
									+ value + '\');">' + '删除' + '</a>'
						}
					}]
		});
		var record = Ext.data.Record.create([{
					name : 'id'
				}, {
					name : 'displayName'
				}, {
					name : 'code'
				}, {
					name : 'htmlType'
				}, {
					name : 'dbType'
				}, {
					name : 'flexValueSet'
				}, {
					name : 'enabled'
				}, {
					name : 'columnLength'
				}, {
					name : 'defaultValue'
				}, {
					name : 'discription'
				}, {
					name : 'createForm'
				}, {
					name : 'dbColumn'
				}, {
					name : 'allowedNull'
				}, {
					name : 'columnSequence'
				}, {
					name : 'flexValueSetName'
				}, {
					name : 'flexValueSetId'
				}, {
					name : 'minLength'
				}]);
		var reader = new Ext.data.JsonReader({
					totalProperty : 'totalCount',
					root : 'createColumnList',
					id : 'id'
				});
		var store = new Ext.data.Store({
					id : 'addAssetTypeStore',
					reader : reader
				});

		var pagingBar = new Ext.PagingToolbar({
					id : 'assetPagingBar',
					pageSize : 20,
					store : store,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条记录，共 {2}条记录',
					emptyMsg : "没有任何自定义属性"
				});
		var createColumnPanel = new Ext.grid.EditorGridPanel({
					id : 'addCreateColumnPanel',
					region : 'center',
					store : store,
					cm : columns,
					autoScroll : true,
					enableHdMenu : false,
					title : '自定义属性',
					plugins : [allowNullColumn, enabledColumn],
					hidden : true,
					clicksToEdit : 1,
					tbar : [addBtn, '-', saveBtn],
					bbar : pagingBar
				});

		createColumnPanel.on('cellclick', handleCellClick);
		function addGridRow() {
			var p = new record({
						columnSequence : store.data.length + 1
					});
			createColumnPanel.stopEditing();
			store.insert(0, p);
			createColumnPanel.startEditing(0, 2);
		}

		function save() {
			Ext.getCmp('inputPanel.next').setDisabled(true);
			var createColumnPanel = Ext.getCmp('addCreateColumnPanel');
			createColumnPanel.setVisible(true);
			mainCreateFormPanel.doLayout();
		}

		function validCreateColumn() {
			for (var i = 0; i < store.getCount(); i++) {
				var createForm = store.getAt(i);
				if (Ext.isEmpty(createForm.get('displayName'))) {
					showErrMessage('表名不能为空！');
					return false;
				} else if (Ext.isEmpty(createForm.get('htmlType'))) {
					showErrMessage('页面表现形式不能为空！');
					return false;
				} else if (Ext.isEmpty(createForm.get('columnSequence'))) {
					showErrMessage('序列不能为空！');
					return false;
				} else if (createForm.get('columnLength') < createForm
						.get('minLength')) {
					showErrMessage('最小长度应小于最大长度！');
					return false;
				} else if (!Ext.isEmpty(createForm.get('flexValueSetName'))
						&& createForm.get('htmlType') != 'flex'
						&& createForm.get('htmlType') != 'radio') {
					showErrMessage('仅当页面表现形式为下拉框或单选框时，才可以选择值集！');
					return false;
				}
			}
			return true;
		};

		function saveAssetType() {
			var assetType = {};
			assetType.parentId = typePIdHiddenPop.getValue();
			assetType.name = typeNameTextPop.getValue();
			assetType.prefix = typePrefixTextPop.getValue();
			assetType.memo = typeMemoTextPop.getValue();
			var createForm = {};
			var createColumnList = new Array();
			for (var i = 0; i < store.getCount(); i++) {
			
				createColumnList.push(store.getAt(i).data);
			}
			if (validCreateColumn()) {
				CreateColumnService.validatorFlexValue(createColumnList,
						function(returnValue) {
							if (!returnValue) {
								Ext.Msg.show({
											title : '错误',
											msg : '页面表现形式为下拉框和单选框的，缺少值集！',
											modal : true,
											buttons : Ext.Msg.OK,
											icon : Ext.Msg.ERROR
										});
							} else {
								AssetService.createAssetType(assetType,
										createForm, createColumnList, {
											callback : function() {
												closeWindow();
												treeLoader.load(treeRoot,
														function() {
														});
												treePanel.expandAll();
												treePanel.getSelectionModel()
														.select(treeRoot);

												gridNewPanel.removeAll(true);
												var gridOrderPanel = createGridPanel();
												gridNewPanel
														.add(gridOrderPanel);
												loadAssetTypeData();
												gridNewPanel.doLayout();
											},
											errorHandler : function(
													errorString, exception) {
												Ext.MessageBox.show({
													title : '错误',
													msg : exception.message,
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
											}
										})
							}
						})
			};

		}
		function showFlexValueSetTree() {
			if(Ext.getCmp('flexValueSetTreeWin') != null && Ext.getCmp('flexValueSetTreeWin').isVisible()){
				return;
			}
			flexValueSetTree = new Apex.asset.FlexValueSetTree();
			var treeWindow = new Ext.Window({
						id : 'flexValueSetTreeWin',
						title : '选择值集',
						closable : true,
						border : false,
						plain : true,
						width : 250,
						height : 400,
						resizable : false,
						modal : true,
						items : [flexValueSetTree],
						buttons : [{
									id : 'selectFlexValueBtn',
									text : '确定',
									disabled : true,
									handler : selectFlexValueSet
								}, {
									text : '取消',
									handler : function() {
										treeWindow.close();
									}
								}],
						buttonAlign : 'center'
					});
			flexValueSetTree.on('dblclick', selectFlexValueSet);
			flexValueSetTree.addListener('click', function(selectedNode) {
						if (selectedNode.id != '0')
							Ext.getCmp('selectFlexValueBtn').setDisabled(false);
						else
							Ext.getCmp('selectFlexValueBtn').setDisabled(true);
					});
			treeWindow.show();
		}
		function selectFlexValueSet() {
			var treeNode = flexValueSetTree.getSelectionModel()
					.getSelectedNode();
			if (treeNode.text == '值集')
				return;
			selectNode = treeNode;
			if(treeNode.id == "-2"){
				store.getAt(selectedRowIndex).set('flexValueSetName', "");
				store.getAt(selectedRowIndex).set('flexValueSetId', "");
			}else{
				store.getAt(selectedRowIndex).set('flexValueSetName', treeNode.text);
				store.getAt(selectedRowIndex).set('flexValueSetId', treeNode.id);
			}
			Ext.getCmp('flexValueSetTreeWin').close();
		}
		function handleCellClick(panel, rowIndex, colIndex) {
			selectedRowIndex = rowIndex;
		}

		var mainCreateFormPanel = new Ext.Panel({
					id : 'AssetTypeConfigurePanel.mainCreateFormPanel',
					layout : 'border',
					autoScroll : true,
					border : false,
					closable : false,
					items : [inputPanel, createColumnPanel]
				})

		AssetService.checkNodeExist(nodeId, function(returnValue) {
					if (!returnValue) {
						Ext.Msg.show({
									title : '错误',
									msg : '父类型已被删除！',
									modal : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});
						treeLoader.load(treeRoot, function() {
								});
						treePanel.expandAll();
						treePanel.getSelectionModel().select(treeRoot);
						typeStore.load({
									params : {
										parentId : nodeId
									}
								});
					} else {
						gridNewPanel.removeAll(true);
						gridNewPanel.add(mainCreateFormPanel);
						gridNewPanel.doLayout();
					}
				})

	};

	function delType() {
		//Ext.MessageBox.buttonText.yes = '确定', Ext.MessageBox.buttonText.no = '取消',
		 Ext.MessageBox
				.show({
							title : '确认',
							msg : '确定要删除资产类型吗？',
							model : true,
							fn : callBack,
							icon : Ext.Msg.INFO,
							buttons : Ext.Msg.OKCANCEL
						})
	}
	function callBack(id, msg) {
		if (id == 'ok') {
			var records = typeSelect.getSelections();
			var array = Array();
			var arrayNode = Array();
			for (var id = 0; id < records.length; id++) {
				array.push(records[id].get('id'));
				arrayNode.push(treePanel.getNodeById(records[id].get('id')))
			}
			CreateFormService.deleteAssetType(array, {
						callback : function() {
							for (var i = 0; i < arrayNode.length; i++) {
								arrayNode[i].remove();
							}
							loadAssetTypeData();
						},
						errorHandler : function(errorString, exception) {
							Ext.MessageBox.show({
										title : '错误',
										msg : exception.message,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
							nodeId = 0;
							treeLoader.load(treeRoot, function() {
									});
							treePanel.expandAll();
							treePanel.getSelectionModel().select(treeRoot);
							gridNewPanel.removeAll(true);
							var gridOrderPanel1 = createGridPanel();
							gridNewPanel.add(gridOrderPanel1);
							loadAssetTypeData();
							gridNewPanel.doLayout();
						}
					})
		}
	};

	function editType() {
		var selectRecord = typeSelect.getSelected();
		var formId = selectRecord.get('createFormId');
		var typePIdHiddenPop = new Ext.form.Hidden({
					value : nodeId
				});
		var typePrefixTextPop = new Ext.form.TextField({
					fieldLabel : '前缀',
					maxLength : 20,
					allowBlank : false,
					blankText : '前缀不能为空！',
					maxLengthText : '前缀长度不能超过20！',
					anchor : '90%',
					value : Ext.util.Format.htmlDecode(selectRecord
							.get('prefix')),
					vtype : 'SpecialChar'
				})

		var typeNameTextPop = new Ext.form.TextField({
					fieldLabel : '名称',
					maxLength : 50,
					allowBlank : false,
					blankText : '资产类型名不能为空！',
					maxLengthText : '资产类型名长度不能超过50！',
					anchor : '90%',
					value : Ext.util.Format
							.htmlDecode(selectRecord.get('name')),
					vtype : 'SpecialChar'
				});
		var typeMemoTextPop = new Ext.form.TextArea({
					fieldLabel : '描述',
					maxLength : 255,
					allowBlank : true,
					blankText : '资产类型描述不能为空！',
					anchor : '96%',
					value : Ext.util.Format
							.htmlDecode(selectRecord.get('memo')),
					maxLengthText : '资产类型描述长度不能超过255！'
				});

		var inputPanel = new Ext.form.FormPanel({
					region : 'north',
					height : 120,
					margins : '0 0 5 0',
					monitorValid : true,
					frame : true,
					items : [{
								xtype : 'panel',
								layout : 'column',
								labelWidth : 80,
								defaults : {
									border : false,
									layout : 'form',
									labelWidth : 80,
									columnWidth : .50
								},
								items : [{
											items : typeNameTextPop
										}, {
											items : typePrefixTextPop
										}]
							}, {
								xtype : 'panel',
								layout : 'column',
								labelWidth : 80,
								defaults : {
									border : false,
									layout : 'form',
									labelWidth : 80,
									columnWidth : .99
								},
								items : [{
											items : typeMemoTextPop
										}]
							}],
					buttonAlign : 'center'
				});
		typePrefixTextPop.on('valid', function(obj) {
					if (typePrefixTextPop.isValid()
							&& typeMemoTextPop.isValid()) {
						Ext.getCmp('gridPanel.save').setDisabled(false);
					}
				});
		typeNameTextPop.on('valid', function(obj) {
					if (typePrefixTextPop.isValid()
							&& typeMemoTextPop.isValid()) {
						Ext.getCmp('gridPanel.save').setDisabled(false);
					}
				});
		typeMemoTextPop.on('valid', function(obj) {
					if (typeNameTextPop.isValid()
							&& typePrefixTextPop.isValid()) {
						Ext.getCmp('gridPanel.save').setDisabled(false);
					}
				})

		typePrefixTextPop.on('invalid', function(obj) {
					Ext.getCmp('gridPanel.save').setDisabled(true);
				});

		typeNameTextPop.on('invalid', function(obj) {
					Ext.getCmp('gridPanel.save').setDisabled(true);
				});
		typeMemoTextPop.on('invalid', function(obj) {
					Ext.getCmp('gridPanel.save').setDisabled(true);
				})
		var saveBtn = new Ext.Button({
					id : 'gridPanel.save',
					text : '保存',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.SAVE_BUTTON_PNG,
					handler : saveAssetType
				});
		var addBtn = new Ext.Button({
					text : '添加',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addGridRow
				})

		var htmlTypeStore = new Ext.data.SimpleStore({
					fields : ['htmlType', 'type'],
					data : [['单行字符', 'one_string'], ['多行字符', 'many_string'],
							['整型', 'integer'], ['浮点型', 'float'],
							['日期', 'date'], ['下拉框', 'flex'], ['单选框', 'radio']]
				})
		var allowNullColumnEdit = new Ext.grid.CheckColumn({
					header : "允许为空",
					dataIndex : 'allowedNull',
					width : 55
				});
		var enabledColumnEdit = new Ext.grid.CheckColumn({
					header : "是否启用",
					dataIndex : 'enabled',
					width : 55
				});
		var columns = new Ext.grid.ColumnModel({
			defaults : {
				sortable : true
			},
			columns : [{
						header : '序列',
						dataIndex : 'columnSequence',
						align : 'center',
						width : 60
					}, {
						header : 'Id',
						dataIndex : 'id',
						width : 10,
						hidden : true
					}, {
						header : '名称',
						dataIndex : 'displayName',
						align : 'center',
						width : 90,
						editor : new Ext.form.TextField({
									vtype : 'SpecialChar',
									maxLength : 15,
									allowBlank : false
								})
					}, new Ext.grid.DictionaryColumn({
								id : 'htmlType',
								header : "页面表现形式",
								dataIndex : 'htmlType',
								align : 'center',
								displayField : 'htmlType',
								valueField : 'type',
								editable : true,
								store : htmlTypeStore,
								width : 90
							}), {
						header : '值集',
						dataIndex : 'flexValueSetName',
						align : 'center',
						width : 100,
						editor : new Ext.form.TriggerField({
									fieldLabel : '值集',
									hideTriger : false,
									readOnly : true,
									onTriggerClick : showFlexValueSetTree
								})
					}, {
						header : '最大长度/值',
						dataIndex : 'columnLength',
						align : 'center',
						width : 90,
						editor : new Ext.form.NumberField({
									minValue : 1,
									allowDecimals : false,
									minText : '输入值不能低于1！',
									maxValue : 999999999999999,
									maxText : '输入值不能超过999999999999999！'
								})
					}, {
						header : '最小长度/值',
						dataIndex : 'minLength',
						align : 'center',
						width : 90,
						editor : new Ext.form.NumberField({
									minValue : 1,
									allowDecimals : false,
									minText : '输入值不能低于1！',
									maxValue : 999999999999999,
									maxText : '输入值不能超过999999999999999！'
								})
					}, {
						header : '默认值',
						dataIndex : 'defaultValue',
						align : 'center',
						width : 90,
						editor : new Ext.form.TextField({
									vtype : 'SpecialChar',
									maxLength : 20
								})
					}, {
						header : '描述',
						dataIndex : 'discription',
						align : 'center',
						width : 90,
						editor : new Ext.form.TextField({
									vtype : 'SpecialChar',
									maxLength : 255
								})
					}, allowNullColumnEdit, {
						header : '删除操作',
						dataIndex : 'id',
						width : 50,
						renderer : function(data, element, config) {
							return '<a href=# onclick="deleteEditCreateColumn(\''
									+ config.data.id
									+ '\',\''
									+ config.data.columnSequence
									+ '\');">'
									+ '删除' + '</a>'
						}
					}]
		});
		var record = Ext.data.Record.create([{
					name : 'id'
				}, {
					name : 'displayName'
				}, {
					name : 'code'
				}, {
					name : 'htmlType'
				}, {
					name : 'dbType'
				}, {
					name : 'enabled'
				}, {
					name : 'columnLength'
				}, {
					name : 'defaultValue'
				}, {
					name : 'discription'
				}, {
					name : 'createForm'
				}, {
					name : 'dbColumn'
				}, {
					name : 'allowedNull'
				}, {
					name : 'columnSequence'
				}, {
					name : 'flexValueSetName'
				}, {
					name : 'flexValueSetId'
				}, {
					name : 'minLength'
				}]);
		var reader = new Ext.data.JsonReader({
					totalProperty : 'totalCount',
					root : 'createColumnList',
					id : 'id'
				}, record);
		var store = new Ext.data.Store({
					proxy : new Ext.ux.data.DWRProxy({
								dwrFunction : CreateColumnService.getCreateColumnList,
								listeners : {
									'beforeload' : function(dataProxy, params) {
										var loadArgs = [params.start,
												params.limit, formId];
										params[dataProxy.loadArgsKey] = loadArgs;
									}
								}
							}),
					reader : reader
				});

		var pagingBar = new Ext.PagingToolbar({
					id : 'assetPagingBar',
					pageSize : 20,
					store : store,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条记录，共 {2}条记录',
					emptyMsg : "没有任何自定义属性"
				});
		var createColumnPanel = new Ext.grid.EditorGridPanel({
					id : 'editCreateColumnPanel',
					region : 'center',
					store : store,
					cm : columns,
					autoScroll : true,
					title : '自定义属性',
					enableHdMenu : false,
					// autoExpandColumn : 11,
					height : 530,
					plugins : [allowNullColumnEdit, enabledColumnEdit],
					margin : '5,0,0,0',
					clicksToEdit : 1,
					tbar : [addBtn, '-', saveBtn],
					bbar : pagingBar
				});
		loadCreateFormData(formId);

		createColumnPanel.on('cellclick', handleCellClick);
		function addGridRow() {
			var p = new record({
						columnSequence : store.data.length + 1
					});
			createColumnPanel.stopEditing();
			store.insert(0, p);
			createColumnPanel.startEditing(0, 2);
		}

		function loadCreateFormData(formId) {
			var loadMask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在加载数据，请稍侯...",
						msgCls : 'ext-el-mask-msg'
					});
			loadMask.show();

			store.load({
						params : {
							start : 0,
							limit : 20,
							formId : formId
						},
						callback : function() {
							loadMask.hide()
						}

					});
		};
		function save() {
			var createColumnPanel = Ext.getCmp('editCreateColumnPanel');
			createColumnPanel.setVisible(true);
		}

		function validCreateColumn() {
			for (var i = 0; i < store.getCount(); i++) {
				var createForm = store.getAt(i);
				if (Ext.isEmpty(createForm.get('displayName'))) {
					showErrMessage('表名不能为空！');
					return false;
				} else if (Ext.isEmpty(createForm.get('htmlType'))) {
					showErrMessage('页面表现形式不能为空！');
					return false;
				} else if (Ext.isEmpty(createForm.get('columnSequence'))) {
					showErrMessage('序列不能为空！');
					return false;
				} else if (createForm.get('columnLength') < createForm
						.get('minLength')) {
					showErrMessage('最小长度应小于最大长度！');
					return false;
				} else if (!Ext.isEmpty(createForm.get('flexValueSetName'))
						&& createForm.get('htmlType') != 'flex'
						&& createForm.get('htmlType') != 'radio') {
					showErrMessage('仅当页面表现形式为下拉框或单选框时，才可以选择值集！');
					return false;
				}
			}
			return true;
		};

		function saveAssetType() {
			var seRecord = typeSelect.getSelected();
			var assetType = {};
			assetType.parentId = typePIdHiddenPop.getValue();
			assetType.name = typeNameTextPop.getValue();
			assetType.prefix = typePrefixTextPop.getValue();
			assetType.memo = typeMemoTextPop.getValue();
			assetType.id = seRecord.get('id');
			var createForm = {};
			createForm.id = seRecord.get('createFormId');
			createForm.dbtbalename = seRecord.get('createFromDbtbalename');

			var createColumnList = new Array();
			for (var i = 0; i < store.getCount(); i++) {
				createColumnList.push(store.getAt(i).data);
			}
			if (validCreateColumn()) {
				var array = Array();
				array.push(seRecord.get('id'));
				AssetService.checkAssetTypeExist(array, function(returnValue) {
					if (!returnValue) {
						Ext.Msg.show({
									title : '错误',
									msg : '对不起，该资产类型已被别人删除，请联系管理员！',
									modal : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});
						nodeId = 0;
						treeLoader.load(treeRoot, function() {
								});
						treePanel.expandAll();
						treePanel.getSelectionModel().select(treeRoot);
						gridNewPanel.removeAll(true);
						var gridOrderPanel1 = createGridPanel();
						gridNewPanel.add(gridOrderPanel1);
						loadAssetTypeData();
						gridNewPanel.doLayout();
					} else {
						CreateColumnService.validatorFlexValue(
								createColumnList, function(returnValue) {
									if (!returnValue) {
										Ext.Msg.show({
													title : '错误',
													msg : '页面表现形式为下拉框和单选框的，缺少值集！',
													modal : true,
													buttons : Ext.Msg.OK,
													icon : Ext.Msg.ERROR
												});
									} else {
										AssetService.createAssetType(assetType,
												createForm, createColumnList, {
													callback : function() {
														closeWindow();
														treeLoader.load(
																treeRoot,
																function() {
																});
														treePanel.expandAll();
														treePanel
																.getSelectionModel()
																.select(treeRoot);

														gridNewPanel
																.removeAll(true);
														var gridOrderPanel = createGridPanel();
														gridNewPanel
																.add(gridOrderPanel);
														loadAssetTypeData();
														gridNewPanel.doLayout();
													},
													errorHandler : function(
															errorString,
															exception) {
														Ext.MessageBox.show({
															title : '错误',
															msg : "对不起，资产名称重复，请重新命名！",
															buttons : Ext.MessageBox.OK,
															icon : Ext.MessageBox.ERROR
														});
													}
												})
									}
								})
					}
				})
			};
		}
		function showFlexValueSetTree() {
			if(Ext.getCmp('flexValueSetTreeWin') != null && Ext.getCmp('flexValueSetTreeWin').isVisible()){
				return;
			}
			flexValueSetTree = new Apex.asset.FlexValueSetTree();
			var treeWindow = new Ext.Window({
						id : 'flexValueSetTreeWin',
						title : '选择值集',
						closable : true,
						border : false,
						plain : true,
						width : 250,
						height : 400,
						resizable : false,
						modal : true,
						items : [flexValueSetTree],
						buttons : [{
									id : 'selectFlexValueBtn',
									text : '确定',
									disabled : true,
									handler : selectFlexValueSet
								}, {
									text : '取消',
									handler : function() {
										treeWindow.close();
									}
								}],
						buttonAlign : 'center'
					});
			flexValueSetTree.on('dblclick', selectFlexValueSet);
			flexValueSetTree.addListener('click', function(selectedNode) {
						if (selectedNode.id != '0')
							Ext.getCmp('selectFlexValueBtn').setDisabled(false);
						else
							Ext.getCmp('selectFlexValueBtn').setDisabled(true);
					});
			treeWindow.show();
		}
		function selectFlexValueSet() {
			var treeNode = flexValueSetTree.getSelectionModel().getSelectedNode();
			if (treeNode.text == '值集')
				return;
			selectNode = treeNode;
			if(treeNode.id == "-2"){
				store.getAt(selectedRowIndex).set('flexValueSetName', "");
				store.getAt(selectedRowIndex).set('flexValueSetId', "");
			}else{
				store.getAt(selectedRowIndex).set('flexValueSetName', treeNode.text);
				store.getAt(selectedRowIndex).set('flexValueSetId', treeNode.id);
			}
			Ext.getCmp('flexValueSetTreeWin').close();
		}
		function handleCellClick(panel, rowIndex, colIndex) {
			selectedRowIndex = rowIndex;
		}

		var mainCreateFormPanel = new Ext.Panel({
					id : 'AssetTypeConfigurePanel.mainCreateFormPanel',
					layout : 'border',
					autoScroll : true,
					border : false,
					closable : false,
					items : [inputPanel, createColumnPanel]
				})
		var records = typeSelect.getSelections();
		var array = Array();
		for (var i = 0; i < records.length; i++) {
			array.push(records[i].get('id'));
		}
		AssetService.checkAssetTypeExist(array, function(returnValue) {
					if (!returnValue) {
						Ext.Msg.show({
									title : '错误',
									msg : '对不起，该资产类型已被别人删除，请联系管理员！',
									modal : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});
						nodeId = 0;
						treeLoader.load(treeRoot, function() {
								});
						treePanel.expandAll();
						treePanel.getSelectionModel().select(treeRoot);
						loadAssetTypeData();
					} else {
						gridNewPanel.removeAll(true);
						gridNewPanel.add(mainCreateFormPanel);
						gridNewPanel.doLayout();
					}
				})

	};
	function closeWindow() {
		if (popWin != null) {
			popWin.close();
			popWin = null;
		}
	};

	var mainPanel = new Ext.Panel({
				layout : 'border',
				id : id,
				items : [treeNewPanel, gridNewPanel]
			});
	treePanel.expandAll();
	return mainPanel;
}

function deleteAddCreateColumn(value) {
	var store = Ext.getCmp('addCreateColumnPanel').getStore();
	store.remove(store.getAt(store
			.find('columnSequence', value, 0, true, false)));
}
function deleteEditCreateColumn(value, columnSequence) {
	var store = Ext.getCmp('editCreateColumnPanel').getStore();
	if (value == 'undefined') {
		store.remove(store.getAt(store.find('columnSequence', columnSequence,
				0, true, false)));
	} else {
			CreateColumnService.checkCreateColumnExist(value, {
			callback : function() {
				CreateColumnService.checkCreateColumn(value, function(
						returnValue) {
					if (returnValue) {
						Ext.Msg.buttonText.yes = '确认';
						Ext.Msg.buttonText.no = '取消';
						Ext.Msg.show({
							title : '确认',
							msg : '删除操作将使此类型下的资产实例丢失该自定义属性，确认删除吗？',
							model : true,
							fn : function(id, msg) {
								if (id == 'ok') {
									CreateColumnService.removeCreateColumn(
											value, {
												callback : function() {
													store
															.remove(store.getAt(store.find('id',value,0,true,false)));
												},
												errorHandler : function(
														errorString, exception) {
													Ext.MessageBox.show({
														title : '错误',
														msg : exception.message,
														buttons : Ext.MessageBox.OK,
														icon : Ext.MessageBox.ERROR
													});
													store.remove(store.getAt(store.find('id',value,0,true,false)));
												}
											})
								}
							},
							buttons : Ext.Msg.OKCANCEL,
							icon : Ext.Msg.INFO
						})
					} else {
						Ext.Msg.buttonText.yes = '确认';
						Ext.Msg.buttonText.no = '取消';
						Ext.Msg.show({
							title : '确认',
							msg : '确认要删除吗？',
							model : true,
							fn : function(id, msg) {
								if (id == 'ok') {
									CreateColumnService.removeCreateColumn(value, {
									callback : function() {
										store.remove(store.getAt(store.find(
												'id', value, 0, true, false)));
									},
									errorHandler : function(errorString,
											exception) {
										Ext.MessageBox.show({
													title : '错误',
													msg : exception.message,
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
										store.remove(store.getAt(store.find(
												'id', value, 0, true, false)));
									}
								})
								}
							},
							buttons : Ext.Msg.OKCANCEL,
							icon : Ext.Msg.INFO
						})
					}
				})
			},
			errorHandler : function(errorString, exception) {
				Ext.MessageBox.show({
							title : '错误',
							msg : exception.message,
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
				store.remove(store.getAt(store
						.find('id', value, 0, true, false)));
			}
		})
	}

}

function exportExcelModel(assetTypeId) {
	location.href = "/itsm/asset/importAsset.do?method=getExcelModel&assetTypeId="
			+ assetTypeId;
}
