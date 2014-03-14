
Ext.namespace('Apex.queryAssetIssue');
Apex.queryAssetIssue = function() {
	var pageparams = null;
	this.setPageParams = function(obj){
		pageparams = obj;
	}
	this.getStore = function(){
		return store;
	};
	
	this.getPageParams = function(obj){
		return pageparams ;
	}

    this.getPanel=null;
    this.getPanel = function(){
         return queryResultGrid;		
    }
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();// table中显示checkbox
	
	 
	checkboxSelect.on('selectionchange', function(selModel) {
		var selectedRecords = checkboxSelect.getSelections();
		var assetCodesStr = "";
		var assetTypeStr = ""; 
	 	for(var i=0;i<selectedRecords.length;i++){
			assetCodesStr +=	selectedRecords[i].get('code')+",";
			assetTypeStr  +=	selectedRecords[i].get('type').id+",";	
			pageparams.assetCodes.value = assetCodesStr;
			pageparams.assetTypes.value = assetTypeStr;	
		} 
	}); 
		
		
	var reader = new Ext.data.JsonReader({
				totalProperty : "totalCount",
				root : "assetItemList",
				id : "id",
				fields : [{
							name : 'id'
						}, {
							name : 'name'
						}, {
							name : 'code'
						}, {
							name : 'type.name'
						}, {
							name : 'price'
						}, {
							name : 'purchaseDate'
						}, {
							name : 'warranty'
						}, {
							name : 'assetSupplierName'
						}, {
							name : 'assetContractCode'
						}, {
							name : 'status'
						}, {
							name : 'position'
						},{
							name:'type'
						}]
			});
	 var store = new Ext.data.Store({
				storeId : 'AssetsQueryResultPanel_store_id',
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : CreateFormService.queryAssetLists,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var starttime = pageparams.starttime.value;
									var endtime = pageparams.endtime.value;
									var assetName = pageparams.assetName.value;
									var assetCode = pageparams.assetCode.value;
									var AssetContractId = pageparams.AssetContractId.value;
									var AssetSupplierId = pageparams.AssetSupplierId.value;
									var AssetsStatus = pageparams.AssetsStatus.value;
									var AssetTypeId = pageparams.AssetTypeId.value;

									var loadArgs = [params.start, params.limit,
											starttime, endtime, assetName,
											assetCode, AssetContractId,
											AssetSupplierId, AssetsStatus,
											AssetTypeId];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});
	store.setDefaultSort('id', 'asc');

	var columns = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
		checkboxSelect, {
			header : "索引号",
			dataIndex : 'id',
			width : 5,
			hidden : true,
			sortable : true
		}, {
			header : "资产名称",
			sortable : true,
			dataIndex : 'name'
		}, {
			header : "资产编号",
			sortable : true,
			dataIndex : 'code'
		}, {
			header : "资产类型",
			sortable : true,
			dataIndex : 'type.name'
		}, {
			header : "价格",
			sortable : true,
			dataIndex : 'price',
			align : 'center'
		}, {
			header : "购买日期",
			sortable : true,
			renderer : dateFormatSimple,
			dataIndex : 'purchaseDate',
			align : 'center'

		}, {
			header : "保修期",
			sortable : true,
			renderer : dateFormatSimple,
			dataIndex : 'warranty',
			align : 'center'

		}, {
			header : "供应商",
			sortable : true,
			dataIndex : 'supplierName',
			align : 'center'

		}, {
			header : "合同编号",
			sortable : true,
			dataIndex : 'contractCode',
			align : 'center'

		},{
			header : "位置",
			sortable : true,
			dataIndex : 'position',
			align : 'center'

		}]);
	
	var pagingBar = new Ext.PagingToolbar({
			storeId : 'AssetsQueryResultPanel_store_id',
			pageSize : ApexConstants.PAGE_SIZE,
			store : store,
			// displayInfo : true,
			displayMsg : '显示记录 {0} - {1} 共 {2} 条记录',
			emptyMsg : "无记录"
		});
	var queryResultGrid = new Ext.grid.GridPanel({
			id : 'assetQueryResultPanel',
			autoScroll : true, 
			region:'center',
			store : store, 
			autoScroll : true,
			// loadMask : '正在加载数据，请稍候...',
			enableHdMenu : false,
			border : false,
			width : 500,
		    height : 200,
	    	tbar : [],
			bbar : pagingBar,
			cm : columns,
			sm : checkboxSelect	
			
		});
			
 

		
	this.exactQueryAssets  = function ExactQueryAssets(storeObj) {
			var my_Mask = new Ext.LoadMask(Ext.getBody(), {
							msg : "数据处理中，请稍后..."
						});
				my_Mask.show();
				storeObj.load({
							params : {
								start : 0,
								limit : 20
							},
							callback : function() {							 
								my_Mask.hide();
							}
						});
			}

	 
	this.selectType = function selectAssetTypeNode(nameEle,idEle) {
		var assetTypeTree = new Apex.asset.AssetTypeTreePanel();
		var treeWindow = new Ext.Window({
					id : 'assetTypeName.treeWindow',
					title : '选择资产类型',
					closable : false,
					resizable : false,
					border : false,
					plain : true,
					width : 250,
					height : 400,
					modal : true,
					items : [assetTypeTree],
					buttons : [{
						id : 'assetTypeName.yes',
						text : '确定',
						// disabled : true,
						handler : function() {
							var treeNode = assetTypeTree.getSelectionModel()
									.getSelectedNode();
							if (treeNode && treeNode.id == '0'){
								return;
							}
							selectNode = treeNode;
							nameEle.value = treeNode.text;
							idEle.value = treeNode.id;
							treeWindow.close();
						}
					}, {
						text : '取消',
						handler : function() {
							treeWindow.close();
						}
					}],
					buttonAlign : 'center'
				})
				
		assetTypeTree.addListener('clcik', function(selectNode) {
					if (selectNode.id != '0')
						Ext.getCmp('assetTypeName.yes').setDisabled(false);
					else
						Ext.getCmp('assetTypeName.yes').setDisabled(true);
				})
				
		treeWindow.show();
	}
	var assetsStatusStore = new Ext.data.SimpleStore({
				fields : ['status', 'state'],
				data : [['库存中', 'status_store'], ['使用中', 'status_use'],
						['借调中', 'status_borrow'], ['维修中', 'status_fix'],
						['报废', 'status_scrap']]
			});
			
	this.contractCodeTree= function showContractCodeTree(nameEle,idEle) {
		var contractCodeTree = new Apex.asset.AssetContractTreePanel();
		var treeWindow = new Ext.Window({
					id : 'contractCode.treeWindow',
					title : '选择合同',
					closable : false,
					border : false,
					plain : true,
					width : 250,
					height : 400,
					resizable : false,
					modal : true,
					items : [contractCodeTree],
					buttons : [{
						id : 'contractCode.yes',
						text : '确定',
						disabled : true,
						handler : function() {
							var treeNode = contractCodeTree.getSelectionModel()
									.getSelectedNode();
							if (treeNode.text == '合同编号') {
								return;
							}
							selectNode = treeNode;
							nameEle.value = treeNode.text;
							idEle.value = treeNode.id;
							//contractCode.setValue(treeNode.text);
							//assetContractId = treeNode.id;
							treeWindow.close();
						}
					}, {
						text : '取消',
						handler : function() {
							treeWindow.close();
						}
					}],
					buttonAlign : 'center'
				});
		contractCodeTree.addListener('click', function(selectNode) {
					if (selectNode.id != '0')
						Ext.getCmp('contractCode.yes').setDisabled(false);
					else
						Ext.getCmp('contractCode.yes').setDisabled(true);
				});
		treeWindow.show();
	}
	
	this.selectSupplierTree = function selectSupplierNode(nameEle,idEle) {
		var supplierTree = new Apex.asset.AssetSupplierTreePanel();
		var treeWindow = new Ext.Window({
					id : 'supplierName.treeWindow',
					title : '选择供应商',
					closable : false,
					border : false,
					plain : true,
					width : 250,
					height : 400,
					resizable : false,
					modal : true,
					items : [supplierTree],
					buttons : [{
						id : 'supplierName.yes',
						text : '确定',
						disabled : true,
						handler : function() {
							var treeNode = supplierTree.getSelectionModel()
									.getSelectedNode();
							if (treeNode.text == '供应商')
								return;
							selectNode = treeNode;
							nameEle.value = treeNode.text;
							idEle.value = treeNode.id;
							treeWindow.close();
						}
					}, {
						text : '取消',
						handler : function() {
							treeWindow.close();
						}

					}],
					buttonAlign : 'center'
				})
		supplierTree.addListener('click', function(selectNode) {
					if (selectNode.id != '0')
						Ext.getCmp('supplierName.yes').setDisabled(false);
					else
						Ext.getCmp('supplierName.yes').setDisabled(true);
				})
		treeWindow.show();
	}
	 
}


