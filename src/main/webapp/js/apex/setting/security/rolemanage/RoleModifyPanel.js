Ext.namespace('Apex.security');
/**
 * 修改角色
 * 
 * @param {}
 *            cfg
 */
Apex.security.RoleModifyPanel = function(cfg) {

	this.roleId = undefined;
	cfg = cfg || {};
	Ext.apply(this, cfg);
	/** 储存角色信息 */
	var defaultValue = {};
	var roleName = new Ext.form.TextField({
		fieldLabel : '角色名',
		vtype : 'SpecialChar',
		name : 'roleName',
		readOnly : true,
		id : 'Apex.security.RoleModifyPanel.roleName',
		minLength : 1,
		maxLength : 20,
		width : 230,
		bodyStyle : 'padding-top:50px; padding-right:0px; padding-bottom:50px; padding-left:0px;'
	});
	var roleDiscription = new Ext.form.TextArea({
		fieldLabel : '描述',
		vtype : 'SpecialChar',
		name : 'permissionDescription',
		width : 520,
		/**
		 * 系统默认的角色不能编辑
		 */
		readOnly : this.roleId <= 18 ? true : false,
		id : 'Apex.security.RoleModifyPanel.roleDiscription',
		minLength : 1,
		maxLength : 255,
		bodyStyle : 'padding-top:50px; padding-right:0px; padding-bottom:50px; padding-left:0px;',
		height : 180
	});
	var enable_radio = new Ext.form.Radio({
				name : 'enabled',
				boxLabel : '启用',
				width : 30,
				checked : true,
				inputValue : 1
			});
	var disable_radio = new Ext.form.Radio({
				name : 'enabled',
				boxLabel : '禁用',
				width : 30,
				inputValue : 2
			});

	var radioGroup = new Ext.form.RadioGroup({
				items : [enable_radio, disable_radio],
				fieldLabel : '状态'
			});
	var delDevFromCGBtn = new Ext.Button({
				text : '删除',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				handler : deleteUserEvent,
				disabled : true
			});
	var addDevFromCGBtn = new Ext.Button({
				text : '添加',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.ADD_BUTTON_PNG,
				disabled : false,
				handler : addUserEvent
			});
	var userRecord = Ext.data.Record.create([{
				name : 'id',
				mapping : 'id'
			}, {
				name : 'realName',
				mapping : 'realName'
			}, {
				name : 'workGroupName',
				mapping : 'workGroupName'
			}]);
	var userReader = new Ext.data.JsonReader({
				root : "userList",
				id : "id"
			}, userRecord);
	var Store = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : SecurityService.getUsersByroleId,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [cfg.roleId];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : userReader
			});
	Store.setDefaultSort('id', 'asc');
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();
	var userGridPanel = new Ext.grid.GridPanel({
				id : 'device-process-info-gridPanel',
				title : '成员列表',
				columns : [checkboxSelect, new Ext.grid.RowNumberer(), {
							header : "序号",
							width : 50,
							hidden : true,
							dataIndex : 'id'
						}, {
							header : "姓名",
							width : 140,
							dataIndex : 'realName'
						}, {
							header : "工作组",
							dataIndex : 'workGroupName'
						}],
				store : Store,
				stripeRows : true,
				sm : checkboxSelect,
				autoExpandColumn : 4,
				enableHdMenu : false,
				border : false,
				// tbar : [addDevFromCGBtn, '-', delDevFromCGBtn],
				width : 630,
				height : 340
			});
	Store.load();
	var formPanel = new Ext.FormPanel({
		title : '基本信息',
		frame : true,
		autoScroll : true,
		border : false,
		bodyStyle : 'padding:5px;',
		labelWidth : 80,
		labelAlign : 'left',
		bodyStyle : 'padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;',
		items : [roleName, roleDiscription, userGridPanel]
	});
	// ***************************************************

	var checkboxSel = new Ext.grid.CheckboxSelectionModel();
	// ***************************************************
	var formPanel2 = new Ext.FormPanel({
				title : '权限选择',
				frame : true,
				border : false,
				autoScroll : true
			});
	var myMask = new Ext.LoadMask(Ext.getBody(), {
				msg : "数据加载中，请稍后..."
			});
	myMask.show();
	var roleId = this.roleId;
	SecurityService.getAllPermissions({
		callback : function(data) {
			myMask.hide();
			for (var property in data) {
				var fs = new Ext.form.FieldSet({
							title : property,
							id : property,
							autoHeight : true,
							width : 600,
							layout : "column",
							defaults : {
								columnWidth : '.3',
								border : false
							},
							items : []
						});
				fs.removeAll(true);
				for (var i = 0; i < data[property].length; i++) {
						var ck = new Ext.form.Checkbox({
									id : data[property][i].actionId,
									/**
									 * 系统默认的角色不能编辑
									 */
									//readOnly : roleId <= 18 ? true : false,
									boxLabel : data[property][i].permissionName
								});
						fs.add(ck);
					formPanel2.add(fs);
				}
			}
			formPanel2.doLayout();
			SecurityService.getRoleVoByRoleId(roleId, {
				callback : function(data) {
					var roleNameTextFeild = formPanel
							.findById('Apex.security.RoleModifyPanel.roleName');
					roleNameTextFeild.setValue(data.roleName);
					var roleDescription = formPanel
							.findById('Apex.security.RoleModifyPanel.roleDiscription');
					roleDescription.setValue(data.roleDescription);
					var actionIds = data.acitonIds;
					if (actionIds && actionIds.length != 0) {
						var boxes = formPanel2.findByType('checkbox');
						for (var i = 0; i < boxes.length; i++) {
							for (var j = 0; j < actionIds.length; j++) {
								if (boxes[i].id == actionIds[j]) {
									boxes[i].setValue('on');
								}
							}
						}
					}
					defaultValue = data;
				},
				errorHandler : function(errorString, exception) {
					myMask.hide();
					Ext.StoreMgr.lookup('Apex.security.RoleViewPanel_store_id')
							.reload();
					Ext.MessageBox.show({
								title : '错误',
								msg : exception.message,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
					prompt.destroy();
				}
			});
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
	/**
	 * 收集参数，并封装成需要的AccountVo对象
	 */
	var getInputValues = function() {
		var AccountVo = formPanel2.getForm().getValues(false);
		return AccountVo;
	};
	var TabPanel = new Ext.TabPanel({
				activeTab : 0,
				border : false,
				layoutOnTabChange : true,
				deferredRender : false,
				animScroll : true,
				enableTabScroll : true,
				items : [formPanel, formPanel2]
			});

	var prompt = new Ext.Window({
		title : "角色信息",
		id : 'RoleModifyPanel_window_id',
		width : 660,
		height : 866,
		resizable : false,
		modal : true,
		border : false,
		plain : true,
		layout : 'fit',
		items : TabPanel,
		buttons : [
			{
			text : '保存',
			//disabled:this.roleId <= 18 ? true : false,
			handler : function() {
				var value = getInputValues();
				var roleNam = null;
				var roleDescription = null;
				var actionId = [];

				roleNam = formPanel
						.findById('Apex.security.RoleModifyPanel.roleName')
						.getValue();

				if (!Ext.isEmpty(roleDiscription.getValue())) {
					roleDescription = formPanel
							.findById('Apex.security.RoleModifyPanel.roleDiscription')
							.getValue();

				}
				for (var property in value) {
					if (value[property] == 'on')
						actionId.push(property);

				}

				var myMask = new Ext.LoadMask('RoleModifyPanel_window_id', {
							msg : "数据保存中， 请稍后..."
						});
				// myMask.show();
				SecurityService.updateRole(roleId, roleDescription, actionId, {
							callback : function() {
								myMask.hide();
								// 刷新页面
								Ext.StoreMgr
										.lookup('Apex.security.RoleViewPanel_store_id')
										.reload();
								prompt.destroy();
							},
							errorHandler : function(errorString, exception) {
								myMask.hide();
								// 刷新页面
								Ext.StoreMgr
										.lookup('Apex.security.RoleViewPanel_store_id')
										.reload();
								Ext.MessageBox.show({
											title : '错误',
											msg : exception.message,
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
								prompt.destroy();
							}
						});
			}
		},
		
			{
			text : '关闭',
			handler : function() {
				prompt.destroy();
			}
		}],
		buttonAlign : 'center'
	});

	function deleteUserEvent() {

		Ext.MessageBox.confirm('确认', '你确认删除所选成员吗？', function fn(option) {

					if (option == 'yes') {
						// ****************************************

						var selectedRows = userGridPanel.getSelectionModel()
								.getSelections();
						var ids = new Array();
						if (selectedRows) {
							for (var i = 0; i < selectedRows.length; i++) {
								ids.push(selectedRows[i].id);
								Store.remove(selectedRows[i]);
							}
						}
						SecurityService.deleteRoleOfUsers(roleId, ids, {
									callback : function() {
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
						// ****************************************
					} else {
						return;
					}

				});

	}
	function addUserEvent() {

		var userwindow = new AllUserWindows(roleId, Store);
		userwindow.show();
	}
	checkboxSelect.on('selectionchange', function(selModel) {
		var selectios = userGridPanel.getSelectionModel().getSelections().length;
		if (selectios < 1) {
			delDevFromCGBtn.disable();
		} else {
			delDevFromCGBtn.enable();
		}
	});

	return prompt;
}