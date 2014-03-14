Ext.namespace('Apex.maintenance.rfc');



Apex.maintenance.rfc.AllUserListTreePanel = function(userstr ,callback) {
		var root = new Ext.tree.AsyncTreeNode({
			text : '所有用户',
			id : '0',
			hasChildren : true,
			expanded : true
		});
		var paramArray = new Array();
		//paramArray.push(actionid);
		paramArray.push(userstr.split(','));
		var treeLoader = new Ext.ux.DWRTreeLoader({
			loadParams : paramArray,
			dwrCall : SecurityService.getCheckedAllUserTree
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
		panel.on('checkchange',handCheckChange)
		return panel;
		
		function handCheckChange(){
			var checkedNodes = panel.getChecked();
			callback(checkedNodes);
			 
		}
}

/**
*@param actionid 权限id 
*@param userstr 已选择了的用户名串 如: "admin,张三"
*/
Apex.maintenance.rfc.SelectAllUsersWindow = function(userstr ,callback) {
	 
	var submitBtn = null;
	var cancelBtn = null;
	var mainWin = null;  
	var mainPanel = null;
	var userListTree =null;
	
	function buildWindow() {
		//user tree
		userListTree = new Apex.maintenance.rfc.AllUserListTreePanel(userstr ,callback); 
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

	return this;
};
