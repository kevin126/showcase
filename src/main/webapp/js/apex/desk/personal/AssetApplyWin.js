Ext.namespace('Apex.Desk.AssetApplyWin');

Apex.Desk.AssetApplyWin.Window = function(callbackFC) {
	this.callbackFC = callbackFC;
	var titleText = null;
	var memoText = null;
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

		memoText = new Ext.form.TextArea({
					fieldLabel : '描述',
					anchor : '95%',
					maxLength : 225,
					height : 200
				});
		memoText.on('invalid', function(obj) {
					submitBtn.setDisabled(true);
				});
		memoText.on('valid', function(obj) {
					submitBtn.setDisabled(false);
				});
				
		titleText.on('invalid', function(obj) {
					submitBtn.setDisabled(true);
				});
		titleText.on('valid', function(obj) {
					submitBtn.setDisabled(false);
				});

		mainPanel = new Ext.Panel({
					frame : true,
					layout : 'form',
					labelWidth : 60,
					items : [titleText, memoText]
				});

		submitBtn = new Ext.Button({
					text : '提交',
					disabled : false,
					handler : function() {
						if (valid()) {
							ApplyService.startAssetDrawApply(
									USER.getUserName(), titleText.getValue(),
									memoText.getValue(), function(returnValue) {
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
					title : '资产领用请求',
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
		if (Ext.isEmpty(data)) {
			showErrMessage('标题不能为空！');
			return false;
		}
		if (!Ext.isEmpty(data) && data.length > 100) {
			showErrMessage('标题长度不能超过100个字符！');
			return false;
		}

		data = memoText.getValue().trim();
		if (Ext.isEmpty(data)) {
			showErrMessage('描述不能为空！');
			return false;
		}
		if (!Ext.isEmpty(data) && data.length > 20000) {
			showErrMessage('描述长度不能超过20000个字符！');
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
