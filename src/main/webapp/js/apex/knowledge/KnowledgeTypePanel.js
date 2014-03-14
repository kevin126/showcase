Ext.namespace('Apex.maintenance.knowledge');
Apex.maintenance.knowledge.KnowledgeTypePanel = function() {
	var typeTreePanel = null;
	var typeGridPanel = null;
	var treeLoader = null;
	var typeStore = null;
	var typeSelect = null;
	var addBtn = null;
	var delBtn = null;
	var editBtn = null;
	var selectedTypeId = 0;
	var newWin = null;
	var loadMask = null;
	var mainPanel = createMainPanel();
	this.getPanel = function(){
		return mainPanel;
	}
	this.getTreePanel = function(){
		return typeTreePanel;
	}
	function createMainPanel(){
		typeTreePanel = createTypeTreePanel();
		typeGridPanel = createTypeGridPanel();
		var panel = new Ext.Panel({
					layout : 'border',
					autoScroll : true,
					closable : false,
					border : false,
					height : 580,
					items : [typeTreePanel, typeGridPanel]
				});
		return panel;
	}
	function createTypeTreePanel(){
		var rootNode = new Ext.tree.AsyncTreeNode({
				text : '知识库类型',
			    id : '0',
			    hasChildren : true,
			    icon : '/itsm/images/icons/folder.png',
			    expanded : true
			});
		treeLoader =  new Ext.ux.DWRTreeLoader({
				dwrCall : KnowledgeService.getKnowledgeTypeTree
			});
		var panel = new Ext.tree.TreePanel({
					loader : treeLoader,
					collapsible : true,
					rootVisible : true,
					autoScroll : true,
					border : true,
					//bodyStyle : 'padding:0px 5px 0px 0px',
					frame : false,
					split : true,
					margins : '5 2 5 5',
					region : 'west',
					width : 200,
					height : 590,
					root : rootNode
				});
		panel.on('click', showKnowledges);
		rootNode.select();
		panel.expandAll();
		return panel;
	}
	
	function createTypeGridPanel(){
		addBtn = new Ext.Button({
				text : '添加',
				cls : 'x-btn-text-icon',
				//isPermission : USER.isAble('knowledge_type_configure'),
				icon : '/itsm/images/icons/add.gif',
				handler : addType
			});
		delBtn = new Ext.Button({
					text : '删除',
					cls : 'x-btn-text-icon',
					icon : '/itsm/images/icons/delete.gif',
					disabled : true,
					handler : delType
				});
		editBtn = new Ext.Button({
					text : '编辑',
					cls : 'x-btn-text-icon',
					icon : '/itsm/images/icons/edit.gif',
					disabled : true,
					handler : editType
				});
	  var tbarSeparator1 = new Ext.Toolbar.Separator(true);
	  var tbarSeparator2 = new Ext.Toolbar.Separator(true);
	   var typeReader = new Ext.data.JsonReader({
				totalProperty : 'totalCount',
				root : 'typeList',
				id : 'id',
				fields : [{
							name : 'id',
							type : 'int'
						}, {
							name : 'parentId',
							type : 'int'
						}, {
							name : 'typeName',
							type : 'string',
							renderer:function (data,metadata){ 
						 		if(data) return Ext.util.Format.htmlDecode(data);
						 		},
							maxlength:100
						}, {
							name : 'memo',
							type : 'string',
							renderer:function (data,metadata){ 
							 	if(data) return Ext.util.Format.htmlDecode(data);
							 	},
							maxlength:255
						}]
			});
		typeSelect = new Ext.grid.CheckboxSelectionModel({
			    singleSelect : true,
				listeners : {
					'selectionchange' : function(sm) {
						if (sm == null) {
							delBtn.setDisabled(true);
							editBtn.setDisabled(true);
						} else {
							if (sm.getSelections().length == 1 ) {
								delBtn.setDisabled(false);
								editBtn.setDisabled(false);
							} else if(sm.getSelections().length > 1){
								delBtn.setDisabled(false);
								editBtn.setDisabled(true);
							}else{
								delBtn.setDisabled(true);
								editBtn.setDisabled(true);
							}
						}
					}
				}
			});
		typeStore = new Ext.data.Store({
			reader : typeReader,
			proxy : new Ext.ux.data.DWRProxy({
						dwrFunction : KnowledgeService.getFixedKnowledgeTypes,
						listeners : {
							'beforeload' : function(dataProxy, params) {
								var loadArgs = [selectedTypeId];
								params[dataProxy.loadArgsKey] = loadArgs;
							}
						}
					})
		});
		var grid = new Ext.grid.GridPanel({
					region : 'center',
					margins : '5 5 5 0',
					store : typeStore,
					sm : typeSelect,
					border : true,
					tbar : [addBtn,tbarSeparator1,delBtn,tbarSeparator2,editBtn],
					columns : [typeSelect, new Ext.grid.RowNumberer(), {
								header : '名称',
								dataIndex : 'typeName',
								width : 230,
								renderer:function (data){ 		
									if(data) return Ext.util.Format.htmlEncode(data);
									return '';
								},
								sortable : true
							}, {
								header : '描述',
								dataIndex : 'memo',
								width : 460,
								renderer:function (data){ 
									if(data) return Ext.util.Format.htmlEncode(data);
									return '';
								},
								sortable : false
							}, {
								header : 'id',
								dataIndex : 'id',
								hidden : true,
								sortable : false
							}, {
								header : 'parentId',
								dataIndex : 'parentId',
								hidden : true,
								sortable : false
							}],
					enableHdMenu : false,
					stripeRows : true,
					autoExpandColumn : 3,
					frame : false
				});
	
		loadDate();
		return grid;
	}
	
	function addType(){
		var selectedNode = typeTreePanel.getSelectionModel().getSelectedNode();
		window.location.href = mainpath +"/knowledge/knowledgeType.do?to=add&parentId="+ selectedNode.id;
		
		
		return;
		//var str = "";
		//for( para in selectedNode){
		///	str += para +" : " +"\n";
		
		//}
		//alert(str);
		var inputText = new Ext.form.TextField({
			fieldLabel : '类型名',
			width : 400,
			allowBlank : false,
			blankText : '类型名不能为空！',
			maxLength : 50,
			maxLengthText : '类型名长度不能超过50！',
			vtype : 'SpecialChar'
		});
		var memoArea = new Ext.form.TextArea({
			fieldLabel : '描述',
			width : 400,
			height :300,
			allowBlank : false,
			blankText : '描述不能为空！',
			maxLength : 255,
			maxLengthText : '描述长度不能超过255！'
		});
		var inputPanel = new Ext.form.FormPanel({
			monitorValid :true,
			frame : true,
			labelWidth : 60,
			items : [inputText,memoArea],
			buttons : [{
				text : '确定',
				formBind : true,
				handler : function(){
					                   loadMask = new Ext.LoadMask(newWin.id, {
											msg : "正在保存，请稍侯...",
											msgCls : 'ext-el-mask-msg'
										});
										loadMask.show();
										var name = Ext.util.Format.htmlDecode(inputText.getValue());
										var memo = memoArea.getValue();
										confirmAddKnowledgeType(name,memo);
										}
			}, {
				text : '取消',
				handler : function(){newWin.close()}
			}],
			buttonAlign : 'center'
		});
		newWin = new Ext.Window({
			title : '添加',
			closable : true,
			border : false,
			plain : true,
			height : 590,
			resizable : false,
			modal : true,
			items : [inputPanel]
		});
		newWin.show();
		
	}
	
	function confirmAddKnowledgeType(name,memo){
		var selectedNode = typeTreePanel.getSelectionModel().getSelectedNode();
		KnowledgeService.isConflictedByName(selectedNode.id,name,function(returnValue){
			    loadMask.hide();
			    if(returnValue){
			    	Ext.Msg.show({
						title : '错误',
						msg : '该类型名已经存在！',
						modal : true,
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.ERROR
					});
			    }else{
			    	var newType = {};
			    	newType.parentId = selectedNode.id;
			    	newType.typeName = name;
			    	newType.memo = memo;
			    	KnowledgeService.saveKnowledgeType(newType,function(returnValue){
			    		if(returnValue){
			    			treeLoader.load(selectedNode,function(){selectedNode.expand(true)});
			    			loadDate();
			    			newWin.close();
			    		}
			    	});
			    }
		});
	}
	function delType(){
		    var record = typeSelect.getSelected();
		    var typeId = record.get('id');
		    var treeNode = typeTreePanel.getNodeById(typeId);
		    if(!Ext.isEmpty(treeNode)){
		    	if(treeNode.hasChildNodes()){
		    			Ext.Msg.show({
							title : '提示',
							msg : '该类型下存在子类型节点，请先删除子节点！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.INFO
						});
		    	}else{
		    		KnowledgeService.hasKnowledgeItem(typeId,function(returnValue){
		    			if(returnValue){
		    					Ext.Msg.show({
									title : '提示',
									msg : '该类型下存在知识库记录，请先删除这些记录！',
									modal : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.INFO
								});
		    			}else{
		    				var confirmBox = Ext.MessageBox.confirm('确认', '确定要删除该知识库类型吗？',
			    				function(result){
			    					if (result == 'yes') {
		    							KnowledgeService.deleteKnowledgeType(typeId,function(returnValue){
					    					if(returnValue=='yes'){
					    						treeNode.remove();
					    						loadDate();
					    					}else if(returnValue=='deleted'){
					    						Ext.Msg.show({
													title : '错误',
													msg : '对不起，您操作的知识库类型不存在，可能已经被其他人删除，请联系管理员！',
													modal : true,
													buttons : Ext.Msg.OK,
													icon : Ext.Msg.ERROR
												});
												treeNode.remove();
					    						loadDate();
						    				}else if(returnValue=='error'){
					    						Ext.Msg.show({
													title : '错误',
													msg : '发生错误或，删除知识库类型失败！',
													modal : true,
													buttons : Ext.Msg.OK,
													icon : Ext.Msg.ERROR
												});
						    				}
					    			});
			    				}
			    			})
		    			}
		    		})
		    	}
		    }
			var selectedNode = typeTreePanel.getSelectionModel().getSelectedNode();
			if(selectedNode.hasChildNodes()){
				
			}
		
	}
	function editType(){
		var selectedItem = typeSelect.getSelected();
		window.location.href = mainpath +"knowledge/knowledgeType.do?to=edit&id="+ selectedItem.data.id;		
		return;
		
		var selectedItem = typeSelect.getSelected();
		var inputText = new Ext.form.TextField({
			fieldLabel : '类型名',
			width : 400,
			disabled : true,
			value : selectedItem.get('typeName')
		});
		var memoArea = new Ext.form.TextArea({
			fieldLabel : '描述',
			width : 400,
			height :300,
			allowBlank : false,
			blankText : '描述不能为空！',
			maxLength : 255,
			maxLengthText : '描述长度不能超过255！'
		});
		memoArea.setValue(selectedItem.get('memo'));
		var inputPanel = new Ext.form.FormPanel({
			monitorValid :true,
			frame : true,
			labelWidth : 60,
			items : [inputText,memoArea],
			buttons : [{
				text : '确定',
				formBind : true,
				handler : function(){
										var memo = memoArea.getValue();
										confirmEditKnowledgeType(memo);
										}
			}, {
				text : '取消',
				handler : function(){newWin.close()}
			}],
			buttonAlign : 'center'
		});
		newWin = new Ext.Window({
			title : '编辑',
			closable : true,
			border : false,
			plain : true,
			width : 500,
			resizable : false,
			modal : true,
			items : [inputPanel]
		});
		newWin.show();
	}
	function confirmEditKnowledgeType(memo){			
		 KnowledgeService.editKnowledgeType(selectedItem.get('id'),memo,{
				 callback : function(returnValue){
					    		if(returnValue){
					    			selectedItem.set('memo',memo);
					    			newWin.close();
					    		}else{
			    				    Ext.Msg.show({
										title : '错误',
										msg : '发生错误或异常，编辑知识库类型失败！',
										modal : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.ERROR
									});
					    		}
					    	},
				errorHandler : function(errorString, exception){
					    newWin.close();
					  	Ext.MessageBox.show({
							title : '错误',
							msg : exception.message,
							buttons : Ext.MessageBox.OK,
							fn : function() {
								var treeNodeId = selectedItem.get('id');
								var treeNode = typeTreePanel.getNodeById(treeNodeId);
								if(!Ext.isEmpty(treeNode))
									treeNode.remove();
								loadDate();
							},
							icon : Ext.MessageBox.ERROR
						});
				}
		 });
	}
	function showKnowledges(selectedNode){
		selectedTypeId = Number(selectedNode.id);
		loadDate();
	}
	
	function loadDate(){
		var loadMask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在加载数据，请稍侯...",
						msgCls : 'ext-el-mask-msg'
					});
		loadMask.show();
		typeStore.load({
			callback : function(){loadMask.hide()}
		});
	}
}