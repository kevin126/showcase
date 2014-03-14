<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8 "%>
<%@include file="../common/commonHeader.jsp"%>
<%@page import="java.util.Calendar"%>
<%@page import="com.tekview.apex.itsm.server.system.Version"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><s:text name="common.product.title"/></title>
		<link href="<%=request.getContextPath()%>/css/main.css"	rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/global.css" rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"	rel="stylesheet" type="text/css" />
		<link rel="stylesheet" type="text/css" href="css/ext-all.css" />
		<%@include file="../common/commonJs.jsp"%>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/SecurityService.js'></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/security/rolemanage/AllRoleDlg.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/security/usermanage/AllWorkGroupPanel.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/email/EmailServerPanel.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/common/ApexConstants.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/common/EnumsConstants.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/EmailSetting.js"></script>
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/EmailService.js'></script>
		<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/js/jquery/style/validator.css"></link>
		<script src="<%=request.getContextPath()%>/js/jquery/jquery_last.js" type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/js/jquery/formValidator.js" type="text/javascript" charset="UTF-8"></script>
		<script	src="<%=request.getContextPath()%>/js/jquery/formValidatorRegex.js" type="text/javascript" charset="UTF-8"></script>
		<script	src="<%=request.getContextPath()%>/js/jquery/validator/validateUser.js"	type="text/javascript" charset="UTF-8"></script>
		<script type="text/javascript">
			function cancel(){
				window.location.href="/itsm/issue/issueView.do?menuId=m0_1";
			}
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#passWordMgt").addClass("on_this");
				//初始化时清空表单数据，防止浏览器的自动填表功能填充数据
				$("#useroldPassWord").val("");
				$("#usernewPassWord").val("");
				$("#usernewPassWordConfirm").val("");
			}
		</script>
	</head>
	<body onload="init()" onpaste="return false;" oncontextmenu="return false" ondragstart="return false" onselectstart="return false" oncopy="return false">
		<!-- 头部区域 -->
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
										<s:text name="common.product.currentlocation"/>
										<a href="<%=request.getContextPath() %>/user/user!list.action" title=""><s:text name="common.product.systemtitle"/></a> >> 修改密码
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
					                      <dt class="shuoming_tu">说明：修改系统管理员密码！</dt>
					                    </div>
					                  </h1>
					                </div>
					              </div>
					            </div>
					            <div class="all_space"></div>
								<div class="works_ss_jieguo white_border">
									<div class="works_ss_tiaojian">
										<div class="gd_t2">
											<div class="liuc2_tit bott_xub">
												<strong>修改密码</strong>
											</div>
										</div>

										<input type="hidden" value="<c:out value="${msgShow}"/>"
											id="showMsg" />
										<form action="<%=request.getContextPath() %>/security/administrator!modifyPasswd.action"
											method="post" id="adduser" enctype="multipart/form-data">
											<div style="text-align: center;" class="add_work_od">
												<ul>
													<li class="add_s_biaot">
														旧密码：
													</li>
													<li>
														<input type="password" id="useroldPassWord" maxlength="20"
															name="oldPassWord" size="22" class="all_input inp_wid360" value=""/>
														&nbsp;

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
														<input type="password" id="usernewPassWord" size="22"
															class="all_input inp_wid360" maxlength="20"
															name="newPassWord"></input>
														&nbsp;
													</li>
													<li>
														<div id="usernewPassWordTip"></div>
													</li>
													<li>
														<i>&nbsp;</i>
													</li>
												</ul>
												<ul>
													<li class="add_s_biaot">
														确认密码：
													</li>
													<li>
														<input type="password" size="22"
															id="usernewPassWordConfirm" maxlength="20"
															name="newPassWordConfirm" class="all_input inp_wid360" />
														&nbsp;
													</li>
													<li>
														<div id="usernewPassWordConfirmTip"></div>
													</li>
												</ul>
											</div>
											<div class="bn_ceng">
												<div class="table_an tar_wid90b">
													<input class="bn_css all_butt wen_center" type="submit"
														" value="确 定" />
													<input onclick="javascript:history.go(-1);" type="button"
														class="bn_css all_butt wen_center" value="取 消" />
												</div>
											</div>
										</form>
									</div>
									<jsp:include page="../common/bottom.jsp" />
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
