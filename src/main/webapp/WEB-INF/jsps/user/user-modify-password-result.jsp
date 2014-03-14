<%@ page language="java" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@include file="../common/commonHeader.jsp"%>
<%@page import="com.tekview.apex.itsm.server.system.Version"%>
<html>
	<head>
		<title><s:text name="common.product.title"/></title>
		<link href="<%=request.getContextPath()%>/css/all.css" rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/main.css"	rel="stylesheet" type="text/css" />
		<link rel="stylesheet" type="text/css" href="css/ext-all.css" />
		<link href="<%=request.getContextPath()%>/css/global.css" rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css" rel="stylesheet" type="text/css" />
		<%@include file="../common/commonJs.jsp"%>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/SecurityService.js'></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/security/rolemanage/AllRoleDlg.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/security/usermanage/AllWorkGroupPanel.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/email/EmailServerPanel.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/common/ApexConstants.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/common/EnumsConstants.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/EmailSetting.js"></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/EmailService.js'>
		</script>
		<script type="text/javascript">
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#userMgt").addClass("on_this");
			}
		</script>
	<body onload="init()">
		<%@include file="../common/new_topMenu.jsp"%>
		<div class="height2px"></div>
		<div class="main_w wai_border">
			<div class="main white_border">
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="left" valign="top">
							<jsp:include page="../common/systemLeftOperatorItems.jsp"></jsp:include>
						</td>
						<td width="100%" align="left" valign="top">
							<div class="works_search left_margin8px all_border">
						         <div class="work_ss_title white_border">
						           <h1 class="works_ss"></h1>
						           <h2 class="works_ss_ge"></h2>
						           <h3><a href="<%=request.getContextPath() %>/user/user!list.action" title=""><s:text name="common.product.currentlocation"/><s:text name="common.product.systemtitle"/></a> >> 修改密码</h3>
						         </div>
		   						<div class="all_space"></div>
		   						<div  class="works_ss_tiaojian white_border">
								<div class="cuowutishi">
					               <div class="err_info margin_left">
					                 <div class="err_nr" style="height: 100px;">
					                   <h1 class="beijing2">修改密码成功! 
					                   	<s:property value="newPassWord"/></h1>
					                 </div>
					               </div>
		      					</div>
					           <div class="bn_ceng">
					               <div class="table_an tar_wid90b">
					                	<input name="" type="button" class="gx_w_bn all_butt" value="返 回" onclick="window.location.href='<%=request.getContextPath()%>/user/user!list.action'"/>
					               </div>
					           </div>
		    				</div>
		  					</div>
		  				</td>
					</tr>
				</table>
			</div>
		</div>
		<%@include file="../common/bottom.jsp"%>
	</body>
</html>