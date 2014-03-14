/**
 * 
 * 约定:types为调用时传来的参数.形式为txt-xls-jpg-png
 * 
 * uploadid为上传后要填充路径的控件id
 * 
 * 上传的属性均为upload
 * 
 * 功能:页面调用openUpload("","");方法即可
 * 
 */

//this.config.type, this.config.cmpId, this.config.maxSize, this.config.ctype, this.config.picType
//type, id, maxSize, ctype, picType
function openUpload(config, store) {
	// ...允许上传的后缀名
	var types = config.type;
	//文件大小限制
	var maxSize = config.maxSize;//KB
	
	/**
	 * 类别：chassis还是拓扑图上的,
	 * 如果是chassis模块的上传，可能有以下值:
	 * c-port(端口) - 保存至upload\\chassis\ports
	 * c-card(板卡) - 保存至upload\\chassis\cards
	 * c-rack(机架) - 保存至upload\\chassis\racks
	 */
//	this.ctype = ctype;
	
	// ...上传后填充控件的id
	var uploadid = config.cmpId;
	
	var picType = config.picType;
	
	var ctype;
	
	var st = store;
	
//	alert(type + "--" + id);
	//alert('ctype=' + ctype + "   uploadid = " + uploadid);
	if(!Ext.isEmpty(config.ctype)){
		ctype = config.ctype;
	}
	maxSize = maxSize;
	if(id == null || id == undefined){
		uploadid = "file";
	}else{
		uploadid = id;
	}
	
	
	var formUpload;
	function creatFileInput(){
		formUpload = new Ext.form.FormPanel({
					baseCls : 'x-plain',
					labelWidth : 80,
					fileUpload : true,
					defaultType : 'textfield',
					items : [{
								xtype : 'textfield',
								fieldLabel : '文 件',
								id: 'file',
								name : 'upload',
//								readOnly: true,
								width: 200,
								height: 22,
								inputType : 'file',
//								allowBlank : false,
								blankText : '请上传文件',
								anchor : '90%' // anchor width by percentage
							}]
				});
		return formUpload;
	}
	

var winUpload = new Ext.Window({
			title : '资源上传',
			width : 400,
			height : 120,
			minWidth : 300,
			minHeight : 120,
			layout : 'fit',
			plain : true,
			bodyStyle : 'padding:5px;',
			buttonAlign : 'center',
			items : creatFileInput(),
			buttons : [{
				text : '上 传',
				handler : function() {
					if (formUpload.form.isValid()) {
						Ext.MessageBox.show({
									title : '上传',
									msg : '请等待，上传中...',
									progressText : '',
									width : 300,
									progress : true,
									closable : false,
									animEl : 'loding'
								});

						formUpload.getForm().submit({
	
							url : '/itsm/upload?types=' + types + '&maxSize=' + maxSize + '&ctype=' + ctype + '&picType='+picType,
							success: function(form, action) {
//								alert("uploadid=="+uploadid);
								if(uploadid != 'file'){
									var uploadTxt = Ext.getCmp(uploadid);
									var fileValue = Ext.getCmp('file').getValue();
									if (null != fileValue) {
										var start = fileValue.lastIndexOf('\\');
										if (-1 == start) {
											start = fileValue.lastIndexOf('/');
										}
										var fileName = fileValue.substring(start + 1);
										if(uploadTxt){
											uploadTxt.setValue(fileName);
										}
									}
								}
								//alert(action.response.responseText);
								//alert(jsonobject.msg);
								var value = action.result.msg;
								Ext.Msg.alert('成功', value);
								winUpload.close();
								st.reload();//刷新父窗口
							},
							failure: function(form, action) {
								//alert(action.response.responseText);
//								var jsonobject = Ext.util.JSON
//										.decode(action.response.responseText);
								//alert(action.response.responseText);
								var value = action.result.msg;
								Ext.MessageBox.show({
									title : '错误',
									msg : value,
									buttons : Ext.MessageBox.OK,
									icon : Ext.Msg.ERROR
									});
							}
						})
					}
				}
			}, {
				text : '取 消',
				handler : function() {
					winUpload.close();
				}
			}]
		});
	
	
	winUpload.show();
}


