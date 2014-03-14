var number_total = '';//全局变量，用于标识当前是操作哪一天的值班班次
/**
 * 打开选择用户的窗口
 */
function selectDutyPerson(number){
	number_total = number;
	selectedField_total = 'receiveUser';
	var url = "/itsm/common/userQuery.do?selectOne=2&auto=Y&status=submit&exclude=15,16&enter=enter";//auto=Y表示默认就查询出所有的运维人员
	tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
	//art.dialog.open('/itsm/common/userQuery.do?selectOne=2&auto=Y&status=submit&exclude=15,16&enter=enter', {limit: false,skin:'none',title:false,lock:false,width:'1100px',height:'720px'});
}

/**
 * 选择完用户后的回调函数
 */
function doCallBack(rtValue){
	for(var i=0;i<rtValue.length;i++){
		var tempRealName = "";
    	var tempUserId = 0;
		for(var j=0;j<rtValue[i].length;j++){
			if(j==1){
	        	tempRealName  = rtValue[i][j].realName.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
	         	continue;
	        }else if(j==9){
	        	tempUserId = rtValue[i][j].id;
	         	continue;
	        }
	    }
	    insertDutyPerson(tempRealName,tempUserId);
	}
}

/**
 * 将用户插入表格指定格中
 */
function insertDutyPerson(realName,userId){
	if($("#li_"+number_total+"_"+userId).length>0)//该用户已经添加了
		return;
	var oBuffer = new Array();
	     oBuffer.push("<li class='zbr_ul_li' id='li_"+number_total+"_"+userId+"'> <span>");
	     oBuffer.push(realName);
	     oBuffer.push("</span><em><input type='button' class='del_rlr all_butt' onClick='removeDutyPerson(\""+number_total+"\",\""+userId+"\");'/>");
	     oBuffer.push("<input type='hidden' id='userId"+number_total+"' value='"+userId+"' />");
	     oBuffer.push("</em></li>");
	if($("#addDutyPerson"+number_total).length > 0){//已经有用户，再添加用户
	     $(oBuffer.join("")).insertBefore($("#addDutyPerson"+number_total));
	}else{//第一次选择用户
		$("#btn"+number_total).remove();
		$("#ul"+number_total).append(oBuffer.join(""));
 		$("#ul"+number_total).append("<li id='addDutyPerson"+number_total+"' class='zbr_ul_li_add'><input type='button' class='add_rlr all_butt' value='添加' onclick='selectDutyPerson(\""+number_total+"\");'/></li>")
	}
}

/**
 * 删除指定的值班用户
 */
function removeDutyPerson(number,userId){
	$("#li_"+number+"_"+userId).remove();
	if($("#ul"+number).children().length == 1){//没有选择任何用户
		$("#ul"+number).empty();
		$("#ul"+number).append("<li id='btn"+number+"'><input type='button' class='gg_bg all_butt' value='添加值班人' onclick='selectDutyPerson(\""+number+"\");'/></li>")
	}
}

function saveDutyRecordByWeek(){
	var number = $("#dataTable tr").length;
	var dutyArrangeWeeks = new Array();
	for(var i=0;i<number-1;i++){
		dutyArrangeWeek = {};
		var dutyUintName = $("#dutyUnit"+i).html();
		dutyArrangeWeek.dutyUnitName = dutyUintName;
		//计算星期一的值班人
		var dutyPersons1 = new Array();
		var dutyPersonNames1 = new Array();
		if($("#ul"+i+"1").children().length >1){
			$("#ul"+i+"1").children(".zbr_ul_li").each(function(){
			 	dutyPersonNames1.push($(this).children("span").html());
			 	dutyPersons1.push($(this).children("em").children("input[type='hidden']").val())
			})
		}
		dutyArrangeWeek.dutyPersons1 = dutyPersons1;
		dutyArrangeWeek.dutyPersonNames1 = dutyPersonNames1;
		
		//计算星期二的值班人
		var dutyPersons2 = new Array();
		var dutyPersonNames2 = new Array();
		if($("#ul"+i+"2").children().length >1){
			$("#ul"+i+"2").children(".zbr_ul_li").each(function(){
			 	dutyPersonNames2.push($(this).children("span").html());
			 	dutyPersons2.push($(this).children("em").children("input[type='hidden']").val())
			})
		}
		dutyArrangeWeek.dutyPersons2 = dutyPersons2;
		dutyArrangeWeek.dutyPersonNames2 = dutyPersonNames2;
		
		//计算星期三的值班人
		var dutyPersons3 = new Array();
		var dutyPersonNames3 = new Array();
		if($("#ul"+i+"3").children().length >1){
			$("#ul"+i+"3").children(".zbr_ul_li").each(function(){
			 	dutyPersonNames3.push($(this).children("span").html());
			 	dutyPersons3.push($(this).children("em").children("input[type='hidden']").val())
			})
		}
		dutyArrangeWeek.dutyPersons3 = dutyPersons3;
		dutyArrangeWeek.dutyPersonNames3 = dutyPersonNames3;
		
		//计算星期四的值班人
		var dutyPersons4 = new Array();
		var dutyPersonNames4 = new Array();
		if($("#ul"+i+"4").children().length >1){
			$("#ul"+i+"4").children(".zbr_ul_li").each(function(){
			 	dutyPersonNames4.push($(this).children("span").html());
			 	dutyPersons4.push($(this).children("em").children("input[type='hidden']").val())
			})
		}
		dutyArrangeWeek.dutyPersons4 = dutyPersons4;
		dutyArrangeWeek.dutyPersonNames4 = dutyPersonNames4;
		
		//计算星期五的值班人
		var dutyPersons5 = new Array();
		var dutyPersonNames5 = new Array();
		if($("#ul"+i+"5").children().length >1){
			$("#ul"+i+"5").children(".zbr_ul_li").each(function(){
			 	dutyPersonNames5.push($(this).children("span").html());
			 	dutyPersons5.push($(this).children("em").children("input[type='hidden']").val())
			})
		}
		dutyArrangeWeek.dutyPersons5 = dutyPersons5;
		dutyArrangeWeek.dutyPersonNames5 = dutyPersonNames5;
		
		//计算星期六的值班人
		var dutyPersons6 = new Array();
		var dutyPersonNames6 = new Array();
		if($("#ul"+i+"6").children().length >1){
			$("#ul"+i+"6").children(".zbr_ul_li").each(function(){
			 	dutyPersonNames6.push($(this).children("span").html());
			 	dutyPersons6.push($(this).children("em").children("input[type='hidden']").val())
			})
		}
		dutyArrangeWeek.dutyPersons6 = dutyPersons6;
		dutyArrangeWeek.dutyPersonNames6 = dutyPersonNames6;
		
		//计算星期日的值班人
		var dutyPersons7 = new Array();
		var dutyPersonNames7 = new Array();
		if($("#ul"+i+"7").children().length >1){
			$("#ul"+i+"7").children(".zbr_ul_li").each(function(){
			 	dutyPersonNames7.push($(this).children("span").html());
			 	dutyPersons7.push($(this).children("em").children("input[type='hidden']").val())
			})
		}
		dutyArrangeWeek.dutyPersons7 = dutyPersons7;
		dutyArrangeWeek.dutyPersonNames7 = dutyPersonNames7;
		
		dutyArrangeWeeks.push(dutyArrangeWeek);	
	}
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	if(Ext.isEmpty(startDate)){
		art.dialog({
					lock: true,
				    content: '开始日期不能为空，请设置！',
				    yesFn: true
				});
		return;
	}
	if(Ext.isEmpty(endDate)){
		art.dialog({
					lock: true,
				    content: '结束日期不能为空，请设置！',
				    yesFn: true
				});
		return;
	}
	var startDateValue = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime(); 
	var endDateValue = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime(); 
	if(startDateValue>= endDateValue){
		art.dialog({
					lock: true,
				    content: '结束日期必须晚于开始日期，请重新设置！',
				    yesFn: true
				});
		return;
	}
	showOssWaitMsg("正在保存数据，请耐心等待！")
	DutyService.arrangeDutyByWeek(dutyArrangeWeeks,startDateValue,endDateValue,{
		callback : function(){
				hideOssWaitMsg();
				art.dialog({
					lock: true,
				    content: '排班已成功，点击确定以继续操作！',
				    yesFn: true
				});
			},
		errorHandler : function(errorString, exception) {
			hideOssWaitMsg();
			art.dialog({
					lock: true,
				    content: exception.message,
				    yesFn: true
				});
		}
	})
}
/**
 * 保存按天排班记录
 */
function saveDutyRecordByDay(){
    var isTemplate=document.getElementById("template").checked;
    if(!isTemplate){
    	var type = $("input[name='radio']:checked").val();
		if(type=="week"){
			art.dialog({
				lock: true,
			    content: '请点击应用按钮，进行按周排班操作！',
			    yesFn: true
			});
			return ;
		}
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		if(Ext.isEmpty(startDate)){
			art.dialog({
						lock: true,
					    content: '开始日期不能为空，请设置！',
					    yesFn: true
					});
			return;
		}
		if(Ext.isEmpty(endDate)){
			art.dialog({
						lock: true,
					    content: '结束日期不能为空，请设置！',
					    yesFn: true
					});
			return;
		}
		var startDateValue = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime(); 
		var endDateValue = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime(); 
		if(startDateValue>= endDateValue){
			art.dialog({
						lock: true,
					    content: '结束日期必须晚于开始日期，请重新设置！',
					    yesFn: true
					});
			return;
		}
	}
	var dutyArrangeDays=genrateTemplateDataByDay();
	if(!isTemplate){
	showOssWaitMsg("正在保存数据，请耐心等待！")
	DutyService.arrangeDutyByDay(dutyArrangeDays,startDateValue,endDateValue,{
		callback : function(){
				hideOssWaitMsg();
				art.dialog({
					lock: true,
				    content: '排班已成功，点击确定以继续操作！',
				    yesFn: true
				});
			},
		errorHandler : function(errorString, exception) {
			hideOssWaitMsg();
			art.dialog({
					lock: true,
				    content: exception.message,
				    yesFn: true
				});
		}
	});
	}else{
		DutyService.arrangeDutyTemplateStore(dutyArrangeDays,1,{
			callback : function(){
					//alert("store success!");
				},
			errorHandler : function(errorString, exception) {
				art.dialog({
						lock: true,
					    content: exception.message,
					    yesFn: true
					});
			}
		});
		window.location='/itsm/duty/template.do?method=preAddTemplate';
	}
}
/**应用模板*/
function applyTemplate(templateId){
	//当前排班，班次个数
	var unitNumber = $("#dataTable tr").length-1;
	//当前排班的天数
	var days = $("#dataTable tr:first td").length-1;
	//alert("班次数:"+unitNumber+" 天数:"+days);
	//没有选择任何模板
	if(templateId==0){
		//遍历所有的班次
		for(var i=0;i<unitNumber;i++){
			for(var j=0;j<days;j++){
				$("#ul"+i+j).html("");
				$("#ul"+i+j).append("<li id='btn"+i+j+"'><input type='button' class='gg_bg all_butt' value='添加值班人' onclick='selectDutyPerson(\""+i+j+"\");'/></li>")
			}
		}
		return ;
	}
	//加载模板信息
	DutyService.getDutyTemplateByIdToJson(templateId,{
			callback : function(dutyArrangeDays){
					//遍历所有的班次
					for(var i=0;i<unitNumber;i++){
						//排班班次数小于等于模板中的班次，使用模板
						if(i<dutyArrangeDays.length){
							//alert("rows "+i+" apply");
							//获取当前班次[行]对应的模板信息
							var dutyArrangeDay=dutyArrangeDays[i];
							var dutyDetails=dutyArrangeDay.detail;
							//获取模板中的天数
							var templateDayNum=dutyDetails.length;
							//遍历当前班次下的所有天
							 for(var j=0;j<days;j++){
							 	//如果当前排班天数少于等于模板中的，则直接应用
								if(j<templateDayNum){
									//拿到表单元素信息
									$("#ul"+i+j).html("");
									//------------------------------------------------------------------
									//指定天的模板
									var dayTemplate=dutyDetails[j];
									//模板中的用户信息为空
									if(dayTemplate.personsIds.length==0){
										$("#ul"+i+j).append("<li id='btn"+i+j+"'><input type='button' class='gg_bg all_butt' value='添加值班人' onclick='selectDutyPerson(\""+i+j+"\");'/></li>")
									}else{ //模板中的用户不为空
										applyTemplateDetail(dayTemplate,i,j);
									}
									//------------------------------------------------------------------
									//使用模板修改信息
								}else{//如果当前排班天数大于模板中的，则循环应用模板内容
									var templateId=j%templateDayNum; //找到使用的模板
									$("#ul"+i+j).html("");
									//指定天的模板
									var dayTemplate=dutyDetails[templateId];
									//------------------------------------------------------------------
									applyTemplateDetail(dayTemplate,i,j);
									//------------------------------------------------------------------
								}
							 }
						}else{//排班班次数大于模板中的班次，将多于部分清空
							for(var index=0;index<days;index++){
								$("#ul"+i+index).html("");
								$("#ul"+i+index).append("<li id='btn"+i+index+"'><input type='button' class='gg_bg all_butt' value='添加值班人' onclick='selectDutyPerson(\""+i+index+"\");'/></li>")
							}
						}
					}
				},
			//错误处理
			errorHandler : function(errorString, exception) {
				//弹出消息框
				art.dialog({
						lock: true,
					    content: exception.message,
					    yesFn: true
					});
			}
	});
}
/**应用模板到具体单元格中*/
function applyTemplateDetail(dayTemplate,i,j){
	//模板中的用户信息为空
	if(dayTemplate.personsIds.length==0){
		$("#ul"+i+j).append("<li id='btn"+i+j+"'><input type='button' class='gg_bg all_butt' value='添加值班人' onclick='selectDutyPerson(\""+i+j+"\");'/></li>")
	}else{ //模板中的用户不为空
		var oBuffer = new Array();
		//获取当前模板中的用户标识
		var personsIds=dayTemplate.personsIds;
		//获取当前模板中的用户名称
		var personsNames=dayTemplate.personsNames;
		//将模板中的多个用户加入
		for(var idx=0;idx<personsIds.length;idx++){
			oBuffer.push("<li class='zbr_ul_li' id='li_"+i+j+"_"+personsIds[idx]+"'> <span>");
    		//设置用户名 如果用户名称为空，说明该用户已经被删掉了
    		oBuffer.push(personsNames[idx]);
    		oBuffer.push("</span><em><input type='button' class='del_rlr all_butt' onClick='removeDutyPerson(\""+i+j+"\",\""+personsIds[idx]+"\");'/>");
    		oBuffer.push("<input type='hidden' id='userId"+i+j+"' value='"+personsIds[idx]+"' />");
    		oBuffer.push("</em></li>");
		}
		$("#ul"+i+j).append(oBuffer.join(""));
		$("#ul"+i+j).append("<li id='addDutyPerson"+i+j+"' class='zbr_ul_li_add'><input type='button' class='add_rlr all_butt' value='添加' onclick='selectDutyPerson(\""+i+j+"\");'/></li>")
	}
}

/**保存按周信息，包括模板和排班*/
function dutyRecordByWeek(){
	var isTemplate=document.getElementById("template").checked;
	if(!isTemplate){
		var type = $("input[name='radio']:checked").val();
		if(type=="day"){
			art.dialog({
				lock: true,
			    content: '请输入天数，点击应用按钮，进行按天排班操作！',
			    yesFn: true
			});
			document.getElementById('daysNum').focus();
			return ;
		}
		saveDutyRecordByWeek();
	}else{
		var dutyArrangeDays=genrateTemplateDataByWeek();
		DutyService.arrangeDutyTemplateStore(dutyArrangeDays,0,{
			callback : function(){
					//alert("store success!");
				},
			errorHandler : function(errorString, exception) {
				art.dialog({
						lock: true,
					    content: exception.message,
					    yesFn: true
					});
			}
		});
		window.location='/itsm/duty/template.do?method=preAddTemplate';
	}
}
/**生成按天排班模板*/
function genrateTemplateDataByDay(){
	//班次个数
	var number = $("#dataTable tr").length;
	//天数
	var days = $("#dataTable tr:first td").length-1;
	//存放所有天的记录
	var dutyArrangeDays = new Array();
	//以班次为主线
	for(var i=0;i<number-1;i++){
		 //存放一天对应的所有班次记录
		 var dutyArrangeDay={};
		 //值班详细信息
		 var detail=new Array();
		 //获取班次名称
		 var dutyUintName = $("#dutyUnit"+i).html();
		 //遍历指定班次下的所有天
		 for(var j=0;j<days;j++){
		 	//如果班次人员信息有修改，则保存
		 	if($("#ul"+i+j).children().length >1){
		 		//排班详细信息
		 		var dutyArrangeDayDetail={};
		 		//存储值班人名称
		 		var personsNames=new Array();
		 		var personsIds=new Array();
		 		//遍历指定天的所有值班人
				$("#ul"+i+j).children(".zbr_ul_li").each(function(){
					//存入指定值班人名称
					personsNames.push($(this).children("span").html());
					//存入指定值班人标识
					personsIds.push($(this).children("em").children("input[type='hidden']").val());
				})
		 		dutyArrangeDayDetail.personsNames=personsNames;
		 		dutyArrangeDayDetail.personsIds=personsIds;
		 		detail.push(dutyArrangeDayDetail);
		 	}else{
		 		//排班详细信息
		 		var dutyArrangeDayDetail={};
		 		//存储值班人名称
		 		var personsNames=new Array();
		 		var personsIds=new Array();
		 		dutyArrangeDayDetail.personsNames=personsNames;
		 		dutyArrangeDayDetail.personsIds=personsIds;
		 		detail.push(dutyArrangeDayDetail);
		 	}
		 }
		 //设置详细信息
		 dutyArrangeDay.detail=detail;
		 //设置班次名称
		 dutyArrangeDay.dutyUnitName=dutyUintName;
		 dutyArrangeDays.push(dutyArrangeDay);
	}
	return dutyArrangeDays;
}
/**生成按周排班模板，同按天方法区别在于j从1开始*/
function genrateTemplateDataByWeek(){
	//班次个数
	var number = $("#dataTable tr").length;
	//天数
	var days = $("#dataTable tr:first td").length-1;
	//存放所有天的记录
	var dutyArrangeDays = new Array();
	//以班次为主线
	for(var i=0;i<number-1;i++){
		 //存放一天对应的所有班次记录
		 var dutyArrangeDay={};
		 //值班详细信息
		 var detail=new Array();
		 //获取班次名称
		 var dutyUintName = $("#dutyUnit"+i).html();
		 //遍历指定班次下的所有天
		 for(var j=1;j<=days;j++){
		 	//如果班次人员信息有修改，则保存
		 	if($("#ul"+i+j).children().length >1){
		 		//排班详细信息
		 		var dutyArrangeDayDetail={};
		 		//存储值班人名称
		 		var personsNames=new Array();
		 		var personsIds=new Array();
		 		//遍历指定天的所有值班人
				$("#ul"+i+j).children(".zbr_ul_li").each(function(){
					//存入指定值班人名称
					personsNames.push($(this).children("span").html());
					//存入指定值班人标识
					personsIds.push($(this).children("em").children("input[type='hidden']").val());
				})
		 		dutyArrangeDayDetail.personsNames=personsNames;
		 		dutyArrangeDayDetail.personsIds=personsIds;
		 		detail.push(dutyArrangeDayDetail);
		 	}else{
		 		//排班详细信息
		 		var dutyArrangeDayDetail={};
		 		//存储值班人名称
		 		var personsNames=new Array();
		 		var personsIds=new Array();
		 		dutyArrangeDayDetail.personsNames=personsNames;
		 		dutyArrangeDayDetail.personsIds=personsIds;
		 		detail.push(dutyArrangeDayDetail);
		 	}
		 }
		 //设置详细信息
		 dutyArrangeDay.detail=detail;
		 //设置班次名称
		 dutyArrangeDay.dutyUnitName=dutyUintName;
		 dutyArrangeDays.push(dutyArrangeDay);
	}
	return dutyArrangeDays;
}

/**应用模板,与天不同的是生成div下标从1开始*/
function applyWeekTemplate(templateId){
	//当前排班，班次个数
	var unitNumber = $("#dataTable tr").length-1;
	//当前排班的天数
	var days = $("#dataTable tr:first td").length-1;
	//alert("班次数:"+unitNumber+" 天数:"+days);
	//没有选择任何模板
	if(templateId==0){
		//遍历所有的班次
		for(var i=0;i<unitNumber;i++){
			for(var j=1;j<=days;j++){
				$("#ul"+i+j).html("");
				$("#ul"+i+j).append("<li id='btn"+i+j+"'><input type='button' class='gg_bg all_butt' value='添加值班人' onclick='selectDutyPerson(\""+i+j+"\");'/></li>")
			}
		}
		return ;
	}
	//加载模板信息
	DutyService.getDutyTemplateByIdToJson(templateId,{
			callback : function(dutyArrangeDays){
					//遍历所有的班次
					for(var i=0;i<unitNumber;i++){
						//排班班次数小于等于模板中的班次，使用模板
						if(i<dutyArrangeDays.length){
							//alert("rows "+i+" apply");
							//获取当前班次[行]对应的模板信息
							var dutyArrangeDay=dutyArrangeDays[i];
							var dutyDetails=dutyArrangeDay.detail;
							//获取模板中的天数
							var templateDayNum=dutyDetails.length;
							//遍历当前班次下的所有天
							 for(var j=1;j<=days;j++){
							 	//如果当前排班天数少于等于模板中的，则直接应用
								if(j<=templateDayNum){
									//拿到表单元素信息
									$("#ul"+i+j).html("");
									//------------------------------------------------------------------
									//指定天的模板
									var dayTemplate=dutyDetails[j-1];
									//模板中的用户信息为空
									if(dayTemplate.personsIds.length==0){
										$("#ul"+i+j).append("<li id='btn"+i+j+"'><input type='button' class='gg_bg all_butt' value='添加值班人' onclick='selectDutyPerson(\""+i+j+"\");'/></li>")
									}else{ //模板中的用户不为空
										applyTemplateDetail(dayTemplate,i,j);
									}
									//------------------------------------------------------------------
									//使用模板修改信息
								}else{//如果当前排班天数大于模板中的，则循环应用模板内容
									var templateId=j%templateDayNum; //找到使用的模板
									$("#ul"+i+j).html("");
									//指定天的模板
									var dayTemplate=dutyDetails[templateId];
									//------------------------------------------------------------------
									applyTemplateDetail(dayTemplate,i,j);
									//------------------------------------------------------------------
								}
							 }
						}else{//排班班次数大于模板中的班次，将多于部分清空
							for(var index=0;index<days;index++){
								$("#ul"+i+index).html("");
								$("#ul"+i+index).append("<li id='btn"+i+index+"'><input type='button' class='gg_bg all_butt' value='添加值班人' onclick='selectDutyPerson(\""+i+index+"\");'/></li>")
							}
							
						}
					}
				},
			//错误处理
			errorHandler : function(errorString, exception) {
				//弹出消息框
				art.dialog({
						lock: true,
					    content: exception.message,
					    yesFn: true
					});
			}
	});
}
/**修改值班模板*/
function updateDutyTemplate(templateId,description){
	//alert("templateId: "+templateId+" description:"+description);
	if(description.length>200){
		art.dialog({
					lock: true,
				    content: '模板描述选填, 最多200个字符！',
				    yesFn: true
				});
		return ;
	}
	var dutyArrangeDays=genrateTemplateDataByDay();
	showOssWaitMsg("正在保存数据，请耐心等待！")
	DutyService.updateDutyTemplate(templateId,dutyArrangeDays,description,{
		callback : function(){
				hideOssWaitMsg();
				art.dialog({
					lock: true,
				    content: '模板保存成功，点击确定以继续操作！',
				    yesFn: true
				});
			},
		errorHandler : function(errorString, exception) {
			hideOssWaitMsg();
			art.dialog({
					lock: true,
				    content: exception.message,
				    yesFn: true
				});
		}
	});
}
/**显示删除值班模板层*/
function enterDelete(deleteId) {
	$("#deleteId").attr("value", deleteId);
	$("#delete").attr("style", "display: block");
}
/**删除值班模板*/
function deleteTemplate() {
	var deleteId = $("#deleteId").val();
	location.href = "/itsm/duty/template.do?method=delete&templateId=" + deleteId;
}