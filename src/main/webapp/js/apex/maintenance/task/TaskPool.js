Ext.namespace('Apex.Task.TaskPool');

Apex.Task.TaskPool.Panel = function() {
	var panel;
	var dataEntity = null;
	this.id = 'Apex.Task.TaskPool';
//	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();

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
	var column = [new Ext.grid.RowNumberer(), {
		header : "工单号",
		dataIndex : 'procKey',
		width : 100,
		sortable : true,
		renderer : function(data) {
			return '<a href="/itsm/common/viewIssueDetail.do?ISSUE_CODE='
					+ data + '+&menuId=m0_0"' + '">' + data + '</a>';
		}
	}, {
		header : "标题",
		dataIndex : 'title',
		width : 250,
		renderer : convertTextToHtml,
		sortable : true
	}, {
		header : "优先级",
		dataIndex : 'prior',
		renderer : wfPriorFormat,
		width : 60,
		sortable : true
	},{
		header : "影响度",
		dataIndex : 'severity',
		width : 60,
		renderer : wfImpactFormat,
		sortable : true
	}, {
		header : "创建人",
		dataIndex : 'createUser',
		width : 100,
		renderer : convertTextToHtml,
		sortable : true
	}, {
		header : "创建时间",
		dataIndex : 'createTime',
		width : 130,
		renderer : dateFormat,
		sortable : true
	}, {
		header : "期望完成时间",
		dataIndex : 'clientExpectTime',
		width : 130,
		renderer : dateFormat,
		sortable : true
	}, {
		header : "操作",
		dataIndex : 'handleUser',
		width : 150,
		hidden : true,
		renderer : operateTaskPoolFormat,
		sortable : false
	}];

	var record = Ext.data.Record.create([{
				name : 'procKey',
				mapping : 'procKey'
			}, {
				name : 'title',
				mapping : 'title'
			}, {
				name : 'severity',
				mapping : 'severity'
			}, {
				name : 'prior',
				mapping : 'prior'
			}, {
				name : 'createUser',
				mapping : 'createUser'
			}, {
				name : 'createTime',
				mapping : 'createTime'
			}, {
				name : 'clientExpectTime',
				mapping : 'clientExpectTime'
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
							dwrFunction : IssueService.getAllIssues,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [params.start, params.limit,
											params.incidentType];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});
	// Method
	function reloadGrid() {
		gStore.load({
					params : {
						start : 0,
						limit :20,
						incidentType : 'all'
					},
					callBack:function(){
						if(gStore.getTotalCount()>0){
							exportByExcelBtn.setDisabled(false);
							exportByPdfBtn.setDisabled(false);
						}else{
							exportByExcelBtn.setDisabled(true);
							exportByPdfBtn.setDisabled(true);
						}
					}
					
				});
	};
	function LoadStore(incidentType) {
		gStore.load({
					params : {
						start : 0,
						limit :20,
						incidentType : incidentType
					}
				});
	}
	var page = new Ext.PagingToolbar({
				pageSize :20,
				store : gStore,
				displayInfo : true,
				displayMsg : '显示 {0} - {1} 条记录，共 {2}条记录',
				emptyMsg : '没有任何工单'
			});

	var tbarSeparator = new Ext.Toolbar.Separator(USER.isAble(PermissionId.ISSUE_EXPORT));
	function createPoolGridPanel() {
		panel = new Ext.grid.GridPanel({
					id : 'Apex.Task.TaskPool.GridPanel',
					store : gStore,
					columns : column,
					layout : 'fit',
					margins : '5 5 5 5',
//					sm : checkboxSelect,
					autoScroll : true,
					enableHdMenu : false,
					autoExpandColumn : 2,
					buttonAlign : 'right',
					bbar : page
					//tbar : [exportByExcelBtn, tbarSeparator, exportByPdfBtn]
				});
		// 默认加载所有的事件工单
		reloadGrid();
		return panel;

	};
	// Take task
	this.createPanel = function() {
		var finalPanel = createPoolGridPanel();
		return finalPanel;
	};
	this.LoadStoreByType = function(incidentType) {
		dataEntity = incidentType;
		LoadStore(incidentType);
	}

	function exportByExcel() {
		var resultPanel = Ext.getCmp('Apex.Task.TaskPool.GridPanel');
		var dateColumn = "";
		dateColumn = "创建时间" + "，" + "期望完成时间" + "，";
		var column = extractVisibleColumnString(2, resultPanel);
		var str = '';
		if (dataEntity == null||dataEntity == 'null'||dataEntity == '') {
			str = " from WfDataEntity where processType = " + "'INC'";
		} else {
			str = " from WfDataEntity where processType = " + "'INC'"
					+ " and " + "wfDataEntityType.name = '" + dataEntity + "'";
		}
		location.href = '/itsm/common/exportForm.do?type=excel&dataEntity='
				+ 'incidentDataEntity' + '&dateColumn=' + dateColumn
				+ '&column=' + column + '&hql=' + str;
	}

	function exportByPdf() {
		var resultPanel = Ext.getCmp('Apex.Task.TaskPool.GridPanel');
		var dateColumn = "";
		dateColumn = "创建时间" + "，" + "期望完成时间" + "，";
		var column = extractVisibleColumnString(2, resultPanel);
		var str = '';  
		if (dataEntity == null) {
			str = " from WfDataEntity where processType = " + "'INC'";
		} else {
			str = " from WfDataEntity where processType = " + "'INC'"
					+ " and " + "wfDataEntityType.name = '" + dataEntity + "'";
		}
		location.href = '/itsm/common/exportForm.do?type=pdf&dataEntity='
				+ 'incidentDataEntity' + '&dateColumn=' + dateColumn
				+ '&column=' + column + '&hql=' + str;
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
};
// 全局函数 为了操作
function operateTaskPoolFormat(value) {
	if (Ext.isEmpty(value)) {
		return '';
	} else {
		// 渲染两个超链接，一个是分配给我，一个是删除
		var strs = new Array();
		strs = value.split(",");
		var handler = strs.pop();
		var processCode = strs.pop();
		var str1 = '<a href="/itsm/common/takeIssue.do?ISSUE_CODE=' + value
				+ '">' + '分配给我&nbsp;&nbsp;&nbsp;' + '</a>';

		var str2 = '<a href="/itsm/common/deleteIssue.do?ISSUE_CODE=' + value
				+ '&OPERATION=CONFIRM&menuId=m0_0"' + '">' + '删除' + '</a>'
		if (USER.isAble(PermissionId.ISSUE_DELETE)) {
			return str1 = str1 + str2;
		} else {
			return str1;
		}
	}
};

function taskPoolReloadGrid() {
	Ext.getCmp('Apex.Task.TaskPool.GridPanel').getStore().load({
				params : {
					start : 0,
					limit : 20,
					user : USER.getUserName()
				}
			});
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
							start : 0,
							limit : 20,
							user : USER.getUserName()
						}
					});
	}
}
