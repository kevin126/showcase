Ext.namespace('Apex.Desk.Faq');

Apex.Desk.Faq.Panel = function() {
	
	this.id = 'Apex.Desk.Faq';

	
	var mainPanel = createFaqPanel();

	
	function createFaqPanel() {
		var panel = new Ext.Panel({
					id : 'Apex.Desk.Faq.FaqPanel',
					autoLoad :{url: '/itsm/deskfaq'}    
				});
	
		return panel;
	};
	
	this.getPanel = function() {
		return mainPanel;
	};

};