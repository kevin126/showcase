/**
 * 复制自定义流程
 */
function copyCwfDefinition(processTypeId){
	var url = "/itsm/cwf/copyCwfDefinition.do?processTypeId="+processTypeId;
	art.dialog.open(url,{limit: false,lock:true,title:'<b>设置复制流程的属性</b>',width:'920px',height:'560px'});
}

/**
 * 删除自定义流程
 */
function deleteCwfDefinition(processTypeId){
	art.dialog({
				title : '确认',
			    content: '该操作不可恢复，您确定删除该流程吗？',
			    icon : 'confirm',
			    lock : true,
			    yesFn: function(){
			    			CwfService.deleteProcessType(processTypeId,false,{
			    				callback : function(){
										location.reload();
									},
								errorHandler : function(errorString, exception) {
									art.dialog({
											title : '错误',
											icon : 'error',
											lock : true,
										    content: exception.message,
										    yesFn: true
										});
								}
			    			})
			    	   },
			    noFn: true
			});
}