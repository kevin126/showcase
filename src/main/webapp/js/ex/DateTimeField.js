Ext.namespace('Ext.ux.form');
Ext.ux.form.DateTimeField = Ext.extend(Ext.form.TextField, {
	readOnly : true,
	cls:'Wdate',
	onFocus:function(){WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});}
});
Ext.ux.form.DateTimeFieldShort = Ext.extend(Ext.form.TextField, {
	cls:'Wdate',
	onFocus:function(){WdatePicker({dateFmt:'yyyy-MM-dd HH:mm'});}
});
Ext.ux.form.DateTimeFieldFuture = Ext.extend(Ext.form.TextField, {
	cls:'Wdate',
	onFocus:function(){WdatePicker({dateFmt:'yyyy-MM-dd HH:mm', minDate:'%y-%M-#{%d+1}'});}
});
Ext.ux.form.DateTimeFieldShortStart = Ext.extend(Ext.form.TextField, {
	id : 'itsm_max_date_short_start',
	cls:'Wdate',
	onFocus:function(){WdatePicker({maxDate:'#F{$dp.$D(\'itsm_max_date_short_end\')||\'2020-10-01\'}', dateFmt:'yyyy-MM-dd HH:mm'});}
});
Ext.ux.form.DateTimeFieldShortEnd = Ext.extend(Ext.form.TextField, {
	id : 'itsm_max_date_short_end',
	cls:'Wdate',
	onFocus:function(){WdatePicker({minDate:'#F{$dp.$D(\'itsm_max_date_short_start\')}', maxDate:'2020-10-01', dateFmt:'yyyy-MM-dd HH:mm'});}
});
Ext.ux.form.DateField = Ext.extend(Ext.form.TextField, {
	readOnly : true,
	cls:'Wdate',
	onFocus:function(){WdatePicker({dateFmt:'yyyy-MM-dd'});}
});
Ext.reg('datetimefield', Ext.ux.form.DateTimeField);