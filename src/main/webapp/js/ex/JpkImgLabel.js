Ext.namespace('Ext.ux.form');
Ext.ux.form.JpkImgLabel = Ext.extend(Ext.BoxComponent, {
    initComponent: function(){
        Ext.ux.form.JpkImgLabel.superclass.initComponent.call(this);
        this.addEvents('click');
    },
    onRender: function(ct, position){
    
        if (!this.el) {
            this.el = document.createElement('img');
            this.el.src = this.src;
            if (this.forId) {
                this.el.setAttribute('htmlFor', this.forId);
            }
        }
        
        Ext.ux.form.JpkImgLabel.superclass.onRender.call(this, ct, position);
        
        Ext.fly(this.el).on('click', function(){
            this.fireEvent('click', this);
        }, this);
    }
});

Ext.reg('JpkImgLabel', Ext.ux.form.JpkImgLabel);
