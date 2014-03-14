selectAllRole=function(){
		var mainCheckBox=$("#selectAllRoleId").attr("checked");
		if(mainCheckBox){
			var allCheckBox=$("input[type=checkbox]");
			allCheckBox.each(function(){
				if($(this).attr("disabled")==false){
					$(this).attr("checked",true);
				}
			});
		}else{
			$("input[type=checkbox]").attr("checked",false);
		}
}
editRole=function(roleId){
	//删除按钮置为无效
	$("#enableDeleeBtn").hide();
	$("#disableDeleeBtn").show();
		 $.ajax({
				data:{
					roleId:roleId
					},
				dataType:'json',
				type:'post',
				url:'/itsm/security/roleMgt.do?method=modifyRole&menuId=m12_1_1',
				success:function(json){
					//动态减少显示的记录数据
					$("#editRoleId").val(json[0].id);
					$("#roleName").val(json[0].roleName);
					$("#hiddenRoleName").val(json[0].roleName);
					$("#roleDiscription").val(json[0].roleDescription);
					showDiv('editDiv');
					$("input[type=checkbox]").attr("checked",false);
				},
				error:function (XMLHttpRequest, textStatus) {
					$("#errorInforShow").show();
					$("#errorShowId").html("操作失败："+XMLHttpRequest.responseText);
					$("input[type=checkbox]").attr("checked",false);
					}
			});
}

reFlush=function(){
		//删除按钮置为有效
		$("#enableDeleeBtn").show();
		$("#disableDeleeBtn").hide();
		$("#errorInforShow").hide();
		//刷新数据
		window.location.href="/itsm/security/roleMgt.do?method=enterRoleMgt&menuId=m12_1_1";
		$("input[type=checkbox]").attr("checked",false);
}
setSubmitBtnEnadled=function(){
		$("#addRolesubmitButton").attr("disabled",false);
}
//提交编辑的角色信息
/*
doEdit=function(){
	var roleName=$("#roleName").val();
	var roleDiscription=$("#roleDiscription").val();
	var roleId=$("#editRoleId").val();
	$.ajax({
		data:{
		roleName:roleName,
		roleDiscription:roleDiscription,
		roleId:roleId
			},
		dataType:'html',
		type:'post',
		url:'/itsm/security/roleMgt.do?method=subModifyRole&menuId=m12_1_1',
		success:function(html){
				//设置界面为编辑后的效果
				$("#roleDescription"+roleId).html(roleDiscription);
				$("#roleName"+roleId).html(roleName);
				hideDiv('editDiv');
				//删除按钮置为有效
				$("#enableDeleeBtn").show();
				$("#disableDeleeBtn").hide();
				$("input[type=checkbox]").attr("checked",false);
				},
		error:function (XMLHttpRequest, textStatus) {
				hideDiv('editDiv');
				$("#errorInforShow").show();
				$("#errorShowId").html("操作失败："+XMLHttpRequest.responseText);
				$("input[type=checkbox]").attr("checked",false);
				}
			});
}*/
//删除角色确认
deleteRoleConform=function(){
		setBtnDisabled();
		//删除用户确认
		var isShowDeleteDiv=true;
		var selectRole=$("input[type=checkbox]:checked");
		if(selectRole.length<1){
			//没有选中要操作的记录
			showDiv('selectRoleItems');
			isShowDeleteDiv=false;
		}else{
			if(selectRole.length==1){
			if($("#selectAllRoleId").attr("checked")){
			// 选择的是总的checkbox，不是记录的，所以视为无效
					showDiv('selectRoleItems');
					isShowDeleteDiv=false;
					$("input[type=checkbox]").attr("checked",false);
					return;
				}
			}
			//系统默认的角色不能删除
			var checkBox=$("input[type=checkbox]:checked");
			checkBox.each(function(){
				var deleteDefaultRole=$(this).val();
				if(deleteDefaultRole.indexOf("false")!=-1){
					showDiv('deleteDefalutRole');
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
//设置编辑按钮和增加按钮可操作
setBtnAbled=function(){
	var enableBtn=$("div.smallBlueButton a:not(:hidden)");
	var disableBtn=$("div.smallBlueButton a:hidden");
	enableBtn.hide();
	disableBtn.show();
	$("#enableDeleeBtn").show();
	$("#disableDeleeBtn").hide();
}
//设置编辑按钮和增加按钮不可操作
setBtnDisabled=function(){
	var enableBtn=$("div.smallBlueButton a:not(:hidden)");
	var disableBtn=$("div.smallBlueButton a:hidden");
	enableBtn.hide();
	disableBtn.show();
	$("#enableDeleeBtn").hide();
	$("#disableDeleeBtn").show();
}
//删除时没有选择角色，返回去选择角色
pleaseSelect=function(){
	setBtnAbled();
	$("#selectRoleItems").hide();
}
cannotDeleteDefalutRole=function(){
	$("input[type=checkbox]").attr("checked",false);
	setBtnAbled();
	$("#deleteDefalutRole").hide()
}
//确定删除所选择角色
doDeleteRole=function(){
window.location.href="/itsm/security/roleMgt.do?method=deleteRole&menuId=m12_1_1";
	hideDiv('delete');
	//删除成功后摇还原按钮
	var roleIdArray="";
		var checkBox=$("input[type=checkbox]:checked");
			checkBox.each(function(){
				var deleteDefaultRole=$(this).val();
				//这一列的值是true或者false加id组成的
				if(deleteDefaultRole.indexOf("false")!=-1){
					if(roleIdArray==""){
						roleIdArray =deleteDefaultRole.substring(5);
						}else{
						roleIdArray =roleIdArray+","+deleteDefaultRole.substring(5);
						}
				}else if(deleteDefaultRole.indexOf("true")!=-1){
					//trueid
					if(roleIdArray==""){
						roleIdArray =deleteDefaultRole.substring(4);
						}else{
						roleIdArray =roleIdArray+","+deleteDefaultRole.substring(4);
						}
					}
			});
			window.location.href="/itsm/security/roleMgt.do?method=deleteRole&menuId=m12_1_1&roleIds="+roleIdArray;
}
cancelDeleteRole=function(){
	$("input[type=checkbox]").attr("checked",false);
	setBtnAbled();
	hideDiv('delete');
}
//取消编辑
cancleEdit=function(){
	//删除按钮置为有效
	$("#enableDeleeBtn").show();
	$("#disableDeleeBtn").hide();
	hideDiv('editDiv');
	showDiv('text');
	$("input[type=checkbox]").attr("checked",false);
}
hideAllRoleDiscription=function(){
			$("#showAllRoleDiscriptionId").show();
			$("#hideAllRoleDiscriptionId").hide();
			var sibingTd=$("table tr td p");
			sibingTd.hide();
}
showAllRoleDiscription=function(){
			$("#showAllRoleDiscriptionId").hide();
			$("#hideAllRoleDiscriptionId").show();
			var sibingTd=$("table tr td p");
			sibingTd.show();
}
//创建角色时，第二步买入第三步
stepTo3=function(){
//判断是否选择了权限，没有选择权限则提示后直接退出
	var selestPermission=$("input[type=checkbox]:checked");
	if(selestPermission.length<1){
		$("#selectPerItems").show();
		return;
	}else{
		$("#step2To3Id").val("yes");
		$("#assignPerToNewRoleId").submit();
	}
}
reSelectPer=function(){
		$("#selectPerItems").hide();
}
saveAddRole=function(){
	var selestPermission=$("input[type=checkbox]:checked");
	if(selestPermission.length<1){
		$("#selectPerItems").show();
		return;
	}else{
		$("#step2To3Id").val("");
		$("#assignPerToNewRoleId").submit();
	}
}

//保存重新给角色分配的权限
saveReAssignPermission=function(){
	var selestPermission=$("input[type=checkbox]:checked");
	if(selestPermission.length<1){
		$("#selectPerItems").show();
		return;
		}else{
			var actionIds="";
			selestPermission.each(function(){
				if(actionIds==""){
					actionIds=$(this).val();
				}else{
					actionIds=actionIds+","+$(this).val();
				}
			});
		window.location.href="/itsm/security/roleMgt.do?method=saveAssignPermi&menuId=m12_1_1&actionId="+actionIds;
		$("#saveReAssignPermissionId").attr("disabled",true);
		}
}
//删除角色的成员
deleteRoleMemberConform=function(){
		//删除用户确认
		var isShowDeleteDiv=true;
		var selectRole=$("input[type=checkbox]:checked");
		if(selectRole.length<1){
			//没有选中要操作的记录
			showDiv('selectRoleMemberItems');
			isShowDeleteDiv=false;
			return;
		}else{
			if(selectRole.length==1){
			if($("#selectAllRoleId").attr("checked")){
			// 选择的是总的checkbox，不是记录的，所以视为无效
					showDiv('selectRoleMemberItems');
					isShowDeleteDiv=false;
					return;
				}
			}
			}
		if(isShowDeleteDiv){
			//显示删除确认信息
 			showDiv('delete');
		}else{
		$("input[type=checkbox]").attr("checked",false);
		}
}
cancleDeleteMember=function(){
		$("input[type=checkbox]").attr("checked",false);
		hideDiv('delete');
}
doDeleteMember=function(){
	hideDiv('delete');
	var menberIdArray="";
	var checkBox=$("input[type=checkbox]:checked");
	var i=0;
	var allChecked=$("#selectAllRoleId").attr("checked");
	//排除全选按钮
	if(allChecked){
		i=1;
	}
	for(i;i<checkBox.length;i++){
	//这一列的值是true或者false加id组成的
		if(menberIdArray==""){
			menberIdArray =checkBox.eq(i).val();
		}else{
			menberIdArray =menberIdArray+","+checkBox.eq(i).val();
		}
	}
	var isNew=$("#isnewRole").val();
			if(isNew!=null){
				window.location.href="/itsm/security/roleMgt.do?new=true&method=deleteRoleMember&menuId=m12_1_1&memberId="+menberIdArray;
			}else{
				window.location.href="/itsm/security/roleMgt.do?method=deleteRoleMember&menuId=m12_1_1&memberId="+menberIdArray;
			}
}
//向角色里面添加用户
addUserToRole=function(roleId){
		var url="";
		//roleId不为空表明向已经存在的角色添加用户，为空表示向正在创建的角色添加用户
		if(null!=roleId && ""!=roleId){
		url="/itsm/common/userQuery.do?selectOne=2&exclude="+roleId+"&status=submit&enter=enter";
		}else{
		url="/itsm/common/userQuery.do?selectOne=2&status=submit&enter=enter";
		}
		 tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}
//向角色里面添加用户----函数的回调函数
function doCallBack(rtValue){
			//数据先保存起来，添加成功后在现实在界面上
		var returnId="";
		for(var i=0;i<rtValue.length;i++){
				for(var j=0;j<rtValue[i].length;j++){
					if(j==9){
					 if(returnId==""){
					 returnId=rtValue[i][j].id;
					 }else{
					 returnId=returnId+","+rtValue[i][j].id;
					 }
						continue;
					}
			}
			}
			var isNew=$("#isnewRole").val();
			if(isNew!=null){
				window.location.href="/itsm/security/roleMgt.do?new=true&method=addUerToRole&menuId=m12_1_1&id="+returnId;
			}else{
				window.location.href="/itsm/security/roleMgt.do?method=addUerToRole&menuId=m12_1_1&id="+returnId;
			}
}
function selectAllSubPermission(cunrretObj,actionId){
	var selectCheckbox=$("#"+actionId+" dl dt input[type=checkbox]");
		selectCheckbox.each(function(){
			$(this).attr("checked",cunrretObj.checked);
			});
}

deleteConform=function(roleId){
		$("#deleteRoleId").val(roleId);
		showDiv('delete');
		
}

deleteRole=function(){
	hideDiv('delete')
		var id=$("#deleteRoleId").val();
		$.ajax({
				data:{
					roleId:id
					},
				dataType:'html',
				type:'post',
				url:'/uums/role/role!deleteRole.action',
				success:function(html){
				$("#"+id).hide();
				},
				error:function (XMLHttpRequest, textStatus) {
					$("#errorInforShow").show();
					$("#errorShowId").html(XMLHttpRequest.responseText);
					}
			});
			
}