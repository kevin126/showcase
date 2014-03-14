//向工作组里面添加用户----函数的回调函数
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
			var workGroupId=$("#workGroupId").val();
			window.location.href="/uums/workgroup/work-group!addUserToGroup.action?new=true&menuId=m12_1_1&memberId="+returnId+"&id="+workGroupId;
}
//显示删除部门成员确认提示
function confirmDeleteWorkGroupMember(userId){
	$("#deleteUserId").val(userId);
	showDiv("delete");
}
//确定删除所选部门成员
deleteWorkGroupMember=function(){
	hideDiv('delete');
	var userId=$("#deleteUserId").val();
	var workGroupId=$("#workGroupId").val();
	window.location.href="/uums/workgroup/work-group!deleteWorkGroupMember.action?memberId="+userId+"&id="+workGroupId;
}
//删除部门成员取消按钮
cancelDelete=function(){
	hideDiv('delete');
}