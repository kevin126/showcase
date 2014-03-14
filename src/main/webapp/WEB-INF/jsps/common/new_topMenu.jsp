<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.tekview.apex.uums.model.Administrator" %>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script>
$(function() {
	$("#shortcutsArea").hover(function(){}, function(){
	   $("#shortcutsArea").hide();
	});
});

	function hideDiv(id){
		$("#" + id).hide();
	}
	
	function showDiv(id){
		$("#" + id).show();	
	}
	function toggleDiv(id){
		$("#" + id).css("display") == "block" ? hideDiv(id) : showDiv(id);	
	}
	
	function logOut(){
		window.location.href="<%=request.getContextPath()%>/index.jsp";
	}
</script>
<div class="head">
	<!--头部文件-->
	<div class="top_c">
		<h1></h1>
		<h2>
			<div class="logo_img">
				<a href="<%=request.getContextPath()%>/user/user!list.action"><img src="<%=request.getContextPath()%>/images/new_top/logo_img2.jpg" alt="<bean:message key='common.product.title' bundle='common' />" /></a>
			</div>
			<div class="user_info">
				<div class="top_link">
					<div class="t_link_one"></div>
					<div class="t_link_two">
						<div class="link_gg"></div>
						<div class="tuichu">
								<a href="<%=request.getContextPath()%>/security/logout.action" title="">退出</a>
						</div>
					</div>
					<div class="t_link_three"></div>
				</div>
				<div class="zhanghu">
					<%
						Administrator admin = (Administrator) session.getAttribute("com.tekview.apex.ca.user");
					%>
					<%=admin != null ? admin.getRealName() : ""%>，欢迎登录！
				</div>
			</div>
			<script>
				$(function(){
					$("input[name='k'][class='sous_input']").bind("focus", function(){
						if($(this).css("color") != "black"){
							$(this).attr("value", "");
							$(this).css("color", "black");
						}
					});
					$("input[name='k'][class='sous_input']").bind("blur", function(){
						if(!$(this).attr("value")){
							$(this).css("color", "#ccc");
							$(this).attr("value", "输入关键字进行查询");
						}
					});
					if(window.screen.width >= 1280){  //控制浏览器分辨率
						document.body.style.width = "auto";
					}else{
						document.body.style.width = "1263px";
					}
				});
			</script>
		</h2>
		<h3></h3>
	</div>
</div>