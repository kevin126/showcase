<%@ page pageEncoding="UTF-8"%>
<%@page import="java.util.Calendar"%>
<%@page import="com.tekview.apex.itsm.server.system.Version"%>
<div class="foot" id="ossFoot">
	<table width="100%" border="0" class="foot_table">
		<tbody>
			<tr>
				<td width="40%" valign="middle" align="center">
					<table cellspacing="0" cellpadding="0" border="0">
						<tbody>
							<tr>
								<td>
									<a target="_blank" href="http://www.tekview.com/"><img src="<%=request.getContextPath() %>/images/works/b_logo.jpg">
									</a>
								</td>
								<td>
									&nbsp;&nbsp;
									<a href="http://www.tekview.com/" target="_blank" class="gongsi">
									1999-<%=Calendar.getInstance().getTime().getYear()+1900 %> ©<%=Version.getInstance().getCompany() %> <%=Version.getInstance().getCopyright() %>
									</a>
									&nbsp;&nbsp;
									<!-- 
									<a title="如果您对我们的产品有更好的改进意见，请提交给我们，谢谢！"
										href="http://218.80.251.114:8080/secure/CreateIssue.jspa?pid=10090&amp;issuetype=4">提交改进意见</a><span>&nbsp;&nbsp;</span><a
										title="发现产品有错误，请提交错误报告给我们，附上相应的文字说明、截图及服务器运行日志，您的配合将帮助我们更好地改进产品，谢谢！"
										href="http://218.80.251.114:8080/secure/CreateIssue.jspa?pid=10090&amp;issuetype=1">报告错误</a>
									 -->
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</div>