<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="../common/commonHeader.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><s:text name="common.product.title" /></title>
		<link href="<%=request.getContextPath()%>/css/main.css"
			rel="stylesheet" type="text/css" />
		<link
			href="<%=request.getContextPath()%>/js/jquery/style/validator.css"
			type="text/css" rel="stylesheet"></link>
		<link href="<%=request.getContextPath()%>/css/global.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"
			rel="stylesheet" type="text/css" />
		<link rel="stylesheet" type="text/css"
			href="<%=request.getContextPath()%>/css/ext-all.css"></link>
		<%@include file="../common/commonJs.jsp"%>
		<script src="<%=request.getContextPath()%>/js/jquery/jquery_last.js"
			type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/js/jquery/formValidator.js"
			type="text/javascript" charset="UTF-8"></script>
		<script
			src="<%=request.getContextPath()%>/js/jquery/formValidatorRegex.js"
			type="text/javascript" charset="UTF-8"></script>
		<script
			src="<%=request.getContextPath()%>/js/jquery/validator/validateMail.js"
			type="text/javascript" charset="UTF-8"></script>
		<script type='text/javascript'
			src='<%=request.getContextPath()%>/dwr/interface/SecurityService.js'></script>
		<script type='text/javascript'
			src='<%=request.getContextPath()%>/dwr/interface/EmailService.js'></script>
		<!-- Security -->
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/apex/setting/security/common/User.js"></script>
		<script type="text/javascript" language="javascript">
		function save(){
             var mailInfo = {};
				mailInfo.fromAddress = document.getElementById("address").value;
				mailInfo.smtpAddress = document.getElementById("smtpServer").value;
				mailInfo.port = document.getElementById("port").value;
				mailInfo.userName = document.getElementById("user").value;
				mailInfo.passWord = document.getElementById("password").value;
				var waitLoadMessage = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在测试，请稍等..."
					});
				waitLoadMessage.show();
				EmailService.testEmailServer(mailInfo, function(returnValue) {
					waitLoadMessage.hide();
					if (!returnValue){
						Ext.Msg.show({
								title : '错误',
								msg : '测试失败，请检查邮件服务器设置是否正确！',
								modal : true,
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.ERROR
							});
					}else{
						 var form=document.getElementById("mailForm");
                         form.submit();	
					}
	
				});                 		         
		      }
         	function message(){
         	var msg=document.getElementById('showMsg').value;
         	if(msg==1){
	     	      Ext.Msg.show({
					title : '提示',
					msg : '配置邮件服务器成功！',
					modal : true,
					buttons : Ext.Msg.OK,
					icon : Ext.Msg.INFO
				});	
         	}
         	}
         	
         	function cancel(){
         		location.href="<%=request.getContextPath()%>/setting/mail-setting!save.action"
         	}
         	
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#mailConfigMgt").addClass("on_this");
			}
		</script>
	</head>
	<body onload="message(),init()">
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
										>> 邮件服务器设定
									</h3>

								</div>
								<div class="all_space"></div>
								<div class="workrep_content">
									<div class="gongzuoqu_footbg2 white_border">
										<input type="hidden" value="<s:property value="msgShow"/>"
											id="showMsg" />
										<div class="lingyong_sm">
											<h1>
												<div class="rep_biaoti">
													<img
														src="<%=request.getContextPath()%>/images/tongyi/em.jpg" />
												</div>
												<div class="dawem_bt">
													<dt>
														<img
															src="<%=request.getContextPath()%>/images/tongyi/em2.jpg"
															height="25" />
													</dt>

													<dt class="shuoming_tu">
														说明：配置和管理系统的邮件服务器！
													</dt>
												</div>
											</h1>
										</div>
									</div>
								</div>
							</div>
							<form
								action="<%=request.getContextPath()%>/setting/mail-setting!save.action"
								id="mailForm" method="post">
								<div class="works_search left_margin8px all_border">
									<div class="works_ss_tiaojian">
										<div class="gd_t2">
											<div class="liuc2_tit bott_xub">
												<strong>邮件服务器设置</strong>
											</div>
										</div>
										<div class="add_work_od" style="text-align: center">
											<ul>
												<li class="add_s_biaot">
													发件人地址：
												</li>
												<li>
													<input name="email.fromAddress" type="text" 
														class="all_input" style="width: 355px" id="address"
														value="<s:property value="email.fromAddress"/>" />
													&nbsp;
												</li>
												<li>
													<i>*</i>&nbsp;格式如tekview@tekview.com ！
												</li>
												<li>
													<div id="addressTip"></div>
												</li>
												

											</ul>
											<ul>
												<li class="add_s_biaot">
													端口：
												</li>
												<li>
													<input name="email.port" type="text" class="all_input"
														style="width: 355px" id="port"
														value="<s:property value="email.port"/>" />
													&nbsp;
												</li>
												<li>
													<i>*</i>&nbsp;范围为0-65536的整数 ！
												</li>
												<li>
													<div id="portTip"></div>
												</li>
												
											</ul>

											<ul>
												<li class="add_s_biaot">
													SMTP服务器：
												</li>
												<li>
													<input name="email.smtpAddress" type="text"
														class="all_input" style="width: 355px" id="smtpServer"
														value="<s:property value="email.smtpAddress"/>" />
													&nbsp;
												</li>
												<li>
													<i>*</i>&nbsp;格式如smtp.sian.com.cn或127.0.0.1！
												</li>
												<li>
													<div id="smtpServerTip"></div>
												</li>
												
											</ul>
											<ul>
												<li class="add_s_biaot">
													用户名：
												</li>
												<li>
													<input name="email.userName" type="text" class="all_input"
														style="width: 355px" id="user"
														value="<s:property value="email.userName"/>" />
													&nbsp;
												</li>
												<li>
													<i>*</i>&nbsp;不超过30个字符的字母和数字 ！
												</li>
												<li>
													<div id="userTip"></div>
												</li>
												

											</ul>
											<ul>
												<li class="add_s_biaot">
													密码：
												</li>
												<li>
													<input type="password" id="password" class="all_input"
														style="width: 355px" name="email.passWord"
														value="<s:property value="email.passWord"/>" />
													&nbsp;
												</li>
												<li>
													<i>*</i>不超过30个字符的字母和数字 ！
												</li>
												<li>
													<div id="passwordTip"></div>
												</li>
											</ul>
										</div>

										<div class="bn_ceng">
											<div class="table_an tar_wid90b">
												<input type="submit" class="butt_email on_queren"
													value="确 定" name="" id="submitButton"/>
												<input type="text"
													style="width: 180px; height: 22px; background: none repeat scroll 0% 0% transparent; border: medium none; cursor: default; color: rgb(255, 0, 0);"
													value="" id="csjieguo"/>
											</div>
										</div>

									</div>
								</div>
							</form>
						</td>
					</tr>
				</table>

			</div>
		</div>
		<%@include file="../common/bottom.jsp"%>
	</body>
</html>
