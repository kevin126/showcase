Ext.namespace('Apex.configuration')
Apex.configuration.configurationTypeView = function() {
	var nodeId = '0';
	var checkboxselect = null
	var treeRoot = new Ext.tree.AsyncTreeNode({
				text : '配置项分类',
				id : '0',
				hasChildren : true,
				expanded : true
			})
	var treeLoad = new Ext.ux.DWRTreeLoader({
				dwrCall : ConfigurationService.getConfigurationTypeTree
			});
	var treePanel = new Ext.tree.TreePanel({
				id : 'configurationTypeTreePanel',
				// title : '按配置项类型分类',
				loader : treeLoad,
				margins : '5 5 5 5',
				autoScroll : true,
				region : 'west',
				width : 200,
				root : treeRoot
			});
	treePanel.on('click', function(node, event) {
				if (node.parentNode == null) {
					nodeId = '0';
				} else {
					nodeId = node.id;
				}
				ciTypeGridPanel.removeAll(true);
				ciTypeGridPanel.add(createGridPanel());
				ciTypeGridPanel.doLayout();

				loadDataByType();
			});
	var typeRecord = Ext.data.Record.create([{
				name : 'id'
			}, {
				name : 'parentId'
			}, {
				name : 'typeName'
			}, {
				name : 'typeCode'
			}, {
				name : 'typeMemo'
			}, {
				name : 'createFormId'
			}, {
				name : 'imagePath'
			},{
			    name : 'pictureModelId'
			}]);
	var typeReader = new Ext.data.JsonReader({
				id : 'configurationType',
				root : 'ciTypeList',
				totalProperty : 'totalSize'
			}, typeRecord);
	var typeStore = new Ext.data.Store({
				reader : typeReader,
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : ConfigurationService.getCiTypeListByParentId,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [nodeId];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						})
			});
	function createGridPanel() {
		var addBtn = new Ext.Button({
					id : 'addConfigurationType',
					text : '添加',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addConfigurationType
				});
		var delBtn = new Ext.Button({
					id : 'delConfigurationType',
					text : '删除',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.DELETE_BUTTON_PNG,
					disabled : true,
					handler : deleteConfigurationType
				});
		var editBtn = new Ext.Button({
					id : 'editConfigurationType',
					text : '编辑',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.EDIT_BUTTON_PNG,
					disabled : true,
					handler : editConfigurationType
				});
		checkboxselect = new Ext.grid.CheckboxSelectionModel({
					listeners : {
						'selectionchange' : function(checkMode) {
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
					}
				});
		var gridPanel = new Ext.grid.GridPanel({
			store : typeStore,
			sm : checkboxselect,
			margins : '5 5 5 0',
			columns : [checkboxselect, new Ext.grid.RowNumberer(), {
						header : '名称',
						dataIndex : 'typeName',
						sortable : true,
						align : 'center'
					}, {
						header : '编码',
						dataIndex : 'typeCode',
						sortable : true,
						align : 'center'
					}, {
						header : '生成EXCEL导入模板',
						dataIndex : 'id',
						width : 150,
						align : 'center',
						renderer : function(value) {
							return '<a href="#" title="下载导入模板" onclick="getExcelModel(\''
									+ value
									+ '\');">'
									+ '<img src="/itsm/images/icons/export-excel16.png"/>'
									+ '</a>'
						}
					}],
			autoExpandColumn : 2,
			stripeRows : true,
			enableHdMenu : false,
			tbar : [addBtn, '-', delBtn, '-', editBtn]
		});
		return gridPanel;
	};
	var innerGridPanel = createGridPanel();
	var ciTypeGridPanel = new Ext.Panel({
				id : 'configurationTypeGridPanel',
				border : false,
				margins : '5 5 5 0',
				layout : 'fit',
				region : 'center',
				items : [innerGridPanel]
			});
	var mainPanel = new Ext.Panel({
				layout : 'border',
				title : 'CI类型列表',
				items : [treePanel, ciTypeGridPanel]
			});
	loadDataByType();
	return mainPanel;

	function addConfigurationType() {
		var selectNode = null;
		var ciTypeName = new Ext.form.TextField({
					fieldLabel : '名称',
					maxLength : 20,
					allowBlank : false,
					vtype : 'SpecialChar',
					anchor : '90%'
				});
		var ciTypePrex = new Ext.form.TextField({
					fieldLabel : '前缀',
					maxLength : 20,
					allowBlank : false,
					vtype : 'SpecialChar',
					anchor : '90%'
				});
		var ciTypeImage = new Ext.Button({
					text : '选择图片',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : showImageTree
				})

		var imageText = new Ext.form.Label({
					text : '图标:',
					autoHeight : true
				});

		var imageLabel = new Ext.form.Label({
			html : "<html><head></head><body><center><img id='gaochao' src='../images/cmdb/newci16.png' width='30' height='20'></center></body></html>"
		});

		var imagePanel = new Ext.Panel({
			id : 'browseImage',
			html : "<html><head></head><body><center>图标：<img id='gaochao' src='../images/cmdb/newci16.png' width='30' height='20'></center></body></html>"
		})

		var ciTypeMemo = new Ext.form.TextArea({
					fieldLabel : '描述',
					maxLength : 2000,
					anchor : '96%'
				});
		function showImageTree() {
			var typeImageTree = new Apex.configuration.selectedImageTree();
			var treeWindow = new Ext.Window({
						id : 'image.treeWindow',
						title : '选择图片',
						closable : false,
						border : false,
						plain : true,
						width : 250,
						height : 400,
						resizable : false,
						modal : true,
						items : [typeImageTree],
						buttons : [{
							id : 'image.yes',
							text : '确定',
							disabled : true,
							handler : function() {
								var treeNode = typeImageTree
										.getSelectionModel().getSelectedNode();
								if (treeNode.text == '选择图片') {
									return;
								}
								selectNode = treeNode;
								document.getElementById('gaochao').src = treeNode.attributes.icon;
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
			typeImageTree.addListener('click', function(selectNode) {
						if (selectNode.id != '0')
							Ext.getCmp('image.yes').setDisabled(false);
						else
							Ext.getCmp('image.yes').setDisabled(true);
					});
			treeWindow.show();

		}

		var formPanel = new Ext.FormPanel({
					frame : true,
					region : 'north',
					height : 120,
					fileUpload : true,
					margins : '5 5 5 0',
					items : [{
								xtype : 'panel',
								layout : 'column',
								labelWidth : 80,
								defaults : {
									border : false,
									layout : 'form',
									labelWidth : 80
								},
								items : [{
											items : ciTypeName,
											columnWidth : .35
										}, {
											items : ciTypePrex,
											columnWidth : .35
										}, {
											items : imageText,
											columnWidth : .05
										}, {
											items : imageLabel,
											columnWidth : .10
										}, {
											items : ciTypeImage,
											columnWidth : .15
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
											items : ciTypeMemo
										}]
							}]
				});

		ciTypeName.on('valid', function(obj) {
					if (ciTypePrex.isValid() && ciTypeMemo.isValid()) {
						saveBtn.setDisabled(false);
					}
				});
		ciTypePrex.on('valid', function(obj) {
					if (ciTypeName.isValid() && ciTypeMemo.isValid()) {
						saveBtn.setDisabled(false);
					}
				});
		ciTypeMemo.on('valid', function(obj) {
					if (ciTypeName.isValid() && ciTypePrex.isValid()) {
						saveBtn.setDisabled(false);
					}
				});
		ciTypeName.on('invalid', function(obj) {
					saveBtn.setDisabled(true);
				});
		ciTypePrex.on('invalid', function(obj) {
					saveBtn.setDisabled(true);
				});
		ciTypeMemo.on('invalid', function(obj) {
					saveBtn.setDisabled(true);
				})
		var addItemBtn = new Ext.Button({
					text : '添加',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addCiType
				});
		var saveBtn = new Ext.Button({
					text : '保存',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.SAVE_BUTTON_PNG,
					disabled : true,
					handler : saveCiType
				});
		var cancelBtn = new Ext.Button({
					text : '取消',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.CANCEL_ISTOP_BUTTON_PNG,
					handler : cancel
				});
		var htmlTypeStore = new Ext.data.SimpleStore({
					fields : ['htmlType', 'type'],
					data : [['单行字符', 'one_string'], ['多行字符', 'many_string'],
							['整型', 'integer'], ['浮点型', 'float'],
							['日期', 'date'], ['下拉框', 'flex'], ['单选框', 'radio']]
				});

		var allowNullColumnEdit = new Ext.grid.CheckColumn({
					header : "允许为空",
					dataIndex : 'allowedNull',
					width : 90,
					align : 'center'
				});
		var columns = new Ext.grid.ColumnModel({
			defaults : {
				sortable : true
			},
			columns : [{
						header : '序列',
						dataIndex : 'columnSequence',
						width : 50,
						align : 'center'
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
						width : 90,
						editor : new Ext.form.TriggerField({
									name : 'flexValueSet',
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
						header : '操作',
						dataIndex : 'id',
						width : 50,
						renderer : function(data, element, config) {
							return '<a href=# onclick="deleteAddCreateColumn(\''
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

		var reader = new Ext.data.JsonReader(record);

		var store = new Ext.data.Store({
					reader : reader
				})
		var addCiTypePanel = new Ext.grid.EditorGridPanel({
					id : 'addCiTypePanel',
					cm : columns,
					title : '自定义属性',
					store : store,
					plugins : [allowNullColumnEdit],
					region : 'center',
					enableHdMenu : false,
					clicksToEdit : 1,
					autoScroll : true,
					tbar : [addItemBtn, '-', saveBtn, '-', cancelBtn]
				})

		addCiTypePanel.on('cellclick', function(panel, rowIndex, colIndex) {
					selectedRowIndex = rowIndex;
				});
		var addPanel = new Ext.Panel({
					id : 'addPanel',
					border : false,
					layout : 'border',
					items : [formPanel, addCiTypePanel]
				})
		ciTypeGridPanel.removeAll(true);
		ciTypeGridPanel.add(addPanel);
		ciTypeGridPanel.doLayout();

		function showFlexValueSetTree() {
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
							handler : function() {
								var treeNode = flexValueSetTree
										.getSelectionModel().getSelectedNode();
								if (treeNode.text == '值集')
									return;
								// selectNode = treeNode;
								store.getAt(selectedRowIndex).set(
										'flexValueSetName', treeNode.text);
								store.getAt(selectedRowIndex).set(
										'flexValueSetId', treeNode.id);
								Ext.getCmp('flexValueSetTreeWin').close();
							}
						}, {
							text : '取消',
							handler : function() {
								treeWindow.close();
							}
						}],
						buttonAlign : 'center'
					});
			flexValueSetTree.addListener('click', function(selectedNode) {
						if (selectedNode.id != '0')
							Ext.getCmp('selectFlexValueBtn').setDisabled(false);
						else
							Ext.getCmp('selectFlexValueBtn').setDisabled(true);
					});
			treeWindow.show();
		};

		function addCiType() {
			var p = new record({
						columnSequence : store.getCount() + 1
					});
			addCiTypePanel.stopEditing();
			store.insert(0, p);
			addCiTypePanel.startEditing(0, 2);
		};

		function validatorColumn() {
			for (var i = 0; i < store.getCount(); i++) {
				var cm = store.getAt(i);
				if (Ext.isEmpty(cm.get('displayName'))) {
					showErrMessage('名称不能为空！');
					return false;
				} else if (Ext.isEmpty(cm.get('htmlType'))) {
					showErrMessage('页面表现形式不能为空！');
					return false;
				} else if (cm.get('columnLength') < cm.get('minLength')) {
					showErrMessage('最大值不能小于最小值！');
					return false;
				} else if (!Ext.isEmpty(cm.get('flexValueSetName'))
						&& cm.get('htmlType') != 'flex'
						&& cm.get('htmlType') != 'radio') {
					showErrMessage('仅当页面表现形式为下拉框或单选框，才可以选择值集！');
					return false;
				}
			}
			return true;
		}

		function saveCiType() {
			var ciType = {};
			ciType.parentId = nodeId;
			ciType.typeName = ciTypeName.getValue();
			ciType.typeCode = ciTypePrex.getValue();
			ciType.typeMemo = ciTypeMemo.getValue();
			if (selectNode != null) {
				var pictureModel={};
				pictureModel.id=selectNode.id;
				ciType.pictureModel = pictureModel;
			}

			var createColumnList = new Array();
			for (var i = 0; i < store.getCount(); i++) {
				createColumnList.push(store.getAt(i).data);
			};
			if (validatorColumn()) {
				ConfigurationService.saveOrUpdataConfigurationType(ciType,
						createColumnList, {
							callback : function() {
								changeToGridPanel();
							},
							errorHandler : function(errorString, exception) {
								Ext.MessageBox.show({
											title : '错误',
											msg : 'CI类型名称重复，请重新命名！',
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						})
			}

		};
		function cancel() {
			changeToGridPanel();
		};
	};

	function deleteConfigurationType() {
		Ext.MessageBox.buttonText.yes = '确定', Ext.MessageBox.buttonText.no = '取消', Ext.MessageBox
				.show({
							title : '确认',
							msg : '确定要删除配置项类型吗？',
							model : true,
							fn : callBack,
							icon : Ext.Msg.INFO,
							buttons : Ext.Msg.OKCANCEL
						})
	}
	function callBack(id, msg) {
		if (id == 'ok') {
			var selectedRecord = checkboxselect.getSelections();
			var ids = new Array();
			for (var i = 0; i < selectedRecord.length; i++) {
				ids.push(selectedRecord[i].get('id'));
			}
			ConfigurationService.deleteConfiguration(ids, {
						callback : function() {
							changeToGridPanel();
						},
						errorHandler : function(errorString, exception) {
							Ext.MessageBox.show({
										title : '错误',
										msg : exception.message,
										fn : errorReturn,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					})
		}
	};
	function editConfigurationType() {
		var selectedNode = null;
		var selectRecord = checkboxselect.getSelected();
		var formId = selectRecord.get('createFormId');
		var ctName = new Ext.form.TextField({
					id : "configurationTypeName",
					fieldLabel : '名称',
					maxLength : 20,
					allowBlank : false,
					vtype : 'SpecialChar',
					value : selectRecord.get('typeName'),
					anchor : '90%'
				});
		var ctCode = new Ext.form.TextField({
					id : 'configurationTypeCode',
					fieldLabel : '编码',
					maxLength : 20,
					allowBlank : false,
					vtype : 'SpecialChar',
					value : selectRecord.get('typeCode'),
					anchor : '90%',
					readOnly : true
				})
		var ctImage = new Ext.Button({
					text : '选择图片',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : showImageTree
				});
		var ciImagePanel = new Ext.Panel({
			id : 'imageSelect',
			html : "<html><head></head><body><center>图标：<img id='gaochaoEdit' src='"
					+ selectRecord.get('imagePath')
					+ "' width='30' height='20'></center></body></html>"
		})

		function showImageTree() {
			var typeImageTree = new Apex.configuration.selectedImageTree();
			var treeWindow = new Ext.Window({
				id : 'image.treeWindow',
				title : '选择图片',
				closable : false,
				border : false,
				plain : true,
				width : 250,
				height : 400,
				resizable : false,
				modal : true,
				items : [typeImageTree],
				buttons : [{
					id : 'image.yes',
					text : '确定',
					disabled : true,
					handler : function() {
						var treeNode = typeImageTree.getSelectionModel()
								.getSelectedNode();
						if (treeNode.text == '选择图片') {
							return;
						}
						selectedNode = treeNode;
						document.getElementById('gaochaoEdit').src = selectedNode.attributes.icon;
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
			typeImageTree.addListener('click', function(selectedNode) {
						if (selectedNode.id != '0')
							Ext.getCmp('image.yes').setDisabled(false);
						else
							Ext.getCmp('image.yes').setDisabled(true);
					});
			treeWindow.show();

		}

		var ctMemo = new Ext.form.TextArea({
					id : 'configurationTypeMemo',
					fieldLabel : '描述',
					maxLength : 20000,
					value : Ext.util.Format.htmlDecode(selectRecord
							.get('typeMemo')),
					anchor : '96%'
				});
		var formPanel = new Ext.form.FormPanel({
					frame : true,
					height : 120,
					region : 'north',
					items : [{
								xtype : 'panel',
								layout : 'column',
								labelWidth : 80,
								defaults : {
									border : false,
									layout : 'form',
									labelWidth : 80,
									columnWidth : .33
								},
								items : [{
											items : ctName
										}, {
											items : ctCode
										}, {
											xtype : 'panel',
											layout : 'column',
											labelWidth : 80,
											defaults : {
												border : false,
												layout : 'form',
												labelWidth : 80,
												columnWidth : .49
											},
											items : [{
														items : ciImagePanel
													}, {
														items : ctImage
													}]
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
											items : ctMemo
										}]
							}]
				});

		ctName.on('valid', function(obj) {
					if (ctCode.isValid() && ctMemo.isValid()) {
						saveBtn.setDisabled(false);
					}
				});
		ctCode.on('valid', function(obj) {
					if (ctName.isValid() && ctMemo.isValid()) {
						saveBtn.setDisabled(false);
					}
				});
		ctMemo.on('valid', function(obj) {
					if (ctName.isValid() && ctCode.isValid()) {
						saveBtn.setDisabled(false);
					}
				});
		ctName.on('invalid', function(obj) {
					saveBtn.setDisabled(true);
				});
		ctCode.on('invalid', function(obj) {
					saveBtn.setDisabled(true);
				});
		ctMemo.on('invalid', function(obj) {
					saveBtn.setDisabled(true);
				})
		var addBtn = new Ext.Button({
					id : 'addCtProperty',
					text : '添加',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addCtProperty
				});
		var saveBtn = new Ext.Button({
					id : 'saveCtProperty',
					text : '保存',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.SAVE_BUTTON_PNG,
					handler : saveCtProperties
				});
		var cancelBtn = new Ext.Button({
					id : 'cancelCtProperty',
					text : '取消',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.CANCEL_ISTOP_BUTTON_PNG,
					handler : cancel
				});
		var htmlTypeStore = new Ext.data.SimpleStore({
					fields : ['htmlType', 'type'],
					data : [['单行字符', 'one_string'], ['多行字符', 'many_string'],
							['整型', 'integer'], ['浮点型', 'float'],
							['日期', 'date'], ['下拉框', 'flex'], ['单选框', 'radio']]
				});
		var allowNullColumnEdit = new Ext.grid.CheckColumn({
					header : "允许为空",
					dataIndex : 'allowedNull',
					width : 90,
					align : 'center'
				});
		var columns = new Ext.grid.ColumnModel({
			defaults : {
				sortable : true
			},
			columns : [{
						header : '序列',
						dataIndex : 'columnSequence',
						width : 50,
						align : 'center'
					}, {
						header : 'Id',
						dataIndex : 'id',
						width : 10,
						hidden : true
					}, {
						header : '名称',
						dataIndex : 'displayName',
						width : 90,
						align : 'center',
						editor : new Ext.form.TextField({
									maxLength : 15,
									vtype : 'SpecialChar',
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
								width : 90,
								store : htmlTypeStore
							}), {
						header : '值集',
						dataIndex : 'flexValueSetName',
						align : 'center',
						width : 90,
						editor : new Ext.form.TriggerField({
									name : 'flexValueSet',
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
						header : '操作',
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
					id : 'editCtPropertyGridPanel',
					root : 'createColumnList',
					totalProperty : 'totalCount'
				}, record);
		var store = new Ext.data.Store({
			proxy : new Ext.ux.data.DWRProxy({
						dwrFunction : CreateColumnService.getCreateColumnListNoPage,
						Listeners : {
							'beforeLoad' : function(dataProxy, params) {
								var loadArgs = [formId];
								params[dataProxy.loadArgsKey] = loadArgs;
							}
						}
					}),
			reader : reader
		});
		var editCtGridPanel = new Ext.grid.EditorGridPanel({
					id : 'editCtGridPanel',
					region : 'center',
					store : store,
					plugins : [allowNullColumnEdit],
					cm : columns,
					clicksToEdit : 1,
					enableHdMenu : false,
					title : '自定义属性',
					tbar : [addBtn, '-', saveBtn, '-', cancelBtn]
				});
		editCtGridPanel.on('cellclick', function(panel, rowIndex, colIndex) {
					selectedRowIndex = rowIndex;
				});
		var editPanel = new Ext.Panel({
					border : false,
					layout : 'border',
					items : [formPanel, editCtGridPanel]
				});

		ConfigurationService.checkTypeExist(selectRecord.get('id'), function(
						returnValue) {
					if (returnValue) {
						Ext.MessageBox.show({
									title : '错误',
									msg : '对不起，该类型已被删除！',
									modal : true,
									fn : errorReturn,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});
					} else {
						ciTypeGridPanel.removeAll();
						ciTypeGridPanel.add(editPanel);
						ciTypeGridPanel.doLayout();
						loadEditCtData();
					};
				});

		function showFlexValueSetTree() {
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
							handler : function() {
								var treeNode = flexValueSetTree
										.getSelectionModel().getSelectedNode();
								if (treeNode.text == '值集')
									return;
								// selectNode = treeNode;
								store.getAt(selectedRowIndex).set(
										'flexValueSetName', treeNode.text);
								store.getAt(selectedRowIndex).set(
										'flexValueSetId', treeNode.id);
								Ext.getCmp('flexValueSetTreeWin').close();
							}
						}, {
							text : '取消',
							handler : function() {
								treeWindow.close();
							}
						}],
						buttonAlign : 'center'
					});
			flexValueSetTree.addListener('click', function(selectNode) {
						if (selectNode.id != '0')
							Ext.getCmp('selectFlexValueBtn').setDisabled(false);
						else
							Ext.getCmp('selectFlexValueBtn').setDisabled(true);
					});
			treeWindow.show();
		};

		function loadEditCtData() {
			var editMask = new Ext.LoadMask(Ext.getBody(), {
						msg : '正在加载数据，请稍候...',
						msgCls : 'ext-el-mask-msg'
					});
			editMask.show();
			store.load({
						params : {
							formId : formId
						},
						callback : function() {
							editMask.hide();
						}
					})
		}

		function addCtProperty() {
			var p = new record({
						columnSequence : store.data.length + 1
					});
			editCtGridPanel.stopEditing();
			store.insert(0, p);
			editCtGridPanel.startEditing(0, 2);
		};

		function validatorColumn() {
			for (var i = 0; i < store.getCount(); i++) {
				var cm = store.getAt(i);
				if (Ext.isEmpty(cm.get('displayName'))) {
					showErrMessage('名称不能为空！');
					return false;
				} else if (Ext.isEmpty(cm.get('htmlType'))) {
					showErrMessage('页面表现形式不能为空！');
					return false;
				} else if (cm.get('columnLength') < cm.get('minLength')) {
					showErrMessage('最大值不能小于最小值！');
					return false;
				} else if (!Ext.isEmpty(cm.get('flexValueSetName'))
						&& cm.get('htmlType') != 'flex'
						&& cm.get('htmlType') != 'radio') {
					showErrMessage('仅当页面表现形式为下拉框或单选框，才可以选择值集！');
					return false;
				}
			}
			return true;
		}

		function saveCtProperties() {
			var ciType = {};
			ciType.id = selectRecord.get('id');
			ciType.parentId = nodeId;
			ciType.typeName = ctName.getValue();
			ciType.typeCode = ctCode.getValue();
			ciType.typeMemo = ctMemo.getValue();
			var pictureModel={};
			if (selectedNode == null) {
				pictureModel.id = selectRecord.get('pictureModelId');
			} else {
				pictureModel.id = selectedNode.id;
			}
			ciType.pictureModel=pictureModel;
			var createColumnList = new Array();
			for (var i = 0; i < store.getCount(); i++) {
				createColumnList.push(store.getAt(i).data);
			};
			if (validatorColumn()) {
				ConfigurationService.checkTypeExist(selectRecord.get('id'),
						function(returnValue) {
							if (returnValue) {
								Ext.MessageBox.show({
											title : '错误',
											msg : '对不起，该类型已被删除！',
											modal : true,
											fn : errorReturn,
											buttons : Ext.Msg.OK,
											icon : Ext.Msg.ERROR
										});
							} else {
								ConfigurationService
										.saveOrUpdataConfigurationType(ciType,
												createColumnList, {
													callback : function() {
														changeToGridPanel();
														// location.href =
														// "/itsm/cmdb/ciType.do?method=enter";
													},
													errorHandler : function(
															errorString,
															exception) {
														Ext.MessageBox.show({
															title : '错误',
															msg : 'CI类型名称重复，请重新命名！',
															buttons : Ext.MessageBox.OK,
															icon : Ext.MessageBox.ERROR
														});
													}
												})
							}

						})
			}
		}
		function cancel() {
			changeToGridPanel();
			// location.href = "/itsm/cmdb/ciType.do?method=enter";
		}

	};

	function errorReturn(id, msg) {
		changeToGridPanel();
		// location.href = "/itsm/cmdb/ciType.do?method=enter";
	}
	function loadDataByType() {
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

	function changeToGridPanel() {
		treeLoad.load(treeRoot, function() {
				});
		treePanel.expandAll();
		treePanel.getSelectionModel().select(treeRoot);

		ciTypeGridPanel.removeAll(true);
		var newGridPanel = createGridPanel();
		ciTypeGridPanel.add(newGridPanel);
		ciTypeGridPanel.doLayout();
		loadDataByType();
	}
}

function deleteAddCreateColumn(value) {
	var store = Ext.getCmp('addCiTypePanel').getStore();
	store.remove(store.getAt(store
			.find('columnSequence', value, 0, true, false)));
}
function deleteEditCreateColumn(value, columnSequence) {
	var store = Ext.getCmp('editCtGridPanel').getStore();
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
							msg : '删除操作将使此类型下的CI实例丢失该自定义属性，确认删除吗？',
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

function getExcelModel(ciTypeId) {
	location.href = "/itsm/cmdb/importCiExcel.do?method=getExcelModel&ciTypeId="
			+ ciTypeId;
}