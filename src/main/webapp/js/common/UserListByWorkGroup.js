Ext.namespace('Apex.common');
Apex.common.UserListByWorkGroup = function(){
	var treePanel = null;
	var newWindow = null;
	this.showUserList = function(){
		 treePanel = createTreePanel();
		 newWindow = new Ext.Window({
			title : '选择用户',
			closable : true,
			border : false,
			modal : true,
			resizable : false,
			width : 250,
			items : [treePanel],
			buttons : [{
				id : 'confirmSelectUser',
				text : '确定',
				handler : confirmSelectUser
			}, {
				text : '清空',
				handler : clearSelectedUser
			}],
			buttonAlign : 'center'
		});
	  newWindow.show();
	}
	
	function createTreePanel(){
		var root = new Ext.tree.AsyncTreeNode({
			text : '所有用户',
			id : '0',
			hasChildren : true,
			expanded : true
		});
	var paramArray = new Array();
	paramArray.push(selectedUserIdArray);
	var treeLoader = new Ext.ux.DWRTreeLoader({
		    loadParams : paramArray,
			dwrCall : CommonService.getUserListByWorkGroup
			});
	var panel = new Ext.tree.TreePanel({
			loader : treeLoader,
			autoScroll : true,
			lines : true,
			frame : false,
			width:240,
			height : 340,
			root : root
		});
		panel.on('checkchange', selectChildNodes, panel);
		return panel;
	}
	
    function selectChildNodes(node, checked) {
		node.expand();
		node.attributes.checked = checked;
		node.eachChild(function(child) {
					child.ui.toggleCheck(checked);
					child.attributes.checked = checked;
					child.fireEvent('checkchange', child, checked);
				});
    }
	
	function confirmSelectUser(){
		var originalContent = $("#selectedDutyUser").text();
		var addContent = "";
		var treeNodes = treePanel.getChecked();
		var userNodes = new Array();
		selectedUserIdArray.length = 0;//清空已选择的用户
		selectedUserRealNameArray.length = 0;//清空以选择用户的真是名字
		for(var i=0;i<treeNodes.length;i++){
			if(treeNodes[i].leaf){
				userNodes.push(treeNodes[i]);
				selectedUserIdArray.push(treeNodes[i].id);
				selectedUserRealNameArray.push(treeNodes[i].text);
			}
		}
		if(userNodes.length != 0){
			addContent=userNodes[0].text;
			for(var i=1;i<userNodes.length;i++){
				addContent+="；"+userNodes[i].text;
			}
			$("#selectedDutyUser").text(addContent);
		}
		if(userNodes.length == 1){
			 var monthValue = $("#monthValue").text().trim();
			 if(monthValue.length == 1)
			 	monthValue = "0"+monthValue;
			 var yearMonth = $("#yearValue").text()+"-"+monthValue;
			 DutyService.getFixedMonthRecordsByUserName(userNodes[0].id,yearMonth,function(returnData){
			 	if(!Ext.isEmpty(returnData)){
		 		    var index = 0;
		 			for(var i=1;i<32;i++){
						if(null != $("#select"+i)){
							$("#select"+i).val(returnData[index]);
							index++;
						}
					}
			 	}
			 	newWindow.close();
			 })
		}else{
			newWindow.close();
		}
	}
	
	function clearSelectedUser(){
		selectedUserIdArray.length = 0;
		selectedUserRealNameArray.length = 0;
		$("#selectedDutyUser").text("");
		newWindow.close();
	}
	
	function isAlreadyAdd(userId){
		for(var i=0;i<selectedUserIdArray.length;i++){ 
			if(selectedUserIdArray[i]==userId) { 
    	    	return true; 
           } 
       } 
       return false; 
	}
}