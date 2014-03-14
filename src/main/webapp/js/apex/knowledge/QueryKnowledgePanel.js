

Ext.namespace('Apex.maintenance.knowledge');
Apex.maintenance.knowledge.QueryKnowledgePanel = function() {
	var queryConditionPanel = null;
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
	var createUserText = null; 
	var newWidow = null;
	var mainPanel = createMainPanel();
	this.getPanel = function(){
		return mainPanel;
	}	
	this.extpanel = queryKnowledge();
	function createMainPanel(){
		queryConditionPanel = createQueryConditonPanel();
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
					height : 580,
					//height: innerHeight - 218,
					//renderTo : 'mainBodyDiv',
					region:'center',
					margins: '5 5 5 5',
					frame : false,
					hideMode: 'offsets',
					items : [queryConditionPanel, queryResultPanel]
				});
		return panel;
	}
	function createQueryConditonPanel(){
	   titleText = new Ext.form.TextField({
					fieldLabel : '标题',
					maxLength : 100,
					anchor : '80%'
				});
		tagText = new Ext.form.TextField({
					fieldLabel : '关键字',
					maxLength : 100,
					anchor : '80%'
				});
		createUserText = new Ext.form.TextField({
					fieldLabel : '创建人',
					maxLength : 20,
					anchor : '80%'
				});
		typeTrigger = new Ext.form.TriggerField({
			fieldLabel : '知识库类型',
			hideTrigger : false,
			readOnly : true,
			anchor : '80%',
			onTriggerClick : showTypeTreePanel
		});
		 
		var panel = new Ext.FormPanel({
				title : '查询条件设置',
				frame : true,
				monitorValid :true,
				region : 'north',
				height : 110,
				collapsible : true,
				margins:'5 5 5 5',
				hideMode:'offsets',
				split : true,
				items : [{
					xtype : 'panel',
					layout : 'column',
					border : false,
					defaults : {
						bordr : false,
						layout : 'form',
						labelWidth : 80,
						columnWidth : .3,
						bodyStyle : 'padding:10 5 5 10'
					},
					items : [{
						labelSeparator : '：',
						items : [titleText]
					},{
						items : [typeTrigger]
					},{
						items : [createUserText]
					}]
				  }],
				buttons : [{
					text : '查询',
					formBind : true,
					handler : queryKnowledge
				}, {
					text : '重置',
					handler : resetCondition
				}],
				buttonAlign : 'center'
			});
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
		var columns = [new Ext.grid.RowNumberer(), {
					header : "Id",
					dataIndex : 'id',
					
					hidden : true,
					sortable : true
				}, {
					header : "审批流程",
					dataIndex : 'jbpmProcessInstanceId',
					
					hidden : true,
					sortable : true
				}, {
					header : "知识库编号",
					dataIndex : 'knowledgeID',
					renderer:function (data){ 					
						return "<a href='"+mainpath+"/knowledge/knowledgeDetail.do?to=detail&method=detail&Addread=Y&id="+arguments[2].data.id+"' >"+data+"</a>";
					},
					sortable : true
				}, {
					header : "标题",
					dataIndex : 'title',
					renderer:function (data){ 		
						return "<a href='"+mainpath+"/knowledge/knowledgeDetail.do?to=detail&method=detail&Addread=Y&id="+arguments[2].data.id+"' >"
							+Ext.util.Format.htmlEncode(data)+"</a>";
					},
					sortable : true
				},{
					header : "类型",
					dataIndex : 'knowledgeType',
					renderer : function(data){
						 if(data) {
						 	return Ext.util.Format.htmlEncode(data.typeName);
						 
						 }else{return '';}
					},
					
					sortable : true
				},{
					header : "阅读次数",
					dataIndex : 'readCount',
					
					sortable : true
				},{
					header : " ",
					dataIndex : 'openToSSD',
					width : 100,
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
					dataIndex : 'createTime',
					
					renderer : dateFormat,
					sortable : true
				} ,{
					header : "创建人",
					dataIndex : 'createUser',
					renderer:function (data){ 					
						if(data){
							return data.realName;
						}
					},
					sortable : true
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
		var resultPanel = new Ext.grid.GridPanel({
					region : "center",
					store : knowledgeItemStore,
					columns : columns,
					sm : checkboxSelect,
					autoScroll : true,
					enableHdMenu : false,
					autoExpandColumn : 4,
					height : 590,
					margins : '5 5 5 5',
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
	
	function createQueryConditions(){
		var queryConditions = new Array();
		var stausCriteria = {};
		stausCriteria.propertyName = 'state';
		stausCriteria.operator = 'EQUAL';
		stausCriteria.valueType = 'STRING_ONLY';
		stausCriteria.value = 'kno_state_end';//已发布
		queryConditions.push(stausCriteria);
		if (null != createTitleCondition())
			queryConditions.push(createTitleCondition());
		
		if (null != createUserCondition())
			queryConditions.push(createUserCondition());
		if (null != createTypeCondition())
			queryConditions.push(createTypeCondition());
		return queryConditions;
	}
	
	function createTitleCondition(){
		var titleValue = titleText.getValue();
		if (!Ext.isEmpty(titleValue)) {
			var titleCriteria = {};
			titleCriteria.propertyName = 'title';
			titleCriteria.operator = 'LIKE';
			titleCriteria.value = Ext.util.Format.htmlDecode(titleValue);
			titleCriteria.valueType = 'STRING_ONLY';
			return titleCriteria;
		}
		return null;
	}
	
	
	
	function createUserCondition(){
		var userValue = createUserText.getValue();
		if (!Ext.isEmpty(userValue)) {
			var personCriteria = {};
			personCriteria.propertyName = 'createUser.realName';
			personCriteria.operator = 'LIKE';
			personCriteria.value = Ext.util.Format.htmlDecode(userValue);
			personCriteria.valueType = 'STRING_ONLY';
			return personCriteria;
		}
		return null;
	}
	
	 
 
	function showTypeTreePanel(){
		typeTree = createTypeTreePanel();
		newWidow = new Ext.Window({
					title : '选择知识库类型',
					closable : true,
					width : 300,
					border : false,
					plain : true,
					resizable : false,
					modal : true,
					items : [typeTree],
					buttons : [{
								text : '确定',
								handler : selectType
							}, {
								text : '清空',
								handler : function() {
									typeTrigger.setValue('');
									typeTrigger.ids='';
									newWidow.close();
								}
							}],
					buttonAlign : 'center'
				});
		newWidow.show();
	}
	
	function createTypeTreePanel(){
		var root = new Ext.tree.AsyncTreeNode({
					text : '全部知识库类型',
					checked : false,
					id : '0',
					expanded : true
				});
		var panel = new Ext.tree.TreePanel({
					loader : new Ext.ux.DWRTreeLoader({
								dwrCall : KnowledgeService.getCheckedKnowledgeTree
							}),
					autoScroll : true,
					lines : true,
					frame : false,
					height : 350,
					root : root
				});
		panel.on('checkchange', selectChildNodes, panel);
		panel.expandAll();
		return panel;
	}
	
	function selectChildNodes(node, checked){
		node.expand();
		node.attributes.checked = checked;
		node.eachChild(function(child) {
					child.ui.toggleCheck(checked);
					child.attributes.checked = checked;
					child.fireEvent('checkchange', child, checked);
				});
	}
	
	function createTypeCondition(){
		//var getValue = typeTrigger.getValue();
		var getValue = typeTrigger.ids;
		if (Ext.isEmpty(getValue))
			return null;
		var typeCriteria = {};
		typeCriteria.propertyName = 'knowledgeType.id';
		typeCriteria.operator = 'IN';
		typeCriteria.value = Ext.util.Format.htmlDecode(getValue);
		typeCriteria.valueType = 'LONG_COLLECTION';
		return typeCriteria;
	}
	function queryKnowledge(){
		knowledgeItemStore.load({// 读取后台的数据
			params : {
				start : 0,
				limit : 20
			}
		});
	}
	function resetCondition(){
		queryConditionPanel.getForm().reset();
		typeTrigger.ids='';
	}

	function selectType(){
		var selectNodes = typeTree.getChecked();
		if (selectNodes.length != 0) {
			var returnText = "";
			var firstNode = selectNodes[0];
			if (firstNode.text == '全部知识库类型' && selectNodes.length == 1) {
				if (null != newWidow)
					newWidow.close();
			}
			var tempText = '';
			var tempid = '';
			for (var i = 0; i < selectNodes.length; i++) {
				if (selectNodes[i].text != '全部知识库类型'){
					if(selectNodes.length>0){
						tempid += selectNodes[i].id+ '，';
						returnText += selectNodes[i].text + '，';
					}
				}
			}
			if (!Ext.isEmpty(returnText)) {
				returnText = returnText.substring(0, returnText.length - 1);
				typeTrigger.setValue(Ext.util.Format.htmlDecode(returnText));
				typeTrigger.ids= tempid;
			}
		}
		if (null != newWidow)
			newWidow.close();
	}
	
}
 

/*

//全局
var maintenanceMainPanel = null;
dwr.engine.setErrorHandler(errorHandler);
Ext.onReady(function() {
	SecurityService.getUserVoByUserName(null, {
				callback : function(user) {
					
					USER = new Apex.security.User({
						userName : user.userName,
						loginTime : user.loginTime,
						role : user.roleNames,
						permission : user.actionIds
					});
					maintenanceMainPanel = new Apex.maintenance.knowledge.QueryKnowledgePanel("knowledgePanel");
					var knowledgePanel = maintenanceMainPanel.getPanel();
				}
			});
	        
		});
function changeMaintenanceMenu(panelName, id){
	maintenanceMainPanel.addPanel(panelName,id);
}
*/


