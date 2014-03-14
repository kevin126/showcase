Ext.namespace('Apex.security');
/**
 * 创建角色
 * 
 * @param {}
 *            cfg
 */
Apex.security.RoleCreatePanel = function(cfg, callback) {
	cfg = cfg || {};
	Ext.apply(this, cfg);
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
	var formPanel = new Ext.form.FormPanel({
		id : 'createrole',
		frame : true,
		autoScroll : true,
		bodyStyle : 'padding:5px;',
		labelWidth : 50,
		border : false,
		labelAlign : 'left',
		monitorValid : true,
		defaultType : 'textfield',
		defaults : {
			bodyStyle : 'padding-top:0px; padding-right:0px; padding-bottom:0px; padding-left:0px;'
		},
		items : [new Ext.form.FieldSet({
			title : '基本信息',
			autoHeight : true,
			width : 600,
			layout : "column",
			defaults : {
				border : false
			},
			items : [{
				layout : 'form',
				defaultType : 'textfield',
				items : [{
					fieldLabel : '角色名',
					vtype : 'SpecialChar',
					name : 'roleName',
					allowBlank : false,
					minLength : 1,
					maxLength : 20,
					width : 200,
					bodyStyle : 'padding-top:50px; padding-right:0px; padding-bottom:50px; padding-left:0px;'
				}, new Ext.form.TextArea({
					fieldLabel : '描述',
					vtype : 'SpecialChar',
					name : 'permissionDescription',
					minLength : 1,
					allowBlank : false,
					maxLength : 255,
					width : 400,
					bodyStyle : 'padding-top:50px; padding-right:0px; padding-bottom:50px; padding-left:0px;',
					height : 80
				})]
			}]
		})],
		buttons : [{
			text : '保存',
			handler : function() {
				var value = getInputValues();
				var roleName = null;
				var roleDescription = null;
				var actionId = [];
				for (var property in value) {
					if (property == 'roleName')
						roleName = value[property];
					else if (property == 'permissionDescription')
						roleDescription = value[property];
					else if (value[property] == 'on')
						actionId.push(property);
				}
				var myMask = new Ext.LoadMask('RoleCreatePanel_window_id', {
							msg : "数据处理中，请稍后..."
						});
				myMask.show();
				SecurityService.addRole(Ext.util.Format.htmlEncode(roleName),
						Ext.util.Format.htmlEncode(roleDescription), actionId,
						{
							callback : function() {
								myMask.hide();
								prompt.close();
								if (callback && typeof callback == 'function')
									callback();
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
	var myMask = new Ext.LoadMask(Ext.getBody(), {
				msg : "数据加载中，请稍后..."
			});
	myMask.show();
	SecurityService.getAllPermissions({
				callback : function(data) {
					for (var property in data) {
						var fs = new Ext.form.FieldSet({
									title : property,
									id : property,
									collapsible : true,
									width : 600,
									autoHeight : true,
									layout : "column",
									defaults : {
										columnWidth : '.3',
										border : false
									},
									items : []
								});
						fs.removeAll(true);
						for (var i = 0; i < data[property].length; i++) {
							/**
							 * 地大版本没这个
							 */ 
							if (data[property][i].actionId == "group4"
							|| data[property][i].actionId == "manage_SLA"
							) {
								continue;
							} else {
								var ck = new Ext.form.Checkbox({
											id : data[property][i].actionId,
											boxLabel : data[property][i].permissionName
										});
								fs.add(ck);
								formPanel.add(fs);
							}
						}

					}
					formPanel.doLayout();
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
	/**
	 * 收集参数，并封装成需要的AccountVo对象
	 */
	var getInputValues = function() {
		var AccountVo = formPanel.getForm().getValues(false);
		return AccountVo;
	};
	var prompt = new Ext.Window({
				title : "添加角色",
				id : 'RoleCreatePanel_window_id',
				width : 660,
				height : 750,
				autoScroll : true,
				border : false,
				resizable : false,
				modal : true,
				plain : true,
				layout : 'fit',
				items : formPanel
			});
	return prompt;
}