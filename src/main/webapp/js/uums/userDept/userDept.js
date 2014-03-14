//向部门里面添加用户----函数的回调函数
function doCallBack(rtValue){
			//数据先保存起来，添加成功后在现实在界面上
		var returnId="";
		for(var i=0;i<rtValue.length;i++){
				for(var j=0;j<rtValue[i].length;j++){
					if(j==8){
					 if(returnId==""){
					 returnId=rtValue[i][j].id;
					 }else{
					 returnId=returnId+","+rtValue[i][j].id;
					 }
						continue;
					}
			}
			}
			var deptId=$("#deptId").val();
			window.location.href="/uums/userdept/user-dept!addUserToDept.action?new=true&menuId=m12_1_1&memberId="+returnId+"&id="+deptId;
}
//显示删除部门成员确认提示
function confirmDeleteUserDeptMember(userId){
	$("#deleteUserId").val(userId);
	showDiv("delete");
}
//确定删除所选部门成员
deleteUserDeptMember=function(){
	hideDiv('delete');
	var userId=$("#deleteUserId").val();
	var deptId=$("#deptId").val();
	window.location.href="/uums/userdept/user-dept!deleteUserDeptMember.action?memberId="+userId+"&id="+deptId;
}
//删除部门成员取消按钮
cancelDelete=function(){
	hideDiv('delete');
}