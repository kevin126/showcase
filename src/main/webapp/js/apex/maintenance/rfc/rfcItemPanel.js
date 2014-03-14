Ext.namespace('Apex.maintenance.rfc');

Apex.maintenance.rfc.rfcItemPanel = function(param) {
	var checkboxSelect = null;
	var incidentItemRecord = null;
	var rfcItemStore = null;
	var pagingBar = null;
	var dispatchBtn = null;
	var resolveBtn = null;
	var refuseBtn = null;
	var upgradeBtn = null;
	var generateKnowledgeBtn = null;
	var refreshBtn = null;
	var mainPanel = createMainPanel();	
	var loadConditions = null;
	
	this.getPanel = function() {
		return mainPanel;
	};
	this.loadData = function(){
		loadConditions = new Array();
		var userCriteria = {};
		userCriteria.propertyName = 'createUserId';
		userCriteria.operator = 'EQUAL';
		userCriteria.valueType = 'STRING_ONLY';
		userCriteria.value = USER.getUserName();
		//loadConditions.push(userCriteria);
		loadIncidentData();
	}
	function createMainPanel() {
		dispatchBtn = new Ext.Button({
					text : '转派',
					cls : 'x-btn-text-icon',
					isPermission : USER.isAble('incident_excute'),
					icon : ResourceConstants.ADD_BUTTON_PNG,
					handler : dispatchFixedIncidentItem,
					disabled : true,
					minWidth : 80
				});
		resolveBtn = new Ext.Button({
					text : '解决',
					cls : 'x-btn-text-icon',
					isPermission : USER.isAble('incident_excute'),
					disabled : true,
					icon : ResourceConstants.SETACCESSMODE_BUTTON_PNG,
					handler : resolveFixedIncidentItem,
					minWidth : 80
				});
		refuseBtn = new Ext.Button({
					text : '拒绝',
					cls : 'x-btn-text-icon',
					disabled : true,
					isPermission : USER.isAble('incident_excute'),
					icon : ResourceConstants.DELETE_BUTTON_PNG,
					handler : refuseFixedIncidentItem,
					minWidth : 80
				});
		upgradeBtn = new Ext.Button({
					text : '升级',
					cls : 'x-btn-text-icon',
					disabled : true,
					isPermission : USER.isAble('incident_excute'),
					icon : 'images/icons/arrow-up-16.png',
					handler : refreshIncidentItem,
					minWidth : 80
				});
		generateKnowledgeBtn = new Ext.Button({
					text : '生成知识',
					cls : 'x-btn-text-icon',
					disabled : true,
					isPermission : USER.isAble('incident_excute'),
					icon : 'images/icons/knowledge-16.png',
					handler : refreshIncidentItem,
					minWidth : 80
				});
		refreshBtn = new Ext.Button({
					text : '刷新',
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.REFRESH_BUTTON_PNG,
					handler : refreshIncidentItem,
					minWidth : 80
				});
		var tbarSeparator1 = new Ext.Toolbar.Separator(USER.isAble('incident_excute'));
        var tbarSeparator2 = new Ext.Toolbar.Separator(USER.isAble('incident_excute'));
        var tbarSeparator3 = new Ext.Toolbar.Separator(USER.isAble('incident_excute'));
        var tbarSeparator4 = new Ext.Toolbar.Separator(USER.isAble('incident_excute'));
        var tbarSeparator5 = new Ext.Toolbar.Separator(USER.isAble('incident_excute'));
		checkboxSelect = new Ext.grid.CheckboxSelectionModel({
					singleSelect : true
				});
		checkboxSelect.on('selectionchange', handleCheckChange);
		var columns = [new Ext.grid.RowNumberer(),  {
					header : "Id",
					dataIndex : 'id',
					width : 10,
					hidden : true,
					sortable : true
				}, {
					header : "PId",
					dataIndex : 'jbpmProcessInstanceId',
					width : 10,
					hidden : true,
					sortable : true
				}, {
					header : "工单号",
					dataIndex : 'processCode',
					width : 140,
					sortable : true,
					renderer : function(data) {
						return "<a href='"+mainpath+"/common/viewIssueDetail.do?ISSUE_CODE="+arguments[2].data.processCode+"' >"+data+"</a>";						
					}
				}, {
					header : "主题摘要",
					dataIndex : 'title',
					width : 120,
					renderer : convertTextToHtml,
					sortable : true
				}, {
					header : "优先级",
					dataIndex : 'priority',
					width : 80,
					renderer : wfPriorFormat,
					sortable : true
				}, {
					header : "变更类型",
					dataIndex : 'type',
					width : 100,
					renderer : function(data){
						if(!Ext.isEmpty(data))return Ext.util.Format.htmlEncode(data.name);
					},
					sortable : true
				}, {
					header : "创建时间",
					dataIndex : 'createTime',
					width : 120,
					renderer : dateFormat,
					sortable : true
				}, {
					header : "创建人",
					dataIndex : 'creator',
					renderer :function(data){if(!Ext.isEmpty(data))return Ext.util.Format.htmlEncode(data.realName);},
					width : 80,
					sortable : true
				}, {
					header : "状态",
					dataIndex : 'state',
					renderer : function(data) { 
						if(data){
							return statusFormat(data);
						}
					},
					width : 80,
					sortable : true
				}, {
					header : "处理人",
					width : 80,
					dataIndex : 'processor',
					renderer :function(data){if(!Ext.isEmpty(data))return Ext.util.Format.htmlEncode(data.realName);},
					hidden : true,
					sortable : true
				}];
	incidentItemRecord = Ext.data.Record.create([{
					name : 'id',
					mapping : 'id'
				}, {
					name : 'jbpmProcessInstanceId',
					mapping : 'jbpmProcessInstanceId'
				}, {
					name : 'processCode',
					mapping : 'processCode'
				}, {
					name : 'state',
					mapping : 'state'
				}
				, {
					name : 'displayName',
					mapping : 'displayName'
				}, {
					name : 'createTime',
					mapping : 'createTime'
				}, {
					name : 'creator',
					mapping : 'creator'
				}, {
					name : 'processor',
					mapping : 'processor'
				}, {
					name : 'priority',
					mapping : 'priority'
				}, {
					name : 'title',
					mapping : 'title'
				}, {
					name : 'detail',
					mapping : 'detail'
				}, {
					name : 'type',
					mapping : 'wfDataEntityType'
				}]);
		var reader = new Ext.data.JsonReader({
					totalProperty : "totalCount",
					root : "rfcItemList",
					id : "id"
				}, incidentItemRecord);
		 
		if(param=='cabaudit_rfc'){
			rfcItemStore = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : RfcService.getRFCICABtems,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									//var userName = USER.getUserName();
									var loadArgs = [params.start, params.limit];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});
		}else{
			rfcItemStore = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : RfcService.getFixedRFCItems,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									//var userName = USER.getUserName();
									var loadArgs = [params.start, params.limit,loadConditions];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});
		}
		pagingBar = new Ext.PagingToolbar({
			        id : 'waitResolvePagingBar',
					pageSize : 20,
					store : rfcItemStore,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条变更工单，共 {2}条变更工单',
					emptyMsg : "没有任何变更工单"
				});
		var resultPanel = new Ext.grid.GridPanel({
					id : 'waitIncidentItemTable',
					region : "center",
					store : rfcItemStore,
					columns : columns,
					sm : checkboxSelect,
					autoScroll : true,
					border:false,
					enableHdMenu : false,
					autoExpandColumn : 4,
					height : 530,
					margins : '5 0 0 0',
					//tbar : [dispatchBtn, tbarSeparator1, resolveBtn, tbarSeparator2, refuseBtn, tbarSeparator3,refreshBtn],
					//tbar : [refreshBtn],
					bbar : pagingBar
				});
		return resultPanel;
	}

	function loadIncidentData() {
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
								msg : "正在加载数据，请稍侯...",
								msgCls : 'ext-el-mask-msg'
							});
		loadMask.show();
		rfcItemStore.load({
					params : {
						start : 0,
						limit : 20
					},
					callback : function(){loadMask.hide()}
				});
	}

	function handleCheckChange(checkMode) {
		if (checkMode.getCount() == 0) {
			dispatchBtn.setDisabled(true);
			resolveBtn.setDisabled(true);
			refuseBtn.setDisabled(true);
			upgradeBtn.setDisabled(true);
			generateKnowledgeBtn.setDisabled(true);
		} else {
			var selectedIncidentItem = checkMode.getSelected();
			dispatchBtn.setDisabled(false);
			resolveBtn.setDisabled(false);
			refuseBtn.setDisabled(false);
			upgradeBtn.setDisabled(false);
			generateKnowledgeBtn.setDisabled(false);
		}
	}

	/**
	 * 增加事件
	 */
	function dispatchIncidentItem() {
		//var addItemPanel = new Apex.maintenance.incident.AddIncidentItem(loadIncidentData);
		//addItemPanel.showAddPanel();
	}
	/**
	 * 处理事件
	 */
	function disposeIncidentItem() {
		var selectedRecord = checkboxSelect.getSelected();
		var selectedItem = selectedRecord.data;
		//var disposeIncidentPanel = new Apex.maintenance.incident.DisposeIncidentItem(selectedItem);
		//disposeIncidentPanel.showPanel();
	}
	/**
	 * 删除事件
	 */
	function deleteIncidentItem() {
		// TODO ADD 权限检查
		var confirmBox = Ext.MessageBox.confirm('删除变更工单', '确定要删除变更工单吗?',
				function(id) {

					if (id == 'yes') {

						var pIdAry = new Array();
						var selectedRecord = checkboxSelect.getSelections();
						for (var i = 0; i < selectedRecord.length; i++) {
							pIdAry.push(selectedRecord[i].data.procId);
						}

						IncidentService.deleteIncidentItem(pIdAry, function(
										returnValue) {

									if (!returnValue) {
										Ext.Msg.show({
													title : '错误',
													msg : '发生错误或异常，删除失败！',
													modal : true,
													buttons : Ext.Msg.OK,
													icon : Ext.Msg.ERROR
												});
									}
									loadIncidentData();
								});

					}
				});
	}
	/**
	 * 处理接单
	 */
	function receiveIncidentItem() {
		// TODO ADD 权限检查
		var confirmBox = Ext.MessageBox.confirm('确认', '确定要承接该变更工单吗?', function(
						id) {
					if (id == 'yes') {
						var pIdAry = new Array();
						var selectedRecord = checkboxSelect.getSelections();
						for (var i = 0; i < selectedRecord.length; i++) {
							pIdAry.push(selectedRecord[i].data.procId);
						}
						IncidentService.takeIncidentItem("admin", pIdAry[0],
								function(returnValue) {
									loadIncidentData();
								});

					}
				});
	}

	/***************************************************************************
	 * 转派工单
	 */
	function dispatchFixedIncidentItem() {
		var selectedIncidentItem = checkboxSelect.getSelected();
		var procId = selectedIncidentItem.get('jbpmProcessInstanceId');
		//var dispatchPanel = new Apex.maintenance.incident.DispatchIncidentItem(procId);
		//dispatchPanel.showPanel();
	}

	/**
	 * 解决工单
	 */
	function resolveFixedIncidentItem() {
		var textArea = new Ext.form.TextArea({
			fieldLabel : '解决方案描述',
			width : 470,
			allowBlank : false,
			minLength : 10,
			maxLength : 20000,
			height : 300
		});
		var winCofig = {
			title : '解决',
			height : 400,
			width : 500
		};
		var prompt = new Apex.common.ItsmPrompt(textArea,function(inputContent){
						var selectedIncidentItem = checkboxSelect.getSelected();
						var procId = selectedIncidentItem.get('jbpmProcessInstanceId');
						var userName = USER.getUserName();
						IncidentService.resolveFixedIncidentItem(procId,userName, inputContent,{
								callback : function(returnValue) {
									if (returnValue) {
										prompt.close();
										loadIncidentData();
									} else {
										Ext.Msg.show({
													title : '错误',
													msg : '发生错误或异常，解决工单失败！',
													modal : true,
													buttons : Ext.Msg.OK,
													icon : Ext.Msg.ERROR
												});
									}
								},
							    errorHandler : function(errorString, exception){
							    	prompt.close();
				    	         	Ext.MessageBox.show({
										title : '错误',
										msg : exception.message,
										buttons : Ext.MessageBox.OK,
										fn : function() {
											loadIncidentData();
										},
										icon : Ext.MessageBox.ERROR
									});
					    		}
							});
				},winCofig);
	}

	/**
	 * 拒绝工单
	 */
	function refuseFixedIncidentItem() {
		var textArea = new Ext.form.TextArea({
			fieldLabel : '拒绝理由',
			width : 470,
			allowBlank : false,
			minLength : 10,
			maxLength : 2000,
			height : 300
		});
		var winCofig = {
			title : '拒绝',
			height : 400,
			width : 500
		};
		var prompt = new Apex.common.ItsmPrompt(textArea,function(inputContent){
						var selectedIncidentItem = checkboxSelect.getSelected();
						var procId = selectedIncidentItem.get('jbpmProcessInstanceId');
						var userName = USER.getUserName();
						IncidentService.refuseFixedIncidentItem(procId,userName, inputContent, {
								callback : function(returnValue) {
									if (returnValue) {
										prompt.close();
										loadIncidentData();
									} else {
										Ext.Msg.show({
													title : '错误',
													msg : '发生错误或异常，拒绝工单失败！',
													modal : true,
													buttons : Ext.Msg.OK,
													icon : Ext.Msg.ERROR
												});
									}
								},
								errorHandler : function(errorString, exception){
							    	prompt.close();
				    	         	Ext.MessageBox.show({
										title : '错误',
										msg : exception.message,
										buttons : Ext.MessageBox.OK,
										fn : function() {
											loadIncidentData();
										},
										icon : Ext.MessageBox.ERROR
									});
					    		}
							});
				},winCofig);
	}

	/**
	 * 刷新表单
	 */
	function refreshIncidentItem() {
		loadIncidentData();
		checkboxSelect.clearSelections();
	}
}

/**全局函数和全局变量**/
var waitReflushGridPanelId_total = "";//
function showIncidentDetail_total(procKey,gridPanelId){
	waitReflushGridPanelId_total = gridPanelId;
}


function returnAction_total(value){
			if(value != null ){
				Ext.Msg.show({
							title : '提示',
							msg : value,
							modal : true,
							buttons : Ext.Msg.OK,
							fn : function(){reflushIncident_total(waitReflushGridPanelId_total)},
							icon : Ext.Msg.INFO
						});
			}
}

function reflushIncident_total(gridPanelId){
	alert(gridPanelId);
	var gridPanel = Ext.getCmp(gridPanelId);
	if(!Ext.isEmpty(gridPanel)){
		var store = gridPanel.getStore();
		var pagingBar = gridPanel.getBottomToolbar();
		var startIndex =  pagingBar.cursor;
	    if(!Ext.isEmpty(store))
			store.load({
				params : {
							start : startIndex,
							limit : 20
						}
				});
	}
}

