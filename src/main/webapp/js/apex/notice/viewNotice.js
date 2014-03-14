var keyWord_total = '';//全局变量，用于标识luncene搜索的关键字
//注册enter事件
$(function(){ 
			$("#jumpPageNum").bind('keydown',function(evt){
				if(evt.keyCode == 13){
				  var testNumber = $("#jumpPageNum").val();
				  if(testNumber <0 || testNumber!=parseInt(testNumber)){
				  	$("#jumpPageNum").val("");
				  	return;
				  }
				  var jumpNumber = Number(testNumber);
				  var totalPageNum = Number($("#initTotalPageNum").text());
				  if(jumpNumber > totalPageNum)
				  	jumpNumber = totalPageNum;	
				  if(jumpNumber < 1)
				  	jumpNumber = 1;
				$("#jumpPageNum").val(jumpNumber);
			  	showFixedPageNotices(jumpNumber);
				}
			});
			$("#keyWord").bind('keydown',function(evt){
				if(evt.keyCode == 13){
					var keyword = $("#keyWord").val();
					if(Ext.isEmpty(keyword)){
						Ext.Msg.show({
							title : '提示',
							msg : '请输入搜索关键字！',
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.INFO
						});
						return;
					}
					//searchNotice();
					search();
				}			
			});
			changeSelectedColor();
			keyWord_total = '';
		});
function showNoticeDetail(index){
	var noticeId = $("#noticeId"+index).val();
	if(Ext.isEmpty(noticeId))
		return;
	NoticeService.getNoticeById(noticeId,function(notice){
		if(Ext.isEmpty(notice)){
				Ext.Msg.show({
						title : '提示',
						msg : '该公告已被他人删除！',
						modal : true,
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.WARNING,
						fn : function() {
							var pageNum =  Number($("#initCurPageNum").text());
							location.href = "/itsm/servicedesk/notice.do?pageNum="+pageNum;
						}
					});
		}else{
			$("#displayNoticeId").val(notice.id);
			$("#detailTitle").html(Ext.util.Format.htmlEncode(notice.title));
			$("#detailDate").html(notice.referDate);
			$("#detailMemo").html(notice.formatedMemo);
			changeSelectedColor();
		}
	})
}

function getNextPageNotices(){
	var curPageNum = Number($("#initCurPageNum").text());
	var totalPageNum = Number($("#initTotalPageNum").text());
	if(curPageNum == totalPageNum)
		return;
	curPageNum = curPageNum+1;
	showFixedPageNotices(curPageNum);
}

function getPreciusPageNotices(){
	var curPageNum = Number($("#initCurPageNum").text());
	var totalPageNum = Number($("#initTotalPageNum").text());
	if(curPageNum == 1)
		return;
	curPageNum = curPageNum-1;
	showFixedPageNotices(curPageNum);
}

function showFixedPageNotices(pageNum){
	NoticeService.getFixedPageNotices(pageNum,keyWord_total,function(noticeList){
		var operatable = $("#operatable").val();
		$("#initCurPageNum").text(pageNum);
		clearNoticeList();
		for(var i=0;i<noticeList.length;i++){
			$("#img"+i).html("<img src='../images/child.gif'/>");
			$("#noticeName"+i).text(noticeList[i].title);
			$("#noticeDate"+i).text(noticeList[i].shortReferDate);
			$("#noticeId"+i).val(noticeList[i].id);
			if(operatable == 'true'){
				$("#edit"+i).css('display','block'); 
				$("#delete"+i).css('display','block'); 
			}
		}
		resumeColor();
		disabledBtns(pageNum);
	})
}

function clearNoticeList(){
	for(var i=0;i<20;i++){
		$("#img"+i).html("");
		$("#noticeName"+i).text("");
		$("#noticeDate"+i).text("");
		$("#noticeId"+i).val("");
		$("#edit"+i).css('display','none'); 
		$("#delete"+i).css('display','none'); 
	}
}

function changeSelectedColor(){
	var obj = document.getElementById("displayNoticeId");
	if(null != obj){
		for(var i=0;i<20;i++){
			var selectedId = $("#noticeId"+i).val();
			if(selectedId == obj.value){
				$("#tr"+i).css("background","#CFE7FA");
			}else{
				if(i%2==0)
					$("#tr"+i).css("background","#eeeeee");
				else
					$("#tr"+i).css("background","#FFFFFF");
			}
		}
	}
}

function resumeColor(){
	for(var i=0;i<20;i++){
		if(i%2==0)
			$("#tr"+i).css("background","#eeeeee");
		else
			$("#tr"+i).css("background","#FFFFFF");
	}
}

/**
 * 根据实际情况将上一页和下一页置灰
 */
function disabledBtns(curPage){
	if(curPage == 1)
		$("#prePage").addClass("disable");
	else
		$("#prePage").removeClass("disable");
	var totalPage = parseInt($("#initTotalPageNum").text());
	if(totalPage == curPage)
		$("#nextPage").addClass("disable");
	else
		$("#nextPage").removeClass("disable");
}

function editNotice(index){
	var noticeId = $("#noticeId"+index).val();
	if(Ext.isEmpty(noticeId))
		return;
	location.href = "/itsm/servicedesk/notice/modifyNotice.do?method=enterModify&noticeId="+noticeId;
	
}

function deleteNotice(index){
	var noticeId = $("#noticeId"+index).val();
	if(Ext.isEmpty(noticeId))
		return;
	var confirmBox = Ext.MessageBox.confirm('确认', '您确定要删除该公告？',function(value){
					if (value == 'yes') {
						NoticeService.deleteNoticeById(noticeId,{
							callback : function(result){
								var pageNum =  Number($("#initCurPageNum").text());
								if(true == result){
									location.href = "/itsm/servicedesk/notice.do?pageNum="+pageNum;
								}else{
									Ext.Msg.show({
										title : '错误',
										msg : '发送错误或异常，删除失败！',
										modal : true,
										buttons : Ext.Msg.OK,
										icon : Ext.Msg.WARNING,
										fn : function() {
											location.href = "/itsm/servicedesk/notice.do?pageNum="+pageNum;
										}
									});
								}
							},
							errorHandler : function(errorString, exception){
								var pageNum =  Number($("#initCurPageNum").text());
								Ext.Msg.show({
												title : '错误',
												msg : '该公告已被他人删除！',
												modal : true,
												buttons : Ext.Msg.OK,
												icon : Ext.Msg.INFO,
												fn : function() {
													location.href = "/itsm/servicedesk/notice.do?pageNum="+pageNum;
												}
											});
					}
				
			})
		}
	});
}

function searchNotice(){
	var keyword = $("#keyWord").val();
	NoticeService.searchNoticeBykey(keyword,function(result){
		if(!Ext.isEmpty(result) && result.length == 2){
			keyWord_total = keyword;
			var totalNum = result[0];
			if(0 == totalNum){
				Ext.Msg.show({
					title : '提示',
					msg : '系统无匹配的公告！',
					modal : true,
					buttons : Ext.Msg.OK,
					icon : Ext.Msg.INFO
				});
				return;
			}	
			var noticeList = result[1];
			$("#initCurPageNum").text("1");
			$("#initTotalPageNum").text(totalNum);
			clearNoticeList();
			for(var i=0;i<noticeList.length;i++){
				$("#img"+i).html("<img src='../images/child.gif'/>");
				$("#noticeName"+i).text(noticeList[i].title);
				$("#noticeDate"+i).text(noticeList[i].shortReferDate);
				$("#noticeId"+i).val(noticeList[i].id);
				$("#edit"+i).css('display','block'); 
				$("#delete"+i).css('display','block'); 
			}
			resumeColor();
		}else{
			Ext.Msg.show({
				title : '提示',
				msg : '系统无匹配的公告！',
				modal : true,
				buttons : Ext.Msg.OK,
				icon : Ext.Msg.INFO
			});
		}
	});
}

function doPrint(){
	$("#printId").css('display','none');
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
//	sleep(2000);
	location.href = "/itsm/servicedesk/notice.do?displayNoticeId="+$("#displayNoticeId").val();
}

function sleep(nMillis){
	var dt1 = new Date();  
    for(;;){  
		var dt2 = new Date();  
		if((dt2.getTime()-dt1.getTime()) >= nMillis)  
			break;  
  	}   
}