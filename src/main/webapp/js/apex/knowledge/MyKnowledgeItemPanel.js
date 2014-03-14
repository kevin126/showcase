Ext.namespace('Apex.maintenance.knowledge');

Apex.maintenance.knowledge.MyKnowledgeItemPanel = function(status) {
	this.status = status;
	var ptitle = "";
	var editBtn = null;
	var viewBtn = null; 
	var deleteBtn = null;
	var refreshBtn = null;
	var checkboxSelect = null;
	var knowledgeItemRecord = null;
	var knowledgeItemStore = null;
	var pagingBar = null;
	var loadConditions = null;
	var itemPanel = null;
	if(status == 'myDraft_knowledgeNode'){//草稿
		ptitle = "草稿";
	}
	if(status == 'myApproving_knowledgeNode'){//审核中
		ptitle = "审核中";
	}
	if(status == 'myRejected_knowledgeNode'){//已退回
		ptitle = "已退回";
	}
	if(status == 'myPublished_knowledgeNode'){//已发布
		ptitle = "已发布";
	}
	
	
	var unRegisterFixedBtn = null;
	var registerFixedBtn = null;
	
	this.getPanel = function(){
		itemPanel = createKnowledgeItemPanel();
		return itemPanel;
	}
	this.loadData = function(){
		loadConditions = new Array();
		var userCriteria = {};
		userCriteria.propertyName = 'createUser.name';
		userCriteria.operator = 'EQUAL';
		userCriteria.valueType = 'STRING_ONLY';
		userCriteria.value = USER.getUserName();
		loadConditions.push(userCriteria);
		var stausCriteria = {};
		stausCriteria.propertyName = 'state';
		stausCriteria.operator = 'EQUAL';
		stausCriteria.valueType = 'STRING_ONLY';
		if(status == 'myDraft_knowledgeNode'){//草稿
			stausCriteria.value = 'kno_state_draft';
			loadConditions.push(stausCriteria);
		}
		if(status == 'myApproving_knowledgeNode'){//审核中
			stausCriteria.value = 'kno_state_audit';
			loadConditions.push(stausCriteria);
			ptitle = "审核中";
		}
		if(status == 'myRejected_knowledgeNode'){//已退回
			stausCriteria.value = 'kno_state_rejected';
			loadConditions.push(stausCriteria);
			ptitle = "已退回";
		}
		if(status == 'myPublished_knowledgeNode'){//已发布
			stausCriteria.value = 'kno_state_end';
			loadConditions.push(stausCriteria);
			ptitle = "已发布";
		}
	    doChangeColumns();
		refreshKnowledgeItems();
	}
	function createKnowledgeItemPanel(){
		editBtn = new Ext.Button({
			text : '修改',
			cls : 'x-btn-text-icon',
			icon : ResourceConstants.EDIT_BUTTON_PNG,
			handler : editFixedKnowledgeItem,
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
		
		registerFixedBtn =  new Ext.Button({
			text : '注册到自助服务台',
			cls : 'x-btn-text-icon',
			disabled : true,
			icon : ResourceConstants.VIEW_16_PNG,
			handler : registerFixedKnowledgeItem,
			minWidth : 80
		});
		
		unRegisterFixedBtn =  new Ext.Button({
			text : '从自助服务台撤回',
			cls : 'x-btn-text-icon',
			disabled : true,
			icon : ResourceConstants.VIEW_16_PNG,
			handler : unRegisterFixedKnowledgeItem,
			minWidth : 80
		});
		 
		deleteBtn = new Ext.Button({
					text : '删除',
					cls : 'x-btn-text-icon',
					disabled : true,
					icon : ResourceConstants.DELETE_BUTTON_PNG,
					handler : deleteFixedIncidentItem,
					minWidth : 80
				});
		refreshBtn = new Ext.Button({
					text : '刷新',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.REFRESH_BUTTON_PNG,
					handler : refreshKnowledgeItems,
					minWidth : 80
				});
		if(status == 'myDraft_knowledgeNode' || status == 'myRejected_knowledgeNode'){// 草稿 	 已退回
			checkboxSelect = new Ext.grid.CheckboxSelectionModel();
		}else{
			checkboxSelect = new Ext.grid.CheckboxSelectionModel({
					singleSelect : true
			});
		}
		checkboxSelect.on('selectionchange',handleCheckChange);
		var columns = [new Ext.grid.RowNumberer(), checkboxSelect, {
					header : "Id",
					dataIndex : 'id',
					width : 10,
					hidden : true,
					sortable : true
				}, {
					header : "知识库编号",
					dataIndex : 'knowledgeID',
					width : 100,
					renderer:function (data){ 					
						return "<a href='"+mainpath+"knowledge/knowledgeDetail.do?to=detail&method=detail&id="+arguments[2].data.id+"' >"+data+"</a>";
					},
					sortable : true
				}, {
					header : "标题",
					dataIndex : 'title',
					width : 320,
					renderer:function (data){ 	
						return "<a href='"+mainpath+"knowledge/knowledgeDetail.do?to=detail&method=detail&id="+arguments[2].data.id+"' >"+Ext.util.Format.htmlEncode(data)+"</a>";
					},
					sortable : true
				}, {
					header : "类型",
					dataIndex : 'knowledgeType',
					renderer : function(data){
						 if(data) {return Ext.util.Format.htmlEncode(data.typeName)}else{return '';}
					},
					width : 50,
					sortable : true
				},{
					header : "阅读次数",
					dataIndex : 'readCount',
					width : 20,
					sortable : true
				}, {
					header : "创建时间",
					renderer : dateFormatSimple,
					dataIndex : 'createTime',
					width : 120,
					renderer : dateFormat,
					sortable : true
				} ,{
					header : "更新时间",
					renderer : dateFormatSimple,
					dataIndex : 'lastUpdateTime',
					width : 120,
					sortable : true
				},{
					header : " ",
					dataIndex : 'openToSSD',
					width : 50,
					hidden : true,
					renderer:function (data,metadata){ 
						 if(data){
								metadata.attr = 'style="background-image: url(/itsm/images/unlock.gif);padding-left:17px;background-repeat:no-repeat;"';
								return '开放';
						}else{
							metadata.attr = 'style="background-image: url(/itsm/images/lock.gif);padding-left:17px;background-repeat:no-repeat;"';
							return '不开放';
						}					
					},
					sortable : false
				}];
		 knowledgeItemRecord = Ext.data.Record.create([{
					name : 'id',
					mapping : 'id'
				}, {
					name : 'knowledgeID',
					mapping : 'knowledgeID'
				}, {
					name : 'jbpmProcessInstanceId',
					mapping : 'jbpmProcessInstanceId'
				}, {
					name : 'title',
					mapping : 'title'
				}, {
					name : 'problemDescription',
					mapping : 'problemDescription'
				}, {
					name : 'resolveMethod',
					mapping : 'resolveMethod'
				}, {
					name : 'knowledgeType',
					mapping : 'knowledgeType'
				}, {
					name : 'readCount',
					mapping : 'readCount'
				}, {
					name : 'openToSSD',
					mapping : 'openToSSD'
				}, {
					name : 'state',
					mapping : 'state'
				}, {
					name : 'createUser',
					mapping : 'createUser'
				}, {
					name : 'createTime',
					mapping : 'createTime'
				}, {
					name : 'lastUpdateTime',
					mapping : 'lastUpdateTime'
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
								var loadArgs = [params.start, params.limit, loadConditions];
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
		var tbarArray = new Array();
		if( status == 'myDraft_knowledgeNode'){//status == '草稿' 
			tbarArray.push(editBtn);
			tbarArray.push('-');  
			tbarArray.push(deleteBtn);
		}else if(status == 'myCreate_knowledgeNode' ){//status == '我的知识库'  
		}else if(status == 'myRejected_knowledgeNode'){//  status == '已退回'
		}else if(status == 'myApproving_knowledgeNode'){//status == '审核中'
		}else if(status == 'myPublished_knowledgeNode'){//status == '已发布'
			//tbarArray.push(registerFixedBtn);
			//tbarArray.push('-');
			//tbarArray.push(unRegisterFixedBtn);
		}
		tbarArray.push(refreshBtn);
		var resultPanel = new Ext.grid.GridPanel({
					region : "center",
					title: ptitle,
					store : knowledgeItemStore,
					columns : columns,
					sm : checkboxSelect,
					autoScroll : true,
					border : false,
					enableHdMenu : false,
					autoExpandColumn : 4,
					height : 580,
					margins : '155 5 5 0',
					tbar : tbarArray,
					bbar : pagingBar
				});
		return resultPanel;
	}
	
	function loadKnowledgeData(){
		knowledgeItemStore.load({
					params : {
						start : 0,
						limit : 20
					}
				});
	}
	
	function handleCheckChange(checkMode) {
		if (checkMode.getCount() == 0) {
			editBtn.setDisabled(true); 
	        deleteBtn.setDisabled(true);
	        viewBtn.setDisabled(true);
	        registerFixedBtn.setDisabled(true);
	        unRegisterFixedBtn.setDisabled(true);
		}else if(checkMode.getCount() == 1){
			var selectedRecord = checkMode.getSelected();			 
			deleteBtn.setDisabled(false);
			editBtn.setDisabled(false);
			viewBtn.setDisabled(false);	
			//alert(selectedRecord.data.openToSSD);		
			registerFixedBtn.setDisabled(selectedRecord.data.openToSSD);			
	        unRegisterFixedBtn.setDisabled(!selectedRecord.data.openToSSD);
		}else{
			viewBtn.setDisabled(true);
			editBtn.setDisabled(true); 
	        deleteBtn.setDisabled(false);
	        registerFixedBtn.setDisabled(true);	        
	        unRegisterFixedBtn.setDisabled(true);
		}
	}
	
	function doChangeColumns(){
		var clmnMdl = itemPanel.getColumnModel();
		if(status == 'myCreate_knowledgeNode'){//status == '我的知识库'	
			clmnMdl.setHidden(1, true);
			clmnMdl.setHidden(3, true);
			clmnMdl.setHidden(6, true);
			clmnMdl.setHidden(7, true);			
			clmnMdl.setHidden(8, true);
		}else if(status == 'myDraft_knowledgeNode'){//status == '草稿'	
			clmnMdl.setHidden(1, false);
			clmnMdl.setHidden(3, false);
			clmnMdl.setHidden(6, true);
			clmnMdl.setHidden(7, true);			
			clmnMdl.setHidden(8, true);
		}else if(status == 'myApproving_knowledgeNode'
					||status == 'myRejected_knowledgeNode'){//status == '审核中'||status == '已退回'
			clmnMdl.setHidden(1, true);
			clmnMdl.setHidden(3, false);
			clmnMdl.setHidden(6, true);
			clmnMdl.setHidden(7, true);
			clmnMdl.setHidden(8, true);
		}else if(status == 'myPublished_knowledgeNode'){//status == '已发布'
			clmnMdl.setHidden(1, true);
			clmnMdl.setHidden(3, false);
			clmnMdl.setHidden(6, false);
			clmnMdl.setHidden(7, false);
			clmnMdl.setHidden(9, false);
		}
	}
	
	function editFixedKnowledgeItem(){
		var selectedRecord = checkboxSelect.getSelected();		 
		var state = selectedRecord.data.state ;
		var id 	  = selectedRecord.data.id ;
		window.location.href = mainpath + "knowledge/knowledgeDetail.do?state="+state+"&oper=update&method=toupdate&to=toupdate&id="+id;
		
	}
	
	function viewFixedIncidentItem(){
		var selectedRecord = checkboxSelect.getSelected();
		var viewPanel = new Apex.maintenance.knowledge.EditKnowledgeItemPanel(selectedRecord);
		viewPanel.showPanel();
	}
	
	//注册到自主服务台
	function registerFixedKnowledgeItem(){
		var confirmBox = Ext.MessageBox.confirm('确认', '确定要将所选的知识库项注册到自助服务台吗？',function(value){
			if (value == 'yes') {
				var selectedRecords = checkboxSelect.getSelections();
				var ids = new Array();
				for(var i=0;i<selectedRecords.length;i++){
					ids.push(selectedRecords[i].get('id'));
				}
				var viewPanel = KnowledgeService.registerFixedKnowledgeItem(ids[0],function(returnValue){
					if ("error"==returnValue) {
							Ext.Msg.show({
										title : '错误',
										msg : '发生错误或异常，注册失败！',
										modal : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});
					}else if ("deleted"==returnValue) {
							Ext.Msg.show({
										title : '错误',
										msg : '对不起，您操作的知识库不存在，可能已经被其他人删除，请联系管理员！',
										modal : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});
					} 					
					refreshKnowledgeItems();
				});
			}	
		})
	}
	
	//从自主服务台撤回
	function unRegisterFixedKnowledgeItem(){
		var confirmBox = Ext.MessageBox.confirm('确认', '确定要将所选的知识库项从自助服务台撤回吗？',function(value){
			if (value == 'yes') {
				var selectedRecords = checkboxSelect.getSelections();
				var ids = new Array();
				for(var i=0;i<selectedRecords.length;i++){
					ids.push(selectedRecords[i].get('id'));
				}
				var viewPanel = KnowledgeService.removeFixedKnowledgeItem(ids[0],function(returnValue){
					if ("error"==returnValue) {
							Ext.Msg.show({
										title : '错误',
										msg : '发生错误或异常，撤回失败！',
										modal : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});
					}else if ("deleted"==returnValue) {
							Ext.Msg.show({
										title : '错误',
										msg : '对不起，您操作的知识库不存在，可能已经被其他人删除，请联系管理员！',
										modal : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});
						 
					} 
					refreshKnowledgeItems();
					 				
				});
			}	
		})
	}
	
	function deleteFixedIncidentItem(){
		var confirmBox = Ext.MessageBox.confirm('确认', '确定要删除所选的知识库项吗？',
			function(value) {
				if (value == 'yes') {
					var selectedRecords = checkboxSelect.getSelections();
					if(status == 'myPublished_knowledgeNode'){
							//||status == 'myDraft_knowledgeNode'){//status == '已发布'||status == '草稿'
						var ids = new Array();
						for(var i=0;i<selectedRecords.length;i++)
							ids.push(selectedRecords[i].get('id'));
						KnowledgeService.deleteFixedKnowledgeItems(ids, function(
									returnValue) {
								if (returnValue=='error') {
									Ext.Msg.show({
												title : '错误',
												msg : '发生错误或异常，删除失败！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.ERROR
											});
								}else if (returnValue=='yes'){
								}else if (returnValue=='deleted'){
									Ext.Msg.show({
												title : '错误',
												msg : '对不起，您操作的知识库不存在，可能已经被其他人删除，请联系管理员！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.ERROR
											});
								}else {
									returnValue.split(",");
									Ext.Msg.show({
												title : '错误',
												msg : '您删除的知识库中,有'+returnValue+'条知识库已经被其他用户删除！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.ERROR
											});
								}
								refreshKnowledgeItems();
							});
					}else{
						var procIds = new Array();
						for(var i=0;i<selectedRecords.length;i++)
						procIds.push(selectedRecords[i].get('id'));
						KnowledgeService.deleteUnPublishedKnowledgeItems(procIds, {
							callback : function(
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
											refreshKnowledgeItems();
										}
									},
							errorHandler : function(errorString, exception){
									  	Ext.MessageBox.show({
											title : '错误',
											msg : exception.message,
											buttons : Ext.MessageBox.OK,
											fn : function(){refreshKnowledgeItems()},
											icon : Ext.MessageBox.ERROR
										});
								}
							});
						
					}
				}
			});
	}
	
	function refreshKnowledgeItems(){
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
			callback : function(){loadMask.hide();}
	    });
	}
}

/*
待审核知识库   waitApprove_knowledgeNode

我的知识库	myCreate_knowledgeNode
草稿  		myDraft_knowledgeNode
审核中		myApproving_knowledgeNode
已退回		myRejected_knowledgeNode
已发布		myPublished_knowledgeNode
创建知识库	create_knowledgeNode

配置知识库类型  configType_knowledgeNode
*/