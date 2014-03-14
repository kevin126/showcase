Ext.namespace('Apex.security');
/**
 * 账户修改
 * 
 * @param {}
 *            cfg
 */
Apex.security.UserModifyPanel = function(username, isAdmin, id) {
	this.userName = username;
	var infoUser_name = this.userName;
	// 默认管理员 为 true
	/**
	 * 默认管理员 为 true 普通管理员为false
	 * 
	 */
	// alert(username);
	// alert(isAdmin);
	// alert(id);
	var condition1 = (USER.isAble('setting_system_parameters') ? false : true) || isAdmin;
	var condition2 = (USER.isCurrentUser(infoUser_name) ? false : true)
			|| isAdmin;
	var CurrentUser = false;
	var isRead = false;
	if (condition1) {
		isRead = true;
	} else {
		isRead = false;
	}
	if (condition2) {
		CurrentUser = true;
	} else {
		CurrentUser = false;
	}
	// 此用户是当前要查看信息的用户

	var AccountVo = Ext.data.Record.create([]);
	var defaultValue = new AccountVo({
				userName : '',
				enabled : '',
				realName : '',
				workGroupName : '',
				employeeNo : '',
				mail : '',
				fax : '',
				mobile : '',
				office : '',
				qq : '',
				msn : '',
				country : '',
				taskNotifier : '',
				city : '',
				address : '',
				zipcode : '',
				roleNames : [],
				unRoleNames : []
			});
	// *************************************
	var dwrproxy = new Ext.ux.data.DWRProxy({
				dwrFunction : SecurityService.getAllWorkGroupNames
			});
	var workGroupStore = new Ext.data.SimpleStore({
				proxy : dwrproxy,
				fields : ['workGroupName', 'workGroupName']
			});
	var workGroup = new Ext.form.ComboBox({
				fieldLabel : '工作组<font color="#FF0000">*</font>',
				width : 135,
				triggerAction : 'all',
				disabled : CurrentUser,
				baseCls : 'x-plain',
				emptyText : '请选择工作组...',
				valueField : 'workGroupName',
				displayField : 'workGroupName',
				mode : 'local',
				selectOnFocus : true,
				editable : false,
				// allowBlank : isAdmin,
				store : workGroupStore
			});
	workGroupStore.load();

	// ************************************
	var taskNotifier = new Ext.form.TextArea({
				fieldLabel : '技能描述<font color="#FF0000">*</font>',
				name : 'taskNotifier',
				// vtype : 'SpecialChar',
				width : 500,
				height : 50,
				readOnly : CurrentUser,
				// allowBlank : true,
				minLength : 1,
				maxLength : 255
			});
	var enable_radio = new Ext.form.Radio({
				id : 'Apex.security.UserModifyPanel.enabled',
				name : 'enabled',
				readOnly : CurrentUser,
				boxLabel : '启用',
				width : 30,
				// disabled : isadmin,
				inputValue : 1
			});
	var disable_radio = new Ext.form.Radio({
				id : 'Apex.security.UserModifyPanel.disable',
				readOnly : CurrentUser,
				name : 'enabled',
				boxLabel : '禁用',
				// disabled : isadmin,
				width : 30,
				inputValue : 2
			});

	var radioGroup = new Ext.form.RadioGroup({
				items : [enable_radio, disable_radio],
				fieldLabel : '状态'
			});

	var selector = new Ext.ux.ItemSelector({
		name : "roleNames",
		bodyStyle : 'padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:90px;',
		autoScroll : true,
		dataFields : ["id", "roleName"],
		toData : [],
		msWidth : 200,
		msHeight : 193,
		readOnly : isRead,
		width : 400,
		height : 160,
		msHeight : 503,
		readOnly : isRead,
		valueField : "code",
		displayField : "roleName",
		imagePath : "images/",
		toLegend : '拥有的角色',
		fromLegend : "所有的角色",
		fromData : [],
		toTBar : [{
					text : "清除全部",
					handler : function() {
						if (isAdmin) {
							Ext.MessageBox.show({
										title : '提示',
										msg : 'admin用户不能改变角色！',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.INFO
									});
							return;
						} else // 不是管理员不能用这一功能
						if (!USER.isAble('system_manage')) {
							Ext.MessageBox.show({
										title : '提示',
										msg : '不是管理员，不能改变角色！',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.INFO
									});
							return;
						} else {
							selector.reset.call(selector);
						}

					}
				}],
		fromTBar : [{
					text : "选择全部",
					handler : function() {
						if (isAdmin) {
							Ext.MessageBox.show({
										title : '提示',
										msg : 'admin用户不能改变角色！',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.INFO
									});
						} else // 不是管理员不能用这一功能
						if (!USER.isAble('setting_system_parameters')) {
							Ext.MessageBox.show({
										title : '提示',
										msg : '不是管理员，不能改变角色！',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.INFO
									});
							return;
						} else {
							selector.selectAll.call(selector);
						}

					}
				}]
	});
	var formPanel = new Ext.form.FormPanel({
		id : 'modifyUser',
		collapsible : true,
		frame : true,
		collapseMode : 'mini',
		bodyStyle : 'padding:5px;',
		labelWidth : 50,
		labelAlign : 'left',
		monitorValid : true,
		defaults : {
			bodyStyle : 'padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;'
		},
		items : [new Ext.form.FieldSet({
					title : '用户信息',
					autoHeight : true,
					layout : 'form',
					items : [{
								layout : 'form',
								items : [{
											autoHeight : true,
											layout : "column",
											defaults : {
												columnWidth : '.33',
												border : false
											},
											items : [{
														layout : 'form',
														defaultType : 'textfield',
														items : [{
															fieldLabel : '用户名',
															// vtype :
															// 'SpecialChar',
															readOnly : CurrentUser,
															// regex :
															// /^[A-Za-z0-9]{1,20}$/,
															// regexText :
															// '只能输入字母和数字',
															name : 'userName'// ,
																// allowBlank :
																// false,
																// minLength :
																// 1,
																// maxLength :
																// 20
														}]
													}, {
														layout : 'form',
														items : [radioGroup]
													}]
										}]
							}, taskNotifier]
				}), new Ext.form.FieldSet({
			title : '用户信息',
			autoHeight : true,
			layout : "column",
			defaults : {
				columnWidth : '.33',
				border : false
			},
			items : [{
				layout : 'form',
				defaultType : 'textfield',
				items : [{
					fieldLabel : '姓名',
					// vtype : 'SpecialChar',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					name : 'realName'// ,
						// allowBlank : false,
						// minLength : 2,
						// maxLength : 20
				}]
			}, {
				layout : 'form',
				defaultType : 'textfield',
				items : [workGroup]
			}, {
				layout : 'form',
				defaultType : 'textfield',
				items : [{
					fieldLabel : '工号',
					// vtype : 'SpecialChar',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					name : 'employeeNo',
					// minLength : 0,
					// maxLength : 30,
					allowDecimals : false
				}]
			}]
		}), new Ext.form.FieldSet({
			title : '联系方式',
			autoHeight : true,
			layout : "column",
			defaults : {
				columnWidth : '.33',
				border : false
			},
			items : [{
				layout : 'form',
				defaultType : 'textfield',
				items : [{
					fieldLabel : '邮件',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					name : 'mail',
					allowDecimals : false
						// ,
						// allowBlank : false,
						// vtype : 'email',
						// minLength : 6,
						// maxLength : 50
				}, {
					fieldLabel : '传真',
					name : 'fax',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					// regex :
					// /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
					// regexText : '传真格式错误，格式为 区号-传真号或者区号-传真号-分号',
					// allowBlank : true,
					allowDecimals : false
						// ,
						// minValue : 1,
						// maxValue : 60000
				}]
			}, {
				layout : 'form',
				defaultType : 'textfield',
				items : [{
					fieldLabel : '手机',
					name : 'mobile',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					allowDecimals : false
						// ,
						// allowBlank : false,
						// regex : /^[0-9]{5,20}$/,
						// regexText : '只能输入长度为5到20位数字',
						// minLength : 5,
						// maxLength : 20
				}, {
					fieldLabel : '固话',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					// regex :
					// /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
					// regexText : '办公电话格式错误，格式为 区号-座机号或者区号-座机号-分机号',
					name : 'office',
					allowDecimals : false
						// ,
						// minValue : 1,
						// maxValue : 60000
				}]
			}, {
				layout : 'form',
				defaultType : 'textfield',
				items : [{
					fieldLabel : 'QQ',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					name : 'qq',
					// allowDecimals : false,
					// regex : /^[0-9]*$/,
					regexText : '只能输入数字'// ,
						// minLength : 0,
						// maxLength : 20
				}, {
					fieldLabel : 'MSN',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					name : 'msn',
					// regex : /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
					// regexText : 'MSN格式错误',
					allowDecimals : false
						// ,
						// minLength : 0,
						// maxLength : 50
				}]
			}]
		}), new Ext.form.FieldSet({
			title : '地址',
			autoHeight : true,
			layout : "column",
			defaults : {
				columnWidth : '.33',
				border : false
			},
			items : [{
				layout : 'form',
				defaultType : 'textfield',
				items : [{
					fieldLabel : '国家',
					// vtype : 'SpecialChar',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					name : 'country'// ,
						// minLength : 0,
						// maxLength : 10
				}, {
					fieldLabel : '城市',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					allowDecimals : false,
					name : 'city'// ,
						// vtype : 'SpecialChar',
						// minLength : 0,
						// maxLength : 10
				}]
			}, {
				layout : 'form',
				defaultType : 'textfield',
				items : [{
					fieldLabel : '地址',
					// vtype : 'SpecialChar',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					name : 'address'// ,
						// minLength : 0,
						// maxLength : 50
				}]
			}, {
				layout : 'form',
				defaultType : 'textfield',
				items : [{
					fieldLabel : '邮编',
					readOnly : USER.isCurrentUser(infoUser_name) ? false : true,
					name : 'zipcode',
					allowDecimals : false
						// ,
						// regex : /^[0-9]*$/,
						// regexText : '只能输入数字',
						// minLength : 5,
						// maxLength : 20//,
						// allowBlank : true
				}]
			}]
		}), new Ext.form.FieldSet({
			title : '设置角色',
			height : 200,
			// autoScroll : true,
			bodyStyle : 'padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;',
			layout : "column",
			defaults : {
				columnWidth : '1',
				border : false
			},
			items : [selector]
		})

		],
		buttons : [{
			text : '保存',
			scope : this,
			handler : function() {
				// alert(ipTriggerField.getValue());
				var vo = getInputValues();
				// 选择了普通用户，则不能再具有其他的角色，即普通用户这个角色和其他角色互斥
				if (vo.roleNames.length > 1) {// 选择了多个角色
					for (var i = 0; i < vo.roleNames.length; i++) {
						if (vo.roleNames[i] == '普通用户') {
							Ext.MessageBox.show({
										title : '提示',
										msg : '普通用户这一角色不能和其他角色同时存在！',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.INFO
									});
							return;
						}
					}
				}

				var myMask = new Ext.LoadMask('usermodifywindow_id', {
							msg : "数据处理中，请稍后..."
						});
				myMask.show();
				// var vo = getInputValues();
				if (vo.roleNames.length > 0 || isadmin) {
					vo.workGroupName = workGroup.getValue();
					SecurityService.updateAccount(id, vo, {
								callback : function(result) {
									myMask.hide();
									if (result) {
										prompt.destroy();
										Ext.StoreMgr.lookup('user_store_id')
												.reload();
									} else
										Ext.MessageBox.alert('失败', '失败！');
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
				} else {
					Ext.MessageBox.show({
								title : '提示',
								msg : '一个用户至少得拥有一个角色！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO
							});
					return;
				}
			},
			formBind : true
		}, {
			text : '关闭',
			handler : function() {
				prompt.close();
			}
		}],
		buttonAlign : 'center'
	});
	/**
	 * 获取用户选择的角色名列表
	 */
	var getSelectedRoles = function() {
		var selected = [];
		var range = selector.toMultiselect.store.getRange();
		for (var i = 0; i < range.length; i++) {
			if (range[i].data.id >= 0) {
				selected.push(range[i].data.roleName);
			}
		}
		return selected;
	};
	
	/**
	 * 收集参数，并封装成需要的AccountVo对象
	 */
	var getInputValues = function() {
		var AccountVo = formPanel.getForm().getValues(false);
		AccountVo.roleNames = getSelectedRoles();
		return AccountVo;
	};

	var myMask = new Ext.LoadMask(Ext.getBody(), {
				msg : "数据加载中，请稍后..."
			});
	myMask.show();
	SecurityService.getAccountVo(this.userName, {
				callback : function(result) {
					var value = new AccountVo(result);
					// alert(result.workGroupName);
					formPanel.getForm().loadRecord(value);
					workGroup.setValue(result.workGroupName);
					var enable = value.data.enabled;
					enable_radio.setValue(enable);
					// 填充用户拥有的角色
					var rules = value.data.roleNames;
					var toData = new Array();
					for (var i = 0; i < rules.length; i++) {
						var items = new Array();
						items.push(i);
						items.push(rules[i]);
						toData.push(items);
					}
					selector.toData = toData;
					selector.toMultiselect.store.loadData(toData);
					selector.valueChanged(selector.toMultiselect.store);
					// 填充用户没有拥有的角色
					var unRules = value.data.unRoleNames;
					var fromData = new Array();
					for (var i = 0; i < unRules.length; i++) {
						var items = new Array();
						items.push(i);
						items.push(unRules[i]);
						fromData.push(items);
					}
					selector.fromData = fromData;
					selector.fromMultiselect.store.loadData(fromData);
					selector.valueChanged(selector.fromMultiselect.store);
					defaultValue = value;
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

	function selectSingleNode(node, checked) {
		var checkeds = treePanel.getChecked();
		if (checkeds.length == 0) {
			Ext.getCmp('okselectWorkGroupEvent').setDisabled(true);
		} else {
			Ext.getCmp('okselectWorkGroupEvent').setDisabled(false);
			if (node.attributes.devNodeType != 'group')
				Ext.getCmp('okselectWorkGroupEvent').setDisabled(false);
			else
				Ext.getCmp('okselectWorkGroupEvent').setDisabled(true);
			var rootNode = treePanel.getRootNode();
			disSelectChildNode(rootNode);
			node.getUI().checkbox.checked = checked;
			node.attributes.checked = checked;
		}
	}

	function disSelectChildNode(node) {
		node.eachChild(function(child) {
					child.getUI().checkbox.checked = false;
					child.attributes.checked = false;
					if (!Ext.isEmpty(child.childNodes))
						disSelectChildNode(child)
				});
	}
	function selectWorkGroupEvent() {
		var selectedNodes = treePanel.getChecked();
		if (!Ext.isEmpty(selectedNodes)) {
			var selectedNode = selectedNodes[0];
			ipTriggerField.setValue(selectedNode.text);
			selecedDeviceId = selectedNode.attributes.eleId;
		}
		newWidow.close();
	}

	var prompt = new Ext.Window({
				title : "修改用户",
				width : 660,
				id : 'usermodifywindow_id',
				height : 700,
				resizable : true,
				modal : true,
				plain : true,
				layout : 'fit',
				items : formPanel
			});
	return prompt;
}