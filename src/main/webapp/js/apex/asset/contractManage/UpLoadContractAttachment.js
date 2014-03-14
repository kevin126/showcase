Ext.namespace('Apex.asset');
Apex.asset.UpLoadContractAttachmentWin = function() {
	var mainPanel = null;
	var numberIndex = 0;
	var attachPanel = null;
	//判断是否有上传文件爱你
	var value1=false;
	var value2=false;
	var value3=false;
	var value4=false;
	var daAry = new Array();
	attachPanel = new Ext.FormPanel({
				border : false,
//				width:456,
				fileUpload : true,
				tbar : [{
							text : '增加附件',
							cls : 'x-btn-text-icon',
							icon : 'images/icons/add.gif',
							handler : function() {
								addAttachment(numberIndex)
							}
						}, {
							text : '删除附件',
							cls : 'x-btn-text-icon',
							icon : 'images/icons/delete.gif',
							handler : delAttachment
						}],
				frame : false,
				bodyStyle : 'padding:5px 5px 0',
				items : [{
							layout : 'column',
							items : [{
										id : 'attachment_checkbox_add',
										hideLabel : true,
										columnWidth : .05,
										layout : 'form',
										items : []
									}, {
										id : 'attachment_filetext_add',
										columnWidth : .95,
										layout : 'form',
										hideLabel : true,
										items : []
									}]
						}]
			});
	mainPanel = new Ext.Panel({
				frame : true,
				border : false,
				autoHeight: true,
				region: 'south',
				items : attachPanel
			});

	function addExistAttachment(index, attach) {
		var tempCheckbox = new Ext.form.Checkbox({
					id : 'attachCheckbox_add' + index,
					hideLabel : true,
					checked : false,
					anchor : '95%'
				});
		mainPanel.findById('attachment_checkbox_add').add(tempCheckbox);
		mainPanel.findById('attachment_checkbox_add').doLayout();
		mainPanel.findById('attachment_filetext_add').add({
					id : 'attachTextfiled_add' + index,
					xtype : 'textfield',
					hideLabel : true,
					name : 'existAttach',
					value : attach,
					disabled : true,
					anchor : '95%'
				});
		mainPanel.findById('attachment_filetext_add').doLayout();
		numberIndex++
	};

	function addAttachment(index) {
		if (index < 4) {
			var tempCheckbox = new Ext.form.Checkbox({
						id : 'attachCheckbox_add' + index,
						hideLabel : true,
						checked : false,
						anchor : '95%'
					});
			mainPanel.findById('attachment_checkbox_add').add(tempCheckbox);
			mainPanel.findById('attachment_checkbox_add').doLayout();
			mainPanel.findById('attachment_filetext_add').add({
						id : 'attachTextfiled_add' + index,
						xtype : 'textfield',
						hideLabel : true,
						inputType : 'file',
						name : 'last',
						anchor : '95%'
					});
			mainPanel.findById('attachment_filetext_add').doLayout();
			numberIndex++
		} else {

			Ext.Msg.show({
						title : '提示',
						msg : '最多只能上传四个附件！',
						modal : true,
						fn : function() {
							return;
						},
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.INFO
					});

		}
	};

	function delAttachment() {
		if (numberIndex > 0) {
			var deleteList = new Array();
			for (var i = 0; i < numberIndex; i++) {
				var tempCheckBox = mainPanel.findById('attachCheckbox_add' + i);
				if (null != tempCheckBox && tempCheckBox.getValue())
					deleteList.push(i);
			}
			if (deleteList.length == 0) {
				Ext.Msg.show({
							title : '提示',
							msg : '请选择你要删除的附件！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.INFO
						});
			} else {
				for (var i = 0; i < deleteList.length; i++) {
					mainPanel.findById('attachment_checkbox_add')
							.remove('attachCheckbox_add' + deleteList[i]);
					var tempText = mainPanel
							.findById('attachment_filetext_add')
							.findById('attachTextfiled_add' + deleteList[i]);
					if (tempText != null) {
						if (tempText.getName() == 'existAttach') {
							daAry.push(tempText.getValue());
						}
					}
					mainPanel.findById('attachment_filetext_add')
							.remove('attachTextfiled_add' + deleteList[i]);
				}
				mainPanel.findById('attachment_checkbox_add').doLayout();
				mainPanel.findById('attachment_filetext_add').doLayout();;
			}
		} else {
			Ext.Msg.show({
						title : '提示',
						msg : '请先添加附件！',
						modal : true,
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.INFO
					});
		}
	};

	this.upLoadeFiles = function(contractName, callBacFn) {
		var empty = true;
		if (numberIndex > 0) {
			empty = false;
		}
		var attachFileName = '';
		for (var i = 0; i < numberIndex; i++) {
			var tempFileText = Ext.getCmp('attachTextfiled_add' + i);
			if(Ext.isEmpty(tempFileText)){
			continue;
			}
			if (tempFileText.getValue()!=null && tempFileText.getValue()!='' && tempFileText.getValue()!="") {
				attachFileName += tempFileText.getValue() + ';';
			}
		}
		//没有要上传的文件
		if(value1==false && value2==false && value3==false && value4==false){
		return;
		}
		
		if (!Ext.isEmpty(attachFileName)) {
			attachFileName = attachFileName.substring(0, attachFileName.length
							- 1);
		}
		if (!empty) {
			var uploadAttachMask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在上传附件，请稍等..."
					});
			uploadAttachMask.show();
		}
		attachPanel.getForm().submit({
					url : 'contractAttachmentServlet?contractName='
							+ contractName,
					success : function(form, action) {
						if (!empty) {
							uploadAttachMask.hide();
						}
						callBacFn();
//						Ext.MessageBox.show({
//									title : '提示',
//									msg : '附件上传成功',
//									buttons : Ext.MessageBox.OK,
//									icon : Ext.Msg.INFO
//								});
						return;
					},
					failure : function(form, action) {
						if (!empty) {
							uploadAttachMask.hide();
						}
						var value = action.result.message;
						Ext.Msg.show({
									title : '错误',
									msg : value,
									modal : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});
						return;
					}
				});
	}
	this.getPanel = function() {
		return mainPanel;
	}
	this.getUpLoadPanel = function() {
		return attachPanel;
	}
	
	this.hasAttachment=function(){
		//没有要上传的文件
			for (var i = 0; i < numberIndex; i++) {
			var tempFileText = Ext.getCmp('attachTextfiled_add' + i);
			
			if(Ext.isEmpty(tempFileText)){
			continue;
			}
			if (tempFileText.getValue()!=null && tempFileText.getValue()!=''&& tempFileText.getValue()!="") {
				if(i==0){
				value1=true;
				}
				if(i==1){
				value2=true;
				}
				if(i==2){
				value3=true;
				}
				if(i==3){
				value4=true;
				}
			}
		}
		
		if(value1==false && value2==false && value3==false && value4==false){
		return false;
		}
		else{
		return true;
		}
	}
	return this;
}