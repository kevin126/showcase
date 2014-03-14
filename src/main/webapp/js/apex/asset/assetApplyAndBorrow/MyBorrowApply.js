Ext.namespace('Apex.asset')
Apex.asset.MyAssetBorrowGrid = function() {
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false
			})
	checkboxSelect.on('selectionchange', handleCheckbox);
	function handleCheckbox() {

	}
	columns = [new Ext.grid.RowNumberer(), checkboxSelect, {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '申请单号',
				dataIndex : 'orderCode',
				align : 'center',
				sortable : true
			}, {
				header : '标题',
				dataIndex : 'title',
				align : 'center',
				sortable : true
			}, {
				header : '申请日期',
				dataIndex : 'applyDate',
				align : 'center',
				sortable : true
			}, {
				header : '借用日期',
				dataIndex : 'rentDate',
				align : 'center',
				sortable : true
			}, {
				header : '归还日期',
				dataIndex : 'backDate',
				align : 'center',
				sortable : true
			}, {
				header : '状态',
				dataIndex : 'state',
				align : 'center',
				sortable : true
			}, {
				header : '创建日期',
				dataIndex : 'createdDate',
				align : 'center',
				sortable : true
			}, {
				header : '更新日期',
				dataIndex : 'updateDate',
				align : 'center',
				sortable : true
			}];
	var record = Ext.data.Record.create([{
				name : 'id'
			}, {
				name : 'orderCode'
			}, {
				name : 'title'
			}, {
				name : 'applyDate'
			}, {
				name : 'rentDate'
			}, {
				name : 'backDate'
			}, {
				name : 'state'
			}, {
				name : 'createdDate'
			}, {
				name : 'updateDate'
			}]);
	var reader = new Ext.data.JsonReader({
				totalProperty : 'DATA_SIZE',
				root : 'DATA_LIST'
			}, record);
	var store = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : ApplyAndBorrowService.getMyRentOrder,
							listeners : {
							'beforeload' : function(dataProxy, params) {
								var userName = USER.getId();
								var loadArgs = [userName, params.start,
										params.limit];
								params[dataProxy.loadArgsKey] = loadArgs;
							}
							}
						}),
				reader : reader
			});
	var pagingBar = new Ext.PagingToolbar({
				pageSize : 20,
				displayInfo : true,
				store : store,
				displayMsg : '显示{0}~{1}条资产，共{2}条资产',
				emptyMsg : '没有任何资产'
			});
	var panel = new Ext.grid.GridPanel({
				id : 'myApplyAssetPanel',
				store : store,
				columns : columns,
				layout : 'fit',
				bbar : pagingBar,
				autoExpandColumn : 4
			});
	loadAsset();
	return panel;
	function loadAsset() {
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