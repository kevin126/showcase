Apex.common.ItsmPrompt = function(module,callback,winConfig){
	var form = new Ext.form.FormPanel({
		baseCls: 'x-plain',
		monitorValid: true,
		labelAlign: 'top',
		buttonAlign: 'center',
		bodyStyle:'padding:5px 0px 0px 10px',
		items : module,
		buttons : [{text: '确定', formBind: true, handler: handleOkBtn}, 
				{text: '取消', handler: function() {prompt.close();}}]		
	});
	var title = '输入';
	var width = 300;
	var height = 200;
	if(!Ext.isEmpty(winConfig)){
		if(!Ext.isEmpty(winConfig.title))
			title = winConfig.title
		if(!Ext.isEmpty(winConfig.width))
			width = winConfig.width
		if(!Ext.isEmpty(winConfig.height))
			height = winConfig.height
	}
	var prompt = new Ext.Window({
				title : title,
				width : width,
				height : height,
				resizable : false,
				modal : true,
				plain:true,
				layout: 'fit',
				items : form	
			});	
	function handleOkBtn(){
		var message = module.getValue().trim();
		callback(message);
	}
	prompt.show();
	return prompt;
}