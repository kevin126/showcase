Ext.namespace('Apex.Desk');

Apex.Desk.MainFramePanel = function() {
	var mainPanel = new Ext.Panel({
				id : 'mainPanel',
				autoScroll : false,
				frame : false,
				border : false,
				layout : 'fit',
				height : document.getElementById('contentTr').offsetHeight,
				renderTo : 'content'
			});

	this.initPanel = function() {
		mainPanel.removeAll(true);
		var pDeskPanel = new Apex.Desk.Personal.ManagePanel(id);
		mainPanel.add(pDeskPanel.getPanel());
		mainPanel.doLayout();
	}
};

var deskMainPanel = null;

Ext.onReady(function() {
	Ext.QuickTips.init();
	deskMainPanel = new Apex.Desk.MainFramePanel();
	deskMainPanel.initPanel();
});