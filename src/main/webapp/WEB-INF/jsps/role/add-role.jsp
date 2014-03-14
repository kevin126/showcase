<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<%@include file="../common/commonHeader.jsp"%>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><s:text name="common.product.title" />
		</title>
		<link href="<%=request.getContextPath()%>/css/global.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"
			rel="stylesheet" type="text/css" />
		<%@include file="../common/commonJs.jsp"%>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/jQuery1.4.2.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/dialog_popup/lanrentuku.js"></script>
		<link
			href="<%=request.getContextPath()%>/js/dialog_popup/css/Popup.css"
			rel="stylesheet" type="text/css" />
			<script src="<%=request.getContextPath()%>/js/apex/setting/RoleFunction.js"></script>
		<script type="text/javascript">
			$(document).ready(function(){
  				$("dl").mouseover(function(){
  				$("dt:last", this).show();
  			});
  				$("dl").mouseout(function(){
  				$("dt:last", this).hide();
  			});
		});
		function check(){
  				if($("#roleName").val()==null||$("#roleName").val().trim()==""){
  					$("#errNone").show();
  					$("#roleName").select();
  					return false;
  				}else{
  					$("#errNone").hide();
  				}
  				if($("#roleName").val().length>100){
  					$("#roleName").select();
  					$("#errLength").show();
  					return false;
  				}else
  				{
  					$("#errLength").hide();
  				}
  				if($("#roleDiscription").val().length>255){
  					$("#roleDiscription").select();
  					$("#errMemoLength").show();
  					return false;
  				}else{
  					$("#errMemoLength").hide();
  				}
  			}
  			function checkRoleName(){
  				if($("#roleName").val()==null||$("#roleName").val().trim()==""){
  					$("#roleName").select();
  					$("#errNone").show();
  				}else{
  					$("#errNone").hide();
  				}
  			}
  			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#roleMgt").addClass("on_this");
			}
</script>

	</head>

	<body onload="init()">
		<div id="ceng1" style="display: none">
			dd
		</div>
		<%@include file="../common/new_topMenu.jsp"%>
		<div class="height2px"></div>
		<div class="main_w wai_border">
			<div class="main white_border">
			<form action="<%=request.getContextPath()%>/role/role!addRoleOrUpdateRole.action?roleId=<s:property value="role.id"/>" method="post" onsubmit="return check()">
			<input type="hidden" name="role.appName" value="<s:property value="appName"/>" />
			<input type="hidden" name="role.id" value="<s:property value="role.id"/>"/>
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="left" valign="top">
							<%@ include file="../common/systemLeftOperatorItems.jsp"%>
						</td>
						<td width="100%" align="left" valign="top">
							<div class="works_search left_margin8px all_border no_bor_bott">

								<div class="work_ss_title white_border">
									<h1 class="mokuai_ss"></h1>
									<h2 class="works_ss_ge"></h2>
									<h3>
										<s:text name="common.product.currentlocation" />
										<s:text name="common.product.systemtitle" /> >> 角色设定 >> 添加角色
									</h3>
								</div>
								<div class="all_space"></div>
								<div class="workrep_content">

									<div class="gongzuoqu_footbg2 white_border">
										<div class="lingyong_sm">
											<h1>
												<div class="rep_biaoti">
													<img
														src="<%=request.getContextPath()%>/images/tongyi/i_r2_c22.jpg"
														width="59" height="59" />
												</div>
												<div class="dawem_bt">
													<dt>
														<img
															src="<%=request.getContextPath()%>/images/tongyi/w_r3_c42.jpg"
															height="25" />
													</dt>
													<dt class="shuoming_tu">
														说明：对系统中的各种角色进行管理，不同的角色对应不同的权限！
													</dt>
												</div>

											</h1>

										</div>
									</div>
								</div>
							</div>

							<div class="works_search left_margin8px all_border">
								<div class="works_ss_jieguo white_border">
									<div class="works_ss_tiaojian">
										<div style="text-align: center;" class="add_work_od">

											<ul>
												<li class="add_s_jiao">
													角色名称：
												</li>
												<li>
													<input type="text"
														onclick="document.getElementById('errNone').style.display='none'"
														onblur="checkRoleName()"
														size="22" class="all_input inp_wid360" id="roleName" name="role.roleName" value="<s:property value="role.roleName"/>"/>
													&nbsp;
												</li>
												<li style="display: none; margin: 4px 0 0" id="errNone">
													<div class="form_Error">
														<h1>
															请输入角色名称！
														</h1>
													</div>
												</li>
												<li style="display: none; margin: 4px 0 0" id="errLength">
													<div class="form_Error">
														<h1>
															角色名称不能超过100个字符！
														</h1>
													</div>
												</li>
												<li>
													<i>请尽量使用简短的名称，不能超过100个字符！</i>
												</li>
											</ul>
											<ul>

												<li class="add_s_jiao">
													描述：
												</li>
												<li>
													<textarea cols="90" rows="4" class=" all_textarea" 
													onclick="document.getElementById('errMemoLength').style.display='none'"
														style="width: 680px; height: 60px" name="role.roleDescription" id="roleDiscription" ><s:property value="role.roleDescription"/></textarea>
												</li>
												
												<li style="display: none; margin: 4px 0 0" id="errMemoLength">
													<div class="form_Error">
														<h1>
															角色描述不能超过255个字符！
														</h1>
													</div>
												</li>
												<li>
													<i>对角色进行描述，不能超过255个字符！</i>
												</li>
											</ul>
											<ul>
												<li class="add_s_jiao">
													权限设定：
												</li>

												<li>
													<table border="0" cellspacing="0" cellpadding="0">
														<tr>
															<td valign="top">
															<s:set name="num" value="0"/>
																<s:iterator value="permissionList" status="rowStatus">
																	<s:if test="#rowStatus.index%2==0">
																		<div class="jiaosekuai">
																			<!-- 只显示分组 -->
																			<s:if test="parentPermission==null">
																				<div class="jiaok_tit">
																					<h1></h1>
																					<h2>
																						<s:property value="permissionName" />
																					</h2>
																					<h3>
																						<input type="checkbox"
																							onclick="selectAllSubPermission(this,'<s:property value="actionId"/>')" />
																						&nbsp;全选
																					</h3>
																					<h5></h5>
																				</div>
																				<div class="jiao_list" id="<s:property value="actionId"/>">
																					<div class="jiao_list_k">
																						<div class="jiao_list_li">
																							<s:iterator value="sortSubPermissions"
																								status="subPermissionsStatus" var="permission">
																								<s:set name="num" value="#num+1"/>
																								<dl>
																									<dt>
																										<input name="permissionActionIdsOne"
																											type="checkbox"
																											value="<s:property value="actionId"/>" <s:iterator value="role.perms" var="perm">
																												<s:if test="#permission.actionId==#perm.actionId"> checked</s:if>
																											 </s:iterator>/>
																									</dt>
																									<dt class="tz">
																										&nbsp;
																										<s:property value="permissionName" />
																									</dt>

																									<dt style="display: none">
																										<a class="r_help"
																											title="<s:property value="permissionName"/>"
																											id="H<s:property value="#num"/>"
																											href="javascript:showPrompt('#H<s:property value="#num"/>', '<s:property value="permissionName"/>', '<s:property value="permissionDescription"/>','callback')"></a>
																									</dt>
																								</dl>
																							</s:iterator>
																						</div>
																					</div>
																				</div>
																			</s:if>
																		</div>
																	</s:if>
																</s:iterator>
															</td>
															<td valign="top">
																<s:iterator value="permissionList" status="rowStatus">
																	<s:if test="#rowStatus.index%2==1">
																		<div class="jiaosekuai left_margin8px">
																			<!-- 只显示分组 -->
																			<s:if test="parentPermission==null">
																				<div class="jiaok_tit">
																					<h1></h1>
																					<h2>
																						<s:property value="permissionName" />
																					</h2>
																					<h3>
																						<input type="checkbox"
																							onclick="selectAllSubPermission(this,'<s:property value="actionId"/>')" />
																						&nbsp;全选
																					</h3>
																					<h5></h5>

																				</div>
																				<div class="jiao_list"  id="<s:property value="actionId"/>">
																					<div class="jiao_list_k">
																						<div class="jiao_list_li">
																							<s:iterator value="sortSubPermissions"
																								status="subPermissionsStatus" var="permission">
																								<s:set name="num" value="#num+1"/>
																								<dl>
																									<dt>
																										<input name="permissionActionIdsTwo"
																											type="checkbox"
																											value="<s:property value="actionId"/>" <s:iterator value="role.perms" var="perm">
																												<s:if test="#permission.actionId==#perm.actionId"> checked</s:if>
																											 </s:iterator>/>
																									</dt>
																									<dt class="tz">
																										&nbsp;
																										<s:property value="permissionName" />
																									</dt>
																									<dt style="display: none">
																										<a class="r_help"
																											title="<s:property value="permissionName"/>"
																											id="H<s:property value="#num"/>"
																											href="javascript:showPrompt('#H<s:property value="#num"/>', '<s:property value="permissionName"/>', '<s:property value="permissionDescription"/>','callback')"></a>
																									</dt>

																								</dl>
																							</s:iterator>
																						</div>
																					</div>
																				</div>
																			</s:if>
																		</div>
																	</s:if>
																</s:iterator>

															</td>

														</tr>
													</table>
													<div class="bn_ceng">
														<div class="table_an tar_wid90b">
															<input type="submit"
																value="确 定" class="bn_css all_butt wen_center" name="" />
															<input type="button" onclick="window.history.back();"
																value="取 消" class="bn_css all_butt wen_center" name="" />
														</div>
													</div>
												</li>
											</ul>
										</div>
								<div class="space"></div>
									</div>
								</div>
							</div>
							<div class="works_search left_margin8px">
								<table width="100%" border="0" cellspacing="0" cellpadding="0">
									<tr>
										<td width="50%">
											&nbsp;
										</td>

										<td>
											&nbsp;
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>
				</table>
				</form>
			</div>
		</div>


		<%@include file="../common/bottom.jsp"%>
	</body>
</html>
