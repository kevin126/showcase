<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html xmlns="http://www.w3.org/1999/xhtml">
<%@include file="../common/commonHeader.jsp" %>
<head>
    <title><s:text name="common.product.title"/></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
   	<link rel="stylesheet" href="<%=request.getContextPath()%>/css/jquery-ui.css" type="text/css" media="all" />
	<link rel="stylesheet" href="<%=request.getContextPath()%>/css/ui.theme.css" type="text/css" media="all" />
	<link href="<%=request.getContextPath()%>/css/global.css" rel="stylesheet" type="text/css"></link>
	<link href="<%=request.getContextPath()%>/css/new_main.css" rel="stylesheet" type="text/css" />
	<script src="<%=request.getContextPath()%>/js/jquery/jquery_last.js" type="text/javascript"></script>
	<script src="<%=request.getContextPath()%>/js/apex/common/commonUse.js" type="text/javascript"></script>
</head>
<body>
	<%@include file="../common/new_topMenu.jsp"%>
	<div class="height2px"></div>
	<div class="main_w wai_border">
	<div class="main white_border">
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td  align="left" valign="top"><%@include file="systemLeftOperatorItems.jsp"%></td>
				<td width="100%" align="left" valign="top">
					<div class="works_search left_margin8px all_border">
				         <div class="work_ss_title white_border">
				           <h1 class="works_ss"></h1>
				           <h2 class="works_ss_ge"></h2>
				           <h3><a href="<%=request.getContextPath() %>/user/user!list.action" title=""><s:text name="common.product.currentlocation"/><s:text name="common.product.systemtitle"/></a> >> 错误提示</h3>
				         </div>
   						<div class="all_space"></div>
   						<div  class="works_ss_tiaojian white_border">
						<div class="cuowutishi">
			               <div class="err_info margin_left">
			                 <div class="err_nr" style="height: 100px;">
			                   <h1 class="beijing4"><s:text name="%{exception.errorCode}"/></h1>
			                 </div>
			               </div>
      					</div>
			           <div class="bn_ceng">
			               <div class="table_an tar_wid90b">
			                	<input name="" type="button" class="gx_w_bn all_butt" value="返 回" onclick="javascript:history.go(-1);"/>
			               </div>
			           </div>
    				</div>
  					</div>
  				</td>
			</tr>
		</table>
	</div>
	<jsp:include page="../common/bottom.jsp" />
</body>
</html>
