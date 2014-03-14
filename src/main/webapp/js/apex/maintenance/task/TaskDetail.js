Ext.namespace('Apex.Task');

function taskDetailCheck(str, head){
	if(head == null || head=='' || str.length==0 || head.length > str.length) {
		return false;
	} else {
		if(str.substr(0,head.length)==head) {
			return true;
		} else {
			return false;
		}
	}
}

Apex.Task.TaskDetailPanel = function(procKey) {
	if(Ext.isEmpty(procKey)) {
		return null;
	} else {
		if(taskDetailCheck(procKey, 'EVT')) {
			var panel = new Apex.maintenance.incident.DisposeIncidentItem(procKey); 
			return panel;
		} else {
			return null;
		}
	}
}