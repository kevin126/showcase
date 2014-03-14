//工单号
var issueId = $("#ISSUE_ID").val();
//流程标记，标记是走流程的
var wfFlag = $("#WORKFLOW_FLAG").val();
//核心CI
var centerCiId = $("#CENTER_CIID").val();
var dataBoxCacheKey = wfFlag == 'true' ? issueId : $("#DATABOX_KEY").val();

//--------------add by wjdeng 当前编辑锁定的ci
var editCI_ciIds = $("#LOCKID").val();
var dataBoxDataMap = new Object();//页面数据缓存
var OSSfexDataMap = new Object();//下拉框,单选等 数据值集合缓存(需要时从数据库加载一次)
var CIoperationStatusDataMap = new Object();//ci操作状态列表,记录ci的属性是否被修改过<key,boolean>
var LockCIMapInTop = new Object();//单签top中被锁定的ci集合
var SVGSelectNodeId = false;//当前选中节点svgId
//-----------end
function TCustomerNetwork(_box, _config) {
	TWaver.TSVGNetwork.apply(this, arguments);
}

TWaver.extend(TCustomerNetwork, TWaver.TSVGNetwork, {
	editerAddNodeMouseUpAction : function(evt) {
		var _coords = this.getZoomMouseCoords(evt);
		var _x = TWaver.svgutils.trimString(_coords.x);
		var _y = TWaver.svgutils.trimString(_coords.y);

		var _this = this;
//		function _action(btn, text) {
//			if (text) {
//				_this.refreshAllComponents(_this.ajax.getAddElementAjaxParams(
//						_this.addingElementClass, _this.currentSubNetworkID,
//						_x, _y, text));
//			}
//		}
		function addCI(){
			var formData = panel.getForm().getValues(false);
			var ciName = formData.ciName;
			var ciType = formData.ciType;
			var ciTypeId = formData.ciTypeId;
			var ciTypeIcon=formData.ciTypeIcon;
//			alert("类型id是：" + ciTypeId);
//			alert("添加CI,CI类型ID="+ciId);
			if (ciName && ciType && ciTypeIcon) {
				_this.refreshAllComponents(_this.ajax.getAddElementAjaxParams(
						"com.tekview.apex.itsm.server.model.CINode", _this.currentSubNetworkID,
						_x, _y, ciName, ciTypeId, ciType,ciTypeIcon));
				//------------------ add by wjdeng //新增加的node且没有进行选中操作的标记数量+1
				TWaver.CurNewNodeCount= (!TWaver.CurNewNodeCount)? 1: TWaver.CurNewNodeCount+1;
				//------------end
				addCIWindow.close();
			}else{
					Ext.MessageBox.show({
							title: '提示',
							msg: '请输入CI的名称和CI类型！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING,
							fn : function(returnValue) {
							}
						});
			}
			//重置鼠标状态
			network.setNetworkSelectMode();
		}
		var citypeText = new Ext.form.TextField({
								fieldLabel : 'CI类型',
								id: 'ciType',
								readOnly :true,
								width : 100
							});
		var hiddenCiTypeText = new Ext.form.Hidden({
								id: "ciTypeId"
							});
		var hiddenCiTypeIcon = new Ext.form.Hidden({
							    id : 'ciTypeIcon'
						})
		citypeText.on("focus", function(obj) {
					var treePanel = new Apex.cmdb.citype.CITreePanel();
					//显示CI类型树，选中类型后，类型ID会赋值给隐藏文本
					showTreeWin(treePanel, citypeText, hiddenCiTypeText,hiddenCiTypeIcon);
		});
		var panel = new Ext.form.FormPanel({
						monitorValid : true,
						frame : true,
						labelWidth : 80,
						layout : 'form',
						items : [
							new Ext.form.TextField({
								fieldLabel : 'CI名称',
								id: 'ciName',
								vtype : 'CINameMin1AndMax10',
								width : 100
							}),
							citypeText,
							hiddenCiTypeText,
							hiddenCiTypeIcon
						],
						buttons : [
							{
								text : '确定',
								formBind : true,
								handler : function() {
									addCI();
								}
							},
							{
								text : '取消',
								handler : function() {
									addCIWindow.close()
								}
							}
						]
					});
		
		var addCIWindow = new Ext.Window({
			title : '添加CI',
			closable : true,
			width : 250,
			autoHeight : true,
			plain : true,
			resizable : false,
			modal : true,
			items : [panel]
		});
		addCIWindow.show();
		//Ext.MessageBox.prompt('Name', 'Please enter the node name:', _action);
	},
	
	editerAddLinkMouseUpAction : function(evt) {
			var _this = this;
			
			
	var dwrproxy = new Ext.ux.data.DWRProxy({
					dwrFunction : CiRelationService.getAllCIRelationTypes4Dwr
				});

	var store = new Ext.data.SimpleStore({
				storeId : 'commandStoreId',
				proxy : dwrproxy,
				fields : ['id', 'typeName']
			});

	var commandCombobox = new Ext.form.ComboBox({
				fieldLabel : '选择关系',
				baseCls : 'x-plain',
				loadingText : '正在加载',
				triggerAction : 'all',
				displayField : 'typeName',
				value : '',
				valueField : 'id',
				queryDelay : 50,
				editable : false,
				allQuery : '',
				emptyText : '请选择...',
				mode : 'remote',
				store : store,
				anchor : '95%'
			});

		store.load();
			
			
			var panel = new Ext.form.FormPanel({
//						monitorValid : true,
						frame : true,
						labelWidth : 80,
						layout : 'form',
						items : [commandCombobox]
			});
			
			var ciRelationWindow = new Ext.Window({
					title : '建立CI关系',
					closable : true,
					width : 250,
					autoHeight : true,
					plain : true,
					resizable : false,
					modal : true,
					items : [panel],
					buttons : [
						{text : '确定',
							handler : function() {
								addCIRelation(evt);
							}
						},
						{text : '取消',
							handler : function() {
								ciRelationWindow.close()
							}
						}
					]
				});
				
			var $ = evt.target, C = TWaver.svgutils.getNetworkSelectedElementType($);
			if(_this._isElementNotLink(C)){
			
				var _ = $.parentNode, toId = _.id;
				if(_this._addLinkFromID==toId){
					Ext.MessageBox.show({
							title: '提示',
							msg: '只能在不同的CI之间建立关系！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
					network.setNetworkSelectMode();
					return;
				}
				ciRelationWindow.show();
			}else{
				_this.clearMemory();
					_this.isSVGDocumentAdjust = false;
					if(ciRelationWindow.isVisible())
						ciRelationWindow.close();
			}
				
	    	//调用父类的代码
	    	function addCIRelation(evt){
				var _ = $.parentNode, toId = _.id;
				var relationTypeId = commandCombobox.getValue();
				if(relationTypeId == ""){
					Ext.MessageBox.show({
							title: '提示',
							msg: '请选择关系！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING,
							fn : function(returnValue) {
							}
						});
				}else{
					
		    	//通过dwr去判断是否已经存在多条关系，不存在的话再继续。。。
			    	CIService.checkExistMultiRelation(_this._addLinkFromID, toId, dataBoxCacheKey, centerCiId,
				            {callback:function(data){ //返回对象为CINode
				            		if(data){
										_this.refreshAllComponents(_this.ajax.getAddLinkAjaxParams(
																"com.tekview.apex.itsm.server.model.CILink", _this.currentSubNetworkID,
																_this._addLinkFromID, toId, relationTypeId));
										ciRelationWindow.close();
										//重置鼠标状态
										network.setNetworkSelectMode();
				            		}else{
				            			//两个CI之间只能有一条关系。
										Ext.MessageBox.show({
											title: '警告',
											msg: '两个CI之间只能有一条关系！',
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.WARNING
										});
				            		}
				            	},
				            	errorHandler: function(msg, exc){
				            		alert(msg );
				            	}
				            }
				     );
				}
			}
	}
});





function TCustomerSVGNetworkAjax() {
	TWaver.TSVGNetworkAjax.apply(this, arguments);
}

TWaver.extend(TCustomerSVGNetworkAjax, TWaver.TSVGNetworkAjax, {
	getAddElementAjaxParams : function(_class, _currentSubNetworkID, _x, _y, text, ciTypeId, ciType,ciTypeIcon) {
		var _params = [_class, _currentSubNetworkID, _x, _y];
		_params = TWaver.svgutils.getContentParameters(_params);
		TWaver.svgutils.setConfig(_params, {
			'twaver.node.name' : text,
			'twaver.node.ciTypeId' : ciTypeId, //CI类型ID
			'twaver.node.ciType' : ciType, //CI类型名
			'twaver.node.ciTypeIcon':ciTypeIcon,//CI类型图标
			'twaver.handle.method' : 'handleAddNode'
		});
		return _params;
	},
	//保留注释--------------
	//	    getSubNetworkDoubleClickAjaxParams: function(_elementID){
//	        var _params = TWaver.TSVGNetworkAjax.prototype.getSubNetworkDoubleClickAjaxParams.apply(this, arguments);
//	        TWaver.svgutils.setConfig(_params, {
//	            'twaver.response.target': 'network,tree'
//	        });
//	        return _params;
//	    },
	    getAddLinkAjaxParams: function(_class, _currentSubNetworkID, _fromID, _toID, relationTypeId){
	    	
    		var _params = [_class, _currentSubNetworkID, _fromID, _toID, relationTypeId];
	    	if(_fromID == _toID)
	    		return;
	    	var fromEle = null;
	    	var toEle = null;
	    	fromEle = network.svgDocument.getElementById(_fromID);
	    	toEle = network.svgDocument.getElementById(_toID);
	    	
			if (null != fromEle && null != toEle) {
				_params = TWaver.svgutils.getContentParameters(_params);
				TWaver.svgutils.setConfig(_params, {
							"twaver.handle.method" : "handleAddLink"
						});
    			return _params;
	    	}
	    	
	    }
	    //保留注释--------------
//	    ,
	    //只有选中不在当前子网的节点，需要打开对应的子网的时候调用
//	    getSelectElementByIDAjaxParams : function($) {
//	    	//显示属性
//	    	alert("adsfasdfdf");
//			var _ = [$];
//			_ = TWaver.svgutils.getContentParameters(_);
//			TWaver.svgutils.setConfig(_, {
//						"twaver.handle.method" : "handleElementSelected"
//					});
//			return _;
//		}
});


function CIEditor() {

	var networkPanel = new Ext.Panel({
		id : 'main-tabs',
//		title : 'CI关系编辑器',
		margins : '5 5 5 5',
		region : 'center',
		autoScroll : false
	});

	var networkOverViewPanel = new Ext.Panel({
		id : 'networkOverViewPanel',
		title : '概览',
		margins : '0 5 5 5',
		region : 'south',
		height : 200,
		width : 200,
		autoScroll : true
	});
//	alert($("#DATABOX_KEY").val());
	var box = new TWaver.TDataBox({
		url : '/itsm/cmdb/citopo?CIId=' + document.getElementById("CIID").value + "&WORKFLOW_FLAG=" + wfFlag + "&ISSUE_ID=" + issueId,
		//-------------
		// dataBoxKey: Editor:说明是从‘添加CI’或‘编辑CI’菜单进入。
		//   		   View： 说明是查看CI详情界面进入。
		//  由于dataBoxKey的不同，svg通过CITopoServlet取数据时的数据来源亦不同，
		//-------------
		dataBoxKey : $("#DATABOX_KEY").val(), //NEW, Edit, View
		initializeParams : {
//			'twaver.response.target' : 'network,tree'
			'twaver.response.target' : 'network'
		},
		changeDataBoxResponseTarget : {
			'twaver.response.target' : 'network'
//			'twaver.response.target' : 'network,tree'
		}
	});
	/**
	 * 初始化拓扑图上方按钮
	 */
	function initCustomButtons(_toolbar, scene){
		if("NEW" == scene || "Edit" == scene){
//			_toolbar.addButton(TSVGConstants.SVGToolBar_Undo_Src,
//								TWaver.svgutils.createFunction(network,
//										function() {
//											this.undo()
//										}), "回退");
//			_toolbar.addButton(TSVGConstants.SVGToolBar_Redo_Src,
//					TWaver.svgutils.createFunction(network,
//							function() {
//								this.redo()
//							}), "重做");
			if($("#ADD_CONFIG_ITEM").val()=="ADD_CONFIG_ITEM"){
			_toolbar.addButton("/images/cmdb/newci16.png",
					TWaver.svgutils.createFunction(network,
							function() {
								this.setNetworkAddElementMode(
										"twaver.Node", 1)
							}), "添加CI");
			}
			_toolbar.addButton(TSVGConstants.SVGToolBar_LinkImage_Src,
					TWaver.svgutils.createFunction(network,
							function() {
								this.setNetworkAddElementMode(
										"twaver.Link", 2)
							}), "设置CI关系");
			
			_toolbar.addButton("/images/cmdb/rainbow.png",
					TWaver.svgutils.createFunction(network,
							function() {
								Ext.MessageBox.show({
									title: '确认',
									msg: '确定重新加载数据吗？',
									buttons : Ext.MessageBox.OKCANCEL,
									icon : Ext.MessageBox.QUESTION,
									fn : function(returnValue) {
										if (returnValue == 'ok') {
											doReloadData();
										}
									}
								});
							}), "刷新");
			
		}else if("View" == scene){
			_toolbar.addButton('/js/cmdb/exportToImage.png', TWaver.svgutils
					.createFunction(this.network, function() {
						var _params = {
							'twaver.response.target' : 'network',
							'twaver.response.format' : 'png',
							'twaver.handle.method' : 'handleSaveImage'
						};
						network.openWindowUrl(_params);
					}), '导出图片');
					
					
		}
		 	_toolbar.addButton("/js/cmdb/autolayout.png", TWaver.svgutils.createFunction(this.network, function(){
		            	Ext.MessageBox.show({
							title: '确认',
							msg: '确定重新布局吗？',
							buttons : Ext.MessageBox.OKCANCEL,
							icon : Ext.MessageBox.QUESTION,
							fn : function(returnValue) {
								if (returnValue == 'ok') {
									doLayout();
								}
							}
						});
		            }), '自动布局');
					
     	//新建CI或编辑CI时需显示
        if("NEW" == scene || "Edit" == scene){
		 	//保存按钮
		     _toolbar.addButton("/js/cmdb/save.png", TWaver.svgutils.createFunction(this.network, function(){
		     			//------ add by wjdeng 没有对新增加的节点填写数据
		     			if(0<TWaver.CurNewNodeCount){
							Ext.MessageBox.show({
								title: '警告',
								msg: '请为新增加的CI填写属性！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.WARNING,
								fn : function(returnValue) {
								}
							});
				           return;
						}
						
						var cicount =0;
						for(var tid in dataBoxDataMap){
							if(tid!='null'){
								cicount ++;
								break;
							}
						}
						if(cicount ==0){
							Ext.MessageBox.show({
				      			title: '警告',
								msg: '没有操作过CI，不需要进行保存！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO
				           		});
				           	return ;
						}
						
						validate4selectCIbyform();
						var sumci =0;
						for (var par in ValiMapCIeditTop){
							if(ValiMapCIeditTop[par]=='N'){
								sumci ++;
							}
						}
						//if(temf)return;//
						if(sumci==1){
							if($('#CIID').val()=='null'){
								Ext.MessageBox.show({
				      			title: '警告',
								msg: '拓扑图中没有CI！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO
				           		});
								return;
							}
							Ext.MessageBox.show({
				      			title: '警告',
								msg: '请填写正确的属性！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO
			           		});
			           		return;
						}else if(sumci>1){
								Ext.MessageBox.show({
				      			title: '警告',
								msg: '请为带警告标示的CI填写正确的属性！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO
				           		});	
			           		return;
						}else{
							
						}
						//
		            	Ext.MessageBox.show({
							title: '确认',
							msg: '确定要保存当前的修改吗？',
							buttons : Ext.MessageBox.OKCANCEL,
							icon : Ext.MessageBox.QUESTION,
							fn : function(returnValue) {
								if(returnValue == "ok"){
									//将databox里的数据实体化到数据库
									//--------------add by wjdeng at 6/23
									save4dataMap();
									//--------------end 
								}
							}
						});
		            }), '保存当前修改');
        }
            
            
        //NEW
        if( $("#DATABOX_KEY").val()!='NEW' &&  $("#WORKFLOW_FLAG").val()!='true'){
	        //添加一个下拉框，用来选择显示深度的
	        var _combo_div = document.createElement('div');
	        var _combo_store = new Ext.data.SimpleStore({
	            fields: ['deep', 'value'],
	            data: [ [1, "1层"], [2, "2层"]]
	        });
	        var combo = new Ext.form.ComboBox({
	            store: _combo_store,
	            width : 30,
	            renderTo: _combo_div,
	            displayField: 'value',
	            valueField: "deep",
	            typeAhead: false,
	            mode: 'local',
	            triggerAction: 'all',
	            selectOnFocus: true,
	            resizable: false
	        });
	        combo.setValue(1);
	     	//添加监听Ext.form.ComboBox combo, Ext.data.Record record, Number index 
	     	combo.addListener("select", reloadTopo);
	     	
		     
		     var label = document.createElement('td');
		     label.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='../js/cmdb/elbow-line.gif'>&nbsp;&nbsp;&nbsp;基于当前CI的展示深度："
		     
		     _toolbar.addComponent(label);
		     _toolbar.addComponent(_combo_div);
        
        } 

	     
	     if($("#WORKFLOW_FLAG").val()=='true'){//提交变更流程
	    	 var rfcdiv = document.createElement('DIV');
		     var rfcBtn = new Ext.Button({
						id : 'delConfigurationType',
						text : '提交变更评审',
						cls : 'x-btn-text-icon',
						renderTo: rfcdiv,
						handler : function(){
							Ext.MessageBox.show({
								title: '确认',
								msg: '确定提交变更评审吗？',
								buttons : Ext.MessageBox.OKCANCEL,
								icon : Ext.MessageBox.QUESTION,
								fn : function(returnValue) {
									if (returnValue == 'ok') {
										submitRfcToWritAuditComment('transition_cmdb_checking',JS_I18N.transition_evalpass_cmdb);
									}
								}
							});
						}
					});
			 var rlabel = document.createElement('td');
		     rlabel.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src='../js/cmdb/elbow-line.gif'>"
		     
		     _toolbar.addComponent(rlabel);
			 _toolbar.addComponent(rfcdiv);
	     }
	     
	}

	/**
	 * 将dataBox里的数据实体化到数据库
	 */
	window.flushDataBoxToDB = function (){
		var contentParameters = [issueId];
        var _params = TWaver.svgutils.getContentParameters(contentParameters);
        CMDBTopVeiwMask.show();
        CIService.flushDataBoxToDB(dataBoxCacheKey,$("#CENTER_CIID").val(),wfFlag,$('#ISSUE_ID').val(),
        	{callback:function(data){
        		 network.refreshSVGNetwork(_params, function(ciids){
			       refreshLockCiDetection();//更新后台锁
		           Ext.MessageBox.show({
		      			title: '确认',
						msg: '操作成功！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.INFO
		           });
		        });
		        $("#CIID").val('');
   				//doReloadData();// 更新数据到databox完了之后 刷新topo图：
   				for(var ciid in dataBoxDataMap){
   					delete dataBoxDataMap[ciid];//保存完成了清理js缓存
   				}
		        CMDBTopVeiwMask.hide();
        	},errorHandler: function(msg, exc){
        		Ext.MessageBox.show({
	      			title: '警告',
					msg: msg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO
	           });
        	}
        }
        );
        return;
        /*TWaver.svgutils.setConfig(_params, {
        	'twaver.response.target' : 'network',
        	'citopo.boxcacheKey' : dataBoxCacheKey,
        	'citopo.workflow.flag' : wfFlag,//是否走流程
        	'citopo.centerId' : $("#CENTER_CIID").val(),
            'twaver.handle.method': 'flushDataBoxToDB'
        });
        network.refreshSVGNetwork(_params, function(){
	        //add by wjdeng at 6/22 sart  更新锁
	       refreshLockCiDetection();//更新后台锁
	       Ext.Msg.alert('操作成功！');
           Ext.MessageBox.show({
      			title: '确认',
				msg: '操作成功！',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.INFO
           });
        });*/
		
	}
	
	/** 
	 * dwr调用后台 
	 * 重新加载topo图
	 * */
	function reloadTopo(obj, record, index){
		var deep = record.get('deep');
		refreshTopo(deep);
	}
	
	//重新加载topo
	function refreshTopo(deep){
		var ciid = $("#CENTER_CIID").val();
		var view = $("#DATABOX_KEY").val();//"View")//NEW, Edit, View
		var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : '正在加载数据..',
					msgCls : 'ext-el-mask-msg'
				});
		myMask.show();
//		alert(deep + "-" + ciid);
		var contentParameters = [issueId];
        var _params = TWaver.svgutils.getContentParameters(contentParameters);
        TWaver.svgutils.setConfig(_params, {
        	'twaver.response.target' : 'network',
        	'citopo.boxcacheKey' : dataBoxCacheKey,
        	'citopo.workflow.flag' : wfFlag,//是否走流程
        	'citopo.centerId' : $("#CENTER_CIID").val(),
        	'citopo.ciid' : ciid,
        	'citopo.deep' : deep,
        	'citopo.boxkey' : view,
            'twaver.handle.method': 'handleReloadTopo'
        });
        network.refreshSVGNetwork(_params, function(){
        	var key = $("#DATABOX_KEY").val();
			if(key=='NEW'||key=='Edit'){
				//detection(editCI_ciIds,(new Date()).getTime())
				refreshLockCiDetection();
			}
            myMask.hide();
          	Ext.MessageBox.show({
      			title: '确认',
      			msg: '加载成功！',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.INFO
           });
        });	
		
	}
	
    /**
     * 重新布局
     */
    function doLayout(){
        var ids = network.getSelectedElementIDs();
        var ids_clone = TWaver.svgutils.cloneArray(ids);
        var contentParameters = [1, ids];
        var _params = TWaver.svgutils.getContentParameters(contentParameters);
        TWaver.svgutils.setConfig(_params, {
            'twaver.handle.method': 'handleDoLayout'
        });
        network.refreshSVGNetwork(_params, function(){
            if (ids_clone) {
                network.setCurrentSubNetworkElementsSelectedByIDs(ids_clone);
            }
        });
    }


	this.init = function() {
		var editorPanel = new Ext.Panel({
			id:'ciEditor',
//			title:'CI Editor',
			layout : 'border',
			renderTo : 'editorDiv',
			height : $("#DATABOX_KEY").val() == 'NEW' ? 600 : 615,
			width : '100%',
			items: [networkPanel]
		});
		
		//tree.setDragAndDropEnable();
		var _htmlParent = networkPanel.body.dom;
		
		network = new TCustomerNetwork(box, {
			hasToolBar : true,
			isToolbarEnable : true,
			isNodeResizable : true,
			isShapeEditable : true,
			isEnablePopupMenu : true,
			prepareCustomPopupMenu : function(evt, _currentElement, type) {
				if(type == 13 || type == 14 || type == 30 || type == undefined){//空白位置
            		return;
            	}
				var type = _currentElement.getAttribute("eleType");
				var ciid = _currentElement.getAttribute("ciid");
				var isexitDb = _currentElement.getAttribute("isexitDb");
				var tlock = _currentElement.getAttribute("locke");
				//关系id
				var relId =_currentElement.getAttribute("relationId");
				var centerCiId = $("#CENTER_CIID").val();
				var markDelete = _currentElement.getAttribute("markDelete");
				//DELETE
				var deleteFlag = _currentElement.getAttribute("deleteFlag");
            	//查看CI详情时，不显示菜单
            	if($("#DATABOX_KEY").val() == "View" ){
            		if( centerCiId!= ciid &&　type == 'CI'){//如果不是当前CI，可以查看详情
	            		var item_1 = new TWaver.TMenuItem('查看详情',
										function() {
//											window.location.href= "/itsm/cmdb/ciGrid.do?method=enterDetail&dataId="+ ciid +"&menuId=m6_0&oprationCI=queryCI";
											//以当前CI为核心，展示周边一层
											$("#CENTER_CIID").val(ciid);
											refreshTopo(1);
										});
						network.popupMenu.addMenuItem(item_1);
            		}
            	}else{
					if(type == 'CI'){
						var item_2 = new TWaver.TMenuItem('拷贝',
								function() {
									copyNode(_currentElement);
								});
						network.popupMenu.addMenuItem(item_2);
						//如果当前CI不是核心CI，可以查看详情
						var item_3 = new TWaver.TMenuItem('查看详情',
								function() {
								tipsWindown('关系视图','iframe:/itsm/cmdb/ciGrid.do?method=enterDetail&dataId='+ ciid +'&menuId=m6_0&nomenu=Y&ntv=Y&oprationCI=','1180','700','true','','true','leotheme')
								//	window.location.href= "/itsm/cmdb/ciGrid.do?method=enterDetail&dataId="+ ciid +"&menuId=m6_0&oprationCI=";
								});
						if(ciid.indexOf("AUTO") == -1){
							network.popupMenu.addMenuItem(item_3);
						}
					}
					var item_4 = new TWaver.TMenuItem('删除',
							function() {
								Ext.MessageBox.show({
									title: '确认',
									msg: '确定要删除吗？',
									buttons : Ext.MessageBox.OKCANCEL,
									icon : Ext.MessageBox.QUESTION,
									fn : function(returnValue) {
										if(type == 'CI'){//如果是CI节点
											var ciid =  _currentElement.getAttribute("ciid");
											if(returnValue == "ok" && ciid != null){
												if(ciid.indexOf("AUTO") != -1){//是未保存到数据库的节点，临时节点
													network.editerRemoveSelectedElements();
												}else{
													//该节点在数据库已存在,需要设置删除标记
													deleteExistedEle(ciid, type);
												}
											}
										}else if(type == "Link"){//如果是LINK
											if(returnValue == "ok"){// && relId != null){
												if(isexitDb=='Y'){//是未保存到数据库的节点，临时节点
													//该节点在数据库已存在,需要设置删除标记
													deleteExistedEle(relId, type);
												}else{
													network.editerRemoveSelectedElements();
												}
											}
										}
									}
								});
							});
						if(tlock!='true' &&　deleteFlag!='DELETE'){
							network.popupMenu.addMenuItem(item_4);
						}
            	}
			},
			htmlParent : _htmlParent
		});
		
		
		
		//给network添加事件：节点选中的事件
		network.addElementSelectListener(function(_evt){
		
			/**鼠标松开事件
			if(!_evt.target.mouseupFlag){
				_evt.target.mouseupFlag='Y';
				_evt.target.addEventListener("mouseup",TWaver.svgutils.createEventFunction(network, function(_mue){
					alert(_mue.target);
				}), false)
			}
			*/
			//如果是关系链路，直接跳过，不验证，否则后台无法删除
			if(_evt.target.getAttribute("eleType") == 'Link'){
				return;	
			}
			var tlock = _evt.target.getAttribute("locke");
			var lockcidi =_evt.target.getAttribute("ciid");
			if(tlock){
		        if(tlock=='true'){
					LockCIMapInTop[lockcidi]= 'true';
		        }else if(tlock=='false'){
		        	LockCIMapInTop[lockcidi]= 'false';
		        }
	        }
			
			//----------------add by wjdeng at 6/22 
			var ciid = $("#CIID").val();
			refreshDataMap();//刷新js缓存
			var vali = CIoperationStatusDataMap;
   			SVGSelectNodeId = _evt.target.id;
			//alert(CIoperationStatusDataMap[ciid]);
			var validateFlage = _evt.target.getAttribute("validate");//图标上的验证样式
			if(dataBoxDataMap[ciid] && (dataBoxDataMap[ciid].text != $("#ciName").val())){//修改了name需要更新datebox
				doSubmit(ciid);
			};
	        if(dataBoxDataMap[ciid]&&$("#DATABOX_KEY").val()!="View" && ciid!=_evt.target.getAttribute("ciid")){//隐藏域中的id与当前选中节点的id不同
	        	if(LockCIMapInTop[ciid]== 'false'){
	        		var operstat = CIoperationStatusDataMap;
		        	if(CIoperationStatusDataMap[ciid]==true){//对属性进行过修改
		        		validate4selectCIbyform();//校验输入的结果
		        		doSubmit(ciid);//将数据更新到后台
		        		CIoperationStatusDataMap[ciid]=false;//修改标记
		        		//alert(ValiMapCIeditTop[ciid]);//校验的结果
		        		/*
		        		if(ValiMapCIeditTop[ciid]=='Y'){//格式校验通过 
		        			if(dataBoxDataMap[ciid] && (dataBoxDataMap[ciid].text != $("#ciName").val())){//修改了name需要更新datebox
								doSubmit(ciid);
							}
		        		}else if(ValiMapCIeditTop[ciid]=='N'){//格式校验不通过通过 
		        			SVGSelectNodeId = _evt.target.id;
	        				doSubmit(ciid);//将数据更新到后台
		        		}
		        		*/
		        	}
	        	}
	        }
			//-----------------end 
            var _id = _evt.target.id;
	        var ciid =  _evt.target.getAttribute("ciid");//自定义输出的CI属性
	        
			
	        var cacheKey = dataBoxCacheKey;
	        var centerCiId = $("input[id='CENTER_CIID']").val();
	        $("#CIID").val(ciid);//设置当前选中的CIID
	        var type = _evt.target.getAttribute("ciType");
	        var typeId = _evt.target.getAttribute("ciTypeId");
	        $("#selectedCiTypeId").val(typeId);///设置当前选中的CI的类型ID，隐藏文本
	        var eleType = _evt.target.getAttribute("eleType");
	        if(ciid != null && ciid.indexOf("AUTO") != -1){//如果CIID为空，则为新增加的
	        
	        //-----------add by wjdeng at 6/22 页面暂存输入的数据
	        	if(jugeQueryData4db(ciid)){//判断该ci属性数据的加载来源
	        		TWaver.CurNewNodeCount --; //新增加的node且没有进行选中操作的标记数量-1
	        //-----------end
	        
		        CIService.getUnsavedCI(ciid, centerCiId, cacheKey,
		            {callback:function(data){ //返回对象为CINode
		            		//--------add by wjdeng at 6/22 对查询出的公共属性值加入到页面数据对象中
		            		fillCiData2DataMap(data.ciId,data);
		            		//-------end
		            		
		            		//将CI属性填充指定区域
		            		fillCiProperty(data);
		            		getCustomFields(type,data.ciId);
		            	},
		            	errorHandler: function(msg, exc){
				           Ext.MessageBox.show({
				      			title: '警告',
								msg: msg,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.WARNING
				           });
		            	}
		            }
		          );
		          
		     //-------add by wjdeng at 6/22
		     	}else{
		     		fillCiProperty(dataBoxDataMap[ciid]);
		     		fillCustomCiProperty(dataBoxDataMap[ciid].CustomCiProperty); 
		     	}
		     //---------end 
		     
	        }else{
	            //这里通过DWR请求后台。将返回的数据填充到属性表格里。
	            if(eleType == "CI"){
	            
	              //-----------add by wjdeng at 6/22 页面暂存输入的数据
	        		if(jugeQueryData4db(ciid)){//判断该ci属性数据的加载来源
	       		 //-----------end
	            
		            CIService.getSavedCINode(ciid, centerCiId, cacheKey,
			            {callback:function(data){
			            		//--------add by wjdeng at 6/22 对查询出的公共属性值加入到页面数据对象中
			            		fillCiData2DataMap(data.ciId,data);
			            		//-------end
			            		
			            		//将CI属性填充指定区域
			            		fillCiProperty(data);
			            		getCustomFields(type,data.ciId);
			            	},
			            	errorHandler: function(msg, exc){
					           Ext.MessageBox.show({
					      			title: '警告',
									msg: msg,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.WARNING,
									fn : function(){
										window.location.reload();
									}
					           });
			            	}
			            }
		            );
		            
			        //-------add by wjdeng at 6/22
			     	}else{
			     		fillCiProperty(dataBoxDataMap[ciid]);
			     		fillCustomCiProperty(dataBoxDataMap[ciid].CustomCiProperty); 
			     	}
			    	//---------end  
		            
	            }
	        }
        });
		
 
		network.ajax = new TCustomerSVGNetworkAjax();

//		var _overViewHtmlParent = networkOverViewPanel.body.dom;
//		var overview = new TWaver.TSVGNetworkOverView(box, {
//			htmlParent : _overViewHtmlParent
//		});

		var _toolbar = new TWaver.TSVGNetworkToolBar(network);
		// _toolbar.initEditorButtons();
		_toolbar.initBaseButtons();
		var scene = $("#DATABOX_KEY").val();
		initCustomButtons(_toolbar, scene);//不同的场景，按钮显示不同。

		box.initializeDataBox();
		networkPanel.on('bodyresize', function(p, width, height) {
			network.refreshSVGNetwork();
		});
		CMDBTopVeiwMask = new Ext.LoadMask('ciEditor', {msg:"处理中，请稍后..."});
	};
}
/**
 * 删除数据库中存在的元素：CINode | CILink
 */
function deleteExistedEle(ciid, type){
    var centerCiid = $("#CENTER_CIID").val();
    if(ciid == centerCiid && centerCiid != null){
    	Ext.MessageBox.show({
  			title: '警告',
			msg: '对不起，核心CI不允许删除！',
			buttons : Ext.MessageBox.OK,
			icon : Ext.MessageBox.INFO
       });
       return;
    }
    var isFromFlow = $("#WORKFLOW_FLAG").val() == "" ? false : $("#WORKFLOW_FLAG").val();
    var contentParameters = [ciid, centerCiid, isFromFlow, issueId];
    var _params = TWaver.svgutils.getContentParameters(contentParameters);
    TWaver.svgutils.setConfig(_params, {
    	'citopo.boxkey' : $("#DATABOX_KEY").val(),
    	'citopo.selected.type' : type,//选中元素的类型：CI, Link
    	'twaver.response.target' : 'network',
        'twaver.handle.method': 'handleRemoveExistedEle'
    });
    network.refreshSVGNetwork(_params, function(){
//       Ext.MessageBox.show({
//  			title: '确认',
//			msg: '标记删除成功，在未点击保存按钮之前，该CI不会被真正删除！',
//			buttons : Ext.MessageBox.OK,
//			icon : Ext.MessageBox.INFO
//       });
    });
}
/**
 * 拷贝添加操作，拷贝的节点除了名称后缀加上"-COPY",其余属性均相同
 */
function copyNode(_currentElement){
        var ids = _currentElement.getAttribute("ciid");
        var contentParameters = [ids];
        var _params = TWaver.svgutils.getContentParameters(contentParameters);
        TWaver.svgutils.setConfig(_params, {
            'twaver.handle.method': 'handleCopyNode'
        });
        network.refreshSVGNetwork(_params, function(){
        });
        
}


function getCustomFields(type, ciid){
	var boxcacheKey = dataBoxCacheKey;
	var centerId = $("#CENTER_CIID").val();
	//通过type取得自定义属性列表
   CIService.getCustomFieldsByTypeId(type, ciid, centerId, boxcacheKey,
   		{callback:function(data){
        		//将CI自定义属性填充指定区域
        		fillCustomCiProperty(data);
        		//add by wjdeng at 6/22 对查询出的自定义属性值加入到页面数据对象中
        		fillCustomCiData2DataMap(ciid,data);
        		//end
        	},
        	errorHandler: function(msg, exc){
        		alert(msg );
        	}
        }
   );
}

	/**
	 * 重新从databox加载数据
	 */
    function doReloadData(){
//        var ids = network.getSelectedElementIDs();
//        var ids_clone = TWaver.svgutils.cloneArray(ids);
//        var contentParameters = [1, ids];
        var _params = {};
        TWaver.svgutils.setConfig(_params, {
        	'citopo.boxkey' : $("#DATABOX_KEY").val(),
        	'citopo.centerId' : $("#CENTER_CIID").val(),
        	'twaver.response.target' : 'network',
            'twaver.handle.method': 'handleReloadDataBox'
        });
        network.refreshSVGNetwork(_params, function(){
	           if(SVGSelectNodeId){//有选中id 重新选中
	           		var thid = SVGSelectNodeId;
	           		SVGSelectNodeId=false;
	           		network.setElementSelectedByID(thid, true);
	           }
	           
          	CMDBTopVeiwMask.hide();
        });
    }

/**
 * 填充自定义属性
 */
function fillCustomCiProperty(data){
//	alert("自定义属性个数："+data.length);
	var trs = $("#CI_CUST_PROP_TABLE tr");
//	alert(trs.length);
	var table = $("#CI_CUST_PROP_TABLE");
	
	//清除原有行
	for(var j=0; j< trs.length; j++){
		$("#CI_CUST_PROP_TABLE tr:eq(0)").remove(); 
	}
	
	if(!data || !data.length || data.length == 0){//无自定义属性
		table.append("<tr><td   class='xq_td_bg xq_td_left xq_td_bott' colspan=2><font color='red'>该CI没有扩展属性.</font></td></tr>");
		validate4selectCIbyform();
		return;
	}
	//------------- add by wjdeng at 6/28
	writCustomPropertyHtml(data,table);
	//-------------- end 
}

/**
 * 填充CI公共属性
 */
function fillCiProperty(data){
	var did= data.ciId?data.ciId:data.cmList.id.columnValueStr;
	var inputid=$("#CIID").val();
	if(did!=inputid){
		//alert(" data:"+ did +"\ninput:"+ inputid);
		return;
	}
	if($("#DATABOX_KEY").val()=="View"){
		$("#ciNameStr").html(data.text == null ? "&nbsp;":data.text);
		$("#ciTypeStr").html(data.ciType == null ? "&nbsp;":data.ciType);
		$("#codeStr").html(data.ciCode == null ? "&nbsp;":data.ciCode);
		$("#versionStr").html(data.version == null ? "&nbsp;":data.version+"&nbsp;");
		//----------modify bywjdeng
		$("#managerStr").html(data.manager == null ? "&nbsp;":data.manager+"&nbsp;");
		$("#phoneStr").html(data.phone == null ? "&nbsp;":data.phone+"&nbsp;");
		$("#positionStr").html( data.position == null ? "&nbsp;":data.position+"&nbsp;");
		$("#sourceStr").html( data.source == null ? "&nbsp;":data.source+"&nbsp;");
		var manufacturerName = data.manufacturerName?data.manufacturerName : (data.cmList.configuration_manufacturer?data.cmList.configuration_manufacturer.columnValueStr:'');//data.cmList.configuration_manufacturer.columnValueStr;
		//var mn1 = data.cmList.configuration_manufacturer;
		$("#manufacturerStr").html((!manufacturerName)?'&nbsp;':manufacturerName);
		var supplierName = data.supplierName?data.supplierName:(data.cmList.configuration_supplier?data.cmList.configuration_supplier.columnValueStr:'');//data.cmList.configuration_supplier.columnValueStr;
		$("#supplierStr").html((!supplierName)?'&nbsp;':supplierName);
		//--------------end
		$("#memoStr").html(data.memo == null ? "&nbsp;":data.memo);
		$("#statusStr").html(data.cmList.configuration_status.columnValueStr);
		return;
	} //NEW, Edit, View
	var textem = data.text == null ? "":data.text;
	textem.replace(/&amp;nbsp;/g,' ');
	$("#ciName").val(textem);
	$("#ciType").val(data.ciType == null ? "":data.ciType);
	$("#ciTypeId").val(data.ciTypeId == null ? "":data.ciTypeId);
	$("#code").val(data.ciCode == null ? "":data.ciCode);
	$("#version").val(data.version == null ? "":data.version);
	//----------modify bywjdeng
	$("#manager").val(data.manager == null ? "":data.manager);
	$("#manager").attr("flexSetId", (!data.managerId  ? "":data.managerId));
	$("#phone").val(data.phone == null ? "":data.phone);
	$("#position").val( data.position == null ? "":data.position);
	//var sourid = data.source?data.source : (data.cmList.configuration_resoure.flexSetId?data.cmList.configuration_resoure.flexSetId:'');//data.cmList.configuration_manufacturer.columnValueStr;
	var sourid = data.cmList.configuration_resoure.flexSetId?data.cmList.configuration_resoure.flexSetId:'';
	$("#source").val(sourid);
	var manufacturerName = data.manufacturerName?data.manufacturerName : (data.cmList.configuration_manufacturer?data.cmList.configuration_manufacturer.columnValueStr:'');//data.cmList.configuration_manufacturer.columnValueStr;
	//var mn1 = data.cmList.configuration_manufacturer;
	$("#manufacturer").val((!manufacturerName)?'':manufacturerName);
	var manufacturerId = data.manufacturerId?data.manufacturerId : (data.cmList.configuration_manufacturer?data.cmList.configuration_manufacturer.flexSetId:'');//data.cmList.configuration_manufacturer.flexSetId;
	$("#manufacturerId").val((!manufacturerId)?'':manufacturerId);
	var supplierName = data.supplierName?data.supplierName:(data.cmList.configuration_supplier?data.cmList.configuration_supplier.columnValueStr:'');//data.cmList.configuration_supplier.columnValueStr;
	$("#supplier").val((!supplierName)?'':supplierName);
	var supplierId = data.supplierId?data.supplierId:(data.cmList.configuration_supplier?data.cmList.configuration_supplier.flexSetId:'');//data.cmList.configuration_supplier.flexSetId;
	$("#supplierId").val((!supplierId)?'':supplierId);
	var statusId = data.cmList.configuration_status.flexSetId;
	$("#status").val(statusId);
	//--------------end
	$("#memo").val(data.memo == null ? "":data.memo);
	if(LockCIMapInTop[data.cmList.id.columnValueStr]== 'false'){
		disableAllInput("edit");
	}else if(LockCIMapInTop[data.cmList.id.columnValueStr]== 'true'){
		disableAllInput('View');
	}
}

/**
 * 填充未保存的CI属性。
 */
function fillUnsavedCIProperty(data){
	$("#ciName").val(data.text == null ? "":data.text);
	$("#ciType").val(data.ciType == null ? "":data.ciType);
	$("#ciTypeId").val(data.ciTypeId == null ? "":data.ciTypeId);
	$("#code").val(data.ciCode == null ? "":data.ciCode);
	$("#version").val(data.version == null ? "":data.version);
	$("#manager").val(data.manager == null ? "":data.manager);
	$("#manager").attr("flexSetId", (!data.managerId  ? "":data.managerId));
	$("#phone").val(data.phone == null ? "":data.phone);
	$("#position").val( data.position == null ? "":data.position);
	$("#source").val( data.source == null ? "":data.source);
	var manufacturerName = data.manufacturerName;//data.cmList.configuration_manufacturer.columnValueStr;
	$("#manufacturer").val((!manufacturerName)?'':manufacturerName);
	var manufacturerId = data.manufacturerId;//data.cmList.configuration_manufacturer.flexSetId;
	$("#manufacturerId").val((!manufacturerId)?'':manufacturerId);
	var supplierName = data.supplierName;//data.cmList.configuration_supplier.columnValueStr;
	$("#supplier").val((!supplierName)?'':supplierName);
	var supplierId = data.supplierId;//data.cmList.configuration_supplier.flexSetId;
	$("#supplierId").val((!supplierId)?'':supplierId);
	$("#memo").val(data.memo == null ? "":data.memo);
	//var statusId = 
}

//更新到databox
function update2DataBox(cmList, key, ciid,val){
	var centerCiId = $("#CENTER_CIID").val();
	CIService.update2DataBox(cmList, key, ciid, centerCiId,val,
   		{	callback:function(data){
   					doReloadData();// 更新数据到databox完了之后 刷新topo图：
        	},
        	errorHandler: function(msg, exc){
        		 Ext.MessageBox.show({
	      			title: '警告',
					msg: msg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO
	           });
        	}
        }
   );
}

/**
 * 选择CI添加到topo图
 */
function addCI2Topo(){
	/*
	var key = dataBoxCacheKey;
//	alert("cacheKey=="+ key);
	var s = $("input[name='CIID_CKS']:checked");	
	var centerCiid = $("input[id='CENTER_CIID']").val();
	var ciids = new Array();
	for(var i=0; i< s.length; i++){
		ciids.push(s[i].value);
	}
	if(ciids.length == 0){
		 Ext.MessageBox.show({
	      			title: '警告',
					msg: '您没选择任何可添加的CI.',
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO
	           });
		return;
	}
	*/
	
	var url = '/itsm/cmdb/ciGrid.do?method=selectCi&oprationCI=s';
		//var win  = openCenterWindow(url,1000,600);
	var win  = tipsWindown('选择CI','iframe:'+url,'1100','630','true','','true','leotheme')
	if(!window.childWin)window.childWin = new Array();
	window.childWin.push(win);
	win.CIselectCallback = CIselectCallback;
	window.CIselectCallback = CIselectCallback;
	
	function CIselectCallback(ciids,objRows){
		var key = dataBoxCacheKey;
		var centerCiid = $("#CENTER_CIID").val();
		
		CMDBTopVeiwMask.show();
		//调用服务器端方法，往databox里增加选中的CIs
		CIService.add2DataBox(key, centerCiid, ciids,
	   		{callback:function(data){
	   				doReloadData();// 更新数据到databox完了之后 刷新topo图：
	   				//doLayout();
	   				/**add by wjdeng * start */
	   				refreshLockCiDetection();//更新锁定状态
	   				CMDBTopVeiwMask.hide();
	   				/** end */
	        	},
	        	errorHandler: function(msg, exc){
	        		 Ext.MessageBox.show({
		      			title: '警告',
						msg: msg,
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.INFO
		           });
		           refreshLockCiDetection();//更新锁定状态
		           doReloadData();
	        	}
	        }
	   );
		
	}
	
	
	
	
}

/**更新当前节点*/
function doSubmit(ciid){
		if(!dataBoxDataMap[ciid])return;
		var cmList = new Array();
		//var ciType = $("#ciType").val();
		//var ciTypeId = $("#selectedCiTypeId").val();
		//var ciid = $("#CIID").val();
		
		//对应dataBoxCache里的key,当增加CI时，key = "NEW", 以一个CI为核心查询CI时，key=[CIID]
		var boxcacheKey = dataBoxCacheKey;
		//DWR，将属性值更新到databox
		//-------- 公共属性 -----------------
		//refreshDataMap();
		if(LockCIMapInTop[ciid]== 'true'){//锁定状态
			return;
		}
		var cmList = creat2DataBoxCmList(ciid);
		var val = ValiMapCIeditTop[ciid];
		update2DataBox(cmList, boxcacheKey, ciid,val);
		return;
}




/***if($("#DATABOX_KEY").val()=="View"){
*以下为邓文佳 添加的方法及操作
*/

//自定义属性列页面输出
function writCustomPropertyHtml(columModels,table){
	//return ;
	 if(!columModels){
	 	validate4selectCIbyform();//校验当前的数据
	 	return;
	 }
	 for( var i=0 ;i <columModels.length; i++){
	 	var col = columModels[i];
	 	var colValue = (col.columnValueStr == null ? '' : col.columnValueStr);
		//var trStr = "<tr><td class='t3'>"+ col.displayName +"</td>";
		if(col.htmlType=='flex'){//下拉选项框
			builderSelectTD(col,table);
		}else if(col.htmlType=='radio'){//单选框
			builderRadioTD(col,table);
		}else if(col.htmlType=='one_string'||col.htmlType=='float'||col.htmlType=='integer'){//单行文本
			buliderInputTD(col,table);
		}else if(col.htmlType=='many_string'){//多行文本
			bulidertextareaTD(col,table);
		}else if(col.htmlType=='date'){//日期
			buliderDateTD(col,table);
		}
	 	
	 }
	 validate4selectCIbyform();//校验当前的数据
	 //network.setElementSelectedByID(networkTagele,true);
	 /**单行日期输出*/
	 function buliderDateTD(col,table){
			var colValue = (col.columnValueStr == null ? '' : col.columnValueStr);
			var trStr = "<tr><td width='25%' class='css_lan_bg xq_td_bott'><div class='cicss_t'>"+ col.displayName +"：<div></td><td width='75%' class='xq_td_bg xq_td_left xq_td_bott' >";
			if($("#DATABOX_KEY").val()=="View" || LockCIMapInTop[$("#CIID").val()]== 'true'){ //NEW, Edit, View
				trStr += colValue;
			}else{
				trStr += " <input onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',vel:'d244_1',onpicked:checkdate,oncleared:checkdate})\"  readonly='true'  class='wdateinput'";
				trStr +=" name='" +col.dbColumn + "' id='"+ col.dbColumn +"' type='text' class='all_input' value='"+ colValue +"' style='width: 140px;'>";
				trStr += "<div id='"+col.dbColumn+"Tip'></div>";
			}
			trStr += "</td></tr>";
			table.append(trStr);
			if($("#DATABOX_KEY").val()=="View"|| LockCIMapInTop[$("#CIID").val()]== 'true'){
				return;
			}
			bindValidate(col,null);
	 }
	 
	 /**多行文本输出*/
	 function bulidertextareaTD(col,table){
			var colValue = (col.columnValueStr == null ? '' : col.columnValueStr);
			var trStr = "<tr><td width='25%' class='css_lan_bg xq_td_bott'><div class='cicss_t'>"+ col.displayName +"：<div></td><td width='75%' class='xq_td_bg xq_td_left xq_td_bott' >";
			if($("#DATABOX_KEY").val()=="View"|| LockCIMapInTop[$("#CIID").val()]== 'true'){
				trStr +=colValue;
			}else{
				trStr += "<textarea rows='3' cols='25' ";
				trStr += "name='" +col.dbColumn + "' id='"+ col.dbColumn +"' class='all_textarea'  >"+ colValue +"</textarea>";
				trStr += "<div id='"+col.dbColumn+"Tip'></div>";
			}
			trStr += "</td></tr>";
			
			table.append(trStr);
			if($("#DATABOX_KEY").val()=="View"|| LockCIMapInTop[$("#CIID").val()]== 'true'){
				return;
			}
			if(col.htmlType=='float'){
				bindValidate(col,{
				regexp:'^[0-9|.]{0,15}$',
				str: ''
				});
				
			}else if(col.htmlType=='integer'){
				bindValidate(col,{
				regexp:'^[0-9]{0,15}$',
				str: ''
				});
			}else{
				bindValidate(col,null);
			}
	 }
	 
	  /**单行输出*/
	 function buliderInputTD(col,table){
			var colValue = (col.columnValueStr == null ? '' : col.columnValueStr);
			var trStr = "<tr><td width='25%' class='css_lan_bg xq_td_bott'><div class='cicss_t'>"+ col.displayName +"：<div></td>";
			trStr += "<td  width='75%' class='xq_td_bg xq_td_left xq_td_bott' >";
			if($("#DATABOX_KEY").val()=="View"|| LockCIMapInTop[$("#CIID").val()]== 'true'){
				trStr += colValue;
			}else{
				trStr += "<input";
				if(col.columnLength){
					trStr +=" maxlength='" +col.columnLength+"' ";
				}
				trStr +=" name='" +col.dbColumn + "' id='"+ col.dbColumn +"' type='text' class='all_input' value='"+ colValue +"' style='width: 140px;'>";
				trStr += "<div id='"+col.dbColumn+"Tip'></div>";
			}
			trStr += "</td></tr>";
			table.append(trStr);
			
			if($("#DATABOX_KEY").val()=="View"|| LockCIMapInTop[$("#CIID").val()]== 'true'){
				return;
			}
			bindValidate(col,null);
	 }
	 
	 /**下拉选项*/
	 function builderSelectTD(col,table){
	 	var tdid = col.dbColumn+"TD";
	 	var trStr = "<tr><td width='25%' class='css_lan_bg xq_td_bott'><div class='cicss_t'>"+ col.displayName +"：<div></td>";
		trStr +=    "<td width='75%' class='xq_td_bg xq_td_left xq_td_bott' id='"+tdid+"' cvalue="+col.flexSetId+">";
		function  FlexValueCalback(data){
			if(data){
				var valstr="";
				var key="";
				var option="<option value=''></option>";
				for(var par in data){
					key  = par;
					for(var i=0 ;i<data[par].length;i++){
						option += "<option value='"+data[par][i].id+"'>"+data[par][i].name+"</option>";
						if($("#"+key+"TD").attr("cvalue")== data[par][i].id){
							valstr = data[par][i].name;
						}
					}
				}
				if($("#DATABOX_KEY").val()=="View" || LockCIMapInTop[$("#CIID").val()]== 'true'){
					$("#"+key+"TD").append(valstr);
					return;
				}
				
				option = "<select class='all_input' style='width: 140px;' id='"+key+"' >" + option;
				option +="</select>";
				option += "<div id='"+col.dbColumn+"Tip'></div>";
				$("#"+key+"TD").append(option);
				$("#"+key).val($("#"+key+"TD").attr("cvalue"));
				bindValidate(col,null);
				OSSfexDataMap[key]= data;//更新下拉列表
			}
		}
		trStr += "</td></tr> ";
		table.append(trStr);
		if(OSSfexDataMap[col.dbColumn]){//下拉列表中值集合已经存在
			FlexValueCalback(OSSfexDataMap[col.dbColumn]);
		}else{
			CIService.getFlexValuesByCloumn(col.flexSetCode,col.dbColumn,FlexValueCalback);
		}
	 }
	 /**单选按钮*/
	 function builderRadioTD(col,table){
	 	var tdid = col.dbColumn+"TD";
	 	var trStr = "<tr><td width='25%' class='css_lan_bg xq_td_bott'><div class='cicss_t'>"+ col.displayName +"：<div></td>";
		trStr +=    "<td width='75%' class='xq_td_bg xq_td_left xq_td_bott' id='"+tdid+"' cvalue="+col.flexSetId+">";
		function  FlexValueCalback(data){
			if(data){
				var valstr="";
				var key="";
				var option="";
				for(var par in data){
					key  = par;
					var value= $("#"+key+"TD").attr("cvalue");//具体值
					for(var i=0 ;i<data[par].length;i++){
						option += "<input type='radio'   name='" +key+"'";
						if($("#DATABOX_KEY").val()=="View"|| LockCIMapInTop[$("#CIID").val()]== 'true'){
							option +=" disabled='true'";
						}
						if(i==0){
							option += "checked='checked'";
						}
						if(value== (data[par][i].id+"")){
							option += "checked='checked'";
							option += "text='"+data[par][i].name+"'";//显示值
							valstr = data[par][i].name;
						}
						option += "  value="+data[par][i].id+" />"+data[par][i].name;
						//option += "<option value='"+data[par][i].id+"'>"+data[par][i].name+"</option>";
					}
				}
				
				if($("#DATABOX_KEY").val()=="View"|| LockCIMapInTop[$("#CIID").val()]== 'true'){
					$("#"+key+"TD").append(valstr);
					return;
				}
				option += "<div id='"+col.dbColumn+"Tip'></div>";
				$("#"+key+"TD").append(option);
				OSSfexDataMap[key]= data;//更新单选列表
				bindValidate(col,null);
				//$("input[name='"+key+"']").attr("checked", true);
				
			}
		}
		trStr += "</td> ";
		//$("#"+key+"TD").attr("cvalue",col.flexSetId);
		table.append(trStr);
		if(OSSfexDataMap[col.dbColumn]){//下拉列表中值集合已经存在
			FlexValueCalback(OSSfexDataMap[col.dbColumn]);
		}else{
			CIService.getFlexValuesByCloumn(col.flexSetCode,col.dbColumn,FlexValueCalback);
		}
	 }
	 
}

/**构造保存到后台数据Column列表*/
function creat2DataBoxCmList(ciid){
		var cmList = new Array();
		cmList.push({dbColumn:"id",columnValueStr:ciid,isCommonColumn:true});//名称
		cmList.push({dbColumn:"configuration_name",columnValueStr:dataBoxDataMap[ciid].text,isCommonColumn:true});//名称
		cmList.push({dbColumn:"configuration_type",columnValueStr:dataBoxDataMap[ciid].ciType, flexSetId: dataBoxDataMap[ciid].ciTypeId,isCommonColumn:true});//CI类型名称
		cmList.push({dbColumn:"configuration_type_id",columnValueStr:dataBoxDataMap[ciid].ciTypeId, isCommonColumn:true});//CI类型ID-隐藏
		cmList.push({dbColumn:"configuration_code",columnValueStr:dataBoxDataMap[ciid].ciCode,isCommonColumn:true});//CI编号
		cmList.push({dbColumn:"configuration_version",columnValueStr:dataBoxDataMap[ciid].version,isCommonColumn:true});//版本号
		var managerId = (!dataBoxDataMap[ciid].managerId)?'':dataBoxDataMap[ciid].managerId;
		cmList.push({dbColumn:"configuration_manager",columnValueStr:dataBoxDataMap[ciid].manager,flexSetId: managerId,isCommonColumn:true});//负责人，管理员
		cmList.push({dbColumn:"configuration_phone",columnValueStr:dataBoxDataMap[ciid].phone,isCommonColumn:true});//电话
		cmList.push({dbColumn:"configuration_position",columnValueStr:dataBoxDataMap[ciid].position,isCommonColumn:true});//位置
		cmList.push({dbColumn:"configuration_resoure",columnValueStr:dataBoxDataMap[ciid].cmList.configuration_resoure.columnValueStr,flexSetId:dataBoxDataMap[ciid].cmList.configuration_resoure.flexSetId,isCommonColumn:true});//来源
		cmList.push({dbColumn:"configuration_manufacturer",columnValueStr:dataBoxDataMap[ciid].cmList.configuration_manufacturer.columnValueStr,flexSetId: dataBoxDataMap[ciid].cmList.configuration_manufacturer.flexSetId,isCommonColumn:true});//生产商
		cmList.push({dbColumn:"configuration_supplier",columnValueStr:dataBoxDataMap[ciid].cmList.configuration_supplier.columnValueStr,flexSetId: dataBoxDataMap[ciid].cmList.configuration_supplier.flexSetId,isCommonColumn:true});//供应商
		cmList.push({dbColumn:"configuration_manufacturerId",columnValueStr:dataBoxDataMap[ciid].manufacturerId,isCommonColumn:true});//生产商id
		cmList.push({dbColumn:"configuration_supplierId",columnValueStr:dataBoxDataMap[ciid].supplierId,isCommonColumn:true});//供应商id
		cmList.push({dbColumn:"configuration_memo",columnValueStr:dataBoxDataMap[ciid].memo,isCommonColumn:true});//备注
		cmList.push({dbColumn:"configuration_status",columnValueStr:dataBoxDataMap[ciid].cmList.configuration_status.columnValueStr,flexSetId: dataBoxDataMap[ciid].cmList.configuration_status.flexSetId,isCommonColumn:true});//备注
		if(dataBoxDataMap[ciid].CustomCiProperty){//自定义属性
			var data = dataBoxDataMap[ciid].CustomCiProperty;
			for(var i=0; i< data.length; i++){
				cmList.push(data[i]);
       			//var dbColumn = data[i].dbColumn;
				//dataBoxDataMap[ciid][dbColumn].columnValueStr = $("#"+data[i].dbColumn).val();
				//data[i].columnValueStr = $("#"+data[i].dbColumn).val();
       		}
		}
		return cmList;
}

/***保存编辑结果**/
function save4dataMap(){
	var boxcacheKey = dataBoxCacheKey;
	var ls = new Array();
	refreshDataMap();//刷新一下js缓存中的数据
	for(var ciid in dataBoxDataMap){
		if(LockCIMapInTop[ciid]== 'true'){//锁定状态
			continue;
		}
		var cmList = creat2DataBoxCmList(ciid);
		ls.push(cmList);
	}
	var centerCiId = $("#CENTER_CIID").val();
	CMDBTopVeiwMask.show();
	CIService.update2DataBoxs(ls,boxcacheKey,centerCiId,{callback:function(data){
				flushDataBoxToDB();
				
   				//refreshLockCiDetection();//刷新锁定的ci
   				//$("#ciType").val('');
				//$("#selectedCiTypeId").val('');
        	},
        	errorHandler: function(msg, exc){
        		 Ext.MessageBox.show({
	      			title: '警告',
					msg: msg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO
	           });
        	}
        }
	);
	
}

function validate4selectCIbyform(){
	var dataBoxKey = $("#DATABOX_KEY").val(); //NEW, Edit, View
	if(dataBoxKey=='Edit'||dataBoxKey=='NEW'){
		$('#CIEDIT_ID').submit();
	}
}


//判断ci的属性值是否需要从数据库来进行加载
function jugeQueryData4db(ciid){
	var dataBoxKey = $("#DATABOX_KEY").val(); //NEW, Edit, View
	if(dataBoxKey=='View'){
		return true;//详情视图为了保持数据一致性,数据从数据库后台加载
	}
	if(!dataBoxDataMap[ciid]){
		return true;//js缓存中没有改ci的信息,数据需要从后台加载
	}else if(!dataBoxDataMap[ciid].cmList){
		return true;
	}
	return false;
}

/**检查ci的属性是否变更过
*@param ciid 检查的ci
*@param scrv ci的某个属性原有值
*@param snv ci的某个属性目前的值
*/
function checkhasChange4Ci(ciid,scrv,snv){
	if(!ciid) return;
	//if(typeof(scrv)=='undefined'||!snv)return;
	if(scrv!= snv){
		CIoperationStatusDataMap[ciid]=true;
	}
}

//更新节点的属性值
function refreshDataMap(){
	
		var ciType = $("#ciType").val();
		var ciTypeId = $("#selectedCiTypeId").val();
		var ciid = $("#CIID").val();
		if(!ciid||'null'==ciid)return;
		if(ciTypeId=='')return;
		//对应dataBoxCache里的key,当增加CI时，key = "NEW", 以一个CI为核心查询CI时，key=[CIID]
		var boxcacheKey = dataBoxCacheKey;
		
		if(!dataBoxDataMap[ciid] ){
			return;
		}
		//检查各个字段是否被修改过
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].text,$("#ciName").val());
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].ciCode,$("#code").val());
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].version,$("#version").val());
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].manager,$("#manager").val());
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].phone,$("#phone").val());
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].position,$("#position").val());
		
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].cmList.configuration_manufacturer.columnValueStr,$("#manufacturer").val());
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].cmList.configuration_supplier.columnValueStr,$("#supplier").val());
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].memo,$("#memo").val());
		
		dataBoxDataMap[ciid].text		= $("#ciName").val();
		dataBoxDataMap[ciid].ciType 	= ciType;
		dataBoxDataMap[ciid].ciTypeId 	= ciTypeId;
		dataBoxDataMap[ciid].ciCode		= $("#code").val();
		dataBoxDataMap[ciid].version 	= $("#version").val();
		
		dataBoxDataMap[ciid].manager 	= $("#manager").val();
		dataBoxDataMap[ciid].managerId 	= (!$("#manager").attr("flexSetId"))?'':$("#manager").attr("flexSetId");
		dataBoxDataMap[ciid].phone 		= $("#phone").val();
		dataBoxDataMap[ciid].position 	= $("#position").val();
		
		var select = document.getElementById("source");
		var fid = "";
		var ft =""; 
		if(select){
			var fid = select.value;
			var ft = select.options[select.selectedIndex].text;
		}
		
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].cmList.configuration_resoure.columnValueStr,ft);
		
		checkhasChange4Ci(ciid,dataBoxDataMap[ciid].cmList.configuration_status.columnValueStr,$("#status").find("option:selected").text());
		
		//var fid = $("#"+data[i].dbColumn).val();
		//var ft = $("#"+data[i].dbColumn+" option[checked]").text();
		//.configuration_resoure.flexSetId
		//dataBoxDataMap[ciid].source.flexSetId = fid;
		//dataBoxDataMap[ciid].source.columnValueStr = ft;
		dataBoxDataMap[ciid].cmList.configuration_resoure.flexSetId = fid;
		dataBoxDataMap[ciid].cmList.configuration_resoure.columnValueStr = ft;
		//data[i].source = fid;
		dataBoxDataMap[ciid].source 	= fid;
		dataBoxDataMap[ciid].sourceName = ft;
		
		dataBoxDataMap[ciid].manufacturerName= $("#manufacturer").val();
		dataBoxDataMap[ciid].cmList.configuration_manufacturer.columnValueStr = dataBoxDataMap[ciid].manufacturerName;
		
		dataBoxDataMap[ciid].supplierName 	= $("#supplier").val();
		dataBoxDataMap[ciid].cmList.configuration_supplier.columnValueStr = dataBoxDataMap[ciid].supplierName;
		
		dataBoxDataMap[ciid].supplierId = $("#supplierId").val();
		dataBoxDataMap[ciid].cmList.configuration_supplier.flexSetId = dataBoxDataMap[ciid].supplierId;
		
		dataBoxDataMap[ciid].manufacturerId = $("#manufacturerId").val();
		dataBoxDataMap[ciid].cmList.configuration_manufacturer.flexSetId = dataBoxDataMap[ciid].manufacturerId;
		
		dataBoxDataMap[ciid].ciId = ciid;
		dataBoxDataMap[ciid].cmList.id.columnValueStr = ciid;
		
		dataBoxDataMap[ciid].cmList.configuration_status.flexSetId = $("#status").val();
		dataBoxDataMap[ciid].cmList.configuration_status.columnValueStr = $("#status").find("option:selected").text();
		
		dataBoxDataMap[ciid].memo = $("#memo").val();
		var debug = dataBoxDataMap;
		if(dataBoxDataMap[ciid].CustomCiProperty){//自定义属性
			var data = dataBoxDataMap[ciid].CustomCiProperty;
			for(var i=0; i< data.length; i++){
       			var dbColumn = data[i].dbColumn;
       			var col = data[i];
       			if(col.htmlType=='radio'){//单选
       				var fid = $("input[type='radio'][checked][name='"+dbColumn+"']").val();
       				var ft ="";
       				var fexset = OSSfexDataMap[dbColumn][dbColumn];//       				
       				for(var j=0 ;j < fexset.length;j++){
       					if(fexset[j].id==fid){
       						ft = fexset[j].name;
       						break;
       					}
       				}
					//var ft = $("input[type='radio'][checked][name='"+dbColumn+"']").attr("text");
					checkhasChange4Ci(ciid,dataBoxDataMap[ciid][dbColumn].flexSetId,fid);//检查是否被修改过
       				dataBoxDataMap[ciid][dbColumn].flexSetId = fid;
					dataBoxDataMap[ciid][dbColumn].columnValueStr = ft;
					data[i].columnValueStr  = ft;
					data[i].flexSetId = fid;
				}else if(col.htmlType=='flex'){//下拉框
					var select = document.getElementById(data[i].dbColumn);
					if(!select)break;
					var fid = select.value;
					var ft = select.options[select.selectedIndex].text;
					//var fid = $("#"+data[i].dbColumn).val();
					//var ft = $("#"+data[i].dbColumn+" option[checked]").text();
					checkhasChange4Ci(ciid,dataBoxDataMap[ciid][dbColumn].flexSetId,fid);//检查是否被修改过
					dataBoxDataMap[ciid][dbColumn].flexSetId = fid;
					dataBoxDataMap[ciid][dbColumn].columnValueStr = ft;
					data[i].columnValueStr = ft;
					data[i].flexSetId = fid;
				}else {
					checkhasChange4Ci(ciid,dataBoxDataMap[ciid][dbColumn].columnValueStr,$("#"+data[i].dbColumn).val());//检查是否被修改过
					dataBoxDataMap[ciid][dbColumn].columnValueStr = $("#"+data[i].dbColumn).val();
					data[i].columnValueStr = $("#"+data[i].dbColumn).val();
				}
       		}
		}
		
} 

//将从后台取得的数据存储到存储top图中节点公共属性
function fillCiData2DataMap(ciid,data){
	dataBoxDataMap[ciid]={
		text 		: data.text == null ? "":data.text,
		ciType 		: data.ciType == null ? "":data.ciType,
		ciTypeId 	: data.ciTypeId == null ? "":data.ciTypeId,
		ciCode 		: data.ciCode == null ? "":data.ciCode,
		version 	: data.version == null ? "":data.version,
		manager 	: data.manager == null ? "":data.manager,
		managerId	: data.managerId == null ? "":data.managerId, 
		phone 		: data.phone == null ? "":data.phone,
		position	: data.position == null ? "":data.position,
		source 		: data.source == null ? "":data.source,
		manufacturerName: data.manufacturer == null ? "":data.manufacturerName,
		supplierName: data.supplier == null ? "":data.supplierName,
		manufacturerId :data.manufacturerId == null ? "":data.manufacturerId,
		supplierId  : data.supplierId == null ? "":data.supplierId,
		memo 		: data.memo == null ? "":data.memo,
		cmList		: data.cmList
	}
}
//将从后台取得的数据存储top图中节点自定义属性
function fillCustomCiData2DataMap(ciid,data){
	if(typeof(dataBoxDataMap[ciid])=='undefined' ){
		dataBoxDataMap[ciid]=new Object();
	}
	dataBoxDataMap[ciid].CustomCiProperty = data;//自定义属性
	for(var i=0; i< data.length; i++){
		var colValue = (data[i].columnValueStr == null ? '' : data[i].columnValueStr);
		var dbColumn = data[i].dbColumn;
		dataBoxDataMap[ciid][dbColumn]={
			dbColumn : dbColumn,
			columnValueStr:colValue,
			displayName:data[i].displayName,
			isCommonColumn:false
			//colValue;//自定义属性值
		}
	}
	
}


//页面初始化加载时执行ci锁定相关功能
if($("#DATABOX_KEY").val()=='Edit'||$("#DATABOX_KEY").val()=='NEW'){
		detection('',(new Date()).getTime())
}



/***
*更新锁定的ci
*/
function refreshLockCiDetection(){
	var flag = 0;
	//issueId, wfFlag
	CIService.getAllCIIds(dataBoxCacheKey, centerCiId, issueId, wfFlag, {
			callback:function(data){
   				flag = 1;//数据已返回
   				/**modify by wjdeng 获取到编辑的全部ci*/
   				var ciids = "";//
   				for(var i=0; i< data.length; i++){
   					if(i!=0) ciids += ",";
   					ciids += data[i];
   				}
   				if(ciids.indexOf("AUTO") != -1){//节点的数据仍不正确
					//refreshLockCiDetection();
				}else{
	   				$("#LOCKID").val(ciids);
	 				refreshDetectionCI(ciids,(new Date()).getTime());
				}
   				//alert(ciids);
				//alert($("#CENTER_CIID").val());
   				/*end */
        	},
        	errorHandler: function(msg, exc){
        		 flag = 2;
        	}
	});
}

/**
 * 获取当前拓扑图中所有的CI
 */
function getAllCiIds(){
	var ciids = new Array();
	var flag = 0;
	//issueId, wfFlag
	CIService.getAllCIIds(dataBoxCacheKey, centerCiId, issueId, wfFlag, {
			callback:function(data){
				//alert('返回。。。');
   				flag = 1;//数据已返回
   				for(var i=0; i< data.length; i++){
   					ciids.push(data[i]);
   				}
   				/*end */
   				return ciids;
        	},
        	errorHandler: function(msg, exc){
        		 flag = 2;
        	}
	});
	
}

/**
*离开编辑页面解除当前用户锁定ci
*/
window.onbeforeunload = function(){
	//alert(window.navigate());CIService.getAllCIIds(dataBoxCacheKey, centerCiId, issueId, wfFlag, callback);
	var key = $("#DATABOX_KEY").val();
	if(key=='NEW'||key=='Edit'){
		//if(window.navigator.appName=='Netscape'){//火狐,chrame浏览器在onbeforeunload事件中调用ajax在浏览器阻塞的情况下才能百分百成功(ie无此问题,恶心的情况...)
			return "如果您没有进行保存操作，您的编辑结果将被重新加载或丢失！";
		//}else{
		//	refreshDetectionCI($("#LOCKID").val(),0,'POST');
		//}
	}
}

/**
*离开编辑页面解除当前用户锁定ci
*/
window.onunload = function(){
	//alert(window.navigate());CIService.getAllCIIds(dataBoxCacheKey, centerCiId, issueId, wfFlag, callback);
	var key = $("#DATABOX_KEY").val();
	if(key=='NEW'||key=='Edit'){
		//if(window.navigator.appName=='Netscape'){//火狐,chrame浏览器在onbeforeunload事件中调用ajax在浏览器阻塞的情况下才能百分百成功(ie无此问题,恶心的情况...)
			refreshDetectionCI($("#LOCKID").val(),0,'POST');
		//}
	}
}



/***
*页面操作的ci发生变化后,后台发送ci变化情况
*/
function refreshDetectionCI(lockid,sque,method){
	if(!method) method='GET';
	$.ajax ( {
		url: '/itsm/cmdb/DetectionClentKeepAlive' ,
		type: method ,
		data :
	    {
	         LOCKID : lockid,
	         SQUE : (new Date()).getTime()
	    },
		beforeSend: function ( R) {
    		R.setRequestHeader ( 'Connection' , 'Keep-Alive' ) ;
	  	}
	} ) ;
}

/**
*页面加载时向后台发送请求,反应页面初始包含的ci并保持连接
*/
function detection(lockid,sque){
	$.ajax ( {
		url: '/itsm/cmdb/DetectionClentKeepAlive' ,
		type: 'POST' ,
		data :
	    {
	         LOCKID : lockid,
	         SQUE : sque,
	         METHOD: 'GET'
	    },
		beforeSend: function ( R) {
    		R.setRequestHeader ( 'Connection' , 'Keep-Alive' ) ;
	  	},
	  	success : function(html){
	  		if(html){
	  			var tem = html.split(":");
	  			if(typeof(tem)=='object'){
	  				var lockidt = tem[1];
	  				if(!lockidt)lockidt="";
	  				detection(lockidt,tem[0]);
	  			} 
	  			
	  		}
		}
	} ) ;
}
/**---------------------邓文佳添加结束----------------------------------------------**/

TSVGConstants.SVGAPP_Resource_Prefix = '../';
Ext.BLANK_IMAGE_URL = "../images/default/s.gif";

var ciEditor = new CIEditor();
//Ext.onReady(ciEditor.init);
Ext.onReady(function(){
	ciEditor.init();
//$("#DATABOX_KEY").val(), //NEW, Edit, View
	var key = $("#DATABOX_KEY").val();
	if(key=='NEW'||key=='Edit'){
		//detection(editCI_ciIds,(new Date()).getTime())
		refreshLockCiDetection();
	}
});
var loadingDiv = document.getElementById('loading');
loadingDiv.style.display = 'none';


//CMDBTopVeiwMask.show();
