Ext.namespace("Apex.ssd");
/**
 * 普通运维人员提出的请求，包括被存为草稿的请求，待处理的请求，处理中的请求，已经处理的请求
 * 
 * @author timy
 */
Apex.ssd.MyRequest = function() {
	var incidentItemStore;
	// 左边树节点
	// 生成知识库类型树
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
	var asyncRoot = new Ext.tree.AsyncTreeNode({
				expanded : true,
				children : [{
							id : 'myrequests',
							text : '我的请求',
							disabled : true,
							expanded : true,
							children : [{
										id : 'drafts',
										text : '草稿箱',
										leaf : true
									}, {
										id : 'waitDealedRequest',
										text : '待处理的请求',
										leaf : true
									}, {
										id : 'beingDealedRequest',
										text : '处理中的请求',
										leaf : true
									}, {
										id : 'hasDealedRequest',
										text : '已处理的请求',
										leaf : true
									}]
						}]
			});

	var tree = new Ext.tree.TreePanel({
				region : "west",
				root : asyncRoot,
				width : 200,
				loadMask : {
					msg : 'Loading Tree...'
				},
				border : false,
				split : true,// 可拖动
				rootVisible : false,
				title : '我的请求',
				collapsible : true
			});
	// 右边GridPanel
	function createRightPanel(type) {
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
					header : "工单号",
					dataIndex : 'processCode',
					width : 80,
					sortable : true,
					renderer : function(data) {
						return '<a href="/itsm/common/viewIssueDetail.do?comm=1&menuId=m2&ISSUE_CODE='
								+ data + '">' + data + '</a>';
					}
				}, {
					header : "标题",
					dataIndex : 'title',
					width : 200,
					renderer : function(data, ele, config) {
					
						if (!Ext.isEmpty(data)) {
						return '<a href="/itsm/common/viewIssueDetail.do?comm=1&menuId=m2&ISSUE_CODE='
								+ config.data.processCode + '">' + Ext.util.Format.htmlEncode(data) + '</a>';
						} else {
							return null;
						}
					},
					sortable : true
				}, {
					header : "优先级",
					dataIndex : 'priority',
					width : 100,
					renderer : wfPriorFormat,
					sortable : true
				}, {
					header : "影响度",
					width : 100,
					dataIndex : 'impace',
					renderer : wfImpactFormat,
					sortable : true
				}, {
					header : "创建人",
					dataIndex : 'creator',
					renderer : function(data) {
						if (!Ext.isEmpty(data))
							return data.realName;
					},
					width : 100,
					sortable : true
				}, {
					header : "状态",
					dataIndex : 'state',
					width : 100,
					renderer : statusFormat,
					sortable : true
				}, {
					header : "创建时间",
					dataIndex : 'createTime',
					width : 150,
					renderer : dateFormatYMDHI,
					sortable : true
				}, {
					header : "期望完成时间",
					dataIndex : 'expectedCompleteTime',// 数据库中是实际解决时间
					width : 150,
					renderer : dateFormatYMDHI,
					sortable : true
				}];
		var incidentItemRecord = Ext.data.Record.create([{
					name : 'id',
					mapping : 'id'
				}, {
					name : 'jbpmProcessInstanceId',
					mapping : 'jbpmProcessInstanceId'
				}, {
					name : 'processCode',
					mapping : 'processCode'
				}, {
					name : 'title',
					mapping : 'title'
				}, {
					name : 'priority',
					mapping : 'priority'
				}, {
					name : 'impace',
					mapping : 'impace'
				}, {
					name : 'creator',
					mapping : 'creator'
				}, {
					name : 'state',
					mapping : 'state'
				}, {
					name : 'createTime',
					mapping : 'createTime'
				}, {
					name : 'expectedCompleteTime',
					mapping : 'expectedCompleteTime'
				}, {
					name : 'processType',
					mapping : 'processType'
				}]);
		// 资产领用申请单

		var reader = new Ext.data.JsonReader({
					totalProperty : "totalCount",
					root : "incidentItemList"// ,
				}, incidentItemRecord);
		incidentItemStore = new Ext.data.Store({
					proxy : new Ext.ux.data.DWRProxy({
								dwrFunction : IncidentService.getMyRequestsByStatus,
								listeners : {

									'beforeload' : function(dataProxy, params) {

										var userName = USER.getUserName();
										var loadArgs = [params.start,
												params.limit, userName, type];
										params[dataProxy.loadArgsKey] = loadArgs;
									}
								}
							}),
					reader : reader
				});
		var pagingBar = new Ext.PagingToolbar({
					id : 'createIncidentPagingBar',
					pageSize : 20,
					store : incidentItemStore,
					displayInfo : true,
					displayMsg : '显示 {0} - {1} 条工单，共 {2}条工单',
					emptyMsg : "没有任何事件工单"
				});
		var resultPanel = new Ext.grid.GridPanel({
					id : 'createIncidentItemTable',
					region : "center",
					store : incidentItemStore,
					title : "请求列表",
					border : false,
					columns : columns,
					autoExpandColumn : 10,
					autoScroll : true,
					enableHdMenu : false,
					bbar : pagingBar
				});
		loadStoreByType(type);
		return resultPanel;
	}
	function loadStoreByType(issueType) {
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
					msg : "正在加载数据，请稍侯...",
					msgCls : 'ext-el-mask-msg'
				});
		loadMask.show();
		incidentItemStore.load({
					params : {
						start : 0,
						limit : 20,
						issueType : issueType
					},
					callback : function() {
						loadMask.hide()
					}
				});
	}
	// 给树加上click事件
	tree.on("click", fn);
	function fn(node, event) {
		var bool = rightTabPanel.findById(node.id);
		if (bool != null || bool != "undefined") {
			rightTabPanel.removeAll(true);
			if (node.id == 'myrequests') {
				// 默认加载第一个
				tree.expandAll();
				var panel = createRightPanel('drafts');
				rightTabPanel.add(panel);
				rightTabPanel.doLayout(true);
			} else if (node.id == 'drafts') {
				tree.expandAll();
				var panel = createRightPanel('drafts');
				rightTabPanel.add(panel);
				rightTabPanel.doLayout(true);
			} else if (node.id == 'waitDealedRequest') {
				tree.expandAll();
				var panel = createRightPanel('waitDealedRequest');
				rightTabPanel.add(panel);
				rightTabPanel.doLayout(true);
			} else if (node.id == 'beingDealedRequest') {
				tree.expandAll();
				var panel = createRightPanel('beingDealedRequest');
				rightTabPanel.add(panel);
				rightTabPanel.doLayout(true);
			} else if (node.id == 'hasDealedRequest') {
				tree.expandAll();
				var panel = createRightPanel('hasDealedRequest');
				rightTabPanel.add(panel);
				rightTabPanel.doLayout(true);
			} else {
				tree.expandAll();
				var panel = createRightPanel('drafts');
				rightTabPanel.add(panel);
				rightTabPanel.doLayout(true);
			}

			rightTabPanel.doLayout(true);
		}
	}

	// 初始化panel
	var initPanel = createRightPanel('drafts');
	var rightTabPanel = new Ext.Panel({
				id : "rightTabPanel",
				region : 'center',
				layout : "fit",
				border : false,
				items : [initPanel]
			});
	var mainPanel = new Ext.Panel({
				labelWidth : 70,
				layout : 'border',
				border : false,
				width : innerWidth,
				height : innerHeight - 210,
				renderTo : 'MymainBodyDiv',
				items : [tree, rightTabPanel]
			});
	return mainPanel;
}

Ext.onReady(function() {
			SecurityService.getUserVoByUserName(null, {
						callback : function(user) {
							USER = new Apex.security.User({
										userName : user.userName,
										loginTime : user.loginTime,
										role : user.roleNames,
										permission : user.actionIds
									});
							var prompt = new Apex.ssd.MyRequest();
							prompt.show();
						}
					});
		});