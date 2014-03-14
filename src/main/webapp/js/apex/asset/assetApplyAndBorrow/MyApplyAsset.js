Ext.namespace('Apex.asset')
Apex.asset.MyApplyAsset = function() {

	var delBtn = new Ext.Button({
				text : '删除',
				cls : 'x-btn-text-icon',
				disabled : true,
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				handler : deleteData
			})
	var editBtn = new Ext.Button({
				text : '编辑',
				cls : 'x-btn-text-icon',
				disabled : true,
				icon : ResourceConstants.EDIT_BUTTON_PNG,
				handler : editData
			})
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false
			})
	checkboxSelect.on('selectionchange', handleCheckbox);

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
				dataIndex : 'sapplyDate',
				align : 'center',
				sortable : true
			}, {
				header : '状态',
				dataIndex : 'state',
				align : 'center',
				sortable : true
			}, {
				header : '创建日期',
				dataIndex : 'screatedDate',
				align : 'center',
				sortable : true
			}, {
				header : '更新日期',
				dataIndex : 'supdateDate',
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
				name : 'sapplyDate'
			}, {
				name : 'state'
			}, {
				name : 'screatedDate'
			}, {
				name : 'supdateDate'
			}]);
	var reader = new Ext.data.JsonReader({
				totalProperty : 'DATA_SIZE',
				root : 'DATA_LIST'
			}, record);
	var store = new Ext.data.Store({
		proxy : new Ext.ux.data.DWRProxy({
					dwrFunction : ApplyAndBorrowService.getMyRfaOrder,
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
				autoExpandColumn : 4,
				tbar : [editBtn, '-', delBtn]
			});

	return panel;

	function deleteData() {

	}

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

	function editData() {

	}
	function handleCheckbox(checkMode) {
		if (checkMode = 0) {
			delBtn.setDisabled(true);
			editBtn.setDisabled(true);
		} else if (checkMode = 1) {
			delBtn.setDisabled(false);
			editBtn.setDisabled(false);
		} else if (checkMode > 1) {
			delBtn.setDisabled(false);
			editBtn.setDisabled(true);
		}
	}
}