Ext.namespace('Apex.maintenance.knowledge');
Apex.maintenance.knowledge.KnowledgeListPanel = function() {
	var typetree= null;	
	var queryResultPanel = null;
	var checkboxSelect = null;
	var knowledgeItemRecord = null;
	var knowledgeItemStore = null;
	var delBtn = null;
	var viewBtn = null;
	var typeTree = null;
	var titleText = null;
	var tagText = null;
	var typeTrigger = null;
	var mainPanel = createMainPanel();
	var selectedTypeId  = null;
	this.getPanel = function(){
		return mainPanel;
	}	
	function createMainPanel(){
		typetree = createTypeTree();  
		queryResultPanel = createQueryResultPanel(); 
		
		var innerWidth;
		if (window.innerWidth) {
			innerWidth = window.innerWidth;
		} else {
			innerWidth = document.body.clientWidth;
		}
	
		var innerHeight;
		if (window.innerHeight) {
			innerHeight = window.innerHeight;
		} else {
			innerHeight = document.body.clientHeight;
		}
		
		var panel = new Ext.Panel({
					labelWidth : 70,
					layout : 'border',
					border : false,
					width: innerWidth,
					height: innerHeight - 218,
					renderTo : 'mainBodyDiv',
					hideMode: 'offsets',
					items : [typetree, queryResultPanel]
				});
		return panel;
	}
	
	function createTypeTree(){	 
		var rootNode = new Ext.tree.AsyncTreeNode({
				text : '',
			    id : '0',
			    hasChildren : true,			    
			    expanded : true
			});
		treeLoader =  new Ext.ux.DWRTreeLoader({
				dwrCall : KnowledgeService.getKnowledgeTypeTree
			});
		var panel = new Ext.tree.TreePanel({
					title:"按类型分类",
					loader : treeLoader,
					collapsible : true,
					rootVisible : false,
					autoScroll : true,
					split : true,
					margins : '5 0 5 5',
					region : 'west',
					width : 220,
					hideMode: 'offsets',					
					root : rootNode
				});
		panel.on('click', showKnowledges);
		rootNode.select();
		panel.expandAll();
		return panel;	
	}
	
	
	
	
	function createQueryResultPanel(){
		delBtn = new Ext.Button({
					text : '删除',
					cls : 'x-btn-text-icon',
					disabled : true,
					icon : ResourceConstants.DELETE_BUTTON_PNG,
					handler : deleteFixedIncidentItems,
					isPermission : USER.isAble('knowledge_delete'),
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
		var delSeparator = new Ext.Toolbar.Separator(USER.isAble('knowledge_delete'));
		checkboxSelect = new Ext.grid.CheckboxSelectionModel();
		checkboxSelect.on('selectionchange',handleCheckChange);
		var columns = [new Ext.grid.RowNumberer(),  {
					header : "Id",
					dataIndex : 'id',
					//width : 10,
					hidden : true,
					sortable : true
				}, {
					header : "知识库ID",
					dataIndex : 'knowledgeID',
					renderer:function (data){ 					
						return "<a href='"+mainpath+"/knowledge/knowledgeDetail.do?to=detail&method=detail&Addread=Y&id="+arguments[2].data.id+"' >"+data+"</a>";
					},
					sortable : true
				}, {
					header : "标题",
					dataIndex : 'title',
					renderer:function (data){ 						
						return "<a title=\'"+data+"\' href='"+mainpath+"/knowledge/knowledgeDetail.do?to=detail&method=detail&Addread=Y&id="+arguments[2].data.id+"' >"+data+"</a>";
					},
					sortable : true
				}, {
					header : "类型",
					dataIndex : 'knowledgeType',
					renderer : function(data){
						if(data){
							return data.typeName
						}
					},
					sortable : true
				},{
					header : "阅读次数",
					dataIndex : 'readCount',
					sortable : true
				},{
					header : " ",
					dataIndex : 'openToSSD',
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
				}, {
					header : "创建时间",
					renderer : dateFormatSimple,
					dataIndex : 'createTime',
					//width : 120,
					renderer : dateFormat,
					sortable : true
				} ,{
					header : "更新时间",
					renderer : dateFormat,
					dataIndex : 'lastUpdateTime',
					///width : 120,
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
								var loadArgs = [params.start, params.limit, createQueryConditions()];
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
					emptyMsg : "没有符合条件的知识库记录"
				});
				
		var viewConfig = {
            forceFit:true,
            enableRowBody:true,
            showPreview:true,
            getRowClass : function(record, rowIndex, p, store){
                if(this.showPreview){
	                var str = '<div style="overflow:hidden;display:block;width:100%;height:25px;margin-top:5px;margin-bottom:10px;"><pre>';
	                	str += '<b style=\'color: #15428B;\'>问题描述:</b>'+record.data.problemDescription+'</pre></div>';
	                str +=	  '<div style="overflow:hidden;display:block;width:100%;height:12px;margin-bottom:5px;"><pre>'
	                str += '<b style=\'color: #15428B;\'>解决方案:</b>'+record.data.resolveMethod+'</pre></div>';
                    p.body = str ;
                    return 'x-grid3-row-expanded';
                }
                return 'x-grid3-row-collapsed';
            }
        }

		
		var resultPanel = new Ext.grid.GridPanel({
					region : "center",
					store : knowledgeItemStore,
					columns : columns,
					sm : checkboxSelect,
					autoScroll : true,
					enableHdMenu : false,
					autoExpandColumn : 3,
					height : 530,
					margins : '5 5 5 0',
					viewConfig: viewConfig,
					bbar : pagingBar
				});
		return resultPanel;
	}
	
	function handleCheckChange(checkMode){
		if (checkMode.getCount() == 0) {
			delBtn.setDisabled(true);
			viewBtn.setDisabled(true);
		}else if(checkMode.getCount() == 1){
			delBtn.setDisabled(false);
			viewBtn.setDisabled(false);
		}else{
			delBtn.setDisabled(false);
			viewBtn.setDisabled(true);
		}
	}
	
	function deleteFixedIncidentItems(){
		var confirmBox = Ext.MessageBox.confirm('确认', '确定要删除所选的知识库项吗？',
			function(value) {
				if (value == 'yes') {
					var selectedRecords = checkboxSelect.getSelections();
					var ids = new Array();
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
									queryKnowledge();
								}
							});

				}
			});
		
	}
	
	function viewFixedIncidentItem(){
		var selectedRecord = checkboxSelect.getSelected();
		var viewPanel = new Apex.maintenance.knowledge.EditKnowledgeItemPanel(selectedRecord);
		viewPanel.showPanel();
		
	}
	
	
	function showKnowledges(selectedNode){		
		selectedTypeId = Number(selectedNode.id); 
		maintenanceMainPanel.loadDate();
	}
	
	this.loadDate = function (){
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
		var queryConditions = new Array();
		var stausCriteria = { 
			propertyName : 'state',
			operator 	 : 'EQUAL',
			valueType    : 'STRING_ONLY',
			value 		 :	'kno_state_end'
		};		
		queryConditions.push(stausCriteria);		 
		var tem = 	createTypeCondition();	
		if(tem){
			queryConditions.push(createTypeCondition());		
		}	
		return queryConditions;
	}
	
	function createTypeCondition(){ 
		if (Ext.isEmpty(selectedTypeId)||selectedTypeId==0)
			return null; 
		var criteria = { 
			propertyName : 'knowledgeType.id',
			operator 	 : 'EQUAL',
			valueType    : 'LONG_ONLY',
			value 		 : selectedTypeId
		};		
		return criteria;
	} 
	
}
 

//全局
var maintenanceMainPanel = null;
dwr.engine.setErrorHandler(errorHandler);
/*
Ext.onReady(function() {
	SecurityService.getUserVoByUserName(null, {
				callback : function(user) {
					
					USER = new Apex.security.User({
						userName : user.userName,
						loginTime : user.loginTime,
						role : user.roleNames,
						permission : user.actionIds
					});
					maintenanceMainPanel = new Apex.maintenance.knowledge.KnowledgeListPanel("knowledgePanel");					 
					var knowledgePanel = maintenanceMainPanel.getPanel();
					maintenanceMainPanel.loadDate();
				}
			});
	        
		});
function changeMaintenanceMenu(panelName, id){
	maintenanceMainPanel.addPanel(panelName,id);
}
*/
