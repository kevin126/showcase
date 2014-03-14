
function addWarr(){
	window.onbeforeunload = function(){
		return '当前未完成建立流程模版的全部步骤，如果离开此页面，您的操作结果将丢失！';
	}
	window.onunload = function(){
		if(CwfService)CwfService.removeCwfProcessInfoFromSession();
	}
}

function dropWarr(){
	window.onbeforeunload = function(){
	}
	window.onunload = function(){
	}
}

addWarr();


