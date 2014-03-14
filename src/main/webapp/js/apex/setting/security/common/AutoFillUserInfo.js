
function autoFillUserInfo(textFieldId,flag){
	var value = document.getElementById(textFieldId).value.trim();
	if(null == value || "" == value)
		return;
	var property = "internetAccount";
	if(textFieldId == 'phone')
		property = 'mobile';
	if(textFieldId == 'jobNumber')
		property = 'employeeNo';
	var loadMask = new Ext.LoadMask(Ext.getBody(), {
								msg : "正在获取数据，请稍侯..."
							});
		loadMask.show();
	SecurityService.getUserInfosByOneProperty(property,value,function(data){
		loadMask.hide();
		if(0 == data.length && !flag){
			Ext.Msg.show({
							title : '提示',
							msg : '无任何匹配用户！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.INFO
						});
		}else if(1 == data.length){//查出来的用户唯一，则直接将用户的各项信息填到表单
			var user = data[0];
			document.getElementById('requestUser').value = user['realName'] == 'null' ? "" : user['realName'];
			document.getElementById('department').value = user['department'] == 'null' ? "" : user['department'];
			var originalTelephone = $("#phone").val();
			if(Ext.isEmpty(originalTelephone))
				document.getElementById('phone').value = user['telephone'] == 'null' ? "" : user['telephone'];
			document.getElementById('email').value = user['email'] == 'null' ? "" : user['email'];
			document.getElementById('jobNumber').value = user['employeeNo'] == 'null' ? "" : user['employeeNo'];
			document.getElementById('internetAccount').value = user['internetAccount'] == 'null' ? "" : user['internetAccount'];
			
			
			if(!Ext.isEmpty(user['taskNotifier'])){
	        	$("#vipText").html("<font color='red'>"+ user['taskNotifier'] + "</font>");
	        	document.getElementById("vipDiv").style.display = "block";
        	}else{
        		document.getElementById("vipDiv").style.display = "none";
        	}
			
			
		}else if(data.length > 1){//查出来的用户不唯一，则给出一个列表让用户选择
			var gridPanel = createGridPanel(data);
			var closBtn = new Ext.Button({
				text : '关闭',
				minWidth : 80,
				handler : function() {
					newWindow.close();
				}
			});
	       var confirmBtn = new Ext.Button({
				text : '确定',
				minWidth : 80,
				handler : function() {
					var selMode = gridPanel.getSelectionModel();
					var record = selMode.getSelected();
					if(!Ext.isEmpty(record)){
						var realName = record.get('realName');
						if('null' == realName || Ext.isEmpty(realName))
							document.getElementById('requestUser').value = '';
						else
							document.getElementById('requestUser').value = realName;
						
						var department = record.get('department');
						if('null' == department || Ext.isEmpty(department))
							document.getElementById('department').value = '';
						else
							document.getElementById('department').value = department;
						
						var originalTelephone = $("#phone").val();
						if(Ext.isEmpty(originalTelephone)){
							var telephone = record.get('telephone');
							if('null' == telephone || Ext.isEmpty(telephone))
								document.getElementById('phone').value = '';
							else
								document.getElementById('phone').value = telephone;
						}
						
						var email = record.get('email');
						if('null' == email || Ext.isEmpty(email))
							document.getElementById('email').value = '';
						else
							document.getElementById('email').value = email;
						
						var employeeNo = record.get('employeeNo');
						if('null' == employeeNo || Ext.isEmpty(employeeNo))
							document.getElementById('jobNumber').value = '';
						else
							document.getElementById('jobNumber').value = employeeNo;
					    
					    var internetAccount = record.get('internetAccount');
						if('null' == internetAccount || Ext.isEmpty(internetAccount))
							document.getElementById('internetAccount').value = '';
						else
							document.getElementById('internetAccount').value = internetAccount;
						if(!Ext.isEmpty(record.get('taskNotifier'))){
				        	$("#vipText").html("<font color='red'>" + record.get('taskNotifier') + "</font>");
				        	document.getElementById("vipDiv").style.display = "block";
			        	}else{
			        		document.getElementById("vipDiv").style.display = "none";
			        	}
					}
					newWindow.close();
				}
			});
			var newWindow = new Ext.Window({
					title : '选择用户',
					closable : true,
					width : 800,
					border : false,
					modal : true,
					layout : 'fit',
					plain : true,
					resizable : false,
					items : [gridPanel],
					buttons :[confirmBtn,closBtn],
					buttonAlign : 'center'
				});
//				newWindow.setPosition(400,400);
				newWindow.show();
		}
	})
}

function createGridPanel(metaData){
	var data = {
		rows : metaData
	};
	var jsonStore = new Ext.data.JsonStore({
		root : 'rows',
		data : data,
		fields :[
		{name:'userName',mapping:'userName'},
		{name:'realName',mapping:'realName'},
		{name:'telephone',mapping:'telephone'},
		{name:'department',mapping:'department'},
		{name:'employeeNo',mapping:'employeeNo'},
		{name:'internetAccount',mapping:'internetAccount'},
		{name:'email',mapping:'email'},
		{name:'taskNotifier',mapping:'taskNotifier'}//技能描述
		],
		autoLoad : true
	});
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel({
		singleSelect :true
	});
	checkboxSelect.on('selectionchange', handleCheckChange);
	var columns = [new Ext.grid.RowNumberer(), checkboxSelect, {
					header : "用户名",
					dataIndex : 'userName',
					width : 80,
					sortable : true
				}, {
					header : "真实名",
					dataIndex : 'realName',
					width : 80,
					sortable : true
				}, {
					header : "学工号",
					dataIndex : 'employeeNo',
					width : 80,
					sortable : true
				}, {
					header : "上网账号",
					dataIndex : 'internetAccount',
					width : 120,
					sortable : true
				}, {
					header : "部门",
					dataIndex : 'department',
					width : 80,
					sortable : true
				}, {
					header : "电话",
					dataIndex : 'telephone',
					width : 80,
					sortable : true
				}, {
					header : "邮箱",
					dataIndex : 'email',
					width : 120,
					sortable : true
				}];
	var resultPanel = new Ext.grid.GridPanel({
		store : jsonStore,
		columns : columns,
		sm : checkboxSelect,
		autoScroll : true,
		enableHdMenu : false,
		autoExpandColumn : 7,
		height : 300
	});
	return resultPanel;
}
function handleCheckChange(){
	
}
function fireFoxHandlerEvent(evt){
	  if(evt.keyCode == 13 && evt.ctrlKey){
	  	    alert('impossible');
	  		alert(evt.srcElement.id);
	  }
}

function ieHandlerEvent(evt){
	if(evt.keyCode == 10 && evt.ctrlKey){
		  alert('impossible');
	  		alert(evt.srcElement.id);
	}
}
