document.write("<script type='text/javascript' src='/itsm/dwr/interface/IssueTypeService.js'></script>");

Ext.namespace('Apex.common');
Apex.common.TypeList = function(fieldId, type) {
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
	sureBtn.setDisabled(true);
	function createTreePanel() {
		if(!isNaN(type)) type = type == 1 ? "INC" : type == 2 ? "PRO" : type == 3 ? "RFC" : 'REL';
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
			loadParams : [type, false],
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
			border : false,
			width : 250,
			height : 340,
			root : root
		});
		panel.on('dblclick', handleDbClick);
		panel.on('click', function(selectdeNode) {
			if (selectdeNode.id == 0)
				Ext.getCmp('confirmSelectType').setDisabled(true);
			else if (selectdeNode.id > 0)
				Ext.getCmp('confirmSelectType').setDisabled(false);
			else
				Ext.getCmp('confirmSelectType').setDisabled(true);
		});
		return panel;
	}

	function handleDbClick() {
		var treeNode = treePanel.getSelectionModel().getSelectedNode();
		if(!Ext.isEmpty(treeNode)){
			// 避免用户双击所有类型
			if (treeNode.id != 0 && !treeNode.hasChildNodes()) {
				newWindow.close();
				var value = Ext.util.Format.htmlDecode(treeNode.text);
				var finalValue = value.replace(/&nbsp;/g," ");
				finalValue = finalValue.replace("&frasl;","/");
				document.getElementById(fieldId).value = finalValue;
				$('#'+fieldId+'_id').val(treeNode.id);
				fixedHandler(treeNode.id);
				$("#"+fieldId).blur();
				//document.getElementById(fieldId).blur();
			}
		}
	}

	function confirmSelectType() {
		var treeNode = treePanel.getSelectionModel().getSelectedNode();
		newWindow.close();
		var value = Ext.util.Format.htmlDecode(treeNode.text);
		var finalValue = value.replace(/&nbsp;/g," ");
		finalValue = finalValue.replace("&frasl;","/");
		document.getElementById(fieldId).value = finalValue;
		$('#'+fieldId+'_id').val(treeNode.id);
		fixedHandler(treeNode.id);
		$("#"+fieldId).blur();
		//document.getElementById(fieldId).blur();
	}
	
	function fixedHandler(id){
		IssueTypeService.findWfDataEntityTypeById(id, function(data){
			var fixedHandler = document.getElementById("fixedHandler");
			var fixedHandlerName = document.getElementById("fixedHandlerName");
			if(fixedHandlerName && fixedHandler){
				if(data.principal){
					document.getElementById("fixedHandler").value = data.principal.realName;
					document.getElementById("fixedHandlerName").value = data.principal.name;
				}else{
					document.getElementById("fixedHandler").value = '';
					document.getElementById("fixedHandlerName").value = '';
				}
			}
		});
	}
}