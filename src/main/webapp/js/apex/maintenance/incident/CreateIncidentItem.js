Ext.namespace('Apex.maintenance.incident');
Apex.maintenance.incident.CreateIncidentItem = function(start) {
	this.start = start;
	var checkboxSelect = null;
	var incidentItemRecord = null;
	var incidentItemStore = null;
	var pagingBar = null;
	var delBtn = null;
	var receiveBtn = null;
	var refreshBtn = null;
	var mainPanel = createMainPanel();
   this.getPanel = function() {
		return mainPanel;
	};
	function createMainPanel(){
	  receiveBtn = new Ext.Button({
					text : Incident_I18N.takeBtn,
					cls : 'x-btn-text-icon',
					disabled : true,
					isPermission : USER.isAble('incident_excute'),
					icon : '/itsm/images/icons/arrow-down-16.png',
					handler : receiveIncidentItem,
					minWidth : 80
				});
		var receiveSeparator = new Ext.Toolbar.Separator(USER.isAble('incident_excute'));
		delBtn = new Ext.Button({
					text : Common_I18N.deleteBtn,
					cls : 'x-btn-text-icon',
					disabled : true,
					isPermission : USER.isAble('incident_delete'),
					icon : ResourceConstants.DELETE_BUTTON_PNG,
					handler : deleteIncidentItem,
					minWidth : 80
				});
		var delSeparator = new Ext.Toolbar.Separator(USER.isAble('incident_delete'));
		refreshBtn = new Ext.Button({
					text : Common_I18N.refreshBtn,
					cls : 'x-btn-text-icon',
					icon : ResourceConstants.REFRESH_BUTTON_PNG,
					handler : refreshIncidentItem,
					minWidth : 80
				});

		checkboxSelect = new Ext.grid.CheckboxSelectionModel({
							singleSelect :true
						});
		checkboxSelect.on('selectionchange', handleCheckChange);
			var columns = [new Ext.grid.RowNumberer(), {
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
					header : Incident_I18N.issueCodeColumn,
					dataIndex : 'processCode',
					width : 140,
					sortable : true,
					renderer : function(data) {
							return '<a href="/itsm/common/viewIssueDetail.do?ISSUE_CODE=' + data + '">' + data + '</a>';
					}
				}, {
					header : Incident_I18N.titleColumn,
					dataIndex : 'title',
					width : 120,
					renderer : convertTextToHtml,
					sortable : true
				}, {
					header : Incident_I18N.priorityColumn,
					dataIndex : 'priority',
					width : 80,
					renderer : wfPriorFormat,
					sortable : true
				}, {
					header : Incident_I18N.typeColumn,
					dataIndex : 'wfDataEntityType',
					width : 100,
					renderer :function(data){if(!Ext.isEmpty(data))return convertTextToHtml(data.name);},
					sortable : true
				}, {
					header : Incident_I18N.createTimeColumn,
					dataIndex : 'createTime',
					width : 120,
					renderer : dateFormat,
					sortable : true
				}, {
					header : Incident_I18N.createUserColumn,
					dataIndex : 'creator',
					renderer :function(data){if(!Ext.isEmpty(data))return convertTextToHtml(data.realName);},
					width : 80,
					sortable : true
				}, {
					header : Incident_I18N.disposeUserColumn,
					width : 80,
					dataIndex : 'processor',
					renderer :function(data){if(!Ext.isEmpty(data))return data.realName;},
					hidden : true,
					sortable : true
				}, {
					header : Incident_I18N.statusColumn,
					dataIndex : 'state',
					renderer : statusFormat,
					width : 80,
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
					name : 'wfDataEntityType',
					mapping : 'wfDataEntityType'
				}]);
		var reader = new Ext.data.JsonReader({
					totalProperty : "totalCount",
					root : "incidentItemList",
					id : "id"
				}, incidentItemRecord);
		incidentItemStore = new Ext.data.Store({
					proxy : new Ext.ux.data.DWRProxy({
								dwrFunction : IncidentService.getMyCreateIncidentItems,
								listeners : {
									'beforeload' : function(dataProxy, params) {
										var userName = USER.getUserName();
										var loadArgs = [params.start,
												params.limit,userName];
										params[dataProxy.loadArgsKey] = loadArgs;
									}
								}
							}),
					reader : reader
				});
		 pagingBar = new Ext.PagingToolbar({
		 	        id : 'createIncidentPagingBar',
					pageSize : 20,
					store : incidentItemStore,
					displayInfo : true,
					displayMsg : Incident_I18N.displayMsg,
					emptyMsg : Incident_I18N.emptyMsg
				});
		var resultPanel = new Ext.grid.GridPanel({
			        id : 'createIncidentItemTable',
			        region : "center",
					store : incidentItemStore,
					columns : columns,
					sm : checkboxSelect,
					border : false,
					autoScroll : true,
					enableHdMenu : false,
					autoExpandColumn : 4,
					height : 530,
					margins : '5 0 0 0',
//					tbar : [delBtn, delSeparator, refreshBtn],
					bbar : pagingBar
				});
		loadIncidentData();
		return resultPanel;
	}

	function loadIncidentData() {
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
								msg : Common_I18N.loadMsg,
								msgCls : 'ext-el-mask-msg'
							});
		loadMask.show();
		if('null' == start || Ext.isEmpty(start))
			start = 0;
		incidentItemStore.load({
					params : {
						start : Number(start),
						limit : 20
					},
					callback : function(){loadMask.hide()}
				});
	}

	function handleCheckChange(checkMode) {
		if (checkMode.getCount() == 0) {
			delBtn.setDisabled(true);
			receiveBtn.setDisabled(true);
		} else {
			var selectedItem = checkMode.getSelected();
			if(selectedItem.get('displayName') == 'state_in_process'){
				receiveBtn.setDisabled(false);
			}else{
				receiveBtn.setDisabled(true);
			}
		    delBtn.setDisabled(false);
		}
	}
	/**
	 * 删除事件
	 */
	function deleteIncidentItem() {
		// TODO ADD 权限检查
		var confirmBox = Ext.MessageBox.confirm(Common_I18N.confirmMsg, Incident_I18N.confirmDelMag,
				function(id) {

					if (id == 'yes') {

						var pIdAry = new Array();
						var selectedRecord = checkboxSelect.getSelected();
						CommonService.deleteIssueByProcessCode(selectedRecord.get('processCode'), {
					    	callback : function() {
											loadIncidentData();
										},
						    errorHandler : function(errorString, exception){
					    	         	Ext.MessageBox.show({
											title : Common_I18N.errMsg,
											msg : exception.message,
											buttons : Ext.MessageBox.OK,
											fn : function() {
												loadIncidentData();
											},
											icon : Ext.MessageBox.ERROR
										});
						    		}
						});

					}
				});
	}
	/**
	 * 处理接单
	 */
	function receiveIncidentItem() {
		// TODO ADD 权限检查
		var confirmBox = Ext.MessageBox.confirm(Common_I18N.confirmMsg, Incident_I18N.confirmTakeMsg,
				function(id) {
					if (id == 'yes') {
						var pIdAry = new Array();
						var selectedRecord = checkboxSelect.getSelections();
						for (var i = 0; i < selectedRecord.length; i++) {
							pIdAry.push(selectedRecord[i].data.jbpmProcessInstanceId);
						}
						 var userName = USER.getUserName();
						IncidentService.takeIncidentItem(userName,pIdAry[0], {
					    	callback : function(returnValue) {
											loadIncidentData();
										},
						    errorHandler : function(errorString, exception){
					    	         	Ext.MessageBox.show({
											title : Common_I18N.errMsg,
											msg : exception.message,
											buttons : Ext.MessageBox.OK,
											fn : function() {
												loadIncidentData();
											},
											icon : Ext.MessageBox.ERROR
										});
						    		}
						});

					}
				});
	}
	/**
	 * 刷新表单
	 */
	function refreshIncidentItem() {
		loadIncidentData();
		checkboxSelect.clearSelections();
	}
}

function showIssueDetail_total(processCode,pagingBarId,returnType){
	var pagingBar = Ext.getCmp(pagingBarId);
	if(null != pagingBar){
		var start = pagingBar.cursor;
		location.href = "/itsm/common/viewIssueDetail.do?ISSUE_CODE="+processCode+"&RETURN_TYPE="+returnType+"&START="+start;
	}
}

