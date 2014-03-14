Ext.namespace('Apex.asset')
Apex.asset.MyUsedAsset = function() {

	this.getPanel = function() {
		return mainPanel;
	}
	var columns = [new Ext.grid.RowNumberer(), {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '资产名称',
				dataIndex : 'assetName',
				align : 'center',
				sortable : true
			}, {
				header : '资产编号',
				dataIndex : 'assetCode',
				align : 'center',
				sortable : true
			}, {
				header : '类型',
				dataIndex : 'assetType',
				align : 'center',
				sortable : true
			}];
	var record = Ext.data.Record.create([{
				name : 'id'
			}, {
				name : 'assetName'
			}, {
				name : 'assetCode'
			}, {
				name : 'assetType'
			}]);
	var reader = new Ext.data.JsonReader({
				totalProperty : 'DATA_SIZE',
				root : 'DATA_LIST'
			}, record);
	var store = new Ext.data.Store({
		proxy : new Ext.ux.data.DWRProxy({
					dwrFunction : ApplyAndBorrowService.getMyUseAssert,
					listeners : {
						'beforeLoad' : function(dataProxy, params) {
							var userId = USER.getId();
							var loadArgs = [userId, params.start, params.limit];
							params[dataProxy.loadArgsKey] = loadArgs;
						}
					}
				}),
		reader : reader
	});
	var pagingBar = new Ext.PagingToolbar({
				pageSize : 20,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}~{1}条资产，共{2}条资产',
				emptyMsg : '没有任何资产'
			});
	function createMainPanel() {
		var panel = new Ext.grid.GridPanel({
					id : 'myUsedAssetPanel',
					store : store,
					layout : 'fit',
					columns : columns,
					bbar : pagingBar,
					autoExpandColumn : 2
				})
		// loadData();
		return panel;
	}

	var mainPanel = createMainPanel();
	function loadData() {
		var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : '正在加载数据..',
					msgCls : 'ext-el-mask-msg'
				});
		myMask.show();
		store.load({
					params : {
						start : 0,
						limit : 20
					},
					callback : function() {
						myMask.hide();
					}
				})
	}

}