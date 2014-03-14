Ext.namespace('Apex.maintenance.knowledge');
Apex.maintenance.knowledge.CreateKnowledgeItem = function() {
	var titleText = null;
	var tagsText = null;
	var errArea = null;
	var methodArea = null;
	var typeTrigger = null;
	var knowledgePanel = null;
    var typeTree = null;
    var selectedTypeNode = null;
	var newWindow = null;
	this.showAddPanel = function(){
	    knowledgePanel = createAddKnowledgeItemPanel();
		newWindow = new Ext.Window({
			title : '添加',
			closable : true,
			width : 700,
			border : false,
			modal : true,
			plain : true,
			resizable : false,
			items : [knowledgePanel]
		});
	 newWindow.show();
	}
	
	function createAddKnowledgeItemPanel(){
		titleText = new Ext.form.TextField({
					fieldLabel : '标题',
					allowBlank : false,
					vtype : 'SpecialChar',
					maxLength : 100,
					anchor : '90%'
				});
		tagsText = new Ext.form.TextField({
					fieldLabel : '关键字',
					vtype : 'SpecialChar',
					maxLength : 100,
					anchor : '95%'
				});
		errArea = new Ext.form.TextArea({
		    fieldLabel : '问题描述',
		    anchor : '95%',
		    allowBlank : false,
		    vtype : 'AllSpaceInput',
		    maxLength : 20000,
		    minLength : 10,
		    height : 200
		});
	    methodArea = new Ext.form.TextArea({
		    fieldLabel : '解决方案',
		    anchor : '95%',
		    allowBlank : false,
		    vtype : 'AllSpaceInput',
		    maxLength : 20000,
		    minLength : 10,
		    height : 200
		});
	   typeTrigger = new Ext.form.TriggerField({
			fieldLabel : '知识库类型',
			allowBlank : false,
			hideTrigger : false,
			readOnly : true,
			anchor : '90%',
			onTriggerClick : showKnowledgeTypePanel
		});
		var panel = new Ext.FormPanel({
			frame : true,
			monitorValid :true,
			items : [{
				xtype : 'panel',
				layout : 'column',
				border : false,
				defaults : {
					border : false,
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
					border : false,
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
					border : false,
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
					border : false,
					layout : 'form',
					labelWidth : 80,
					columnWidth : .99
				},
				items : [{
					labelSeparator : '：',
					items : [methodArea]
				}]
			}],
			buttons : [{
				text : '存为草稿',
				formBind : true,
				handler : saveAsDraft
			},{
				text : '提交审核',
				formBind : true,
				handler : directCommit
			}, {
				text : '取消',
				handler : function(){newWindow.close();}
			}],
			buttonAlign : 'center'
		});
		return panel;
	}
	
	
	function showKnowledgeTypePanel(){
	  typeTree = new Apex.maintenance.knowledge.KnowledgeTypeTreePanel();
		var treeWindow = new Ext.Window({
			id : 'knowledgeTypeTreeWin',
			title : '选择知识库类型',
			closable : true,
			border : false,
			plain : true,
			width : 250,
			height : 400,
			resizable : false,
			modal : true,
			items : [typeTree],
			buttons : [{
				id : 'selectKnowledgeTypeBtn',
				text : '确定',
				disabled : true,
				handler : selectKnowledgeType
			}, {
				text : '取消',
				handler : function(){treeWindow.close();}
			}],
			buttonAlign : 'center'
		});
		typeTree.on('dblclick',selectKnowledgeType);
		typeTree.on('click',changeConfirmBtnSatatus);
		treeWindow.show();
	}
	
	function changeConfirmBtnSatatus(node){
		if(node.text != '知识库类型')
			Ext.getCmp('selectKnowledgeTypeBtn').setDisabled(false);
		else
			Ext.getCmp('selectKnowledgeTypeBtn').setDisabled(true);
	}
	
	function selectKnowledgeType(){
		var treeNode = typeTree.getSelectionModel().getSelectedNode();
		if(treeNode.text == '知识库类型')
			return;
		selectedTypeNode = treeNode;
		typeTrigger.setValue(treeNode.text);
		Ext.getCmp('knowledgeTypeTreeWin').close();
	}
	
	function saveAsDraft(){
		var itemName = titleText.getValue();
		var typeId = selectedTypeNode.id;
		KnowledgeService.isKnowledgeConflict(typeId,itemName,function(result){
			if(result){
				Ext.Msg.show({
					title : '错误',
					msg : '该标题已经存在，保存失败！',
					modal : true,
					buttons : Ext.Msg.OK,
					icon : Ext.Msg.ERROR
				});
			}else{
				var knowledgeItem = createKnowledgeItemObject();
				var userName = USER.getUserName();
				KnowledgeService.addKnowledgeItem(knowledgeItem,userName,false,function(returnValue){
					if(returnValue){
						var treePanel = Ext.getCmp('knowledgeOperateTree');
						var fixedNode = treePanel.getNodeById('myDraft_knowledgeNode');
						if(!Ext.isEmpty(fixedNode)){
							fixedNode.ui.addClass('treeNodeBackground');
							treePanel.fireEvent('click',fixedNode);
							newWindow.close();
						}
					}else{
						Ext.Msg.show({
							title : '错误',
							msg : '发生错误或异常，保存失败！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});
					}
				})
			}
		});
	}
	
	function directCommit(){
		var confirmBox = Ext.MessageBox.confirm('确认', '确定要提交该知识库项吗？',
			function(value){
				if(value == 'yes'){
					var itemName = titleText.getValue();
					var typeId = selectedTypeNode.id;
					KnowledgeService.isKnowledgeConflict(typeId,itemName,function(result){
						if(result){
							Ext.Msg.show({
								title : '错误',
								msg : '该标题已经存在，提交失败！',
								modal : true,
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.ERROR
							});
						}else{
							var knowledgeItem = createKnowledgeItemObject();
							var userName = USER.getUserName();
							KnowledgeService.addKnowledgeItem(knowledgeItem,userName,true,function(returnValue){
								if(returnValue){
									var treePanel = Ext.getCmp('knowledgeOperateTree');
									var fixedNode = treePanel.getNodeById('myApproving_knowledgeNode');
									if(!Ext.isEmpty(fixedNode)){
										fixedNode.ui.addClass('treeNodeBackground');
										treePanel.fireEvent('click',fixedNode);
										newWindow.close();
									}
								}else{
										Ext.Msg.show({
										title : '错误',
										msg : '发生错误或异常，提交失败！',
										modal : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});
								}
							})
						}
					});
				}
			});
	}
	
	function createKnowledgeItemObject(){
		var knowledgeItemObject = {};
		knowledgeItemObject.tags = tagsText.getValue();
		knowledgeItemObject.problemDescription = errArea.getValue();
		knowledgeItemObject.resolveMethod = methodArea.getValue();
		knowledgeItemObject.typeId = selectedTypeNode.id;
		knowledgeItemObject.typeName = selectedTypeNode.text;
		knowledgeItemObject.title = titleText.getValue();
		knowledgeItemObject.createUser = USER.getUserName();
		return knowledgeItemObject;
	}
	
}