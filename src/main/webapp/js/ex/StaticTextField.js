Ext.namespace('Ext.ux.form');
Ext.ux.form.StaticTextField = Ext.extend(Ext.form.Field, {
	defaultAutoCreate : {tag: "div"},
	value : '',
	onRender : function(ct, position){
        Ext.ux.form.StaticTextField.superclass.onRender.call(this, ct, position);
        Ext.DomHelper.append(this.el, {
        	tag : 'div',
			//style :'height:100%;width:100%;',
        	html : this.value
        });
    },
    isDirty : function() {
        return false;
    },
    isValid : function(){
        return true;
    }
});
Ext.reg('xstatictextfield', Ext.ux.form.StaticTextField);