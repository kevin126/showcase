Ext.namespace("Apex.cmdb.citype");
Apex.cmdb.citype.CITreePanel = function() {
	var root = new Ext.tree.AsyncTreeNode({
			text : 'CI类型',
			id : '0',
			hasChildren : true,
			disabled : true,
			expanded : true
		});
		var treeLoader = new Ext.ux.DWRTreeLoader({
			dwrCall : CIService.getCITypeTree
			});
		var panel = new Ext.tree.TreePanel({
			loader : treeLoader,
			autoScroll : true,
			lines : true,
			selModel : new Ext.tree.DefaultSelectionModel({}),
			frame : false,
			width : 240,
			height : 340,
			root : root
		});
		//panel.expandAll();
		return panel;
}


function showTreeWin(treePanel, field, hiddenField,hiddenCiTypeIcon){
	
		var ciTypeWindow = new Ext.Window({
			title : '选择CI类型',
			closable : true,
			width : 260,
			autoHeight : true,
			plain : true,
			resizable : false,
			modal : true,
			items : [treePanel],
			buttons : [
				{text : '确定',
					handler : function() {
						var node = treePanel.getSelectionModel().getSelectedNode();
						if(node){
							setFieldValue(node, field, hiddenField, hiddenCiTypeIcon,ciTypeWindow);
							ciTypeWindow.close();
						}else{
							 Ext.MessageBox.show({
				      			title: '提示',
								msg: '请选择类型！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO
				           });
						}
					}
				},
				{text : '取消',
					handler : function() {
						ciTypeWindow.close();
					}
				}
			]
		});
		treePanel.on("dblclick", function(node, evt){
			var node = treePanel.getSelectionModel().getSelectedNode();
			if(node){
				setFieldValue(node, field, hiddenField, hiddenCiTypeIcon, ciTypeWindow);
			}
		});
		ciTypeWindow.show();
}

function setFieldValue(node, field, hiddenField, hiddenCiTypeIcon, ciTypeWindow){
	if(node.disabled || node.id == '0'){
		Ext.MessageBox.show({
			title: '警告',
			msg: '根节点不允许选择！',
			buttons : Ext.MessageBox.OK,
			icon : Ext.MessageBox.WARNING,
			fn : function(returnValue) {
			}
		});
		field.setValue("");
		return;
	}
	var pathName = getPathName(node);
	//alert(pathName);
	field.setValue(pathName);
	hiddenField.setValue(node.id);
	hiddenCiTypeIcon.setValue(node.attributes.icon);
	ciTypeWindow.close();
	
	function getPathName(node ){
		if(node ){
			if(node.text=='CI类型')return"";
			var pName= getPathName(node.parentNode);
			if(pName==""){
				return node.text;
			}else{
				return pName+"/" +node.text;
			}
		}else{
			return "";
		}
	}
	
}
