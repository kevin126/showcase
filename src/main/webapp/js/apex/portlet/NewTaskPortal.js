Ext.namespace('Apex.Portal.NewTask');

// Can incident
function canIncident() {
	USER.isAble(UserPermissionConstant.create_workorder);
};

// Type combox
Apex.Portal.NewTask.TypeComboBox = function() {

	var typeStore = new Ext.data.SimpleStore({
				fields : ['typeName', 'typeValue'],
				data : [['事件工单', 'IncidentTask']]
			});

	var typeCombox = new Ext.form.ComboBox({
				fieldLabel : '事件类型',
				triggerAction : 'all',
				store : typeStore,
				displayField : 'typeName',
				valueField : 'typeValue',
				mode : 'local',
				forceSelection : true,
				resizable : true,
				typeAhead : true,
				value : 'IncidentTask',
				readOnly : true
			});

	return typeCombox;
}

// Portlet Panel
Apex.Portal.NewTask.PortletPanel = function() {
	// Type Combox
	var typeCombox = new Apex.Portal.NewTask.TypeComboBox();

	// Type Button
	var typeButton = new Ext.Button({
				text : '创建工单',
				minWidth : 120
			});
	// Main panel
	var mainPanel = new Ext.Panel({
				frame : true,
				layout : 'column',
				defaults : {
					bordr : false,
					layout : 'form',
					labelWidth : 80,
					columnWidth : .5
				},
				items : [{
							items : [typeCombox]
						}, {
							items : [typeButton]
						}]
			});

	this.getPanel = function() {
		typeButton.setDisabled(canIncident());
		return mainPanel;
	}

	return this;
}