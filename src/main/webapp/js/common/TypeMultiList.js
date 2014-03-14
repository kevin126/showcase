document.write("<script type='text/javascript' src='/itsm/dwr/interface/IssueTypeService.js'></script>");

Ext.namespace('Apex.common');
Apex.common.TypeMultiList = function(fieldId, type) {
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
	this.showTypeList = function() {
		treePanel = createTreePanel();
		newWindow = new Ext.Window({
			title : '选择类型',
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
		if(!isNaN(type)) type = type == 1 ? "INC" : type == 2 ? "PRO" : type == 3 ? "RFC" : type == 4 ? "REL" : type== 5 ? 'CWF' : '';
		type = type.toUpperCase();
		var root = new Ext.tree.AsyncTreeNode({
			text : '所有类型',
			id : '0',
			disabled : true,
			hasChildren : true,
			devNodeType : 'root',
			expanded : true
		});
		var treeLoader = new Ext.ux.DWRTreeLoader({
			loadParams : [type, true],
			preloadChildren : true,
			dwrCall : IssueTypeService.importIssueTypeTree,
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
		var id = "";
		for(var i=0; treeNode && i<treeNode.length; i++){
			if(treeNode.length - 1 == i){
				text += treeNode[i].text;
				id +=treeNode[i].id;
			}else{
				text += treeNode[i].text + "，";
				id +=treeNode[i].id  + " ";;
			}
		}
		var procetype  = document.getElementById('processType');
		if(procetype  ){
			procetype.value = id;  
		}
		document.getElementById(fieldId).value = $.trim(text);
	}
}