Ext.namespace('Apex.ssd');
Apex.ssd.AssetManageMain = function() {
	var pDeskPanel = new Apex.ssd.AssetApplyPanel();
	var mainPanel = new Ext.Panel({
				id : 'mainPanel',
				autoScroll : false,
				region : 'center',
				margins : '180 5 45 0',
				frame : false,
				border : false,
				layout : 'fit',
				items : pDeskPanel.getPanel()
			});
	this.getPanel = function() {
		return mainPanel;
	}
};

var assetMainPanel = null;

Ext.onReady(function() {
			SecurityService.getUserVoByUserName(null, {
						callback : function(user) {
							USER = new Apex.security.User({
										userId : user.userId,
										userName : user.userName,
										loginTime : user.loginTime,
										role : user.roleNames,
										permission : user.actionIds
									});
							Ext.QuickTips.init();
							assetMainPanel = new Apex.ssd.AssetManageMain();
							var assetManangePanel = assetMainPanel.getPanel();
							var innerWidth;
							innerWidth = window.screen.availWidth ;
							var innerHeight;
							innerHeight = window.screen.availHeight;
							var mainPanel = new Ext.Panel({
										autoScroll : false,
										region : 'center',
										width : innerWidth - 22,
										height : innerHeight - 408,
										frame : false,
										border : false,
										layout : 'fit',
										renderTo : 'assetApplyManage',
										items : assetManangePanel
									});
						}
					});

		});