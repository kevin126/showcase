<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="uums" uri="/WEB-INF/tlds/mypage.tld"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<%@include file="../common/commonHeader.jsp"%>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><s:text name="common.product.title" /></title>
		<link href="<%=request.getContextPath()%>/css/global.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"
			rel="stylesheet" type="text/css" />
		<%@include file="../common/commonJs.jsp"%>
		<link href="../css/main.css" rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/tipswindown.css"
			rel="stylesheet" type="text/css" />
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/apex/common/tipswindown.js"></script>
		<script src="<%=request.getContextPath()%>/js/uums/role/role.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/tab.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/artDialog/artDialog.min.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/artDialog/skin.js"></script>
		<script language="javascript">
			function changeuser(roleId){
				var url="";
				if(null!=roleId && ""!=roleId){
					url="/uums/common/query-user.action?selectOne=2&exclude="+roleId+"&status=submit&enter=enter";
				}
				art.dialog.open(url, {limit: false,lock:true,title:'<b>选择用户</b>',width:'860px',height:'610px'});
			}
			
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#roleMgt").addClass("on_this");
			}
		</script>
	</head>

	<body onload="init()">
		<%@include file="../common/new_topMenu.jsp"%>
		<input type="hidden" id="roleId" value="<s:property value="role.id"/>" />
		<div class="height2px"></div>
		<div class="main_w wai_border">
			<div class="main white_border">
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="left" valign="top">
							<%@ include file="../common/systemLeftOperatorItems.jsp"%>
						</td>
						<td width="100%" align="left" valign="top">
							<div class="works_search left_margin8px all_border no_bor_bott">
								<div class="work_ss_title white_border white_border_gai">
									<h1 class="mokuai_ss"></h1>

									<h2 class="works_ss_ge"></h2>
									<h3>
										<s:text name="common.product.currentlocation" />
										<s:text name="common.product.systemtitle" /> >> 角色管理 >> 角色成员
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
															src="<%=request.getContextPath()%>/images/tongyi/e3_c42.jpg"
															height="25" />
													</dt>
													<dt class="shuoming_tu">
														说明：角色成员列表，可快速添加角色成员，删除角色成员。
													</dt>
												</div>
											</h1>
										</div>


										<!--<div class="tab_ceng_jiao">
                <div class="tabl_x"></div>
                <div class="tabl_y"></div>
                  
                  </div>-->
									</div>
								</div>
							</div>
							<div class="works_search left_margin8px all_border">
								<div class="works_ss_jieguo white_border white_border_gai">
									<!-- 删除确认 -->
									<div id="delete" style="display: none">
										<div style="height: 10px;"></div>
										<div class="warning" style="padding: 5px;">
											&nbsp;您是否确定删除所选的用户?
											<input id="deleteUserId" type="hidden" />
										</div>
										<div class="button_position">

											<table width="100%" height="28" border="0">
												<tr>
													<td width="48%" align="center">
														<a href="#" onclick="deleteRoleMember()"><div
																class="button_blue">
																确&nbsp;&nbsp;定
															</div> </a>
													</td>
													<td width="52%">
														<a href="#" onclick="hideDiv('delete')"><div
																class="button_gray">
																取&nbsp;&nbsp;消
															</div> </a>
													</td>
												</tr>
											</table>
										</div>
									</div>
									<div class="jiaose_gl_list">
										<div class="qianhui_border margin_10px">
											<div class="jssd_title white_border white_border_gai">

												<h3>
													<div class="g_titil">
														<strong><s:property value="role.roleName" />
														</strong>&nbsp;-&nbsp;共有
														<s:property value="userList.size()" />
														个用户
													</div>
												</h3>
												<div class="tit_right tit_right_gai">
													<div class="cmdb_cha">
														<div class="jiaosetop_margin6px">
															<input name="" type="button" class="all_butt add_jiaose"
																value="添加用户" onclick="changeuser(${role.id})" />
															<input name="" type="button" class="all_butt add_jiaose2"
																value="返回"
																onclick="window.location.href='<%=request.getContextPath()%>/role/role!list.action'" />
														</div>
													</div>
												</div>

											</div>
											<div class="qianhui_space"></div>
											<div class="liucheng_counter">
												<table width="100%" cellspacing="0" cellpadding="0"
													border="0">
													<tbody>
														<tr class="xbiao_th_new">
															<th width="4%">
																<div class="xbiao_th_w">
																	序号
																</div>
															</th>
															<th width="13%">
																<div class="xbiao_th_new_g"></div>

																<div class="xbiao_th_w">
																	<span class="pop_biaot">用户名</span>
																</div>
															</th>
															<th width="20%">
																<div class="xbiao_th_new_g"></div>
																<div class="xbiao_th_w">
																	<span class="pop_biaot">姓名</span>
																</div>
															</th>
															<th width="18%">
																<div class="xbiao_th_new_g"></div>
																<div class="xbiao_th_w">
																	<span class="pop_biaot">部门</span>
																</div>
															</th>
															<th width="9%">
																<div class="xbiao_th_new_g"></div>
																<div class="xbiao_th_w">
																	<span class="pop_biaot">工作组</span>
																</div>
															</th>

															<th width="13%">
																<div class="xbiao_th_new_g"></div>
																<div class="xbiao_th_w">
																	<span class="pop_biaot">邮件</span>
																</div>
															</th>
															<th width="10%">
																<div class="xbiao_th_new_g"></div>
																<div class="xbiao_th_w">
																	电话
																</div>
															</th>
															<th width="13%">
																<div class="xbiao_th_new_g"></div>
																<div class="xbiao_th_w">
																	<span class="pop_biaot">操作</span>
																</div>
															</th>
														</tr>
														<s:if test="userList!=null&&userList.size()>0">
															<s:iterator value="userList" status="rowStatus">
																<s:if test="#rowStatus.index%2==0">
																	<tr onmouseout="this.className='xbiao_tr'"
																		onmousemove="this.className='xbiao_tr_on'"
																		class="xbiao_tr">
																</s:if>
																<s:else>
																	<tr onmouseout="this.className='xbiao_tr2'"
																		onmousemove="this.className='xbiao_tr_on'"
																		class="xbiao_tr2">
																</s:else>
																<td>
																	<s:property value="#rowStatus.index+1" />
																</td>
																<td>
																	<s:property value="name" />
																</td>
																<td>
																	<s:property value="realName" />
																</td>
																<td>
																	<s:property value="depet.deptName" />
																</td>
																<td>
																	<s:property value="workGroup.workGroupName" />
																</td>

																<td>
																	<s:property value="mobile" />
																</td>
																<td>
																	<s:property value="mobile" />
																</td>
																<td>
																	<input type="button" class="all_butt chakan_bn"
																		value="删除" name="" onclick='deleteRole(<s:property value="id" />)'/>
																</td>
																</tr>
															</s:iterator>
														</s:if>
														<s:else>
															<tr class="tbody_tr1">
																<td colspan="8" class="tbody_td" align="center">
																	该角色没有用户！
																</td>
															</tr>
														</s:else>
													</tbody>
												</table>
												<div class="fenye_css">
													<div class="fenye_coun">
														<uums:page currentPage="${currentPage}"
															pageSize="${pageSize}" records="${records}"
															url="/uums/role/role!roleMembers.action" />
													</div>
												</div>
											</div>
										</div>
									</div>


								</div>
							</div>
							<div class="works_search left_margin8px">
								<table width="100%" border="0" cellspacing="0" cellpadding="0">

									<tr>
										<td width="12%" height="57" align="center">
											<img src="../images/help.jpg" />
										</td>
										<td width="88%">
											<div class="line">
												添加用户须知
											</div>
										</td>
									</tr>
									<tr>
										<td>
											&nbsp;
										</td>
										<td>
											<p>
												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;亲爱的<s:text name="common.product.systemtitle" />系统用户，欢迎使用向角色添加用户的功能。本功能提供了向已经存在角色添加角色成员方便快捷的通道。您只需要查询到相应的成员，选择要添加的成员之后，点击确定按钮，即可将用户添加到本角色。但是在使用该功能前，请务必确认以下两点：
												<br>
													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第一：请务必确认被添加的成员之前的角色，如果向角色“普通用户”或者“普通用户（资产审批）”中添加成员，被添加的成员将失去之前具有的角色。例如要把名为张三的用户添
													加到“普通用户”的角色之中，在添加之前，张三具有“系统管理员”的角色，如果您确认添加，添加之后，张三就不再具有“系统管理员”的角色，而具有“普通用户”的角色。


												
												<br>
													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第二：向“普通用户”或者“普通用户（资产审批）”之外的角色添加用户，被添加的用户将失去“普通用户”或者“普通用户（资产审批）”角色，转而只具有被添加的角色。例如张三在添加之前具有“普通用户”的角色，把他添加到“系统管理员”之中，添加后就只具有“系统管理员”的角色。


												
												<br>
													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总之，“普通用户”或者“普通用户（资产审批）”与其他角色不能共同存在，他们是互斥关系，“普通用户”与“普通用户（资产审批）”也是不能同时存在的。


												
											</p>
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>
				</table>
			</div>

		</div>
		<%@include file="../common/bottom.jsp"%>
	</body>
</html>
