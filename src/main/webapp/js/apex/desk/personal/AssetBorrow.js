Ext.namespace('Apex.Desk.AssetBorrow');

/*****************************************************************************************************************************
 * COMPANY:            TEKVIEW
 * CRATE BY:           JONIM
 * CREATE DATE:        2009-9-8
 * LAST UPDATE DATE:
 * LAST UPDATE BY:
 * DESCRIPTION:        This funtion is to create a grid panel which is for borrow asset   
 * ****************************************************************************************************************************
 */

Apex.Desk.AssetBorrow.Panel = function() {
	// Id
	this.id = 'Apex.Desk.AssetBorrow';

	// Property
	var newBtn = new Ext.Button({
				text : '新建',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.ADD_BUTTON_PNG,
				handler : handleNewRequest,
				minWidth : 80
			});
			
	var reflashBtn = new Ext.Button({
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
			},{
				header : "工单号",
				dataIndex : 'procKey',
				width : 50,
				sortable : true,
				renderer : function(data) {
					return '<a href=# onclick="showAssetBorrowDrawDetail(\''
							+ data
							+ '\', \'Apex.Desk.AssetApply.ListPanel\');">'
							+ data + '</a>';
				}
			}, {
				header : "标题",
				dataIndex : 'title',
				width : 100,
				sortable : true
			}, {
				header : "申请日期",
				dataIndex : 'applyDate',
				width : 120,
				renderer : dateFormat,
				sortable : true
			}, {
				header : "借调日期",
				dataIndex : 'borrowDate',
				width : 120,
				renderer : dateFormat,
				sortable : true
			}, {
				header : "归还日期",
				dataIndex : 'returnDate',
				width : 120,
				renderer : dateFormat,
				sortable : true
			}, {
				header : "描述",
				dataIndex : 'memo',
				width : 400,
				sortable : true
			},
			{header : "状态",dataIndex : 'procNode',width : 120,sortable : true}
			];

	var record = Ext.data.Record.create([{
				name : 'id',
				mapping : 'id'
			},  {
				name : 'procKey',
				mapping : 'procKey'
			},{
				name : 'title',
				mapping : 'title'
			}, {
				name : 'applyDate',
				mapping : 'applyDate'
			}, {
				name : 'borrowDate',
				mapping : 'borrowDate'
			}, {
				name : 'returnDate',
				mapping : 'returnDate'
			}, {
				name : 'memo',
				mapping : 'memo'
			},
			{name : 'procNode',mapping : 'procNode'}]);

	var reader = new Ext.data.JsonReader({
				totalProperty : "DataSize",
				root : "DataList"
			}, record);

	var gStore = new Ext.data.Store({
		proxy : new Ext.ux.data.DWRProxy({
					dwrFunction : ApplyService.getAssetDrawBorrowByApplier,
					listeners : {
						'beforeload' : function(dataProxy, params) {
							var user = USER.getUserName();
							var loadArgs = [params.start, params.limit,
									user];
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


	var mainPanel = createSubmitGridPanel();

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

	function createSubmitGridPanel() {
		var panel = new Ext.grid.GridPanel({
					id : 'Apex.Desk.AssetBorrow.ListPanel',
					store : gStore,
					columns : column,
					autoScroll : true,
					enableHdMenu : false,
					height : 100,
					autoExpandColumn : 2,
					margins : '5 0 0 0',
					tbar : [newBtn],
					bbar : page
				});

		reloadGrid();

		return panel;
	};
	
	function handleNewRequest() {
		var win = Apex.Desk.AssetBorrowWin.Window(reloadGrid);
		win.getWin();
	};
	
	this.getPanel = function() {
		return mainPanel;
	};

};

function showAssetBorrowDrawDetail(procKey, gridPanelId) {
	var value = window.showModalDialog("ViewAssetBorrowDraw?PKEY=" + procKey+"&time="+new Date().getTime(),
			window,
			"dialogWidth=1102px;dialogHeight=500px;status:no;scroll:no;");
	reflushGrid(gridPanelId);
};

function reflushGrid(gridPanelId) {
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