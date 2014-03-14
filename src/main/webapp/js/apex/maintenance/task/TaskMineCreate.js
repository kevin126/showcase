Ext.namespace('Apex.Task.TaskMineCreate');

Apex.Task.TaskMineCreate.Panel = function() {
	// Id
	this.id = 'Apex.Task.TaskMineCreate';

	// Property
	var refreshBtn = new Ext.Button({
				text : '刷新',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.REFRESH_BUTTON_PNG,
				handler : refreshGrid,
				minWidth : 80
			});

	var isAllText = new Ext.Toolbar.TextItem({
				text : '显示已关闭工单：'
			});

	var isAllCheck = new Ext.form.Checkbox({
				checked : false
			});

	var exportBtn = new Ext.Button({
				text : '导出',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EXPORT_BUTTON_PNG,
				handler : exportGrid,
				minWidth : 80
			});

	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();

	var column = [new Ext.grid.RowNumberer(), checkboxSelect, {
				header : "ProcID",
				dataIndex : 'procId',
				width : 10,
				hidden : true,
				sortable : true
			}, {
				header : "工单号",
				dataIndex : 'procKey',
				width : 100,
				sortable : true,
				renderer : function(data) {
					return '<a href=# onclick="showFixedIncidentDetail_total(\''
							+ data
							+ '\',\'Apex.Task.TaskMineCreate.Grid\');">'
							+ data + '</a>';
				}
			}, {
				header : "主题摘要",
				dataIndex : 'title',
				width : 300,
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
				header : "客户期望完成时间",
				dataIndex : 'clientExpectTime',
				width : 120,
				renderer : dateFormat,
				sortable : true
			}, {
				header : "优先级",
				dataIndex : 'prior',
				width : 80,
				renderer : wfPriorFormat,
				sortable : true
			}, {
				header : "严重度",
				dataIndex : 'severity',
				width : 80,
				renderer : wfSeverityFormat,
				sortable : true
			}, {
				header : "状态",
				dataIndex : 'procNode',
				width : 100,
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

	var gStore = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : WorkflowService.userCreateExecution,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [params.start, params.limit,
											USER.getUserName(), isAllCheck.getValue()];
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
				emptyMsg : "没有任何工单"
			});

	var mainPanel = createMineGridPanel();

	// Method
	function refreshGrid() {
		gStore.load({
					params : {
						start : page.cursor,
						limit : 20,
						user : USER.getUserName(),
						isall : isAllCheck.getValue()
					}
				});
	};

	function reloadGrid() {
		gStore.load({
					params : {
						start : 0,
						limit : 20,
						user : USER.getUserName(),
						isall : isAllCheck.getValue()
					}
				});
	};

	function createMineGridPanel() {
		var panel = new Ext.grid.GridPanel({
			id : 'Apex.Task.TaskMineCreate.Grid',
					store : gStore,
					columns : column,
					sm : checkboxSelect,
					autoScroll : true,
					enableHdMenu : false,
					height : 100,
					autoExpandColumn : 11,
					margins : '5 0 0 0',
					tbar : [refreshBtn, '-', isAllText, isAllCheck, '-',
							exportBtn],
					bbar : page
				});

		reloadGrid();

		return panel;
	};
	
	function exportGrid() {
		var isAll = 'true';
		if (isAllCheck.getValue()) {
			isAll = 'true';
		} else {
			isAll = 'false';
		}
		var str = escape(escape(extractVisibleColumnString(2, mainPanel)));
		var url = "/itsm/taskexport.jsp?userid=" + USER.getUserName() + "&isall="
				+ isAll + "&type=taskminecreate&column=" + str;
		window.open(url);
	};
	
	function handleIsAllCheck(x, y) {
		gStore.load({
					params : {
						start : page.cursor,
						limit : 20,
						user : USER.getUserName(),
						isall : isAllCheck.getValue()
					}
				});
	};
	
	isAllCheck.on('check', handleIsAllCheck);
	
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

function showFixedIncidentDetail_total(procKey, gridPanelId) {
	IncidentService.isExistByProcKey(procKey, function(returnValue) {
		if (returnValue) {
			var value = window
					.showModalDialog("ViewDetailServlet?procKey=" + procKey
									+ "&time=" + new Date().getTime(), window,
							"dialogWidth=1102px;dialogHeight=590px;status:no;scroll:no;");
			if (value != null) {
				Ext.Msg.show({
							title : '提示',
							msg : value,
							modal : true,
							buttons : Ext.Msg.OK,
							fn : function() {
								reflushIncident_total(gridPanelId)
							},
							icon : Ext.Msg.INFO
						});
			}
		} else {
			Ext.Msg.show({
						title : '提示',
						msg : '该工单已经被删除了，请刷新！',
						modal : true,
						buttons : Ext.Msg.OK,
						fn : function() {
							reflushIncident_total(gridPanelId)
						},
						icon : Ext.Msg.INFO
					});
		}
	})
}

function reflushIncident_total(gridPanelId) {
	var gridPanel = Ext.getCmp(gridPanelId);
	if (!Ext.isEmpty(gridPanel)) {
		var store = gridPanel.getStore();
		var pagingBar = gridPanel.getBottomToolbar();
		var startIndex = pagingBar.cursor;
		if (!Ext.isEmpty(store))
			store.load({
						params : {
							start : startIndex,
							limit : 20
						}
					});
	}
}