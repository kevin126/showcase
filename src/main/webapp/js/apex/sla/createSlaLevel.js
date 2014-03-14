var flag_total = "add";//全局变量，用来区分当前操作是新增SLA还是新增SLA
var slaLevelId_total = "";//全局变量，待删除的SLA等级的Id
/**
 * 响应选择sla等级图片
 */
function selectIcon(iconId,iconName){
	$("#iconImg").attr("src",iconName);
	$("#slaLevelChoiceBoxDiv").hide();
	$("#levelIcon").val(iconId);
}
/**
 * 响应编辑SLA等级
 */
function editSlaLevel(id,index,icon,iconId){
	$("#operateSlaLevelName").text("编辑SLA等级");
	$("#cancelBtn").show();
	$("#levelId").val(id);
	$("#levelName").val($("#name"+index).text());
	if($.browser.msie){
		$("#levelDescription").val(document.getElementById('description'+index).innerText);
	}else{
		var htmlContent = $("#description"+index).html();
		var textContent = htmlContent.replace(new RegExp("<br>","g"),"\n");
		$("#levelDescription").html(textContent);
	}
	$("#levelIcon").val(iconId);
	$("#iconImg").attr("src",icon);
}
/**
 * 新增或者修改SLA等级
 */
function operateSlaLevel(){
	var slaLevel = {};
	var pictureModel={}
	pictureModel.id=$("#levelIcon").val()
	slaLevel.id = $("#levelId").val();
	slaLevel.name = $("#levelName").val().trim();
	slaLevel.description = $("#levelDescription").val().trim();
	slaLevel.pictureModel = pictureModel;
	if(Ext.isEmpty(slaLevel.name)){
		$("#nameError").text("名称不能为空");
		$("#nameError").show();
		return false;
	}
	if(slaLevel.description.length > 100){
		$("#descriptionError").text("描述不超过100个字符");
		$("#descriptionError").show();
		return false;
	}
	$("#nameError").hide();
	$("#descriptionError").hide();
	SlaService.operateSlaLevel(slaLevel,{
		callback : function(){
			location.href = "/itsm/sla/slaManageAction.do?method=displaySlaLevel&menuId=m7_4";
		},
		errorHandler : function(errorString, exception) {
			if(exception.message == 'M0700002'){//等级名称重复
				$("#nameError").text('该名称已存在，请重新输入！');
				$("#nameError").css('display','block'); 
			}else{//并发时，待修改的SLA等级已经被删除了
			   	 $("#warningMessage").text('该SLA等级已他人删除！');
			   	 $("#confirmDelete").hide();
			  	 $("#unableDelete").show(); 
			}
		}
	});
}
/**
 * 响应删除SLA等级按钮
 */
function deleteSlaLevel(slaLevelId){
	slaLevelId_total = slaLevelId;
	$("#confirmDelete").show();
}

/**
 * 执行删除操作
 */
function do_delete(){
	SlaService.deleteSLaLevelById(slaLevelId_total,{
		callback : function(){
			location.href = "/itsm/sla/slaManageAction.do?method=displaySlaLevel&menuId=m7_4";
		},
		errorHandler : function(errorString, exception) {
			if(exception.message == 'M0700004'){//并发时，SLA等级已被其他人删除
				$("#warningMessage").text('该SLA等级已被删除！');
				$("#confirmDelete").hide();
				$("#unableDelete").show(); 
			}else if(exception.message == 'M0700005'){//sla等级已被引用
			   $("#warningMessage").text('该SLA等级已被引用，不能删除！');
			   $("#confirmDelete").hide();
			   $("#unableDelete").show(); 
			}else{
			   $("#warningMessage").text('发生未知错误或异常，删除失败！');
			   $("#confirmDelete").hide();
			   $("#unableDelete").show(); 
			}
		}
	});
}

/**
 *取消编辑
 */
function cancelEdit(){
	location.href = "/itsm/sla/slaManageAction.do?method=displaySlaLevel&menuId=m7_4";
}