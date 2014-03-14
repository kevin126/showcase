Ext.namespace('Apex.LinkItem');
Apex.LinkItem = function() {
	var checkboxSelect = null;
	var itemRecord = null;
	var itemStore = null;
	var pagingBar = null;
	var mainPanel = createMainPanel();
	
   	this.getPanel = function() {
		return mainPanel;
	};
	
	function createMainPanel(){
//		checkboxSelect = new Ext.grid.CheckboxSelectionModel({
//			listeners : {
//				'selectionchange' : function(sm) {
//					if (sm != null && sm.getSelections().length > 0) {
//						$("input[name='issueLinkProcId']").focus();
//						document.getElementsByName("issueLinkProcId")[0].value = "";
//						var value = '';
//						for(var i=0; i<sm.getSelections().length; i++){
//							if(value != '') value += ",";
//							value += sm.getSelections()[i].get('processCode');
//						}
//						document.getElementsByName("issueLinkProcId")[0].value = value;
//					}else{
//						document.getElementsByName("issueLinkProcId")[0].value = '';
//					}
//				}
//			}
//		});
		var columns = [new Ext.grid.RowNumberer(), 
//			checkboxSelect,
			{
				header : "工单号",
				dataIndex : 'processCode',
				width : 140,
				sortable : true,
				renderer : function(data) {
					return '<a href="javascript:void(0);" onclick=clickToSelect("' + data + '");>' + data + '</a>';
				}
			}, {
				header: "标题",
				dataIndex: "title",
				width: 300,
				sortable : true,
				renderer : function(data){
					if(!Ext.isEmpty(data)){
						return Ext.util.Format.htmlEncode(data);
					}
				}
			}, {
				header : "优先级",
				dataIndex : 'priority',
				width : 100,
				renderer : wfPriorFormat,
				sortable : true
			}, {
				header : "影响度",
				width : 160,
				dataIndex : 'impace',
				renderer : wfImpactFormat,
				sortable : true
			}
		];
		itemRecord = Ext.data.Record.create([
			{
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
			}
		]);
		var reader = new Ext.data.JsonReader({
			totalProperty : "dataCount",
			root : "dataList",
			id : "processCode"
		}, itemRecord);
		itemStore = new Ext.data.Store({
			proxy : new Ext.ux.data.DWRProxy({
				dwrFunction : CommonService.getProperIssueItems,
				listeners : {
					'beforeload' : function(dataProxy, params) {
						var loadArgs = [
							params.start, 
							params.limit, 
							$("select[name='issueType']").attr("value") ? $("select[name='issueType']").attr("value") : '', 
							$("input[name='title']").attr("value") ? $("input[name='title']").attr("value") : '',
							$("select[name='creator']").attr("value") ? $("select[name='creator']").attr("value") : '',
							$("input[name='startTime']").attr("value") ? $("input[name='startTime']").attr("value") : '',
							$("input[name='stopTime']").attr("value") ? $("input[name='stopTime']").attr("value") : '',
							$("#procId").attr("value")
						];
						params[dataProxy.loadArgsKey] = loadArgs;
					}
				}
			}),
			reader : reader
		});
		pagingBar = new Ext.PagingToolbar({
 	        id : 'createIssuePagingBar',
			pageSize : 10,
			store : itemStore,
			displayInfo : true,
			displayMsg : '显示 {0} - {1} 条工单，共 {2}条工单',
			emptyMsg : "<b>没有查询出条件适合的工单</b>"
		});
		var resultPanel = new Ext.grid.GridPanel({
	        id : 'createItemTable',
			store : itemStore,
			columns : columns,
//			sm : checkboxSelect,
			autoScroll : true,
			enableHdMenu : false,
			border : true,
//			autoExpandColumn : 2,
			height: 200,
			bbar : pagingBar
//			autoHeight: true
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
		itemStore.load({
			params : {
				start : 0,
				limit : 10
			},
			callback : function(){loadMask.hide()}
		});
	}
}

//点击将工单processCode放到链接工单上
function clickToSelect(data){
	$("input[name='issueLinkProcId']").focus();
	document.getElementsByName("issueLinkProcId")[0].value = data;
}