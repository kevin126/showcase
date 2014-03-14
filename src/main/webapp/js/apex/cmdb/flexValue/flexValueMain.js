Ext.namespace('Apex.configuration')
Apex.configuration.flexValueMain = function() {
	var task = new Apex.configuration.flexValueViewPanel();
	var mainPanel = new Ext.Panel({
				id : 'mainPanel',
				autoScroll : false,
				region : 'center',
//				margins : '180 5 45 0',
				frame : false,
				border : false,
				layout : 'fit',
				items : task
			})
	this.getPanel = function() {
		return mainPanel;
	}
}
var maintenanceMainPanel = null;
dwr.engine.setErrorHandler(errorHandler);
Ext.onReady(function() {
			SecurityService.getUserVoByUserName(null, {
						callback : function(user) {
							USER = new Apex.security.User({
										userName : user.userName,
										loginTime : user.loginTime,
										role : user.roleNames,
										permission : user.actionIds
									});
							maintenanceMainPanel = new Apex.configuration.flexValueMain();
							var configurationTypePanel = maintenanceMainPanel
									.getPanel();
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
										width : innerWidth - 228,
										height : 600,
										frame : false,
										border : false,
										layout : 'fit',
										renderTo : 'flexValueSetPanel',
										items : configurationTypePanel
									});
						}
					});

		});