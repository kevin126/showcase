Ext.namespace('Apex.security');
Apex.security.testFTPConnectJs = function(FTPAddress, FTPUserName, FTPUserCode) {
	if (Ext.isEmpty("FTPAddress")) {
		Ext.MessageBox.show({
					title : '提示',
					msg : "请输入FTP服务器IP地址！",
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO
				});
	} else if (Ext.isEmpty("FTPUserName")) {
		Ext.MessageBox.show({
					title : '提示',
					msg : "请输入登陆FTP服务器的用户名！",
					buttons :

					Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO
				});
	} else if (Ext.isEmpty("FTPUserCode")) {
		Ext.MessageBox.show({
					title : '提示',
					msg : "请输入登陆FTP服务器的用户密码！",
					buttons :

					Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO
				});
	} else {
		var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : "FTP服务器连接检测中，请稍后..."
				});
		myMask.show();
		SecurityService.testFTPConnect(FTPAddress, FTPUserName, FTPUserCode, {
					callback : function() {
						myMask.hide();
						Ext.MessageBox.show({
									title : '提示',
									msg : "FTP服务器连接测试通过！",
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								});
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
}