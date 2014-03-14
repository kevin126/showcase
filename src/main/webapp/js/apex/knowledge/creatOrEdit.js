Ext.namespace('Apex.maintenance.knowledge');
function submitComment(obj,oper){
	//obj.disabled= true;
	document.getElementById("oper").value = oper;
	//document.getElementById("knoform").submit();
}

function goback(){
	window.history.back();
}

function selectKnowledgeType(eleObj){
	
 	var type = new Apex.maintenance.knowledge.SelectKnowledgeTypeTree();
 	type.showSelectTypeTree(eleObj);
}

Apex.maintenance.knowledge.SelectKnowledgeTypeTree = function (){
	
	var typeTree = null;
	var treeWindow = null;
	var srcElement =null; //响应选择窗口的事件源html
	var checkedNodeNow = null;
	this.showSelectTypeTree = function (eleObj){
		srcElement = eleObj;		
		treeWindow = getTreeWindow();
		treeWindow.show();
		selectTypedInit(typeTree);
	}
	
	function getTreeWindow(){
		typeTree = createTypeTreePanel();
		var win ;	
		treeWindow = new Ext.Window({
					title : '选择知识库类型',
					closable : true,
					width : 300,
					border : false,
					plain : true,
					resizable : false,
					modal : true,
					items : [typeTree],
					buttons : [{
								text : '确定',
								id : 'Apex.knoType.OK',								
								disabled : true,
								handler : selectType
							}, {
								text : '清空',
								handler :clear
							}],
					buttonAlign : 'center'
				});
				
		return  treeWindow;		
	}
	
	function createTypeTreePanel (){
		var root = new Ext.tree.AsyncTreeNode({
					text : '知识库类型',
					checked : false,
					id : '0',
					disabled :true,
					expanded : true
				});
		var panel = new Ext.tree.TreePanel({
					loader : new Ext.ux.DWRTreeLoader({
								dwrCall : KnowledgeService.getCheckedKnowledgeTree
							}),
					autoScroll : true,
					lines : true,
					frame : false,
					height : 350,
					root : root
				});
		panel.on('checkchange', selectChildNodes, panel);
		panel.expandAll();		
		return panel;
	}
	
	/** 选择一个类型*/
	function selectChildNodes(node, checked){
		var selectNodes = typeTree.getChecked();
		if(selectNodes.length>0){
				Ext.getCmp('Apex.knoType.OK').setDisabled(false);
		}else{
				Ext.getCmp('Apex.knoType.OK').setDisabled(true);
		}		
		if(this.checkedNode == node) return; 		
		node.expand(); 
		if(!this.checkedNode){
			this.checkedNode = node; 
		}else{ 
			this.checkedNode.checked = false;
			this.checkedNode.ui.toggleCheck(false)
		}		 
		this.checkedNode = node; 
		
	}
	
	/**原有已选择的类*/
	function selectTypedInit(panelObj){ 
		var node  = panelObj.getRootNode();
		selectText = 	srcElement.value;
		var tem = node.findChild();
		node.eachChild(function(child) {
					alert(child.attributes.text + "  :  " + selectText);		
					if(child.attributes.id == selectText){
						child.ui.toggleCheck(checked);
						child.attributes.checked = checked;
						child.fireEvent('checkchange', child, checked);
					}
				});
		
		
	}
	
	
	function selectType(){
		var selectNodes = typeTree.getChecked();
		
		if (selectNodes.length != 0) {
			var returnText = "";
			var firstNode = selectNodes[0];
			if (firstNode.id == '0' && selectNodes.length == 1) {
				if(srcElement.options){					
					srcElement.options[0].text ="请选择!";
					srcElement.options[0].value="";
					try{
						document.getElementById(srcElement.id+"Tip").className="onError";
						document.getElementById(srcElement.id+"Tip").innerHTML="类型不能为空！";
					}catch(e){}
				}
			}else{
				if(srcElement.options){
					srcElement.options[0].text =Ext.util.Format.htmlDecode(firstNode.text);
					srcElement.options[0].value =firstNode.id;
					try{
						document.getElementById(srcElement.id+"Tip").className="onCorrect";
						document.getElementById(srcElement.id+"Tip").innerHTML="输入正确！";
					}catch(e){}
				}
			}			 
		}
		if (null != treeWindow)
			treeWindow.close();
	}
	
	function clear(){
		var selectNodes = typeTree.getChecked();
		if (selectNodes.length != 0) {
			var firstNode = selectNodes[0];
			firstNode.ui.toggleCheck(false);
			firstNode.checked = false;
		}
		if(srcElement.options){
				srcElement.options[0].text ="请选择！";
				srcElement.options[0].value="";
				try{
					document.getElementById(srcElement.id+"Tip").className="onError";
					document.getElementById(srcElement.id+"Tip").innerHTML="类型不能为空！";
				}catch(e){}
		}
		if (null != treeWindow){
			treeWindow.close();
		}
	}
	
	 


}

