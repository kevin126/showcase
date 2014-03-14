$(document).ready(function() {	
		$.formValidator.initConfig({
			formid : "dispatchCwfIssueDataForm",
			wideword : false,	
			onerror : function(msg) {
				return false;
			},
			onsuccess : function() {		
				return true;				
			}				
		}); 	
		validateCommonInput();
		$("#submitButton").click(function(){
			var result =$.formValidator.pageIsValid("1");
			if(result){
				$('#dispatchCwfIssueDataForm').get(0).submit();
			}
											
		});
 	});
 	
 function validateCommonInput() {
	if ($("#fixedHandler").length > 0) {
		$("#fixedHandler").formValidator({
			empty : false,
			onshow : "必填！",
			onfocus : "请选择处理人",
			oncorrect : "合法！"
		}).inputValidator({
			max : 100,
			min : 1,
			onerror : "处理人不能为空"
		}).functionValidator({
		    fun : function(val, elem) {
		    	var curProcessorName = $("#curProcessorName").val();
		    	var fixedHandlerName = $("#fixedHandlerName").val();
		    	if(curProcessorName == fixedHandlerName){
		    		return "该用户已经是处理人了";
		    	}else{
		    		return true;
		    	}
		    }
		});
	}

	$("#comment").formValidator({
		empty : true,
		onshow : "非必填！",
		onfocus : "非必填！长度为0-100个字符",
		oncorrect : "合法！"
	}).inputValidator({
		max : 20000,
		min : 0,
		onerror : "非必填！长度为0-20000个字符"
	});
}
function takeIssueMyself(){
	var currentUserName = document.getElementById("curruntUserName").value;
	var curruntUserRealName = document.getElementById("curruntUserRealName").value;
	document.getElementById('fixedHandlerName').value = currentUserName;
	document.getElementById('fixedHandler').value = curruntUserRealName;
}
function selectReceiver(){
	selectedField_total = 'receiveUser';
	var url = "/itsm/common/userQuery.do?selectOne=1&auto=Y&status=submit&exclude=15,16&enter=enter";//auto=Y表示默认就查询出所有的运维人员
    //var s = window.open(url, "", "height=400, width=1100, top=260, left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
	tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}

function doCallBack(rtValue) {
	for (var i = 0; i < rtValue.length; i++) {
		for (var j = 0; j < rtValue[i].length; j++) {
			if (j == 1) {
				$("#fixedHandler").attr("value",rtValue[i][j].realName.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
				continue;
			} else if (j == 0) {
				$("#fixedHandlerName").attr("value",rtValue[i][j].name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
				continue;
			} 
		}
	}
	$("#fixedHandler").blur();
}