//得到一级知识库之下的子类型，没有子类型就不在显示div
getSubType = function () {
	var selectValue = $("#knowledgeTypeId").val();
	var id = $("option[value=" + selectValue + "]").attr("id");
	if(id == null){
		return;
	}else{
		//记录第一个的id，用户有可能就选择他
		$("#hiddenTypeId").val(id);
		$("#hiddenParentTypeId").val(id);
		//发起个ajax，返回json数据
		$.ajax({
			data:{
				id:id
			}, 
			dataType:"json", 
			type:"post", 
			url:"/itsm/knowledge/knowledgeMgt.do?method=getCategory", 
			success:function(json) {
					var opetions = "";
					var noSelect="";
					for (var i = 0; i < json.length; i++) {
						$("#separator").show();
						$("#subKnowledgeTypeId").show();
						 noSelect = "<option value='不选' id='00'>" + "不选"+ "</option>";
						//有子类型，则子类型的选择框显示
						var option = "<option value='"+json[i].name +"' id='" + json[i].categoryId + "'>" + json[i].name + "</option>";
						opetions = opetions + option;
					}
					if ("" != opetions) {
						$("#subKnowledgeTypeId").html(noSelect+opetions);
					} else {
						$("#separator").hide();
						$("#subKnowledgeTypeId").hide();
					}
				}, 
		error:function (XMLHttpRequest, textStatus) {
			var msg = XMLHttpRequest.responseText.split("--");
			//重定向到错误页面
			window.location.href = "/itsm/knowledge/knowledgeMgt.do?method=showErroe&genericErrorContent=" + msg[0] + "&genericErrorForwardPath=" + msg[1].split("[")[0];
		}});
		}
};
//选择知识库子类型
selectIt = function () {
	var selectValue = $("#subKnowledgeTypeId").val();
	if(selectValue=="不选"){
		var id=$("#hiddenParentTypeId").val();
		$("#hiddenTypeId").val(id);
	}else{
		var id = $("option[value=" + selectValue + "]").attr("id");
		//记录第一个的id，用户有可能就选择他
		$("#hiddenTypeId").val(id);
	}
};
//一进入主界面就分别发起ajax请求，分别获取最新10条公告，所有的知识库类型
function getNotice(login, ssdUser, limitDay, limitNum) {
	//第一获得最新十条公告
	NoticeService.getNoticeList(login, ssdUser, limitDay, limitNum, callBack);
	//得到所有的知识库类型分类
	CategoryService.queryAllCategoryList(callBackKnowledge);
	//加载最新的前六条专题
	SubjectService.querySubjectForSlide(6,callBackSubject);
	
}
//显示前十条知识库记录的回调函数
function callBack(dataList) {
	var uiList = "";
	var ssdUser = jQuery("#hiddenSsdUserId").val();
	for (var eneity in dataList) {
		var tempName="";
		//多余十五个字符就截断处理
		if(dataList[eneity].title.length>15){
			tempName=dataList[eneity].title.substring(0,15)+"...";
		}else{
			tempName=dataList[eneity].title;
		}
		//isTop为true表示是近期发布的公告，界面是显示new标签
		if (dataList[eneity].isTop) {
			//普通用户的链接和运维人员的链接不一样
			if (ssdUser) {
				var ui = "<ul class='everyquestion3'><li class='e1'><a title='"+dataList[eneity].title+"' onclick=\"openNewWindow('/itsm/servicedesk/notice/showNotice.do?method=common&menuId=m0_0&comm=1&noticeId=" + dataList[eneity].noticeId +"')\" href='###'>" + tempName + "</a><img src='/itsm/images/knowledge/new.gif' width='26' height='10' /></li></ul>";
				uiList = uiList + ui;
			} else {
				var ui = "<ul class='everyquestion3'><li class='e1'><a title='"+dataList[eneity].title+"' onclick=\"openNewWindow('/itsm/servicedesk/notice/showNotice.do?method=common&menuId=m0_0&noticeId=" + dataList[eneity].noticeId + "&comm=2')\" href='###'>" + tempName + "</a><img src='/itsm/images/knowledge/new.gif' width='26' height='10' /></li></ul>";
				uiList = uiList + ui;
			}
		} else {
			if (ssdUser) {
				var ui = "<ul class='everyquestion3'><li class='e1'><a title='"+dataList[eneity].title+"' onclick=\"openNewWindow('/itsm/servicedesk/notice/showNotice.do?method=common&menuId=m0_0&comm=1&noticeId=" + dataList[eneity].noticeId+"')\" href='###'>" + tempName + "</a></li></ul>";
				uiList = uiList + ui;
			} else {
				var ui = "<ul class='everyquestion3'><li class='e1'><a title='"+dataList[eneity].title+"' onclick=\"openNewWindow('/itsm/servicedesk/notice/showNotice.do?method=common&menuId=m0_0&noticeId=" + dataList[eneity].noticeId + "&comm=2')\" href='###'>" + tempName + "</a></li></ul>";
				uiList = uiList + ui;
			}
		}
	}
	if ("" != uiList) {
		jQuery("#noticeShowPanleId").show();
		jQuery("#noticShowId").html(uiList);
	}else{
		var nodatahtml = " <div class=\"no_date\"><div class=\"nei_no_date\">当前没有任何数据...</div></div>";
		jQuery("#noticShowId").html(nodatahtml);
		//没有数据把更多按钮隐藏起来
		jQuery("#noticeShowPanleId").hide();
	}
}
//重新开个新窗口显示公告
function openNewWindow(url){
		window.open(url);
}	
//类型查询时，显示所有分类
function getAllType(){
	//得到所有的知识库类型分类
	CategoryService.queryAllCategoryList(callBackKnowledge);
}
//获取所有的知识库类型的回调函数
function callBackKnowledge(dataList) {
	var searchPach="/itsm/knowledge/knowledgeMgt.do?method=doSimpleSearch&typeId=";
	var allDivStr="";
	for(var index in dataList){
	//最高层知识库类型
	if(null == dataList[index].itsmKlCategory){
		var pName="";
		//字符长度超过6个就做截断处理
		if(dataList[index].name.length>6){
			pName=dataList[index].name.substring(0,6)+"...";
		}else{
			pName=dataList[index].name;
		}
		var divStr="<div class='partBoxTitle'><a title ='"+dataList[index].name+"' href='"+searchPach+dataList[index].categoryId+"'>"+pName+"</a></div>";
		//遍历子类型
		var liStr="";
		for(var i=0;i<dataList[index].subKlCategory.length;i++){
			var sName="";
		if(dataList[index].subKlCategory[i].name.length>6){
			sName=dataList[index].subKlCategory[i].name.substring(0,6)+"...";
		}else{
			sName=dataList[index].subKlCategory[i].name;
		}
			 liStr=liStr+"<li style='width:90px;'><a  title='"+dataList[index].subKlCategory[i].name+"' href='"+searchPach+dataList[index].subKlCategory[i].categoryId+"'>"+sName+"</a></li>";
		}
		allDivStr=allDivStr+divStr;
		if(""!=liStr){
			allDivStr=allDivStr+"<ul style='width:200px;' class='partBoxContent'>"+liStr+"</ul>";
		}
	}
	}
	//没有数据
	if(""==allDivStr){
			var nodatahtml = " <div class=\"no_date\"><div class=\"nei_no_date\">当前没有任何数据...</div></div>";
			jQuery("#showTypeId").html(nodatahtml);
	}else{
		jQuery("#showTypeId").html(allDivStr);
	}
}
//专题回调函数
function callBackSubject(dataList) {
	//加载专题列表结束后，马上要显示的最新专题下的问题
	var latesSubjecttId=0;
	var liStrs=""
	var isFirst=true;
	for(var index in dataList){
	//把专题图片放在a标签的那么属性中保存，供后面专题图片切换之用
			var listr="<li class='e1'><a name='"+dataList[index].pictureModel.relativePath+"' id='"+dataList[index].subjectId+"' onmouseout='reStartAuto()' onmouseover='stopAuto("+dataList[index].subjectId+"),getSubjectProblem("+dataList[index].subjectId+")' href='###'> "+dataList[index].name+"</a></li>";
			liStrs=liStrs+listr;
			if(latesSubjecttId==0){
			latesSubjecttId=dataList[index].subjectId;
			}
	}
	if(""!=liStrs){
		jQuery("#showSubjectId").append(liStrs);
		autoSwitchKnowledge(1500);
	}
	//加载最新专题的问题，这里需要有个函数捕获异常，刷新界面
	SubjectService.querySubjectProblem(latesSubjecttId,callBackSubjectProblem);
}
var   intervalID=0;  
//自动切换图片
function autoSwitchKnowledge(time){
	var curIndex=-1;
		intervalID=setInterval(function (){
			var allLi=jQuery("#showSubjectId li");
				allLi.each(function(){
				jQuery(this).children().removeClass("hover");
				});
   				if (curIndex==allLi.length-1){
       				curIndex=0;
    				}
   				else{
        			curIndex+=1;
   					}
   				//图片切换
    			allLi.eq(curIndex).children().addClass("hover");
    			//专题内容切换，包括左边的专题问题和专题图片
    			var id=allLi.eq(curIndex).children().attr("id");
    			getSubjectProblem(id);
			},time);
}
//恢复自动切换图片
function reStartAuto(){
var allLi=jQuery("#showSubjectId li");
		allLi.each(function(){
			jQuery(this).children().removeClass("hover");
		});
	autoSwitchKnowledge(1500);
}
//停止自动切换图片
function stopAuto(current){
	//鼠标移动上去时，要停止图片的切换，鼠标移除是在恢复图片的切换
  	window.clearInterval(intervalID);
	var allLi=jQuery("#showSubjectId li");
		allLi.each(function(){
			jQuery(this).children().removeClass("hover");
		});
	jQuery("#"+current).addClass("hover");
}
//得到专题与问题对应的关联表实体
function getSubjectProblem(id){
	//这里需要有个函数捕获异常，刷新界面
	if(spArray[id]==null)
		SubjectService.querySubjectProblem(id,callBackSubjectProblem);
	else
		callBackSubjectProblem(spArray[id]);
		setSubjectPhoto(id);
}
//得到专题与问题对应的关联表实体的回调函数
var spArray = new Array();
function callBackSubjectProblem(dataList){

	var liStrs=""
	var topProblem="";
	//更多标签
	var more="";
	if(null!=dataList && dataList.length>0){
		var id = dataList[0].itsmKlSubject.subjectId;
		if(spArray[id]==null){
			spArray[id] = dataList;
		}
		more="<h2><a href='/itsm/knowledge/knowledgeMgt.do?method=getProblemById&id="+id+"&pn='><img src='../images/knowledge/more.gif'/></a></h2>";
	}
	for(var index in dataList){
		if(dataList[index].isTop){
			//置顶专题
			var topName="";
			var fullName=dataList[index].itsmKlProblem.title;
			if(fullName.length>20){
			topName=fullName.substring(0,20)+"...";
			}else{
			topName=fullName;
			}
			topProblem="<h1><a title='"+fullName+"' href='/itsm/knowledge/knowledgeMgt.do?method=detail&dataId="+dataList[index].itsmKlProblem.problemId+"'>"+topName+"</a></h1>";
		}else{
		
			//父亲类型
			var parentsTypeshow="";
			var parentName="";
			var fullparentName="";
			var object=dataList[index].itsmKlProblem.itsmKlCategory.itsmKlCategory;
			var name="";
			var fullName=dataList[index].itsmKlProblem.itsmKlCategory.name;
			//存在父类，就显示  父类/子类，否则只显示子类
			if(null!=object){
				fullparentName=object.name;
				//有父类，就父类子类的名称各取前三个字符
				if(fullparentName.length>3){
					parentName=fullparentName.substring(0,3)+"...";
				}else{
					parentName=fullparentName;
				}
				if(fullName.length>3){
					name=fullName.substring(0,3)+"...";
				}else{
					name=fullName;
				}
				parentsTypeshow="<li class='e2'><a title='"+fullparentName+"' href='/itsm/knowledge/knowledgeMgt.do?method=doSimpleSearch&typeId="+object.categoryId+"'>"+parentName+"</a>";//</li>
			}else{
				//不存在父类就取子类名称的钱6个字符
				if(fullName.length>6){
					name=fullName.substring(0,6)+"...";
				}else{
					name=fullName;
				}
			}
			//并接html
			var listr="<ul class='everyquestion4'><li class='e1'><a href='/itsm/knowledge/knowledgeMgt.do?method=detail&dataId="+dataList[index].itsmKlProblem.problemId+"'>"+dataList[index].itsmKlProblem.title+"</a></li>";
			//有父类要显示
			if(parentsTypeshow!=""){
				listr+=parentsTypeshow+"/<a title='"+fullName+"' href='/itsm/knowledge/knowledgeMgt.do?method=doSimpleSearch&typeId="+dataList[index].itsmKlProblem.itsmKlCategory.categoryId+"'>"+name+"</a></li></ul>"
			}else{
				listr+="<li class='e2'><a title='"+fullName+"' href='/itsm/knowledge/knowledgeMgt.do?method=doSimpleSearch&typeId="+dataList[index].itsmKlProblem.itsmKlCategory.categoryId+"'>"+name+"</a></li></ul>"
			}
			liStrs=liStrs+listr;
		}
	}
	if(""!=more){
		jQuery("#topProblemId").html(topProblem+more);
	}else{
		jQuery("#topProblemId").empty();
	}
	if(""!=liStrs){
		jQuery("#subjectProblemId").html(liStrs);
	}else{
		var nodatahtml = " <div class=\"no_date2\"><div class=\"nei_no_date2\">当前没有任何数据...</div></div>";
		jQuery("#subjectProblemId").html(nodatahtml);
	}
}
//专题图片切换
function setSubjectPhoto(id){
	var sujectPhoto=jQuery("#"+id).attr("name");
    if(null!=sujectPhoto && ""!=sujectPhoto){
		jQuery("#subjctPhotoId").html("<img src='"+sujectPhoto+"' width='307' height='209' />");
	}else{
		jQuery("#subjctPhotoId").empty();
	}
}
//点击回车后自动搜索相关已经解决了的问题
jQuery(document).ready(function(){
	jQuery("body").bind("keydown",function(event){
		var focusId=document.activeElement.id;
		//防止在其他控件上敲回车二搜索，其实用户只是想简简单单的回个车
		if(event.keyCode==13 && focusId=="searchContentid"){
			doSovleSearch();
		}
	});
})
//根据类型和关键字搜索待解决的类似问题
function searchProblemByTypeName(){
	var kw=jQuery("#searchProblemByTypeId").val();
	kw=kw.replace(/\%/g,"%25");
	kw=kw.replace(/\#/g,"%23");
	kw=jQuery.trim(kw);
	var typeId=jQuery("#hiddenTypeId").val();
	window.location.href="/itsm/knowledge/knowledgeMgt.do?method=doSimpleSearch&status=1&typeId="+typeId+"&keyWord="+kw;
}
//根据类型，关键字，状态搜索类似的问题
function searchProblemByprame(typeId,kw,status){
	var queryStr=""
	if(null!=typeId){
	queryStr=queryStr+"&typeId="+typeId;
	}
	if(null!=kw){
	queryStr=queryStr+"&keyWord="+kw;
	}
	if(null!=status){
	queryStr=queryStr+"&status="+status;
	}
	window.location.href="/itsm/knowledge/knowledgeMgt.do?method=doSimpleSearch"+queryStr;
}
//根据专题的id得到该专题下面的所有问题
function getProblemsBySubjectId(){
	var selector=jQuery("#allAubjecyListId");
	var index=selector[0].selectedIndex;
	var id = selector[0].options[index].id;
	window.location.href="/itsm/knowledge/knowledgeMgt.do?method=getProblemById&id="+id+"&pn=";
}
//用户提问时候，如果没有登录，就通过ajax发起请求登录
function ajaxLogin(){
	var userName=jQuery("#usernameId").val();
	var userPwd=jQuery("#passwordId").val();
	var imagCode=jQuery("#codeImagId").val();
	if("" == userName){
		alert('请输入输入用户名！');
		return;
	}else if("" == userPwd){
		alert('请输入用户密码！');
		return;
	}else if("" == imagCode){
		alert('请输入验证码！');
		return;
	}else if("" != imagCode && "" != userPwd && "" != userName){
	//发起请求
	$.ajax({
			data:{
				username:userName,
				password:userPwd,
				verifyCode:imagCode
			}, 
			dataType:"json", 
			type:"post", 
			url:"/itsm/knowledge/ajaxLogin.do?method=login", 
			success:function(json) {
			//标记一下是从登录处来的
			KeyWord=jQuery("#hiddenKkeyWord").val();
			document.forms['addKnowledgeProblemId'].action = "/itsm/knowledge/knowledgeMgt.do?method=doAdd&from=kno&keyWord="+KeyWord;
			document.forms['addKnowledgeProblemId'].submit();
			}, 
			error:function (XMLHttpRequest, textStatus) {
				var msg = XMLHttpRequest.responseText;
				jQuery("#knowledgeErrorShowId").html(msg);
		}
		});
	}
}
