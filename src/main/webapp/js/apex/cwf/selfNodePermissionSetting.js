
/**
 * 显示并加载待选择的用户，如果之前已经加载了，就只显示
 */
function showAndLoadUsers(){
	$("#userSelected").load("/itsm/cwf/loadSelectedUser.do?method=getUserList",function(){
			setUserListSelect();
			$("#userSelected").show();
			$("#roleSelected").empty();
			$("#roleSelected").hide();
			$("#workGroupSelected").empty();
			$("#workGroupSelected").hide();
		});
}

/**
 * 显示并加载待选择的角色，如果之前已经加载了，就只显示
 */
function showAndLoadRoles(){
	$("#roleSelected").load("/itsm/cwf/loadSelectedRole.do?method=getRoleList",function(){
			setRoleListSelect();
			$("#roleSelected").show();
			$("#userSelected").empty();
			$("#userSelected").hide();
			$("#workGroupSelected").empty();
			$("#workGroupSelected").hide();
		});  
}


/**
 * 显示并加载待选择的工作组，如果之前已经加载了，就只显示
 */
function showAndLoadWorkGroups(){
	$("#workGroupSelected").load("/itsm/cwf/loadSelectedWorkGroup.do?method=getWorkGroupList",function(){
			setWorkGroupListSelect();
			$("#workGroupSelected").show();
			$("#userSelected").empty();
			$("#userSelected").hide();
			$("#roleSelected").empty();
			$("#roleSelected").hide();
		});
   
}

function selectObj(obj,index){
	var id = $(obj).parent().next().children().val();
	var name =  $(obj).parent().next().next().html();
	var list = $(".yonghu_le")[index];
	if($(obj).attr("checked")==true){
		if($(list).children(".no_date").length !=0){//第一次增加数据
			$(list).empty();
			var outBuf = new Array();
			outBuf.push("<ul><li class='qx_ul_li'>");
			outBuf.push("<span>"+name+"</span>");
			outBuf.push("<input type='hidden' value='"+id+"' />");
			outBuf.push("<em><input type='button' class='del_rlr all_butt' onclick='deleteFixObj(this,"+index+")'/></em>");
			outBuf.push("</li></ul>");
			$(list).append(outBuf.join(""));
		}else{
			var existedIds = new Array();
			$(list).find("input[type='hidden']").each(function(){
				existedIds.push($(this).val());
			});
			if(isExist(id,existedIds))//选择的用户已经存在了
				return;
			var outBuf = new Array();
			outBuf.push("<li class='qx_ul_li'>");
			outBuf.push("<span>"+name+"</span>");
			outBuf.push("<input type='hidden' value='"+id+"' />");
			outBuf.push("<em><input type='button' class='del_rlr all_butt' onclick='deleteFixObj(this,"+index+")'/></em>");
			outBuf.push("</li>");
			$(list).children("ul").append(outBuf.join(""));
		}
	}else{
		if($(list).find("input[type='hidden']").length == 1){//删除最后一个用户
			var msg ="";
			if(0==index){
				msg="暂无数据！请点击添加用户";
			}else if(1==index){
				msg="暂无数据！请点击添加角色";
			}else if(2==index){
				msg="暂无数据！请点击添加工作组";
			}
			$(list).empty();
			var outBuf = new Array();	
			outBuf.push("<div class='no_date'>");
			outBuf.push("<div class='no_date_nei'>");
			outBuf.push("<div class='no_tishi'>"+msg+"</div></div></div>");
			$(list).append(outBuf.join(""));
		}else if($(list).find("input[type='hidden']").length > 1){//删除的不是最后一个用户
			$(list).find("input[type='hidden']").each(function(){
				if($(this).val()==id)
					$(this).parent().remove();
			})
		}
	}
	
}

function deleteFixObj(obj,index){
	if($(obj).parent().parent().parent().children().length == 1){//删除最后一个用户
		var msg ="";
		if(0==index){
			msg="暂无数据！请点击添加用户";
		}else if(1==index){
			msg="暂无数据！请点击添加角色";
		}else if(2==index){
			msg="暂无数据！请点击添加工作组";
		}
		var temp = $(obj).parent().parent().parent().parent();
		temp.empty();
		var outBuf = new Array();	
		outBuf.push("<div class='no_date'>");
		outBuf.push("<div class='no_date_nei'>");
		outBuf.push("<div class='no_tishi'>"+msg+"</div></div></div>");
		temp.append(outBuf.join(""));
	}else{
		$(obj).parent().parent().remove();
	}
	var objId= $(obj).parent().prev().val();
	if(0==index && $("#userSelected").is(":visible")){
		$("#userSelected table").find("input[type='checkbox']").each(function(){
			var userId = $(this).parent().next().children().val();
			if(userId == objId)
				$(this).attr("checked",false);
		});
		return;
	}
	if(1==index && $("#roleSelected").is(":visible")){
		$("#roleSelected table").find("input[type='checkbox']").each(function(){
			var roleId = $(this).parent().next().children().val();
			if(roleId == objId)
				$(this).attr("checked",false);
		});
		return;
	}
	if(2==index && $("#workGroupSelected").is(":visible")){
		$("#workGroupSelected table").find("input[type='checkbox']").each(function(){
			var workGrouId = $(this).parent().next().children().val();
			if(workGrouId == objId)
				$(this).attr("checked",false);
		});
		return;
	}
}

/**
 * 加载完用户后，使已选用户和待选用户的选择情况保证一致
 */
function setUserListSelect(){
	var userList = $(".yonghu_le")[0];
	if(0==$("#userSelected table .no_date").length){//只要当选中的用户和待选的用户都不为空的时候
		var ids = new Array();
		$(userList).find("input[type='hidden']").each(function(){
			ids.push($(this).val());
		});
		$("#userSelected table").find("input[type='checkbox']").each(function(){
			var userId = $(this).parent().next().children().val();
			$(this).attr("checked",false);
			if(isExist(userId,ids)){
				$(this).attr("checked",true);
			}
		})
		
	}
}

/**
 * 加载完用户后，使已选角色和待选角色的选择情况保证一致
 */
function setRoleListSelect(){
	var roleList = $(".yonghu_le")[1];
	if(0==$("#roleSelected table .no_date").length){//只要当选中的用户和待选的用户都不为空的时候
		var ids = new Array();
		$(roleList).find("input[type='hidden']").each(function(){
			ids.push($(this).val());
		});
		$("#roleSelected table").find("input[type='checkbox']").each(function(){
			var userId = $(this).parent().next().children().val();
			$(this).attr("checked",false);
			if(isExist(userId,ids)){
				$(this).attr("checked",true);
			}
		})
		
	}
}

/**
 * 加载完用户后，使已选工作组和待选工作组的选择情况保证一致
 */
function setWorkGroupListSelect(){
	var workGroupList = $(".yonghu_le")[2];
	if(0==$("#workGroupSelected table .no_date").length){//只要当选中的用户和待选的用户都不为空的时候
		var ids = new Array();
		$(workGroupList).find("input[type='hidden']").each(function(){
			ids.push($(this).val());
		});
		$("#workGroupSelected table").find("input[type='checkbox']").each(function(){
			var userId = $(this).parent().next().children().val();
			$(this).attr("checked",false);
			if(isExist(userId,ids)){
				$(this).attr("checked",true);
			}
		})
		
	}
}

function saveTasknodePermission(){
	var tasknodePermission = {};
	var nodeName = $("#nodeName_hidden").val();
	tasknodePermission.nodeName = nodeName;
		
	var userList = $(".yonghu_le")[0];
	var userIds = "";
	$(userList).find("input[type='hidden']").each(function(){
		userIds=userIds+$(this).val()+";"
	});
	if(userIds !="")
		userIds = userIds.substring(0,userIds.length-1);
	tasknodePermission.userIds = userIds;
		
	var roleList = $(".yonghu_le")[1];
	var roleIds = "";
	$(roleList).find("input[type='hidden']").each(function(){
		roleIds=roleIds+$(this).val()+";"
	});
	if(roleIds !="")
		roleIds = roleIds.substring(0,roleIds.length-1);
	tasknodePermission.roleIds = roleIds;
		
	var groupList = $(".yonghu_le")[2];
	var groupIds = "";
	$(groupList).find("input[type='hidden']").each(function(){
		groupIds=groupIds+$(this).val()+";"
	});
	if(groupIds !="")
		groupIds = groupIds.substring(0,groupIds.length-1);
	tasknodePermission.groupIds = groupIds;
	
	CwfService.saveTaskNodePermission(tasknodePermission,{
		callback : function(taskNodePermissions){
				parent.taskNodePermissions_total = taskNodePermissions;
				art.dialog.close();
			},
		errorHandler : function(errorString, exception) {
			art.dialog({
				    content: exception.message,
				    yesFn: true
				});
		}
	})
}

/**
 * 判断id是否在ids数组中
 */
function isExist(id,ids){
	for(var i=0;i<ids.length;i++){
		if(id==ids[i])
			return true;
	}
	return false;
}