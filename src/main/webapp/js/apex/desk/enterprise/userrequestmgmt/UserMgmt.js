UserMgmtPanel = function() {
	// 部门树
	var tree = new Apex.desk.usermgmt.DepartmentTreePanel();
	var deptName = null;// 部门ID
	tree.on('click', fn);

	function fn(node, e) {
		if (node.id != -1) {
			deptName = node.text;// 部门名称
			// 请求加载数据
			loadTableData();
		}
	}

	// 表格里每行存放的对象json结构
	var tableRecord = Ext.data.Record.create([{
		name : 'id',
		mapping : 'id'
	}, {
		name : 'title',
		mapping : 'title'
	}, {
		name : 'requestUser',
		mapping : 'requestUser'
	}, {
		name : 'processCode',
		mapping : 'processCode'
	}, {
		name : 'createTime',
		mapping : 'createTime'
	}, {
		name : 'expectedCompleteTime',
		mapping : 'expectedCompleteTime'
	}, {
		name : 'wfDataEntityType',
		mapping : 'wfDataEntityType'
	}, {
		name : 'processor',
		mapping : 'processor'
	}, {
		name : 'priority',
		mapping : 'priority'
	}, {
		name : 'telephone',
		mapping : 'telephone'
	}, {
		name : 'email',
		mapping : 'email'
	}]);

	var checkboxSelect = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});
	
	checkboxSelect.on('selectionchange', handleCheckChange);

	var columns = [new Ext.grid.RowNumberer(), {
		header : "序号",
		dataIndex : 'id',
		width : 10,
		hidden : true,
		sortable : true
	}, {
		header : "工单号",
		dataIndex : 'processCode',
		width : 10,
		hidden : true,
		sortable : true
	}, {
		header : "标题",
		dataIndex : 'title',
		width : 120,
		renderer : function(data,mediData,record) {
			var processCode = record.get('processCode');
			return '<a href=# onclick="showRequestDetail_total(\''+processCode+'\');">' + data + '</a>';
		},
		sortable : true
	}, {
		header : '类型',
		dataIndex : 'wfDataEntityType',
		width : 150,
		renderer :function(data){if(!Ext.isEmpty(data))return data.name;},
		sortable : true
	}, {
		header : "请求人",
		dataIndex : 'requestUser',
		width : 120,
		sortable : true
	}, {
		header : "请求时间",
		dataIndex : 'createTime',
		width : 120,
		renderer : dateFormat,
		sortable : true
	}, {
		header : '期望完成时间',
		dataIndex : 'expectedCompleteTime',
		width : 120,
		renderer : dateFormat,
		sortable : true
	}, {
		header : "手机",
		dataIndex : 'telephone',
		width :120,
		sortable : true
	}, {
		header : "邮件地址",
		dataIndex : 'email',
		width :150,
		sortable : true
	}];

	// 定义数据reader,用来转换通过proxy取回的服务器端数据对象，转换成recod,并加载到store中。
	var reader = new Ext.data.JsonReader({
		totalProperty : "DataSize",
		root : "DataList",// 服务器端返回的map对象的key
		id : "id"
	}, tableRecord);

	// 相当于数据源
	var tableStore = new Ext.data.Store({
		proxy : new Ext.ux.data.DWRProxy({
			dwrFunction : DeskPersonalService.getUnprocessRequestByDeptName,// 调用服务器端方法
			listeners : {
				'beforeload' : function(dataProxy, params) {
					var loadArgs = [params.start, params.limit];
					if(null == deptName)
						deptName = 'ALL';
					var loadArgs = [params.start, params.limit, deptName];
					params[dataProxy.loadArgsKey] = loadArgs;
				}
			}
		}),
		reader : reader
	});

	// ---------------- 右侧table -------------------
	// 定义一个paging bar
	var pagingBar = new Ext.PagingToolbar({
		pageSize : 20,// 每页显示的数据条数
		store : tableStore,// 数据源
		displayInfo : true,
		displayMsg : '显示 {0} - {1} 条记录，共 {2}条记录',
		emptyMsg : "没有任何记录"
	});
	
	var delBtn = new Ext.Button({
				text : '删除',
				cls : 'x-btn-text-icon',
				disabled : true,
				isPermission : USER.isAble('incident_delete'),
				icon : ResourceConstants.DELETE_BUTTON_PNG,
				handler : deleteRequest,
				minWidth : 80
			});
	var delSeparator = new Ext.Toolbar.Separator(USER.isAble('incident_delete'));
	var refreshBtn = new Ext.Button({
				text : '刷新',
				cls : 'x-btn-text-icon',
				icon : ResourceConstants.REFRESH_BUTTON_PNG,
				handler : refreshRequest,
				minWidth : 80
			});

	var resultPanel = new Ext.grid.GridPanel({
		region : "center",
		loadMask : '正在加载数据，请稍候...',
		store : tableStore,
		autoExpandColumn : 3,// 自动扩展
		columns : columns,
		sm : checkboxSelect,
		autoScroll : true,
		enableHdMenu : false,
//		tbar : [delBtn, delSeparator, refreshBtn],
		margins : '5 0 0 0',
		bbar : pagingBar
	});

	function loadTableData() {
		tableStore.load({
			params : {
				start : 0,
				limit : 20
			}
		});
	}

	var rightTabPanel = new Ext.Panel({
		region : 'center',
		layout : 'fit',
		border : false,
		items : [resultPanel],
		margins : '5 5 5 0'
	});
	
		var innerWidth;
	if (window.innerWidth) {
		innerWidth = window.innerWidth;
	} else {
		innerWidth = document.body.clientWidth;
	}

	var innerHeight;
	if (window.innerHeight) {
		innerHeight = window.innerHeight;
	} else {
		innerHeight = document.body.clientHeight;
	}
	
	this.panel = new Ext.Panel({
		layout : 'border',
		region : 'center',
		width: innerWidth,
		height: innerHeight - 218,
		renderTo : 'mainBodyDiv',
		items : [tree, rightTabPanel]
	});
	loadTableData();
	return this.panel;
	/**
	 * 响应表格选择事件
	 */
	function handleCheckChange(checkMode) {
		if (checkMode.getCount() == 0) {
			delBtn.setDisabled(true);
		} else {
			delBtn.setDisabled(false);
		}
	}

	/**
	 * 删除请求
	 */
	function deleteRequest(){
			// TODO ADD 权限检查
		var confirmBox = Ext.MessageBox.confirm('确认', '您确认删除该用户请求？',
				function(id) {
					if (id == 'yes') {
						var selectedRecord = checkboxSelect.getSelected();
						IncidentService.deleteRequest(selectedRecord.get('id'), function(returnValue){
							  if(returnValue){
									loadTableData(deptName);
		    		            }else{
		    		            	Ext.MessageBox.show({
										title : '错误',
										msg : '发生错误或异常，删除失败！',
										buttons : Ext.MessageBox.OK,
										fn : function() {
											loadTableData(deptName);
										},
										icon : Ext.MessageBox.ERROR
									});
		    		            }
						});

					}
				});
	}

	/**
	 * 刷新请求
	 */
	function refreshRequest(){
		loadTableData(deptName);
	}
}

dwr.engine.setErrorHandler(errorHandler);
Ext.onReady(function() {
	SecurityService.getUserVoByUserName(null, {
				callback : function(user) {
					USER = new Apex.security.User({
						userName : user.userName,
						loginTime : user.loginTime,
						role : user.roleNames,
						permission : user.actionIds
					});
					var panel = new UserMgmtPanel();
				}
			});
	        
		});
/**
 * 这样写是为了以后删除正确返回的，这个功能待续
 */
function showRequestDetail_total(processCode){
	location.href = "/itsm/ssd/viewRequestDetail.do?ISSUE_CODE="+processCode;
}