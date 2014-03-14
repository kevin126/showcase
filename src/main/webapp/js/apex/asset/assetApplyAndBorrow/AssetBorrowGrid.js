Ext.namespace('Apex.asset')
Apex.asset.AssetBorrowGrid = function() {

	var applicantId = new Ext.form.TextField({
				hidden : true,
				id : 'applicantId'
			})
	var deptIdText = new Ext.form.TextField({
				hidden : true,
				id : 'department'
			})
	var orderCodeText = new Ext.form.TextField({
				id : 'orderCodeText',
				fieldLabel : '工单号',
				maxLength : 50,
				anchor : '90%'
			})

	var applicantText = new Ext.form.TriggerField({
		id : 'applicantText',
		fieldLabel : '申请人',
		readOnly : true,
		onTriggerClick : function() {
			var url = "/itsm/common/userQuery.do?selectOne=1";
		tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
		},
		anchor : '90%'
	})

	var deptText = new Ext.form.TriggerField({
				id : 'deptText',
				fieldLabel : '部门',
				onTriggerClick : selectDept,
				readOnly : true,
				anchor : '90%'
			})
	function selectDept() {
		dealTable(SecurityService.getDeptTree, '选择部门', 'department', 'deptText');
	};

	function selectAssetTypeNode() {
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
						disabled : true,
						handler : function() {
							var treeNode = assetTypeTree.getSelectionModel()
									.getSelectedNode();
							if (treeNode.id == '0')
								return;
							selectNode = treeNode;
							assetTypeName.setValue(treeNode.text);
							assetTypeId = treeNode.id;
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
		assetTypeTree.addListener('click', function(selectNode) {
					if (selectNode.id != '0')
						Ext.getCmp('assetTypeName.yes').setDisabled(false);
					else
						Ext.getCmp('assetTypeName.yes').setDisabled(true);
				})
		treeWindow.show();
	}
	var formPanel = new Ext.form.FormPanel({
		frame : true,
		region : 'north',
		height : 100,
		items : [{
					layout : 'column',
					border : false,
					items : [{
								columnWidth : .33,
								layout : 'form',
								border : false,
								items : [orderCodeText, applicantId, deptIdText]
							}, {
								columnWidth : .33,
								layout : 'form',
								border : false,
								items : [applicantText]
							}, {
								columnWidth : .33,
								layout : 'form',
								border : false,
								items : [deptText]
							}]
				}],
		buttons : [{
					text : '查询',
					formBind : true,
					handler : function() {

					}
				}, {
					text : '清空',
					formBind : true,
					handler : function() {
						orderCodeText.setValue('');
						applicantId.setValue('');
						deptIdText.setValue('');
						applicantText.setValue('');
						deptText.setValue('');
					}
				}],
		buttonAlign : 'center'
	});

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
				header : '借用日期',
				dataIndex : 'srentDate',
				align : 'center',
				sortable : true
			}, {
				header : '归还日期',
				dataIndex : 'sbackDate',
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
				name : 'srentDate'
			}, {
				name : 'sbackDate'
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
	var gridPanel = new Ext.grid.GridPanel({
				id : 'myApplyAssetPanel',
				store : store,
				columns : columns,
				layout : 'fit',
				region:'center',
				bbar : pagingBar,
				autoExpandColumn : 4
			});
	// loadAsset();
	var mainPanel = new Ext.Panel({
				border : false,
				layout : 'border',
				items : [formPanel, gridPanel]
			});
	return mainPanel;

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