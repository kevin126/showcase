Ext.namespace('Apex.common');
Apex.common.UserListPermissionTreePanel = function(actionid,userstr,Multichoice ,callback) {
	var checkedNodeNow = null;
	var callbackFun = callback;
	var initflag = null ;//初始标记
	var root = new Ext.tree.AsyncTreeNode({
		text : '处理人',
		id : '0',
		hasChildren : true,
		expanded : true
	});
	var paramArray = new Array();
	paramArray.push(actionid);
	paramArray.push(userstr.split(','));
	var treeLoader = new Ext.ux.DWRTreeLoader({
		loadParams : paramArray,
		dwrCall : SecurityService.getCheckedUserTreeByPermissionId
	});
	var panel = new Ext.tree.TreePanel({
		loader : treeLoader,
		autoScroll : true,
		lines : true,
		frame : false,
		width : 240,
		height : 340,
		root : root
	});
	panel.expandAll();
	panel.on('checkchange',selectChildNodes)
	return panel;
	
	function handCheckChange(node, checked){
		var checkedNodes = panel.getChecked();
		if(!isSinglechoice){//单选
			selectChildNodes(node, checked); 			 
		}		
		callback(checkedNodes);			 
	}
	
	/** 选择一个类型*/
	function selectChildNodes(node){	
		if(this.checkedNode == node) return; 
		node.expand();  
		if(!Multichoice){ 	
			selectTypedInit(this.checkedNode,node);
			if(!this.checkedNode){
				this.checkedNode = node;
			}else{
				this.checkedNode.checked = false;
				this.checkedNode.ui.toggleCheck(false)
			}		 
			this.checkedNode = node;
		} 
		var checkedNodes = panel.getChecked();
			//callback(checkedNodes);
		callbackFun(checkedNodes);	
	}
	
	/**原有已选择的类*/
	function selectTypedInit(checkfalg,eveNode){ 
		if(checkedNodeNow=="true")return;
		var node  = panel.getRootNode();
		var tem = node.findChild();
		node.eachChild(function(child) {				 
					if( child.attributes.checked==true && child !=eveNode ){
						checkfalg= child;
						checkedNodeNow="true";		
						child.checked = false;
						child.ui.toggleCheck(false)
					}
				});
		
	}
}


/**
*@param actionid 权限id 
*@param userstr 已选择了的用户名串 如: "admin,张三"
*@param isSinglechoice 是否单选  true 为单选 ,false为多选 默认单选
*/
Apex.common.SelectUsersByPermissionWindow = function(actionid,userstr,Multichoice ,callback) {	 
	var submitBtn = null;
	var cancelBtn = null;
	var mainWin = null;  
	var mainPanel = null;
	var userListTree =null;	
	var srcElement;
	srcElement = document.getElementById(userstr);
	function buildWindow() {
		//user tree
		if(!callback){
			callback = setElementValue;
		}
		var name= "";
		if(srcElement){
			  name = srcElement.value;
		}
		userListTree = new Apex.common.UserListPermissionTreePanel(actionid,name,Multichoice,setElementValue); 
		//submit button
		submitBtn = new Ext.Button({
					text : '确定',
					id : 'add_user_btn_id',
					disabled : false,
					handler : function() {						 
						mainWin.close();
					} ,
					minWidth : 80
				});        
       
       mainPanel = new Ext.FormPanel({
					frame : true,
					layout : 'form',
					labelWidth : 60,
					items : [userListTree]
				});       
		mainWin = new Ext.Window({
						title   : '选择用户',
						closable: true,
						width   : 400,
						border  : false,
						modal   : true,
						plain   : true,
						resizable : false,
						items   : [mainPanel],
						buttons : [submitBtn],
						buttonAlign : 'center'
		});			
	};
	this.getWin = function() {
		buildWindow();
		mainWin.show();
		return mainWin;
	};
	
	
	function setElementValue(data){		
		if(data){ 
			if(data.length>1){
				var str = "";
				for(var i=0 ;i <data.length ;i++){	
					str +=data[i].attributes.text+",";
				}
				str.substring(0,str.length-1);
				srcElement.value=str;
			}else if(data.length ==1){
				srcElement.value=data[0].attributes.text;
				srcElement.focus();
			}else{
				srcElement.value="";
			}
		} 
	}
	
	return this;
};


