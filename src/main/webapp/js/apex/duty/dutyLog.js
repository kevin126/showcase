function hide(id){
	document.getElementById(id).style.display = "none";
}
function show(id){
	document.getElementById(id).style.display = "";
}
function chgType(){
	if(document.getElementById("shijianduan").value==5){
		show("shijiandu_li");
	}else{
		hide("shijiandu_li")
 	}
}
KE.show({
		id : 'memo',
		resizeMode : 1,
		allowPreviewEmoticons : false,
		allowUpload : false,
		items : [
		'fontname', 'fontsize', '|', 'textcolor', 'bgcolor', 'bold', 'italic', 'underline',
		'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
		'insertunorderedlist', '|', 'emoticons', 'image', 'link']
	});
function getAllWorkGroup(){
var win = new AllWorkGroupPanl("selectWorkGroup");
			win.show();
}
function getAllDept(id){
var win=new AllDepartmentDlg(id);
				win.show();
}
//显示我的值班日志
function showMe(){
	$("#userName").val($("#logInUserName").val());
	var searchDutyLogForm=document.getElementById("searchDutyLogForm");
	searchDutyLogForm.submit();
}
function writeDutyLog(){
	//显示修改页面层
	$("#edit_rizhi").show();
	//将值班时间隐藏
	$("#uldutyTime").show();
	//隐藏班次
	$("#ulDutyUnit").show();
	$("#lidutyLogTip").html("写日志:");
	//清空编辑框中的内容
	KE.g["memo"].iframeDoc.body.innerHTML = "";
	$("#operateType").val("add");
	$("#subbtn").val("发布");
	//隐藏掉删除提示层
	$("#delete").hide();
}
//修改值班日志
function editDutyLog(dutyRecordId){
	//显示修改页面层
	$("#edit_rizhi").show();
	//将值班时间隐藏
	$("#uldutyTime").hide();
	//隐藏班次
	$("#ulDutyUnit").hide();
	$("#lidutyLogTip").html("编辑日志:");
	DutyService.getDutyRecord(dutyRecordId,{
			callback : function(dutyRecord){
				//设置编辑框中的内容
				KE.g["memo"].iframeDoc.body.innerHTML = "";
				KE.g["memo"].iframeDoc.body.innerHTML = dutyRecord.log.content;
			}
		});
	$("#operateType").val("edit");
	$("#subbtn").val("保存");
	$("#dutyRecordId").val(dutyRecordId);
	//隐藏掉删除提示层
	$("#delete").hide();
}
/**显示删除值班日志层*/
function enterDelete(dutyRecordId) {
	//隐藏添加日志层
	$("#edit_rizhi").hide();
	$("#deleteId").attr("value", dutyRecordId);
	$("#delete").attr("style", "display: block");
}

//删除值班日志
function deleteDutyLog(){
	var dutyRecordId = $("#deleteId").val();
	window.location.href="/itsm/duty/dutyLog.do?method=delete&dutyRecordId="+dutyRecordId;
}
//补填值班日志
function replenishDutyLog(dutyRecordId){
	//显示修改页面层
	$("#edit_rizhi").show();
	//将值班时间隐藏
	$("#uldutyTime").hide();
	//隐藏班次
	$("#ulDutyUnit").hide();
	$("#lidutyLogTip").html("补填日志:");
	//清空编辑框中的内容
	KE.g["memo"].iframeDoc.body.innerHTML = "";
	$("#operateType").val("replenish");
	$("#subbtn").val("补填");
	$("#dutyRecordId").val(dutyRecordId);
	//隐藏掉删除提示层
	$("#delete").hide();
}
//清空查询条件
function clearQueryCondition(){
	//清空选择的部门
	$("#selectuserdept").val("");
	//清空选择的工作组
	$("#selectWorkGroup").val("");
	//清空用户名
	$("#userName").val("");
	//清空时间段
	$("#shijianduan").attr("value",'-1');
	//隐藏显示的时间选择条件框
	hide("shijiandu_li");
}

function validateForm(){
	var operateType=$("#operateType").val();
	var memo=KE.g["memo"].iframeDoc.body.innerHTML;
	if(Ext.isEmpty(memo) || memo=="<br>"){
		art.dialog({lock: true,content: '日志内容不能为空，请设置！',yesFn: true});
		return false;
	}else{
		if(memo.length>10000){
			art.dialog({lock: true,content: '当前内容长度为:'+memo.length+'个字符，包括标记和特殊符号.实际总长度不能超过10000个字符！',yesFn: true});
			return false;
		}
	}
	
	//添加值班日志
	if(operateType=="add"){
		var dutyDate=$("#dutyDate").val();
		//校验日期选择
		if(Ext.isEmpty(dutyDate)){
			art.dialog({lock: true,content: '值班时间不能为空，请设置！',yesFn: true});
			return false;
		}
		//校验班次选择
		var dutyUnitId=$("#dutyUnitId").val();
		//alert("dutyUnitId:"+dutyUnitId);
		if(dutyUnitId==null){
			art.dialog({lock: true,content: '班次不能为空，请选择！',yesFn: true});
			return false;
		}
	}//修改值班日志
	else if(operateType=="edit"){
	}//补填值班日志
	else if(operateType=="replenish"){
	}
	return true;
}