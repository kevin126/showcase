Ext.namespace('Apex.asset');
Apex.asset.ContractManageMain = function() {
	var mainPanel = new Ext.Panel({
				id : 'contractMainPanel',
				autoScroll : false,
				frame : false,
				border : false,
				layout : 'fit',
				height : document.getElementById('contentTr').offsetHeight,
				renderTo : 'content'
			})
	this.initPanel = function() {
		mainPanel.removeAll(true);
		var pDeskPanel = new Apex.asset.ContractViewPanel(id);
		mainPanel.add(pDeskPanel.getPanel());
		mainPanel.doLayout();
	}
};
var contractMainPanel = null;
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
							contractMainPanel = new Apex.asset.ContractManageMain();
							contractMainPanel.initPanel();
						}
					});
		});