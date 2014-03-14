Ext.namespace('Apex.Desk.Process');

Apex.Desk.Process.Panel = function() {
	// Id
	this.id = 'Apex.Desk.Process';

	// Property
	var refreshBtn = new Ext.Button({
				text : '刷新',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.REFRESH_BUTTON_PNG,
				handler : refreshGrid,
				minWidth : 80
			});
			
	var column = [new Ext.grid.RowNumberer(), {
		header : "工单号",
		dataIndex : 'procKey',
		width : 100,
		renderer : function(data) {
			return '<a href=# onclick="showFixedIncidentDetail(\'' + data
					+ '\');">' + data + '</a>';
		},
		sortable : true
	}, {
		header : "标题",
		dataIndex : 'title',
		width : 100,
		sortable : true
	}, {
		header : "期望完成时间",
		dataIndex : 'expectedCompleteTime',
		width : 120,
		renderer : dateFormat,
		sortable : true
	}, {
		header : "创建时间",
		dataIndex : 'createTime',
		width : 120,
		renderer : dateFormat,
		sortable : true
	}, {
		header : "描述",
		dataIndex : 'memo',
		width : 300,
		sortable : true
	}, {
		header : "状态",
		dataIndex : 'procId',
		renderer : function(data) {
			return '处理中';
		},
		width : 100,
		sortable : true
	}, {
		header : "流程",
		dataIndex : 'procNode',
		width : 100,
		sortable : true
	}, {
		header : "处理人",
		dataIndex : 'handleUser',
		width : 100,
		sortable : true
	}];

	var record = Ext.data.Record.create([{
				name : 'procKey',
				mapping : 'procKey'
			}, {
				name : 'title',
				mapping : 'title'
			}, {
				name : 'expectedCompleteTime',
				mapping : 'expectedCompleteTime'
			}, {
				name : 'createTime',
				mapping : 'createTime'
			}, {
				name : 'memo',
				mapping : 'memo'
			}, {
				name : 'procId',
				mapping : 'procId'
			}, {
				name : 'procNode',
				mapping : 'procNode'
			}, {
				name : 'handleUser',
				mapping : 'handleUser'
			}]);

	var reader = new Ext.data.JsonReader({
				totalProperty : "DataSize",
				root : "DataList"
			}, record);

	var gStore = new Ext.data.Store({
		proxy : new Ext.ux.data.DWRProxy({
					dwrFunction : IncidentService.getClientSubmitProcessIncidentItems,
					listeners : {
						'beforeload' : function(dataProxy, params) {
							var loadArgs = [params.start, params.limit,
									params.user];
							params[dataProxy.loadArgsKey] = loadArgs;
						}
					}
				}),
		reader : reader
	});

	var page = new Ext.PagingToolbar({
				pageSize : 20,
				store : gStore,
				displayInfo : true,
				displayMsg : '显示 {0} - {1} 条记录，共 {2}条记录',
				emptyMsg : '没有任何请求'
			});

	var mainPanel = createGridPanel();

	// Method
	function reloadGrid() {
		gStore.load({
					params : {
						start : 0,
						limit : 20,
						user : USER.getUserName()
					}
				});
	};

	function refreshGrid() {
		gStore.load({
					params : {
						start : page.cursor,
						limit : 20,
						user : USER.getUserName()
					}
				});
	};

	function createGridPanel() {
		var panel = new Ext.grid.GridPanel({
					id : 'Apex.Desk.Process.ListPanel',
					store : gStore,
					columns : column,
					autoScroll : true,
					enableHdMenu : false,
					height : 100,
					autoExpandColumn : 5,
					margins : '5 0 0 0',
					tbar : [refreshBtn],
					bbar : page
				});

		reloadGrid();

		return panel;
	};

	this.getPanel = function() {
		return mainPanel;
	};

};

function showFixedIncidentDetail(procKey) {
	var value = window.showModalDialog("ViewDetailServlet?procKey=" + procKey,
			window,
			"dialogWidth=1102px;dialogHeight=590px;status:no;scroll:no;");
	if (value != null) {
		Ext.Msg.show({
					title : '提示',
					msg : value,
					modal : true,
					buttons : Ext.Msg.OK,
					fn : function() {
						Ext.getCmp('waitIncidentItemTable').getStore().load({
									params : {
										start : 0,
										limit : 20
									}
								});
					},
					icon : Ext.Msg.INFO
				});
	}
};