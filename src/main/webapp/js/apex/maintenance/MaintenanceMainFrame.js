Apex.maintenance.mainFramePanel = function() {
	var task = new Apex.Task.TaskManagePanel('taskPanel');
	var mainPanel = new Ext.Panel({
				id : 'mainPanel',
				autoScroll : false,
				region : 'center',
				margins : '135 5 5 0',
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
			if(panelName == '事件管理'){
				var incident = new Apex.maintenance.incident.IncidentManagePanel(id);
				mainPanel.add(incident.getPanel());
				mainPanel.doLayout();
				incident.loadData();
			}
			if(panelName == '工单管理'){
				var task = new Apex.Task.TaskManagePanel(id);
				mainPanel.add(task.getPanel());
				mainPanel.doLayout();
			}
			if(panelName == '知识库管理'){
				var knowledge = new Apex.maintenance.knowledge.KnowledgeMainPanel(id);
				mainPanel.add(knowledge.getPanel());
				mainPanel.doLayout();
				knowledge.loadData();
			}
			if(panelName == '公告管理'){
				var notice = new Apex.notice.NoticePanel(id);
				mainPanel.add(notice.getPanel());
				mainPanel.doLayout();
				notice.loadData();
			}
			if(panelName == '值班管理'){
				var duty = new Apex.maintenance.duty.DutyManagePanel(id);
				mainPanel.add(duty.getPanel());
				mainPanel.doLayout();
				duty.initData();
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
					Ext.QuickTips.init();
					maintenanceMainPanel = new Apex.maintenance.mainFramePanel();
					var panel = new Ext.Panel({
						region : 'center',
						margins : '135 5 5 0',
						html : '测试Panel'
					
					})
					var testPanel = maintenanceMainPanel.getPanel();
					 var viewport = new Ext.Viewport({
						layout : 'border',
						items : testPanel
					});
				}
			});
	        
		});
function changeMaintenanceMenu(panelName, id){
	maintenanceMainPanel.addPanel(panelName,id);
}