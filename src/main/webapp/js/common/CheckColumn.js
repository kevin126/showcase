/**
 * add by jonim
 * 本函数解决edit grid panel 中checkbox的显示问题
 * @param {} config
 */
Ext.grid.CheckColumn = function(config){  
     Ext.apply(this, config);  
     if(!this.id){  
         this.id = Ext.id();  
     }  
     this.renderer = this.renderer.createDelegate(this);  
};  
   
Ext.grid.CheckColumn.prototype ={  
     init : function(grid){  
         this.grid = grid;  
         this.grid.on('render', function(){  
             var view = this.grid.getView();  
             view.mainBody.on('mousedown', this.onMouseDown, this);  
         }, this);  
     },   
   
     onMouseDown : function(e, t) {  
         if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {  
              e.stopEvent();  
             var index = this.grid.getView().findRowIndex(t);  
             var cindex = this.grid.getView().findCellIndex(t);  
             var record = this.grid.store.getAt(index);  
             var field = this.grid.colModel.getDataIndex(cindex);  
             var e = {  
                grid : this.grid,  
                record : record,  
                field : field,  
                originalValue : record.data[this.dataIndex],  
                value : !record.data[this.dataIndex],  
                row : index,  
                column : cindex,  
                cancel : false  
              };  
              if (this.grid.fireEvent("validateedit", e) !== false && !e.cancel) {  
                  delete e.cancel;  
                  record.set(this.dataIndex,!record.data[this.dataIndex]);  
              }  
          }  
     },
   
     renderer : function(v, p, record){  
         p.css += ' x-grid3-check-col-td';   
         return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';  
     }  
 };  