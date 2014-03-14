function selectType(){
	var issueType = $("select[name='t']").attr("value");
	if(!issueType) showTips("请先选择工单类型！");
	else new Apex.common.TypeMultiList("issueType", issueType).showTypeList();
}

function clearValue(fieldId){
	$("#" + fieldId).attr("value", "");
}

function selectState(){
	var issueType = $("select[name='t']").attr("value");
	if(!issueType) showTips("请先选择工单类型！");
	else new Apex.common.StateMultiList("state", issueType).showStateList();
}

function addFilter(){
	$("#complexSearchForm").attr("action", "/itsm/common/filter.do");
	$("#complexSearchForm").append("<input type='hidden' name='method' value='preAddFilterConfig' />");
	$("#complexSearchForm").append("<input type='hidden' name='menuId' value='m0_3' />");
	$("#complexSearchForm").submit();
}

//重置
function resetInput(){
	$("input[name='k']").eq(1).attr("value", "");
	$("input[name='f']").attr("checked", true);
	//$("input[name='f']").eq(0).attr("checked", true);
	$("select[name='t']").attr("value", "");
	$("input[name='i']").attr("value", "");
	$("input[name='s']").attr("value", "");
	$("input[name='r']").attr("value", "");
	$("input[name='c']").attr("value", "");
	$("input[name='p']").attr("value", "");
	$("input[name='y']").attr("checked", true);
	$("input[name='m']").attr("checked", true);
	$("input[name='l']").attr("value", "");
	$("input[name='g']").attr("value", "");
	$("input[name='n']").attr("value", "");
	$("input[name='ft']").attr("value", "");
}

function showTips(msg){
	 Ext.Msg.show({
		title : '提示',
		msg : msg,
		modal : true,
		buttons : Ext.Msg.OK,
		icon : Ext.Msg.INFO
	});	
}

function resetSimpleForm(){
	$("#type_simple").attr("value", "");
	$("#request_simple").attr("value", "");
	$("#creator_simple").attr("value", "");
	$("#processor_simple").attr("value", "");
}
