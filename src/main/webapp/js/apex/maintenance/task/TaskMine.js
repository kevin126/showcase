Ext.namespace('Apex.Task.TaskMine');

Apex.Task.TaskMine.Panel = function() {
	// Id
	this.id = 'Apex.Task.TaskMine';

	// Property

	var deleteBtn = new Ext.Button({
				text : '删除',
				cls : 'x-btn-text-icon',
				disabled : true,
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				handler : deleteTask,
				minWidth : 80
			});

	var refreshBtn = new Ext.Button({
				text : '刷新',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.REFRESH_BUTTON_PNG,
				handler : refreshGrid,
				minWidth : 80
			});

	var exportBtn = new Ext.Button({
				text : '导出',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EXPORT_BUTTON_PNG,
				handler : exportGrid,
				minWidth : 80
			});

	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();
	checkboxSelect.on('selectionchange', handleCheckChange);

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
							+ '\',\'Apex.Task.TaskMine.Grid\');">'
							+ data + '</a>';
				}
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

	var gStore = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : WorkflowService.getAssignedExecutionByUser,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									//fix by jonim at 2009-9-16
									var user = USER.getUserName();
						            var pname = WorkflowNameConstant.ALL_NAME;
									var loadArgs = [params.start, params.limit,
											        user, pname];
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
	function loadData() {
		gStore.load({
					params : {
						start : 0,
						limit : 20,
						user : USER.getUserName(),
						pname : WorkflowNameConstant.ALL_NAME
					}
				});
	};

	function createMineGridPanel() {
		var panel = new Ext.grid.GridPanel({
					id : 'Apex.Task.TaskMine.Grid',
					store : gStore,
					columns : column,
					sm : checkboxSelect,
					autoScroll : true,
					enableHdMenu : false,
					height : 100,
					autoExpandColumn : 7,
					margins : '5 0 0 0',
					tbar : [refreshBtn, '-', exportBtn],
					bbar : page
				});

		loadData();

		return panel;
	};

	function canDelete() {
		return USER.isAble(UserPermissionConstant.delete_workorder);
	}

	function handleCheckChange(checkMode) {
		if (checkMode.getCount() > 0) {
			deleteBtn.setDisabled(!canDelete());
		} else {
			deleteBtn.setDisabled(true);
		}
	};

	function refreshGrid() {
		gStore.load({
					params : {
						start : page.cursor,
						limit : 20,
						user : USER.getUserName(),
						pname : WorkflowNameConstant.ALL_NAME
					}
				});
	};

	function reloadGrid() {
		gStore.load({
					params : {
						start : 0,
						limit : 20,
						user : USER.getUserName(),
						pname : WorkflowNameConstant.ALL_NAME
					}
				});
	};

	function deleteTask() {
		var confirmBox = Ext.MessageBox.confirm('确认', '确定要删除工单吗？',
				function(id) {
					if (id == 'yes') {
						var pIdAry = new Array();
						var pTypeAry = new Array();
						var selectedRecord = checkboxSelect.getSelections();
						for (var i = 0; i < selectedRecord.length; i++) {
							pIdAry.push(selectedRecord[i].data.procId);
							pTypeAry.push(selectedRecord[i].data.procType);
						}

						WorkflowService.taskExistsByIds(pIdAry, function(
								returnValue) {
							if (!returnValue) {
								Ext.Msg.show({
											title : '错误',
											msg : '工单已经被删除，请重新选择！',
											modal : true,
											buttons : Ext.Msg.OK,
											icon : Ext.Msg.ERROR
										});
							} else {
								WorkflowService.deleteTask(pIdAry, pTypeAry,
										function(returnValue) {
											if (!returnValue) {
												Ext.Msg.show({
															title : '错误',
															msg : '删除工单未完成，系统错误！',
															modal : true,
															buttons : Ext.Msg.OK,
															icon : Ext.Msg.ERROR
														});
											}
											reloadGrid();
										});
							}
							reloadGrid();
						});
					}
				});
	};

	function exportGrid() {
		var str = escape(escape(extractVisibleColumnString(2, mainPanel)));
		var url = "/itsm/taskexport.jsp?userid=" + USER.getUserName()
				+ "&procname=" + WorkflowNameConstant.ALL_NAME
				+ "&type=taskmine&column=" + str;
		window.open(url);
	};

	this.getPanel = function() {
		return mainPanel;
	};
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