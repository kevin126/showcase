Ext.namespace('Apex.Desk.Portlet.Notice');

Apex.Desk.Portlet.Notice.Panel = function() {

	this.id = 'Apex.Desk.Portlet.Notice';

	function closeWindow() {
		if (popWin != null) {
			popWin.close();
			popWin = null;
		}
	};

	function sW(t, c) {

		var typeNameTextPop = new Ext.form.TextField({
					fieldLabel : '标题',
					readOnly : true,
					width : 490
				});
		typeNameTextPop.setValue(t);
		var typeMemoTextPop = new Ext.form.TextArea({
					fieldLabel : '内容',
					readOnly : true,
					width : 490,
					height : 400
				});
		typeMemoTextPop.setValue(c);
		var inputPanel = new Ext.form.FormPanel({
					monitorValid : true,
					frame : true,
					labelWidth : 40,
					items : [typeNameTextPop, typeMemoTextPop],
					buttons : [{
								text : '关闭',
								handler : closeWindow
							}],
					buttonAlign : 'center'
				});

		popWin = new Ext.Window({
					title : '公告',
					closable : true,
					width : 600,
					height : 500,
					border : false,
					plain : true,
					resizable : false,
					modal : true,
					items : [inputPanel]
				});

		popWin.show();
	};

	var column = [new Ext.grid.RowNumberer(), {
				header : "索引号",
				dataIndex : 'id',
				width : 10,
				hidden : true,
				sortable : true
			}, {
				header : "标题",
				dataIndex : 'title',
				width : 106,
				renderer : function(data) {
//					var dat = '';
//					head = data.substring(1, 4);
//					var da = '';
//					if (head == 'img') {
//						da = data.substring(37, data.length);
//					} else {
//						da = data;
//					}
//					if (da.length > 35) {
//						dat = da.substring(0, 29) + '。。。。。。';
//					} else {
//						dat = da;
//					}
					return '<a href="#">' + data + '</a>';
				},
				sortable : true
			}, {
				header : "置顶",
				dataIndex : 'isTop',
				width : 40,
				hidden : true,
				renderer : noticeTopFormat,
				sortable : true
			}];

	var record = Ext.data.Record.create([{
				name : 'id',
				mapping : 'id'
			}, {
				name : 'title',
				mapping : 'title'
			}, {
				name : 'isTop',
				mapping : 'isTop'
			}]);

	var reader = new Ext.data.JsonReader({
				totalProperty : "totalCount",
				root : "noticeItemList"
			}, record);

	var gStore = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : NoticeService.getIssueNotice,
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

	function onPanleClick(x, y, evt) {
		var selectedRecord = Ext.getCmp('Apex.Desk.Portlet.Notice.GridPanel')
				.getSelectionModel().getSelected();
		if (selectedRecord != null && selectedRecord.data != null) {
			var nId = selectedRecord.data.id;

			var iTop = (window.screen.availHeight-30-500)/2;
			var iLeft = (window.screen.availWidth-10-600)/2;
			window.open('/itsm/viewNoticeDetail?noticeId=' + nId, '', 'width=800,height=600,top=' + iTop + ',left=' + iLeft + ',location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=no,toolbar=no,directories=no');
			
			/*NoticeService.getNoticeItemById(nId, function(returnValue) {
						var title = '';
						var content = '';
						if (returnValue != null) {
							var dat = '';
							head = returnValue.title.substring(1, 4);
							var da = '';
							if (head == 'img') {
								da = returnValue.title.substring(37, returnValue.title.length);
							} else {
								da = returnValue.title;
							}
							if (da.length > 35) {
								dat = da.substring(0, 29) + '。。。。。。';
							} else {
								dat = da;
							}
							title = da;
							content = returnValue.memo;
						} else {
							title = '';
							title = '';
						}
						sW(title, content);
					});*/
		}
	}

	var timerTask = null;

	var taskRunner = null;

	function startRefresh() {
		timerTask = {
			run : reloadGrid,
			interval : 300000
		};
		taskRunner = new Ext.util.TaskRunner();
		taskRunner.start(timerTask);
	};

	var mainPanel = createNoticePanel();

	function createNoticePanel() {
		var panel = new Ext.grid.GridPanel({
					id : 'Apex.Desk.Portlet.Notice.GridPanel',
					region : 'south',
					layout : 'fit',
					margins : '0 0 5 5',
					height : 200,
					store : gStore,
					columns : column,
					autoScroll : true,
					enableHdMenu : false,
					autoExpandColumn : 2,
					hideHeaders : true,
					frame : false,
					border : false,
					sm : new Ext.grid.RowSelectionModel({
								singleSelect : true
							}),
					bbar : page
				});
		panel.addListener('rowclick', onPanleClick);
		return panel;
	};

	this.getPanel = function() {
		reloadGrid();
		startRefresh();
		return mainPanel;
	};

};