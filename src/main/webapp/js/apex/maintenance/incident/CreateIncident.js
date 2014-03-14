var old_requestUser_total = '';//全局变量。记录请求用户原有的值，控制当请求用户的值不发生变化时，不触发loadUsers()函数
var roleNameOfSelectedUser = '';
var li_index_total = 0;
var scoll_change_old = 0;
var handleMouseOver = true;
var selectedField_total = '';//全局变量，用来区分是哪个域接收用户选择窗口返回的数据
$(function(){
	var element = document.getElementById("requestUser");
	if($.browser.msie) { 
		element.onpropertychange = loadUsers;
	}else{
		element.addEventListener("input",loadUsers,false);
	}
//	$("#requestUser").blur(handleBodyClick);
	$("#requestUser").click(function(){return false;});
	$("#queryUserDiv").click(function(){return false;});
	$(document).click(function(){$("#queryUserDiv").hide();});
	$(document).bind('keydown',function(evt){
			if(evt.keyCode == 82 && evt.altKey){
			  directResolve();
			}
			if(evt.keyCode == 38){
				upMove();
			}
			if(evt.keyCode == 40){
				downMove();
			}
			
			if(evt.keyCode == 13){
				handleEnterEvent();
			}
		});
});	
function doSubmit(){
	document.getElementById("incForm").submit();
}

function loadUsers(){
	var content = $("#requestUser").val().replace(/(^\s*)|(\s*$)/g, "");
	if(content != old_requestUser_total){
		old_requestUser_total = content;
		if (!Ext.isEmpty(content)) {
			SecurityService.getUsersByLikeRealName(content, function(data) {
				if (data.length == 0) {
					$("#queryUserDiv").hide();
				} else {
					$("#queryUserUl").empty();
					for (var i = 0; i < data.length; i++) {
						var user = data[i];
						$("#queryUserUl").append("<li class='licss'  onclick='fillUserInfo("+i+")'><a id='"+i+"' href='#' onmouseover='setBackgroudColor(event)' onmouseout='removeBackgroudColor(event)'>"
								+ user[1] + "</a><span style='display:none' id='userId"+i+"'>"+user[0]+"</span></li>");
					}
					var listPosition = jQuery("#requestUser").offset();
					var top = listPosition.top + 20;
					var left = listPosition.left;
					
					if(data.length >=10){
						$("#queryUserDiv").height(220);
					}else{
						$("#queryUserDiv").height("auto");
					}
					$("#queryUserDiv").css({
						"top" : top + "px",
						"left" : left + "px"
					}).css("display","block");
					$("#queryUserDiv")[0].scrollTop = 0;
					li_index_total = 0;
					scoll_change_old = 0;
					handleMouseOver = true;
				}
			})
		}else{
			$("#queryUserDiv").hide();
		}
	}
}

function fillUserInfo(index){
	$("#requestUser").focus();
	var userId = parseInt($("#userId"+index).text());
	SecurityService.getUserById(userId,function(user){
		$("#queryUserDiv").hide();
		if(!Ext.isEmpty(user)){
			old_requestUser_total = user.realName;
			$("#requestUser").val(user.realName);
			$("#department").val(user.depet.deptName);
			if(!Ext.isEmpty(user.mobile))
				$("#phone").val(user.mobile);
			if(!Ext.isEmpty(user.mail))
				$("#email").val(user.mail);
			if(!Ext.isEmpty(user.employeeNo))
				$("#jobNumber").val(user.employeeNo);
			if(!Ext.isEmpty(user.internetAccount))
				$("#internetAccount").val(user.internetAccount);
		}
	})
}

function clearUserInfo(){
	$("#department").val("");
	$("#phone").val("");
	$("#email").val("");
	$("#jobNumber").val("");
	$("#internetAccount").val("");
}

function handleBodyClick(){
	var realName = $("#requestUser").val().trim();
	SecurityService.getOneUserByRealName(realName,function(user){
		if(Ext.isEmpty(user)){
			clearUserInfo();
		}else{
			$("#department").val(user.depet.deptName);
			if(!Ext.isEmpty(user.mobile))
				$("#phone").val(user.mobile);
			if(!Ext.isEmpty(user.mail))
				$("#email").val(user.mail);
			if(!Ext.isEmpty(user.employeeNo))
				$("#jobNumber").val(user.employeeNo);
			if(!Ext.isEmpty(user.internetAccount))
				$("#internetAccount").val(user.internetAccount);
		}
	})
}
function takeIssueMyself(){
	var currentUserName = document.getElementById("curruntUserName").value;
	var curruntUserRealName = document.getElementById("curruntUserRealName").value;
	document.getElementById('fixedHandlerName').value = currentUserName;
	document.getElementById('fixedHandler').value = curruntUserRealName;
}
function selectReceiver(){
	selectedField_total = 'receiveUser';
	var url = "/itsm/common/userQuery.do?selectOne=1&auto=Y&status=submit&exclude=15,16&enter=enter";//auto=Y表示默认就查询出所有的运维人员
    //var s = window.open(url, "", "height=400, width=1100, top=260, left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
	tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}
			
function doCallBack(rtValue){
	if('receiveUser' == selectedField_total){
		for(var i=0;i<rtValue.length;i++){
		    for(var j=0;j<rtValue[i].length;j++){
		        if(j==1){
		        	$("#fixedHandler").attr("value", rtValue[i][j].realName.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
		         	continue;
		        }else if(j==0){
		        	$("#fixedHandlerName").attr("value", rtValue[i][j].name.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
		         	continue;
		        }else if(j==5){
		        	roleNameOfSelectedUser = rtValue[i][j].role.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
		        	continue;
		        }
		    }
		}
		$("#fixedHandler").blur();
	}else{
		for(var i=0;i<rtValue.length;i++){
		    for(var j=0;j<rtValue[i].length;j++){
		        if(j==1){
		        	$("#requestUser").attr("value", rtValue[i][j].realName.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					$("#requestUser").blur();
		         	continue;
		        }else if(j==2){
		        	$("#jobNumber").attr("value", rtValue[i][j].employeeNo.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					$("#jobNumber").blur();
		         	continue;
		        }else if(j==3){
		        	$("#department").attr("value", rtValue[i][j].depet.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
		        	$("#department").blur();
		         	continue;
		        }else  if(j==6){
		        	$("#internetAccount").attr("value", rtValue[i][j].internetAccount.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					$("#internetAccount").blur();
		         	continue;
		        }else  if(j==7){
		        	$("#email").attr("value",  rtValue[i][j].mail.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					$("#email").blur();
		         	continue;
		        }else  if(j==8){
		        	$("#phone").attr("value", rtValue[i][j].office.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					$("#phone").blur();
		         	continue;
		        }
		    }
		}
	}
}


//选择地点
function selectAddress(){
	new Apex.common.AddressList().showAddressList();
}
		
//选择类型
function selectType(){
	new Apex.common.TypeList("incidentType", "INC").showTypeList();
}

//直接解决工单
function directResolve(){
//	var fixedHandler = $("#fixedHandler").val();
//    if(Ext.isEmpty(fixedHandler)){
//    	Ext.Msg.show({
//			title : '提示',
//			msg : '请先选择处理人！',
//			modal : true,
//			buttons : Ext.Msg.OK,
//			icon : Ext.Msg.INFO
//		});
//		return;
//    }
	
	var fixedHandler = $("#fixedHandler").val();
	if(Ext.isEmpty(fixedHandler)){
		$("#fixedHandlerTip").text("直接解决须先选择处理人")
		$("#fixedHandlerTip").attr("class","onError");
		return;
	}
    if(validateInput()){
    	document.getElementById("incForm").action = "/itsm/incident/directResolve.do";
    	document.getElementById("incForm").submit();
    }  
}
	
function upMove(){
	if($("#queryUserDiv").is(":visible")){
		var curLi = $(".liSelected");
		if(curLi.length > 0){
			var userId = parseInt($("#queryUserUl li:first span").text().trim());
			var curUserId = parseInt($(".liSelected span").text().trim());
			if(curUserId == userId){
				var selectedLi = $("#queryUserUl li:last");
				selectedLi.addClass("liSelected");
				curLi.removeClass("liSelected");
				li_index_total=$("#queryUserUl").children().length;
			}else{
				var prevLi = curLi.prev();
				curLi.removeClass("liSelected");
				prevLi.addClass("liSelected");
				li_index_total--;
			}
		}
		old_requestUser_total = $(".liSelected a").text().trim();
		$("#requestUser").val($(".liSelected a").text().trim());
		var tempValue = parseInt(li_index_total/10);
		if(tempValue == scoll_change_old)
			handleMouseOver = true;
		else
			handleMouseOver = false;
		scoll_change_old = tempValue;
		$("#queryUserDiv")[0].scrollTop = tempValue*220;
	}
}

function downMove(){
	if($("#queryUserDiv").is(":visible")){
		var curLi = $(".liSelected");
		if(curLi.length == 0){
			var selectedLi = $("#queryUserUl li:first");
			selectedLi.addClass("liSelected");
		}else{
			var userId = parseInt($("#queryUserUl li:last span").text().trim());
			var curUserId = parseInt($(".liSelected span").text().trim());
			if(curUserId == userId){
				var selectedLi = $("#queryUserUl li:first");
				selectedLi.addClass("liSelected");
				curLi.removeClass("liSelected");
				li_index_total=0;
			}else{
				var nextLi = curLi.next();
				curLi.removeClass("liSelected");
				nextLi.addClass("liSelected");
				li_index_total++;
			}
		}
		old_requestUser_total = $(".liSelected a").text().trim();
		$("#requestUser").val($(".liSelected a").text().trim());
		var tempValue = parseInt(li_index_total/10);
		if(tempValue == scoll_change_old)
			handleMouseOver = true;
		else
			handleMouseOver = false;
		scoll_change_old = tempValue;
		$("#queryUserDiv")[0].scrollTop = tempValue*220
	}
}



function removeBackgroudColor(event){
	if($.browser.msie){
		$(event.srcElement).removeClass('liSelected');
	}else{
		$(event.target).removeClass('liSelected');
	}
}

function setBackgroudColor(event){
	if(handleMouseOver){
		$(".liSelected").removeClass("liSelected");
		if($.browser.msie){
			$(event.srcElement).parent().addClass('liSelected');
			li_index_total = parseInt($(event.srcElement).attr('id'));
		}else{
			$(event.target).parent().addClass('liSelected');
			li_index_total = parseInt($(event.target).attr('id'));
		}
	}
}
	
function handleEnterEvent(){
	if($("#queryUserDiv").is(":visible") && $(".liSelected").length > 0){
		var index = parseInt($(".liSelected a").attr("id"));
		fillUserInfo(index);
		return false;
	}
}

function handleSubmit(){
	if(validateInput())
		document.getElementById("incForm").submit();
}

 function validateInput(){
 	var finalReslut = true;
 	var description = $("#description").val();
 	if(description.length > 20000){
 		$("#descriptionTip").attr("class","onError");
		$("#descriptionTip").text("详细描述不能超过20000字符");
		finalReslut = false;
 	}
 	var incidentType = $("#incidentType").val();
 	if(incidentType.replace(/(^\s*)|(\s*$)/g, "")==''){
 		$("#incidentTypeTip").attr("class","onError");
		$("#incidentTypeTip").text("工单类型不能为空");
		finalReslut = false;
 	}
 	return finalReslut;
 }
 
 function selectRequestUser(){
 	selectedField_total = 'requestUser';
    var url = "/itsm/common/userQuery.do?selectOne=1&status=submit&enter=enter&auto=Y";
   // var s = window.open(url, "", "height=420, width=1100, top=260, left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
    tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}
