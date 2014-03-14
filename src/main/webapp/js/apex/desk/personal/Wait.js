Ext.namespace('Apex.Desk.Wait');

Apex.Desk.Wait.Panel = function() {
	// Id
	this.id = 'Apex.Desk.Wait';

	// Property
	var refreshBtn = new Ext.Button({
				text : '刷新',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.REFRESH_BUTTON_PNG,
				handler : refreshGrid,
				minWidth : 80
			});

	var column = [new Ext.grid.RowNumberer(), {
				header : "索引",
				dataIndex : 'id',
				width : 10,
				hidden : true,
				sortable : true
			}, {
				header : "标题",
				dataIndex : 'taskTitle',
				width : 100,
				sortable : true
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
	function reloadGrid() {
		gStore.load({
					params : {
						start : 0,
						limit : 20,
						user : USER.getUserName(),
						take : true
					}
				});
	};

	function refreshGrid() {
		gStore.load({
					params : {
						start : page.cursor,
						limit : 20,
						user : USER.getUserName(),
						take : true
					}
				});
	};

	function createGridPanel() {
		var panel = new Ext.grid.GridPanel({
					id : 'Apex.Desk.Wait.ListPanel',
					store : gStore,
					columns : column,
					autoScroll : true,
					enableHdMenu : false,
					height : 100,
					autoExpandColumn : 2,
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