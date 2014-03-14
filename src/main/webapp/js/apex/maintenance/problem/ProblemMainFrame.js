Ext.namespace('Apex.maintenance.problem');
Apex.maintenance.problem.ProblemMainFrame = function() {
	var task = new Apex.maintenance.problem.ProblemManagePanel('problemPanel');
	
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
	
	this.addPanel = function(panelName, id) {
		if(mainPanel.findById(id)) {//在当前菜单项上再次点击则不需要再次初始化当前菜单项对应的panel
			return;				
		} else {
			mainPanel.removeAll(true);
		}
		if(panelName = '问题管理'){
			var problem = new Apex.maintenance.problem.ProblemManagePanel(id);
			mainPanel.add(problem.getPanel());
			mainPanel.doLayout();
			problem.loadData();
		}
	}
}
//全局
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
			maintenanceMainPanel = new Apex.maintenance.problem.ProblemMainFrame();
			var problemPanel = maintenanceMainPanel.getPanel();
			var mainPanel = new Ext.Panel({
				autoScroll : false,
				region : 'center',
				width: innerWidth,
				height: innerHeight - 216,
				frame : false,
				border : false,
				layout : 'fit',
				renderTo : 'mainBodyDiv',
				items : problemPanel
			});
		}
	});
});
function changeMaintenanceMenu(panelName, id){
	maintenanceMainPanel.addPanel(panelName, id);
}