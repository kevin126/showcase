/**
 * add by jonim
 * 本函数解决下拉框，数据库存的是value，显示label的问题
 * @param {} config
 */
Ext.grid.DictionaryColumn = function(config){  
    Ext.apply(this, config);  
    if(!this.id){  
        this.id = Ext.id();  
    }  
    this.renderer = this.renderer.createDelegate(this);  
    this.valueField = this.valueField || 'id';  
    this.displayField = this.displayField || 'value';  
    this.mode = this.mode || 'local';  
    this.editable = this.editable || false;  
      
    if (this.editable) {  
        this.editor = new Ext.form.ComboBox({  
            displayField:this.displayField,  
            valueField: this.valueField,
            selectOnFocus:true,
            store: this.store,  
            mode: this.mode,  
            typeAhead: true,  
            triggerAction: 'all',  
            forceSelection: true,
            readOnly:true,
            lazyRender:true,
            listClass: 'x-combo-list-small'  
        });  
    }  
};    
  
Ext.grid.DictionaryColumn.prototype ={  
    renderer : function(v, p, record){  
        var index = this.store.find(this.valueField, v);
        if(index==-1){
        	return null;
        }
        return this.store.getAt(index).get(this.displayField);  
    }  
};