document.write("<script type='text/javascript' src='/itsm/dwr/interface/IssueTypeService.js'></script>");

Ext.namespace('Apex.maintenance.Issue.Type');
Apex.maintenance.Issue.Type.Panel = function(type) {
	//记录当前选择的节点ID
	var nodeId = 0;
	//用于显示的工单类型
	var issueType = getIssueType();
	var permission = getPermission();
	
	var addBtn = new Ext.Button({
		text : Common_I18N.addBtn,
		cls : 'x-btn-text-icon',
		icon : '/itsm/images/icons/add.gif',
//		isPermission : USER.isAble(permission[0]),
		handler : addType
	});
	var delBtn = new Ext.Button({
		text : Common_I18N.deleteBtn,
		cls : 'x-btn-text-icon',
		icon : '/itsm/images/icons/delete.gif',
//		isPermission : USER.isAble(permission[2]),
		disabled: true,
		handler : delType
	});
	var editBtn = new Ext.Button({
		text : Common_I18N.modifyBtn,
		cls : 'x-btn-text-icon',
		icon : '/itsm/images/icons/edit.gif',
//		isPermission : USER.isAble(permission[1]),
		disabled: true,
		handler : editType
	});
    var addSeparator = new Ext.Toolbar.Separator(USER.isAble(permission[0]));
    var delSeparator = new Ext.Toolbar.Separator(USER.isAble(permission[2]));
	
	var typeSelect = new Ext.grid.CheckboxSelectionModel({
		header: "",
		singleSelect: true,
		listeners : {
			'selectionchange' : function(sm) {
				if(sm != null && sm.getSelections().length > 0){
					if(sm.getSelections().length >= 2){
						editBtn.setDisabled(true);
						delBtn.setDisabled(true);
					}else{
						editBtn.setDisabled(false);
						delBtn.setDisabled(false);
					}
				}else{
					delBtn.setDisabled(true);
					editBtn.setDisabled(true);
				}
			}
		}
	});

	var typeReader = new Ext.data.JsonReader({
		totalProperty : "dataCount",
		root : 'dataList',
		id : 'id',
		fields : [{
			name : 'id',
			type : 'int'
		}, {
			name : 'parentId',
			type : 'int'
		}, {
			name : 'name',
			type : 'string'
		}, {
			name : 'memo',
			type : 'string'
		}, {
			name : 'principal'
		}]
	});
	var typeStore = new Ext.data.Store({
		reader : typeReader,
		proxy : new Ext.ux.data.DWRProxy({
			dwrFunction : IssueTypeService.importIssueTypeTreeLevel,
			listeners : {
				'beforeload' : function(dataProxy, params) {
					var loadArgs = [nodeId, type];
					params[dataProxy.loadArgsKey] = loadArgs;
				}
			}
		})
	});
	
	var treeRoot = new Ext.tree.AsyncTreeNode({
		text : issueType + JS_I18N.type,
		id : '0',
		hasChildren : true,
		expanded : true
	});
	var treeLoader = new Ext.ux.DWRTreeLoader({
		loadParams: [type, false],
		preloadChildren : true,
		//只取出目录结构树
		dwrCall : IssueTypeService.importIssueTypeTree,
		waitMessage : new Ext.LoadMask(Ext.getBody(), {
			msg : Common_I18N.loadMsg
		})
	});
	
	//目录树panel
	var treePanel = createTreePanel();
	//数据区panel
	var gridPanel = createGridPanel();
	//mainpanel
	var mainPanel = createMainPanel();

	this.getPanel = function() {
		return mainPanel;
	};
	
	function getIssueType(){
		type = type.toUpperCase();
		switch(type){
			case("INC"): return JS_I18N.inc;
			case("PRO"): return JS_I18N.pro;
			case("RFC"): return JS_I18N.rfc;
			case("REL"): return JS_I18N.rel;
			default:  alert("输入工单类型错误！"); return "";
		}
	}
	function getPermission(){
		type = type.toUpperCase();
		switch(type){
			case("INC"): return ["incident_create", "incident_modify", "incident_delete"];
			case("PRO"): return ["problem_create", "problem_modify", "problem_delete"];
			case("RFC"): return ["rfc_create", "rfc_modify", "rfc_delete"];
			case("REL"): return ["rel_create", "rel_modify", "rel_delete"];
			default: alert("输入工单类型错误！"); return [];
		}
	}
	
	function createTreePanel() {
		var panel = new Ext.tree.TreePanel({
			loader : treeLoader,
			collapsible : true,
			rootVisible : true,
			autoScroll : true,
			bodyStyle : 'padding:0px 5px 0px 0px',
			frame : false,
			split : true,
			border:false,
			margins : '5 5 5 5',
			region : 'west',
			width : 200,
			root : treeRoot,
			autoExpandColumn : 2
		});
		panel.on('click', loadType);
		treeRoot.select();
		return panel;
	};

	function createGridPanel() {
		var grid = new Ext.grid.GridPanel({
			region : 'center',
			margins : '5 5 5 0',
			store : typeStore,
			sm : typeSelect,
			tbar : [addBtn, addSeparator, delBtn, delSeparator, editBtn],
			columns : [new Ext.grid.RowNumberer(), typeSelect, {
					header : JS_I18N.name,
					dataIndex : 'name',
					width : 230,
					sortable : true,
					renderer : function(data){
						if(!Ext.isEmpty(data)){
							return Ext.util.Format.htmlEncode(data);
						}
					}
				}, {
					header : JS_I18N.memo,
					dataIndex : 'memo',
					width : 460,
					sortable : false,
					renderer : function(data){
						if(!Ext.isEmpty(data)){
							return Ext.util.Format.htmlEncode(data);
						}
					}
				}, {
					dataIndex : 'id',
					hidden : true,
					sortable : false
				}, {
					dataIndex : 'parentId',
					hidden : true,
					sortable : false
				}, {
					header: "负责人",
					dataIndex : 'principal',
					sortable : true,
					renderer : function(data){
						if(!Ext.isEmpty(data)){
							return Ext.util.Format.htmlEncode(data.realName);
						}
					}
				}
			],
			enableHdMenu : false,
			stripeRows : true,
			border:false,
			frame : false,
			autoExpandColumn : 3,
			width : 690
		});
		loadType(0);
		return grid;
	};

	function createMainPanel() {
		var panel = new Ext.Panel({
			layout : 'border',
			autoScroll : true,
			closable : false,
			border:false,
			items : [treePanel, gridPanel]
		});
		return panel;
	};

	function loadType(node, event) {
		nodeId = node ? node.id : "0";
		typeStore.load({
			params : {
				parentId : nodeId
			}
		});
	};

	function addType() {
		if(type == 'REL' && nodeId && nodeId != 0){
			return;
		}
		location.href = "/itsm/common/preAddIssueType.do?method=preAdd&issueType=" + type + "&nodeId=" + nodeId;
	};

	function delType() {
		var record = gridPanel.getSelectionModel().getSelected();
		IssueTypeService.canDeleteIssueTypes(record.get('id'), function(returnValue) {
			if (returnValue > 1) {
				var emsg;
				switch(returnValue){
					case(2): {
						emsg = issueType + '类型包含子类型，无法删除！';
						break;
					}
					case(3): {
						emsg = '有' + issueType + '工单链接到该' + issueType + '类型，无法删除！';
						location.href = "/itsm/common/preDeleteIssueType.do?id=" + record.get('id') + "&method=preDelete";
						return;
					}
					case(4): {
						emsg = '请选择要删除的' + issueType + '类型！';
						break;
					}
					case(5): {
						emsg = '该' + issueType + '类型已经被删除！';
						break;
					}
					default: {
						emsg = '删除操作出错！';
					}
				}
				Ext.Msg.show({
					title : '提示',
					msg : emsg,
					modal : true,
					buttons : Ext.Msg.OK,
					icon : Ext.Msg.INFO,
					fn : returnValue == 5 ? function(){
						var selectedNode = treePanel.getNodeById(nodeId);
						treeLoader.load(selectedNode, function(){});
						selectedNode.expand();
						typeStore.load({
							params : {
								parentId : nodeId
							}
						});
					} : function(){}
				});
			} else {
				location.href = "/itsm/common/preDeleteIssueType.do?id=" + record.get('id') + "&method=preDelete";
			}
		});
	};

	function editType() {
		var record = gridPanel.getSelectionModel().getSelected();

		IssueTypeService.countIssueByIssueType(record.get('id'),
			function(returnValue) {
				location.href = "/itsm/common/preModifyIssueType.do?id=" + record.get('id') + "&linkNumber=" + returnValue + "&method=show";
			}
		);
	};
}