document.write("<script type='text/javascript' src='/itsm/dwr/interface/SearchService.js'></script>");

Ext.namespace('Apex.common');
Apex.common.StateMultiList = function(fieldId, type) {
	var treePanel = null;
	var newWindow = null;
	var sureBtn = new Ext.Button({
		id : 'confirmSelectType',
		text : '确定',
		minWidth : 70,
		handler : confirmSelectType
	});
	var cancelBtn = new Ext.Button({
		text : '取消',
		minWidth : 70,
		handler : function() {
			newWindow.close();
		}
	});
	this.showStateList = function() {
		treePanel = createTreePanel();
		newWindow = new Ext.Window({
			title : '选择状态',
			closable : true,
			border : false,
			modal : true,
			resizable : false,
			width : 264,
			items : [treePanel],
			buttons : [sureBtn, cancelBtn],
			buttonAlign : 'center'
		});
		newWindow.show();
	}
	function createTreePanel() {
		if(!isNaN(type)) type = type == 1 ? "INC" : type == 2 ? "PRO" : type == 3 ? "RFC" : type == 4 ? "REL" : '';
		type = type.toUpperCase();
		var root = new Ext.tree.AsyncTreeNode({
			text : '所有状态',
			id : '0',
			disabled : true,
			hasChildren : true,
			devNodeType : 'root',
			expanded : true
		});
		var treeLoader = new Ext.ux.DWRTreeLoader({
			loadParams : [type],
			preloadChildren : true,
			dwrCall : SearchService.importStateTree,
			waitMessage : new Ext.LoadMask(Ext.getBody(), {
				msg : "正在读取数据，请稍等..."
			})
		});
		var panel = new Ext.tree.TreePanel({
			loader : treeLoader,
			collapsible : true,
			autoScroll : true,
			lines : true,
			split : true,
			frame : false,
			width : 250,
			height : 340,
			root : root
		});
		return panel;
	}

	function confirmSelectType() {
		var treeNode = treePanel.getChecked();
		newWindow.close();
		var text = "";
		for(var i=0; treeNode && i<treeNode.length; i++){
			if(treeNode.length - 1 == i)
				text += treeNode[i].text;
			else
				text += treeNode[i].text + "，";
		}
		document.getElementById(fieldId).value = $.trim(text);
	}
}