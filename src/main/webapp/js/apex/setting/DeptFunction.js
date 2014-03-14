startBtn=function(){
	//验证时被值为true
	$("#addDeptsubmitButton").attr("disabled", false);
}
cancleAddDept=function(){
		//clear all information
		$("#deptNameId").val("");
		$("#deptMemoId").val("");
}
cancleEditDept=function(parentName){
		var idValue=$("#ediDeptId").val();
		if(idValue>0){
		//有编辑状态切入添加状态1：换title。2。设置id 为ediDeptId的值为0
		$("#ediDeptId").val(0);
		var name="";
		if(parentName.length>5){
			name=parentName.substring(0,5);
			name=name+"...";
		}else{
			name=parentName;
		}
		$("#addOrEditDeptTitleShowId").html("在<span class='fontGreen'> "+name+"</span>下创建子部门");
		}
		$("#deptNameId").val("");
		$("#deptMemoId").val("");
		$("#assUserName").val(null);
		$("#assUserId").val(null);
}
editDept=function(editDeptId){
//编辑切换到添加时ediDeptId的值要设置为0
		$.ajax({
				data:{
					id:editDeptId
					},
				dataType:'json',
				type:'post',
				url:'/uums/userdept/user-dept!enterUpdate.action',
				success:function(json){
					$("#ediDeptId").val(json[0].id);
					$("#deptNameId").val(json[0].deptName);
					$("#deptMemoId").val(json[0].deptMemo);
					$("#assUserName").val(null);
					$("#assUserId").val(null);
					if(json[1]!=null)
					{
						$("#assUserName").val(json[1][0].name);
						$("#assUserId").val(json[1][0].id);
					}
					var editDeptName="";
					if(json[0].deptName.length>6){
					editDeptName=json[0].deptName.substring(0,6);
					editDeptName=editDeptName+"...";
					}else{
					editDeptName=json[0].deptName;
					}
					$("#addOrEditDeptTitleShowId").html("编辑<span class='fontGreen'>"+editDeptName+"</span>");
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
		window.location.href="/uums/userdept/user-dept!list.action";
		}else{
		window.location.href="/uums/userdept/user-dept!list.action?parentId="+parentId;
		}
}
deleteConform=function(deptId){
		$("#deleteDeptId").val(deptId);
		showDiv('delete')
		
}
deleteDept=function(){
	hideDiv('delete')
		var id=$("#deleteDeptId").val();
			$.ajax({
				data:{
					id:id
					},
				dataType:'html',
				type:'post',
				url:'/uums/userdept/user-dept!deleteUserDeptById.action',
				success:function(html){
				$("#"+id).hide();
				},
				error:function (XMLHttpRequest, textStatus) {
					$("#errorInforShow").show();
					$("#errorShowId").html(XMLHttpRequest.responseText);
					}
			});
}

exportExcel=function(){
		setBtnDisabled();
		var selectUser=$("input[type=checkbox]:checked");
		if(selectUser.length<1){
			//没有选中要操作的记录
			showDiv('selectUserItems');
			return;
		}
		var idsArray="";
		var idTds=$("input[type=checkbox]:checked");
		idTds.each(function(){
		if(idsArray==""){
			idsArray =$(this).val().split(",")[0];
		}else{
			idsArray =idsArray+","+$(this).val().split(",")[0];
		}
		});
		$("input[type=checkbox]").attr("checked",false);
		window.location.href="/uums/userdept/user-dept!exportExcel.action?ids="+idsArray;
		setBtnAbled();
}
exportExcelAll=function(){
		setBtnDisabled();
		$("input[type=checkbox]").attr("checked",false);
		window.location.href="/uums/userdept/user-dept!exportExcelAll.action";
		setBtnAbled();
}

selectAllUserDept=function(){
		//全选择或者全不选择
		var isCheck=$("#selectAllUserDept").attr("checked");
		if(isCheck){
			$("input[type=checkbox]").attr("checked",true);
		}else{
			$("input[type=checkbox]").attr("checked",false);
		}
}
enterImport = function(){
		window.location.href="/uums/userdept/user-dept!enterImport.action";
}
//请选择要操作的用户
pleaseSelect=function(){
		setBtnAbled();
		hideDiv('selectUserItems')
}

//设置所有按钮不可以操作
setBtnDisabled=function(){
		$("#exportExcelBtn").unbind("click",exportExcel);
		$("#exportAllExcelBtn").unbind("click",exportExcelAll);
		$("#importExcelBtn").unbind("click",enterImport);
}
//设置所有按钮可以操作
setBtnAbled =function(){
		$("#exportExcelBtn").bind("click",exportExcel);
		$("#exportAllExcelBtn").bind("click",exportExcelAll);
		$("#importExcelBtn").bind("click",enterImport);
}

addAssUser= function(){
		var url="";
		url="/uums/common/query-user.action?selectOne=1&status=submit&enter=enter";
		art.dialog.open(url, {limit: false,lock:true,title:'<b>选择用户</b>',width:'860px',height:'610px'});
}


function doCallBack(rtValue){
		var id="";
		for(var i=0;i<rtValue.length;i++){
				for(var j=0;j<rtValue[i].length;j++){
					if(j==0){
					 	$("#assUserName").val(Ext.util.Format.htmlDecode(rtValue[i][j].name));
					}else if(j==8){
						$("#assUserId").val(rtValue[i][j].id.trim());
					}else{
						continue;
					}
			}
			}
}