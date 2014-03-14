<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<%@include file="../common/commonHeader.jsp"%>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><s:text name="common.product.title" /></title>
		<style>
			.main_body {margin:0 auto; padding:0 auto; color:#333}
			.main_body1 {height:auto;overflow:hidden;border:1px solid #036; width:auto}
			.main_body2 {width:auto;height:auto;overflow:hidden;border:1px solid #fff}
			.header_tip1 {width:auto;overflow:hidden;height:58px; background:#036}
			.header_tip2 {width:auto;height:auto;overflow:hidden;font:700 22px/58px 'Arial', Gadget, sans-serif; color:#fff; text-indent:14px}
			.header_welcome {width:auto;height:auto;overflow:hidden;border:1px solid #f1f1f1; font:14px/42px normal;margin:24px; text-indent:12px; color:#666}
			.body_ul {width:auto;height:auto;overflow:hidden;height:32px; clear:both;border-bottom:1px #f1f1f1 dotted;margin:0 34px}
			.body_li {list-style:none;line-height:32px; text-align:right; width:88px; float:left}
			.body_li_content {list-style:none;line-height:32px; text-align:right; width:auto; float:left}
			.bottom_tip {width:auto;height:auto;overflow:hidden;font:14px/36px normal; text-indent:16px; padding-top:46px; margin:0 42px;color:red}
			.copyright {width:auto;height:42px;overflow:hidden; margin-top:32px; background:#036; font:12px/42px normal; color:#fff; text-indent:24px;text-align:center}
		</style>
	</head>
	<body  class="main_body">
		<div class="main_body1">
			<div class="main_body2">
				<div class="header_tip1">
					<div class="header_tip2">
						APEX CA 统一认证平台
					</div>
				</div>
				<div class="header_welcome">
					&gt;&gt; 欢迎您使用APEX CA统一认证系统！请记住您的注册信息！
				</div>
				<div>
					<ul class="body_ul">
						<li class="body_li">用 户 名：</li>
						<li class="body_li_content"><s:property value="user.name"/></li>
					</ul>
					<ul class="body_ul">
						<li class="body_li">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</li>
						<li class="body_li_content"><s:property value="user.realName"/></li>
					</ul>
					<s:if test="user.employeeNo!=null && user.employeeNo!=''">
						<ul class="body_ul">
							<li class="body_li">工&nbsp;&nbsp;&nbsp;&nbsp;号：</li>
							<li class="body_li_content"><s:property value="user.employeeNo"/></li>
						</ul>
					</s:if>
					<s:if test="user.internetAccount!=null && user.internetAccount!=''">
						<ul class="body_ul">
							<li class="body_li">上网账号：</li>
							<li class="body_li_content"><s:property value="user.internetAccount"/></li>
						</ul>
					</s:if>
					<s:if test="user.mail!=null && user.mail!=''">
						<ul class="body_ul">
							<li class="body_li">电子邮件：</li>
							<li class="body_li_content"><s:property value="user.mail"/></li>
						</ul>
					</s:if>
					<s:if test="user.mobile!=null && user.mobile!=''">
						<ul class="body_ul">
							<li class="body_li">手机号码：</li>
							<li class="body_li_content"><s:property value="user.mobile"/></li>
						</ul>
					</s:if>
					<s:if test="user.fax!=null && user.fax!=''">
						<ul class="body_ul">
							<li class="body_li">传真号码：</li>
							<li class="body_li_content"><s:property value="user.fax"/></li>
						</ul>
					</s:if>
					<s:if test="user.office!=null && user.office!=''">
						<ul class="body_ul">
							<li class="body_li">固定电话：</li>
							<li class="body_li_content"><s:property value="user.office"/></li>
						</ul>
					</s:if>
					<s:if test="user.msn!=null && user.msn!=''">
						<ul class="body_ul">
							<li class="body_li">常&nbsp;用MSN：</li>
							<li class="body_li_content"><s:property value="user.msn"/></li>
						</ul>
					</s:if>
					<s:if test="user.qq!=null && user.qq!=''">
						<ul class="body_ul">
							<li class="body_li">QQ 号 码：</li>
							<li class="body_li_content"><s:property value="user.qq"/></li>
						</ul>
					</s:if>
					<s:if test="user.country!=null && user.country!=''">
						<ul class="body_ul">
							<li class="body_li">国&nbsp;&nbsp;&nbsp;&nbsp;家：</li>
							<li class="body_li_content"><s:property value="user.country"/></li>
						</ul>
					</s:if>
					<s:if test="user.city!=null && user.city!=''">
						<ul class="body_ul">
							<li class="body_li">城&nbsp;&nbsp;&nbsp;&nbsp;市：</li>
							<li class="body_li_content"><s:property value="user.city"/></li>
						</ul>
					</s:if>
					<s:if test="user.address!=null && user.address!=''">
						<ul class="body_ul">
							<li class="body_li">所在地址：</li>
							<li class="body_li_content"><s:property value="user.address"/></li>
						</ul>
					</s:if>
					<s:if test="user.zipCode!=null && user.zipCode!=''">
						<ul class="body_ul">
							<li class="body_li">邮政编码：</li>
							<li class="body_li_content"><s:property value="user.zipCode"/></li>
						</ul>
					</s:if>
				</div>
				<div class="bottom_tip">
					提示：您现在可以使用注册用户信息登录APEX系统，首次登录请及时修改密码,如有其它疑问，请参考“帮助手册”或联系官方客服！
				</div>
				<div class="copyright">
					Copyright &copy; tekview.com All rights reserved.上海泰信科技有限公司版权所有 
				</div>
			</div>
		</div>
	</body>
</html>
