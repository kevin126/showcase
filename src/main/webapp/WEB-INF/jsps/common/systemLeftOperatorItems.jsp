<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="../common/commonHeader.jsp"%>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<div class="works_search all_border left_wid">
	<h2 id="t1" onclick="ShHi('t1','h1');">
		<div class="work_ss_title left_border">
			<h1 class="works_left1"></h1>
			<h2 class="works_ss_ge"></h2>
			<h3>
				<strong>系统管理</strong>
			</h3>
		</div>
	</h2>

	<ul class="TxtList" id="h1" style="display: block;">
		<div class="works_ss_content white_border left_padd">
			<li id="userMgt">
				<a
					href="<%=request.getContextPath()%>/user/user!list.action?menuId=s8&fromMenu=yes"
					title=""><span class="two_tu23">用户管理</span> </a>
			</li>
			<!-- 
			<li id="roleMgt">
				<a
					href="<%=request.getContextPath()%>/role/role!list.action?&menuId=s9"><span
					class="two_tu24">角色设定</span> </a>
			</li>
			<li id="userDeptMgt">
			<a
				href="<%=request.getContextPath()%>/userdept/user-dept!list.action?menuId=s10"><span
				class="two_tu25">部门设置</span> </a>
			</li>
			<li id="workGroupMgt">
				<a
					href="<%=request.getContextPath()%>/workgroup/work-group!list.action?menuId=s11"><span
					class="two_tu26">工作组管理</span> </a>
			</li>
			 -->
			<li id="mailConfigMgt">
				<a href="<%=request.getContextPath()%>/setting/mail-setting.action"
					title=""> <span class="two_tu27">邮件设置</span> </a>
			</li>
			<li id="passWordMgt">
				<a
					href="<%=request.getContextPath()%>/security/administrator!preModifyPasswd.action"
					title=""> <span class="two_tu20">修改密码</span> </a>
			</li>
		</div>
	</ul>
</div>















<script type="text/javascript">
	//选中时显示收缩图标
	function showSelestIcon(divId){
		$("#"+divId).show();
	}
	//隐藏所有ul标签
	function hiddenAllUl(){
	
		$("ul").each(function(){
			$(this).hide();
		});
		var elements=document.getElementsByTagName('div');
		for(var i=0;i<elements.length;i++){
			if(elements[i].className == 'logBlockOperationClose')
				elements[i].style.display='none';
		}
			
		//$("div .logBlockOperationClose").each(function(){
			//$(this).hide();
		//});	
	}
	//显示被选中时自己的ui标签
	function showSelfUl(ulId){
		$("#"+ulId).show();
	}
	//隐藏被选中时自己的ui标签
	function hiddenSelfUl(ulId){
		$("#"+ulId).hide();
	}
	//显示或收藏图标
	//divId选中时显示收缩起来的图标的div的id
	//ulId要显示的子菜单的ul标签id
	function showOrHiddenUl(divId,ulId){
		 	 hiddenAllUl();
			 showSelestIcon(divId);
	 		 showSelfUl(ulId);
	}
</script>