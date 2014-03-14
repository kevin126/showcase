Ext.namespace('Apex.maintenance.type');

Apex.maintenance.type.TypeMainFrame = function() {
	var task = new Apex.maintenance.type.TypeManagePanel("typePanel");
			
	var mainPanel = new Ext.Panel({
		id : 'mainPanel',
		autoScroll : false,
		region : 'center',
		margins : '180 5 45 0',
		frame : false,
		border : false,
		layout : 'fit',
		items : task.getPanel()
	});
	
	this.getPanel = function(){
		return mainPanel;
	}
}

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
			var innerWidth;
			if(window.innerWidth) {
				innerWidth = window.innerWidth;
			} else {
				innerWidth = document.body.clientWidth;
			}
			var innerHeight;
			if(window.innerHeight) {
				innerHeight = window.innerHeight;
			} else {
				innerHeight = document.body.clientHeight;
			}
			var typePanel = new Apex.maintenance.type.TypeMainFrame().getPanel();
			var mainPanel = new Ext.Panel({
				autoScroll : false,
				region : 'center',
				width: innerWidth,
				height: innerHeight - 216,
				frame : false,
				border : false,
				layout : 'fit',
				renderTo : 'mainBodyDiv',
				items : typePanel
			});
		}
	});
});