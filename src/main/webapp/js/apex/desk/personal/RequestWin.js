Ext.namespace('Apex.Desk.RequestWin');

Apex.Desk.RequestWin.Window = function(rId, callbackFC) {
	var rId = rId;
	this.callbackFC = callbackFC;
	var titleText = null;
	var memoText = null;
	var clientText = null;
	var deptText = null;
	var postText = null;
	var idText = null;
	var emailText = null;
	var mobileText = null;
	var timeText = null;
	var mainPanel = null;
	var submitBtn = null;
	var saveBtn = null;
	var cancelBtn = null;
	var numberIndex = 0;
	var attachPanel = null;
	var mainWin = null;
	var daAry = new Array();

	function doSubmit() {
		if (valid()) {
			var empty = true;
			if (numberIndex > 0) {
				empty = false;
			}
			var attachFileName = '';
			for (var i = 0; i < numberIndex; i++) {
				var tempFileText = Ext.getCmp('attachTextfiled_add' + i);
				if (!Ext.isEmpty(tempFileText)) {
					attachFileName += tempFileText.getValue() + ';';
				}
			}
			if (!Ext.isEmpty(attachFileName)) {
				attachFileName = attachFileName.substring(0,
						attachFileName.length - 1);
			}
			if (!empty) {
				var uploadAttachMask = new Ext.LoadMask(mainWin.id, {
							msg : "正在上传附件，请稍等..."
						});
				uploadAttachMask.show();
			}
			attachPanel.getForm().submit({
				url : 'uploadrequestattachment',
				success : function(form, action) {
					if (!empty) {
						uploadAttachMask.hide();
					}
					var processeMask = new Ext.LoadMask(mainWin.id, {
								msg : "正在处理，请稍等..."
							});
					processeMask.show();
					DeskPersonalService.commitRequest(rId, USER.getUserName(),
							timeText.getValue() + ':00', titleText.getValue()
									.trim(), memoText.getValue().trim(), true,
							daAry, function(returnValue) {
								processeMask.hide();
								if (!returnValue) {
									Ext.Msg.show({
												title : '错误',
												msg : '请求提交错误！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.ERROR
											});
								} else {
									Ext.Msg.show({
												title : '提示',
												msg : '提交成功！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.INFO
									});
									mainWin.close();
									callbackFC();
								}

							});
				},
				failure : function(form, action) {
					if (!empty) {
						uploadAttachMask.hide();
					}
					var value = action.result.message;
					Ext.Msg.show({
								title : '错误',
								msg : value,
								modal : true,
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.WARNING
							});
					return;
				}
			});

		};
	};

	function doSave() {
		if (valid()) {
			var empty = true;
			if (numberIndex > 0) {
				empty = false;
			}
			var attachFileName = '';
			for (var i = 0; i < numberIndex; i++) {
				var tempFileText = Ext.getCmp('attachTextfiled_add' + i);
				if (!Ext.isEmpty(tempFileText)) {
					attachFileName += tempFileText.getValue() + ';';
				}
			}
			if (!Ext.isEmpty(attachFileName)) {
				attachFileName = attachFileName.substring(0,
						attachFileName.length - 1);
			}
			if (!empty) {
				var uploadAttachMask = new Ext.LoadMask(mainWin.id, {
							msg : "正在上传附件，请稍等..."
						});
				uploadAttachMask.show();
			}
			attachPanel.getForm().submit({
				url : 'uploadrequestattachment',
				success : function(form, action) {
					if (!empty) {
						uploadAttachMask.hide();
					}
					var processeMask = new Ext.LoadMask(mainWin.id, {
								msg : "正在处理，请稍等..."
							});
					processeMask.show();
					DeskPersonalService.commitRequest(rId, USER.getUserName(),
							timeText.getValue() + ':00', titleText.getValue()
									.trim(), memoText.getValue().trim(), false,
							daAry, function(returnValue) {
								processeMask.hide();
								if (!returnValue) {
									Ext.Msg.show({
												title : '错误',
												msg : '请求保存错误！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.WARNING
											});
								} else {
									Ext.Msg.show({
												title : '提示',
												msg : '保存成功！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.INFO
									});
									mainWin.close();
									callbackFC();
								}
							});
				},
				failure : function(form, action) {
					if (!empty) {
						uploadAttachMask.hide();
					}
					var value = action.result.message;
					Ext.Msg.show({
								title : '错误',
								msg : value,
								modal : true,
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.WARNING
							});
					return;
				}
			});
		}
	};

	function buildWindow() {

		titleText = new Ext.form.TextField({
					fieldLabel : '标题',
					allowBlank : false,
					vtype : 'SpecialChar',
					maxLength : 100,
					anchor : '90%'
				});
		titleText.on('invalid', function(obj) {
					submitBtn.setDisabled(true);
					saveBtn.setDisabled(true);
				});
		titleText.on('valid', function(obj) {
					submitBtn.setDisabled(false);
					saveBtn.setDisabled(false);
				});

		timeText = new Ext.ux.form.DateTimeFieldFuture({
					fieldLabel : '期望完成时间',
					allowBlank : false,
					readOnly : true,
					anchor : '90%'
				});
		clientText = new Ext.form.TextField({
					fieldLabel : '请求人',
					readOnly : true,
					maxLength : 100,
					value : USER.getUserName(),
					anchor : '90%'
				});
		deptText = new Ext.form.TextField({
					fieldLabel : '部门',
					readOnly : true,
					maxLength : 100,
					anchor : '90%'
				});
		postText = new Ext.form.TextField({
					fieldLabel : '职务',
					readOnly : true,
					maxLength : 100,
					anchor : '90%'
				});
		idText = new Ext.form.TextField({
					fieldLabel : '工号',
					readOnly : true,
					maxLength : 100,
					anchor : '90%'
				});
		emailText = new Ext.form.TextField({
					fieldLabel : '电邮',
					readOnly : true,
					maxLength : 100,
					anchor : '90%'
				});
		mobileText = new Ext.form.TextField({
					fieldLabel : '手机',
					readOnly : true,
					maxLength : 100,
					anchor : '90%'
				});

		memoText = new Ext.form.TextArea({
					fieldLabel : '描述',
					anchor : '95%',
					maxLength : 20000,
					height : 230
				});
		memoText.on('invalid', function(obj) {
					submitBtn.setDisabled(true);
					saveBtn.setDisabled(true);
					
				});
		memoText.on('valid', function(obj) {
					submitBtn.setDisabled(false);
					saveBtn.setDisabled(false);
				});

		attachPanel = new Ext.FormPanel({
					fileUpload : true,
					tbar : [{
								text : '增加附件',
								cls : 'x-btn-text-icon',
								icon : 'images/icons/add.gif',
								handler : function() {
									addAttachment(numberIndex)
								}
							}, {
								text : '删除附件',
								cls : 'x-btn-text-icon',
								icon : 'images/icons/delete.gif',
								handler : delAttachment
							}],
					frame : false,
					bodyStyle : 'padding:5px 5px 0',
					items : [{
								layout : 'column',
								items : [{
											id : 'attachment_checkbox_add',
											hideLabel : true,
											columnWidth : .05,
											layout : 'form',
											items : []
										}, {
											id : 'attachment_filetext_add',
											columnWidth : .95,
											layout : 'form',
											hideLabel : true,
											items : []
										}]
							}]
				});
		if (rId > 0) {
			mainPanel = new Ext.Panel({
				frame : true,
				items : [{
					xtype : 'panel',
					layout : 'column',
					border : false,
					defaults : {
						bordr : false,
						layout : 'form',
						labelWidth : 80,
						columnWidth : .5
					},
					//fix by jonim at 2009-9-16
					items : [{
								items : [titleText]
							}, {
								items : [timeText]
							}]
				}, {
					xtype : 'panel',
					layout : 'column',
					border : false,
					defaults : {
						bordr : false,
						layout : 'form',
						labelWidth : 80,
						columnWidth : .99
					},
					items : [{
								items : [memoText]
							}]
				}, {
					xtype : 'panel',
					layout : 'column',
					border : false,
					defaults : {
						bordr : false,
						columnWidth : .99
					},
					items : [{
								items : [attachPanel]
							}]
				}]
			});
		} else {
			mainPanel = new Ext.Panel({
						frame : true,
						items : [{
									xtype : 'panel',
									layout : 'column',
									border : false,
									defaults : {
										bordr : false,
										layout : 'form',
										labelWidth : 80,
										columnWidth : .5
									},
									items : [{
												items : [titleText]
											}, {
												items : [timeText]
											}]
								}, {
									xtype : 'panel',
									layout : 'column',
									border : false,
									defaults : {
										bordr : false,
										layout : 'form',
										labelWidth : 80,
										columnWidth : .99
									},
									items : [{
												items : [memoText]
											}]
								}, {
									xtype : 'panel',
									layout : 'column',
									border : false,
									defaults : {
										bordr : false,
										columnWidth : .99
									},
									items : [{
												items : [attachPanel]
											}]
								}]
					});
		}

		submitBtn = new Ext.Button({
					text : '提交',
					disabled : false,
					handler : doSubmit,
					minWidth : 80
				});

		saveBtn = new Ext.Button({
					text : '保存',
					disabled : false,
					handler : doSave,
					minWidth : 80
				});

		cancelBtn = new Ext.Button({
					text : '取消',
					disabled : false,
					handler : function() {
						mainWin.close();
					},
					minWidth : 80
				});

		mainWin = new Ext.Window({
					title : '服务请求',
					closable : true,
					width : 700,
					border : false,
					modal : true,
					plain : true,
					resizable : false,
					items : [mainPanel],
					buttons : [submitBtn, saveBtn, cancelBtn],
					buttonAlign : 'center'
				});

		if (rId > 0) {
			DeskPersonalService.indexRequest(rId, function(returnValue) {
						if (returnValue != null) {
							if (returnValue.take) {
								showErrMessage('请求已经提交！');
							} else {
								titleText.setValue(returnValue.taskTitle);
								memoText.setValue(Ext.util.Format
										.htmlDecode(returnValue.taskMemo));
								var date = new Date(returnValue.completeTime);
								timeText.setValue(Ext.util.Format.date(date,
										'Y-m-d H:i:s'));
							}
						} else {
							showErrMessage('数据加载错误！');
						}
					});
			DeskPersonalService.queryAttachList(rId, function(returnValue) {
						if (returnValue != null) {
							var i = returnValue.pop();
							while (i != null) {
								addExistAttachment(numberIndex, i);
								i = returnValue.pop();
							}
						}
					});
		}

		SecurityService.getUserInfo(USER.getUserName(), function(returnValue) {
					if (returnValue != null) {
						deptText.setValue(returnValue.deptName);
						postText.setValue(returnValue.basicInfo.title);
						idText.setValue(returnValue.basicInfo.employeeNo);
						emailText.setValue(returnValue.basicInfo.phone.mail);
						mobileText.setValue(returnValue.basicInfo.phone.mobile);
					}
				})
	};

	function valid() {
		var title = titleText.getValue().trim();
		if (Ext.isEmpty(title)) {
			showErrMessage('标题不能为空！');
			return false;
		}
		if (!Ext.isEmpty(title) && title.length > 100) {
			showErrMessage('标题长度不能超过100个字符！');
			return false;
		}
		if (!titleText.isValid()) {
			showErrMessage('标题不能含有非法字符！');
			return false;
		}
		var memo = memoText.getValue().trim();
		if (Ext.isEmpty(memo)) {
			showErrMessage('描述长度不能为空！');
			return false;
		}
		if (!Ext.isEmpty(memo) && memo.length > 20000) {
			showErrMessage('描述长度不能超过20000个字符！');
			return false;
		}
		if (Ext.isEmpty(timeText.getValue())) {
			showErrMessage('期望完成时间不能为空！');
			return false;
		}
		return true;
	};

	function showErrMessage(message) {
		Ext.Msg.show({
					title : '错误',
					msg : message,
					modal : true,
					fn : function() {
					//	mainWin.close();
					},
					buttons : Ext.Msg.OK,
					icon : Ext.Msg.WARNING
				});
	};

	this.getWin = function() {
		buildWindow();
		mainWin.show();
		return mainWin;
	};

	function addExistAttachment(index, attach) {
		var tempCheckbox = new Ext.form.Checkbox({
					id : 'attachCheckbox_add' + index,
					hideLabel : true,
					checked : false,
					anchor : '95%'
				});
		mainPanel.findById('attachment_checkbox_add').add(tempCheckbox);
		mainPanel.findById('attachment_checkbox_add').doLayout();
		mainPanel.findById('attachment_filetext_add').add({
					id : 'attachTextfiled_add' + index,
					xtype : 'textfield',
					hideLabel : true,
					name : 'existAttach',
					value : attach,
					disabled : true,
					anchor : '95%'
				});
		mainPanel.findById('attachment_filetext_add').doLayout();
		numberIndex++
	};

	function addAttachment(index) {
		if (index < 4) {
			var tempCheckbox = new Ext.form.Checkbox({
						id : 'attachCheckbox_add' + index,
						hideLabel : true,
						checked : false,
						anchor : '95%'
					});
			mainPanel.findById('attachment_checkbox_add').add(tempCheckbox);
			mainPanel.findById('attachment_checkbox_add').doLayout();
			mainPanel.findById('attachment_filetext_add').add({
						id : 'attachTextfiled_add' + index,
						xtype : 'textfield',
						hideLabel : true,
						inputType : 'file',
						name : 'last',
						anchor : '95%'
					});
			mainPanel.findById('attachment_filetext_add').doLayout();
			numberIndex++
		} else {
			showErrMessage('最多四个附件！');
		}
	};
	
	function delAttachment() {
		if (numberIndex > 0) {
			var deleteList = new Array();
			for (var i = 0; i < numberIndex; i++) {
				var tempCheckBox = mainPanel.findById('attachCheckbox_add' + i);
				if (null != tempCheckBox && tempCheckBox.getValue())
					deleteList.push(i);
			}
			if (deleteList.length == 0) {
				Ext.Msg.show({
							title : '提示',
							msg : '请选择你要删除的附件！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.INFO
						});
			} else {
				for (var i = 0; i < deleteList.length; i++) {
					mainPanel.findById('attachment_checkbox_add')
							.remove('attachCheckbox_add' + deleteList[i]);
					var tempText = mainPanel
							.findById('attachment_filetext_add')
							.findById('attachTextfiled_add' + deleteList[i]);
					if (tempText != null) {
						if (tempText.getName() == 'existAttach') {
							daAry.push(tempText.getValue());
						}
					}
					mainPanel.findById('attachment_filetext_add')
							.remove('attachTextfiled_add' + deleteList[i]);
				}
				mainPanel.findById('attachment_checkbox_add').doLayout();
				mainPanel.findById('attachment_filetext_add').doLayout();;
			}
		} else {
			Ext.Msg.show({
						title : '提示',
						msg : '请先添加附件！',
						modal : true,
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.INFO
					});
		}
	};
	return this;
};
