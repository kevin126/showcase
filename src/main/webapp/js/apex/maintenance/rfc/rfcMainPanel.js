Ext.namespace('Apex.maintenance.rfc');
Apex.maintenance.rfc.RFCMainPanel = function(id) {
	this.id = id;
	var operateTreePanel = null;
	var centerPanel = null;
	var previousNode = null;
	var waitApprovePanel = null;
	this.getPanel = function() {
		operateTreePanel = createOperateTreePanel();
		centerPanel = createCenterPanel();
		var incidentManagePanel = new Ext.Panel({
					id : id,
					layout : 'border',
					region : 'center',
					margins : '180 0 40 0',
					closable : true,
					border:false,
					items : [operateTreePanel, centerPanel]
				});
		return incidentManagePanel;
	}
	
	this.loadData = function(){
		waitApprovePanel.loadData();
	}
	
	function createOperateTreePanel(){
		var root = new Ext.tree.TreeNode({
				text : '操作列表',
				id : 0,
				hasChildren : true,
				expanded : true
			});
		 var waitApproveNode = new Ext.tree.TreeNode({
		 	    id : 'waitApprove_rfc',
				text : '待处理变更工单',
				cls : 'treeNodeBackground',
				leaf : true
			});
		var  createNewRFC = new Ext.tree.TreeNode({
		 	    id : 'create_rfc',
				text : '创建工单',
				leaf : true
			});
		var myRFC = new Ext.tree.TreeNode({
		 	    id : 'myCreate_rfc',
				text : '我创建的工单',
				cls : document.getElementById("issueTypeFlag") && document.getElementById("issueTypeFlag").innerHTML == 1 ? '' : 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected',
				expanded : true,
				leaf : false
			});
			
		 
			
		 var rfcType = new Ext.tree.TreeNode({
		 	    id : 'type_rfc',
				text : '配置变更类型',
				cls : document.getElementById("issueTypeFlag") && document.getElementById("issueTypeFlag").innerHTML == 1 ? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected' : '',
				leaf : true
			})
		 
		createNewRFC.ui.addClass('treeNodeBackground');		
		root.appendChild(myRFC);
		root.appendChild(createNewRFC);
		//root.appendChild(cabauditrfc); 
		//root.appendChild(cabauditrfc); 
		if (USER.isAble(PermissionId.SETTING_SYSTEM_PARAMETERS)){
			root.appendChild(rfcType); 	
		} 
		var panel = new Ext.tree.TreePanel({
			        id : 'rfcOperateTree',
					title : '操作列表',
					autoScroll : true,
					width : 200,
					margins : '5 0 5 5',
					region : 'west',
					frame : false,
					border:false,
					split : true,
					collapsible : true,
					rootVisible : false,
					root : root
				});
		panel.on('click', handleClickTreeNode, panel);
		if(document.getElementById("issueTypeFlag") && document.getElementById("issueTypeFlag").innerHTML == 1){
			rfcType.select();
			previousNode = rfcType;
		}else{
			myRFC.select();
			previousNode = myRFC;
		}
		return panel;
	}
	
	function createCenterPanel() {
		if(document.getElementById("issueTypeFlag") && document.getElementById("issueTypeFlag").innerHTML == 1){
			waitApprovePanel = new Apex.maintenance.Issue.Type.Panel("RFC");
		}else{
			waitApprovePanel = new Apex.maintenance.rfc.rfcItemPanel();
		}
		var centerTabPanel = new Ext.Panel({
					id : "centerRfcPanel",
					region : 'center',
					margins : '5 5 5 0',
				    border : false,
				    layout : 'fit',
					items : waitApprovePanel.getPanel()
				});
		return centerTabPanel;
	}
	
	function handleClickTreeNode(selectedNode){
		previousNode.ui.removeClass('treeNodeBackground'); 
		var rfcPanel;
		if(selectedNode.id == 'create_rfc'){  
				window.location.href=mainpath+"/servicedesk/creatIssueProWiz.do?next=1&processType=RFC"; 
				return;
		}else  if(selectedNode.id == 'waitApprove_rfc'|| selectedNode.id =='cabaudit_rfc'){
	     	  waitApprovePanel = new Apex.maintenance.rfc.rfcItemPanel(selectedNode.id);
	     	  rfcPanel = waitApprovePanel.getPanel();
     	}else if(selectedNode.id == 'myCreate_rfc'){
	     	  waitApprovePanel = new Apex.maintenance.rfc.rfcItemPanel('waitApprove_rfc');
	     	  rfcPanel = waitApprovePanel.getPanel();
     	}else if(selectedNode.id == 'type_rfc'){ 
	     	 var itPanel = new Apex.maintenance.Issue.Type.Panel("RFC");
			 rfcPanel =itPanel.getPanel();
     	}
     	
     	//rfcPanel = waitApprovePanel.getPanel()
     	centerPanel.removeAll(true);
     	centerPanel.add(rfcPanel);
     	centerPanel.doLayout(); 
     	maintenanceMainPanel.loadData();
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
					maintenanceMainPanel = new Apex.maintenance.rfc.RFCMainPanel("rfcPanel");
					var rfcPanel = maintenanceMainPanel.getPanel();
					var viewport =  new Ext.Panel({
						autoScroll : false,
                         region : 'center',
                         width: innerWidth,
                         height: innerHeight - 216,
                         frame : false,
                         border : false,
                         layout : 'fit',
                         renderTo : 'mainBodyDiv',
						items : rfcPanel
					}); 
					if(document.getElementById("issueTypeFlag") && document.getElementById("issueTypeFlag").innerHTML == 1){
					}else{
						maintenanceMainPanel.loadData();
					}
					
				}
			});
	        
		});
function changeMaintenanceMenu(panelName, id){
	maintenanceMainPanel.addPanel(panelName,id);
}

