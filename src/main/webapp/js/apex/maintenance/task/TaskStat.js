Ext.namespace('Apex.Task.TaskStat');

Apex.Task.TaskStat.Panel = function(stItem) {
	// Id
	this.id = 'Apex.Task.TaskStat';
	var statItem = stItem;

	// Property
	var refreshBtn = new Ext.Button({
				text : '刷新',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.REFRESH_BUTTON_PNG,
				handler : reloadGrid,
				minWidth : 80
			});

	var exportBtn = new Ext.Button({
				text : '导出',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EXPORT_BUTTON_PNG,
				handler : exportGrid,
				minWidth : 80
			});

	function colorRender(value) {
		return '<img src="images/green.jpg" width=' + value + ' height=12>&nbsp;' + value + '%';
	};

	var column = null;

	if (statItem == StatisticTaskItem.STAT_USER) {
		var column = [new Ext.grid.RowNumberer(), {
			header : "运维人员",
			dataIndex : 'worker',
			width : 100,
			renderer : function(data) {
				return '<a href=# onclick="showUserUnTask(\'' + data + '\');">'
						+ data + '</a>';
			},
			sortable : true
		}, {
			header : "工单数量",
			dataIndex : 'count',
			width : 100,
			sortable : true
		}, {
			header : "工单百分比",
			dataIndex : 'scale',
			width : 200,
			renderer : colorRender,
			sortable : true
		}, {
			header : "prior",
			dataIndex : 'prior',
			hidden : true,
			sortable : true
		}, {
			header : "severity",
			dataIndex : 'severity',
			hidden : true,
			sortable : true
		}, {
			header : "state",
			dataIndex : 'state',
			hidden : true,
			sortable : true
		}];
	};

	if (statItem == StatisticTaskItem.STAT_PRIOR) {
		var column = [new Ext.grid.RowNumberer(), {
					header : "优先级",
					dataIndex : 'prior',
					width : 200,
					renderer : wfPriorFormat2,
					sortable : true
				}, {
					header : "工单数量",
					dataIndex : 'count',
					width : 200,
					sortable : true
				}, {
					header : "工单百分比",
					dataIndex : 'scale',
					width : 200,
					renderer : colorRender,
					sortable : true
				}, {
					header : "worker",
					dataIndex : 'worker',
					hidden : true,
					sortable : true
				}, {
					header : "severity",
					dataIndex : 'severity',
					hidden : true,
					sortable : true
				}, {
					header : "state",
					dataIndex : 'state',
					hidden : true,
					sortable : true
				}];
	};

	if (statItem == StatisticTaskItem.STAT_STATE) {
		var column = [new Ext.grid.RowNumberer(), {
			header : "工单状态",
			dataIndex : 'state',
			width : 200,
			renderer : function(data) {
				return '<a href=# onclick="showStateUnTask(\'' + data
						+ '\');">' + data + '</a>';
			},
			sortable : true
		}, {
			header : "工单数量",
			dataIndex : 'count',
			width : 200,
			sortable : true
		}, {
			header : "工单百分比",
			dataIndex : 'scale',
			width : 200,
			renderer : colorRender,
			sortable : true
		}, {
			header : "worker",
			dataIndex : 'worker',
			hidden : true,
			sortable : true
		}, {
			header : "prior",
			dataIndex : 'prior',
			hidden : true,
			sortable : true
		}, {
			header : "severity",
			dataIndex : 'severity',
			hidden : true,
			sortable : true
		}];
	};

	if (statItem == StatisticTaskItem.STAT_SEVERITY) {
		var column = [new Ext.grid.RowNumberer(), {
					header : "严重度",
					dataIndex : 'severity',
					renderer : wfSeverityFormat2,
					width : 200,
					sortable : true
				}, {
					header : "工单数量",
					dataIndex : 'count',
					width : 200,
					sortable : true
				}, {
					header : "工单百分比",
					dataIndex : 'scale',
					renderer : colorRender,
					width : 200,
					sortable : true
				}, {
					header : "worker",
					dataIndex : 'worker',
					hidden : true,
					sortable : true
				}, {
					header : "prior",
					dataIndex : 'prior',
					hidden : true,
					sortable : true
				}, {
					header : "state",
					dataIndex : 'state',
					hidden : true,
					sortable : true
				}];
	};

	var record = Ext.data.Record.create([{
				name : 'worker',
				mapping : 'worker'
			}, {
				name : 'prior',
				mapping : 'prior'
			}, {
				name : 'severity',
				mapping : 'severity'
			}, {
				name : 'state',
				mapping : 'state'
			}, {
				name : 'count',
				mapping : 'count'
			}, {
				name : 'scale',
				mapping : 'scale'
			}]);

	var reader = new Ext.data.JsonReader({
				totalProperty : "DataSize",
				root : "DataList"
			}, record);

	var gStore = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : WorkflowService.staticExecution,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [stItem];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});

	var mainPanel = createMineGridPanel();

	// Method
	function reloadGrid() {
		gStore.load({
					params : {
						start : 0,
						item : stItem
					}
				});
	};

	function createMineGridPanel() {
		var panel = new Ext.grid.GridPanel({
					store : gStore,
					columns : column,
					autoScroll : true,
					enableHdMenu : false,
					height : 100,
					autoExpandColumn : 3,
					margins : '5 0 0 0',
					tbar : [refreshBtn, '-', exportBtn]
				});

		reloadGrid();

		return panel;
	};

	function exportGrid() {
		var str = escape(escape(extractVisibleColumnString(1, mainPanel)));
		var url = '/itsm/taskexport.jsp?type=taskstat&statitem=' + statItem
				+ '&column=' + str;
		window.open(url);
	};

	this.getPanel = function() {
		return mainPanel;
	};
};

function showUserUnTask(data) {
	var user = escape(escape(data));
	var parentPanel = Ext.getCmp('Apex.Task.CenterTabPanel');
	var panel = new Apex.Task.TaskUser.Panel(user, 0,
			StatisticTaskItem.STAT_USER).getPanel();
	parentPanel.removeAll(true);
	parentPanel.add(panel);
	parentPanel.doLayout();
};

function showPriorUnTask(data) {
	var parentPanel = Ext.getCmp('Apex.Task.CenterTabPanel');
	var panel = new Apex.Task.TaskUser.Panel('', data,
			StatisticTaskItem.STAT_PRIOR).getPanel();
	parentPanel.removeAll(true);
	parentPanel.add(panel);
	parentPanel.doLayout();
};

function showSeverityUnTask(data) {
	var user = escape(escape(data));
	var parentPanel = Ext.getCmp('Apex.Task.CenterTabPanel');
	var panel = new Apex.Task.TaskUser.Panel('', data,
			StatisticTaskItem.STAT_SEVERITY).getPanel();
	parentPanel.removeAll(true);
	parentPanel.add(panel);
	parentPanel.doLayout();
};

function showStateUnTask(data) {
	var user = escape(escape(data));
	var parentPanel = Ext.getCmp('Apex.Task.CenterTabPanel');
	var panel = new Apex.Task.TaskUser.Panel(data, 0,
			StatisticTaskItem.STAT_STATE).getPanel();
	parentPanel.removeAll(true);
	parentPanel.add(panel);
	parentPanel.doLayout();
};
