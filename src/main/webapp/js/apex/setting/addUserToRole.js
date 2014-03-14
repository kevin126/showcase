//向角色里面添加用户
addUserToNewRole=function(){
		 url="/itsm/common/userQuery.do?selectOne=2&status=submit&enter=enter";
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
		if(returnId==""){
			return;
		}else{
		window.location.href="/itsm/security/roleMgt.do?method=addUerToNewRole&menuId=m12_1_1&id="+returnId;
		}
}
//删除角色的成员
deleteRoleUserConform=function(){
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
cancleDeleteUser=function(){
		$("input[type=checkbox]").attr("checked",false);
		hideDiv('delete');
}
doDeleteUser=function(){
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
	window.location.href="/itsm/security/roleMgt.do?method=deleteUserFromNewRole&menuId=m12_1_1&id="+menberIdArray;
}
//创建角色时第三步才保存
step3Save=function(){
		window.location.href="/itsm/security/roleMgt.do?method=addRole3&menuId=m12_1_1";
}