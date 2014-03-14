reSetQueryCondition=function(){
		//重置查询条件，清空查询条件
		$("#queryuserdept").val("");
		$("#queryusermail").val("");
		$("#queryusername").val("");
		$("#selectUserRoleId").val("");
		$("#queryuserrealName").val("");
		$("option#operatorUserId").attr("selected","true");
		queryUserByCondition();
}
queryUserRoleChanage=function(){
		queryUserByCondition();
}
selectAllUser=function(){
		//全选择或者全不选择
		var isCheck=$("#selectAllUser").attr("checked");
		if(isCheck){
			$("input[type=checkbox]").attr("checked",true);
		}else{
			$("input[type=checkbox]").attr("checked",false);
		}
}
//删除用户确认
deleteUserConform=function(){
		setBtnDisabled();
		//删除用户确认
		var isShowDeleteDiv=true;
		var selectUser=$("input[type=checkbox]:checked");
		if(selectUser.length<1){
			//没有选中要操作的记录
			showDiv('selectUserItems');
			isShowDeleteDiv=false;
		}else{
			if(selectUser.length==1){
			if($("#selectAllUser").attr("checked")){
				// 选择的是总的checkbox，不是记录的，所以视为无效
				howDiv('selectUserItems');
				isShowDeleteDiv=false;
				$("input[type=checkbox]").attr("checked",false);
				return;
				}
			}
			//自己不能删除自己
			var idTds=$("input[type=checkbox]:checked");
			idTds.each(function(){
				var compareIds=$(this).val().split(",");
				if(compareIds[0]==compareIds[1]){
					showDiv('deleteMySelf');
					$("input[type=checkbox]").attr("checked",false);
					isShowDeleteDiv=false;
					}
			});
			}
		if(isShowDeleteDiv){
			//显示删除确认信息
 			showDiv('delete');
		}else if(isShowDeleteDiv=='false'){
			setBtnAbled();//恢复按钮是否可用
			$("input[type=checkbox]").attr("checked",false);	
		}
}
//删除确认时取消删除操作
cacelDelete=function(){
		$("input[type=checkbox]").attr("checked",false);
		setBtnAbled();//恢复按钮是否可用
		hideDiv('delete');
}
//删除用户，根据用户id
deleteUserById=function(){
		var idsArray="";
		var idTds=$("input[type=checkbox]:checked");
		idTds.each(function(){
			//去掉全选按钮值
			if($(this).val().split(",")[0]=="on"){ 
			}else{
				if(idsArray==""){
					idsArray =$(this).val().split(",")[0];
				}else{
					idsArray =idsArray+","+$(this).val().split(",")[0];
				}
			}
			
		});
		hideDiv('delete');
		$.ajax({
				data:{
					ids:idsArray
					},
				dataType:'html',
				type:'post',
				url:'/uums/user/user!deleteUsers.action',
				//请求发起前，设置删除按钮不可再操作
				beforeSend:function (XMLHttpRequest) {
	    		//发起请求时，把相关按钮设置我不可操作
	    		setBtnDisabled();
				},
				success:function(html){
					window.location.href="/uums/user/user!list.action";
				},
				error:function (XMLHttpRequest, textStatus) {
					$("#errorInforShow").show();
					$("#errorShowId").html("操作失败："+XMLHttpRequest.responseText);
					$("input[type=checkbox]").attr("checked",false);
					}
			});
}
//添加用户
addUser=function(){
		window.location.href="/uums/user/user!preAdd.action"
}

//修改用户密码
modifyPsw=function(){
		setBtnDisabled();
		//删除用户确认
		var isShowDeleteDiv=true;
		var selectUser=$("input[type=checkbox]:checked");
		if(selectUser.length<1){
			//没有选中要操作的记录
			showDiv('selectUserItems');
			isShowDeleteDiv=false;
		}else{
			if(selectUser.length==1){
			if($("#selectAllUser").attr("checked")){
				// 选择的是总的checkbox，不是记录的，所以视为无效
				howDiv('selectUserItems');
				isShowDeleteDiv=false;
				$("input[type=checkbox]").attr("checked",false);
				return;
				}
			}
			if(selectUser.length>2){
				$("input[type=checkbox]").attr("checked",false);
				isShowDeleteDiv=false;
				return;
			}
		}
		if(isShowDeleteDiv==false){
			setBtnAbled();//恢复按钮是否可用
			$("input[type=checkbox]").attr("checked",false);
		}else{
		var idsArray="";
		var idTds=$("input[type=checkbox]:checked");
		idTds.each(function(){
		if(idsArray==""){
			idsArray =$(this).val().split(",")[0];
		}else{
			idsArray =idsArray+","+$(this).val().split(",")[0];
		}
		});
		$.ajax({
				data:{
					ids:idsArray
					},
				dataType:'html',
				type:'post',
				url:'/uums/user/user!enterModifyUserPsw.action',
				success:function(html){
					//显示操作成功
					setBtnAbled();
					$("input[type=checkbox]").attr("checked",false);
					window.location.href="/uums/user/user!enterUrl.action";
				},
				error:function (XMLHttpRequest, textStatus) {
					  $("#setPswErrorInforShow").show();
					  $("#setPswErrorShowId").html("操作失败："+XMLHttpRequest.responseText);
					  $("input[type=checkbox]").attr("checked",false);
					}
					});
			
		}
}
//刷新界面
reFlush=function(){
		$("input[type=checkbox]").attr("checked",false);
		hideDiv('errorInforShow');
		setBtnAbled();
		queryUserByCondition();
}
//不能对自己进行操作
cannotDeleteSelf=function(){
		$("input[type=checkbox]").attr("checked",false);
		setBtnAbled();
		hideDiv('deleteMySelf');
}
//请选择要操作的用户
pleaseSelect=function(){
		setBtnAbled();
		hideDiv('selectUserItems')
}
//设置所有按钮不可以操作
setBtnDisabled=function(){
		$("#deleteUserConformBtn").unbind("click",deleteUserConform);
		$("#enableSetPSWBtn").unbind("click",startReSetPsw);
		$("#addUserBtnId").unbind("click",addUser);
		$("#modifyPSWBtn").unbind("click",modifyPsw);
		$("#startEnAbleUserBtn").unbind("click",startConform);
		$("#disAbleUserBtn").unbind("click",disableConform);
}
//设置所有按钮可以操作
setBtnAbled =function(){
		$("#deleteUserConformBtn").bind("click",deleteUserConform);
		$("#enableSetPSWBtn").bind("click",startReSetPsw);
		$("#addUserBtnId").bind("click",addUser);
		$("#modifyPSWBtn").bind("click",modifyPsw);
		$("#startEnAbleUserBtn").bind("click",startConform);
		$("#disAbleUserBtn").bind("click",disableConform);
}
//点击重置密码按钮
startReSetPsw=function(){
	setBtnDisabled();
	var isShowConformDiv=true;
	var selectUser=$("input[type=checkbox]:checked");
	if(selectUser.length < 1){
		//没有选中要操作的记录
		showDiv('selectUserItems');
		isShowConformDiv=false;
	  }
	if(isShowConformDiv){
		//显示删除确认信息
 		showDiv('resetPWS');
	}else if(isShowConformDiv == 'false'){
	setBtnAbled();//恢复按钮是否可用	
	$("input[type=checkbox]").attr("checked",false);
	}
}
//确定要重置密码
doReSetPsw=function(){
		var idsArray="";
		var idTds=$("input[type=checkbox]:checked");
		idTds.each(function(){
		if(idsArray==""){
			idsArray =$(this).val().split(",")[0];
		}else{
			idsArray =idsArray+","+$(this).val().split(",")[0];
		}
		});
		//隐藏重置密码框
		hideDiv('code');
		showDiv('text');
		$.ajax({
				data:{
					ids:idsArray
					},
				dataType:'html',
				type:'post',
				url:'/uums/user/user!batchModifyPSW.action',
				//请求发起前，设置删除按钮不可再操作
				beforeSend:function (XMLHttpRequest) {
	    			//发起请求时，把相关按钮设置我不可操作
	    			setBtnDisabled();
				},
				success:function(html){
					//显示操作成功
					setBtnAbled();
					$("input[type=checkbox]").attr("checked",false);
					hideDiv('resetPWS');
				},
				error:function (XMLHttpRequest, textStatus) {
					  $("#setPswErrorInforShow").show();
					  $("#setPswErrorShowId").html("操作失败："+XMLHttpRequest.responseText);
					  $("input[type=checkbox]").attr("checked",false);
					}
			});
}
//取消重置密码
cancleReSetPsw=function(){
		$("input[type=checkbox]").attr("checked",false);
	  	setBtnAbled();
		hideDiv('resetPWS');
}
//重置密码出错提示点击确定
doSure=function(){
		$("input[type=checkbox]").attr("checked",false);
	 	setBtnAbled();
	 	$("#setPswErrorInforShow").hide();
}
disableConform=function(){
		setBtnDisabled();
		//禁用用户确认
		var isShowDeleteDiv=true;
		var selectUser=$("input[type=checkbox]:checked");
		if(selectUser.length<1){
		  //没有选中要操作的记录
		  showDiv('selectUserItems');
		  isShowDeleteDiv=false;
		}else{
		  //自己不能禁用自己
		  var idTds=$("input[type=checkbox]:checked");
		  idTds.each(function(){
			  var compareIds=$(this).val().split(",");
			  if(compareIds[0]==compareIds[1]){
				showDiv('deleteMySelf');
				isShowDeleteDiv=false;
				}
			});
			}
		if(isShowDeleteDiv){
 			disAbleUser();
		}else if(isShowDeleteDiv=='false'){
			setBtnAbled();//恢复按钮是否可用	
		}
}
//禁用用户
disAbleUser=function(){
	var idsArray="";
		var idTds=$("input[type=checkbox]:checked");
		idTds.each(function(){
		if(idsArray==""){
			idsArray =$(this).val().split(",")[0];
		}else{
			idsArray =idsArray+","+$(this).val().split(",")[0];
		}
		});
		//隐藏重置密码框
		hideDiv('code');
		showDiv('text');
		$.ajax({
				data:{
					ids:idsArray
					},
				dataType:'html',
				type:'post',
				url:'/uums/user/user!batchDisableUser.action',
				//请求发起前，设置删除按钮不可再操作
				beforeSend:function (XMLHttpRequest) {
	    			//发起请求时，把相关按钮设置我不可操作
	    			setBtnDisabled();
				},
				success:function(html){
					//显示操作成功
					//设置界面为
					var obj=$("input[type=checkbox]:checked").parent().parent();
					obj.each(function(){
					//表头排除
						$("#selectAllUser").parent().parent().children().eq(6).html("状态");
					    $(this).children().eq(6).html("<span class='yellow_box'>禁用</span>");
					   });
					setBtnAbled();
					$("input[type=checkbox]").attr("checked",false);
				},
				error:function (XMLHttpRequest, textStatus) {
					  $("#setPswErrorInforShow").show();
					  $("#setPswErrorShowId").html("<h1>操作失败："+XMLHttpRequest.responseText)+"</h1>";
					  $("input[type=checkbox]").attr("checked",false);
					}
			});
}
startConform=function(){
		setBtnDisabled();
		//启用用户确认
		var isShowDeleteDiv=true;
		var selectUser=$("input[type=checkbox]:checked");
		if(selectUser.length<1){
				//没有选中要操作的记录
				showDiv('selectUserItems');
				isShowDeleteDiv=false;
			}else{
			//自己不能启用自己
			var idTds=$("input[type=checkbox]:checked");
				idTds.each(function(){
					var compareIds=$(this).val().split(",");
					if(compareIds[0]==compareIds[1]){
						showDiv('deleteMySelf');
						isShowDeleteDiv=false;
					}
				});
			}
		if(isShowDeleteDiv){
 			enAbleUser();
		}else if(isShowDeleteDiv=='false'){
			setBtnAbled();//恢复按钮是否可用
			$("input[type=checkbox]").attr("checked",false);	
		}
}
//启用用户
enAbleUser=function(){
		var idsArray="";
		var idTds=$("input[type=checkbox]:checked");
		idTds.each(function(){
		if(idsArray==""){
			idsArray =$(this).val().split(",")[0];
		}else{
			idsArray =idsArray+","+$(this).val().split(",")[0];
		}
		});
		//隐藏重置密码框
		hideDiv('code');
		showDiv('text');
		$.ajax({
				data:{
					ids:idsArray
					},
				dataType:'html',
				type:'post',
				url:'/uums/user/user!batchEnableUser.action',
				//请求发起前，设置删除按钮不可再操作
				beforeSend:function (XMLHttpRequest) {
	    			//发起请求时，把相关按钮设置我不可操作
	    			setBtnDisabled();
				},
				success:function(html){
					//显示操作成功
					//设置界面为启用
				var obj=$("input[type=checkbox]:checked").parent().parent();
				obj.each(function(){
					//表头排除
					$("#selectAllUser").parent().parent().children().eq(6).html("状态");
					$(this).children().eq(6).html("<span class='green_box'>启用</span>");
					   });
					setBtnAbled();
					$("input[type=checkbox]").attr("checked",false);
				},
				error:function (XMLHttpRequest, textStatus) {
					  $("#setPswErrorInforShow").show();
					  $("#setPswErrorShowId").html("<h1>操作失败："+XMLHttpRequest.responseText+"</h1>");
					  $("input[type=checkbox]").attr("checked",false);
					}
			});
}
//把指定的供选择角色的select中的所选option添加
addRole=function(){
		var jump=false;
		var optionsValue=$("#allSelectRoleId").val();
		if(null!=optionsValue){
		var optionValues="";
		var ownSelect=$("#multipleSelectRoleId");
		for(var i=0;i<optionsValue.length;i++){
		//有普通用户，先删除所有的角色在添加
		if(optionsValue[i].indexOf("普通用户")!=-1 || optionsValue[i].indexOf("普通用户（资产审批）")!=-1){
			deleteAllRole();
			jump=true;
		}
		//拥有的那个select的option的id是own+角色名称
		var addOption="<option id='own"+optionsValue[i]+"' selected value='"+optionsValue[i]+"'>"+optionsValue[i]+"</option>"
		ownSelect.append(addOption);
		//添加到隐藏文本域中
		$("option#all"+optionsValue[i]).remove();
		if(jump){
		//如果添加的角色是普通用户或者是普通用户（资产审批），添加了这一个之后就结束
			optionValues=optionsValue[i];
			break;
		}else{
			if(optionValues==""){
				optionValues=optionsValue[i];
			}else{
				optionValues=optionValues+","+optionsValue[i];
			}
		}
		}
		var hiddenOwnRoleNames=$("#hiddenOwnRoleNamesId").val();
		if(!jump){
			//加的角色不含有普通用户角色或者是普通用户（资产审批），就把已经具有的普通用户角色或者是普通用户（资产审批）角色删除.同时去除隐藏域中的角色名称
			var commRoleOption=$("option#own普通用户");//.remove()
			var assetCommRoleOption=$("option#own普通用户（资产审批）");//
			var allRoleSelector=$("#allSelectRoleId");
			if(commRoleOption.length>0){
				commRoleOption.remove();
				commRoleOption.attr("id","all普通用户");
				allRoleSelector.append(commRoleOption);
				var ownNamesArray=hiddenOwnRoleNames.split(",");
				var values2="";
				for(var i=0;i<ownNamesArray.length;i++){
					if(ownNamesArray[i]!="普通用户"){
						if(values2==""){
							values2=ownNamesArray[i];
						 }else{
							values2=values2+","+ownNamesArray[i];
						 }
					}
				}
				$("#hiddenOwnRoleNamesId").val(values2);
			}
			if(assetCommRoleOption.length>0){
				assetCommRoleOption.remove();
				assetCommRoleOption.attr("id","all普通用户（资产审批）");
				allRoleSelector.append(assetCommRoleOption);
				var ownNamesArray=hiddenOwnRoleNames.split(",");
				var values2="";
				for(var i=0;i<ownNamesArray.length;i++){
					if(ownNamesArray[i]!="普通用户（资产审批）"){
						if(values2==""){
							values2=ownNamesArray[i];
						 }else{
							values2=values2+","+ownNamesArray[i];
						 }
					}
				}
				$("#hiddenOwnRoleNamesId").val(values2);
			}
		}
		 hiddenOwnRoleNames=$("#hiddenOwnRoleNamesId").val();
		if(hiddenOwnRoleNames=="" || hiddenOwnRoleNames==null){
			hiddenOwnRoleNames=optionValues;
		}else{
			if(jump){
				//普通用户就不再追加之前的数据了
				hiddenOwnRoleNames=optionValues;
			}else{
				hiddenOwnRoleNames=hiddenOwnRoleNames+","+optionValues;
			}
		}
		$("#hiddenOwnRoleNamesId").val(hiddenOwnRoleNames);
		}
		$("#multipleSelectRoleId").blur();
}
//把指定的拥有角色的select中的所选option删除
deleteRole=function(){
		var ownSelect=$("#multipleSelectRoleId").val();
		if(null!=ownSelect){
		var hiddenOwnRoleNames=$("#hiddenOwnRoleNamesId").val();
		var roleNames=hiddenOwnRoleNames.split(",");
		var newRoleNames="";
		var optionsValue=$("#allSelectRoleId");
		for(var i=0;i<ownSelect.length;i++){
		//供选择的那个select的option的id是all+角色名称
		var deleteOption="<option id='all"+ownSelect[i]+"' value='"+ownSelect[i]+"'>"+ownSelect[i]+"</option>"
		for(var j=0;j<roleNames.length;j++){
		if(roleNames[j]==ownSelect[i]){
			roleNames[j]="";
		}
		}
		optionsValue.append(deleteOption);
		$("option#own"+ownSelect[i]).remove();
		}
		for(var i=0;i<roleNames.length;i++){
		if(roleNames[i]==""){
		continue;
		}else{
			if(newRoleNames==""){
				newRoleNames=roleNames[i];
			}else{
				newRoleNames=newRoleNames+","+roleNames[i];
			}
		}
		}
		$("#hiddenOwnRoleNamesId").val(newRoleNames);
		}
		$("#multipleSelectRoleId").blur();
}
//添加说有供选择的角色
addAllRole=function(){
		var allChildren=$("#allSelectRoleId").children();
		if(null!=allChildren && allChildren.length!=0){
		var optionValues="";
		var ownSelect=$("#multipleSelectRoleId");
		allChildren.each(function(){
		var optionVale=$(this).val();
		var addOption="<option id='own"+optionVale+"'selected value='"+optionVale+"'>"+optionVale+"</option>"
		ownSelect.append(addOption);
		$(this).remove();
		//添加到隐藏文本域中
		$("option#all"+optionVale).remove();
		if(optionValues==""){
			optionValues=optionVale;
		}else{
			optionValues=optionValues+","+optionVale;
		}
		});
		var hiddenOwnRoleNames=$("#hiddenOwnRoleNamesId").val();
		if(hiddenOwnRoleNames=="" || hiddenOwnRoleNames==null){
			hiddenOwnRoleNames=optionValues;
		}else{
			hiddenOwnRoleNames=hiddenOwnRoleNames+","+optionValues;
		}
		$("#hiddenOwnRoleNamesId").val(hiddenOwnRoleNames);
		}
		$("#multipleSelectRoleId").blur();
}
//把已经具有的所有角色删除
deleteAllRole=function(){
		var ownSelect=$("#multipleSelectRoleId").children();
		if(null!=ownSelect){
		var allChildren=$("#allSelectRoleId");
		ownSelect.each(function(){
		var optionVale=$(this).val();
		var addOption="<option id='all"+optionVale+"' value='"+optionVale+"'>"+optionVale+"</option>"
		allChildren.append(addOption);
		$(this).remove();
		});
		$("#hiddenOwnRoleNamesId").val("");
		}
		$("#multipleSelectRoleId").blur();
}
setBtnEnabled=function(defaultRoleNames){
		//defaultRoleNames用于设置隐藏域的初始值，防止用户刷新页面时，隐藏域的初始值不能归位，即恢复原值
		if(undefined==defaultRoleNames){
			$("#hiddenOwnRoleNamesId").val("");;
		}else{
			$("#hiddenOwnRoleNamesId").val(defaultRoleNames);
		}
		//$("#addusersubmitButton").attr("disabled", false);
}

$(function(){
		setBtnAbled();
		
		$("#DownloadTemplateId").bind("click",getTemplate);
		$("#batchImportUserId").bind("click",batchImport);
		
})
//获得批量导入用户的excel模板
getTemplate=function(){
	location.href = "uums/user/import-user!getTemplate.action";
}
//进入批量导入用户的界面
batchImport=function(){
	location.href = "/uums/user/import-user!enterBatch.action";
}
function doCallBack(rtValue){
		for(var i=0;i<rtValue.length;i++){
	//			for(var j=0;j<rtValue[i].length;j++){
	//				if(j==0){
	//					if(name==""||name==null){
	//				 		name=rtValue[i][j].roleName;
	//				 	}else{
	//				 		if(name.indexOf(rtValue[i][j].roleName.trim())!=-1){
	//				 			name=name;
	//				 		}else{
	//				 			name=name+","+rtValue[i][j].roleName;
	//				 		}
	//				 	}
	//				}else{
	//					continue;
	//				}
	//		
	//		}
			//存在相同的选项数
			var sameCount=$("#roleNames option[value*="+rtValue[i].roleName+"]").length;
			if(sameCount>0){
				//alert("same count:"+rtValue[i].roleName);
			}else{
				$("#roleNames").prepend("<option value='"+rtValue[i].roleName+"'>"+rtValue[i].roleName+"</option>");  //为Select插入一个Option(第一个位置)
			}
			//alert(rtValue[i].roleName);
		}
}

function synOssUser(){
	Ext.MessageBox.show({
		title : '确认',
		msg : '是否开始同步OSS Works用户数据到当前系统？',
		buttons : Ext.MessageBox.OKCANCEL,
		icon : Ext.MessageBox.QUESTION,
		fn : function(btn) {
			if(btn == "ok") {
				doSynOssUser();
			}
		}
	});
}
function doSynOssUser(){
	var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : "正在同步用户数据，请稍后..."
				});
	myMask.show();
	SecurityService.synUserOssToCa( {
		callback : function(data) {
			if(data){
				myMask.hide();
				Ext.MessageBox.show({
					title : '提示',
					msg : '同步成功！',
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO,
					fn : function(btn) {
						if ('ok' == btn) {
							window.location.href="/uums/user/user!list.action?menuId=s8&fromMenu=yes";
						}
					}
				});
			} else {
				myMask.hide();
				Ext.MessageBox.show({
					title : '错误',
					msg : '同步失败！',
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
			}
		},
		errorHandler : function(errorString, exception) {
			myMask.hide();
			Ext.MessageBox.show({
				title : '错误',
				msg : exception.message,
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});
		}
	});	
}
function synNmUser(){
	Ext.MessageBox.show({
		title : '确认',
		msg : '是否开始同步APEX-NetManager用户数据到当前系统？',
		buttons : Ext.MessageBox.OKCANCEL,
		icon : Ext.MessageBox.QUESTION,
		fn : function(btn) {
			if(btn == "ok") {
				doSynNmUser();
			}
		}
	});
}
function doSynNmUser(){
	var myMask = new Ext.LoadMask(Ext.getBody(), {
					msg : "正在同步用户数据，请稍后..."
				});
	myMask.show();
	SecurityService.synUserNmToCa({
		callback:function (data){
		myMask.hide();
		if(data){
				Ext.MessageBox.show({
					title : '提示',
					msg : '同步成功！',
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO,
					fn : function(btn) {
						if ('ok' == btn) {
							window.location.href="/uums/user/user!list.action?menuId=s8&fromMenu=yes";
						}
					}
				});
			} else {
				Ext.MessageBox.show({
					title : '错误',
					msg : '同步失败！',
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
			}
	},
	errorHandler : function(errorString, exception) {
			myMask.hide();
			Ext.MessageBox.show({
				title : '错误',
				msg : exception.message,
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});
		}
	});	
}