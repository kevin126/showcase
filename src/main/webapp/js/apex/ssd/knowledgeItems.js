Ext.namespace("Apex.ssd");
/**
 * 负责显示知识库管理员发布到自助式服务台上的知识库记录
 */
Apex.ssd.knowledgeItems = function() {
	var knowledgeItemRecord = null;
	var knowledgeItemStore = null;
	var gridPanel = null;
	
	
	
	// 默认加载所有类型的知识库记录
	var selectedTypeId = null;
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
	var rootNode = new Ext.tree.AsyncTreeNode({
				text : '',
				id : '0',
				hasChildren : true,
				expanded : true
			});
	treeLoader = new Ext.ux.DWRTreeLoader({
				dwrCall : KnowledgeService.getKnowledgeTypeTree
			});
	var treePanel = new Ext.tree.TreePanel({
				title : "知识库类型",
				loader : treeLoader,
				collapsible : true,
				rootVisible : false,
				autoScroll : true,
				split : true,
				border : false,
				margins : '5 0 5 5',
				region : 'west',
				width : 220,
				root : rootNode
			});
	treePanel.on('click', showKnowledges);
	treePanel.expandAll();
	// 相应点击事件
	function showKnowledges(selectedNode) {
		rightTabPanel.removeAll(true);
		selectedTypeId = selectedNode.id;
		if (Ext.isEmpty(selectedTypeId) || selectedTypeId == 0) {
			selectedTypeId = 'all';
		}
		var panel = createQuerygridPanel(selectedTypeId);
		rightTabPanel.add(panel);
		rightTabPanel.doLayout(true);
		finalPanel.add(rightTabPanel);
		finalPanel.doLayout(true);
		return false;
	}
	// 生成gridpanel
	function createQuerygridPanel(selectedTypeId) {
		var columns = [new Ext.grid.RowNumberer(), {
					header : "知识库ID",
					dataIndex : 'id',
					hidden : true,
					sortable : true
				},  {
					header : "知识库编号",
					dataIndex : 'knowledgeID',
					width : 100,
						renderer : function(data) {
						return "<a title=\'"
								+ data
								+ "\' href='"
								+ mainpath
								+ "knowledge/knowledgeDetail.do?comm=1&menuId=m3&to=detail&method=selfdetail&Addread=Y&id="
								+ arguments[2].data.id + "' >" + data + "</a>";
					},
					sortable : true
				},{
					header : "标题",
					dataIndex : 'title',
					renderer : function(data) {
						if (!Ext.isEmpty(data)) {
							return Ext.util.Format.htmlEncode(data)
						}else{
						
						return null;
						}
					},
					width : 220,
				
					sortable : true
				}, {
					header : "类型",
					dataIndex : 'knowledgeType',
					width : 80,
					renderer : function(data) {
						if (data) {
							return data.typeName
						}
					},
					sortable : true
				}, {
					header : "阅读次数",
					dataIndex : 'readCount',
					width : 60,
					sortable : true
				}, {
					header : "创建时间",
					dataIndex : 'createTime',
					width : 150,
					renderer : dateFormat,
					sortable : true
				}, {
					header : "更新时间",
					renderer : dateFormat,
					dataIndex : 'lastUpdateTime',
					width : 150,
					sortable : true
				}];
		knowledgeItemRecord = Ext.data.Record.create([{
					name : 'id',
					mapping : 'id'
				}, {
					name : 'knowledgeID',
					mapping : 'knowledgeID'
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
						dwrFunction : KnowledgeService.getOpenToSSDKnowledgeItems,
						listeners : {
							'beforeload' : function(dataProxy, params) {
								var loadArgs = [params.start, params.limit,
										selectedTypeId];
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

		gridPanel = new Ext.grid.GridPanel({
					store : knowledgeItemStore,
					columns : columns,
					autoScroll : true,
					border : false,
					width : innerWidth,
				    height : innerHeight,
					enableHdMenu : false,
					 autoExpandColumn : 6,
					bbar : pagingBar
				});
		knowledgeItemStore.load({
					params : {
						start : 0,
						limit : 20
					}
				});
		return gridPanel;
	}
	// 组装知识库类型树和gridpanel
	// 初始化panel
	var initPanel = createQuerygridPanel('all');
	var rightTabPanel = new Ext.Panel({
				id : "rightTabPanel",
				region : 'center',
				layout : "fit",
				border : false,
				width : innerWidth,
				height : innerHeight+500,
				items : [initPanel]
			});

	var finalPanel = new Ext.Panel({
				labelWidth : 70,
				layout : 'border',
				border : false,
				width : innerWidth,
				height : innerHeight,
				renderTo : 'mainBodyDiv',
				items : [treePanel, rightTabPanel]
			});

	this.getPanel = function(){
		return finalPanel;
	}
}