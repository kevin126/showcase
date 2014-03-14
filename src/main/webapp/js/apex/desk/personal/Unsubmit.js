Ext.namespace('Apex.Desk.Unsubmit');

Apex.Desk.Unsubmit.Panel = function() {
	// Id
	this.id = 'Apex.Desk.Ubsubmit';

	// Property
	var editBtn = new Ext.Button({
				text : '修改',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.SETACCESSMODE_BUTTON_PNG,
				handler : handleEditRequest,
				disabled : true,
				minWidth : 80
			});

	var submitBtn = new Ext.Button({
				text : '提交',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.EXPORT_BUTTON_PNG,
				handler : handleSubmitRequest,
				disabled : true,
				minWidth : 80
			});

	var deleteBtn = new Ext.Button({
				text : '删除',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				handler : handleDeleteRequest,
				disabled : true,
				minWidth : 80
			});

	var refreshBtn = new Ext.Button({
				text : '刷新',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.REFRESH_BUTTON_PNG,
				handler : refreshGrid,
				minWidth : 80
			});

	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();
	checkboxSelect.on('selectionchange', handleCheckChange);

	var column = [new Ext.grid.RowNumberer(), checkboxSelect, {
				header : "索引",
				dataIndex : 'id',
				width : 10,
				hidden : true,
				sortable : true
			}, {
				header : "标题",
				dataIndex : 'taskTitle',
				width : 100,
				sortable : true,
				renderer : function(data) {
					return '<a href=# onclick="showDetail();">' + data + '</a>';
				}
			}, {
				header : "期望完成时间",
				dataIndex : 'completeTime',
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
				dataIndex : 'taskMemo',
				width : 300,
				hidden : true,
				sortable : true
			}, {
				header : "状态",
				dataIndex : 'take',
				renderer : function(data) {
					if (!data) {
						return '未提交';
					} else {
						return '待处理';
					}
				},
				width : 100,
				sortable : true
			}, {
				header : "客户名",
				dataIndex : 'clientName',
				width : 100,
				hidden : true,
				sortable : true
			}];

	var record = Ext.data.Record.create([{
				name : 'id',
				mapping : 'id'
			}, {
				name : 'taskTitle',
				mapping : 'taskTitle'
			}, {
				name : 'completeTime',
				mapping : 'completeTime'
			}, {
				name : 'createTime',
				mapping : 'createTime'
			}, {
				name : 'taskMemo',
				mapping : 'taskMemo'
			}, {
				name : 'take',
				mapping : 'take'
			}, {
				name : 'clientName',
				mapping : 'clientName'
			}]);

	var reader = new Ext.data.JsonReader({
				totalProperty : "DataSize",
				root : "DataList"
			}, record);

	var gStore = new Ext.data.Store({
		proxy : new Ext.ux.data.DWRProxy({
					dwrFunction : DeskPersonalService.getUnprocessRequestByUser2,
					listeners : {
						'beforeload' : function(dataProxy, params) {
							var loadArgs = [params.start, params.limit,
									params.user, params.take];
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
	function handleCheckChange(checkMode) {
		var selectedRecord = checkboxSelect.getSelections();
		if (selectedRecord.length > 0) {
			editBtn.setDisabled(false);
			submitBtn.setDisabled(false);
			deleteBtn.setDisabled(false);
			if (selectedRecord.length > 1) {
				editBtn.setDisabled(true);
			}
		} else {
			editBtn.setDisabled(true);
			submitBtn.setDisabled(true);
			deleteBtn.setDisabled(true);
		}
	};

	function reloadGrid() {
		gStore.load({
					params : {
						start : 0,
						limit : 20,
						user : USER.getUserName(),
						take : false
					}
				});
	};

	function refreshGrid() {
		gStore.load({
					params : {
						start : page.cursor,
						limit : 20,
						user : USER.getUserName(),
						take : false
					}
				});
	};

	function createGridPanel() {
		var panel = new Ext.grid.GridPanel({
					id : 'Apex.Desk.Unsubmit.ListPanel',
					store : gStore,
					columns : column,
					sm : checkboxSelect,
					autoScroll : true,
					enableHdMenu : false,
					height : 100,
					autoExpandColumn : 3,
					margins : '5 0 0 0',
					tbar : [editBtn, '-', submitBtn, '-', deleteBtn, '-',
							refreshBtn],
					bbar : page
				});
		
		reloadGrid();
		
		return panel;
	};

	function handleEditRequest() {
		var select = checkboxSelect.getSelected();
		var id = select.get('id');
		var win = Apex.Desk.RequestWin.Window(id, reloadGrid);
		win.getWin();
	};

	function handleSubmitRequest() {
		var tIdAry = new Array();
		var selectedRecord = checkboxSelect.getSelections();
		for (var i = 0; i < selectedRecord.length; i++) {
			tIdAry.push(selectedRecord[i].data.id);
		}
		DeskPersonalService.submitRequest(tIdAry, function(returnValue) {
					if (returnValue) {
						Ext.Msg.show({
									title : '提示',
									msg : '提交成功！',
									modal : true,
									buttons : Ext.Msg.OK,
									fn : function() {
										reloadGrid();
									},
									icon : Ext.Msg.INFO
								});
					} else {
						showErrMessage('提交请求错误！');
					}
				});
	};

	function handleDeleteRequest() {

		var confirmBox = Ext.MessageBox.confirm('确认', '确定要删除吗?', function(id) {
					if (id == 'yes') {
						var tIdAry = new Array();
						var selectedRecord = checkboxSelect.getSelections();
						for (var i = 0; i < selectedRecord.length; i++) {
							tIdAry.push(selectedRecord[i].data.id);
						}
						DeskPersonalService.deleteRequest(tIdAry, function(
										returnValue) {
									if (returnValue) {
										Ext.Msg.show({
									title : '提示',
									msg : '删除成功！',
									modal : true,
									buttons : Ext.Msg.OK,
									fn : function() {
										reloadGrid();
									},
									icon : Ext.Msg.INFO
								});
									} else {
										showErrMessage('删除请求错误！');
									}
								});
					}
				});

	};

	this.getPanel = function() {
		return mainPanel;
	};

};

function reloadGD() {
	var panel = Ext.getCmp('Apex.Desk.Unsubmit.ListPanel');
	panel.getStore()
			.load({
						params : {
							start : panel.getBottomToolbar().cursor,
							limit : 20,
							user : USER.getUserName(),
							take : false
						}
					});
};

function showDetail() {
	var select = Ext.getCmp('Apex.Desk.Unsubmit.ListPanel').getSelectionModel()
			.getSelected();
	var id = select.get('id');
	var win = Apex.Desk.RequestWin.Window(id, reloadGD);
	win.getWin();
};