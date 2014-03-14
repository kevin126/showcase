Ext.namespace('Apex.Desk.Enterprise.Pending');

Apex.Desk.Enterprise.Pending.Panel = function() {

	var incidentItemRecord = null;
	var incidentItemStore = null;
	var pagingBar = null;
	var takeBtn = null;
	var refreshBtn = null;
	var gridPanel = createGrid();
	var mainPanel = buildPanel();

	var checkboxSelect = null;

	function buildPanel() {
		return new Ext.Panel({
					id : 'Apex.Desk.Enterprise.Pending.Panel',
					autoScroll : false,
					frame : false,
					border : false,
					layout : 'border',
					height : document.getElementById('contentTr').offsetHeight,
					items : [gridPanel],
					renderTo : 'content'
				});
	};

	function handleCheckChange(checkMode) {
		if (checkMode.getCount() > 0) {
			takeBtn.setDisabled(false);
		} else {
			takeBtn.setDisabled(true);
		}
	};

	this.getPanel = function() {
		return mainPanel;
	};

	function createGrid() {

		takeBtn = new Ext.Button({
					text : '提交',
					cls : 'x-btn-text-icon',
					disabled : true,
					icon : ResourceConstants.TAKE_BUTTON_PNG,
					handler : ttt,
					minWidth : 80
				});

		refreshBtn = new Ext.Button({
					text : '刷新',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.REFRESH_BUTTON_PNG,
					handler : refreshIncidentItem,
					minWidth : 80
				});

		checkboxSelect = new Ext.grid.CheckboxSelectionModel({
					singleSelect : true
				});
		checkboxSelect.on('selectionchange', handleCheckChange);

		var columns = [new Ext.grid.RowNumberer(), checkboxSelect, {
					header : "序号",
					dataIndex : 'id',
					width : 10,
					hidden : true,
					sortable : true
				}, {
					header : "标题",
					dataIndex : 'taskTitle',
					width : 120,
					renderer : function(data) {
						return '<a href=# onclick="showDetail();">' + data
								+ '</a>';
					},
					sortable : true
				}, {
					header : "请求人",
					dataIndex : 'clientName',
					width : 120,
					sortable : true
				}, {
					header : "请求时间",
					dataIndex : 'createTime',
					width : 120,
					renderer : dateFormat,
					sortable : true
				}];

		incidentItemRecord = Ext.data.Record.create([{
					name : 'id',
					mapping : 'id'
				}, {
					name : 'taskTitle',
					mapping : 'taskTitle'
				}, {
					name : 'clientName',
					mapping : 'clientName'
				}, {
					name : 'createTime',
					mapping : 'createTime'
				}]);

		var reader = new Ext.data.JsonReader({
					totalProperty : "DataSize",
					root : "DataList",
					id : "id"
				}, incidentItemRecord);
		incidentItemStore = new Ext.data.Store({
					proxy : new Ext.ux.data.DWRProxy({
								dwrFunction : DeskEnterpriseService.unprocessRequest,
								listeners : {
									'beforeload' : function(dataProxy, params) {
										var loadArgs = [params.start,
												params.limit];
										params[dataProxy.loadArgsKey] = loadArgs;
									}
								}
							}),
					reader : reader
				});
		pagingBar = new Ext.PagingToolbar({
					pageSize : 20,
					store : incidentItemStore,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条服务请求，共 {2}条服务请求',
					emptyMsg : "没有任何服务请求"
				});
		var resultPanel = new Ext.grid.GridPanel({
					id : 'Apex.Desk.Enterprise.Pending.Grid',
					store : incidentItemStore,
					columns : columns,
					autoScroll : true,
					sm : checkboxSelect,
					enableHdMenu : false,
					autoExpandColumn : 3,
					height : 672,
					region : 'center',
					margins : '5 0 0 0',
					tbar : [takeBtn, '-', refreshBtn],
					bbar : pagingBar
				});
		loadIncidentData();
		return resultPanel;
	}

	function loadIncidentData() {
		incidentItemStore.load({
					params : {
						start : 0,
						limit : 20
					}
				});
	}

	function refreshIncidentItem() {
		incidentItemStore.load({
					params : {
						start : pagingBar.cursor,
						limit : 20
					}
				});
	}

	function showEventTypePanel() {
		incidentTypeTree = new Apex.maintenance.incident.IncidentTypeTreePanel();
		var treeWindow = new Ext.Window({
					id : 'incidentTypeTreeWin',
					title : '选择事件类别',
					closable : true,
					width : 250,
					border : false,
					plain : true,
					resizable : false,
					modal : true,
					items : [incidentTypeTree],
					buttons : [{
								id : 'selectIncidentTypeBtn',
								text : '确定',
								disabled : true,
								handler : selectIncidentType
							}, {
								text : '取消',
								handler : function() {
									treeWindow.close();
								}
							}],
					buttonAlign : 'center'
				});
		incidentTypeTree.on('dblclick', selectIncidentType);
		incidentTypeTree.on('click', function(selectdeNode) {
					if (selectdeNode.id != '0')
						Ext.getCmp('selectIncidentTypeBtn').setDisabled(false);
					else
						Ext.getCmp('selectIncidentTypeBtn').setDisabled(true);
				})
		treeWindow.show();

	}

	function selectIncidentType() {
		var treeNode = incidentTypeTree.getSelectionModel().getSelectedNode();
		if (treeNode.text == '事件类别')
			return;
		selectedTypeNode = treeNode;
		eventTypeText.setValue(treeNode.text);
		Ext.getCmp('incidentTypeTreeWin').close();
	}

	function ttt() {
		var select = Ext.getCmp('Apex.Desk.Enterprise.Pending.Grid')
				.getSelectionModel().getSelected();
		var id = select.get('id');
		DeskEnterpriseService.requestExists(id, function(
										returnValue) {
									if (!returnValue) {
										Ext.Msg.show({
									title : '提示',
									msg : '请求已经被删除！',
									modal : true,
									buttons : Ext.Msg.OK,
									fn : function() {
										loadIncidentData();
									},
									icon : Ext.Msg.INFO
								});
									} else {
										var win = Apex.Desk.Enterprise.Pending.RW(id, reloadGD);
		win.getWin();
									}
								});
		
	}
}

function reloadGD() {
	Ext.getCmp('Apex.Desk.Enterprise.Pending.Grid').getStore().load({
				params : {
					start : 0,
					limit : 20,
					user : USER.getUserName(),
					take : false
				}
			});
};

function showDetail() {
	var select = Ext.getCmp('Apex.Desk.Enterprise.Pending.Grid')
			.getSelectionModel().getSelected();
	var id = select.get('id');
	var useName = select.get('clientName');
	var win = Apex.Desk.Enterprise.Pending.RW(id,useName,reloadGD);
	win.getWin();
};