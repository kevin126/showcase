Ext.namespace('Apex.maintenance.problem');
Apex.maintenance.problem.CreateProblemItem = function() {
	var checkboxSelect = null;
	var problemItemRecord = null;
	var problemItemStore = null;
	var pagingBar = null;
	var delBtn = null;
	var refreshBtn = null;
	var mainPanel = createMainPanel();
	
   	this.getPanel = function() {
		return mainPanel;
	};
	
	function createMainPanel(){
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
				width : 140,
				sortable : true,
				renderer : function(data) {
					return '<a href="/itsm/common/viewIssueDetail.do?ISSUE_CODE=' + data + '">' + data + '</a>';
				}
			}, {
				header : "主题摘要",
				dataIndex : 'title',
				width : 200,
				sortable : true,
				renderer : function(data) {
					if(data) 
						return Ext.util.Format.htmlEncode(data);
				}
			}, {
				header : "优先级",
				dataIndex : 'priority',
				width : 80,
				renderer : wfPriorFormat,
				sortable : true
			}, {
				header : "问题类型",
				dataIndex : 'type',
				renderer : function(data){
					if(!Ext.isEmpty(data))
						return Ext.util.Format.htmlEncode(data.name);
				},
				width : 80,
				sortable : true
			}, {
				header : "创建时间",
				dataIndex : 'createTime',
				width : 80,
				renderer : dateFormat,
				sortable : true
			}, {
				header : "创建人",
				dataIndex : 'creator',
				renderer :function(data){if(!Ext.isEmpty(data))return data.realName;},
				width : 80,
				sortable : true
			}, {
				header : "状态",
				dataIndex : 'state',
				width : 80,
				renderer :statusFormat,
				sortable : true
			}, {
				header : "处理人",
				width : 80,
				dataIndex : 'processor',
				renderer :function(data){if(!Ext.isEmpty(data))return data.name;},
				hidden : true,
				sortable : true
			}
		];
		problemItemRecord = Ext.data.Record.create([{
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
			}
		]);
		var reader = new Ext.data.JsonReader({
			totalProperty : "totalCount",
			root : "problemItemList",
			id : "id"
		}, problemItemRecord);
		problemItemStore = new Ext.data.Store({
			proxy : new Ext.ux.data.DWRProxy({
				dwrFunction : ProblemService.getMyCreateProblemItems,
				listeners : {
					'beforeload' : function(dataProxy, params) {
						var userName = USER.getUserName();
						var loadArgs = [params.start, params.limit, userName];
						params[dataProxy.loadArgsKey] = loadArgs;
					}
				}
			}),
			reader : reader
		});
		pagingBar = new Ext.PagingToolbar({
 	        id : 'createProblemPagingBar',
			pageSize : 20,
			store : problemItemStore,
			displayInfo : true,
			displayMsg : '显示 {0} - {1} 条问题工单，共 {2}条问题工单',
			emptyMsg : "没有任何问题工单"
		});
		var resultPanel = new Ext.grid.GridPanel({
	        id : 'createProblemItemTable',
	        region : "center",
			store : problemItemStore,
			columns : columns,
			border:false,
			autoScroll : true,
			enableHdMenu : false,
			autoExpandColumn : 4,
			height : 530,
			margins : '5 0 0 0',
			bbar : pagingBar
		});
		loadProblemData();
		return resultPanel;
	}

	function loadProblemData() {
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
			msg : "正在加载数据，请稍侯...",
			msgCls : 'ext-el-mask-msg'
		});
		loadMask.show();
		problemItemStore.load({
			params : {
				start : 0,
				limit : 20
			},
			callback : function(){loadMask.hide()}
		});
	}
}

