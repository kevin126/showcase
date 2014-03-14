<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="../common/commonHeader.jsp"%>
<%@ taglib prefix="uums" uri="/WEB-INF/tlds/mypage.tld"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><s:text name="common.product.title" /></title>
		<link href="<%=request.getContextPath()%>/css/global.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"
			rel="stylesheet" type="text/css" />
		<%@include file="../common/commonJs.jsp"%>
		<link href="../css/main.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/tab.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/artDialog/artDialog.min.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/artDialog/skin.js"></script>
		<script
			src="<%=request.getContextPath()%>/js/uums/workGroup/workGroup.js"></script>
		<script language="javascript">
			function changeuser(workGroupId){
				var url="";
					if(null!=workGroupId && ""!=workGroupId){
						url="/uums/common/query-user.action?selectOne=2&exclude="+workGroupId+"&status=submit&enter=enter";
					}
				art.dialog.open(url, {limit: false,lock:true,title:'<b>选择用户</b>',width:'860px',height:'610px'});
			}
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#workGroupMgt").addClass("on_this");
			}
		</script>
	</head>

	<body onload="init()">
		<%@include file="../common/new_topMenu.jsp"%>
		<input type="hidden" id="workGroupId"
			value="<s:property value="workGroup.id" />" />
		<div class="height2px"></div>
		<div class="main_w wai_border">
			<div class="main white_border">
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="left" valign="top">
							<%@include file="../common/systemLeftOperatorItems.jsp"%>
						</td>
						<td width="100%" align="left" valign="top">
							<div class="works_search left_margin8px all_border no_bor_bott">
								<div class="work_ss_title white_border white_border_gai">
									<h1 class="mokuai_ss"></h1>

									<h2 class="works_ss_ge"></h2>
									<h3>
										<s:text name="common.product.currentlocation" />
										<s:text name="common.product.systemtitle" />
										>> 工作组管理 >> 工作组成员
									</h3>
								</div>
								<div class="all_space"></div>
								<div class="workrep_content">
									<div class="gongzuoqu_footbg2 white_border">
										<div class="lingyong_sm">

											<h1>
												<div class="rep_biaoti">
													<img
														src="<%=request.getContextPath()%>/images/tongyi/e_r2_c222.jpg"
														width="59" height="59" />
												</div>
												<div class="dawem_bt">
													<dt>
														<img
															src="<%=request.getContextPath()%>/images/tongyi/ww_r3_c422.jpg"
															height="25" />
													</dt>
													<dt class="shuoming_tu">
														说明：工作组成员列表，可快速添加工作组成员，删除工作组成员。
													</dt>
												</div>
											</h1>
										</div>
									</div>
								</div>
							</div>
							<div class="works_search left_margin8px all_border">
								<div class="works_ss_jieguo white_border">
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
														<a href="#" onclick="deleteWorkGroupMember()"><div
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
														<strong><s:property
																value="workGroup.workGroupName" /> </strong>&nbsp;-&nbsp;共有
														<s:property value="userList.size()" />
														个用户
													</div>
												</h3>
												<div class="tit_right tit_right_gai">
													<div class="cmdb_cha">
														<div class="jiaosetop_margin6px">
															<input name="" type="button" class="all_butt add_jiaose"
																value="添加用户"
																onclick="changeuser(<s:property value="workGroup.id" />)" />
															<input name="" type="button" class="all_butt add_jiaose2"
																value="返回"
																onclick="window.location.href='<%=request.getContextPath()%>/workgroup/work-group!list.action'" />
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
															<s:iterator value="userList" var="user"
																status="rowStatus">
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
																	<a href="mailto:<s:property value="mail" />"><s:property
																			value="mail" />
																	</a>
																</td>
																<td>
																	<s:property value="mobile" />
																</td>
																<td>
																	<input type="button" class="all_butt chakan_bn"
																		value="删除" name=""
																		onclick="confirmDeleteWorkGroupMember(<s:property value="id"/>)" />
																</td>
																</tr>
															</s:iterator>
														</s:if>
														<s:else>
															<tr class="tbody_tr1">
																<td colspan="8" class="tbody_td" align="center">
																	该工作组没有用户！
																</td>
															</tr>
														</s:else>
													</tbody>
												</table>
												<div class="fenye_css">
													<div class="fenye_coun">
														<uums:page currentPage="${currentPage}"
															pageSize="${pageSize}" records="${records}"
															url="/uums/workgroup/work-group!showMember.action" />

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
			</div>

		</div>
		<%@ include file="../common/bottom.jsp"%>
	</body>
</html>
