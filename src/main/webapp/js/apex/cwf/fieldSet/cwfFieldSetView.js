Ext.namespace('Apex.cwf')
Apex.cwf.configurationTypeView = function() {
	var nodeId = '0';
	var checkboxselect = null;
	var addBtn;
	var saveBtn;
	var selectTop;
	var cwfFieldName='自定义表单属性库';
	var cwfFieldPrex ='cwf';
	var DataStore;
	var fieldName;
	var typeSelect =getTypeSelect();
	var selectObjects = new Object();
	var queryPaner = getQueryFieldPanel();
	var innerGridPanel = getEidtorPanel();
	var cwfFieldGridPanel = new Ext.Panel({
				id : 'configurationTypeGridPanel',
				border : false,
				margins : '5 5 5 0',
				layout : 'border',
				region : 'center',
				items : [queryPaner,innerGridPanel]
			});
	return cwfFieldGridPanel;

	

	
	
	
	function getEidtorPanel() {
		addBtn = new Ext.Button({
					id : 'addCtProperty',
					text : '添加一条属性',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addCtProperty
				});
		saveBtn = new Ext.Button({
					id : 'saveCtProperty',
					text : '保存',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.SAVE_BUTTON_PNG,
					handler : saveCtProperties
				});
		selectTop = new Ext.Button({
					id : 'selectTop',
					text : '添加到列表',
					cls : 'x-btn-text-icon',
					handler : addtoTable
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
			columns : [typeSelect,{
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
		//var vtem = fieldName.getValue();
		var store = new Ext.data.Store({
			proxy : new Ext.ux.data.DWRProxy({
						dwrFunction : CustomFormService.getCreateColumnList,
						Listeners : {
							'beforeLoad' : function(dataProxy, params) {
								//alert(params);
								var loadArgs = [0,20,fieldName.getValue()];
								params[dataProxy.loadArgsKey] = loadArgs;
							}
						}
					}),
			reader : reader
		});
		
		DataStore = store;
		
		
		
		
		
		
		pagingBar = new Ext.PagingToolbar({
					pageSize : 20,
					store : DataStore,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条记录，共 {2}条记录',
					emptyMsg : "没有符合条件的记录"
				});
				
		
		
		
		
		
		var editCtGridPanel = new Ext.grid.EditorGridPanel({
					id : 'editCtGridPanel',
					region : 'center',
					store : DataStore,
					plugins : [allowNullColumnEdit],
					cm : columns,
					sm : typeSelect,
					clicksToEdit : 1,
					enableHdMenu : false,
					tbar : ['属性列表    ', '-',addBtn, '-', saveBtn,'-',selectTop],
					//height : 590,
					bbar : pagingBar
				});
				
		editCtGridPanel.on('cellclick', function(panel, rowIndex, colIndex) {
					selectedRowIndex = rowIndex;
				});
		var editPanel = new Ext.Panel({
					border : false,
					layout : 'border',
					items : [editCtGridPanel]
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

		

		function addCtProperty() {
			var p = new record({
						columnSequence : store.data.length + 1
					});
			editCtGridPanel.stopEditing();
			store.insert(0, p);
			editCtGridPanel.startEditing(0, 3);
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
		
		function addtoTable(){
			
			if(window.parentEvent){
				window.parentEvent(selectObjects);
			}
		
		}

		function saveCtProperties() {
			var cwfField = {};
			cwfField.parentId = nodeId;
			cwfField.typeName = cwfFieldName;
			cwfField.typeCode = cwfFieldPrex;
			cwfField.typeMemo ="";
			var createColumnList = new Array();
			for (var i = 0; i < store.getCount(); i++) {
				createColumnList.push(store.getAt(i).data);
			};
			if (validatorColumn()) {
					CustomFormService.saveOrUpdataColumnList(
									createColumnList, {
										callback : function() {
											loadEditCtData();
											Ext.MessageBox.show({
													title : '提示',
													msg : '保存成功！',
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.INFO
												});
										},
										errorHandler : function(
												errorString,
												exception) {
											Ext.MessageBox.show({
												title : '错误',
												msg : '保存失败',
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
										}
									})

			}
		}
		function cancel() {
			changeToGridPanel();
			// location.href = "/itsm/cmdb/cwfField.do?method=enter";
		}
		loadEditCtData();
		return editCtGridPanel;

	};
	
	
	function loadEditCtData(key) {
			var value = "";
			if(key)value= key;
			var editMask = new Ext.LoadMask(Ext.getBody(), {
						msg : '正在加载数据，请稍候...',
						msgCls : 'ext-el-mask-msg'
					});
			editMask.show();
			DataStore.load({
						params : {
							start : 0,
							limit : 20,
							key : value
						},
						callback : function() {
							editMask.hide();
						}
					})
		}

	function getQueryFieldPanel(){
		fieldName = new Ext.form.TextField({
					fieldLabel : '名称',
					maxLength : 20,
					allowBlank : false,
					vtype : 'SpecialChar',
					anchor : '90%'
				});



		var formPanel = new Ext.FormPanel({
					frame : true,
					region : 'north',
					height : 80,
					fileUpload : true,
					margins : '5 0 5 0',
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
											items : fieldName,
											columnWidth : .35
										}]
							}],
				buttons : [{
					text : '查询',
					formBind : true,
					handler : function(){
						var vlaue  = fieldName.getValue();
						loadEditCtData(vlaue);
					}
				}, {
					text : '重置',
					handler : function(){
						formPanel.getForm().reset();
					}
				}]
				});

		fieldName.on('valid', function(obj) {
					/*if (ciTypePrex.isValid() && ciTypeMemo.isValid()) {
						saveBtn.setDisabled(false);
					}*/
				});
		return formPanel;
	
	}
	
	
	function errorReturn(id, msg) {
		changeToGridPanel();
		// location.href = "/itsm/cmdb/cwfField.do?method=enter";
	}

	function changeToGridPanel() {
			Ext.MessageBox.show({
								title : '确认',
								msg : '保存成功！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.OK
							});
/*
		cwfFieldGridPanel.removeAll(true);
		var newGridPanel = createGridPanel();
		cwfFieldGridPanel.add(newGridPanel);
		cwfFieldGridPanel.doLayout();
		loadDataByType();*/
	}

	function getTypeSelect(){
		return  new Ext.grid.CheckboxSelectionModel({
		    singleSelect : false,
			listeners : {
				'selectionchange' : function(sm) {
					if (sm == null) {
						selectObjects = new Object();
					} else {
						for(var i=0 ;i<sm.getSelections().length ;i++){
							var record  = sm.getSelections()[i]
							selectObjects[record.data.id]=record.data;
							//selectObjects.push(record.data);// = new Array(); record.data.columnSequence
							//alert(record.data.id + record.data.displayName);
							
						}
						/*if (sm.getSelections().length == 1 ) {
						} else if(sm.getSelections().length > 1){
						}else{
						}*/
					}
				}
			}
		});
	}
	

}



function deleteAddCreateColumn(value) {
	var store = Ext.getCmp('addCwfFieldPanel').getStore();
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
							msg : '此操作不可恢复，确认删除吗？',
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

