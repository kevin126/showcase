Ext.namespace('Apex.asset')
Apex.asset.MyBorrowedAsset = function() {
	columns = [new Ext.grid.RowNumberer(), {
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
			}, {
				header : '申请日期',
				dataIndex : 'order.sapplyDate',
				align : 'center',
				sortable : true
			}, {
				header : '借用日期',
				dataIndex : 'order.srentDate',
				align : 'center',
				sortable : true
			}, {
				header : '归还日期',
				dataIndex : 'order.sbackDate',
				align : 'center',
				sortable : true
			}, {
				header : '逾期',
				dataIndex : 'late',
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
			}, {
				name : 'order.sapplyDate'
			}, {
				name : 'order.srentDate'
			}, {
				name : 'order.sbackDate'
			}, {
				name : 'late'
			}]);
	var reader = new Ext.data.JsonReader({
				totalProperty : 'DATA_SIZE',
				root : 'DATA_LIST'
			}, record);
	var store = new Ext.data.Store({
				Proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : ApplyAndBorrowService.getMyRentAssert,
							listeners : {
								'beforeLoad' : function(dataProxy, params) {
									var userId=USER.getId();
									var loadArgs = [userId,params.start, params.limit];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			})
	var pagingBar = new Ext.PagingToolbar({
				pageSize : 20,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}~{1}条资产，共{2}条资产',
				emptyMsg : '没有任何资产'
			});
	var panel = new Ext.grid.GridPanel({
				id : 'myBorrowedAssetPanel',
				store : store,
				columns : columns,
				autoExpandColumn : 2,
				layout : 'fit',
				bbar : pagingBar
			})
	function loadAsset() {
		var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : '正在更新数据..',
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
	return panel;
}