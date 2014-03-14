var operateDom_total = null;//全局变量，用于保存操作符的Dom结构
var fieldDom_total = null;//全局变量，用于保存输入域的Dom结构
var indexNum_total = 100000;//全局变量，用于计数，只增不减,主要是区分条件的类型
/**
 * 是指定的Tab页前端显示
 */
function setHighLight(index){
	var h3_array = $("#menu9 h3");
	for(var i=0;i<h3_array.length;i++){
		if(index == i){
			h3_array[i].className = 'hover';
		}else{
			h3_array[i].className = '';
		}
	}
	var ol_array = $("#olList ol");
	for(var i=0;i<ol_array.length;i++){
		if(index == i){
			ol_array[i].style.display = 'block';
		}else{
			ol_array[i].style.display = 'none';
		}
	}
}
/**
 * 增加新的判断条件
 */
function addNewLogic(index){
	indexNum_total++;
	var oBuffer = new Array();
	oBuffer.push("<div class='tiaojian_cs'>");
	
	oBuffer.push("<div class='float_left tiaojian_ziduan_c'>");
	oBuffer.push("<div class='tiao_t_c'>字段域</div>");
	oBuffer.push("<div class='zdy_shuri'>");
	oBuffer.push("<div class='white_border zdy_count'>");
	oBuffer.push(createFieldDom());
	oBuffer.push("</div></div></div>");
	
	oBuffer.push("<div class='float_left tiaojiancaozuo_c'>");
	oBuffer.push("<div class='tiao_t_c'>操作</div>");
	oBuffer.push("<div class='zdy_shuri bor_noleft'>");
	oBuffer.push("<div class='white_border zdy_count'>");
	oBuffer.push(createOperateDom());
	oBuffer.push("</div></div></div>");
	
	oBuffer.push("<div class='float_left tiaojianzhi_c'>");
	oBuffer.push("<div class='tiao_t_c'>阈值</div>");
	oBuffer.push("<div class='zdy_shuri bor_noleft'>");
	oBuffer.push("<div class='white_border zdy_count'><input name='thresholdValue' type='text' class='all_input wid90b'/></div>");
	oBuffer.push("</div></div>");
	
	oBuffer.push("<div class='float_left tiaojianxz_c'>");
	oBuffer.push("<div class='tiao_t_c'>性质</div>");
	oBuffer.push("<div class='zdy_shuri bor_noleft'>");
	oBuffer.push("<div class='white_border zdy_count'><input name='conditionType"+indexNum_total+"' type='radio' checked='checked' value='0'/>&nbsp;充分条件&nbsp;&nbsp;&nbsp;<input name='conditionType"+indexNum_total+"' type='radio' value='1' />&nbsp;必要条件</div>");
	oBuffer.push("</div></div>");
	
	oBuffer.push("<div class='float_left tiaojiandel_c'>");
	oBuffer.push("<div class='tiao_t_c'>删除</div>");
	oBuffer.push("<div class='zdy_shuri bor_noleft'>");
	oBuffer.push("<div class='white_border zdy_count padd_right8px'><input onclick=removeLogic(this); type='button' class='all_butt del_tj_bn' value='删除条件' /></div>");
	oBuffer.push("</div></div>");
	
	oBuffer.push("</div>");
	$(oBuffer.join("")).insertBefore($("#addNewLogicBtn"+index));
}

/**
 * 创建操作符的Dom结构
 */
function createOperateDom(){
	if(null == operateDom_total){
		var oBuffer = new Array();
		oBuffer.push("<select name='operateName' class='all_input wid90b'>");
		oBuffer.push("<option value='=='>等于</option>");
		oBuffer.push("<option value='!='>不等于</option>");
		oBuffer.push("<option value='>'>大于</option>");
		oBuffer.push("<option value='<'>小于</option>");
		oBuffer.push("<option value='>='>大于或等于</option>");
		oBuffer.push("<option value='<='>小于或等于</option>");
		oBuffer.push("</select>");
		operateDom_total = oBuffer.join("");
	}
	return operateDom_total;
}

/**
 * 创建输入域的Dom结构
 */
function createFieldDom(){
	if(null == fieldDom_total){
		var oBuffer = new Array();
		dwr.engine.setAsync(false); 
		var fieldNames = null;
		CwfService.getAllfieldNames(function(result){
			dwr.engine.setAsync(true); 
			fieldNames = result;
		});
		oBuffer.push("<select name='fieldName' class='all_input wid90b'>");
		for(var i=0;i<fieldNames.length;i++){
			oBuffer.push("<option value='"+fieldNames[i]+"'>"+fieldNames[i]+"</option>");
		}
		oBuffer.push("</select>");
		fieldDom_total = oBuffer.join("");
	}
	return fieldDom_total;
}

/**
 * 删除一个判断条件
 */
function removeLogic(obj){
	$(obj).parent().parent().parent().parent().remove();
}

/**
 * 保存所有的判断条件
 */
function saveLogics(){
	var transitions = new Array();
	var transitionNames = $("#menu9 h3 span");
	for(var i=0;i<transitionNames.length;i++){
		var transition = {};
		transition.transitionName = $(transitionNames[i]).html();
		var logics_ol = $("#ol"+i+" .tiaojian_cs");
		var logics = new Array();
		for(var j=0;j<logics_ol.length;j++){
			var logic = {};
			logic.fieldName = $(logics_ol[j]).find("select[name='fieldName']").val();
			logic.operateName = $(logics_ol[j]).find("select[name='operateName']").val().trim();
			logic.thresholdValue = $(logics_ol[j]).find("input[name='thresholdValue']").val();
			var radios =$(logics_ol[j]).find("input[type='radio']");
			if($(radios[0]).attr("checked")==true){
				logic.conditionType = 0;
			}else{
				logic.conditionType = 1;
			}
			logics.push(logic);
		}
		transition.logics = logics;
		transitions.push(transition);
	}
	var defaultTrasitionName = "";
	var defaultTrasitionRadios = $(".tianjian_r input[type='radio']");
	for(var i=0;i<defaultTrasitionRadios.length;i++){
		if($(defaultTrasitionRadios[i]).attr("checked")==true)
			defaultTrasitionName = $(defaultTrasitionRadios[i]).val();
	}
	var nodeName = $("#nodeName_hidden").val();
	var autoNode = {};
	autoNode.nodeName = nodeName;
	autoNode.transitions = transitions;
	autoNode.defaultTransitionName = defaultTrasitionName;
	CwfService.saveAutoNode(autoNode,{
		callback : function(){
				art.dialog.close();
			},
		errorHandler : function(errorString, exception) {
			art.dialog({
				    content: exception.message,
				    yesFn: true
				});
		}
	})
}