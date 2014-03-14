Ext.namespace('Apex.asset')
Apex.asset.FlexValueGridPanel = function() {
	var formId = null;
	var editBtn = null;
	var deleteBtn = null;
	var addBtn = null;
	var checkboxSelect = null;
	var record = Ext.data.Record.create([{
				name : 'id'
			}, {
				name : 'name'
			}, {
				name : 'enabled'
			}, {
				name : 'discription'
			}]);
	var reader = new Ext.data.JsonReader({
				totalProperty : 'totalCount',
				root : 'flexValueSetList',
				id : 'id'
			}, record);

	var store = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : FlexValueSetService.getFlexValueSetList,
							listeners : {

								'beforeload' : function(dataProxy, params) {
									var loadArgs = [params.start, params.limit];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});

	var pagingBar = new Ext.PagingToolbar({
				pageSize : 20,
				store : store,
				displayInfo : true,
				displayMsg : '显示 {0} - {1} 条值集表，共 {2}条值集表',
				emptyMsg : '没有任何值集表'
			});

	var flexValueGridPanel = createFlexValuePanel();

	function createFlexValuePanel() {
		editBtn = new Ext.Button({
					text : '编辑',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.EDIT_BUTTON_PNG,
					disabled : true,
					handler : editFlexValueSet
				});
		deleteBtn = new Ext.Button({
					text : '删除',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.DELETE_BUTTON_PNG,
					disabled : true,
					handler : deleteFlexValueSet
				})
		addBtn = new Ext.Button({
					text : '添加',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addFlexValueSet
				})

		checkboxSelect = new Ext.grid.CheckboxSelectionModel({
					singleSelect : false
				});
		checkboxSelect.on('selectionchange', handleCheckChange);
		function handleCheckChange(checkMode) {
			if (checkMode.getCount() == 0) {
				editBtn.setDisabled(true);
				deleteBtn.setDisabled(true);
			} else if (checkMode.getCount() == 1) {
				editBtn.setDisabled(false);
				deleteBtn.setDisabled(false);
			} else {
				editBtn.setDisabled(true);
				deleteBtn.setDisabled(false);
			}
		}
		var columns = [new Ext.grid.RowNumberer(), checkboxSelect, {
					header : 'Id',
					dataIndex : 'id',
					hidden : true,
					sortable : true
				}, {
					header : '值集名称',
					dataIndex : 'name',
					width : 120,
					sortable : true,
					renderer : function(data) {
						return '<pre>' + data + '</pre>';
					}
				}, {
					header : '描述',
					dataIndex : 'discription',
					width : 200,
					sortable : true,
					renderer : function(data) {
						return '<pre>' + data + '</pre>';
					}
				}];

		var panel = new Ext.grid.GridPanel({
					id : 'Apex.asset.FlexValueSetGridPanel',
					region : 'center',
					store : store,
					columns : columns,
					sm : checkboxSelect,
					autoScroll : true,
					enableHdMenu : false,
					autoExpandColumn : 4,
					margins : '5,0,0,0',
					height : 530,
					tbar : [addBtn, '-', deleteBtn, '-', editBtn],
					bbar : pagingBar
				});
		return panel;
	}
	loadFlexValueSetData();

	var mainPanel = new Ext.Panel({
				id : 'FlexValueGridPanel.mainPanel',
				border : false,
				layout : 'fit',
				autoScroll : true,
				closable : false,
				items : [flexValueGridPanel]
			})

	return mainPanel;

	function loadFlexValueSetData() {
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
					msg : "正在加载数据，请稍侯...",
					msgCls : 'ext-el-mask-msg'
				});
		loadMask.show();

		store.load({
					params : {
						start : 0,
						limit : 20
					},
					callback : function() {
						editBtn.setDisabled(true);
						deleteBtn.setDisabled(true);
						loadMask.hide()
					}

				});
	};

	function addFlexValueSet() {

		var addBtn = new Ext.Button({
					text : '下一步',
					cls : 'x-btn-text-icon',
					icon : 'images/icons/add.gif',
					handler : saveFlexValueSet,
					formBind : true
				});

		var flexName = new Ext.form.TextField({
					id : 'FlexValueSetPanel.name',
					allowBlank : false,
					name : 'name',
					fieldLabel : '值集名称',
					anchor : '90%',
					vtype : 'SpecialChar',
					maxLength : 100
				});

		var discription = new Ext.form.TextArea({
					id : 'FlexValueSetPanel.discription',
					fieldLabel : '描述',
					name : 'discription',
					anchor : '96%',
					maxLength : 1000
				});

		var columns = new Ext.grid.ColumnModel({
					defaults : {
						sortable : true
					},
					columns : [{
								header : 'Id',
								dataIndex : 'id',
								width : 10,
								hidden : true
							}, {
								header : '序列',
								dataIndex : 'columnSequence',
								width : 50,
								editor : new Ext.form.TextField({
											allowBlank : false
										})
							}, {
								header : '名称',
								dataIndex : 'name',
								width : 200,
								editor : new Ext.form.TextField({
											vtype : 'SpecialChar',
											allowBlank : false,
											maxLength : 20,
											maxLengthText : '最大长度不能超过20'
										})
							},
							// enabledFlex,
							{
								header : '默认值',
								dataIndex : 'defaultValue',
								width : 10,
								editor : new Ext.form.Radio({
											vtype : 'SpecialChar',
											maxLength : 20,
											allowBlank : false
										}),
								hidden : true
							}, {
								header : '描述',
								dataIndex : 'discription',
								width : 300,
								editor : new Ext.form.TextField({
											vtype : 'SpecialChar',
											maxLength : 255,
											maxLengthText : '最大长度不能超过255'
										})
							}, {
								header : 'setId',
								dataIndex : 'setId',
								width : 10,
								hidden : true
							}]
				});
		var record = Ext.data.Record.create([{
					name : 'id'
				}, {
					name : 'columnSequence'
				}, {
					name : 'name'
				}, {
					name : 'flexValue'
				},
				// {name : 'enabled'},
				{
					name : 'defaultValue'
				}, {
					name : 'discription'
				}, {
					name : 'setId'
				}]);

		var reader = new Ext.data.JsonReader({
					totalProperty : 'totalCount',
					root : 'flexValueList',
					id : 'id'
				});

		var store = new Ext.data.Store({
					reader : reader
				});
		// save the list of flexValue
		var saveBtn = new Ext.Button({
					id : 'add.save',
					text : '保存',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.SAVE_BUTTON_PNG,
					handler : saveFlexValue
				});
		// the button of add a row insert to edit grid panel
		var addFlexBtn = new Ext.Button({
					text : '添加',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addGridRow
				});
		// the function of add a row insert to edit grid panel
		function addGridRow() {
			var p = new record({
						columnSequence : store.data.length + 1,
						name : '',
						flexValue : '',
						description : ''
					});
			flexValuePanel.stopEditing();
			store.insert(0, p);
			flexValuePanel.startEditing(0, 2);
		}

		var pagingBar = new Ext.PagingToolbar({
					pageSize : 20,
					store : store,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条值集属性，共 {2}条值集属性',
					emptyMsg : '没有任何值集表'
				});

		var flexValuePanel = new Ext.grid.EditorGridPanel({
					id : 'flexValuePanel',
					region : 'center',
					store : store,
					cm : columns,
					autoScroll : true,
					enableHdMenu : false,
					title : '值集属性',
					clicksToEdit : 1,
					// plugins:checkColumn,
					height : 530,
					margin : '5,0,0,0',
					hidden : true,
					bbar : pagingBar,
					tbar : [addFlexBtn, '-', saveBtn]
				});

		// create formPanel
		var headerPanel = new Ext.form.FormPanel({
					frame : true,
					id : 'Apex.assetTypeConfigure.formPanel',
					name : 'CreateForm',
					height : 140,
					frame : true,
					region : 'north',
					monitorValid : true,
					items : [{
								xtype : 'panel',
								layout : 'column',
								labelWidth : 80,
								defaults : {
									border : false,
									layout : 'form',
									labelWidth : 80,
									columnWidth : .75
								},
								items : [{
											items : flexName
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
											items : discription
										}]
							}],
					buttons : [{
						text : '下一步',
						id : 'formPanel.next',
						disabled : true,
						handler : saveFlexValueSet
							// formBind : true
						}],
					buttonAlign : 'center'
				});
		discription.on('invalid', function() {
					Ext.getCmp('formPanel.next').setDisabled(true);
					Ext.getCmp('add.save').setDisabled(true);
				})
		flexName.on('invalid', function() {
					Ext.getCmp('formPanel.next').setDisabled(true);
					Ext.getCmp('add.save').setDisabled(true);
				})

		flexName.on('valid', function(obj) {
					Ext.getCmp('add.save').setDisabled(false);
					Ext.getCmp('formPanel.next').setDisabled(false);
				});
		discription.on('valid', function(obj) {
					flexName.on('valid', function(obj) {
								Ext.getCmp('add.save').setDisabled(false);
								Ext.getCmp('formPanel.next').setDisabled(false);
							})
				});

		var panel = new Ext.Panel({
					layout : 'border',
					autoScroll : true,
					id : id,
					closable : false,
					border : true,
					items : [headerPanel, flexValuePanel]
				});
		mainPanel.removeAll(true);
		mainPanel.add(panel);
		mainPanel.doLayout();

		// valid the flexValueSet's name is not null
		function valid() {
			var data = flexName.getValue().trim();
			if (Ext.isEmpty(data)) {
				showErrMessage('值集名称不能为空！');
				return false;
			}
			return true;
		};

		// this function is to save flexValueSet and a row insert to the edit
		// grid
		// panel
		function saveFlexValueSet() {
			if (valid()) {
				Ext.getCmp('formPanel.next').setDisabled(true);
				var editGridPanel = Ext.getCmp('flexValuePanel');
				editGridPanel.setVisible(true);
				mainPanel.doLayout();
				// addGridRow();
			}
		}
		// valid the flexValue's name is not null
		function validFlexValue() {
			var list = new Array();
			for (var i = 0; i < store.getCount(); i++) {
				var flexValue = store.getAt(i);
				if (Ext.isEmpty(flexValue.get('name'))) {
					showErrMessage('值集名称不能为空！');
					return false;
				}
			}
			return true;
		};

		function saveFlexValue() {
			if (validFlexValue()) {
				var list = new Array();
				for (var i = 0; i < store.getCount(); i++) {
					list.push(store.getAt(i).data);
				}
				var myMask = new Ext.LoadMask(Ext.getBody(), {
							msg : "数据处理中，请稍后..."
						});
				myMask.show();
				var flexValueSet = headerPanel.getForm().getValues();
				FlexValueSetService.checkNameDuplicate(flexName.getValue(),
						function(returnValue) {
							if (!returnValue) {
								Ext.Msg.show({
											title : '错误',
											msg : '值集名称重复！',
											model : true,
											buttons : Ext.Msg.OK,
											icon : Ext.Msg.ERROR
										})
								myMask.hide();
							} else {
								FlexValueService.saveFlexValues(list,
										flexValueSet, {
											callback : function() {
												mainPanel.removeAll(true);
												var gridPanel = createFlexValuePanel();
												mainPanel.add(gridPanel);
												mainPanel.doLayout();
												loadFlexValueSetData();
												myMask.hide();
											},
											errorHandler : function(
													errorString, exception) {
												myMask.hide();
												Ext.MessageBox.show({
													title : '错误',
													msg : exception.message,
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
											}
										});
							}
						})

			}

		}

	}

	function editFlexValueSet() {
		var selectRecord = checkboxSelect.getSelected();

		var flexNameEdit = new Ext.form.TextField({
					id : 'FlexValueSetPanel.name',
					allowBlank : false,
					name : 'name',
					fieldLabel : '值集名称',
					value : Ext.util.Format
							.htmlDecode(selectRecord.get('name')),
					vtype : 'SpecialChar',
					anchor : '90%',
					maxLength : 100
				});

		var discriptionEdit = new Ext.form.TextArea({
			id : 'FlexValueSetPanel.discription',
			fieldLabel : '描述',
			name : 'discription',
			value : Ext.util.Format.htmlDecode(selectRecord.get('discription')),
			anchor : '96%',
			maxLength : 1000
		});
		var formPanelEdit = new Ext.form.FormPanel({
					frame : true,
					id : 'Apex.assetTypeConfigure.formPanel',
					name : 'CreateForm1',
					height : 120,
					frame : true,
					region : 'north',
					monitorValid : true,
					items : [{
								xtype : 'panel',
								layout : 'column',
								labelWidth : 80,
								defaults : {
									border : false,
									layout : 'form',
									labelWidth : 80,
									columnWidth : .5
								},
								items : [{
											items : flexNameEdit
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
											items : discriptionEdit
										}]
							}],
					buttonAlign : 'center'
				});

		formId = selectRecord.get('id');
		var checkSelectEdit = new Ext.grid.CheckboxSelectionModel({
			singleSelected : false
				// moveEditorOnEnter : true
			});

		var columnsEdit = new Ext.grid.ColumnModel({
					defaults : {
						sortable : true
					},
					columns : [{
								header : 'Id',
								dataIndex : 'id',
								width : 10,
								hidden : true
							}, {
								header : '序列',
								dataIndex : 'columnSequence',
								width : 50,
								editor : new Ext.form.TextField({
											allowBlank : false
										})
							}, {
								header : '名称',
								dataIndex : 'name',
								width : 200,
								editor : new Ext.form.TextField({
											vtype : 'SpecialChar',
											allowBlank : false,
											maxLength : 20,
											maxLengthText : '最大长度不能超过20'
										})
							}, {
								header : '默认值',
								dataIndex : 'defaultValue',
								width : 10,
								editor : new Ext.form.Radio({
											vtype : 'SpecialChar',
											maxLength : 20,
											allowBlank : false
										}),
								hidden : true
							}, {
								header : '描述',
								dataIndex : 'discription',
								width : 300,
								editor : new Ext.form.TextField({
											vtype : 'SpecialChar',
											maxLength : 255,
											maxLengthText : '最大长度不能超过255'
										})
							}, {
								header : 'setId',
								dataIndex : 'setId',
								width : 10,
								hidden : true
							}]
				});
		var recordEdit = Ext.data.Record.create([{
					name : 'id'
				}, {
					name : 'columnSequence'
				}, {
					name : 'name'
				}, {
					name : 'flexValue'
				}, {
					name : 'defaultValue'
				}, {
					name : 'discription'
				}, {
					name : 'setId'
				}]);

		var readerEdit = new Ext.data.JsonReader({
					totalProperty : 'totalCount',
					root : 'flexValueList',
					id : 'id'
				}, recordEdit);

		var storeEdit = new Ext.data.Store({
					proxy : new Ext.ux.data.DWRProxy({
								dwrFunction : FlexValueService.getFlexValueList,
								listeners : {
									'beforeload' : function(dataProxy, params) {
										// var userName = USER.getUserName();
										var loadArgs = [params.start,
												params.limit, formId];
										params[dataProxy.loadArgsKey] = loadArgs;
									}
								}
							}),
					reader : readerEdit
				});

		var pagingBar = new Ext.PagingToolbar({
					pageSize : 20,
					store : storeEdit,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条值集属性，共 {2}条值集属性',
					emptyMsg : '没有任何值集属性'
				});
		// save the list of flexValue
		var saveBtnEdit = new Ext.Button({
					id : 'edit.save',
					text : '保存',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.SAVE_BUTTON_PNG,
					handler : saveFlexValueEdit
				});
		// the button of add a row insert to edit grid panel
		var addFlexBtnEdit = new Ext.Button({
					text : '添加',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addGridRowEdit
				});
		// the function of add a row insert to edit grid panel
		function addGridRowEdit() {
			var p = new record({
						columnSequence : storeEdit.data.length + 1,
						name : '',
						flexValue : '',
						description : ''
					});
			flexValuePanelEdit.stopEditing();
			storeEdit.insert(0, p);
			flexValuePanelEdit.startEditing(0, 2);
		}
		// create the editor grid panel
		var flexValuePanelEdit = new Ext.grid.EditorGridPanel({
					id : 'flexValuePanel',
					region : 'center',
					store : storeEdit,
					cm : columnsEdit,
					title : '值集属性',
					sm : checkSelectEdit,
					autoScroll : true,
					enableHdMenu : false,
					clicksToEdit : 1,
					bbar : pagingBar,
					margin : '5,0,0,0',
					tbar : [addFlexBtnEdit, '-', saveBtnEdit]
				});
		loadFlexValueData();
		// create formPanel

		flexNameEdit.on('valid', function(obj) {
					discriptionEdit.on('valid', function(obj) {
								Ext.getCmp('edit.save').setDisabled(false);
							})
				});
		discriptionEdit.on('valid', function(obj) {
					flexNameEdit.on('valid', function(obj) {
								Ext.getCmp('edit.save').setDisabled(false);
							})
				});

		flexNameEdit.on('invalid', function(obj) {
					Ext.getCmp('edit.save').setDisabled(true);
				});

		discriptionEdit.on('invalid', function(obj) {
					Ext.getCmp('edit.save').setDisabled(true);
				});

		function loadFlexValueData() {
			var loadMask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在加载数据，请稍侯...",
						msgCls : 'ext-el-mask-msg'
					});
			loadMask.show();

			storeEdit.load({
						params : {
							start : 0,
							limit : 20
						},
						callback : function() {
							loadMask.hide()
						}

					});
		}
		// valid the flexValueSet's name is not null
		function valid() {
			var data = flexName.getValue().trim();
			if (Ext.isEmpty(data)) {
				showErrMessage('值集名称不能为空！');
				return false;
			}
			return true;
		};
		// valid the flexValue's name is not null
		function validFlexValue() {
			var list = [];
			for (var i = 0; i < storeEdit.getCount(); i++) {
				var flexValue = storeEdit.getAt(i);
				if (Ext.isEmpty(flexValue.get('name'))) {
					showErrMessage('值集名称不能为空！');
					return false;
				}
			}
			return true;
		};

		function saveFlexValueEdit() {
			if (validFlexValue()) {
				var list = new Array();
				for (var i = 0; i < storeEdit.getCount(); i++) {
					list[i] = storeEdit.getAt(i).data;
				}
				var myMask = new Ext.LoadMask(Ext.getBody(), {
							msg : "数据处理中，请稍后..."
						});
				myMask.show();
				var flexValueSet = {};
				flexValueSet.name = Ext.util.Format.htmlDecode(flexNameEdit
						.getValue());
				flexValueSet.id = selectRecord.get('id');
				flexValueSet.discription = Ext.util.Format
						.htmlDecode(discriptionEdit.getValue());

				var idAry = new Array();
				idAry.push(formId);

				FlexValueSetService.checkFlexValueSetExist(idAry, function(
						returnValue) {
					if (!returnValue) {
						Ext.Msg.show({
									title : '错误',
									msg : '对不起，值集已被删除，请联系管理员！',
									model : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								})
						loadFlexValueSetData();
						return;
					} else {
						FlexValueSetService.checkEditNameDuplicate(flexNameEdit
										.getValue(), selectRecord.get('name'),
								function(returnValue) {
									if (!returnValue) {
										Ext.Msg.show({
													title : '错误',
													msg : '值集名称重复！',
													model : true,
													buttons : Ext.Msg.OK,
													icon : Ext.Msg.ERROR
												})
										myMask.hide();
										return;
									} else {
										FlexValueService.saveFlexValues(list,
												flexValueSet, {
													callback : function() {
														mainPanel
																.removeAll(true);
														var gridPanel = createFlexValuePanel();
														mainPanel
																.add(gridPanel);
														mainPanel.doLayout();
														loadFlexValueSetData();
														myMask.hide();
													},
													errorHandler : function(
															errorString,
															exception) {
														myMask.hide();
														Ext.MessageBox.show({
															title : '错误',
															msg : exception.message,
															buttons : Ext.MessageBox.OK,
															icon : Ext.MessageBox.ERROR
														});
													}
												});
									}

								})

					}
				})

			};

		}

		var mainEditPanelEdit = new Ext.Panel({
					id : 'FlexValueGridPanel.mainEditPanel',
					layout : 'border',
					autoScroll : true,
					border : false,
					closable : false,
					items : [formPanelEdit, flexValuePanelEdit]
				});
		var selectedRecord = checkboxSelect.getSelections();
		var idAry = new Array();
		for (var i = 0; i < selectedRecord.length; i++) {
			idAry.push(selectedRecord[i].get('id'));
		}
		FlexValueSetService.checkFlexValueSetExist(idAry,
				function(returnValue) {
					if (!returnValue) {
						Ext.Msg.show({
									title : '错误',
									msg : '对不起，值集已被删除，请联系管理员！',
									model : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								})
						loadFlexValueSetData();
						return;
					} else {
						mainPanel.removeAll(true);
						mainPanel.add(mainEditPanelEdit);
						mainPanel.doLayout();
					}
				})

	};
	function deleteFlexValueSet() {
		Ext.Msg.buttonText.yes = '确认';
		Ext.Msg.buttonText.no = '取消';
		Ext.Msg.show({
					title : '确认',
					msg : '确定要删除吗？',
					model : true,
					fn : callBack,
					buttons : Ext.Msg.OKCANCEL,
					icon : Ext.Msg.INFO
				})

	};

	function callBack(id, msg) {
		if (id == 'ok') {
			var selectedRecord = checkboxSelect.getSelections();
			var idAry = new Array();
			for (var i = 0; i < selectedRecord.length; i++) {
				idAry.push(selectedRecord[i].get('id'));
			}
			FlexValueSetService.checkFlexValueSetExist(idAry, function(
					returnValue) {
				if (!returnValue) {
					Ext.Msg.show({
								title : '错误',
								msg : '对不起，值集已被删除，请联系管理员！',
								model : true,
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.ERROR
							})
					loadFlexValueSetData();
					return;
				} else {
					FlexValueSetService.canFlexValueSetListDelete(idAry,
							function(returnValue) {
								if (returnValue) {
									Ext.Msg.show({
												title : '错误',
												msg : '值集被资产类型引用，删除失败！',
												model : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.ERROR
											})
									return;
								} else {
									FlexValueSetService.deleteFlexValueSet(
											idAry, function(returnValue) {
												if (!returnValue) {
													Ext.Msg.show({

																title : '错误',
																msg : '发生错误或异常，删除失败！',
																model : true,
																buttons : Ext.Msg.OK,
																icon : Ext.Msg.ERROR
															})
												};
												loadFlexValueSetData();
											})
								}
							})
				}
			})

		}
	}

}