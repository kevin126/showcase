var flag = 'add';
$(document).ready(function() {
	$("div[id^=w]").click(function(){
		$("#cycleBox").append($(this).clone().click(function(){$(this).remove()}));
		$("#cycleError").css('display','none'); 
	});
	$("#cycleName").bind("focus",function(evt){ 
 		$("#nameError").css('display','none'); 
	 }); 
	$("#cycleName").blur(function(evt){ 
 		var cycleName = $("#cycleName").val();
 		if(!Ext.isEmpty(cycleName))
 			isNameConflict(cycleName);
	 });  
});
function isNameConflict(cycleName){
	DutyService.getDutyCycleByName(cycleName,function(returnData){
		if(!Ext.isEmpty(returnData)){
			$("#nameError").text('该周期名已存在，请重新输入！');
			$("#nameError").css('display','block'); 
		}
	})
}

function operateDutyCycle(){
	var cycleId = $("#dutyCycleId").val().trim();
	var cycleName = $("#cycleName").val().trim();
	var unitArray = $("#cycleBox").text();
	var dutyUnits = new Array();
	$("#cycleBox").children().each(function(){
	    dutyUnits.push($(this).attr('title').trim());
	});
	if(''==cycleName || null == cycleName){
		$("#nameError").text("值班周期名不能为空");
		$("#nameError").css('display','block'); 
		return;
	}
	var size = $("#cycleBox").children().length;
	if(0==size){
		$("#cycleError").text("值班班次不能为空");
		$("#cycleError").css('display','block'); 
		return;
	}
	if('add' == flag){
		DutyService.addDutyCycle(cycleName,dutyUnits,{
			callback : function(){
				location.href = "/itsm/duty/viewDutyCycle.do?menuId=m12_3_1";
			},
			errorHandler : function(errorString, exception) {
				if(exception.message == 'M0500034'){//周期名重复
					$("#nameError").text('该周期名已存在，请重新输入！');
					$("#nameError").css('display','block'); 
				}else{//并发时，该周期的某些班次被删除了
				     var errParam = exception.message;
				     errParam = window.encodeURI(errParam);          
                     errParam = window.encodeURI(errParam);   
				     var url = "/itsm/duty/showError.do?errMsg=M0500033&errParam="+errParam;
					 location.href = url;
				}
			}
		});
	}else{
		DutyService.updateDutyCycle(cycleId,cycleName,dutyUnits,{
			callback : function(){
				location.href = "/itsm/duty/viewDutyCycle.do?menuId=m12_3_1";
			},
			errorHandler : function(errorString, exception) {
				if(exception.message == 'M0500034'){//跟其它的周期名称冲突了
					$("#nameError").text('该周期名已存在，请重新输入！');
					$("#nameError").css('display','block'); 
				}else if(exception.message == 'M0500030'){//周期已被删除了
					location.href = "/itsm/duty/showError.do?errMsg=M0500030";
				}else{//并发时，该周期的某些班次被删除了
				     var errParam = exception.message;
				     errParam = window.encodeURI(errParam);          
                     errParam = window.encodeURI(errParam);   
					 location.href = "/itsm/duty/showError.do?errMsg=M0500033&errParam="+errParam;
				}
			}
		});
	}
}
function editDutyCycle(index,cycleId){
	$("#dutyCycleId").val(cycleId);
	$("#cycleName").val($("#name"+index).text());
	$("#cycleBox").html("");
	$("#cycleUnit"+index).children().each(function(){
		//$(this).mouseover(function(){alert('hahahah');$(this).style.cursor='pointer'});
		var obj = $(this).clone();
		obj.mouseover(function(){obj.css('cursor','pointer')});
		obj.click(function(){$(this).remove()});
		$("#cycleBox").append(obj);
	});
	$("#operationName").html("编辑周期");
	flag = 'edit'
}
function deleteDutyCycle(dutyCycleId){
	art.dialog({
		    content: '该操作不可恢复，您确定要删除该值班周期吗？',
		    yesFn: function(){location.href="/itsm/duty/deleteDutyCycle.do?dutyCycleId="+dutyCycleId},
		    noFn: true 
		});
}

function clearDutyCycle(){
	$("#cycleName").val(''); 
	$("#cycleBox").text(''); 
}
