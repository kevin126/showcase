Ext.namespace('Apex.setting.email')
Apex.setting.email.EmailServerPanel = function(){
	var newWin = null;
	var initMailInfo = null;
	var mailConfigPanel = null;
	var isChanged = false;
	
	this.showWindow = function(){
		var addPanel = createPanel();
		newWin = new Ext.Window({
			title : '邮件服务器设置',
			closable : true,
			width : 436,
			border : false,
			plain : true,
			resizable : false,
			modal:true,
			items : [addPanel]
		});
		newWin.show();
	}
	function createPanel() {
		var senderAress = new Ext.form.TextField({
				id : 'senderAress',
				fieldLabel : '发件人地址',
				//width : 250,
				anchor:'93%',
				allowBlank : false,
				//vtype : 'email',
				minLength : 6,
				maxLengthText : '发件人地址长度不少于6个字符',
				maxLength : 50,
				maxLengthText : '发件人地址长度不超过30个字符',
				blankText : '请输入发件人地址'
			});
		var port =  new Ext.form.NumberField({
				id : 'port',
				fieldLabel : '端口',
				//width : 250,
				anchor:'93%',
				value : 25,
				maxValue : 65535,
				allowBlank : false,
				//vtype : 'CommonPortText',
				blankText : '请输入端口号'
			});
		var smtpServer = new Ext.form.TextField({
				id : 'smtpServer',
				fieldLabel : 'SMTP服务器',
				//width : 250,
				anchor:'93%',
				//vtype : 'SpecialChar',
				maxLength : 30,
				maxLengthText : 'SMTP服务器长度不超过30个字符',
				minLength : 6,
				minLengthText : 'SMTP服务器长度不少于6个字符',
				allowBlank : false,
				blankText : '请输入SMTP服务器'
			});
		var userName = new Ext.form.TextField({
				id : 'userName',
				fieldLabel : '用户名',
				//width : 250,
				//vtype : 'SpecialChar',
				anchor:'93%',
				maxLength : 30,
				maxLengthText : '用户名的长度不超过30个字符',
				allowBlank : false,
				blankText : '请输入用户名'
			});
		var password = new Ext.form.TextField({
				id : 'password',
				fieldLabel : '密码',
				//vtype : 'SpecialChar',
				//width : 250,
				anchor:'93%',
				maxLength : 30,
				maxLengthText : '密码的长度不超过30个字符',
				inputType : 'password',
				allowBlank : false,
				blankText : '请输入密码'
			});
		senderAress.on('change',function(){isChanged = true;});
		port.on('change',function(){isChanged = true;});
		smtpServer.on('change',function(){isChanged = true;});
		userName.on('change',function(){isChanged = true;});
		password.on('change',function(){isChanged = true;});
		mailConfigPanel = new Ext.form.FormPanel({
			frame : true,
			monitorValid :true,
			labelWidth : 80,
			width : 420,
			bodyStyle : 'padding: 10,30,30,10',
			items : [senderAress,port,smtpServer,userName,password],
			buttons : [new Ext.Button({
				minWidth : 60,
				text : '测试',
				formBind : true,
				handler : testEmailServer
			}), new Ext.Button({
				minWidth : 60,
				text : '重置',
				handler : clearOperate
			}), new Ext.Button({
				minWidth : 60,
				text : '确定',
				formBind : true,
				handler : saveMailServer
			}), new Ext.Button({
				minWidth : 60,
				text : '取消',
				handler : cancealOperate
			})],
			buttonAlign : 'center'
		});
		loadDataFromServer();
		return mailConfigPanel;
	}

	function loadDataFromServer() {
		EmailService.getEmailServerConfig(disPlayMailServerInfo);
	}

	function disPlayMailServerInfo(mailServerInfo) {
		if (!Ext.isEmpty(mailServerInfo)) {
			initMailInfo = mailServerInfo;
			DWRUtil.setValue("senderAress", mailServerInfo.fromAddress);
			DWRUtil.setValue("smtpServer", mailServerInfo.smtpAddress);
			DWRUtil.setValue("port", mailServerInfo.port);
			DWRUtil.setValue("userName", mailServerInfo.userName);
			DWRUtil.setValue("password", mailServerInfo.passWord);
		}
	}

	function saveMailServer() {
		if (mailConfigPanel.form.isValid()) {
			var mailInfo = {};
			mailInfo.fromAddress = DWRUtil.getValue('senderAress');
			mailInfo.smtpAddress = DWRUtil.getValue('smtpServer');
			mailInfo.port = DWRUtil.getValue('port');
			mailInfo.userName = DWRUtil.getValue('userName');
			mailInfo.passWord = DWRUtil.getValue('password');
			EmailService.saveEmailServerConfig(mailInfo, function(
					retuenValue) {
				if (!retuenValue)
						Ext.Msg.show({
							title : '错误',
							msg : '保存Email服务器参数失败！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});
				else
					newWin.close();
			});
		} else {
			Ext.Msg.show({
							title : '错误',
							msg : '表单格式不正确，请重新输入！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});
		}
	}

	function testEmailServer() {
		if (mailConfigPanel.form.isValid()) {
			var mailInfo = {};
			mailInfo.fromAddress = DWRUtil.getValue('senderAress');
			mailInfo.smtpAddress = DWRUtil.getValue('smtpServer');
			mailInfo.port = DWRUtil.getValue('port');
			mailInfo.userName = DWRUtil.getValue('userName');
			mailInfo.passWord = DWRUtil.getValue('password');
			var waitLoadMessage = new Ext.LoadMask(newWin.id, {
					msg : "正在测试，请稍等..."
				});
				waitLoadMessage.show();
			EmailService.testEmailServer(mailInfo, function(retuenValue) {
				waitLoadMessage.hide();
				if (!retuenValue)
					Ext.Msg.show({
							title : '错误',
							msg : '测试失败，请检查邮件服务器设置是否正确！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});
				else
				Ext.Msg.show({
							title : '提示',
							msg : '测试通过，请继续后续操作！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.INFO
						});
			});
		} else {
			Ext.Msg.show({
							title : '错误',
							msg : '表单格式不正确，请重新输入！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});
		}
	}

	function clearOperate() {
		if(!Ext.isEmpty(initMailInfo)){
			Ext.Msg.confirm('确认', '是否清除邮件服务器设置？', function(returnValue) {
					if (returnValue == 'yes') {
						var mailInfo = {};
						mailInfo.id = initMailInfo.id;
						mailInfo.fromAddress = '';
						mailInfo.smtpAddress = '';
						mailInfo.port = 25;
						mailInfo.userName = '';
						mailInfo.passWord = '';
						EmailService.saveEmailServerConfig(mailInfo,function(retuenValue){
										DWRUtil.setValue("senderAress", '');
										DWRUtil.setValue("smtpServer", '');
										DWRUtil.setValue("port", '25');
										DWRUtil.setValue("userName", '');
										DWRUtil.setValue("password", '');
									});
					}
			});	
		}else{
			DWRUtil.setValue("senderAress", '');
			DWRUtil.setValue("smtpServer", '');
			DWRUtil.setValue("port", '25');
			DWRUtil.setValue("userName", '');
			DWRUtil.setValue("password", '');
		}
	}

	function cancealOperate() {
		if (isChanged && mailConfigPanel.form.isValid()) {
			Ext.Msg.confirm('确认', '是否保存当前设置？', function(value) {
				if (value == 'yes')
					saveMailServer();
				else
					newWin.close();
			});
		}else
		newWin.close();
	}
}