/**
 * 页面加载完就执行，完成表格的奇偶行区别显示
 */
$(function(){
	toggleTableColor('issueTable');//表格奇偶行区别显示
});

/**
 * 获取指定条件的工单
 */
function queryFixedIssues(){
	var form  = document.getElementById("queryissue");
	var queryStateselect  = document.getElementById("queryStateselect").value;
	var queryStateEl  = document.getElementById("queryStateEl");
	queryStateEl.value = queryStateselect;
	form.submit();
}
