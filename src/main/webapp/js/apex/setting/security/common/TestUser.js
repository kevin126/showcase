function testAccount(phone, employeeNumber, Account) {
	var telephone = document.getElementById(phone).value;
	var employeeNo = document.getElementById(employeeNumber).value;
	var internetAccount = document.getElementById(Account).value;

	var checkboxSelect = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	var columns = [new Ext.grid.RowNumberer(), checkboxSelect, {
				header : '电话号码',
				dataIndex : 'telephone',
				align : 'center'
			}, {
				width: 200,
				header : '上网账号',
				dataIndex : 'internetAccount',
				align : 'center'
			}, {
				width: 200,
				header : '学工号',
				dataIndex : 'employeeNo',
				align : 'center'
			}];
	var record = new Ext.data.Record.create([{
				name : 'telephone'
			}, {
				name : 'employeeNo'
			}, {
				name : 'internetAccount'
			}, {
				name : 'cardTypeId'
			}, {
				name : 'cardNo'
			}, {
				name : 'status'
			}, {
				name : 'planId'
			}, {
				name : 'stopTime'
			}, {
				name : 'balance'
			}]);
	var reader = new Ext.data.JsonReader({
				totalProperty : 'totalCount',
				root : 'tbUserVoList',
				id : 'id'
			}, record);
	var store = new Ext.data.Store({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : SecurityService.testTbUser,
							listeners : {
								'beforeload' : function(dataProxy, params) {
									var loadArgs = [telephone, internetAccount,employeeNo];
									params[dataProxy.loadArgsKey] = loadArgs;
								}
							}
						}),
				reader : reader
			});
	var gridPanel = new Ext.grid.GridPanel({
				id : 'tbUserVoTable',
				region : "north",
				store : store,
				columns : columns,
				sm : checkboxSelect,
				autoScroll : true,
				//autoExpandColumn : 3,
				enableHdMenu : false,
				height : 200,
				margins : '5 0 5 0'
			})

	store.load({
		callback : function(){
			var usersNum = store.getCount();
			if(usersNum > 0){
				 checkboxSelect.selectRow(0);
			}
		}
	});

	var cardType = new Ext.form.TextField({
				fieldLabel : '证件类型',
				readOnly : true
			});
	var cardNo = new Ext.form.TextField({
				fieldLabel : '证件号',
				readOnly : true
			});
	var status = new Ext.form.TextField({
				fieldLabel : '账号状态',
				readOnly : true
			});
	var plan = new Ext.form.TextField({
				fieldLabel : '当前套餐',
				readOnly : true
			});
	var stopTime = new Ext.form.TextField({
				fieldLabel : '服务停止时间',
				readOnly : true
			});
	var balance = new Ext.form.TextField({
				fieldLabel : '账户余额',
				readOnly : true
			});
	var formPanel = new Ext.form.FormPanel({
				labelWidth : 80,
				frame : true,
				items : [{
							xtype : 'panel',
							layout : 'column',
							labelWidth : 80,
							defaults : {
								border : false,
								layout : 'form',
								labelWidth : 80,
								columnWidth : .50
							},
							items : [{
										items : cardType
									}, {
										items : cardNo
									}]
						}, {
							xtype : 'panel',
							layout : 'column',
							labelWidth : 80,
							defaults : {
								border : false,
								layout : 'form',
								labelWidth : 80,
								columnWidth : .50
							},
							items : [{
										items : status
									}, {
										items : plan
									}]
						}, {
							xtype : 'panel',
							layout : 'column',
							labelWidth : 80,
							defaults : {
								border : false,
								layout : 'form',
								labelWidth : 80,
								columnWidth : .50
							},
							items : [{
										items : stopTime
									}, {
										items : balance
									}]
						}]
			});

	var win = new Ext.Window({
				title : '账号状态',
				closable : true,
				border : false,
				plain : true,
				width : 520,
				resizable : false,
				modal : true,
				items : [gridPanel, formPanel]
			});
	win.show();
	checkboxSelect.on('rowselect', handleChange);
	function handleChange() {
		var selectRecord = checkboxSelect.getSelected();
		cardType.setValue(selectRecord.get('cardTypeId'));
		cardNo.setValue(selectRecord.get('cardNo'));
		status.setValue(selectRecord.get('status'));
		plan.setValue(selectRecord.get('planId'));
		stopTime.setValue(selectRecord.get('stopTime'));
		balance.setValue(selectRecord.get('balance'));
	}

}