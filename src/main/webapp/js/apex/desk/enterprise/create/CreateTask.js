Ext.namespace('Apex.Desk.Enterprise.Create');

Apex.Desk.Enterprise.Create.Panel = function() {

	var incidentItemRecord = null;
	var incidentItemStore = null;
	var pagingBar = null;
	var addBtn = null;
	var refreshBtn = null;
	var gridPanel = createGrid();
	var mainPanel = buildPanel();

	function buildPanel() {
		return new Ext.Panel({
					id : 'Apex.Desk.Enterprise.Create.Panel',
					autoScroll : false,
					frame : false,
					border : false,
					layout : 'border',
					height : document.getElementById('contentTr').offsetHeight,
					items : [gridPanel],
					renderTo : 'content'
				});
	};

	this.getPanel = function() {
		return mainPanel;
	};

	function createGrid() {

		addBtn = new Ext.Button({
					text : '添加',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : addIncidentItem,
					minWidth : 80
				});

		refreshBtn = new Ext.Button({
					text : '刷新',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.REFRESH_BUTTON_PNG,
					handler : refreshIncidentItem,
					minWidth : 80
				});

		var columns = [new Ext.grid.RowNumberer(), {
					header : "Id",
					dataIndex : 'id',
					width : 10,
					hidden : true,
					sortable : true
				}, {
					header : "PId",
					dataIndex : 'procId',
					width : 10,
					hidden : true,
					sortable : true
				}, {
					header : "工单号",
					dataIndex : 'procKey',
					width : 140,
					sortable : true
				}, {
					header : "优先级",
					dataIndex : 'prior',
					width : 80,
					renderer : wfPriorFormat,
					sortable : true
				}, {
					header : "事件类型",
					dataIndex : 'incTypeName',
					width : 100,
					sortable : true
				}, {
					header : "主题摘要",
					dataIndex : 'title',
					width : 120,
					sortable : true
				}, {
					header : "创建时间",
					dataIndex : 'createTime',
					width : 120,
					renderer : dateFormat,
					sortable : true
				}, {
					header : "创建人",
					dataIndex : 'createUser',
					hidden : true,
					width : 80,
					sortable : true
				}, {
					header : "状态",
					dataIndex : 'procNode',
					width : 80,
					sortable : true
				}, {
					header : "处理人",
					width : 80,
					dataIndex : 'handleUser',
					sortable : true
				}, {
					header : "发生时间",
					dataIndex : 'incTime',
					width : 120,
					renderer : dateFormat,
					sortable : true
				}];
		incidentItemRecord = Ext.data.Record.create([{
					name : 'id',
					mapping : 'id'
				}, {
					name : 'procId',
					mapping : 'procId'
				}, {
					name : 'procKey',
					mapping : 'procKey'
				}, {
					name : 'procNode',
					mapping : 'procNode'
				}, {
					name : 'createTime',
					mapping : 'createTime'
				}, {
					name : 'createUser',
					mapping : 'createUser'
				}, {
					name : 'handleUser',
					mapping : 'handleUser'
				}, {
					name : 'prevHandleUser',
					mapping : 'prevHandleUser'
				}, {
					name : 'nextHandleUser',
					mapping : 'nextHandleUser'
				}, {
					name : 'incTime',
					mapping : 'incTime'
				}, {
					name : 'incTypeName',
					mapping : 'incTypeName'
				}, {
					name : 'prior',
					mapping : 'prior'
				}, {
					name : 'title',
					mapping : 'title'
				}, {
					name : 'memo',
					mapping : 'memo'
				}, {
					name : 'attach',
					mapping : 'attach'
				}]);
		var reader = new Ext.data.JsonReader({
					totalProperty : "totalCount",
					root : "incidentItemList",
					id : "id"
				}, incidentItemRecord);
		incidentItemStore = new Ext.data.Store({
					proxy : new Ext.ux.data.DWRProxy({
								dwrFunction : IncidentService.getCreateIncidentItems,
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
					displayMsg : '显示 {0} - {1} 条事件工单，共 {2}条事件工单',
					emptyMsg : "没有任何事件工单"
				});
		var resultPanel = new Ext.grid.GridPanel({
					id : 'Apex.Desk.Enterprise.Create.Grid',
					store : incidentItemStore,
					columns : columns,
					autoScroll : true,
					enableHdMenu : false,
					autoExpandColumn : 6,
					height : 672,
					region : 'center',
					margins : '5 0 0 0',
					tbar : [addBtn, '-', refreshBtn],
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

	function addIncidentItem() {
		var addItemPanel = new Apex.maintenance.incident.AddIncidentItem(loadIncidentData);
		addItemPanel.showAddPanel();
	}

	function refreshIncidentItem() {
		incidentItemStore.load({
					params : {
						start : pagingBar.cursor,
						limit : 20
					}
				});
	}
}