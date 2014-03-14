Ext.namespace('Apex.asset');
Apex.asset.AssetSearchMain = function() {
	var pDeskPanel = new Apex.asset.AssetSearchManagePanel();
	var mainPanel = new Ext.Panel({
				id : 'searchMainPanel',
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
										userName : user.userName,
										loginTime : user.loginTime,
										role : user.roleNames,
										permission : user.actionIds
									});
							Ext.QuickTips.init();
							assetMainPanel = new Apex.asset.AssetSearchMain();
							var assetManangePanel = assetMainPanel.getPanel();
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
										autoScroll : false,
										region : 'center',
										width : innerWidth,
										height : innerHeight - 218,
										frame : false,
										border : false,
										layout : 'fit',
										renderTo :'assetSearch',
										items : assetManangePanel
									});
						}
					});

		});