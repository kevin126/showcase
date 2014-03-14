Ext.namespace('Apex.maintenance.knowledge');
Apex.maintenance.knowledge.WaitApproveKnowledgeItem = function() {
	var passBtn = null;
	var rejectBtn = null;
	var viewBtn = null;
	var refreshBtn = null;
	var checkboxSelect = null;
	var knowledgeItemRecord = null;
	var knowledgeItemStore = null;
	var pagingBar = null;
	var mainPanel = createMainPanel();
	this.getPanel = function() { 
		return mainPanel;
	};
	this.loadData = function(){
		loadKnowledgeData();
	}
	
	 var getStateStr=function(state){
		return Status_I18N[state] ;
	}
	function createMainPanel() {
		passBtn = new Ext.Button({
			text : '发布',
			cls : 'x-btn-text-icon',
			icon : ResourceConstants.ADD_BUTTON_PNG,
			isPermission : USER.isAble('knowledge_approval'),
			handler : publishFixedKnowledgeItem,
			disabled : true,
			minWidth : 80
		});
		rejectBtn = new Ext.Button({
			text : '退回',
			cls : 'x-btn-text-icon',
			icon : 'images/icons/redo-16.png',
			isPermission : USER.isAble('knowledge_approval'),
			handler : rejectFixedKnowledgeItem,
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
		refreshBtn = new Ext.Button({
					text : '刷新',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.REFRESH_BUTTON_PNG,
					handler : refreshKnowledgeItems,
					minWidth : 80
				});
		checkboxSelect = new Ext.grid.CheckboxSelectionModel({
					singleSelect : true
				});
		checkboxSelect.on('selectionchange', handleCheckChange);
		var columns = [new Ext.grid.RowNumberer(),   {
					header : "Id",
					dataIndex : 'id',
					
					hidden : true,
					sortable : true
				}, {
					header : "知识库编号",
					dataIndex : 'knowledgeID', 
					renderer:function (data){ 					
						return "<a href='"+mainpath+"/knowledge/knowledgeDetail.do?to=detail&method=detail&id="+arguments[2].data.id+"' >"+data+"</a>";
					},
					sortable : true
				}, {
					header : "标题",
					dataIndex : 'title', 
					renderer:function (data){ 					
						return "<a href='"+mainpath+"/knowledge/knowledgeDetail.do?to=detail&method=detail&id="+arguments[2].data.id+"' >"+Ext.util.Format.htmlEncode(data)+"</a>";
					},
					sortable : true
				}, {
					header : "类型",
					dataIndex : 'knowledgeType',
					renderer : function(data){if(data)return Ext.util.Format.htmlEncode(data.typeName)}, 
					sortable : true
				}, {
					header : "创建人",
					dataIndex : 'createUser',
					width : 100,
					renderer:function (data){ 					
						if(data){
							return data.realName;
						}
					},
					sortable : true
				},{
					header : "状态",
					dataIndex : 'state',					
					renderer:function (data){ return getStateStr(data);},
					sortable : false
				},{
					header : "更新时间",
					renderer : dateFormatSimple,
					dataIndex : 'lastUpdateTime', 
					sortable : true
				}];
		 knowledgeItemRecord = Ext.data.Record.create([{
					name : 'id',
					mapping : 'id'
				}
				, {
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
								var loadArgs = [params.start, params.limit,
										createQueryConditions()];
								params[dataProxy.loadArgsKey] = loadArgs;
							}
						}
					}),
			reader : reader
		});
		pagingBar = new Ext.PagingToolbar({
			        id : 'waitApproveKnowledgePagingBar',
					pageSize : 20,
					store : knowledgeItemStore,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条知识库记录，共 {2}条知识库记录',
					emptyMsg : "没有任何知识库记录"
				});
		var tbarArray = new Array();
		tbarArray.push(refreshBtn);
		var resultPanel = new Ext.grid.GridPanel({
					id : 'waitApproveKnowledgeItemTable',
					region : "center",
					store : knowledgeItemStore,
					columns : columns,
					sm : checkboxSelect,
					autoScroll : true,
					border : false,
					enableHdMenu : false,
					autoExpandColumn : 3,
					height : 580,
					margins : '5 0 0 0',
					tbar : tbarArray,
					bbar : pagingBar
				});
//		loadKnowledgeData();
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
	
	function handleCheckChange(checkMode) {
		if (checkMode.getCount() == 0) {
			passBtn.setDisabled(true);
			rejectBtn.setDisabled(true);
			viewBtn.setDisabled(true);
		}else if(checkMode.getCount() == 1){
			passBtn.setDisabled(false);
			rejectBtn.setDisabled(false);
			viewBtn.setDisabled(false);
		}else{
			passBtn.setDisabled(true);
			rejectBtn.setDisabled(true);
			viewBtn.setDisabled(true);
		}
	}
	
	function createQueryConditions(){
	
		var conditionsArray = new Array();
		var stausCriteria = {};
		stausCriteria.propertyName = 'state';
		stausCriteria.operator = 'EQUAL';
		stausCriteria.valueType = 'STRING_ONLY';	
		stausCriteria.value = 'kno_state_audit';//USER.userName;
		conditionsArray.push(stausCriteria);
		return conditionsArray;
	}
	
	function publishFixedKnowledgeItem(){
		var selectedRecord = checkboxSelect.getSelected();
		var procId = selectedRecord.get('procId');
		var userName = USER.getUserName();
		KnowledgeService.publishFixedKnowledgeItem(userName,procId,{
			callback : function(returnValue){
				if(returnValue){
						knowledgeItemStore.remove(selectedRecord);		
				}else{
			    	Ext.Msg.show({
						title : '错误',
						msg : '发生错误或异常，发布失败！',
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
						fn : function(){loadKnowledgeData()},
						icon : Ext.MessageBox.ERROR
					});
			}
		})
	}
	
	function rejectFixedKnowledgeItem(){
		var textArea = new Ext.form.TextArea({
			fieldLabel : '退回原因',
			width : 470,
			allowBlank : false,
			minLength : 10,
			maxLength : 20000,
			height : 300
		});
		var winCofig = {
			title : '退回',
			height : 400,
			width : 500
		};	
		var prompt = new Apex.common.ItsmPrompt(textArea,function(inputContent){
			var selectedRecord = checkboxSelect.getSelected();
			var procId = selectedRecord.get('procId');
			var userName = USER.getUserName();
			KnowledgeService.rejectFixedKnowledgeItem(userName,procId,inputContent,{
					callback : function(returnValue){
						if(returnValue){
								prompt.close();
								knowledgeItemStore.remove(selectedRecord);		
						}else{
					    	Ext.Msg.show({
								title : '错误',
								msg : '发生错误或异常，退回失败！',
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
							fn : function(){prompt.close();loadKnowledgeData()},
							icon : Ext.MessageBox.ERROR
						});
				}
			});
		},winCofig);
	}
	
	function viewFixedIncidentItem(){
		var selectedRecord = checkboxSelect.getSelected();
		var viewPanel = new Apex.maintenance.knowledge.EditKnowledgeItemPanel(selectedRecord);
		viewPanel.showPanel();
	}
	function refreshKnowledgeItems(){
		loadKnowledgeData();
	}
}