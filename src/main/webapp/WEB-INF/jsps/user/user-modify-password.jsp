<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8"
	contentType="text/html; charset=UTF-8 "%>
<%@include file="../common/commonHeader.jsp"%>
<%@page import="java.util.Calendar"%>
<%@page import="com.tekview.apex.itsm.server.system.Version"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><s:text name="common.product.title" /></title>
		<link href="<%=request.getContextPath()%>/css/main.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/global.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"
			rel="stylesheet" type="text/css" />
		<link rel="stylesheet" type="text/css" href="css/ext-all.css" />
		<%@include file="../common/commonJs.jsp"%>
		<script type='text/javascript'
			src='<%=request.getContextPath()%>/dwr/interface/SecurityService.js'></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/apex/setting/security/rolemanage/AllRoleDlg.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/apex/setting/security/usermanage/AllWorkGroupPanel.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/apex/setting/email/EmailServerPanel.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/apex/common/ApexConstants.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/apex/common/EnumsConstants.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/apex/setting/EmailSetting.js"></script>
		<script type='text/javascript'
			src='<%=request.getContextPath()%>/dwr/interface/EmailService.js'></script>
		<link type="text/css" rel="stylesheet"
			href="<%=request.getContextPath()%>/js/jquery/style/validator.css"></link>
		<script src="<%=request.getContextPath()%>/js/jquery/jquery_last.js"
			type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/js/jquery/formValidator.js"
			type="text/javascript" charset="UTF-8"></script>
		<script
			src="<%=request.getContextPath()%>/js/jquery/formValidatorRegex.js"
			type="text/javascript" charset="UTF-8"></script>
		<script
			src="<%=request.getContextPath()%>/js/jquery/validator/validateUser.js"
			type="text/javascript" charset="UTF-8"></script>
			<script type="text/javascript">
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#userMgt").addClass("on_this");
				//初始化时清空表单数据，防止浏览器的自动填表功能填充数据
				$("#useroldPassWord").val("");
				$("#usernewPassWord").val("");
				$("#usernewPassWordConfirm").val("");
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
								<div class="work_ss_title white_border white_border_gai">
									<h1 class="works_ss"></h1>

									<h2 class="works_ss_ge"></h2>
									<h3>
										<s:text name="common.product.currentlocation" />
										<s:text name="common.product.systemtitle" /> >> 修改密码
									</h3>
								</div>
								<div class="all_space"></div>
								<div class="workrep_content">
					              <div class="gongzuoqu_footbg2 white_border">
					                <div class="lingyong_sm">
					                  <h1>
					                    <div class="rep_biaoti"><img src="<%=request.getContextPath()%>/images/tongyi/ep.jpg" /></div>
					                    <div class="dawem_bt">
					                      <dt><img src="<%=request.getContextPath()%>/images/tongyi/ep2.jpg" height="25"/></dt>
					                      <dt class="shuoming_tu">说明：修改用户密码！</dt>
					                    </div>
					                  </h1>
					                </div>
					              </div>
					            </div>
					            <div class="all_space"></div>
								<form
									action="<%=request.getContextPath()%>/user/user!modifyUserPsw.action"
									method="post" id="adduser" enctype="multipart/form-data">
									<div class="works_ss_jieguo white_border">
										<div class="works_ss_tiaojian">
											<div class="gd_t2">
												<div class="liuc2_tit bott_xub">
													<strong>修改密码</strong>
												</div>
											</div>

											<div class="add_work_od" style="text-align: center">
												<ul>
													<li class="add_s_biaot">
														原密码：
													</li>
													<li>
														<input type="hidden" name="passWordVo.userId"
															value="${passWordVo.userId }" />
														<input name="passWordVo.oldPassWord" type="password"
															class="all_input inp_wid360" size="22"
															id="useroldPassWord" maxlength="20" />
													</li>
													<li>
														<div id="useroldPassWordTip"></div>
													</li>
												</ul>
												<ul>
													<li class="add_s_biaot">
														新密码：
													</li>
													<li>
														<input name="passWordVo.newPassWord" type="password"
															class="all_input inp_wid360" id="usernewPassWord"
															size="22" maxlength="20" />
														&nbsp;
													</li>
													<li>
														<div id="usernewPassWordTip"></div>
													</li>

												</ul>
												<ul>
													<li class="add_s_biaot">
														重复密码：
													</li>
													<li>
														<input name="passWordVo.newPassWordConfirm"
															type="password" class="all_input inp_wid360" size="22"
															id="usernewPassWordConfirm" maxlength="20" />
														&nbsp;
													</li>
													<li>
														<div id="usernewPassWordConfirmTip"></div>
													</li>
												</ul>


											</div>
											<div class="bn_ceng">
												<div class="table_an tar_wid90b">
													<input name="" type="submit" class="gx_w_bn all_butt"
														value="确 定" />
													<input name="" type="button" class="gx_w_bn all_butt"
														value="取 消" onclick="window.history.back();" />

												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<%@include file="../common/bottom.jsp"%>
	</body>
</html>
