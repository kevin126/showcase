Ext.namespace('Apex.asset')
Apex.asset.AssetApplyGrid = function() {
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
				header : '工单号',
				dataIndex : 'orderCode',
				align : 'center',
				sortable : true
			}, {
				header : '标题',
				dataIndex : 'title',
				align : 'center',
				sortable : true
			}, {
				header : '申请人',
				dataIndex : 'applicant.realName',
				align : 'center',
				sortable : true
			}, {
				header : '部门',
				dataIndex : 'applicant.depet.deptName',
				align : 'center',
				sortable : true
			}, {
				header : '申请日期',
				dataIndex : 'sapplyDate',
				align : 'center',
				sortable : true
			}, {
				header : '电话',
				dataIndex : 'applicant.mobile',
				align : 'center',
				sortable : true
			}, {
				header : '邮件地址',
				dataIndex : 'applicant.mail',
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
				name : 'applicant.realName'
			}, {
				name : 'applicant.depet.deptName'
			}, {
				name : 'sapplyDate'
			}, {
				name : 'applicant.mobile'
			}, {
				name : 'applicant.mail'
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
									var userName = null;
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