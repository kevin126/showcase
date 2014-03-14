
//全局
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
					
					var incidentPanel = new Apex.maintenance.incident.IncidentManagePanel('incidentPanel',start_total);
					var mainPanel = new Ext.Panel({
								autoScroll : false,
								region : 'center',
								width: innerWidth,
								height: innerHeight - 218,
								frame : false,
								border : false,
								layout : 'fit',
								renderTo : 'mainBodyDiv',
								items : incidentPanel.getPanel()
							});
				}
			});
	        
		});