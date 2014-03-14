<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.tekview.apex.itsm.server.system.Version"%>
<%@ taglib prefix="uums" uri="/WEB-INF/tlds/mypage.tld"%>
<%@include file="../common/commonHeader.jsp"%>
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
		<script
			src="<%=request.getContextPath()%>/js/apex/setting/DeptFunction.js"></script>
		<script
			src="<%=request.getContextPath()%>/js/apex/setting/showAndHidden.js"></script>
					<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/artDialog/artDialog.min.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/artDialog/skin.js"></script>
		<script type="text/javascript">
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#userDeptMgt").addClass("on_this");
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
							<div class="works_search left_margin8px all_border no_bor_bott">
								<div class="work_ss_title white_border">
									<h1 class="mokuai_ss"></h1>
									<h2 class="works_ss_ge"></h2>
									<h3>
										<s:text name="common.product.currentlocation" />
										<s:text name="common.product.systemtitle" /> >> 部门设置
									</h3>

								</div>
								<div class="all_space"></div>
								<div class="workrep_content">
									<div class="gongzuoqu_footbg2 white_border">
										<div class="lingyong_sm">
											<h1>
												<div class="rep_biaoti">
													<img
														src="<%=request.getContextPath()%>/images/tongyi/e_r2_c22.jpg"
														width="59" height="59" />
												</div>
												<div class="dawem_bt">
													<dt>
														<img
															src="<%=request.getContextPath()%>/images/tongyi/ww_r3_c42.jpg"
															height="25" />
													</dt>

													<dt class="shuoming_tu">
														说明：对系统中的各个部门进行管理，可添加、修改、删除部门，查看部门成员。
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

								<div class="works_ss_jieguo white_border">


									<!-- 操作失败后在这里显示错误信息 -->
									<div id="errorInforShow" style="display: none">
										<div style="height: 10px;"></div>
										<div class="warning" id="errorShowId" style="padding: 5px;">
											${genericErrorContent}
										</div>
										<div class="button_position">
											<table width="100%" height="28" border="0">
												<tr>
													<td>
														<a href="#" onclick="hideDiv('errorInforShow')">
															<div class="button_gray">
																确&nbsp;&nbsp;定
															</div> </a>
													</td>
												</tr>
											</table>
										</div>
									</div>
									<div id="delete" style="display: none">
										<div style="height: 10px;"></div>
										<div class="warning" style="padding: 5px;">
											&nbsp;您是否确定删除所选的部门?
											<input id="deleteDeptId" type="hidden" />
										</div>
										<div class="button_position">

											<table width="100%" height="28" border="0">
												<tr>
													<td width="48%" align="center">
														<a href="#" onclick="deleteDept()"><div
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
											<div class="jssd_title white_border">
												<h3>
													<div class="g_titil2">
														<strong>所有的部门</strong>&nbsp;-&nbsp;
														<s:if test="parentDept==null">
															<a
																href="<%=request.getContextPath()%>/userdept/user-dept!list.action">
																<strong><%=Version.getInstance().getCompany()%></strong>
															</a>
														</s:if>
														<s:else>
															<a
																href="<%=request.getContextPath()%>/userdept/user-dept!list.action">
																<strong><%=Version.getInstance().getCompany()%></strong>
															</a>
															<s:iterator value="parentDept" var="userDept">
																<span>&nbsp;&gt;&gt;&nbsp; <a
																	href="<%=request.getContextPath()%>/userdept/user-dept!list.action?parentId=<s:property value="id"/>">
																		<s:property value="deptName" /> </a> </span>
															</s:iterator>
														</s:else>
													</div>
												</h3>

											</div>



											<div class="qianhui_space"></div>
											<div class="liucheng_counter">
												<table width="100%" cellspacing="0" cellpadding="0"
													border="0">
													<tbody>
														<tr class="xbiao_th_new">
															<th width="3%">
																<div class="xbiao_th_w">
																	序号
																</div>
															</th>
															<th colspan="2">
																<div class="xbiao_th_new_g"></div>
																<div class="xbiao_th_w">
																	<span class="pop_biaot">部门名称</span>
																</div>
															</th>

															<th width="6%">
																<div class="xbiao_th_new_g"></div>
																<div class="xbiao_th_w">
																	<span class="pop_biaot">人数</span>
																</div>
															</th>
															<th width="56%">
																<div class="xbiao_th_new_g"></div>
																<div class="xbiao_th_w">
																	部门描述
																</div>
															</th>
															<th width="14%">
																<div class="xbiao_th_new_g"></div>
																<div class="xbiao_th_w">
																	<span class="pop_biaot">操作</span>
																</div>
															</th>
														</tr>
														<s:iterator value="userDeptList" var="deptVo"
															status="rowStatus">
															<tr
																<s:if test="#rowStatus.index%2==0">
																 onmouseout="this.className='xbiao_tr'"
																onmousemove="this.className='xbiao_tr_on'"
																class="xbiao_tr" 
																</s:if>
																<s:else>
																 onmouseout="this.className='xbiao_tr2'" onmousemove="this.className='xbiao_tr_on'" class="xbiao_tr2"
																</s:else>
																id="<s:property value="id"/>">
																<td>
																	<s:property value="#rowStatus.index+1" />
																</td>
																<td width="2%">
																	<s:if test="hasChild">
																		<img
																			src="<%=request.getContextPath()%>/images/tongyi/shu_1.jpg" />
																	</s:if>
																	<s:else>
																		<img
																			src="<%=request.getContextPath()%>/images/tongyi/shu_2.jpg" />
																	</s:else>

																</td>
																<td width="19%">
																	<a
																		href="<%=request.getContextPath()%>/userdept/user-dept!list.action?parentId=<s:property value="id" />" title="查看该部门下的子部门"><s:property
																			value="deptName" /> </a>
																</td>
																<td>
																	<a href="<%=request.getContextPath()%>/userdept/user-dept!showUser.action?id=<s:property value="id" />" title="查看部门成员"><s:property
																			value="count" />人</a>
																</td>
																<td>
																	<s:property value="deptMemo" />
																</td>
																<td>
																	<input type="button" class="all_butt edit_bm"
																		value="编辑"
																		onclick='editDept(<s:property value="id" />)' />
																	<input type="button" class="all_butt del_bm" value="删除"
																		onclick='deleteConform(<s:property value="id" />)' />
																</td>
															</tr>
														</s:iterator>
													</tbody>
												</table>
												<div class="fenye_css">

													<div class="fenye_coun">

														<uums:page currentPage="${currentPage}"
															pageSize="${pageSize}" records="${records}"
															url="/uums/userdept/user-dept!list.action" />

													</div>
												</div>
											</div>
										</div>
										<div class="">

											<div class="tianjia_zu margin_10px">
												<div class="tianjiao_z_nei top_bott_pad12px">
													<div class="zu_tit_left" id="addOrEditDeptTitleShowId">
														在
														<span class="fontGreen">
														<uums:label propertyValue="${userDept.deptName}"/> 
														</span>下创建子部门
													</div>
													<div class="d_coun_c">
														<script type="text/javascript">
			//非空验证
			
			function confirm(){
				if($("#deptNameId").val()==null||$("#deptNameId").val().trim()=="")
				{
					$("#deptNameId").select();
					$("#userDeptNameError").html("<span style='color:red'>请输入部门名称</span>");
					$("#userDeptNameError").show();
					return false;
				}else
				{
					$("#userDeptNameError").hide();
				}
				if($("#deptNameId").val().trim().length>100){
					$("#deptNameId").select();
					$("#userDeptNameError").html("<span style='color:red'>部门名称长度不能超过100个字符</span>");
					$("#userDeptNameError").show();
					return false;
				}
				else
				{
					$("#userDeptNameError").hide();
				}
				if($("#assUserName").val()==null||$("#assUserName").val().trim()=="")
				{
					$("#assUserName").select();
					$("#assUserNameError").html("<span style='color:red'>请输入资产审批负责人</span>");
					$("#assUserNameError").show();
					return false;
				}else
				{
					$("#assUserNameError").hide();
				}
				if($("#deptMemoId").val().trim().length>255){
					$("#deptMemoId").select();
					$("#userDeptMemoError").html("<span style='color:red'>部门名称长度不能超过255个字符</span>");
					$("#userDeptMemoError").show();
					return false;
				}
				else
				{
					$("#userDeptMemoError").hide();
				}
				
			}
			</script>
														<form
															action="<%=request.getContextPath()%>/userdept/user-dept!addOrUpdateUserDept.action?parentId=<s:property value="userDept.id" /> "
															method="post" id="addDeptFormId"
															onsubmit="return confirm()">
															<div style="text-align: center;" class="add_work_od">
																<ul>
																	<li class="add_s_biaot">
																		部门名称：
																	</li>
																	<li>
																		<input name="userDept.id" id="ediDeptId" type="hidden" />
																		<input type="text" size="22"
																			class="all_input inp_wid360" name="userDept.deptName"
																			id="deptNameId" />
																	</li>
																	<li id="userDeptNameError" style="display: none">
																		<div></div>
																	</li>

																</ul>
																<ul>
																	<li class="add_s_biaot">
																		资产审批负责人：
																	</li>
																	<li>
																		<input name="userDept.assUser.id" id="assUserId"
																			type="hidden" />
																		<input name="userDept.assUser.name" id="assUserName"
																			type="text" class="all_input inp_wid360" size="22"
																			onclick="addAssUser()" readonly="false" />
																	</li>
																	<li id="assUserNameError" style="display: none">
																		<div></div>
																	</li>
																</ul>
																<ul>
																	<li class="add_s_biaot">
																		描述：
																	</li>
																	<li>
																		<textarea name="userDept.deptMemo" id="deptMemoId"
																			cols="40" rows="5" class=" all_textarea inp_wid360"></textarea>
																	</li>
																	<li id="userDeptMemoError" style="display: none">
																		<div></div>
																	</li>
																</ul>


															</div>
															<div class="bn_ceng">
																<div class="table_an tar_wid90b"
																	style="margin-left: -50px; * margin-left: -150px">

																	<input type="submit" id="addDeptsubmitButton"
																		value="确 定" class="bn_css all_butt wen_center" />
																	<input type="button" value="取消"
																		class="bn_css all_butt wen_center"
																		onclick="cancleEditDept('<s:property value="userDept.deptName"/>')" />
																</div>
															</div>
														</form>
													</div>
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

		<%@ include file="../common/bottom.jsp"%>
	</body>
</html>
