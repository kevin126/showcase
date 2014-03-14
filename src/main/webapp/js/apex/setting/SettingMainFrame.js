Ext.namespace('Apex.setting');
Apex.setting.mainFramePanel = function() {
	
		var innerWidth;
	if (window.innerWidth) {
		innerWidth = window.innerWidth;
	} else {
		innerWidth = document.body.clientWidth;
	}

	var innerHeight;
	if (window.innerHeight) {
		innerHeight = window.innerHeight;
	} else {
		innerHeight = document.body.clientHeight;
	}

	var mainPanel = new Ext.Panel({
				layout : 'fit',
				border : false,
				width: innerWidth,
				height: innerHeight - 218,
				renderTo : 'mainBodyDiv'
			});

	this.addPanel = function(panelName, id) {
		if (panelName == '邮件服务器设置') {
			var emailServerPanel = new Apex.setting.email.EmailServerPanel();
			emailServerPanel.showWindow();
			return;
		}
		if (panelName == '用户管理') {
			var entity = new Apex.security.UserManageMainPanel(id);
			mainPanel.add(entity.panel);
			mainPanel.doLayout();
		}
	}
}
// 全局
var settingMainPanel = null;
Ext.onReady(function() {
			SecurityService.getUserVoByUserName(null, {
						callback : function(user) {
							USER = new Apex.security.User({
										userName : user.userName,
										loginTime : user.loginTime,
										role : user.roleNames,
										permission : user.actionIds
									});
							Ext.QuickTips.init();
							settingMainPanel = new Apex.setting.mainFramePanel();
							changeSettingMenu('用户管理', 'usermanage');
						}
					});
		});

function changeSettingMenu(panelName, id) {
	settingMainPanel.addPanel(panelName, id);
}

function openUserBaseInfoWindow() {

}