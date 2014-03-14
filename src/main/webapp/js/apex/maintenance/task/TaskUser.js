Ext.namespace('Apex.Task.TaskUser');

Apex.Task.TaskUser.Panel = function(stringId, intId, typeId) {
	// Id
	this.id = 'Apex.Task.TaskUser';
	var user = stringId;
	var prior = intId;
	var severity = intId;
	var state = stringId;
	var type = typeId;

	// Property
	var refreshBtn = new Ext.Button({
				text : '刷新',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.REFRESH_BUTTON_PNG,
				handler : reloadGrid,
				minWidth : 80
			});

	var backBtn = new Ext.Button({
				text : '返回',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.REFRESH_BUTTON_PNG,
				handler : backPanel,
				minWidth : 80
			});

	var column = [new Ext.grid.RowNumberer(), {
				header : "ProcID",
				dataIndex : 'procId',
				width : 10,
				hidden : true,
				sortable : true
			}, {
				header : "工单号",
				dataIndex : 'procKey',
				width : 120,
				sortable : true
			}, {
				header : "主题摘要",
				dataIndex : 'title',
				width : 100,
				sortable : true
			}, {
				header : "创建人",
				dataIndex : 'createUser',
				width : 100,
				sortable : true
			}, {
				header : "创建时间",
				dataIndex : 'createTime',
				width : 120,
				renderer : dateFormat,
				sortable : true
			}, {
				header : "优先级",
				dataIndex : 'prior',
				width : 100,
				renderer : wfPriorFormat,
				sortable : true
			}, {
				header : "严重度",
				dataIndex : 'severity',
				width : 100,
				renderer : wfSeverityFormat,
				sortable : true
			}, {
				header : "状态",
				dataIndex : 'procNode',
				width : 100,
				sortable : true
			}, {
				header : "客户期望完成时间",
				dataIndex : 'clientExpectTime',
				width : 120,
				renderer : dateFormat,
				sortable : true
			}, {
				header : "工单类型",
				dataIndex : 'procType',
				width : 100,
				sortable : true
			}, {
				header : "handleUser",
				dataIndex : 'handleUser',
				hidden : true,
				sortable : true
			}, {
				header : "taskId",
				dataIndex : 'taskId',
				hidden : true,
				sortable : true
			}, {
				header : "taskType",
				dataIndex : 'taskType',
				hidden : true,
				sortable : true
			}];

	var record = Ext.data.Record.create([{
				name : 'procId',
				mapping : 'procId'
			}, {
				name : 'procKey',
				mapping : 'procKey'
			}, {
				name : 'title',
				mapping : 'title'
			}, {
				name : 'createUser',
				mapping : 'createUser'
			}, {
				name : 'createTime',
				mapping : 'createTime'
			}, {
				name : 'prior',
				mapping : 'prior'
			}, {
				name : 'severity',
				mapping : 'severity'
			}, {
				name : 'procNode',
				mapping : 'procNode'
			}, {
				name : 'clientExpectTime',
				mapping : 'clientExpectTime'
			}, {
				name : 'procType',
				mapping : 'procType'
			}, {
				name : 'handleUser',
				mapping : 'handleUser'
			}, {
				name : 'taskId',
				mapping : 'taskId'
			}, {
				name : 'taskType',
				mapping : 'taskType'
			}]);

	var reader = new Ext.data.JsonReader({
				totalProperty : "DataSize",
				root : "DataList"
			}, record);

	var gStore = null;

	if (type == StatisticTaskItem.STAT_USER) {
		gStore = new Ext.data.Store({
			proxy : new Ext.ux.data.DWRProxy({
				dwrFunction : WorkflowService.userUnExecution,
				listeners : {
					'beforeload' : function(dataProxy, params) {
						//var user =user;
						var loadArgs = [params.start, params.limit,user];
						params[dataProxy.loadArgsKey] = loadArgs;
					}
				}
			}),
			reader : reader
		});
	};

	if (type == StatisticTaskItem.STAT_PRIOR) {
		gStore = new Ext.data.Store({
					proxy : new Ext.ux.data.DWRProxy({
								dwrFunction : WorkflowService.priorUnExecution,
								listeners : {
									'beforeload' : function(dataProxy, params) {
										var loadArgs = [params.start,
												params.limit, prior];
										params[dataProxy.loadArgsKey] = loadArgs;
									}
								}
							}),
					reader : reader
				});
	};

	if (type == StatisticTaskItem.STAT_SEVERITY) {
		gStore = new Ext.data.Store({
					proxy : new Ext.ux.data.DWRProxy({
								dwrFunction : WorkflowService.severityUnExecution,
								listeners : {
									'beforeload' : function(dataProxy, params) {
										var loadArgs = [params.start,
												params.limit, severity];
										params[dataProxy.loadArgsKey] = loadArgs;
									}
								}
							}),
					reader : reader
				});
	};

	if (type == StatisticTaskItem.STAT_STATE) {
		gStore = new Ext.data.Store({
					proxy : new Ext.ux.data.DWRProxy({
								dwrFunction : WorkflowService.stateUnExecution,
								listeners : {'beforeload' : function(dataProxy, params) {
												var loadArgs = [params.start,params.limit, state];
												params[dataProxy.loadArgsKey] = loadArgs;
									}
								}
							}),
					reader : reader
				});
	};

	var page = new Ext.PagingToolbar({
				pageSize : 20,
				store : gStore,
				displayInfo : true,
				displayMsg : '显示 {0} - {1} 条记录，共 {2}条记录',
				emptyMsg : "没有任何工单"
			});

	var mainPanel = createGridPanel();

	// Method
	function refreshGrid() {
		if (type == StatisticTaskItem.STAT_USER) {
			gStore.load({
						params : {
							start : page.cursor,
							limit : 20,
							user : user
						}
					});
		};

		if (type == StatisticTaskItem.STAT_PRIOR) {
			gStore.load({
						params : {
							start : page.cursor,
							limit : 20,
							prior : prior
						}
					});
		};

		if (type == StatisticTaskItem.STAT_SEVERITY) {
			gStore.load({
						params : {
							start : page.cursor,
							limit : 20,
							severity : severity
						}
					});
		};

		if (type == StatisticTaskItem.STAT_STATE) {
			gStore.load({
						params : {
							start : page.cursor,
							limit : 20,
							state : state
						}
					});
		};
	};

	function reloadGrid() {
		if (type == StatisticTaskItem.STAT_USER) {
			gStore.load({
						params : {
							start : 0,
							limit : 20,
							user : user
						}
					});
		};

		if (type == StatisticTaskItem.STAT_PRIOR) {
			gStore.load({
						params : {
							start : 0,
							limit : 20,
							prior : prior
						}
					});
		};

		if (type == StatisticTaskItem.STAT_SEVERITY) {
			gStore.load({
						params : {
							start : 0,
							limit : 20,
							severity : severity
						}
					});
		};

		if (type == StatisticTaskItem.STAT_STATE) {
			gStore.load({
						params : {
							start : 0,
							limit : 20,
							state : state
						}
					});
		};
	};

	function createGridPanel() {
		var panel = new Ext.grid.GridPanel({
					store : gStore,
					columns : column,
					autoScroll : true,
					enableHdMenu : false,
					height : 100,
					autoExpandColumn : 3,
					margins : '5 0 0 0',
					bbar : page,
					tbar : [refreshBtn, '-', backBtn]
				});

		reloadGrid();

		return panel;
	};

	function backPanel() {
		var parentPanel = Ext.getCmp('Apex.Task.CenterTabPanel');
		var panel = new Apex.Task.TaskStat.Panel(type).getPanel();
		parentPanel.removeAll(true);
		parentPanel.add(panel);
		parentPanel.doLayout();
	}

	this.getPanel = function() {
		return mainPanel;
	};
}