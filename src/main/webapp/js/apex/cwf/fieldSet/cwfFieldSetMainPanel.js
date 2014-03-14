Ext.namespace('Apex.cwf')
Apex.cwf.configurationTypeMainPanel = function() {
	var task = new Apex.cwf.configurationTypeView();
	var mainPanel = new Ext.Panel({
				id : 'mainPanel',
				region : 'center',
				margins : '180 5 0 0',
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
			maintenanceMainPanel = new Apex.cwf.configurationTypeMainPanel();
			var configurationTypePanel = maintenanceMainPanel.getPanel();
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
						region : 'center',
						width : innerWidth - 20,
						height : 600,
						border : false,
						layout : 'fit',
						renderTo : 'configurationType',
//						applyTo : 'configurationType',
						items : configurationTypePanel
					});
		}
	});

});