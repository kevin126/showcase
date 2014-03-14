Ext.namespace('Apex.Common.AddOrderMonitorWin');

/*******************************************************************************
 * COMPANY: TEKVIEW CRATE BY: JONIM CREATE DATE: 2009-9-8 LAST UPDATE DATE: LAST
 * UPDATE BY: DESCRIPTION: This funtion is to create a panel which is for add a
 * new borrow asset order
 * ****************************************************************************************************************************
 */

Apex.Common.AddOrderMonitorWin.Window = function(callbackFC,orderType,orderId) {
	this.callbackFC = callbackFC;
	var userText = null;
	var mainPanel = null;
	var submitBtn = null;
	var cancelBtn = null;
	var mainWin = null;
	var orderTypeText = null;
	var orderIdText = null;
	var userListTree =null;
	
	
	function buildWindow() {
		//user tree
		userListTree = new Apex.maintenance.duty.UserListTreePanel('','add_user_btn_id');
		//orderType
		orderTypeText = new Ext.form.TextField({
				name : 'orderType',
				hidden : true,
				labelSeparator : "",
				value : orderType
			})
		//orderId
		orderIdText = new Ext.form.TextField({
				name : 'orderId',
				labelSeparator : "",
				hidden : true,
				value : orderId
			})
		//main panel
		mainPanel = new Ext.FormPanel({
					frame : true,
					layout : 'form',
					labelWidth : 60,
					items : [userListTree,orderTypeText,orderIdText]
				});
		//submit button
		submitBtn = new Ext.Button({
					text : '确定',
					id : 'add_user_btn_id',
					disabled : true,
					handler : function() {
						var selectNodes = userListTree.getChecked();
						if (selectNodes.length == 0) {
							Ext.Msg.show({
									title : '提示',
									msg : '请选择监控人！',
									modal : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.INFO
								});
							return;
						}else if (valid()) {
							var tempText =null;
							var tempname = null;
							for (var i = 0; i < selectNodes.length; i++) {
								tempText = selectNodes[i].id;
								tempname = selectNodes[i].text;
								var orderMonitor = new Array();
								orderMonitor = mainPanel.getForm().getValues();
								orderMonitor["userId"]=tempText;
								OrderMonitorService.save(orderMonitor, function(returnValue) {
										if (returnValue == false) {
											Ext.Msg.show({
														title : '警告',
														msg : '选中用户'+tempname+'已经在监控列表中！',
														modal : true,
														buttons : Ext.Msg.OK,
														icon : Ext.Msg.WARNING
													});
										} else {
											Ext.Msg.show({
														title : '提示',
														msg : '添加成功！',
														modal : true,
														buttons : Ext.Msg.OK,
														icon : Ext.Msg.INFO
													});
											mainWin.close();
											callbackFC();
										}

								});
							}
						}
					},
					minWidth : 80
				});
        //cancel button
		cancelBtn = new Ext.Button({
					text : '取消',
					disabled : false,
					handler : function() {
						mainWin.close();
					},
					minWidth : 80
				});
        //create main window
		mainWin = new Ext.Window({
					title : '添加监控人',
					closable : true,
					width : 400,
					border : false,
					modal : true,
					plain : true,
					resizable : false,
					items : [mainPanel],
					buttons : [submitBtn, cancelBtn],
					buttonAlign : 'center'
				});
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
	
	function valid() {
		var data = orderTypeText.getValue().trim();
		if (Ext.isEmpty(data)) {
			showErrMessage('订单类型不能为空！');
			return false;
		}
		
		data = orderIdText.getValue().trim();
		if (Ext.isEmpty(data)) {
			showErrMessage('订单号不能为空！');
			return false;
		}
		return true;
	};

	this.getWin = function() {
		buildWindow();
		mainWin.show();
		return mainWin;
	};

	return this;
};
