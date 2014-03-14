<%@page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@include file="../common/commonHeader.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>用户批量导入</title>
		<%@include file="../common/commonJs.jsp"%>
		<link href="<%=request.getContextPath()%>/css/top.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/main.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/global.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"
			rel="stylesheet" type="text/css" />

		<script type="text/javascript">
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#userMgt").addClass("on_this");
			}
			function hideMsg(){
				$("#msg").hide("slow");
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
						<td align="left" valign="top"><%@include
								file="../common/systemLeftOperatorItems.jsp"%></td>
						<td width="100%" align="left" valign="top">

							<div class="works_search left_margin8px all_border no_bor_bott">
								<div class="work_ss_title white_border white_border_gai">

									<h1 class="mokuai_ss"></h1>
									<h2 class="works_ss_ge"></h2>
									<h3>
										<s:text name="common.product.currentlocation" />
										<s:text name="common.product.systemtitle" />
										>> 用户管理 >> 批量添加用户
									</h3>
								</div>
								<div class="all_space"></div>
								<div class="workrep_content">
									<div class="gongzuoqu_footbg2 white_border">

										<div class="lingyong_sm">
											<h1>
												<div class="rep_biaoti">
													<img src="<%=request.getContextPath() %>/images/tongyi/el.jpg" />
												</div>
												<div class="dawem_bt">
													<dt>
														<img src="<%=request.getContextPath() %>/images/tongyi/el2.jpg" height="25" />
													</dt>
													<dt class="shuoming_tu">
														说明：批量导入用户,提供快速添加大量用户资料快捷通道。
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

								<div class="works_ss_tiaojian white_border">
									<table width="100%" border="0" cellspacing="0" cellpadding="0"
										class="gongdan_xq">
										<tr>

											<td width="925" height="25" align="left" class="">
												<center>
													<div class="add_work_od" style="text-align: center">
														<form action="/uums/user/import-user!batchImport.action"
															method="post" enctype="multipart/form-data">
															<c:if test="${importMsg!=null}">
																<div id="msg"
																	style="margin-top: 5px; background-color: #FFC; border: 1px solid #f2c71c; text-align: center; color: #000; margin-right: 50px; margin-bottom: 10px; margin-left: 50px; font-weight: bold; font-size: 14px; padding: 20px;">
																	<img src="../images/tishi.gif" />
																	${importMsg}
																</div>
															</c:if>
															<div id="div1">
																<ul style="margin-top: 34px">
																	<li style="margin-left: 40px">
																		选择文件：
																	</li>
																	<li>
																		<div style="overflow: hidden">
																			<input class="all_input inp_wid360" type="text"
																				id="txt" name="txt" readonly="true" onclick="hideMsg()"/>

																			<input type="button" class="chakan_bn all_butt"
																				value="浏览"/>
																				<span id="upload">
																			<input class="input_file" size="42" type="file"
																				onchange="txt.value=this.value" name="attachment"  onclick="hideMsg()" id="attachment"/>
																				</span>
																			&nbsp;
																		</div>
																	</li>
																	<li>
																		<input name="" type="submit"
																			class="chakan_bn all_butt" value="导入" onclick="" />
																	</li>
																</ul>
															</div>
														</form>
													</div>
												</center>
											</td>

										</tr>
									</table>
									<div class="cuowutishi" style="margin-bottom: 30px">
										<div class="tishi_info">
											<div class="tishi_nr">
												<h1 class="nerrbeijing5">
													<strong>帮助</strong>
													<br />
													<p>
														1、请下载批量导入用户的
														<img src="../images/xstar.gif" />
														<a href="/uums/user/import-user!getTemplate.action"><samp><font
															size=4 color="red">Excel模板</font></samp>
														</a>，请勿擅自改动模板的列名称，如果你擅自改动，在导入数据时，系统会报错，导致导入数据失败。
													</p>

													<p>
														2、批量导入用户应遵循添加用户的校验规则，如：用户名必须系统唯一，姓名, 是否普通用户必填，且字符长度不能超过相应的长度等等。
													</p>
													<p>
														3、批量添加的用户，其登录密码将被重置为“11111111”，为了你账户的安全，请及时修改密码。
													</p>
													<p>
														4、在导入数据的过程中，如果提示某行某列有错，请改之，然后在excel中，把位于此行之前的数据删除之后再导入数据，如果不删除此行之前的数据，由于之前
									
														的数据已经导入数据库，再次导入则会报错。
													</p>
												</h1>
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
