Ext.namespace('Apex.Desk.Enterprise.Pending.RW');

Apex.Desk.Enterprise.Pending.RW = function(rId,clientName, callbackFC) {
	var rId = rId;
	this.callbackFC = callbackFC;
	var titleText = null;
	var memoText = null;
	var clientText = null;
	var deptText = null;
	var idText = null;
	var emailText = null;
	var mobileText = null;
	var timeText = null;
	var priorityText = null;
	var severityText = null;
	var mainPanel = null;
	var submitBtn = null;
	var cancelBtn = null;
	var numberIndex = 0;
	var attachPanel = null;
	var mainWin = null;
	var eventTypeId = 0;
	var eventTypeText = null;
	var daAry = new Array();
	var incidentTypeTree = null;
	var clName = clientName;

	function doSubmit() {
		if (valid()) {
			DeskEnterpriseService.stTsk(rId, eventTypeId, eventTypeText
							.getValue(), priorityText.getValue(), severityText
							.getValue(), memoText.getValue(), USER
							.getUserName(), function(returnValue) {
						if (!returnValue) {
							Ext.Msg.show({
										title : '错误',
										msg : '该请求已被提交！',
										modal : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.WARNING
									});
						} else {
							　Ext.Msg.show({
											title : '提示',
											msg : '请求提交成功！',
											modal : true,
											buttons : Ext.Msg.OK,
											icon : Ext.Msg.INFO
										});
							mainWin.close();
							callbackFC();
						}
					});
		}
		return;
	};

	function showEventTypePanel() {
		incidentTypeTree = new Apex.maintenance.incident.IncidentTypeTreePanel();
		var treeWindow = new Ext.Window({
					id : 'Apex.Desk.Enterprise.Pending.PW',
					title : '选择事件类别',
					closable : true,
					width : 250,
					border : false,
					plain : true,
					resizable : false,
					modal : true,
					items : [incidentTypeTree],
					buttons : [{
								id : 'Apex.Desk.Enterprise.Pending.PW.OK',
								text : '确定',
								disabled : true,
								handler : selectIncidentType
							}, {
								text : '取消',
								handler : function() {
									treeWindow.close();
								}
							}],
					buttonAlign : 'center'
				});
		incidentTypeTree.on('dblclick', selectIncidentType);
		incidentTypeTree.on('click', function(selectdeNode) {
					if (selectdeNode.id != '0')
						Ext.getCmp('Apex.Desk.Enterprise.Pending.PW.OK')
								.setDisabled(false);
					else
						Ext.getCmp('Apex.Desk.Enterprise.Pending.PW.OK')
								.setDisabled(true);
				})
		treeWindow.show();
	};

	function selectIncidentType() {
		var treeNode = incidentTypeTree.getSelectionModel().getSelectedNode();
		if (treeNode.text == '事件类别')
			return;
		selectedTypeNode = treeNode;
		eventTypeId = treeNode.id;
		eventTypeText.setValue(treeNode.text);
		Ext.getCmp('Apex.Desk.Enterprise.Pending.PW').close();
	};

	function buildWindow() {

		titleText = new Ext.form.TextField({
					fieldLabel : '标题',
					allowBlank : false,
					vtype : 'SpecialChar',
					maxLength : 100,
					disabled : true,
					anchor : '90%'
				});

		timeText = new Ext.ux.form.DateTimeFieldFuture({
					fieldLabel : '期望完成时间',
					allowBlank : false,
					readOnly : true,
					disabled : true,
					anchor : '90%'
				});
		clientText = new Ext.form.TextField({
					fieldLabel : '请求人',
					readOnly : true,
					maxLength : 100,
					disabled : true,
					value : clName,
					anchor : '90%'
				});
		deptText = new Ext.form.TextField({
					fieldLabel : '部门',
					readOnly : true,
					maxLength : 100,
					disabled : true,
					anchor : '90%'
				});
		idText = new Ext.form.TextField({
					fieldLabel : '工号',
					readOnly : true,
					disabled : true,
					maxLength : 100,
					anchor : '90%'
				});
		emailText = new Ext.form.TextField({
					fieldLabel : '电邮',
					readOnly : true,
					disabled : true,
					maxLength : 100,
					anchor : '90%'
				});
		mobileText = new Ext.form.TextField({
					fieldLabel : '手机',
					readOnly : true,
					disabled : true,
					maxLength : 100,
					anchor : '90%'
				});

		memoText = new Ext.form.TextArea({
					fieldLabel : '描述',
					anchor : '95%',
					maxLength : 20000,
					height : 100
				});
		severityText = new Ext.form.ComboBox({
					fieldLabel : '严重度',
					triggerAction : 'all',
					displayField : 'severityName',
					valueField : 'severityValue',
					readOnly : true,
					mode : 'local',
					forceSelection : true,
					typeAhead : true,
					value : 1,
					handleHeight : 10,
					anchor : '90%',
					store : new Ext.data.SimpleStore({
								fields : ['severityName', 'severityValue'],
								data : [['高', 1], ['中', 2], ['低', 3]]
							})
				});
		priorityText = new Ext.form.ComboBox({
					fieldLabel : '优先级',
					triggerAction : 'all',
					displayField : 'priorityName',
					valueField : 'priorityValue',
					readOnly : true,
					mode : 'local',
					forceSelection : true,
					typeAhead : true,
					value : 1,
					handleHeight : 10,
					anchor : '90%',
					store : new Ext.data.SimpleStore({
								fields : ['priorityName', 'priorityValue'],
								data : [['紧急', 1], ['高', 2], ['中', 3],
										['低', 4]]
							})
				});
		eventTypeText = new Ext.form.TriggerField({
					fieldLabel : '事件类别',
					allowBlank : false,
					hideTrigger : false,
					readOnly : true,
					anchor : '90%',
					onTriggerClick : showEventTypePanel
				});
		attachPanel = new Ext.FormPanel({
					fileUpload : true,
					frame : false,
					bodyStyle : 'padding:5px 5px 0',
					items : [{
								layout : 'column',
								items : [{
											id : 'attachment_checkbox_add',
											hideLabel : true,
											columnWidth : .01,
											layout : 'form',
											hidden : true,
											items : []
										}, {
											id : 'attachment_filetext_add',
											columnWidth : .99,
											layout : 'form',
											hideLabel : true,
											items : []
										}]
							}]
				});

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
							items : [titleText, clientText, emailText,
									eventTypeText, priorityText]
						}, {
							items : [timeText, deptText, idText, mobileText,
									severityText]
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

		submitBtn = new Ext.Button({
					text : '提交',
					disabled : false,
					handler : doSubmit,
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
					width : 550,
					border : false,
					modal : true,
					plain : true,
					resizable : false,
					items : [mainPanel],
					buttons : [submitBtn, cancelBtn],
					buttonAlign : 'center'
				});

		if (rId > 0) {
			DeskPersonalService.indexRequest(rId, function(returnValue) {
				if (returnValue != null) {
					titleText.setValue(returnValue.taskTitle);
					memoText.setValue(Ext.util.Format.htmlDecode(returnValue.taskMemo));
					var date = new Date(returnValue.completeTime);
					timeText
							.setValue(Ext.util.Format.date(date, 'Y-m-d H:i:s'));
				} else {
					showErrMessage('该请求已被提交！');
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

		SecurityService.getUserInfo(clName, function(returnValue) {
					if (returnValue != null) {
						deptText.setValue(returnValue.deptName);
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
		if (Ext.isEmpty(eventTypeText.getValue())) {
			showErrMessage('事件类别不能为空！');
			return false;
		}
		return true;
	};

	function showErrMessage(message) {
		Ext.Msg.show({
					title : '错误',
					msg : message,
					modal : true,
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
	};

	function delAttachment() {
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
				var tempText = mainPanel.findById('attachment_filetext_add')
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
	};
	return this;
};
