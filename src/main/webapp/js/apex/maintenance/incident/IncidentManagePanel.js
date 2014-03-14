Ext.namespace('Apex.maintenance.incident');

Apex.maintenance.incident.IncidentManagePanel = function(id,start) {
	this.id = id;
	this.start = start
	var checkboxSelect = null;
	var incidentItemRecord = null;
	var incidentItemStore = null;
	var previousNode = null;
	var operateTreePanel = null;
	var centerPanel = null;
	var incidentItemPanel = null;
	var waitPanel = null;
	this.getPanel = function() {
		operateTreePanel = createOperateTreePanel();
		centerPanel = createCenterPanel();
		var incidentManagePanel = new Ext.Panel({
					id : id,
					layout : 'border',
					border : false,
					closable : true,
					items : [operateTreePanel, centerPanel]
				});
		return incidentManagePanel;
	}
	
	this.loadData = function(){
		waitPanel.loadData();
	}

	function createOperateTreePanel() {
		var root = new Ext.tree.TreeNode({
					text : 'operation',
					id : 0,
					hasChildren : true,
					expanded : true
				});
		var myNode = new Ext.tree.TreeNode({
			        id :'myself_incidentNode',
					text : Incident_I18N.myIncident,
					cls : document.getElementById("issueTypeFlag") && document.getElementById("issueTypeFlag").innerHTML == 1 ? '' : 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected',
					leaf : true
				});
		var createNode = new Ext.tree.TreeNode({
			        id :'create_incidentNode',
					text : Incident_I18N.createIssue,
					href :'/itsm/servicedesk/creatIssueIncWiz.do?menuId=m3_0&next=1&processType=INC',
					leaf : true
				});
		var configTypeNode = new Ext.tree.TreeNode({
			        id :'configType_incidentNode',
					text : Incident_I18N.configType,
					cls : document.getElementById("issueTypeFlag") && document.getElementById("issueTypeFlag").innerHTML == 1 ? 'x-tree-node-el x-tree-node-leaf x-unselectable x-tree-selected' : '',
					leaf : true
				});
		root.appendChild(myNode);
		root.appendChild(createNode);
		if (USER.isAble(PermissionId.SETTING_SYSTEM_PARAMETERS))
			root.appendChild(configTypeNode);
		var panel = new Ext.tree.TreePanel({
			        id : 'incidentOperateTree',
					title : Incident_I18N.operationList,
					autoScroll : true,
					width : 200,
					margins : '5 0 5 5',
					region : 'west',
					frame : false,
					split : true,
					border : false,
					collapsible : true,
					rootVisible : false,
					root : root
				});
		panel.on('click', handleClickTreeNode, panel);
		if(document.getElementById("issueTypeFlag") && document.getElementById("issueTypeFlag").innerHTML == 1){
			configTypeNode.select();
			previousNode = configTypeNode;
		}else{
			myNode.select();
			previousNode = myNode;
		}
		return panel;
	}

	function createCenterPanel() {
		if(document.getElementById("issueTypeFlag") && document.getElementById("issueTypeFlag").innerHTML == 1){
			waitPanel = new Apex.maintenance.Issue.Type.Panel("INC");
		}else{
			waitPanel = new Apex.maintenance.incident.CreateIncidentItem(start);
		}
		var centerTabPanel = new Ext.Panel({
					id : "centerTabPanel",
					region : 'center',
					margins : '5 5 5 0',
					deferredRender : false,
					layoutOnTabChange : true,
					frame : false,
				    border : false,
				    layout : 'fit',
					items : waitPanel.getPanel(),
					enableTabScroll : true
				});
		return centerTabPanel;
	}

	function handleClickTreeNode(selectedTreeNode) {
		previousNode.ui.removeClass('treeNodeBackground');
		if (previousNode == null || previousNode.text != selectedTreeNode.text) {// 选择与上一次相同
			if(selectedTreeNode.text == Incident_I18N.createIssue){
				return;
			}
			centerPanel.removeAll(true);
			if (selectedTreeNode.text == Incident_I18N.myIncident) {
				var incidentItemPanel = new Apex.maintenance.incident.CreateIncidentItem();
				centerPanel.add(incidentItemPanel.getPanel());
			}  else if (selectedTreeNode.text == Incident_I18N.configType) {
				var itPanel = new Apex.maintenance.Issue.Type.Panel("INC");
				centerPanel.add(itPanel.getPanel());
			}
			centerPanel.doLayout();
		}
		previousNode = selectedTreeNode;
	}
}