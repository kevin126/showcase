<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<%@include file="../common/commonHeader.jsp" %>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title><s:text name="common.product.title"/></title>
	<link href="<%=request.getContextPath() %>/css/global.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath() %>/css/new_main.css" rel="stylesheet" type="text/css" />
	<%@include file="../common/commonJs.jsp"%>
	<link href="../css/top.css" rel="stylesheet" type="text/css" />
	<link href="../css/main.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/css/global.css" rel="stylesheet" type="text/css" />
	<link href="<%=request.getContextPath()%>/css/new_main.css"	rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="<%=contextPath%>/dwr/interface/SecurityService.js"></script>
	<script src="<%=request.getContextPath()%>/js/common/tableFocus.js"></script>
	<script src="<%=request.getContextPath()%>/js/apex/setting/RoleFunction.js"></script>
	<script>
		//改变应用
		function changeAppName(selectValue){
			window.location.href="<%=request.getContextPath()%>/permission/permission!list.action?appName="+selectValue;
		}
	</script>
</head>
<body>
	<%@include file="../common/new_topMenu.jsp"%>
	<div class="height2px"></div>
	<div class="main_w wai_border">
	  <div class="main white_border">
	    <table width="100%" border="0" cellspacing="0" cellpadding="0">
	    	<tr>
        		<td  align="left" valign="top"><jsp:include page="../common/systemLeftOperatorItems.jsp"></jsp:include></td>
        		<td width="100%" align="left" valign="top">
	        		<div class="works_search left_margin8px all_border">
				        <div class="work_ss_title white_border white_border_gai">
			              <h1 class="works_ss"></h1>
			              <h2 class="works_ss_ge"></h2>
			              <h3><s:text name="common.product.currentlocation"/><a href="<%=request.getContextPath() %>/user/user!list.action"title=""><s:text name="common.product.systemtitle"/></a> >><a href="#">系统管理</a></h3>
			            </div>
			            <div class="all_space"></div>
			            <div  class="works_ss_jieguo white_border">
			            	 <div class="settingBlock">
								<div class="assignInfo">
									<table width="100%" height="77" border="0" cellspacing="5">
										<tr>
											<td width="20%">
												<span class="f_16_blue">权限管理</span>
											</td>
											<td width="80%">
											</td>
										</tr>
										<tr>
											<td colspan="2">
												默认列出系统中所有的权限，不区分应用
											</td>
										</tr>
									</table>
								</div>
								<div class="settingContent">
									<div class="block1">
									<div class="assignOperation" id="showAllRoleDiscriptionId">
										应用系统：
										<select name="appName" onchange="changeAppName(this.value);">
											<option value="" <s:if test="appName==''">selected</s:if>>所有</option>
											<option value="oss" <s:if test="appName=='oss'">selected</s:if>>OSS</option>
											<option value="nm" <s:if test="appName=='nm'">selected</s:if>>NM</option>
										</select> &nbsp;&nbsp;
										<img src="../images/newui/bigTab/add.gif" class="img_m" />
										<a href="#" onclick="showAllRoleDiscription()">显示详细描述</a> &nbsp;&nbsp;
									</div>
									<div class="assignOperation" id="hideAllRoleDiscriptionId" style="display: none">
										应用系统：
										<select name="appName" onchange="changeAppName(this.value);">
											<option value="" <s:if test="appName==''">selected</s:if>>所有</option>
											<option value="oss" <s:if test="appName=='oss'">selected</s:if>>OSS</option>
											<option value="nm" <s:if test="appName=='nm'">selected</s:if>>NM</option>
										</select> &nbsp;&nbsp;
										<img src="../images/newui/bigTab/p.gif" class="img_m" />
										<a href="#" onclick="hideAllRoleDiscription()">隐藏详细描述</a>&nbsp;&nbsp;
									</div>
									<!-- 操作前请选择角色 -->
									<div id="selectPerItems" style="display: none">
										<div style="height: 10px;"></div>
										<div class="warning" style="padding: 5px;">
											&nbsp;每个角色至少需要具有一个权限，请选择角色的权限！
										</div>
										<div class="button_position">
											<table width="100%" height="28" border="0">
												<tr>
													<td>
														<a href="#" onclick="reSelectPer()">
															<div class="button_gray">
																确&nbsp;&nbsp;定
															</div> </a>
													</td>
												</tr>
											</table>
										</div>
									</div>
									<s:iterator value="permissionList">
										<!-- 只显示分组 -->
										<s:if test="parentPermission==null">
											<div class="assignBlock">
												<div class="assignGroupTitle">
													<div class="assignGroupName">
													&nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" 
															onclick="selectAllSubPermission(this,'<s:property value="actionId"/>')"/>
														<s:property value="permissionName"/>
													</div>
												</div>
												<div class="assignContent">
													<table width="100%" border="0" id="<s:property value="actionId"/>" cellspacing="0">
														<s:iterator value="subPermissions" status="subPermissionsStatus">
															<s:if test="#subPermissionsStatus.index%2==0">
																<tr class="tbody_tr1" onmouseover="this.className='tbody_tr_on'" onmouseout="this.className='tbody_tr1'">
																	<td valign="top" class="tbody_td" width="3%"; style="line-height:24px">
																		<div style="padding:7px 0 0;*padding:1px 0 0">
																		<input name="checkbox7" type="checkbox"
																			class="checkboxStyle" value="<s:property value="actionId"/>" />
																		</div>
																	</td>
																	<td  class="tbody_td" height="25" colspan="2" style="line-height:24px">
																		<strong class="font_blue"><s:property value="permissionName"/></strong>
																		<p style="display: none;padding-left:20px;" >
																			<s:property value="permissionDescription"/>
																		</p>
																	</td>
																</tr>
															</s:if>
															<s:else>
																<tr class="tbody_tr2" onmouseover="this.className='tbody_tr_on'" onmouseout="this.className='tbody_tr2'">
																	<td   valign="top" class="tbody_td" width="3%"  style="line-height:24px">
																		<div style="padding:7px 0 0;*padding:1px 0 0">
																		<input name="checkbox7" type="checkbox"
																			class="checkboxStyle" value="<s:property value="actionId"/>" />
																			</div>
																	</td>
																	<td  class="tbody_td" height="25" colspan="2"  style="line-height:24px">
																		<strong class="font_blue"><s:property value="permissionName"/></strong>
																		<p style="display: none;padding-left:20px;">
																			<s:property value="permissionDescription"/>
																		</p>
																	</td>
																</tr>
															</s:else>
														</s:iterator>
													</table>
												</div>
											</div>
										</s:if>
									</s:iterator>
								</div>
							</div>
			            </div>
			            
			            <div class="button_position" style="width: 400px;">
							<table width="100%" height="28" border="0">
								<!--系统出厂的角色值需要一个返回按钮就可以了-->
									<tr>
										<td width="50%" align="center">
											<a href="#" onclick="javascript:history.go(-1);">
												<div class="button_blue">
													返&nbsp;&nbsp;回
												</div> </a>
										</td>
									</tr>
							</table>
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