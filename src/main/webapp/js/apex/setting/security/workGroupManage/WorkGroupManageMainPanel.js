Ext.namespace('Apex.security');
/**
 * 部门管理主函数
 * 
 * @param {}
 *            cfg
 * @return {}
 */
Apex.security.WorkGroupManageMainPanel = function(cfg) {
	cfg = cfg || {};
	this.id = '-1';
	this.panelName = '工作组管理';
	Ext.apply(this, cfg);
	var parentId = '-1';
	var treeLoader = new Ext.ux.DWRTreeLoader({
				waitMessage : new Ext.LoadMask(Ext.getBody(), {
							msg : "正在读取数据，请稍等..."
						}),
				dwrCall : SecurityService.getWorkGroupTree
			});
	var root = new Ext.tree.AsyncTreeNode({
				text : '工作组结构',
				id : '-1',
				hasChildren : true,
				devNodeType : 'root',
				expanded : true
			});
	var tree = new Ext.tree.TreePanel({
				title : '工作组列表',
				region : "west",
				loader : treeLoader,
				root : root,
				width : 220,
				loadMask : {
					msg : 'Loading Tree...'
				},
				split : true,// 可拖动
				border : false,
				autoScroll : true,
				collapsible : true,
				enableColumnMove : false
			});
	tree.on("click", fn);

	function fn(node, event) {
		var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : "数据加载中，请稍后..."
				});
		myMask.show();
		store.load({
					params : {
						parentId : node.id
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
		parentId = node.id;
	}

	/** **************************grid************************* */
	var reader = new Ext.data.JsonReader({
				id : 'id',
				fields : [{
							name : 'id'
						}, {
							name : 'workGroupName'
						}, {
							name : 'workGroupMemo'
						}]
			});
	var store = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : SecurityService.getAllWorkGroupByParentId,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [params.parentId];
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
				header : 'id',
				sortable : true,
				hidden : true,
				dataIndex : 'id'
			}, {
				header : '工作组名称',
				sortable : true,
				dataIndex : 'workGroupName',
				renderer : function(data, ele, config) {
					return '<a href=# onclick="var prompt = new Apex.security.ShowWorkGroupMenberPanel({workGroupId : \''
							+ config.data.id
							+ '\'}); prompt.show();">'
							+ data
							+ '</a>';
				}
			}, {
				header : '工作组描述',
				sortable : true,
				dataIndex : 'workGroupMemo'
			}]);
	var add_button = new Ext.Button({
				text : '添加',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.ADD_BUTTON_PNG,
				minWidth : 80
			});
	var delete_button = new Ext.Button({
				text : '删除',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				minWidth : 80
			});
	delete_button.disable();
	var edit_button = new Ext.Button({
				text : '修改',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EDIT_BUTTON_PNG,
				minWidth : 80
			});
	edit_button.disable();
	var rightPanel = new Ext.grid.GridPanel({
				region : 'center',
				// margins : '5 0 5 0',
				store : store,
				border : false,
				cm : columns,
				sm : checkboxSelect,
				enableHdMenu : false,
				tbar : [add_button, {
							xtype : 'tbseparator'
						}, delete_button, {
							xtype : 'tbseparator'
						}, edit_button],
				autoExpandColumn : 4
			});
	rightPanel.on('rowclick', function(grid, rowIndex, e) {
				var selectios = grid.getSelectionModel().getSelections().length;
				if (selectios < 1) {
					delete_button.disable();
					edit_button.disable();
				} else if (selectios == 1) {
					delete_button.enable();
					edit_button.enable();
				} else {
					edit_button.disable();
					delete_button.enable();
				}
			});
	add_button.on("click", function(data) {
		Apex.security.WorkGroupManageMainPanel.showWindow(function(data) {
					var myMask = new Ext.LoadMask(Ext.getBody(), {
								msg : "数据处理中，请稍后..."
							});
					myMask.show();
					SecurityService.addWorkGroup(data.workGroupName,
							data.workGroupMemo, parentId, {
								callback : function(dbId) {
									store.reload();
									treeLoader.load(tree.getRootNode(), function() {
										});
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
				});
	});
	edit_button.on("click", function(data) {
		var selectRows = rightPanel.getSelectionModel().getSelections();
		if (!Ext.isEmpty(selectRows) && selectRows.length == 1) {
			Apex.security.WorkGroupManageMainPanel.showWindow({
						workGroupName : selectRows[0].get('workGroupName'),
						workGroupMemo : selectRows[0].get('workGroupMemo')
					}, function(data) {
						var myMask = new Ext.LoadMask(Ext.getBody(), {
									msg : "数据处理中，请稍后..."
								});
						myMask.show();
						SecurityService.updateWorkGroup(
								selectRows[0].get('id'), data.workGroupName,
								data.workGroupMemo, {
									callback : function() {
										store.reload();
										var node = tree
												.getNodeById(selectRows[0]
														.get('id'));
										node.setText(data.workGroupName);
										myMask.hide();
									},
									errorHandler : function(errorString,
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
					});
		}
	});

	delete_button.on("click", function(data) {
		var selectRows = rightPanel.getSelectionModel().getSelections();
		var list = [];
		var ids = [];
		for (var i = 0; i < selectRows.length; i++) {
			list.push(selectRows[i].get('workGroupName'))
			ids.push(selectRows[i].get('id'))

		}
		Ext.MessageBox.confirm('确认', '确认删除所选择的工作组吗？',
				function callBackFunction(option) {
					if (option == 'yes') {
						if (!Ext.isEmpty(selectRows) && selectRows.length > 0) {
							var myMask = new Ext.LoadMask(Ext.getBody(), {
										msg : "数据处理中，请稍后..."
									});
							myMask.show();
							SecurityService.deleteWorkGroups(ids, {
								callback : function() {
									store.reload();
									for (var i = 0; i < ids.length; i++) {
										var node = tree.getNodeById(ids[i]);
										node.remove();
									}
									myMask.hide();
									// Ext.MessageBox.show({
									// title : '提示',
									// msg : '工作组删除成功！',
									// buttons : Ext.MessageBox.OK,
									// icon : Ext.MessageBox.INFO
									// });
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
						}

					} else {
						return;

					}
				});

	});

	checkboxSelect.on('selectionchange', function(selModel) {
				var selectios = rightPanel.getSelectionModel().getSelections().length;
				if (selectios < 1) {
					delete_button.disable();
					edit_button.disable();
				} else if (selectios == 1) {
					delete_button.enable();
					edit_button.enable();
				} else {
					edit_button.disable();
					delete_button.enable();
				}
			});
	var panel = new Ext.Panel({
				id : this.id,
				layout : "border",
				border : false,
				width : 1000,
				height : 600,
				items : [tree, rightPanel]
			});
	return panel;
}

/**
 * 添加修改的弹出窗口
 * 
 * @param {}
 *            config : workGroupName 部门名 workGroupMemo 部门备注
 * @param callback
 *            回调函数
 */
Apex.security.WorkGroupManageMainPanel.showWindow = function(config, callback) {
	config = config || {};
	this.workGroupName = undefined;
	this.workGroupMemo = undefined;
	if (!Ext.isEmpty(config) && typeof config == 'function') {
		callback = config;
		config = undefined;
	} else {
		Ext.apply(this, config);
	}
	var canel = new Ext.Button({
				minWidth : 50,
				text : '取消',
				handler : function() {
					win.destroy();
				}
			});
	var ok = new Ext.Button({
				minWidth : 50,
				text : '确定',
				formBind : true,
				handler : function() {
					if (!Ext.isEmpty(callback)
							&& typeof callback === 'function')
						callback(getInputValue());
					win.destroy();
				}
			});
	var workGroupNameField = new Ext.form.TextField({
				id : 'workGroupName',
				fieldLabel : '名称',
				vtype : 'SpecialChar',
				allowBlank : false,
				minLength : 1,
				maxLength : 30,
				anchor : '90%',
				value : this.workGroupName
			});
	// var namePanel = new Ext.FormPanel({
	// region : 'north',
	// monitorValid : true,
	// frame : true,
	// labelWidth : 60,
	// items : workGroupNameField
	// });
	var workGroupMemoArea = new Ext.form.TextArea({
				id : 'workGroupMemo',
				vtype : 'SpecialChar',
				allowBlank : false,
				minLength : 1,
				maxLength : 255,
				height : 170,
				width : 300,
				fieldLabel : '描述',
				anchor : '90%',
				value : this.workGroupMemo
			});
	// var memoPanel = new Ext.FormPanel({
	// region : 'center',
	// monitorValid : true,
	// frame : true,
	// labelWidth : 60,
	// items : workGroupMemoArea
	// });
	var form_panel = new Ext.form.FormPanel({
				region : 'center',
				bodyStyle : 'padding:15px 5px 0',
				// defaultType : "textfield",
				// layout:'border',
				monitorValid : true,
				frame : true,
				border : false,
				labelWidth : 60,
				items : [workGroupNameField, workGroupMemoArea],
				buttons : [ok, canel],
				buttonAlign : 'center'
			})
	var getInputValue = function() {
		var result = {};
		result = form_panel.getForm().getValues(false);
		return result;
	};
	var win = new Ext.Window({
				title : this.workGroupName ? '修改' : '添加',
				layout : 'border',
				resizable : false,
				modal : true,
				border : false,
				width : 500,
				height : 300,
				items : [form_panel]
			});
	win.show();
}