document.write("<script type='text/javascript' src='/itsm/dwr/interface/IssueAddressService.js'></script>");

Ext.namespace('Apex.security.AddressManageMainPanel');
Apex.security.AddressManageMainPanel = function() {
	//记录当前选择的节点ID
	var nodeId = 0;
	
	var addBtn = new Ext.Button({
		text : Common_I18N.addBtn,
		cls : 'x-btn-text-icon',
		icon : '/itsm/images/icons/add.gif',
//		isPermission : USER.isAble(permission[0]),
		handler : addAddress
	});
	var delBtn = new Ext.Button({
		text : Common_I18N.deleteBtn,
		cls : 'x-btn-text-icon',
		icon : '/itsm/images/icons/delete.gif',
//		isPermission : USER.isAble(permission[2]),
		disabled: true,
		handler : delAddress
	});
	var editBtn = new Ext.Button({
		text : Common_I18N.modifyBtn,
		cls : 'x-btn-text-icon',
		icon : '/itsm/images/icons/edit.gif',
//		isPermission : USER.isAble(permission[1]),
		disabled: true,
		handler : editAddress
	});
    var addSeparator = new Ext.Toolbar.Separator();
    var delSeparator = new Ext.Toolbar.Separator();
	
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
			dwrFunction : IssueAddressService.importIssueAddressTreeLevel,
			listeners : {
				'beforeload' : function(dataProxy, params) {
					var loadArgs = [nodeId];
					params[dataProxy.loadArgsKey] = loadArgs;
				}
			}
		})
	});
	
	var treeRoot = new Ext.tree.AsyncTreeNode({
		text : "地点",
		id : '0',
		hasChildren : true,
		expanded : true
	});
	var treeLoader = new Ext.ux.DWRTreeLoader({
		preloadChildren : true,
		//只取出目录结构树
		dwrCall : IssueAddressService.importIssueAddressTree,
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
	
	function createTreePanel() {
		var panel = new Ext.tree.TreePanel({
			loader : treeLoader,
			collapsible : true,
			rootVisible : true,
			autoScroll : true,
			border : false,
			bodyStyle : 'padding:0px 5px 0px 0px',
			frame : false,
			split : true,
			margins : '5 5 5 5',
			region : 'west',
			width : 200,
			root : treeRoot,
			autoExpandColumn : 2
		});
		panel.on('click', loadAddress);
		treeRoot.select();
		return panel;
	};

	function createGridPanel() {
		var grid = new Ext.grid.GridPanel({
			region : 'center',
			margins : '5 5 5 0',
			border : false,
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
			border : false,
			frame : false,
			autoExpandColumn : 3,
			width : 690
		});
		loadAddress(0);
		return grid;
	};

	function createMainPanel() {
		var panel = new Ext.Panel({
			layout : 'border',
			autoScroll : true,
			closable : false,
			border : false,
			items : [treePanel, gridPanel]
		});
		return panel;
	};

	function loadAddress(node, event) {
		nodeId = node ? node.id : "0";
		typeStore.load({
			params : {
				parentId : nodeId
			}
		});
	};

	function addAddress() {
		location.href = "/itsm/common/preAddIssueAddress.do?method=preAdd&nodeId=" + nodeId;
	};

	function delAddress() {
		var record = gridPanel.getSelectionModel().getSelected();
		IssueAddressService.canDeleteIssueAddress(record.get('id'), function(returnValue) {
			if (returnValue > 1) {
				var emsg;
				switch(returnValue){
					case(2): {
						emsg = '地点包含子类型，无法删除！';
						break;
					}
//					case(3): {
//						emsg = '有' + issueType + '工单链接到该' + issueType + '类型，无法删除！';
//						location.href = "/itsm/common/preDeleteIssueType.do?id=" + record.get('id') + "&method=preDelete";
//						return;
//					}
					case(4): {
						emsg = '请选择要删除的地点！';
						break;
					}
					case(5): {
						emsg = '该地点已经被删除！';
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
				location.href = "/itsm/common/preDeleteIssueAddress.do?id=" + record.get('id') + "&method=preDelete";
			}
		});
	};

	function editAddress() {
		var record = gridPanel.getSelectionModel().getSelected();

		location.href = "/itsm/common/preModifyIssueAddress.do?id=" + record.get('id') + "&method=show";
	}
}