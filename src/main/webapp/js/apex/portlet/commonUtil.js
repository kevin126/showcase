Ext.namespace('Apex.portlet');
Apex.portlet.registSelectModel = function(gridPanel,selectFn,disSelectFn){
	var selectedArray = null;
    Ext.util.Observable.capture(gridPanel,function(eventName){
	if(eventName == 'click'){
		 selectedArray = gridPanel.getSelectionModel().getSelections();
		 gridPanel.getSelectionModel().clearSelections();
		 if(disSelectFn != null)
		 	disSelectFn();
	}});
	gridPanel.on('rowclick', selectRecords);
	function selectRecords(panel, indexNumber, event){
		if(!event.hasModifier()){
			panel.getSelectionModel().selectRow(indexNumber);
		}else{
			panel.getSelectionModel().selectRecords(selectedArray);
		}
		if(selectedArray.length != 0){
			if(selectFn != null){
				var recordNum = selectedArray.length;
				var currentRecord = panel.getStore().getAt(indexNumber);
				selectFn(recordNum,currentRecord);
			}
	    }
	}
}