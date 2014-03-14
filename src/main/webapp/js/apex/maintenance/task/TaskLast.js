Ext.namespace('Apex.Task.TaskLast');

Apex.Task.TaskLast.Panel = function(mod) {
	// Id
	this.id = 'Apex.Task.TaskLast';
	var mode = mod;
	// Property

	var exportByExcelBtn = new Ext.Button({
				text : '导出为excel',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EXPORT_EXCEL_BUTTON_PNG,
				isPermission : USER.isAble(PermissionId.ISSUE_EXPORT),
				disabled : true,
				handler : exportByExcel
			})
	var exportByPdfBtn = new Ext.Button({
				text : '导出为pdf',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EXPORT_PDF_BUTTON_PNG,
				isPermission : USER.isAble(PermissionId.ISSUE_EXPORT),
				disabled : true,
				handler : exportByPdf
			})
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();

	var column = [new Ext.grid.RowNumberer(), {
		header : "工单号",
		dataIndex : 'processCode',
		width : 100,
		sortable : true,
		renderer : function(data) {
			if (mode == 'state_resolved') {
				return '<a href="/itsm/common/viewIssueDetail.do?ISSUE_CODE='
						+ data + '&menuId=m0_3"' + '">' + data + '</a>';
			} else if (mode == 'MODIFY') {
				return '<a href="/itsm/common/viewIssueDetail.do?ISSUE_CODE='
						+ data + '&menuId=m0_4"' + '">' + data + '</a>';
			} else if (mode == 'CREATE') {
				return '<a href="/itsm/common/viewIssueDetail.do?ISSUE_CODE='
						+ data + '&menuId=m0_5"' + '">' + data + '</a>';
			}
		}
	}, {
		header : "标题",
		dataIndex : 'title',
		width : 250,
		sortable : true
	}, {
		header : "优先级",
		dataIndex : 'priority',
		width : 70,
		renderer : wfPriorFormat,
		sortable : true
	}, {
		header : "影响度",
		width : 70,
		dataIndex : 'impace',
		renderer : wfImpactFormat,
		sortable : true
	}, {
		header : "创建人",
		dataIndex : 'creator.realName',
		width : 120,
		sortable : true
	}, {
		header : "状态",
		dataIndex : 'state',
		width : 100,
		sortable : true,
		renderer : statusFormat
	}, {
		header : "创建时间",
		dataIndex : 'createTime',
		width : 120,
		renderer : dateFormat,
		sortable : true
	}, {
		header : "期望完成时间",
		dataIndex : 'expectedCompleteTime',// 数据库中是实际解决时间
		width : 120,
		renderer : dateFormat,
		sortable : true
	}];

	var record = Ext.data.Record.create([{
				name : 'processCode',
				mapping : 'processCode'
			}, {
				name : 'title',
				mapping : 'title'
			}, {
				name : 'priority',
				mapping : 'priority'
			}, {
				name : 'impace',
				mapping : 'impace'
			}, {
				name : 'creator.realName',
				mapping : 'creator.realName'
			}, {
				name : 'state',
				mapping : 'state'
			}, {
				name : 'createTime',
				mapping : 'createTime'
			}, {
				name : 'expectedCompleteTime',
				mapping : 'expectedCompleteTime'
			}]);

	var reader = new Ext.data.JsonReader({
				totalProperty : "DataSize",
				root : "DataList"
			}, record);

	var gStore = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : IssueService.lastExecution,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [params.start, params.limit,
											-7, mode];
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

	var tbarSeparator = new Ext.Toolbar.Separator(USER
			.isAble(PermissionId.ISSUE_EXPORT));
	var mainPanel = createMineGridPanel();

	// Method

	function reloadGrid() {
		gStore.load({
					params : {
						start : 0,
						limit : 20
					},
					callback : function() {
						if (gStore.getTotalCount() > 0) {
							exportByExcelBtn.setDisabled(false);
							exportByPdfBtn.setDisabled(false);
						} else {
							exportByExcelBtn.setDisabled(true);
							exportByPdfBtn.setDisabled(true);
						};
					}
				});

	};

	function createMineGridPanel() {
		var innerWidth;
		if (window.innerWidth) {
			innerWidth = window.innerWidth;
		} else {
			innerWidth = document.body.clientWidth;
		}

		var innerHeight;
		if (window.innerHeight) {
			innerHeight = window.innerHeight;
		} else {
			innerHeight = document.body.clientHeight;
		}

		var panel = new Ext.grid.GridPanel({
					id : 'taskLast.gridPanel',
					store : gStore,
					columns : column,
					sm : checkboxSelect,
					autoScroll : true,
					border : false,
					enableHdMenu : false,
					autoExpandColumn : 2,
					width : innerWidth,
					height : innerHeight - 218,
					renderTo : 'mainBodyDiv',
					bbar : page
					//tbar : [exportByExcelBtn, tbarSeparator, exportByPdfBtn]
				});

		reloadGrid();
		return panel;
	};

	function exportByExcel() {
		var resultPanel = Ext.getCmp('taskLast.gridPanel');
		var dateColumn = "";
		dateColumn = "创建时间" + "，" + "期望完成时间" + "，";
		var column = extractVisibleColumnString(2, resultPanel);
		var str = null;
		var lastTime=new Date().getTime()-7*24*3600*1000;
		if (mode == 'state_resolved') {
			str = " from WfDataEntity where state = " + "'state_resolved' or state = 'state_closed'";
		} else if (mode == 'MODIFY') {
			str = " from WfDataEntity where lastModifyTime >= " + lastTime;
		} else if (mode == 'CREATE') {
			str = " from WfDataEntity where createTime >= " + lastTime;
		}

		location.href = '/itsm/common/exportForm.do?type=excel'
				+ '&dateColumn=' + dateColumn + '&column=' + column + '&hql='
				+ str;
	}

	function exportByPdf() {
		var resultPanel = Ext.getCmp('taskLast.gridPanel');
		var dateColumn = "";
		dateColumn = "创建时间" + "，" + "期望完成时间" + "，";
		var column = extractVisibleColumnString(2, resultPanel);
		var str = null;
		var lastTime=new Date().getTime()-7*24*3600*1000;
		if (mode == 'state_resolved') {
			str = " from WfDataEntity where state = " + "'state_resolved'";
		} else if (mode == 'MODIFY') {
			str = " from WfDataEntity where lastModifyTime >= " + lastTime;
		} else if (mode == 'CREATE') {
			str = " from WfDataEntity where createTime >= " + lastTime;
		}

		location.href = '/itsm/common/exportForm.do?type=pdf' + '&dateColumn='
				+ dateColumn + '&column=' + column + '&hql=' + str;
	}

	function extractVisibleColumnString(start, panel) {
		var str = "";
		if (panel != null && panel.getColumnModel() != null && start > 0
				&& panel.getColumnModel().getColumnCount(false) > start) {
			var model = panel.getColumnModel();
			var count = model.getColumnCount(false);
			for (var id = start; id < count; id++) {
				if (!model.isHidden(id)) {
					str = str + model.getColumnHeader(id) + "，";
				}
			}
		}
		return str;
	}

	this.getPanel = function() {
		return mainPanel;
	};

	this.getMode = function() {
		return mode;
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