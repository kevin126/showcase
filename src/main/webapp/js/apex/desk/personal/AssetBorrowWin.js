Ext.namespace('Apex.Desk.AssetBorrowWin');

/*******************************************************************************
 * COMPANY: TEKVIEW CRATE BY: JONIM CREATE DATE: 2009-9-8 LAST UPDATE DATE: LAST
 * UPDATE BY: DESCRIPTION: This funtion is to create a panel which is for add a
 * new borrow asset order
 * ****************************************************************************************************************************
 */

Apex.Desk.AssetBorrowWin.Window = function(callbackFC) {
	this.callbackFC = callbackFC;
	var titleText = null;
	var assetText = null;
	var mainPanel = null;
	var submitBtn = null;
	var cancelBtn = null;
	var mainWin = null;

	function buildWindow() {

		titleText = new Ext.form.TextField({
					fieldLabel : '标题',
					disabled : false,
					vtype : 'SpecialChar',
					anchor : '95%',
					maxLength : 100
				});
		titleText.on('invalid', function(obj) {
					submitBtn.setDisabled(true);
				});
		titleText.on('valid', function(obj) {
					submitBtn.setDisabled(false);
				});

		borrowDate = new Ext.ux.form.DateTimeFieldFuture({
					fieldLabel : '借调日期',
					allowBlank : false,
					readOnly : true,
					anchor : '95%'
				});

		returnDate = new Ext.ux.form.DateTimeFieldFuture({
					fieldLabel : '归还日期',
					allowBlank : false,
					readOnly : true,
					anchor : '95%'
				});

		memo = new Ext.form.TextArea({
					fieldLabel : '描述',
					anchor : '95%',
					maxLength : 225,
					disabled : false,
					height : 230
				});

		memo.on('invalid', function(obj) {
					submitBtn.setDisabled(true);
				});
		memo.on('valid', function(obj) {
					submitBtn.setDisabled(false);
				});
		mainPanel = new Ext.Panel({
					frame : true,
					layout : 'form',
					items : [titleText, borrowDate, returnDate, memo]
				});

		submitBtn = new Ext.Button({
					text : '提交',
					disabled : false,
					handler : function() {
						if (valid()) {
							ApplyService.startAssetBorrowApply(USER
											.getUserName(), titleText
											.getValue(), memo.getValue(),
									borrowDate.getValue() + ':00', returnDate
											.getValue()
											+ ':00', function(returnValue) {
										if (returnValue == null) {
											Ext.Msg.show({
														title : '错误',
														msg : '请求提交错误！',
														modal : true,
														buttons : Ext.Msg.OK,
														icon : Ext.Msg.WARNING
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
						}
					},
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
					title : '资产借调请求',
					closable : true,
					width : 700,
					border : false,
					modal : true,
					plain : true,
					resizable : false,
					items : [mainPanel],
					buttons : [submitBtn, cancelBtn],
					buttonAlign : 'center'
				});
	};

	function valid() {
		var data = titleText.getValue().trim();
		var bdatt = borrowDate.getValue().trim();
		var rdata = returnDate.getValue().trim();
		var memodata = memo.getValue().trim();
		if (Ext.isEmpty(data)) {
			showErrMessage('标题不能为空！');
			return false;
		}
		if (Ext.isEmpty(bdatt)) {
			showErrMessage('借调日期不能为空！');
			return false;
		}
		if (Ext.isEmpty(rdata)) {
			showErrMessage('归还日期不能为空！');
			return false;
		}
		if (Ext.isEmpty(memodata)) {
			showErrMessage('描述不能为空！');
			return false;
		}
		if (Ext.isEmpty(data)) {
			showErrMessage('标题不能为空！');
			return false;
		}
		
		if (!Ext.isEmpty(data) && data.length > 100) {
			showErrMessage('标题长度不能超过100个字符！');
			return false;
		}
		var bd = borrowDate.getValue();
		var rd = returnDate.getValue();
		if (bd > rd) {
			showErrMessage('归还日期不能早于借调日期！');
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

	return this;
};
