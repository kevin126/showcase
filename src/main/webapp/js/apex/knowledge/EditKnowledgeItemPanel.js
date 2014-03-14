Ext.namespace('Apex.maintenance.knowledge');
Apex.maintenance.knowledge.EditKnowledgeItemPanel = function(record,callbackFn,again) {
	this.record = record;
	this.callbackFn = callbackFn;
	this.again = again;
	var titleText = null;
	var tagsText = null;
	var errArea = null;
	var methodArea = null;
	var typeTrigger = null;
	var knowledgePanel = null;
	var refuseCausePanel = null;
    var typeTree = null;
    var selectedTypeNode = null;
    var wfItemStore = null;
	var newWindow = null;
	var finalPanel = null;
	this.showPanel = function(){
	    knowledgePanel = createAddKnowledgeItemPanel();
	    refuseCausePanel = createRefuseGridPanel();
	    finalPanel = new Ext.Panel({
	    	border : false,
	    	height : 530,
	    	layout :'card',
	    	activeItem: 0,
	    	items : [knowledgePanel,refuseCausePanel]
	    })
	    if(Ext.isEmpty(callbackFn))
	    	var title = '查看';
	    else
	    	var title = '编辑';
		newWindow = new Ext.Window({
			title : title,
			closable : true,
			width : 700,
			border : false,
			modal : true,
			plain : true,
			resizable : false,
			items : [finalPanel]
		});
	 newWindow.show();
	}
	
	/**
	 * 创建formPanel
	 */
	function createAddKnowledgeItemPanel(){
		var readOnlyValue = false;
		if(Ext.isEmpty(callbackFn))
			readOnlyValue = true;
		titleText = new Ext.form.TextField({
			        id : 'txt',
					fieldLabel : '标题',
					allowBlank : false,
					vtype : 'SpecialChar',
					readOnly : readOnlyValue,
					maxLength : 100,
					anchor : '90%'
				});
		tagsText = new Ext.form.TextField({
					fieldLabel : '关键字',
					vtype : 'SpecialChar',
					readOnly : readOnlyValue,
					maxLength : 100,
					anchor : '95%'
				});
		errArea = new Ext.form.TextArea({
		    fieldLabel : '错误现象',
		    anchor : '95%',
		    allowBlank : false,
		    readOnly : readOnlyValue,
		    maxLength : 20000,
		    minLength : 10,
		    height : 200
		});
	    methodArea = new Ext.form.TextArea({
		    fieldLabel : '解决方案',
		    anchor : '95%',
		    allowBlank : false,
		    readOnly : readOnlyValue,
		    maxLength : 20000,
		    minLength : 10,
		    height : 200
		});
		//赋值
		titleText.setValue(record.get('title'));
		tagsText.setValue(record.get('tags'));
		errArea.setValue(record.get('problemDescription'));
		methodArea.setValue(record.get('resolveMethod'));
	   if(!Ext.isEmpty(callbackFn)){
		   typeTrigger = new Ext.form.TriggerField({
				fieldLabel : '知识库类型',
				allowBlank : false,
				hideTrigger : false,
				value : record.get('typeName'),
				readOnly : true,
				anchor : '90%',
				onTriggerClick : showKnowledgeTypePanel
			});
	   }else{
	   		typeTrigger = new Ext.form.TextField({
				fieldLabel : '知识库类型',
				allowBlank : false,
				hideTrigger : false,
				value : record.get('typeName'),
				readOnly : true,
				anchor : '90%'
			});
	   }
		
		if(Ext.isEmpty(callbackFn)){//查看知识库
			var btnArray = [{
				text : '关闭',
				handler : function(){newWindow.close();}
			}];
		}else{//编辑知识库 
			if(record.get('procNode') == '已退回'){
				var btnArray = [{
					text : '存为草稿',
					formBind : true,
					handler : saveModifyToDraft
				},{
					text : '提交审核',
					formBind : true,
					handler : commitModifyToApprove
				},{
					text : '退回原因',
					handler : viewRefuseCause
				}, {
					text : '取消',
					handler : function(){newWindow.close();}
				}];
			}else{
				var btnArray = [{
					text : '存为草稿',
					formBind : true,
					handler : saveModifyToDraft
				},{
					text : '提交审核',
					formBind : true,
					handler : commitModifyToApprove
				}, {
					text : '取消',
					handler : function(){newWindow.close();}
				}];
			}
		}
		var panel = new Ext.FormPanel({
			frame : true,
			monitorValid :true,
			items : [{
				xtype : 'panel',
				layout : 'column',
				border : false,
				defaults : {
					bordr : false,
					layout : 'form',
					labelWidth : 80,
					columnWidth : .5
				},
				items : [{
					items : [titleText]
				}, {
					items : [typeTrigger]
				}]
			  }, {
				xtype : 'panel',
				layout : 'column',
				border : false,
				defaults : {
					bordr : false,
					layout : 'form',
					labelWidth : 80,
					columnWidth : .99
				},
				items : [{
					labelSeparator : '：',
					items : [tagsText]
				}]
			}, {
				xtype : 'panel',
				layout : 'column',
				border : false,
				defaults : {
					bordr : false,
					layout : 'form',
					labelWidth : 80,
					columnWidth : .99
				},
				items : [{
					labelSeparator : '：',
					items : [errArea]
				}]
			}, {
				xtype : 'panel',
				layout : 'column',
				border : false,
				defaults : {
					bordr : false,
					layout : 'form',
					labelWidth : 80,
					columnWidth : .99
				},
				items : [{
					labelSeparator : '：',
					items : [methodArea]
				}]
			}],
			buttons : btnArray,
			buttonAlign : 'center'
		});
		return panel;
	}
	
	/**
	 * 创建拒绝原因的GridPanel
	 */
	function createRefuseGridPanel(){
		var columns = [new Ext.grid.RowNumberer(), {
			header : "Id",
			dataIndex : 'id',
			width : 10,
			hidden : true,
			sortable : true
		}, {
			header : "退回人",
			dataIndex : 'operateUser',
			width : 80,
			sortable : true
		}, {
			header : "退回时间",
			dataIndex : 'recordTime',
			width : 120,
			renderer : dateFormat,
			sortable : true
		}, {
			header : "退回原因",
			dataIndex : 'recordValue',
			width : 100,
			renderer : function(value,metaData,record,rowIndex) {
					var newValue = Ext.util.Format.ellipsis(value,70);
					return '<a href=# onclick="showRefuseCauseDetail_total(\''
					+rowIndex
					+'\');">'
					+ newValue + '</a>';
				},
			sortable : true
		}];
		var wfItemRecord = Ext.data.Record.create([{
				name : 'id',
				mapping : 'id'
			}, {
				name : 'operateUser',
				mapping : 'operateUser'
			}, {
				name : 'recordTime',
				mapping : 'recordTime'
			}, {
				name : 'recordValue',
				mapping : 'recordValue'
			}]);
		var reader = new Ext.data.JsonReader({
				root : "rows",
				id : "id"
			}, wfItemRecord);
		wfItemStore = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : KnowledgeService.getRefuseWfItems,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var procKey = record.get('procKey');
									var loadArgs = [procKey];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});
		var gridPanel = new Ext.grid.GridPanel({
			    id : 'refuseCauseGridPanel',
				store : wfItemStore,
				frame : true,
				height : 530,
				autoExpandColumn : 4,
				columns : columns,
				autoScroll : true,
				enableHdMenu : false,
				tbar   :[
					{
						text : '返回',
						cls : 'x-btn-text-icon',
						icon : 'images/icons/redo-16.png',
						
						handler :returnToFormPanel
					},'-',{
						text : '取消',
						cls : 'x-btn-text-icon',
						icon : ResourceConstants.SETACCESSMODE_BUTTON_PNG,
						handler : function(){newWindow.close()}
					}
				]
			});
		wfItemStore.load();
		return gridPanel;
	}
	
	/***
	 * 查看退回原因
	 */
	function viewRefuseCause(){
		refuseCausePanel.setVisible(true);
		knowledgePanel.setVisible(false);
	}
	/**
	 * 返回到formPanel
	 */
	function returnToFormPanel(){
		refuseCausePanel.setVisible(false);
		knowledgePanel.setVisible(true);
	}
	function showKnowledgeTypePanel(){
		var typePanel = new Apex.maintenance.knowledge.KnowledgeTypePanel();
	    typeTree = typePanel.getTreePanel();
		var treeWindow = new Ext.Window({
			id : 'knowledgeTypeTreeWin',
			title : '选择知识库类型',
			closable : true,
			border : false,
			plain : true,
			width : 250,
			height : 350,
			resizable : false,
			modal : true,
			items : [typeTree],
			buttons : [{
				text : '确定',
				handler : selectKnowledgeType
			}, {
				text : '取消',
				handler : function(){treeWindow.close();}
			}],
			buttonAlign : 'center'
		});
		typeTree.on('dblclick',selectKnowledgeType)
		treeWindow.show();
	}
	
	function selectKnowledgeType(){
		var treeNode = typeTree.getSelectionModel().getSelectedNode();
		if(treeNode.text == '知识库类型')
			return;
		selectedTypeNode = treeNode;
		typeTrigger.setValue(treeNode.text);
		Ext.getCmp('knowledgeTypeTreeWin').close();
	}
	
	function saveModifyToDraft(){
		var knowledgeItem = createKnowledgeItemObject();
		var id = record.get('id');
		KnowledgeService.saveModifyToDraft(id,knowledgeItem,{
			callback : function(returnValue){
				if(returnValue){
					newWindow.close();
					if(!Ext.isEmpty(callbackFn))
						callbackFn();
				}else{
					Ext.Msg.show({
						title : '错误',
						msg : '发生错误或异常，保存失败！',
						modal : true,
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.ERROR
					});
				}
			},
			errorHandler : function(errorString, exception){
				  	Ext.MessageBox.show({
						title : '错误',
						msg : exception.message,
						buttons : Ext.MessageBox.OK,
						fn : function(){
						          newWindow.close();
								  if(!Ext.isEmpty(callbackFn))
								  	callbackFn();
								},
						icon : Ext.MessageBox.ERROR
					});
			}
		})
	}
	
	function commitModifyToApprove(){
		var confirmBox = Ext.MessageBox.confirm('确认', '确定要提交该知识库项吗？',
			function(value){
				if(value == 'yes'){
					var knowledgeItem = createKnowledgeItemObject();
					var id = record.get('id');
					KnowledgeService.commitModifyToApprove(id,knowledgeItem,again,{
						callback : function(returnValue){
							if(returnValue){
								newWindow.close();
								callbackFn();
							}else{
									Ext.Msg.show({
									title : '错误',
									msg : '发生错误或异常，提交失败！',
									modal : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});
							}
						},
						errorHandler : function(errorString, exception){
							  	Ext.MessageBox.show({
									title : '错误',
									msg : exception.message,
									buttons : Ext.MessageBox.OK,
									fn : function(){
									          newWindow.close();
											  if(!Ext.isEmpty(callbackFn))
											  	callbackFn();
											},
									icon : Ext.MessageBox.ERROR
								});
						}
					})
				}
			});
	}
	
	function createKnowledgeItemObject(){
		var knowledgeItemObject = {};
		knowledgeItemObject.tags = tagsText.getValue().trim();
		knowledgeItemObject.problemDescription = errArea.getValue().trim();
		knowledgeItemObject.resolveMethod = methodArea.getValue().trim();
		if(Ext.isEmpty(selectedTypeNode)){
			knowledgeItemObject.typeId = record.get('typeId');
			knowledgeItemObject.typeName = record.get('typeName');
		}else{
			knowledgeItemObject.typeId = selectedTypeNode.id;
			knowledgeItemObject.typeName = selectedTypeNode.text;
		}
		knowledgeItemObject.title = titleText.getValue().trim();
		return knowledgeItemObject;
	}
	
}

/**
 * 查看拒绝原因详情，全局函数
 */
function showRefuseCauseDetail_total(index){
	var gridPanel = Ext.getCmp('refuseCauseGridPanel');
	var store = gridPanel.getStore();
	var record = store.getAt(index);
	var textArea = new Ext.form.TextArea({
		    fieldLabel : '退回原因',
		    readOnly : true,
		    height : 300
	});
	textArea.setValue(record.get('recordValue'));
	var panel = new Ext.Panel({
		border : false,
		layout : 'fit',
		items : textArea
	})
	var showWin = new Ext.Window({
		title : '退回原因详情',
	    width : 500,
    	closable : true,
		border : false,
		plain : true,
		resizable : false,
		modal : true,
		items : panel,
		buttons : [{
			text : '关闭',
			handler : function(){showWin.close()}
		}],
		buttonAlign : 'center'
	});
	showWin.show();
}
	