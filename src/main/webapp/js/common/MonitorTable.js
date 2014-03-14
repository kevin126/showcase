Ext.namespace('Apex.Common.MonitorTable');

/*****************************************************************************************************************************
 * COMPANY:            TEKVIEW
 * CRATE BY:           JONIM
 * CREATE DATE:        2009-10-10
 * LAST UPDATE DATE:
 * LAST UPDATE BY:
 * DESCRIPTION:        This funtion is to create a grid panel .
 * ****************************************************************************************************************************
 */
Apex.Common.MonitorTable.Panel = function(orderType,orderId){
	var checkboxSelect = new Ext.grid.CheckboxSelectionModel();
	//the grid column head
	var column = [new Ext.grid.RowNumberer(), 
	                checkboxSelect,
		            {header : "索引",dataIndex : 'id',width : 10,hidden : true,sortable : true},
		            {header : "工单类型",dataIndex : 'orderType',width : 50,hidden : true,sortable : true},
		          	{header : "工单号",dataIndex : 'orderId',width : 120,sortable : true}, 
		          	{header : "监控人",dataIndex : 'userName',width : 120,sortable : true},
		          	{header : "关注时间",dataIndex : 'createDate',width : 120,sortable : true,renderer : dateFormat}
		         ];

    //the grid key mapping
	var record = Ext.data.Record.create([
		                                     {name : 'id',mapping : 'id'},  
		                                     {name : 'orderType',mapping : 'orderType'},
		                                     {name : 'orderId',mapping : 'orderId'}, 
		                                     {name : 'userName',mapping : 'userName'},
		                                     {name : 'createDate',mapping : 'createDate'}
		                                ]);
    //organizte the data format
	var reader = new Ext.data.JsonReader({
				totalProperty : "DataSize",
				root : "DataList"
			}, record);
			
   //get the data from db use dwr and spring service bean mathod which is define even as reader's format
	var gStore = new Ext.data.Store({
		 storeId : 'OrderMonitor_store_id',
	     proxy : new Ext.ux.data.DWRProxy({
				 dwrFunction : OrderMonitorService.getOrderMonitors,
				 listeners : {'beforeload' : 
				               function(dataProxy, params) {
				                                                var loadArgs = [orderType,orderId];
						                                        params[dataProxy.loadArgsKey] = loadArgs;
					                                        }
				             }
			     }),
	    reader : reader
    });
    
    //新建按钮
	var newBtn = new Ext.Button({
			text : '添加',
			cls : 'x-btn-text-icon',
			icon : 'images/icons/add.gif',
			handler : handleNewRequest,
			minWidth : 40
		});
	//delete按钮
	var deleteBtn = new Ext.Button({
			text : '删除',
			cls : 'x-btn-text-icon',
			icon : 'images/icons/delete.gif',
			handler : deletesOrderEvent,
			minWidth : 40
		});
    
    //create the gridpanel
	var gpanel = new Ext.grid.GridPanel({
				store : gStore,
				columns : column,
				autoScroll : true,
				height:200,
				enableHdMenu : false,
				autoExpandColumn : 5,
				margins : '5 0 0 0',
				region : 'center',
				 sm: checkboxSelect,
				viewConfig: {
			        forceFit: true
			    },
			    tbar : [newBtn,'-',deleteBtn]
			});
   //delete order mathod
   function deletesOrderEvent() {
		Ext.Msg.confirm("确认", "您确定要删除选中的监控人吗？", function(button) {
			if (button == 'yes') {
				var selectRows = gpanel.getSelectionModel()
						.getSelections();
				if (selectRows) {
					var list = [];
					for (var i = 0; i < selectRows.length; i++) {
						list.push(selectRows[i].get('id'));
					}
					var myMask = new Ext.LoadMask(Ext.getBody(), {
								msg : "数据处理中，请稍后..."
							});
					myMask.show();
					OrderMonitorService.deleteOrderMonitors(list, {
								callback : function() {
									Ext.StoreMgr
											.lookup('OrderMonitor_store_id')
											.reload();
									myMask.hide();
								},
								errorHandler : function(errorString, exception) {
									myMask.hide();
									Ext.MessageBox.show({
												title : '错误',
												msg : exception.message,
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								}
							});
				}
			}
		});
	}
	
    function reloadGrid() {
		gStore.load();
	};
	
	function createSubmitGridPanel() {
        var panel = new Ext.Panel({
					layout : 'fit',
					autoScroll : true,
					frame : false,
					border : false,
					region:'center' ,
					items : [gpanel],
					renderTo:'orderMonitor_e'
				});
    	reloadGrid();
		return panel;
	};
    
    //弹出框
    function handleNewRequest() {
		var win = Apex.Common.AddOrderMonitorWin.Window(reloadGrid,orderType,orderId);
		win.getWin();
	};
	
    var mainPanel = createSubmitGridPanel();
    
	this.getPanel = function() {
		return mainPanel;
	};
};

