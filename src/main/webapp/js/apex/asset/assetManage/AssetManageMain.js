Ext.namespace('Apex.asset');
Apex.asset.AssetManageMain = function(type) {
	var pDeskPanel = new Apex.asset.AssetGridPanel(type);
	var mainPanel = new Ext.Panel({
				id : 'mainPanel',
				autoScroll : false,
				region : 'center',
//				margins : '180 0 45 0',
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
							var type = document.getElementById('assetTypeId').value;
							assetMainPanel = new Apex.asset.AssetManageMain(type);
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
										width : innerWidth-203,
										height : 625,
										frame : false,
										border : false,
										layout : 'fit',
										renderTo :'assetList',
										items : assetManangePanel
									});
						}
					});

		});