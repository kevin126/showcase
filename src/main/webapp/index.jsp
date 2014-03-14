<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" import="javax.servlet.http.Cookie" pageEncoding="UTF-8" contentType="text/html; charset=UTF-8 "%>
<%@ taglib prefix="s" uri="/struts-tags" %>
<%@page import="com.tekview.apex.itsm.common.util.SysUtil"%>
<%@ taglib uri="/WEB-INF/c.tld" prefix="c"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<link href="<%=request.getContextPath()%>/css/div.css" rel="stylesheet" type="text/css" />
		<title><s:text name="common.product.title"/></title>
		<script language="javascript">
		
	function submitForm() {
		document.forms[0].submit();
	}
	
	if(document.addEventListener){//如果是Firefox   
		document.addEventListener("keypress",fireFoxHandler, true);   
	}else{
		document.attachEvent("onkeypress",ieHandler);  
	}
	
	function fireFoxHandler(evt){ 
		if(evt.keyCode==13){ 
			submitForm();
		}  
	} 

	function ieHandler(evt){
		if(evt.keyCode==13){
			submitForm();
		} 
	}
	
	function onLoad() {
		document.getElementById('usernameId').focus();
	}
</script>
<%
Cookie[] cookies = request.getCookies();
request.setAttribute("username", "");
request.setAttribute("password", "");
if (null != cookies) {
	for (int i = 0; i < cookies.length; i++) {
		if (cookies[i].getName().equals("caUserName")) {
			if(request.getAttribute("needLoadCookie") == null)
				request.setAttribute("username", cookies[i].getValue() );
			request.setAttribute("writeStatus", "checked");
		}
		if(cookies[i].getName().equals("caPassword") && request.getAttribute("needLoadCookie") == null){
			request.setAttribute("password", SysUtil.decodeBase64(cookies[i].getValue()));
		}
	}
}
 %>
	</head>
	<body onload="onLoad()">
		<form action="<%=request.getContextPath()%>/security/login.action" method="post">
			<div class="wrapper_ca ">
				<div class="input1">
					<input type="text" name="admin.name" value="${username}" class="input_style" id="usernameId" />
				</div>
				<div class="input2">
					<input type="password" name="admin.password" value="${password}" class="input_style" id="passwordId" />
				</div>
				<div class="wangji">
					<table width="100%" border="0">
						<%
						if (request.getAttribute("msg") != null) {
						%>
						<tr>
							<td width="11%"></td>
							<td width="89%" valign="bottom">
								<font color="red"><%=(String) request.getAttribute("msg")%></font>
							</td>
						</tr>
						<%
						}
						%>
						<tr>
							<td width="11%">
								<input type="checkbox" id="checkboxId" name="writeStatus" <c:if test="${writeStatus=='checked' }">checked='true'</c:if>/>
							</td>
							<td width="89%" valign="bottom">
								记住登录密码
							</td>
						</tr>
					</table>
				</div>
				<div class="button_signin">
					<a href="#" onclick="submitForm()"> </a>
				</div>
				<div class="fail">
					<s:actionerror/>
				</div>
			</div>
			<input type="hidden" name="wonderUrl" value="<%=request.getParameter("wonderUrl") %>" />
		</form>
	</body>
</html>