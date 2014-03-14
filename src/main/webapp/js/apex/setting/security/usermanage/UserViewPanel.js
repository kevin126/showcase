Ext.namespace('Apex.security');
Apex.security.UserViewPanel = function(type) {
	// 运维人员还是普通用户
	var userType = type;
	// 用户查询页面
	var QueryCondition = Ext.data.Record.create([]);
	var defaultValue = new QueryCondition({
				userName : '',// 用户名
				realName : '',// 姓名
				mail : '', // 邮件
				department : '' // 部门

			});
	var userName = '';// 用户名
	var realName = '';// 姓名
	var mail = ''; // 邮件
	var department = ''; // 部门

	var userName = new Ext.form.TextField({
				name : 'userName',
				id : 'userNameId',
				fieldLabel : '用户名',
				maxLength : 20,
				vtype : 'SpecialChar',
				width : 150
			});
	var realName = new Ext.form.TextField({
				name : 'realName',
				id : 'realNameId',
				vtype : 'SpecialChar',
				fieldLabel : '姓名',
				maxLength : 20,
				width : 150
			});
	var mail = new Ext.form.TextField({
				fieldLabel : '邮件 ',
				id : 'mailId',
				vtype : 'SpecialChar',
				width : 150,
				maxLength : 50,
				name : 'mail'
			});
	var department = new Ext.form.TriggerField({
				fieldLabel : '部门',
				id : 'departmentId',
				readOnly : true,
				anchor : '90%',
				onTriggerClick : getDept
			});
	var queryConditionsPanel = new Ext.form.FormPanel({
				frame : true,
				region : 'north',
				labelWidth : 45,
				monitorValid : true,
				border : false,
				height : 70,
				layout : 'column',
				items : [{
							columnWidth : .25,
							defaultType : 'textfield',
							layout : 'form',
							items : userName
						}, {
							columnWidth : .25,
							defaultType : 'textfield',
							layout : 'form',
							items : realName
						}, {
							columnWidth : .25,
							defaultType : 'textfield',
							layout : 'form',
							items : mail
						}, {
							columnWidth : .25,
							defaultType : 'textfield',
							layout : 'form',
							items : department
						}],
				buttons : [{
							text : '查询',
							formBind : true,
							handler : ExactQuery
						}, {
							text : '重置',
							handler : resetQueryCondition
						}]
			});
	department.on("click", getDept);
	function getDept() {
		var win = new MultipleSelectDept("departmentId");
		win.show();
	}

	function resetQueryCondition() {
		queryConditionsPanel.getForm().loadRecord(defaultValue);
		department.setValue("");
	}
	function ExactQuery() {
		addcondition();
	}
	// 用户查询页面结束
	var reader = new Ext.data.JsonReader({
				totalProperty : "totalCount",
				root : "dataList",
				id : "id",
				fields : [{
							name : 'id'
						}, {
							name : 'userName'
						}, {
							name : 'enabled'
						}, {
							name : 'allRollStr'
						}, {
							name : 'lastLoginTime'
						}, {
							name : 'department'
						}, {
							name : 'workGroupName'
						}, {
							name : 'mail'
						}, {
							name : 'mobile'
						}, {
							name : 'realName'
						}]
			});

	var store = new Ext.data.Store({
				storeId : 'user_store_id',

				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : SecurityService.getAllUserByPaging,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									params.type = userType;
									var loadArgs = [params.start, params.limit,
											params.type, params.userName,
											params.realName, params.mail,
											params.department];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});
	store.setDefaultSort('id', 'asc');
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();// table中显示checkbox
	var columns;
	if (userType == "commonUser") {
		columns = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
				checkboxSelect, {
					header : "ID",
					dataIndex : 'id',
					hidden : true
				}, {
					header : "用户名",
					sortable : true,
					width : 80,
					dataIndex : 'userName',
					renderer : function(data, ele, config) {
						if (Ext.isEmpty(data))
							return;
						else {
							return '<a href="/itsm/security/userMgt.do?method=userDetails&id='
									+ config.id
									+ '&menuId=m7_0">'
									+ data
									+ '</a>';
						};
					},
					align : 'center'
				}, {
					header : "姓名",
					sortable : true,
					width : 80,
					dataIndex : 'realName',
					renderer : function(data, ele, config) {
						if (Ext.isEmpty(data))
							return;
						else {
							return '<a href="/itsm/security/userMgt.do?method=userDetails&id='
									+ config.id
									+ '&menuId=m7_0">'
									+ data
									+ '</a>';
						};
					},
					align : 'center'
				}, {
					header : "部门",
					sortable : true,
					width : 80,
					dataIndex : 'department',
					renderer : function(data) {
						if (Ext.isEmpty(data))
							return;
						else {
							return data;
						};
					},
					align : 'center'
				}, {
					header : "角色",
					sortable : true,
					width : 140,
					dataIndex : 'allRollStr',
					renderer : function(data) {
						if (Ext.isEmpty(data))
							return;
						else {
							return data;
						};
					},
					align : 'center'
				}, {
					header : "邮件地址",
					sortable : true,
					dataIndex : 'mail',
					width : 140,
					renderer : function(data) {
						if (Ext.isEmpty(data))
							return;
						else {
							return data;
						};
					},
					align : 'center'
				}, {
					header : "电话",
					sortable : true,
					width : 140,
					dataIndex : 'mobile',
					renderer : function(data) {
						if (Ext.isEmpty(data))
							return;
						else {
							return data;
						};
					},
					align : 'center'
				}, {
					header : "最后登录时间",
					sortable : true,
					width : 170,
					dataIndex : 'lastLoginTime',
					renderer : dateFormat,
					align : 'center'
				}, {
					header : "状态",
					sortable : true,
					dataIndex : 'enabled',
					align : 'center',
					renderer : function(data) {
						if (data == 1)
							return Apex.EnumsConstants.UserStatesEnum.ENABLE;
						else if (data == 2)
							return Apex.EnumsConstants.UserStatesEnum.DISABLE;
						else
							return '未知';
					}
				}]);
	} else {
		columns = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
				checkboxSelect, {
					header : "ID",
					dataIndex : 'id',
					hidden : true
				}, {
					header : "用户名",
					sortable : true,
					width : 80,
					dataIndex : 'userName',
					renderer : function(data, ele, config) {
						if (Ext.isEmpty(data))
							return;
						else {
							return '<a href="/itsm/security/userMgt.do?method=userDetails&id='
									+ config.id
									+ '&menuId=m7_0">'
									+ data
									+ '</a>';
						};
					},
					align : 'center'
				}, {
					header : "姓名",
					sortable : true,
					width : 80,
					dataIndex : 'realName',
				renderer : function(data, ele, config) {
						if (Ext.isEmpty(data))
							return;
						else {
							return '<a href="/itsm/security/userMgt.do?method=userDetails&id='
									+ config.id
									+ '&menuId=m7_0">'
									+ data
									+ '</a>';
						};
					},
					align : 'center'
				}, {
					header : "部门",
					sortable : true,
					width : 80,
					dataIndex : 'department',
					renderer : function(data) {
						if (Ext.isEmpty(data))
							return;
						else {
							return data;
						};
					},
					align : 'center'
				}, {
					header : "工作组",
					sortable : true,
					width : 80,
					dataIndex : 'workGroupName',
					renderer : function(data) {
						if (Ext.isEmpty(data))
							return;
						else {
							return data;
						};
					},
					align : 'center'
				}, {
					header : "角色",
					sortable : true,
					width : 140,
					dataIndex : 'allRollStr',
					renderer : function(data) {
						if (Ext.isEmpty(data))
							return;
						else {
							return data;
						};
					},
					align : 'center'
				}, {
					header : "邮件地址",
					sortable : true,
					dataIndex : 'mail',
					width : 140,
					renderer : function(data) {
						if (Ext.isEmpty(data))
							return;
						else {
							return data;
						};
					},
					align : 'center'
				}, {
					header : "电话",
					sortable : true,
					width : 140,
					dataIndex : 'mobile',
					renderer : function(data) {
						if (Ext.isEmpty(data))
							return;
						else {
							return data;
						};
					},
					align : 'center'
				}, {
					header : "最后登录时间",
					sortable : true,
					width : 170,
					dataIndex : 'lastLoginTime',
					renderer : dateFormat,
					align : 'center'
				}, {
					header : "状态",
					sortable : true,
					dataIndex : 'enabled',
					align : 'center',
					renderer : function(data) {
						if (data == 1)
							return Apex.EnumsConstants.UserStatesEnum.ENABLE;
						else if (data == 2)
							return Apex.EnumsConstants.UserStatesEnum.DISABLE;
						else
							return '未知';
					}
				}]);
	}

	var myMask = new Ext.LoadMask(Ext.getBody(), {
				msg : "数据处理中，请稍后..."
			});

	var importBtn = new Ext.Button({
				text : '导入',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.IMPORT_BUTTON_PNG,
				handler : importUser
			})
	var button_resetPwd = new Ext.Button({
				text : '重置密码',
				cls : 'x-btn-text-icon',
				isPermission : USER.isAble('setting_system_parameters'),
				disabled : true,
				icon : ResourceConstants.ADD_BUTTON_PNG,
				minWidth : 80,
				handler : function() {
					var selectRows = netGrid1.getSelectionModel()
							.getSelections();
					Ext.MessageBox.confirm('确认', '您确定要重置选中账号的密码吗？',

							callBallk);
					function callBallk(option) {
						if (option == 'yes') {
							if (selectRows) {
								myMask.show();
								var list = new Array();
								for (var i = 0; i < selectRows.length; i++) {
									var name = selectRows[i].get('userName');
									list.push(name);
								}
								adminSetPDW(list);
							} else {
								Ext.MessageBox.show({
											title : '提示',
											msg : "请选择要重置密码的记录",
											buttons :

											Ext.MessageBox.OK,
											icon : Ext.MessageBox.INFO
										});
							}
						} else {
							return;
						}
					}

				}
			});
	var button_delete = new Ext.Button({
				text : '删除',
				cls : 'x-btn-text-icon',
				isPermission : USER.isAble('setting_system_parameters'),
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				minWidth : 80
			});
	var button_enable = new Ext.Button({
				text : '启用',
				cls : 'x-btn-text-icon',
				isPermission : USER.isAble('setting_system_parameters'),
				icon : ResourceConstants.ADD_BUTTON_PNG,
				minWidth : 80
			});
	var button_disable = new Ext.Button({
				text : '禁用',
				cls : 'x-btn-text-icon',
				isPermission : USER.isAble('setting_system_parameters'),
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				minWidth : 80
			});
	var add_user = new Ext.Button({
		text : '添加用户',
		cls : 'x-btn-text-icon',
		isPermission : USER.isAble('setting_system_parameters'),
		icon : ResourceConstants.ADD_BUTTON_PNG,
		minWidth : 80,
		handler : function() {
			location.href = '/itsm/security/userMgt.do?method=addUser&menuId=m7_0';
		}
	});
	var tbarSeparator = new Ext.Toolbar.Separator(USER.isAble('setting_system_parameters'));

	button_delete.setDisabled(true);
	button_enable.setDisabled(true);
	button_disable.setDisabled(true);
	button_resetPwd.setDisabled(true);
	var pagingBar = new Ext.PagingToolbar({
				pageSize : ApexConstants.PAGE_SIZE,
				store : store,
				displayInfo : true,
				displayMsg : '显示记录 {0} - {1} 共 {2} 条记录',
				emptyMsg : "无记录"
			});
	var netGrid1 = new Ext.grid.GridPanel({
				region : "center",
				width : 510,
				border : false,
				enableDragDrop : false,
				autoExpandColumn : 10,
				store : store,
				border : false,
				loadMask : '正在加载数据，请稍候...',
				tbar : [add_user, tbarSeparator, button_resetPwd,
						tbarSeparator, button_delete, tbarSeparator,
						button_enable, tbarSeparator, button_disable],
				bbar : pagingBar,
				cm : columns,
				enableHdMenu : false,
				sm : checkboxSelect
			});
	store.load({
				params : {
					start : 0,
					limit : ApexConstants.PAGE_SIZE,
					userName : Ext.getCmp("userNameId").getValue() == null
							? null
							: Ext.getCmp("userNameId").getValue(),
					realName : Ext.getCmp("realNameId").getValue() == null
							? null
							: Ext.getCmp("realNameId").getValue(),
					mail : Ext.getCmp("mailId").getValue() == null ? null : Ext
							.getCmp("mailId").getValue(),
					department : Ext.getCmp("departmentId").getValue() == null
							? null
							: Ext.getCmp("departmentId").getValue(),
					type : userType
				}
			});
	function addcondition() {
		store.load({
					params : {
						start : 0,
						limit : ApexConstants.PAGE_SIZE,
						userName : Ext.getCmp("userNameId").getValue() == null
								? null
								: Ext.getCmp("userNameId").getValue(),
						realName : Ext.getCmp("realNameId").getValue() == null
								? null
								: Ext.getCmp("realNameId").getValue(),
						mail : Ext.getCmp("mailId").getValue() == null
								? null
								: Ext.getCmp("mailId").getValue(),
						department : Ext.getCmp("departmentId").getValue() == null
								? null
								: Ext.getCmp("departmentId").getValue(),
						type : userType
					}
				});

	}
	var myMask = new Ext.LoadMask(Ext.getBody(), {
				msg : "数据处理中，请稍后..."
			});
	button_enable.on("click", function() {
		// 一来就将启用按钮，禁用按钮 置为不可操作，成功或者失败后再设置为可操作
		button_enable.disable();
		var selectRows = netGrid1.getSelectionModel().getSelections();
		for (var i = 0; i < selectRows.length; i++) {
			if (selectRows[i].get('userName') == USER.userName) {
				Ext.MessageBox.show({
							title : '提示',
							msg : "不能对自己进行该步操作！",
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.INFO
						});
				button_enable.enable();
				return;
			}
		}
		if (selectRows && selectRows.length > 0) {
			var startUserName = new Array();

			for (var i = 0; i < selectRows.length; i++)
				startUserName.push(selectRows[i].get('userName'));
			SecurityService.enableUsers(startUserName, {
				callback : function() {
					store.reload();
					myMask.hide();
					button_enable.enable();
				},
				errorHandler : function(errorString, exception) {
					myMask.hide();
					button_enable.enable();
					if (exception.message == "SelectTheUserContainsTheUserDoesnotExistPleaseReselect") {
						Ext.MessageBox.show({
							title : '错误',
							msg : security_I18N.SelectTheUserContainsTheUserDoesnotExistPleaseReselect,
							buttons :

							Ext.MessageBox.OK,
							icon :

							Ext.MessageBox.ERROR
						});
					} else if (exception.message == "SelectTheUserContainsTheUserHasBeenEnabledPleaseReselect") {
						Ext.MessageBox.show({
							title : '错误',
							msg : security_I18N.SelectTheUserContainsTheUserHasBeenEnabledPleaseReselect,
							buttons :

							Ext.MessageBox.OK,
							icon :

							Ext.MessageBox.ERROR
						});
					} else {
						Ext.MessageBox.show({
									title : '错误',
									msg : "禁用用户出现异常，请与管理员联系！",
									buttons :

									Ext.MessageBox.OK,
									icon :

									Ext.MessageBox.ERROR
								});
					}
				}
			});
		}
	});
	button_disable.on("click", function() {
		// 一来就将启用按钮，禁用按钮 置为不可操作，成功或者失败后再设置为可操作
		button_disable.disable();
		var selectRows = netGrid1.getSelectionModel().getSelections();
		for (var i = 0; i < selectRows.length; i++) {
			if (selectRows[i].get('userName') == USER.userName) {
				Ext.MessageBox.show({
							title : '提示',
							msg : "不能对自己进行该步操作！",
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.INFO
						});
				button_disable.enable();
				return;
			}
		}
		if (selectRows && selectRows.length > 0) {
			var stopUserName = new Array();

			for (var i = 0; i < selectRows.length; i++) {
				stopUserName.push(selectRows[i].get('userName'));
			}
			SecurityService.disableUsers(stopUserName, {
				callback : function() {
					store.reload();
					button_disable.enable();
					myMask.hide();
				},
				errorHandler : function(errorString, exception) {
					myMask.hide();
					button_disable.enable();
					if (exception.message == "SelectTheUserContainsTheUserDoesnotExistPleaseReselect") {
						Ext.MessageBox.show({
							title : '错误',
							msg : security_I18N.SelectTheUserContainsTheUserDoesnotExistPleaseReselect,
							buttons :

							Ext.MessageBox.OK,
							icon :

							Ext.MessageBox.ERROR
						});
					} else if (exception.message == "SelectTheUserContainsTheUserHasBeenBannedPleaseReselect") {
						Ext.MessageBox.show({
							title : '错误',
							msg : security_I18N.SelectTheUserContainsTheUserHasBeenBannedPleaseReselect,
							buttons :

							Ext.MessageBox.OK,
							icon :

							Ext.MessageBox.ERROR
						});
					} else if (exception.message == "SelectTheUserWithAMissionBodyOfTheUserCannotBeDisabledPleaseReselect") {
						Ext.MessageBox.show({
							title : '错误',
							msg : security_I18N.SelectTheUserWithAMissionBodyOfTheUserCannotBeDisabledPleaseReselect,
							buttons :

							Ext.MessageBox.OK,
							icon :

							Ext.MessageBox.ERROR
						});
					} else if (exception.message == "disabledFailurecausehasSchedule") {
						Ext.MessageBox.show({
							title : '错误',
							msg : security_I18N.disabledFailurecausehasSchedule,
							buttons :

							Ext.MessageBox.OK,
							icon :

							Ext.MessageBox.ERROR
						});
					} else {
						Ext.MessageBox.show({
									title : '错误',
									msg : "禁用用户出现异常，请与管理员联系！",
									buttons :

									Ext.MessageBox.OK,
									icon :

									Ext.MessageBox.ERROR
								});

					}

				}
			});
		}
	});
	button_delete.on("click", function() {
		var selectRows = netGrid1.getSelectionModel().getSelections();
		for (var i = 0; i < selectRows.length; i++) {
			if (selectRows[i].get('userName') == USER.userName) {
				Ext.MessageBox.show({
							title : '提示',
							msg : "不能对自己进行该步操作！",
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.INFO
						});
				return;
			}
		}
		Ext.Msg.confirm("确认", "您确定要删除该用户吗？", function(button) {
			if (button == 'yes') {

				if (selectRows) {
					var list = [];
					for (var i = 0; i < selectRows.length; i++) {
						list.push(selectRows[i].get('id'));
					}
					myMask.show();
					SecurityService.deleteAccounts(list, {
								callback : function() {
									store.reload();
									myMask.hide();
								},
								errorHandler : function(errorString, exception) {
									store.reload();

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
			}
		});
	});
	var panel = new Ext.Panel({
				id : 'queryuser',
				layout : "border",
				border : false,
				items : [queryConditionsPanel, netGrid1]
			});
	netGrid1.on('rowclick', function(grid, rowIndex, e) {
				var selectios = grid.getSelectionModel().getSelections().length;
				if (selectios < 1) {
					button_delete.disable();
					button_resetPwd.disable();
					button_disable.disable();
					button_enable.disable();
				} else if (selectios == 1) {
					button_delete.enable();
					button_resetPwd.enable();
					button_disable.enable();
					button_enable.enable();
				} else {
					button_delete.enable();
					button_resetPwd.enable();
					button_disable.enable();
					button_enable.enable();
				}
			});
	checkboxSelect.on('selectionchange', function(selModel) {
				var selectios = netGrid1.getSelectionModel().getSelections().length;
				if (selectios < 1) {
					button_delete.disable();
					button_resetPwd.disable();
					button_disable.disable();
					button_enable.disable();
				} else if (selectios == 1) {
					button_delete.enable();
					button_resetPwd.enable();
					button_disable.enable();
					button_enable.enable();
				} else {
					button_delete.enable();
					button_resetPwd.enable();
					button_disable.enable();
					button_enable.enable();
				}
			});
	// 公共空间
	function adminSetPDW(nameList) {
		SecurityService.resetPwdToDefault(nameList, {
					callback : function(rules) {
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
	}
	function commenUserSetPDW(userNmae) {
		var resetPWDWindows = new Apex.security.ResetPasswordPanel(userNmae);
		resetPWDWindows.show();
	}
	return panel;

	function importUser() {
		var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : '数据处理中，请稍后......'
				});
		myMask.show();

		JdbcSearchService.importUser(function(returnValue) {
					if (!returnValue) {
						Ext.Msg.show({
									title : '错误',
									msg : '发生异常或错误，请联系管理员！',
									modal : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								})

					} else {
						Ext.Msg.show({
									title : '提示',
									msg : '导入成功！',
									modal : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.INFO
								})
					}
				});
		myMask.hide();
	}
}