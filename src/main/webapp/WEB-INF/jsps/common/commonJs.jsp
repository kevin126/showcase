<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String contextPath = request.getContextPath();
%>
<!-- JS的多语言文件 -->
<script type="text/javascript"
	src="<%=contextPath%>/js/i18n/I18N_zh_CN.js"></script>
<script type="text/javascript"
	src="<%=contextPath%>/js/i18n/CommonResource_zh_CN.js"></script>
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/js/ext/multiselect.css" />
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/css/file-upload.css" />
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/css/chooser.css" />
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/css/column-tree.css" />
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/css/tab_menu.css" />
<link rel="stylesheet" type="text/css" href="<%=contextPath%>/css/style.css" />
<%--<link href="<%=contextPath%>/css/top.css" rel="stylesheet" type="text/css" />
--%><link href="<%=contextPath%>/css/foot.css" rel="stylesheet" type="text/css" />

<script language="javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/common/showmenu.js"></script>
<script type='text/javascript' src='<%=contextPath%>/dwr/engine.js'> </script>
<script type='text/javascript' src='<%=contextPath%>/dwr/util.js'> </script>

<!-- Ext -->
<script type="text/javascript" src="<%=contextPath%>/js/ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ext/ext-all.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ext/ColumnNodeUI.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ext/ext-lang_zh_CN.js"></script>
<script type="text/javascript"
	src="<%=contextPath%>/js/ext/ext-lang_<%=request.getSession().getAttribute("org.apache.struts.action.LOCALE")%>.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/dpicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ext/DDView.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ext/MultiSelect.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ext/ItemSelector.js"></script>
<!-- COMMON -->
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/ApexConstants.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/ApexVType.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/ApexPrompt.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/ItsmPrompt.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/DataFormat.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/EnumsConstants.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/upload.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/ImageChooser.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/SysUtils.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ex/dwr-tree.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ex/dwr-proxy.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ex/StaticTextField.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ex/JpkImgLabel.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ex/DateTimeField.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/ex/CheckColumn.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/fieldpanel.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/JsLog.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/WorkflowConstant.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/common/PermissionId.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery/jquery_last.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/apex/common/commonUse.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/common/tableFocus.js"></script>
<script type="text/javascript" src="<%=contextPath%>/js/common/ShHi.js"></script>
<script>
Ext.onReady(function() {
	Ext.BLANK_IMAGE_URL = "<%=contextPath%>/images/default/s.gif";
	Ext.QuickTips.init();
	dwr.engine.setAsync(true); 
});



/**
 * 默认的处理DWR异常信息的方法
 * 
 * @param {}
 *            errorString
 * @param {}
 *            exception
 */
function errorHandler(errorString, exception) {
	if (exception && exception.message && (exception.message.indexOf('Failed to read input') != -1 || 
										   exception.message.indexOf('Session Error') != -1 ||
										   exception.message.indexOf('is null') != -1 ||
										   exception.message.indexOf('is not defined') != -1 ||
										   exception.message.indexOf('is undefined') != -1 ||
										   exception.message.indexOf('为空或不是对象') != -1))
		return;
	if(exception.message == 'Internal Server Error') {
		exception.message = '对不起，系统正在维护，请稍候再试...';
	}
	Ext.MessageBox.show({
				title : '通用错误',
				msg : "【错误信息】:"+exception.message ,
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});
};
/**
 * 注册处理异常方法
 */
dwr.engine.setErrorHandler(errorHandler);
</script>
