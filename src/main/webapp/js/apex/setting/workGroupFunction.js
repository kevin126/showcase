cancleAddDept=function(){
		//clear all information
		$("#workGroupNameId").val("");
		$("#workGroupMemoId").val("");
}
cancleEditDept=function(parentName){
var idValue=$("#editEntityId").val();
		if(idValue>0){
		//有编辑状态切入添加状态1：换title。2。设置id 为ediDeptId的值为0
		$("#editEntityId").val(0);
			var name="";
			if(parentName.length>4){
				name=parentName.substring(0,4);
				name=name+"...";
			}else{
				name=parentName;
			}
		$("#addOrEditWorkGroupTitleShowId").html("在<span class='fontGreen'>"+name+"</span>下创建子工作组");
		}
		$("#workGroupNameId").val("");
		$("#workGroupMemoId").val("");
}
editWorkGroup=function(editDeptId){
		$.ajax({
				data:{
					id:editDeptId
					},
				dataType:'json',
				type:'post',
				url:'/uums/workgroup/work-group!enterUpdate.action',
				success:function(json){
					$("#editEntityId").val(json[0].id);
					$("#workGroupNameId").val(json[0].workGroupName);
					$("#workGroupMemoId").val(json[0].workGroupMemo);
					var editDeptName="";
					if(json[0].workGroupName.length>6){
					editDeptName=json[0].workGroupName.substring(0,6);
					editDeptName=editDeptName+"...";
					}else{
					editDeptName=json[0].workGroupName;
					}
					$("#addOrEditWorkGroupTitleShowId").html("编辑<span class='fontGreen'>"+editDeptName+"</span>");
				},
				error:function (XMLHttpRequest, textStatus) {
					$("#errorInforShow").show();
					$("#errorShowId").html(XMLHttpRequest.responseText);
					}
			});
}
reFlush=function(parentId){
		//reflush
		if(parentId<1){
		window.location.href="/uums/workgroup/work-group!list.action";
		}else{
		window.location.href="/uums/workgroup/work-group!list.action?parentId="+parentId;
		}
}
deleteConform=function(deptId){
		$("#deleteWorkGroupId").val(deptId);
		showDiv('delete');
		
}
deleteDept=function(){
	hideDiv('delete')
		var id=$("#deleteWorkGroupId").val();
			$.ajax({
				data:{
					id:id
					},
				dataType:'html',
				type:'post',
				url:'/uums/workgroup/work-group!deleteWorkGroup.action',
				success:function(html){
				$("#"+id).hide();
				},
				error:function (XMLHttpRequest, textStatus) {
					$("#errorInforShow").show();
					$("#errorShowId").html(XMLHttpRequest.responseText);
					}
			});
}