Ext.namespace('Apex.security');
/**
 * 
 * @param {}
 *            cfg
 */

Apex.security.UserCreatePanel = function(cfg, callback) {
	cfg = cfg || {};
	Ext.apply(this, cfg);
	var newWidow;
	var treePanel;
	var AccountVo = Ext.data.Record.create([]);
	var defaultValue = new AccountVo({
				userName : '',
				enabled : '',
				realName : '',
				department : '',
				title : '',
				employeeNo : '',
				mail : '',
				fax : '',
				mobile : '',
				office : '',
				qq : '',
				taskNotifier : '',
				msn : '',
				country : '',
				city : '',
				address : '',
				zipcode : '',
				roleNames : [],
				unRoleNames : []
			});

	var taskNotifier = new Ext.form.TextArea({
				fieldLabel : '技能描述<font color="#FF0000">*</font>',
				name : 'taskNotifier',
				vtype : 'SpecialChar',
				width : 500,
				height : 50,
				allowBlank : false,
				minLength : 1,
				maxLength : 255
			});
	var mobleNum = new Ext.form.NumberField({
				fieldLabel : '手机<font color="#FF0000">*</font>',
				name : 'mobile',
				allowDecimals : false,
//				allowBlank : false,
				minLength : 5,
				maxLength : 20

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
				baseCls : 'x-plain',
				emptyText : '请选择工作组...',
				valueField : 'workGroupName',
				displayField : 'workGroupName',
				mode : 'local',
				selectOnFocus : true,
				editable : false,
				allowBlank : false,
				store : workGroupStore
			});
	workGroupStore.load();

	// ************************************
	var enable_radio = new Ext.form.Radio({
				id : 'Apex.security.UserModifyPanel.enabled',
				name : 'enabled',
				boxLabel : '启用',
				checked : true,
				width : 30,
				inputValue : 1
			});
	var disable_radio = new Ext.form.Radio({
				id : 'Apex.security.UserModifyPanel.disable',
				name : 'enabled',
				boxLabel : '禁用',
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
		// fieldLabel : '通知方式选择<font color="#FF0000">*</font>',
		dataFields : ["id", "roleName"],
		toData : [],
		msWidth : 200,
		msHeight : 193,
		width : 400,
		autoScroll : true,
		height : 160,
		valueField : "code",
		displayField : "roleName",
		imagePath : "images/",
		toLegend : '拥有的角色<font color="#FF0000">*</font>',
		fromLegend : "所有的角色",
		fromData : [],
		toTBar : [{
					text : "清除全部",
					handler : function() {
						selector.reset.call(selector);
					}
				}],
		fromTBar : [{
					text : "选择全部",
					handler : function() {
						selector.selectAll.call(selector);
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
			layout : 'form',
			autoHeight : true,
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
									fieldLabel : '用户名<font color="#FF0000">*</font>',
									regex : /^[A-Za-z0-9]{1,20}$/,
									regexText : '只能输入字母和数字',
									name : 'userName',
									allowBlank : false,
									minLength : 1,
									maxLength : 20
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
									fieldLabel : '姓名<font color="#FF0000">*</font>',
									vtype : 'SpecialChar',
									name : 'realName',
									allowBlank : false,
									minLength : 2,
									maxLength : 20
								}]
					}, {
						layout : 'form',
						items : [workGroup]

					}, {
						layout : 'form',
						defaultType : 'textfield',
						items : [{
									fieldLabel : '工号',
									vtype : 'SpecialChar',
									name : 'employeeNo',
									minLength : 0,
									maxLength : 30,
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
							fieldLabel : '邮件<font color="#FF0000">*</font>',
							name : 'mail',
							allowDecimals : false,
							allowBlank : false,
							vtype : 'email',
							minLength : 6,
							maxLength : 50
						}, {
							fieldLabel : '传真',
							name : 'fax',
							regex : /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
							regexText : '传真格式错误，格式为 区号-传真号或者区号-传真号-分号',
							allowBlank : true,
							allowDecimals : false,
							minValue : 1,
							maxValue : 60000
						}]
			}, {
				layout : 'form',
				defaultType : 'textfield',
				items : [mobleNum, {
					fieldLabel : '固话',
					regex : /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
					regexText : '办公电话格式错误，格式为 区号-座机号或者区号-座机号-分机号',
					name : 'office',
					allowDecimals : false,
					// allowBlank : false,
					minValue : 1,
					maxValue : 60000
				}]
			}, {
				layout : 'form',
				defaultType : 'textfield',
				items : [{
							fieldLabel : 'QQ',
							name : 'qq',
							allowDecimals : false,
							regex : /^[0-9]*$/,
							regexText : '只能输入数字',
							minLength : 0,
							maxLength : 20
						}, {
							fieldLabel : 'MSN',
							name : 'msn',
							regex : /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
							regexText : 'MSN格式错误',
							allowDecimals : false,
							minLength : 0,
							maxLength : 50
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
											vtype : 'SpecialChar',
											name : 'country',
											minLength : 0,
											maxLength : 10
										}, {
											fieldLabel : '城市',
											vtype : 'SpecialChar',
											allowDecimals : false,
											name : 'city',
											minLength : 0,
											maxLength : 10
										}]
							}, {
								layout : 'form',
								defaultType : 'textfield',
								items : [{
											fieldLabel : '地址',
											vtype : 'SpecialChar',
											name : 'address',
											minLength : 0,
											maxLength : 50
										}]
							}, {
								layout : 'form',
								defaultType : 'textfield',
								items : [{
											fieldLabel : '邮编',
											name : 'zipcode',
											allowDecimals : false,
											regex : /^[0-9]*$/,
											regexText : '只能输入数字',
											minLength : 5,
											maxLength : 20,
											allowBlank : true
										}]
							}]
				}), new Ext.form.FieldSet({
					title : '设置角色<font color="#FF0000">*</font>',
					height : 200,
//					autoHeight : true,
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
					handler : function() {
						var accountVo = getInputValues();
						// 选择了普通用户，则不能再具有其他的角色，即普通用户这个角色和其他角色互斥
						if (accountVo.roleNames.length > 1) {// 选择了多个角色
							for (var i = 0; i < accountVo.roleNames.length; i++) {
								if (accountVo.roleNames[i] == '普通用户') {
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

						var myMask = new Ext.LoadMask('usercreatewindow_id', {
									msg : "数据处理中，请稍后..."
								});
						myMask.show();
						accountVo.workGroupName = workGroup.getValue();
						SecurityService.addAccount(accountVo, {
									callback : function(rules) {
										myMask.hide();
										prompt.close();
										if (callback
												&& typeof callback == 'function')
											callback();
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
					},
					formBind : true
				}, {
					text : '取消',
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
	SecurityService.getALLRoles({
				callback : function(rules) {
					var fromData = new Array();
					for (var i = 0; i < rules.length; i++) {
						var items = new Array();
						items.push(rules[i].id);
						items.push(rules[i].roleName);
						fromData.push(items);
					}
					selector.fromData = fromData;
					selector.fromMultiselect.store.loadData(fromData);
					selector.valueChanged(selector.fromMultiselect.store);
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
	// **************************************
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
	// *********************************
	var prompt = new Ext.Window({
				title : "添加用户",
				id : 'usercreatewindow_id',
				width : 660,
				height : 700,
				resizable : false,
				modal : true,
				plain : true,
				layout : 'fit',
				items : formPanel
			});
	return prompt;
}