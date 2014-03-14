/**
 * 用法：
 * <pre>
 * var prompt = new Apex.common.prompt('IPAddress', null, function(text){});
 * prompt.show();
 * </pre><br>
 * @param {} vtype vtype输入格式限制(默认为‘IPAddress’)
 * @param {} label 显示提示(默认为‘请输入IP地址’)
 * @param {} fn 回调函数，用于接收参数
 * @param {} defaultValue 在窗口打开时设置的默认值
 * @return {} 输入窗口Ext.Window
 */
Apex.common.prompt = function(vtype, label, fn, defaultValue, minLongth,maxLongth,title) {
	var vtype = vtype;
	var label = label;
	if(Ext.isEmpty(vtype))
		vtype = 'IPAddress';
		
	if(Ext.isEmpty(vtype))
		label = '请输入IP地址';
		
	if(Ext.isEmpty(minLongth)){
		minLongth = 1;
	}
	
	if(Ext.isEmpty(maxLongth)){
		maxLongth = 1000;
	}

	var ok_fn = function(button, e) {
		if (button.getText() == '确定') {
			var inputValue = form.findById("prompt_input_field");
			var text = inputValue.getValue();
			fn(text);
		}
		prompt.destroy();
	}
	
	var form = new Ext.form.FormPanel({
		baseCls: 'x-plain',
		monitorValid: true,
		labelAlign: 'top',
		buttonAlign: 'center',
		bodyStyle:'padding:5px 0px 0px 10px',
		items : [{
					id : 'prompt_input_field',
					xtype: 'textfield',
					fieldLabel: label,
					width: 220,
					value: defaultValue ? defaultValue: null,
					allowBlank : vtype == 'CommonMaxLen' ? true : false,
					vtype : vtype,
					labelSeparator: '',
					minLength:minLongth,
					maxLength:maxLongth
				}],
		buttons : [{text: '确定', formBind: true, handler: ok_fn}, 
				{text: '取消', handler: function() {prompt.close();}}]		
	});
	
	var prompt = new Ext.Window({
				title : title ? title: "输入",
				width : 260,
				height : 130,
				resizable : false,
				modal : true,
				plain:true,
				layout: 'fit',
				items : form
					
			});
	return prompt;
}