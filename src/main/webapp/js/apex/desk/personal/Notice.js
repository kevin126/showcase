Ext.namespace('Apex.Desk.Notice');

/**
 * 
 */
Apex.Desk.Notice.Panel = function() {

	this.id = 'Apex.Desk.Notice';

	var column = [new Ext.grid.RowNumberer(), {
				header : "索引号",
				dataIndex : 'id',
				width : 10,
				hidden : true,
				sortable : true
			}, {
				header : "标题",
				dataIndex : 'title',
				width : 400,
				sortable : true,
				renderer: function(value) {
					return '<a href="#">' + value + '</a>';
				}
			}, {
				header : "创建时间",
				dataIndex : 'createTime',
				width : 100,
				sortable : true
			}, {
				header : "创建人",
				dataIndex : 'createUser',
				width : 100,
				sortable : true
			}];

	var record = Ext.data.Record.create([{
				name : 'id',
				mapping : 'id'
			}, {
				name : 'title',
				mapping : 'title'
			}, {
				name : 'memo',
				mapping : 'memo'
			},{
				name : 'createTime',
				mapping : 'createTime'
			},{
				name : 'createUser',
				mapping : 'createUser'
			}]);

	var reader = new Ext.data.JsonReader({
				totalProperty : "totalCount",
				root : "noticeItemList"
			}, record);

	var gStore = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : NoticeService.getIssueNoticeByPersonal,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [params.start, params.limit];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});

	var page = new Ext.PagingToolbar({
				pageSize : 7,
				store : gStore,
				hideLabel : true,
				displayInfo : false
			});

	function reloadGrid() {
		gStore.load({
					params : {
						start : 0,
						limit : 7
					}
				});
	};

	var mainPanel = new Ext.grid.GridPanel({
					id : 'Apex.Desk.Notice.GridPanel',
					region : 'south',
					layout : 'fit',
					margins : '0 0 5 5',
					width : 270,
					height : 200,
					store : gStore,
					columns : column,
					autoScroll : true,
					enableHdMenu : false,
					autoExpandColumn : 4,
					hideHeaders : false,
					frame : false,
					border : false,
					sm : new Ext.grid.RowSelectionModel({
								singleSelect : true
							}),
					bbar : page
				});
				
	mainPanel.on('rowclick', onPanleClick);		
	
	function onPanleClick(evt) {
		var selectedRecord = Ext.getCmp('Apex.Desk.Notice.GridPanel')
				.getSelectionModel().getSelected();
		if (selectedRecord != null && selectedRecord.data != null) {
			var nId = selectedRecord.data.id;
			
			var iTop = (window.screen.availHeight-30-500)/2;
			var iLeft = (window.screen.availWidth-10-600)/2;
			window.open('/itsm/viewNoticeDetail?noticeId=' + nId, '', 'width=800,height=600,top=' + iTop + ',left=' + iLeft + ',location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,directories=no');
		}
	}

	this.getPanel = function() {
		reloadGrid();
		return mainPanel;
	};
};