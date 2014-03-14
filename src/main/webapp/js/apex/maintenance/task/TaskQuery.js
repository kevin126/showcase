Ext.namespace('Apex.Task.TaskQuery');

Apex.Task.TaskQuery.Panel = function() {
	// Id
	this.id = 'Apex.Task.TaskQuery';

	// Property
	var tIdTxt = new Ext.form.TextField({
				fieldLabel : '工单号',
				maxLength : 50,
				allowBlank : true,
				width : 125
			});

	var tHandlerTxt = new Ext.form.TextField({
				fieldLabel : '处理人',
				maxLength : 50,
				allowBlank : true,
				width : 125
			});

	var tTitleTxt = new Ext.form.TextField({
				fieldLabel : '主题摘要',
				maxLength : 50,
				allowBlank : true,
				width : 125
			});

	var tCreatorTxt = new Ext.form.TextField({
				fieldLabel : '创建人',
				maxLength : 50,
				allowBlank : true,
				width : 125
			});
	var tTimeTxtBegin = new Ext.ux.form.DateTimeFieldShortStart({
				fieldLabel : '创建时间从',
				width : 125
			});
	var tTimeTxtEnd = new Ext.ux.form.DateTimeFieldShortEnd({
				fieldLabel : '创建时间到',
				width : 125
			});
	var tPriorStore = new Ext.data.SimpleStore({
				fields : ['tPriorName', 'tPriorValue'],
				data : [['全部', ''], ['紧急', '1'], ['高', '2'], ['中', '3'],
						['低', '4']]
			});

	var tPriorCombox = new Ext.form.ComboBox({
				fieldLabel : '优先级',
				triggerAction : 'all',
				store : tPriorStore,
				displayField : 'tPriorName',
				valueField : 'tPriorValue',
				mode : 'local',
				forceSelection : true,
				resizable : false,
				typeAhead : true,
				value : '',
				width : 125,
				readOnly : true,
				handleHeight : 10
			});

	var tTypeStore = new Ext.data.SimpleStore({
				fields : ['tTypeName', 'tTypeValue'],
				data : [['全部', ''], ['事件工单', '事件工单'], ['公告工单', '公告工单']]
			});

	var tTypeCombox = new Ext.form.ComboBox({
				fieldLabel : '工单类型',
				triggerAction : 'all',
				store : tTypeStore,
				displayField : 'tTypeName',
				valueField : 'tTypeValue',
				mode : 'local',
				forceSelection : true,
				resizable : false,
				typeAhead : true,
				value : '',
				width : 125,
				readOnly : true,
				handleHeight : 10
			});
	tTypeCombox.on('select', handleTypeChange, tTypeCombox);

	var incidentTypeTree = null;

	var tSubTypeCombox = new Ext.form.TriggerField({
				fieldLabel : '工单子类型',
				hideTrigger : false,
				readOnly : true,
				width : 125,
				onTriggerClick : showTSubTypePanel
			});
	var tSubTypeValue = '';

	var tStateRecord = new Ext.data.Record.create([{
				name : 'tStateName'
			}, {
				name : 'tStateValue'
			}]);

	var tStateStore = new Ext.data.SimpleStore({
				fields : ['tStateName', 'tStateValue'],
				data : []
			});
	var allRecord = new tStateRecord({
				tStateName : '全部',
				tStateValue : ''
			});

	var waitRecord = new tStateRecord({
				tStateName : '待接单',
				tStateValue : '待接单'
			});
	var oneRecord = new tStateRecord({
				tStateName : '一线处理中',
				tStateValue : '一线处理中'
			});
	var twoRecord = new tStateRecord({
				tStateName : '二线处理中',
				tStateValue : '二线处理中'
			});
	var checkRecord = new tStateRecord({
				tStateName : '已解决、申请关闭中',
				tStateValue : '已解决'
			});
	var closeRecord = new tStateRecord({
				tStateName : '已关闭',
				tStateValue : '已关闭'
			});

	tStateStore.add([allRecord, waitRecord, oneRecord, twoRecord, checkRecord,
			closeRecord]);

	var tStateCombox = new Ext.form.ComboBox({
				fieldLabel : '状态',
				triggerAction : 'all',
				store : tStateStore,
				displayField : 'tStateName',
				valueField : 'tStateValue',
				mode : 'local',
				forceSelection : true,
				resizable : false,
				typeAhead : true,
				value : '',
				width : 125,
				readOnly : true,
				handleHeight : 10
			});

	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();

	var column = [new Ext.grid.RowNumberer(), {
				header : "ProcID",
				dataIndex : 'procId',
				width : 10,
				hidden : true,
				sortable : true
			}, {
				header : "工单号",
				dataIndex : 'procKey',
				width : 100,
				sortable : true,
				renderer : function(data) {
						return '<a href=# onclick="showIncidentDetail_total(\''
						+data
						+'\',\'taskQueryGridPanel\');">'
						+ data + '</a>';
					}
			}, {
				header : "工单类别",
				dataIndex : 'procType',
				width : 100,
				sortable : true
			}, {
				header : "主题摘要",
				dataIndex : 'title',
				width : 100,
				sortable : true
			}, {
				header : "创建人",
				dataIndex : 'createUser',
				width : 100,
				sortable : true
			}, {
				header : "创建时间",
				dataIndex : 'createTime',
				width : 120,
				renderer : dateFormat,
				sortable : true
			}, {
				header : "客户期望完成时间",
				dataIndex : 'clientExpectTime',
				width : 120,
				renderer : dateFormat,
				sortable : true
			}, {
				header : "状态",
				dataIndex : 'procNode',
				width : 100,
				sortable : true
			}, {
				header : "handleUser",
				dataIndex : 'handleUser',
				hidden : true,
				sortable : true
			}, {
				header : "taskId",
				dataIndex : 'taskId',
				hidden : true,
				sortable : true
			}];

	var record = Ext.data.Record.create([{
				name : 'procId',
				mapping : 'procId'
			}, {
				name : 'procKey',
				mapping : 'procKey'
			}, {
				name : 'procType',
				mapping : 'procType'
			}, {
				name : 'title',
				mapping : 'title'
			}, {
				name : 'createUser',
				mapping : 'createUser'
			}, {
				name : 'createTime',
				mapping : 'createTime'
			}, {
				name : 'clientExpectTime',
				mapping : 'clientExpectTime'
			}, {
				name : 'procNode',
				mapping : 'procNode'
			}, {
				name : 'handleUser',
				mapping : 'handleUser'
			}, {
				name : 'taskId',
				mapping : 'taskId'
			}]);

	var reader = new Ext.data.JsonReader({
				totalProperty : "DataSize",
				root : "DataList"
			}, record);

	var gStore = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : WorkflowService.queryTask,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									// fix by jonim at 2009-9-16
									var tId = tIdTxt.getValue();
									var tHandler = tHandlerTxt.getValue();
									var tTitle = tTitleTxt.getValue();
									var tCreator = tCreatorTxt.getValue();
									var tTimeB = tTimeTxtBegin.getValue();
									var tTimeE = tTimeTxtEnd.getValue();
									var tPrior = tPriorCombox.getValue();
									var tType = null;
									var tSubType = null;
									var tState = tStateCombox.getValue();
									var loadArgs = [params.start, params.limit,
											tId, tHandler, tTitle, tCreator,
											tTimeB, tTimeE, tPrior, tType,
											tSubType, tState];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});

	var page = new Ext.PagingToolbar({
				pageSize : 20,
				store : gStore,
				displayInfo : true,
				displayMsg : '显示 {0} - {1} 条记录，共 {2}条记录',
				emptyMsg : "没有任何工单"
			});

	var qPanel = createQueryPanel();

	var gPanel = createGridPanel();

	var mainPanel = createMainPanel();

	// Method
	function handleTypeChange(obj, newValue) {
		// var tType = newValue.get('tTypeValue');
		// tType ='事件工单';
		// tStateStore.removeAll();
		var allRecord = new tStateRecord({
					tStateName : '全部',
					tStateValue : ''
				});
		// if (tType == '事件工单') {
		var waitRecord = new tStateRecord({
					tStateName : '待接单',
					tStateValue : '待接单'
				});
		var oneRecord = new tStateRecord({
					tStateName : '一线处理中',
					tStateValue : '一线处理中'
				});
		var twoRecord = new tStateRecord({
					tStateName : '二线处理中',
					tStateValue : '二线处理中'
				});
		var checkRecord = new tStateRecord({
					tStateName : '已解决、申请关闭中',
					tStateValue : '已解决'
				});
		var closeRecord = new tStateRecord({
					tStateName : '已关闭',
					tStateValue : '已关闭'
				});
		tStateStore.add([allRecord, waitRecord, oneRecord, twoRecord,
				checkRecord, closeRecord]);
		// } else {
		// tStateStore.add([allRecord]);
		// }
	};

	function showTSubTypePanel() {
		var tType = tTypeCombox.getValue();
		if (tType == '事件工单') {
			incidentTypeTree = new Apex.maintenance.incident.IncidentTypeTreePanel();
			var treeWindow = new Ext.Window({
						id : 'Apex.Task.TaskQuery.SelectTSubTypeWin',
						title : '选择事件类型',
						closable : true,
						width : 250,
						border : false,
						plain : true,
						resizable : false,
						modal : true,
						items : [incidentTypeTree],
						buttons : [{
									text : '确定',
									handler : selectTSubTypeValue
								}, {
									text : '取消',
									handler : function() {
										treeWindow.close();
									}
								}],
						buttonAlign : 'center'
					});
			incidentTypeTree.on('dblclick', selectTSubTypeValue);
			treeWindow.show();
		}
		return;
	};

	function selectTSubTypeValue() {
		var tType = tTypeCombox.getValue();
		if (tType == '事件工单') {
			var treeNode = incidentTypeTree.getSelectionModel()
					.getSelectedNode();
			if (treeNode.text == '事件类型') {
				tSubTypeCombox.setValue('');
				tSubTypeValue = '';
			} else {
				selectedTypeNode = treeNode;
				tSubTypeCombox.setValue(treeNode.text);
				tSubTypeValue = treeNode.id;
			}
			Ext.getCmp('Apex.Task.TaskQuery.SelectTSubTypeWin').close();
		} else {
			tSubTypeCombox.setValue('');
		}
	};

	function createGridPanel() {
		var panel = new Ext.grid.GridPanel({
			        id : 'taskQueryGridPanel',
					store : gStore,
					columns : column,
					sm : checkboxSelect,
					autoScroll : true,
					enableHdMenu : false,
					height : 100,
					autoExpandColumn : 5,
					margins : '5 0 0 0',
					region : 'center',
					bbar : page
				});
		return panel;
	};

	function refreshGrid() {
		gStore.load({
					params : {
						start : page.cursor,
						limit : 20,
						tId : tIdTxt.getValue(),
						tHandler : tHandlerTxt.getValue(),
						tTitle : tTitleTxt.getValue(),
						tCreator : tCreatorTxt.getValue(),
						tTimeB : tTimeTxtBegin.getValue(),
						tTimeE : tTimeTxtEnd.getValue(),
						tPrior : tPriorCombox.getValue(),
						tType : tTypeCombox.getValue(),
						tSubType : tSubTypeValue,
						tState : tStateCombox.getValue()
					}
				});
	};

	function queryGrid() {
		gStore.load({
					params : {
						start : 0,
						limit : 20,
						tId : tIdTxt.getValue(),
						tHandler : tHandlerTxt.getValue(),
						tTitle : tTitleTxt.getValue(),
						tCreator : tCreatorTxt.getValue(),
						tTimeB : tTimeTxtBegin.getValue(),
						tTimeE : tTimeTxtEnd.getValue(),
						tPrior : tPriorCombox.getValue(),
						tType : tTypeCombox.getValue(),
						tSubType : tSubTypeValue,
						tState : tStateCombox.getValue()
					}
				});
	};

	function createQueryPanel() {
		var panel = new Ext.form.FormPanel({
					frame : true,
					region : 'north',
					labelWidth : 70,
					height : 100,
					items : [{
								layout : 'column',
								border : false,
								items : [{
											columnWidth : .20,
											layout : 'form',
											border : false,
											items : [tIdTxt]
										}, {
											columnWidth : .20,
											layout : 'form',
											border : false,
											items : [tHandlerTxt]
										}, {
											columnWidth : .20,
											layout : 'form',
											border : false,
											items : [tTitleTxt]
										}, {
											columnWidth : .20,
											layout : 'form',
											border : false,
											items : [tPriorCombox]
										}, {
											columnWidth : .20,
											layout : 'form',
											border : false,
											items : [tStateCombox]
										}]
							}, {
								layout : 'column',
								border : false,
								items : [{
											columnWidth : .20,
											layout : 'form',
											border : false,
											items : [tCreatorTxt]
										}, {
											columnWidth : .20,
											layout : 'form',
											border : false,
											items : [tTimeTxtBegin]
										}, {
											columnWidth : .20,
											layout : 'form',
											border : false,
											items : [tTimeTxtEnd]
										}
								// ,{
								// columnWidth : .20,
								// layout : 'form',
								// border : false,
								// items : [tTypeCombox]
								// }, {
								// columnWidth : .20,
								// layout : 'form',
								// border : false,
								// items : [tSubTypeCombox]
								// }
								]
							}],
					buttons : [{
								text : '查询',
								handler : function() {
									queryGrid();
								}
							}, {
								text : '清空',
								handler : function() {
									tIdTxt.setValue('');
									tHandlerTxt.setValue('');
									tTitleTxt.setValue('');
									tCreatorTxt.setValue('');
									tTimeTxtBegin.setValue('');
									tTimeTxtEnd.setValue('');
									tPriorCombox.setValue('');
									tTypeCombox.setValue('');
									tSubTypeCombox.setValue('');
									tSubTypeValue = '';
									tStateCombox.setValue('');
								}
							}],
					buttonAlign : 'center'
				});
		return panel;
	}

	function createMainPanel() {
		var panel = new Ext.Panel({
					layout : 'border',
					autoScroll : true,
					frame : false,
					border : false,
					items : [qPanel, gPanel]
				});
		return panel;
	};

	this.getPanel = function() {
		return mainPanel;
	};
};

function showFixedIncidentDetail(procKey) {
	var value = window.showModalDialog("ViewDetailServlet?procKey=" + procKey,
			window,
			"dialogWidth=1102px;dialogHeight=590px;status:no;scroll:no;");
	if (value != null) {
		Ext.Msg.show({
					title : '提示',
					msg : value,
					modal : true,
					buttons : Ext.Msg.OK,
					fn : function() {
						Ext.getCmp('waitIncidentItemTable').getStore().load({
									params : {
										start : 0,
										limit : 20
									}
								});
					},
					icon : Ext.Msg.INFO
				});
	}
};