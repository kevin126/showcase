/**
 * 修改密码
 * 
 * @param {}
 *            cfg
 * @return {}
 */
Apex.security.UserUpdatePwdPanel = function(cfg) {
	var name;
	cfg = cfg || {};
	Ext.apply(this, cfg);
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'qtip';
	var old_password = new Ext.form.TextField({
		id : 'old_password',
		fieldLabel : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;旧密码<font color="#FF0000">*</font>',
		regex : /^[A-Za-z0-9]{4,20}$/,
		regexText : '只能输入字母和数字，长度为4到20',
		inputType : 'password',
		width : 250,
		allowBlank : false
	});
	var nonePanel = new Ext.Panel({
				width : 100,
				height : 50
			});
	var nonePanel1 = new Ext.Panel({
				width : 100,
				height : 20
			});
	var nonePanel2 = new Ext.Panel({
				width : 100,
				height : 20
			});
	var new_password = new Ext.form.TextField({
		id : 'new_password',
		fieldLabel : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;新密码<font color="#FF0000">*</font>',
		regex : /^[A-Za-z0-9]{4,20}$/,
		regexText : '只能输入字母和数字，长度为4到20',
		inputType : 'password',
		width : 250,
		allowBlank : false
	});
	var newagain_password = new Ext.form.TextField({
		id : 'newagain_password',
		fieldLabel : '&nbsp;&nbsp;&nbsp;&nbsp;确认密码<font color="#FF0000">*</font>',
		regex : /^[A-Za-z0-9]{4,20}$/,
		regexText : '只能输入字母和数字，长度为4到20',
		inputType : 'password',
		width : 250,
		allowBlank : false
	});
	/**
	 * 得到输入的值
	 * 
	 * @return data{old_password, new_password, newagain_password}
	 */
	var getInputValue = function() {
		var data = panel.getForm().getValues(false);
		return data;
	};
	var colse = new Ext.Button({
				minWidth : 60,
				text : '关闭',
				handler : function() {
					window.close();
				}
			});
	var ok = new Ext.Button({
				minWidth : 60,
				text : '确定',
				formBind : true,
				disabled : true,
				handler : function() {
					var user = getInputValue();
					var myMask = new Ext.LoadMask(Ext.getBody(), {
								msg : "数据处理中，请稍后..."
							});
					myMask.show();
					SecurityService.changePassword(name, user.old_password,
							user.new_password, user.newagain_password, {
								callback : function() {
//									panel.getForm().reset();
//									window.close();
									myMask.hide();
									Ext.MessageBox.show({
												title : '提示',
												msg : '密码设置成功！',
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.INFO,
												fn:function(){window.close();}
											});
									return;

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
	var panel = new Ext.form.FormPanel({
				frame : true,
				labelWidth : 80,
				height : 200,
				width : 450,
				region : 'center',
				layout : 'form',
				monitorValid : true,
				buttonAlign : 'center',
				items : [nonePanel, old_password, nonePanel1, new_password,
						nonePanel2, newagain_password],
				buttons : [ok, colse]
			});
	SecurityService.getCurrentUserName('username', {
				callback : function(username) {
					name = username;
				}
			});
	var finalPanel = new Ext.Panel({
				layout : 'border',
				closable : true,
				border : false,
				modal : true,
				items : panel
			});

	var prompt = new Ext.Viewport({
				layout : 'fit',
				items : finalPanel
			});
	return prompt;
}
Ext.onReady(function() {
			var prompt = new Apex.security.UserUpdatePwdPanel();
			prompt.show();
		});