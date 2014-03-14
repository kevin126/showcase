var expandIndex_total = 0;//展开目录的序号，全局变量
var waitDeleteId_total = 0;//待删除的目录Id，全局变量，
var waitDeleteAttach_total = 0;//待删除的附件Id，全局变量，
/**
 * 页面加载的时候就执行
 */
$(function(){ 
	var displayIndex = $("#displayIndex").val();
	displayIndex = parseInt(displayIndex);
	if(displayIndex != 0)
		toggleStatus(displayIndex);
});



/**
 * 添加新的目录,该函数只是显示DIV，具体操作在do_operate()中执行
 */
function addDirectory(){
	$("#operateDiv").show();
	$("#confirmDeleteDiv").hide();
	$("#confirmDeleteAttachDiv").hide();
	$("#errMessageDiv").hide(); 
	$("#title").val('');
	$("#content").val('');
	$("#directoryId").val(0); 
	$("#addBtn").hide(); //将添加按钮隐藏
	$("#noDirectories").hide(); //将提示无SLA目录隐藏
	$("#operateName").text("新增SLA目录");
	$("#operateName").show();//设置操作名称并显示
	$("#titleError").hide();
}
/**
 * 编辑SLA目录,该函数只是显示DIV，具体操作在do_operate()中执行
 */
function editDirectory(slaId,index){
	$("#operateDiv").show();
	$("#confirmDeleteDiv").hide();
	$("#confirmDeleteAttachDiv").hide();
	$("#errMessageDiv").hide(); 
	$("#title").val($("#dTitleValue"+index).text());
	if($.browser.msie){
		$("#content").val($('#dContent'+index+" span")[0].innerText);
	}else{
		var htmlContent = $("#dContent"+index+" span").html();
		var textContent = htmlContent.replace(new RegExp("<br>","g"),"\n");
		$("#content").html(textContent);
	}
	$("#directoryId").val(slaId); 
	$("#addBtn").hide(); //将添加按钮隐藏
	$("#operateName").text("编辑SLA目录");
	$("#operateName").show();//设置操作名称并显示
	$("#titleError").hide();
	$("#expandIndex").val(index);
	if(index != expandIndex_total)
		toggleStatus(index);
}

/**
 * 执行添加或者编辑操作
 */
function do_operate(){
	if(validateForm())
		document.getElementById("directoryForm").submit();
}

/**
 * 取消增加或者编辑SLA目录
 */
function canealOperate(){
	 $("#confirmDeleteDiv").hide();
	  $("#confirmDeleteAttachDiv").hide();
  	 $("#errMessageDiv").hide(); 
  	 $("#operateDiv").hide();
  	 $("#addBtn").show(); //将添加按钮显示
  	 $("#operateName").hide();//将操作名称隐藏
  	 	
}
/**
 * 删除目录，该函数只是显示确认删除的DIV，具体的删除操作在do_delete()中执行
 */
function deleteDirectory(directoryId,index){
	 $("#confirmDeleteDiv").show();
	  $("#confirmDeleteAttachDiv").hide();
  	 $("#errMessageDiv").hide(); 
  	 $("#operateDiv").hide();
  	 waitDeleteId_total = directoryId;
  	 if(index != expandIndex_total)
  	 	toggleStatus(index);
}

function do_delete(){
	SlaService.deleteDirectoryById(waitDeleteId_total,{
			callback : function(){
				location.href = "/itsm/sla/slaManageAction.do?method=displaySlaDirectory&menuId=m7_2";
			},
			errorHandler : function(errorString, exception) {
			   	 $("#errMessage").text('该SLA目录已他人删除！');
			   	 $("#confirmDeleteDiv").hide();
			   	 $("#confirmDeleteAttachDiv").hide();
			  	 $("#errMessageDiv").show(); 
			  	 $("#operateDiv").hide();
			}
		});
}

function deleteAttachmentById(attachmentId){
	 $("#confirmDeleteDiv").hide();
	 $("#confirmDeleteAttachDiv").show();
  	 $("#errMessageDiv").hide(); 
  	 $("#operateDiv").hide();
  	 waitDeleteAttach_total = attachmentId;
}

function do_deleteAttach(){
	IncidentService.deleteRequestAttachment(waitDeleteAttach_total,{
		callback : function(){
			location.href = "/itsm/sla/slaManageAction.do?method=displaySlaDirectory&menuId=m7_2&displayIndex="+expandIndex_total;
		},
		errorHandler : function(errorString, exception) {
			if(exception.message == 'attach.not.exist'){
				 $("#errMessage").text('该附件已被他人删除，删除失败！');
			}else{
				 $("#errMessage").text('发生不明错误或异常，删除失败！');
			}
		   	 $("#confirmDeleteDiv").hide();
		   	 $("#confirmDeleteAttachDiv").hide();
		  	 $("#errMessageDiv").show(); 
		  	 $("#operateDiv").hide();
		}
	});
}

/**
 * 验证表单数据是否合法
 */
function validateForm(){
	$("#titleError").hide();
	$("#contentError").hide();
	var title = $("#title").val().trim();
	if(Ext.isEmpty(title)){
		$("#titleError").text("标题不能为空");
		$("#titleError").show();
		return false;
	}
	if(title.length > 100){
		$("#titleError").text("标题不超过100字符");
		$("#titleError").show();
		return false;
	}
	var content = $("#content").val().trim();
	if(Ext.isEmpty(content)){
		$("#contentError").text("内容不能为空");
		$("#contentError").show();
		return false;
	}
	if(content.length > 20000){
		$("#contentError").text("内容不超过20000字符");
		$("#contentError").show();
		return false;
	}
	return true;
}

/**
 * 切换展开或收缩的状态
 */
function toggleStatus(index){
	if('block' == $("#dContent"+index).css("display")){//折叠
		shrinkDirectory(index);
	}else{//展开
		expandDirectory(index);
		if(expandIndex_total != index)
			shrinkDirectory(expandIndex_total);
	}
	expandIndex_total = index;
}
/**
 * 展开目录
 */
function expandDirectory(index){
	$("#directory"+index).attr("class","SLAServiceCatalogBlue");
	$("#dTitle"+index).attr("class","SLAServiceCatalogShowTitle");
	$("#img"+index).attr("src","../images/newui/bigTab/p.gif");
	//$("#dContent"+index).slideDown("fast");
	$("#dContent"+index).show();
}

/**
 * 收缩目录
 */
function shrinkDirectory(index){
	if(index%2 == 1){
		$("#directory"+index).attr("class","SLAServiceCatalogBlue");
		$("#dTitle"+index).attr("class","SLAServiceCatalogBlueTitle");
	}else{
		$("#directory"+index).attr("class","SLAServiceCatalogGrey");
		$("#dTitle"+index).attr("class","SLAServiceCatalogGreyTitle");
	}
	$("#img"+index).attr("src","../images/newui/bigTab/add.gif");
	$("#dContent"+index).slideUp("fast");
}

/**
 * 打印SLA服务目录
 */
function printSlaDirectory(){
	var oldstr = document.body.innerHTML;//记住原页面的样子
	var length = $('#slaDirectoryList').children().length;
	for(var i=0;i<length;i++)
		expandDirectory(i);
	var headstr = "<html><head><title></title></head><body>";
	var footstr = "</body></html>";
	var bdhtml=window.document.body.innerHTML;
	var sprnstr="<!--startprint-->";
	var eprnstr="<!--endprint-->";
	var prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
	prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
	var contentHtml = headstr+prnhtml+footstr;
	window.document.body.innerHTML=contentHtml; 
	window.print(); 
	sleep(2000);
   location.href = "/itsm/sla/slaManageAction.do?method=displaySlaDirectory&menuId=m7_2";
}

function sleep(nMillis){
	var dt1 = new Date();  
    for(;;){  
		var dt2 = new Date();  
		if((dt2.getTime()-dt1.getTime()) >= nMillis)  
			break;  
  	}   
}