//表单验证
function validate(){
	$.formValidator.initConfig({
		formid : "problemForm",
		onerror : function(msg) {
			//alert(msg);
		},
		onsuccess : function() {
			$("#submitButton").attr("disabled", true);
			return true;
		}
	});
	
	$("#type").formValidator({
		onshow : "请选择工单类型！",
		onfocus : "必须选择工单类型！",
		oncorrect : JS_I18N.issue_legal
	}).inputValidator({
		min : 1,
		onerror : "必须选择工单类型！"
	});
	
	$("#requestUser").formValidator({
		onshow : JS_I18N.issue_please_input_request_user,//请填写请求用户
		onfocus : JS_I18N.issue_request_user_Not_null,//"用户不得为空",
		oncorrect : JS_I18N.issue_legal //合法"
	}).inputValidator({
//		min : 1,
		max : 20,
		onerror : JS_I18N.issue_request_user_Not_null //"用户不得为空"
	}).functionValidator({
	    fun : function(val, elem) {
	    	var regu = "^[ ]+$";
		    var reg_normal = new RegExp(regu);
		    var result = reg_normal.test(val);
		    if(!result){
		    	return true;
		    }else{
		    	return '请求用户不能全为空格';
		    }
	    }
	});
	
	$("#department").formValidator({
		onshow : "请输入部门！",
		onfocus : "部门非必填, 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
//		min : 1,
		max : 30,
		onerror : "部门非必填, 最多30个字符！"
	});
	
	$("#phone").formValidator({
		onshow : "请输入联系电话！",
		onfocus : "联系电话非必填, 最多50个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 50,
//		min : 1,
		onerror : "联系电话非必填, 最多50个字符！"
	});
	
	$("#email").formValidator({
		onshow : "请输入邮箱！",
		onfocus : "邮箱非必填, 最多50个字符！",
		oncorrect : "合法！"
	}).inputValidator({
//		min : 6,
		max : 50,
		onerror : "邮箱非必填, 最多50个字符！"
	}).functionValidator({
		fun : function(val){
			if(val != ''){
				if(val.match(regexEnum.email)){
					return true;
				}
				return false;
			}else{
				return true;
			}
		},
		onerror : "邮箱格式不正确！"
	});
	
	$("#jobNumber").formValidator({
		onshow : "请输入工号！",
		onfocus : "工号非必填, 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 30,
		onerror : "工号非必填, 最多30个字符！"
	});
	
	$("#internetAccount").formValidator({
		onshow : "请输入上网账号！",
		onfocus : "上网账号非必填, 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 30,
		onerror : "上网账号非必填, 最多30个字符！"
	});
	
	$("#title").formValidator({
		onshow : JS_I18N.issue_please_input_title,
		onfocus : JS_I18N.issue_title_error,
		oncorrect : JS_I18N.issue_legal
	}).inputValidator({
		max : 100,
		onerror : JS_I18N.issue_title_error
	});
	
	$("#address").formValidator({
		onshow : "请输入地点！",
		onfocus : "地点非必填, 最多30个字符！",
		oncorrect : "合法！"
	}).inputValidator({
		max : 30,
		onerror : "地点不超过30个字符！"
	});
	
	$("#description").formValidator({
		onshow : "请输入详细描述！",
		onfocus : "详细描述非必填, 最多20000个字符！",
		oncorrect : JS_I18N.issue_legal
	}).inputValidator({
		max : 20000,
		onerror : "详细描述非必填, 最多20000个字符！"
	});
	
	$("#fixedHandler").formValidator({
		onshow : "请选择处理人！",
		onfocus : "处理人必填！",
		oncorrect : JS_I18N.issue_legal
	}).inputValidator({
		min : 1,
		onerror : "处理人必填！"
	});
}

//选择类型
function selectType(){
	new Apex.common.TypeList("type", "PRO").showTypeList();
}

//选择地点
function selectAddress(){
	new Apex.common.AddressList().showAddressList();
}

//分配给我
function takeIssueMyself(){
	document.getElementById('fixedHandlerName').value = $('#currentUser').val();
	document.getElementById('fixedHandler').value = $('#currentUserRealName').val();
	document.getElementById('fixedHandler').focus();
}


var callBackType = null;
//选择分配给谁
function selectReceiver(){
	callBackType = 1;
    var url = "/itsm/common/userQuery.do?selectOne=1&exclude=15,16&status=submit&enter=enter";
    tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}

function selectRequestUser(){
	callBackType = 0;
    var url = "/itsm/common/userQuery.do?selectOne=1&status=submit&auto=Y&enter=enter";
    tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}

function doCallBack(rtValue){
	if(callBackType == 0){
		for(var i=0;i<rtValue.length;i++){
		    for(var j=0;j<rtValue[i].length;j++){
		        if(j==1){
		        	$("#requestUser").attr("value", Ext.util.Format.htmlDecode(rtValue[i][j].realName));
					$("#requestUser").blur();
		         	continue;
		        }else if(j==2){
		        	$("#jobNumber").attr("value", Ext.util.Format.htmlDecode(rtValue[i][j].employeeNo));
					$("#jobNumber").blur();
		         	continue;
		        }else if(j==3){
		        	$("#department").attr("value", Ext.util.Format.htmlDecode(rtValue[i][j].depet));
		        	$("#department").blur();
		         	continue;
		        }else  if(j==6){
		        	$("#internetAccount").attr("value", Ext.util.Format.htmlDecode(rtValue[i][j].internetAccount));
					$("#internetAccount").blur();
		         	continue;
		        }else  if(j==7){
		        	$("#email").attr("value", Ext.util.Format.htmlDecode(rtValue[i][j].mail));
					$("#email").blur();
		         	continue;
		        }else  if(j==8){
		        	$("#phone").attr("value", Ext.util.Format.htmlDecode(rtValue[i][j].office));
					$("#phone").blur();
		         	continue;
		        }else if(j == 10){
		        	//如果技能描述不为空，则显示。//浙大需求-----
		       // 	if(!Ext.isEmpty(rtValue[i][j].taskNotifier)){
			   //     	$("#vipText").html("<font color='red'>"+rtValue[i][j].taskNotifier + "</font>");
			    //    	document.getElementById("vipDiv").style.display = "block";
		        //	}else{
		        //		document.getElementById("vipDiv").style.display = "none";
		        //	}
		        }
		    }
		}
	}else if(callBackType == 1){
		for(var i=0;i<rtValue.length;i++){
	    	for(var j=0;j<rtValue[i].length;j++){
		        if(j==1){
		        	$("#fixedHandler").attr("value", rtValue[i][j].realName);
					$("#fixedHandler").blur();
		         	continue;
		        }else if(j==0){
		        	$("#fixedHandlerName").attr("value", rtValue[i][j].name);
		         	continue;
		        }
	    	}
		}
	}


}

$(function(){
	if($.browser.msie){
		$("#mainDiv").height(645);
	}else{
		$("#mainDiv").height(660);
	}
	validate();
})