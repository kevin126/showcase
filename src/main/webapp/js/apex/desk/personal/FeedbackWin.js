Ext.namespace('Apex.Desk.FeedbackWin');

Apex.Desk.FeedbackWin.Window = function(pKey) {
	var pKey = pKey;
	var keyText = null;
	var titleText = null;
	var timeText = null;
	var timeText2 = null;
	var workerText = null;
	var idText = null;
	var deptText = null;
	var phoneText = null;
	var memoText = null;
	var levelRadio = null;
	var levelValue = UserFeedbackLevel.USER_FEEDBACK_NORMAL;
	var dataText = null;
	var mainPanel = null;
	var submitBtn = null;
	var cancelBtn = null;
	var mainWin = null;

	function doSubmit() {
		if (valid()) {
			IncidentService.clientAddFeedback(pKey, levelValue, dataText
							.getValue(), USER.getUserName(), function(
							returnValue) {
						if (!returnValue) {
							Ext.Msg.show({
										title : '错误',
										msg : '评价提交错误',
										modal : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});
						} else {
							mainWin.close();
						}

					});
		};
	};

	function buildWindow() {

		keyText = new Ext.form.TextField({
					fieldLabel : '工单号',
					disabled : true,
					anchor : '90%'
				});

		titleText = new Ext.form.TextField({
					fieldLabel : '主题',
					disabled : true,
					anchor : '90%'
				});

		timeText = new Ext.ux.form.DateTimeFieldFuture({
					fieldLabel : '期望完成时间',
					disabled : true,
					anchor : '90%'
				});

		timeText2 = new Ext.ux.form.DateTimeFieldFuture({
					fieldLabel : '实际完成时间',
					disabled : true,
					anchor : '90%'
				});

		workerText = new Ext.form.TextField({
					fieldLabel : '处理人',
					disabled : true,
					anchor : '90%'
				});

		idText = new Ext.form.TextField({
					fieldLabel : '工号',
					disabled : true,
					anchor : '90%'
				});

		deptText = new Ext.form.TextField({
					fieldLabel : '部门',
					disabled : true,
					anchor : '90%'
				});

		phoneText = new Ext.form.TextField({
					fieldLabel : '电话',
					disabled : true,
					anchor : '90%'
				});

		memoText = new Ext.form.TextArea({
					fieldLabel : '描述',
					disabled : true,
					anchor : '95%'
				});

		levelRadio = new Ext.form.RadioGroup({
					fieldLabel : '评价等级',
					items : [{
								boxLabel : '很满意',
								name : 'level',
								inputValue : UserFeedbackLevel.USER_FEEDBACK_VERY_GOOD,
								listeners : {
									check : function(radio, checked) {
										if (checked) {
											levelValue = radio.getGroupValue();
										}
									}
								}
							}, {
								boxLabel : '满意',
								name : 'level',
								inputValue : UserFeedbackLevel.USER_FEEDBACK_GOOD,
								listeners : {
									check : function(radio, checked) {
										if (checked) {
											levelValue = radio.getGroupValue();
										}
									}
								}
							}, {
								boxLabel : '基本满意',
								name : 'level',
								inputValue : UserFeedbackLevel.USER_FEEDBACK_NORMAL,
								listeners : {
									check : function(radio, checked) {
										if (checked) {
											levelValue = radio.getGroupValue();
										}
									}
								},
								checked : true
							}, {
								boxLabel : '不太满意',
								name : 'level',
								inputValue : UserFeedbackLevel.USER_FEEDBACK_BAD,
								listeners : {
									check : function(radio, checked) {
										if (checked) {
											levelValue = radio.getGroupValue();
										}
									}
								}
							}, {
								boxLabel : '很差',
								name : 'level',
								inputValue : UserFeedbackLevel.USER_FEEDBACK_VERY_BAD,
								listeners : {
									check : function(radio, checked) {
										if (checked) {
											levelValue = radio.getGroupValue();
										}
									}
								}
							}]
				});

		dataText = new Ext.form.TextArea({
					fieldLabel : '评价内容',
					anchor : '95%',
					maxLength : 250,
					height : 100
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
									items : [keyText, timeText, workerText,
											deptText]
								}, {
									items : [titleText, timeText2, idText,
											phoneText]
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

									items : [memoText, levelRadio, dataText]
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
					title : '服务评价',
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
		if (pKey != null) {
			IncidentService.getIncidentItemByProcKey(pKey,
					function(returnValue) {
						if (returnValue != null) {
							keyText.setValue(returnValue.procKey);
							titleText.setValue(returnValue.title);
							var date = new Date(returnValue.expectedCompleteTime);
							timeText.setValue(Ext.util.Format.date(date,
									'Y-m-d H:i:s'));
							var date2 = new Date(returnValue.realCompleteTime);
							timeText2.setValue(Ext.util.Format.date(date2,
									'Y-m-d H:i:s'));
							workerText.setValue(returnValue.handleUser);
							memoText.setValue(returnValue.memo);
							SecurityService.getUserInfo(returnValue.handleUser,
									function(returnValue2) {
										if (returnValue2 != null) {
											idText
													.setValue(returnValue2.basicInfo.employeeNo);
											deptText
													.setValue(returnValue2.deptName);
											phoneText
													.setValue(returnValue2.basicInfo.phone.office);
										}
									});
						} else {
							showErrMessage('数据加载错误！');
						}
					});
		}
	};

	function valid() {
		var data = dataText.getValue().trim();
		if (Ext.isEmpty(data)) {
			showErrMessage('评价内容不能为空！');
			return false;
		}
		if (!Ext.isEmpty(data) && data.length > 50) {
			showErrMessage('评价内容长度不能超过50个字符！');
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
					icon : Ext.Msg.ERROR
				});
	};

	this.getWin = function() {
		buildWindow();
		mainWin.show();
		return mainWin;
	};

	return this;
};
