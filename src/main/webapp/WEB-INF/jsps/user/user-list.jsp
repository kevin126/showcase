<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="uums" uri="/WEB-INF/tlds/mypage.tld"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<%@include file="../common/commonHeader.jsp"%>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><s:text name="common.product.title" /></title>
		<link href="<%=request.getContextPath()%>/css/global.css" rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"	rel="stylesheet" type="text/css" />
		<%@include file="../common/commonJs.jsp"%>
		<link href="../css/main.css" rel="stylesheet" type="text/css" />
		<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/js/dpicker/skin/WdatePicker.css" />
		<link href="<%=request.getContextPath()%>/css/revise.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/ShHi.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/dpicker/WdatePicker.js"></script>
		<script type="text/javascript" src="<%=contextPath%>/js/apex/setting/security/deptmanage/MultipleSelectDept.js"></script>
		<script type="text/javascript" src="<%=contextPath%>/js/apex/setting/security/workGroupManage/MultipleSelectWorkGroup.js"></script>
		<script src="<%=request.getContextPath()%>/js/apex/setting/setting.js"></script>
		<script type="text/javascript" src="<%=contextPath%>/dwr/interface/SecurityService.js"></script>
		<script>
		function getAllDept(id){
			var win= new MultipleSelectDept(id);
				win.show();
		}
		function getAllWorkGroup(id){
			var win = new MultipleSelectWorkGroup(id);
			win.show();
		}
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#userMgt").addClass("on_this");
			}
		function clearTxt(){
			$("#queryusername").val("");
			$("#queryuserrealName").val("");
			$("#queryusermail").val("");
			$("#queryuserdept").val("");
			$("#workGroupId").val("");
		}
	</script>
	</head>

	<body onload="init()">
		<%@include file="../common/new_topMenu.jsp"%>
		<div class="height2px"></div>
		<div class="main_w wai_border">
			<div class="main white_border">
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="left" valign="top">
							<%@include file="../common/systemLeftOperatorItems.jsp"%>
						</td>
						<td width="100%" align="left" valign="top">

							<div class="works_search left_margin8px all_border">
								<div class="work_ss_title white_border">
									<h1 class="works_ss"></h1>
									<h2 class="works_ss_ge"></h2>
									<h3>
										<s:text name="common.product.currentlocation" />
										<s:text name="common.product.systemtitle" />
										>> 用户管理
									</h3>
								</div>

								<div class="all_space"></div>

								<div class="works_ss_content white_border">
									<form
										action="<%=request.getContextPath()%>/user/user!list.action">
										<div class="works_ss_tiaojian">
											<div class="tiaojian_work_od">
												<ul>
													<li class="wo_s_biaot">
														用户名：
													</li>
													<li>
														<input name="name" type="text" maxlength="20"
															id="queryusername" size="22" class="all_input"
															value="<s:property value="name"/>" style="width:115px"/>
													</li>
													<li class="wo_s_biaot">
														姓名：
													</li>
													<li>
														<input name="realName" maxlength="20"
															id="queryuserrealName" type="text" size="12"
															class="all_input"
															value="<s:property value="realName"/>"  style="width:115px"/>
													</li>
													<li class="wo_s_biaot">
														邮件：
													</li>
													<li>
														<input name="mail" type="text" maxlength="50"
															id="queryusermail" size="12" class="all_input"
															value="<s:property value="mail"/>"  style="width:115px"/>
													</li>
													<!-- 
													<li class="wo_s_biaot">
														部门：
													</li>
													<li>
														<input name="depetName" readonly="true"
															onclick="getAllDept('queryuserdept')" type="text"
															id="queryuserdept" size="12" class="all_input"
															value="<s:property value="depetName"/>"  style="width:115px"/>
													</li>
													<li class="wo_s_biaot">
														工作组：
													</li>
													<li>
														<input name="workGroupName" readonly="true"
															onclick="getAllWorkGroup('workGroupId')" type="text"
															id="workGroupId" size="12" class="all_input"
															value="<s:property value="workGroupName"/>"  style="width:115px"/>
													</li>
													 -->

												</ul>
											</div>
											<div class="bn_ceng">
												<input type="submit" value="查 询" class="chaxun_bn all_butt" />&nbsp;&nbsp;&nbsp;
												<input type="button" value="重 置" class="gx_w_bn all_butt" onclick="clearTxt()"/>

											</div>
										</div>
									</form>
								</div>
							</div>

							<!-- infor -->
							<div id="delete" style="display: none">
								<div class="gd_t2">
									<div class="liuc2_tit bott_xub">
										<strong>确认</strong>
									</div>
								</div>
								<div style="text-align: center;" class="add_work_od">
									<h1>
										您确定要删除所选择用户吗?
									</h1>
								</div>
								<div class="bn_ceng">
									<div  class="add_work_od">
										<input type="button" onclick="deleteUserById()" value="确 定"
											class="gx_w_bn all_butt" />
										<input type="button" onclick="cacelDelete()" value="取 消"
											class="gx_w_bn all_butt" />
									</div>
								</div>
							</div>
							<!-- 不能自己删除自己 -->
							<!-- infor -->
							<div id="deleteMySelf" style="display: none">
								<div class="gd_t2">
									<div class="liuc2_tit bott_xub">
										<strong>警告</strong>
									</div>
								</div>
								<div style="text-align: center;" class="add_work_od">
									<h1>
										不能对自己进行该步操作！
									</h1>
								</div>
								<div class="bn_ceng">
									<div class="table_an tar_wid90b">
										<input type="button" onclick="cannotDeleteSelf()" value="确 定"
											class="gx_w_bn all_butt" />
									</div>
								</div>
							</div>
							<!-- 操作前请选择用户 -->
							<div id="selectUserItems" style="display: none">
								<div class="gd_t2">
									<div class="liuc2_tit bott_xub">
										<strong>请选择</strong>
									</div>
								</div>
								<div style="text-align: center;" class="add_work_od">
									<h1>
										请选择要实施该步操作的用户！
									</h1>
								</div>
								<div class="bn_ceng">
									<div  class="add_work_od">
										<input type="button" onclick="pleaseSelect()" value="确 定"
											class="gx_w_bn all_butt" />
									</div>
								</div>
							</div>

							<!-- 操作失败后在这里显示错误信息 -->
							<div id="errorInforShow" style="display: none">
								<div class="gd_t2">
									<div class="liuc2_tit bott_xub">
										<strong>错误</strong>
									</div>
								</div>
								<div style="text-align: center;" class="add_work_od">
									<div class="warning" id="errorShowId" >${genericErrorContent}</div>
									<h1>
										${genericErrorContent}
									</h1>
								</div>
								<div class="bn_ceng">
									<div class="add_work_od">
										<input type="button" onclick="reFlush()" value="刷 新"
											class="gx_w_bn all_butt" />
									</div>
								</div>
							</div>

							<!--重置密码确认  -->
							<div id="resetPWS" style="display: none">
								<div class="gd_t2">
									<div class="liuc2_tit bott_xub">
										<strong>确认</strong>
									</div>
								</div>
								<div style="text-align: center;" class="add_work_od">
									<h1>
										您确定要重置选中账号的密码吗？
									</h1>
								</div>
								<div class="bn_ceng">
									<div  class="add_work_od">
										<input type="button" onclick="doReSetPsw()" value="确 定"
													class="gx_w_bn all_butt" />
										<input type="button" onclick="cancleReSetPsw()" value="取 消"
											class="gx_w_bn all_butt" />
									</div>
								</div>
							</div>

							<!-- 重置密码出错提示信息 -->
							<div id="setPswErrorInforShow" style="display: none">
								<div class="gd_t2">
									<div class="liuc2_tit bott_xub">
										<strong>错误</strong>
									</div>
								</div>
								<div style="text-align: center;" class="add_work_od" id="setPswErrorShowId">
									<h1>
										<s:property value="genericErrorContent" />
									</h1>
								</div>
								<div class="bn_ceng">
									<div class="add_work_od">
										<input type="button" onclick="doSure()" value="确定"
													class="gx_w_bn all_butt" />
									</div>
								</div>
							</div>
							<div class="works_search left_margin8px all_border top_margin8px">
								<div class="work_ss_title white_border">
									<h1 class="works_ss"></h1>
									<h2 class="works_ss_ge"></h2>
									<h3>
										用户列表
									</h3>
									<div class="tit_right tit_right_gai">
										<div class="cmdb_cha">
											<input type="button" id="addUserBtnId" value="添加用户" class="nb_26" />
											<div class="kken"></div>
											<input type="button" id="batchImportUserId" value="批量添加用户" class="nb_25" />
											<div class="kken"></div>
											<input type="button" onclick="synNmUser();" value="同步NM用户" class="nb_26" style="width:100px;"/>
											<div class="kken"></div>
											<input type="button" onclick="synOssUser();" value="同步OSS用户" class="nb_26" style="width:100px;"/>
											<div class="kken"></div>
											<input type="button" id="deleteUserConformBtn" value="删除用户" class="nb_20" />
											<div class="kken"></div>
											<!-- 
											<input type="button" id="enableSetPSWBtn" value="重置密码" class="nb_21" />
											<div class="kken"></div>
											<input type="button" id="modifyPSWBtn" value="修改密码" class="nb_22" />
											<div class="kken"></div>
											 -->
											<input type="button" id="startEnAbleUserBtn" value="启用用户" class="nb_23" />
											<div class="kken"></div>
											<input type="button" id="disAbleUserBtn" value="禁用用户" class="nb_24" />
										</div>
									</div>
								</div>
								<div id="jqueryUserListId">
									<div class=" all_space"></div>
									<div class="works_ss_content white_border_tb">
										<div class="works_ss_jieguo">
											<table cellspacing="0" cellpadding="0" border="0"
												width="100%">
												<tbody>
													<tr class="biao_lie">
														<th width="2%" class="biao_th_first">
															<div class="">
																<input type="checkbox" onclick="selectAllUser()"
																	name="checkbox6" id="selectAllUser" />
															</div>
														</th>
														<th width="3%">
															<div class="biao_lie_ge"></div>
															<div class="biao_lie_wen">
																序号
															</div>
														</th>
														<th width="20%">
															<div class="biao_lie_ge"></div>

															<div class="biao_lie_wen">
																用户名
															</div>
														</th>
														<th width="20%">
															<div class="biao_lie_ge"></div>
															<div class="biao_lie_wen">
																姓名
															</div>
														</th>
														<!-- 
														<th width="11%">
															<div class="biao_lie_ge"></div>
															<div class="biao_lie_wen">
																部门
															</div>
														</th>
														<th width="9%">
															<div class="biao_lie_ge"></div>
															<div class="biao_lie_wen">
																工作组
															</div>
														</th>
														 -->
														<th width="20%">
															<div class="biao_lie_ge"></div>
															<div class="biao_lie_wen">
																邮件
															</div>
														</th>
														<th width="15%">
															<div class="biao_lie_ge"></div>
															<div class="biao_lie_wen">
																电话
															</div>
														</th>
														<!-- 
														<th width="15%">
															<div class="biao_lie_ge"></div>
															<div class="biao_lie_wen">
																最后登录时间
															</div>
														</th>
														 -->
														<th>
															<div class="biao_lie_ge"></div>
															<div class="biao_lie_wen">
																状态
															</div>
														</th>
													</tr>

													<%
																request.setAttribute("loginUserId", request.getSession()
																.getAttribute("com.tekview.apex.ca.userId"));
													%>
													<s:if test="userList!=null && userList.size()>0">
														<s:iterator value="userList" var="user"
															status="userStatus">
															<tr
																<s:if test="#userStatus.index%2==0">
																	onmouseout="this.className='xbiao_tr'" 
																	onmousemove="this.className='xbiao_tr_on'" 
																	class="xbiao_tr"  
																</s:if>
																<s:else>
																	onmouseout="this.className='xbiao_tr2'" 
																	onmousemove="this.className='xbiao_tr_on'" 
																	class="xbiao_tr2"
																</s:else>>
																<td>
																	<!-- 前一个是变量用户的id，后一个是当前登陆者的id，目的是用来删除用户时判断是否自己删除自己 -->
																	<input type="checkbox"
																		value="<s:property value="id" /> ,${loginUserId}" />
																</td>
																<td>
																	<s:property value="#userStatus.index+1" />
																</td>

																<td>
																	<a
																		href="<%=request.getContextPath()%>/user/user!view.action?user.id=<s:property value="id"/>">
																		<s:property value="name" />&nbsp; </a>
																</td>
																<td>
																	<a
																		href="<%=request.getContextPath()%>/user/user!view.action?user.id=<s:property value="id"/>">
																		<s:property value="realName" /> </a>
																</td>
																<!-- 
																<td>
																	<s:property value="depet.deptName" />&nbsp;
																</td>
																<td>
																	<s:property value="workGroup.workGroupName" />&nbsp;
																</td>
																 -->
																<td>
																	<s:property value="mail" />&nbsp;

																</td>
																<td>
																	<s:property value="mobile" />&nbsp;
																</td>
																<!-- 
																<td>
																	<s:property value="lastLoginTimeStr" />&nbsp;
																</td>
																 -->
																<td>
																	<s:if test="enabled==1">
																		<span class='green_box'>启用</span>
																	</s:if>
																	<s:else>
																		<span class='yellow_box'>禁用</span>
																	</s:else>
																</td>
															</tr>
														</s:iterator>
													</s:if>
													<s:else>
													<tr>
														<td colspan="10">
														<center>
															<br>
															对不起，没有找到符合条件的记录！
														</center>
														</td>
													</tr>
														
													</s:else>
												</tbody>
											</table>
											<div class="fenye_css">
												<div class="fenye_coun">
													<uums:page currentPage="${currentPage}"
														pageSize="${pageSize}" records="${records}"
														url="/uums/user/user!list.action" />
												</div>
											</div>
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
