Ext.namespace('Apex.maintenance.knowledge');
Apex.maintenance.knowledge.AlreadyPublishKnowledgeItem = function() {
	var addToSelfBtn = null;
	var delFromSelftBtn = null;
	var viewBtn = null;
	var deleteBtn = null;
	var refreshBtn = null;
	var checkboxSelect = null;
	var knowledgeItemRecord = null;
	var knowledgeItemStore = null;
	var pagingBar = null;
	var mainPanel = createMainPanel();
	this.getPanel = function() {
		return mainPanel;
	};
	function createMainPanel() {
		addToSelfBtn = new Ext.Button({
			text : '注冊到FAQ',
			cls : 'x-btn-text-icon',
			icon : ResourceConstants.ADD_BUTTON_PNG,
			handler : registerFixedKnowledgeItem,
			isPermission : USER.isAble('knowledge_approval'),
			disabled : true,
			minWidth : 80
		});
		delFromSelftBtn = new Ext.Button({
			text : '从FAQ撤销',
			cls : 'x-btn-text-icon',
			icon : 'images/icons/revert.png',
			handler : removeFixedKnowledgeItem,
			isPermission : USER.isAble('knowledge_approval'),
			disabled : true,
			minWidth : 80
		});
		viewBtn =  new Ext.Button({
			text : '查看',
			cls : 'x-btn-text-icon',
			disabled : true,
			icon : ResourceConstants.VIEW_16_PNG,
			handler : viewFixedIncidentItem,
			minWidth : 80
		});
		deleteBtn = new Ext.Button({
					text : '删除',
					cls : 'x-btn-text-icon',
					disabled : true,
					icon : ResourceConstants.DELETE_BUTTON_PNG,
					handler : deleteFixedIncidentItem,
					isPermission : USER.isAble('knowledge_delete'),
					minWidth : 80
				});
		refreshBtn = new Ext.Button({
					text : '刷新',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.REFRESH_BUTTON_PNG,
					handler : loadKnowledgeData,
					minWidth : 80
				});
		var registerSeparator = new Ext.Toolbar.Separator(USER.isAble('knowledge_approval'));
		var unRegisterSeparator = new Ext.Toolbar.Separator(USER.isAble('knowledge_approval'));
		var delSeparator = new Ext.Toolbar.Separator(USER.isAble('knowledge_delete'));
		checkboxSelect = new Ext.grid.CheckboxSelectionModel();
		checkboxSelect.on('selectionchange', handleCheckChange);
		var columns = [new Ext.grid.RowNumberer(), checkboxSelect, {
					header : "Id",
					dataIndex : 'id',
					width : 10,
					hidden : true,
					sortable : true
				}, {
					header : "PId",
					dataIndex : 'procId',
					width : 10,
					hidden : true,
					sortable : true
				}, {
					header : "知识库号",
					dataIndex : 'procKey',
					width : 100,
					sortable : true
				}, {
					header : "标题",
					dataIndex : 'title',
					width : 100,
					sortable : true
				}, {
					header : "关键字",
					dataIndex : 'tags',
					width : 120,
					sortable : true
				},{
					header : "类型",
					dataIndex : 'typeName',
					width : 80,
					sortable : true
				}, {
					header : "创建人",
					dataIndex : 'createUser',
					width : 80,
					sortable : true
				}, {
					header : "创建时间",
					dataIndex : 'createTime',
					width : 120,
					renderer : dateFormat,
					sortable : true
				}, {
					header : "发布人",
					dataIndex : 'handleUser',
					width : 80,
					sortable : true
				}, {
					header : "发布时间",
					dataIndex : 'lastModifyTime',
					width : 120,
					renderer : dateFormat,
					sortable : true
				}, {
					header : "FAQ",
					dataIndex : 'faq',
					width : 80,
					renderer : faqFormat,
					sortable : true
				}];
		 knowledgeItemRecord = Ext.data.Record.create([{
					name : 'id',
					mapping : 'id'
				}, {
					name : 'procId',
					mapping : 'procId'
				}, {
					name : 'procKey',
					mapping : 'procKey'
				}, {
					name : 'procNode',
					mapping : 'procNode'
				}, {
					name : 'createTime',
					mapping : 'createTime'
				}, {
					name : 'createUser',
					mapping : 'createUser'
				}, {
					name : 'typeName',
					mapping : 'typeName'
				}, {
					name : 'title',
					mapping : 'title'
				}, {
					name : 'tags',
					mapping : 'tags'
				}, {
					name : 'handleUser',
					mapping : 'handleUser'
				}, {
					name : 'lastModifyTime',
					mapping : 'lastModifyTime'
				}, {
					name : 'faq',
					mapping : 'faq'
				}, {
					name : 'problemDescription',
					mapping : 'problemDescription'
				}, {
					name : 'resolveMethod',
					mapping : 'resolveMethod'
				}]);
		  var reader = new Ext.data.JsonReader({
					totalProperty : "totalCount",
					root : "knowledgeItemList",
					id : "id"
				}, knowledgeItemRecord);
		 knowledgeItemStore = new Ext.data.Store({
			proxy : new Ext.ux.data.DWRProxy({
						dwrFunction : KnowledgeService.getFixedKnowledgeItems,
						listeners : {
							'beforeload' : function(dataProxy, params) {
								var loadArgs = [params.start, params.limit,
										createQueryConditions()];
								params[dataProxy.loadArgsKey] = loadArgs;
							}
						}
					}),
			reader : reader
		});
		pagingBar = new Ext.PagingToolbar({
					pageSize : 20,
					store : knowledgeItemStore,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条知识库记录，共 {2}条知识库记录',
					emptyMsg : "没有任何知识库记录"
				});
		var resultPanel = new Ext.grid.GridPanel({
					region : "center",
					store : knowledgeItemStore,
					columns : columns,
					sm : checkboxSelect,
					autoScroll : true,
					enableHdMenu : false,
					autoExpandColumn : 6,
					height : 530,
					margins : '5 0 0 0',
					tbar : [addToSelfBtn, registerSeparator, delFromSelftBtn, unRegisterSeparator,viewBtn,'-',deleteBtn,delSeparator, refreshBtn],
					bbar : pagingBar
				});
		loadKnowledgeData();
		return resultPanel;
	}
	
	function loadKnowledgeData(){
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
									msg : "正在加载数据，请稍侯...",
									msgCls : 'ext-el-mask-msg'
								});
		loadMask.show();
		knowledgeItemStore.load({
					params : {
						start : 0,
						limit : 20
					},
					callback : function(){loadMask.hide()}
				});
	}
	
	function createQueryConditions(){
		var conditionsArray = new Array();
		var stausCriteria = {};
		stausCriteria.propertyName = 'procNode';
		stausCriteria.operator = 'EQUAL';
		stausCriteria.valueType = 'STRING_ONLY';
		stausCriteria.value = '已发布';
		conditionsArray.push(stausCriteria);
		return conditionsArray;
	}
	
	function handleCheckChange(checkMode) {
		if (checkMode.getCount() == 0) {
			addToSelfBtn.setDisabled(true);
			delFromSelftBtn.setDisabled(true);
	        deleteBtn.setDisabled(true);
	        viewBtn.setDisabled(true);
		}else if(checkMode.getCount() == 1){
			var selectedRecord = checkboxSelect.getSelected();
			var status = selectedRecord.get('faq');
			if(status == true){
				addToSelfBtn.setDisabled(true);
			    delFromSelftBtn.setDisabled(false);
			}else{
				addToSelfBtn.setDisabled(false);
			    delFromSelftBtn.setDisabled(true);
			}
	        deleteBtn.setDisabled(false);
	        viewBtn.setDisabled(false);
		}else{
			addToSelfBtn.setDisabled(true);
			delFromSelftBtn.setDisabled(true);
	        deleteBtn.setDisabled(false);
	        viewBtn.setDisabled(true);
		}
	}
	
	function registerFixedKnowledgeItem(){
		var selectedRecord = checkboxSelect.getSelected();
		var id = selectedRecord.get('id');
		KnowledgeService.registerFixedKnowledgeItem(id,{
		callback : function(returnValue){
			if(returnValue){
				selectedRecord.set('faq',true);
				addToSelfBtn.setDisabled(true);
				delFromSelftBtn.setDisabled(false);
			}else{
				Ext.Msg.show({
					title : '错误',
					msg : '发生错误或异常，注册失败！',
					modal : true,
					buttons : Ext.Msg.OK,
					icon : Ext.Msg.ERROR
				});
			}
		},
		errorHandler : function(errorString, exception){
				  	Ext.MessageBox.show({
						title : '错误',
						msg : exception.message,
						buttons : Ext.MessageBox.OK,
						fn : loadKnowledgeData,
						icon : Ext.MessageBox.ERROR
					});
			}
		});
	}
	
	function removeFixedKnowledgeItem(){
		var selectedRecord = checkboxSelect.getSelected();
		var id = selectedRecord.get('id');
		KnowledgeService.removeFixedKnowledgeItem(id,{
			callback : function(returnValue){
				if(returnValue){
					selectedRecord.set('faq',false);
					delFromSelftBtn.setDisabled(true);
					addToSelfBtn.setDisabled(false);
				}else{
					Ext.Msg.show({
						title : '错误',
						msg : '发生错误或异常，撤销失败！',
						modal : true,
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.ERROR
					});
				}
			},
			errorHandler : function(errorString, exception){
					  	Ext.MessageBox.show({
							title : '错误',
							msg : exception.message,
							buttons : Ext.MessageBox.OK,
							fn : loadKnowledgeData,
							icon : Ext.MessageBox.ERROR
						});
				}
			});
	}
	function viewFixedIncidentItem(){
		var selectedRecord = checkboxSelect.getSelected();
		var viewPanel = new Apex.maintenance.knowledge.EditKnowledgeItemPanel(selectedRecord);
		viewPanel.showPanel();
	}
	function deleteFixedIncidentItem(){
		var confirmBox = Ext.MessageBox.confirm('确认', '确定要删除所选的知识库项吗？',
			function(value) {
				if (value == 'yes') {
					var ids = new Array();
					var selectedRecords = checkboxSelect.getSelections();
					for(var i=0;i<selectedRecords.length;i++)
						ids.push(selectedRecords[i].get('id'));
					KnowledgeService.deleteFixedKnowledgeItems(ids, function(
									returnValue) {
								if (!returnValue) {
									Ext.Msg.show({
												title : '错误',
												msg : '发生错误或异常，删除失败！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.ERROR
											});
								}else{
									loadKnowledgeData();
								}
							});

				}
			});
		
	}
}