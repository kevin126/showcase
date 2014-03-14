Ext.namespace('Apex.asset');
Apex.asset.SupplierManageMain = function() {
	var mainPanel = new Ext.Panel({
				id : 'supplierMainPanel',
				autoScroll : false,
				frame : false,
				border : false,
				layout : 'fit',
				height : document.getElementById('contentTr').offsetHeight,
				renderTo : 'content'
			})
	this.initPanel = function() {
		mainPanel.removeAll(true);
		var pDeskPanel = new Apex.asset.SupplierViewPanel(id);
		mainPanel.add(pDeskPanel.getPanel());
		mainPanel.doLayout();
	}
};
var supplierMainPanel = null;
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
							supplierMainPanel = new Apex.asset.SupplierManageMain();
							supplierMainPanel.initPanel();
						}
					});
		});