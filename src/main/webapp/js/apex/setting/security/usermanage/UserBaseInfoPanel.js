/**
 * 账户基本信息
 * 
 * @param {}
 *            cfg
 */
Apex.security.UserBaseInfoPanel = function(cfg) {
	var user;
	cfg = cfg || {};
	Ext.apply(this, cfg);

	var AccountVo = Ext.data.Record.create([]);
	var defaultValue = new AccountVo({
				realName : '',
				department : '',
				title : '',
				employeeNo : '',
				mail : '',
				fax : '',
				mobile : '',
				office : '',
				qq : '',
				msn : '',
				country : '',
				city : '',
				address : '',
				zipcode : ''
			});
	var formPanel = new Ext.form.FormPanel({
		id : 'baseinfo',
		frame : true,
		bodyStyle : 'padding:5px;',
		labelWidth : 50,
		labelAlign : 'left',
		monitorValid : true,
		defaults : {
			bodyStyle : 'padding-top:15px; padding-right:0px; padding-bottom:15px; padding-left:0px;'
		},
		items : [new Ext.form.FieldSet({
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
									name : 'realName',
									vtype : 'SpecialChar',
									width : 120,
									allowBlank : false,
									minLength : 2,
									maxLength : 20
								}, {
									fieldLabel : '部门',
									allowDecimals : false,
									vtype : 'SpecialChar',
									name : 'department',
									width : 120,
									minLength : 1,
									maxLength : 20
								}]
					}, {
						layout : 'form',
						defaultType : 'textfield',
						items : [{
									fieldLabel : '职务',
									vtype : 'SpecialChar',
									name : 'title',
									width : 120,
									minLength : 1,
									maxLength : 20
								}]
					}, {
						layout : 'form',
						defaultType : 'textfield',
						items : [{
									fieldLabel : '工号',
									vtype : 'SpecialChar',
									width : 120,
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
							width : 120,
							name : 'mail',
							allowBlank : false,
							vtype : 'email',
							minLength : 6,
							maxLength : 50
						}, {
							fieldLabel : '传真',
							name : 'fax',
							width : 120,
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
				items : [{
							fieldLabel : '手机',
							name : 'mobile',
							width : 120,
							// allowBlank : false,
							regex : /^[0-9]{5,20}$/,
							regexText : '只能输入长度为5到20位数字',
							minLength : 5,
							maxLength : 20
						}, {
							fieldLabel : '固话',
							name : 'office',
							width : 120,
							allowDecimals : false,
							regex : /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
							regexText : '办公电话格式错误，格式为 区号-座机号或者区号-座机号-分机号',
							allowDecimals : false,
							minValue : 1,
							maxValue : 60000
						}]
			}, {
				layout : 'form',
				defaultType : 'textfield',
				items : [{
							fieldLabel : 'qq',
							name : 'qq',
							width : 120,
							allowDecimals : false,
							regex : /^[0-9]*$/,
							regexText : '只能输入数字',
							minLength : 0,
							maxLength : 20
						}, {
							fieldLabel : 'msn',
							name : 'msn',
							width : 120,
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
											width : 120,
											minLength : 1,
											maxLength : 100
										}, {
											fieldLabel : '城市',
											vtype : 'SpecialChar',
											name : 'city',
											width : 120,
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
											maxLength : 50,
											width : 120
										}]
							}, {
								layout : 'form',
								defaultType : 'textfield',
								items : [{
											fieldLabel : '邮编',
											name : 'zipcode',
											width : 120,
											regex : /^[0-9]*$/,
											regexText : '只能输入数字',
											minLength : 5,
											maxLength : 20,
											allowBlank : true
										}]
							}]
				})

		],
		buttons : [{
					text : '保存',
					scope : this,
					handler : function() {
						var myMask = new Ext.LoadMask(Ext.getBody(), {
									msg : "数据处理中，请稍后..."
								});
						myMask.show();
						var vo = formPanel.getForm().getValues(false);
						SecurityService.updateAccountBasicInfo(user, vo, {
									callback : function(result) {
										// window.close();
										myMask.hide();
										Ext.MessageBox.show({
													title : '提示',
													msg : "个人基本信息修改成功！",
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.INFO
												});
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
					text : '关闭',
					handler : function() {
						window.close();
					}
				}],
		buttonAlign : 'center'
	});
	var myMask = new Ext.LoadMask(Ext.getBody(), {
				msg : "数据加载中，请稍后..."
			});
	myMask.show();
	SecurityService.getCurrentUserName('username', {
				callback : function(username) {
					user = username;
					SecurityService.getUserBaseInfoVo(username, {
								callback : function(result) {
									var value = new AccountVo(result);
									formPanel.getForm().loadRecord(value);
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
				}
			});

	var prompt = new Ext.Viewport({
				layout : 'fit',
				items : formPanel
			});
	return prompt;
}
Ext.onReady(function() {
			var prompt = new Apex.security.UserBaseInfoPanel();
			prompt.show();
		});