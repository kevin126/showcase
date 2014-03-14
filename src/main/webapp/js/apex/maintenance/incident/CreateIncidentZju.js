
function takeIssueMyself(){
	var currentUserName = document.getElementById("curruntUserName").value;
	var curruntUserRealName = document.getElementById("curruntUserRealName").value;
	document.getElementById('fixedHandlerName').value = currentUserName;
	document.getElementById('fixedHandlerRealName').value = curruntUserRealName;
	$("#fixedHandlerRealName").blur();
}
function selectReceiver(){
	selectedField_total = 'receiveUser';
	var url = "/itsm/common/userQuery.do?selectOne=1&auto=Y&status=submit&exclude=15,16&enter=enter";//auto=Y表示默认就查询出所有的运维人员
    //var s = window.open(url, "", "height=400, width=1100, top=260, left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
	tipsWindown('选择用户','iframe:'+url,'900','420','true','','true','leotheme'); 
}
			
function doCallBack(rtValue){
	
	if('receiveUser' == selectedField_total){
		for(var i=0;i<rtValue.length;i++){
		    for(var j=0;j<rtValue[i].length;j++){
		        if(j==1){
		        	$("#fixedHandlerRealName").attr("value", rtValue[i][j].realName.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
		         	continue;
		        }else if(j==0){
		        	$("#fixedHandlerName").attr("value", rtValue[i][j].name.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
		         	continue;
		        }else if(j==5){
		        	roleNameOfSelectedUser = rtValue[i][j].role.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
		        	continue;
		        }
		    }
		}
		$("#fixedHandlerRealName").blur();
	}else{
		var user = new User();
		for(var i=0;i<rtValue.length;i++){
		    for(var j=0;j<rtValue[i].length;j++){
		        if(j==0){
		        	user.name=rtValue[i][j].name.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
		        	$("#requestUserName").val(user.name);
		         	continue;
		        }else if(j==1){
		        	$("#requestUser").attr("value", rtValue[i][j].realName.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					$("#requestUser").blur();
					user.requestUser=$("#requestUser").val();
		         	continue;
		        }else if(j==2){
		        	$("#jobNumber").attr("value", rtValue[i][j].employeeNo.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					$("#jobNumber").blur();
					user.jobNumber=$("#jobNumber").val();
		         	continue;
		        }else if(j==3){
		        	$("#department").attr("value", rtValue[i][j].depet.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
		        	$("#department").blur();
		        	user.department=$("#department").val();
		         	continue;
		        }else  if(j==6){
		        	$("#internetAccount").attr("value", rtValue[i][j].internetAccount.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					$("#internetAccount").blur();
					user.internetAccount=$("#internetAccount").val();
		         	continue;
		        }else  if(j==7){
		        	$("#email").attr("value",  rtValue[i][j].mail.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					$("#email").blur();
					user.email=$("#email").val();
		         	continue;
		        }else  if(j==8){
		        	$("#phone").attr("value", rtValue[i][j].office.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
					$("#phone").blur();
					user.phone=$("#phone").val();
		         	continue;
		        }
		    }
		}
		(new UserHistoryList()).addHisUser(user);
	}
}





function handleSubmit(){
	if(validateInput())
		document.getElementById("incForm").submit();
}

 function validateInput(){
 	var finalReslut = true;
 	var description = $("#description").val();
 	if(description.length > 20000){
 		$("#descriptionTip").attr("class","onError");
		$("#descriptionTip").text("详细描述不能超过20000字符");
		finalReslut = false;
 	}
 	var incidentType = $("#incidentType").val();
 	if(incidentType.replace(/(^\s*)|(\s*$)/g, "")==''){
 		$("#incidentTypeTip").attr("class","onError");
		$("#incidentTypeTip").text("工单类型不能为空");
		finalReslut = false;
 	}
 	return finalReslut;
 }
 
 function selectRequestUser(){
 	selectedField_total = 'requestUser';
    var url = "/itsm/common/userQuery.do?selectOne=1&enter=enter";
   // var s = window.open(url, "", "height=420, width=1100, top=260, left=100, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no");
    tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme'); 
}



/**
	*@param id 入口select标签id
	*@param value 入口值
	*@param 容器对象
	*@param funCallServer DWR调用方法
	*/
	function SelectValue(id,value ,objEle,funCallServer,fun){
		if(!objEle)return; 
		if(!funCallServer) {
			funCallServer = document.getElementById(id).CallServer;
			fun = document.getElementById(id).fun;
			if(!funCallServer)return;
		}else{
			document.getElementById(id).CallServer=funCallServer;
			document.getElementById(id).fun = fun;
		}
		if(!value){
			deletChildEle(objEle);
		}else{
			objEle.parentNode.cselectE = objEle;
			funCallServer(value,function(option){//调用dwr获取数据
				var setem = objEle;
				var fun = document.getElementById(id).fun;
				if(setem){
					deletChildEle(setem);
				}
				if(option && option.length>0){
					var selectStr = "<select id='select_"+ id+"_"+value+"' onchange=\"SelectValue('"+id+"',this.value,this)\" >";
					selectStr += "<option value=''  ></option>";
					for(var co in option){
						var sid = option[co].id?option[co].id:'';
						var sval = option[co].name?option[co].name:'';
						if( sid&& sval)selectStr += "<option value='"+ sid+"'  >"+sval+"</option>";
					}
					selectStr +="</select>";
					jQuery("#"+id).append(selectStr);
					setem.childSelectE =document.getElementById('select_'+id+"_"+value);
					document.getElementById('select_'+id+"_"+value).parentSelectEle = setem;
					setem.childSelectE.CallServer=funCallServer; 
				}
				/*if($('#knoType').val()=='0'){
					$('#knoType').val($('#select_0').val());
				}*/
				if(fun){
					var el = document.getElementById('select_'+ id+"_"+value);
					if(!el){
						fun(setem);
					}else{
						fun(el);//调用传入额外的函数 最后一个select 标签
					}
				}
			});
		}
	}
	
	function deletChildEle(objEle){
		if(objEle){
			if(objEle.childSelectE){
				deletChildEle(objEle.childSelectE);
				jQuery('#'+objEle.childSelectE.id).remove();
				delete objEle.childSelectE;
			}
		}
	}

	///////////////////////////////////////////////
	if(!document.getElementById("createKnowTR")){
		document.write(" <input type='hidden' value='0' name='createKnow'  />");
	}
	
	
	/**查询全部工单*/
	function queryIssueAll(){
		$('#currentPage').val(1);
		$('#AsynPageUrl').val('/itsm/servicedesk/ZjuINClistAction.do?method=allIncIssue');
		$('#totalPage').val(1);
		$('#pageSize').val(20);
		AsynchronousQuery(1);
	}
	/**查询工单*/
	function queryIssue(){
		var empno = $('#jobNumber').val();
		var tel   = $('#phone').val();
		var startDate = $('#startDate').val();
		var endDate = $('#endDate').val();
		$('#currentPage').val(1);
		$('#AsynPageUrl').val('/itsm/servicedesk/ZjuINClistAction.do?method=allIncIssue&tel='+tel+'&empno='+empno+'&s='+startDate+'&e='+endDate);
		$('#totalPage').val(1);
		$('#pageSize').val(20);
		AsynchronousQuery(1);
		
	}
	
	/**查询流程记录*/
	function queryIssueRecord(processCode,title)
	{
	   var xml = {
	   		processCode : processCode,
	   		title :title
	   }
	   var url = this.url;
	   jQuery.ajax(
	   {
	      data :xml,
	      dataType : 'html',
	      type : 'post',
	      url : '/itsm/servicedesk/ZjuINClistAction.do?method=issueRecordList',
	      success : function(html)
	      {
	      		$('#issueRecord').html(html);
	      }
	   }
	   );
	}
	
	/**查询工单的用户数据**/
	function queryWfRecordUser(proccode){
		IncidentService.getIncidentItemByProcessCode(proccode,function(incData){
			document.CurINCData = incData;
			for(var par in incData){
				$('#'+par+'_').val(incData[par]);
			}
		})
	
	}
	
	/**更新工单用户数据*/
	function updaeWfRecordUser(){
		var s = $.formValidator.pageIsValid('2');
		if(!s){
			return;
		}
		var incData = document.CurINCData;
		for(var par in incData){
			var ele = document.getElementById(par+"_");
			if(ele){
				incData[par]= ele.value;
			}
		}
		IncidentService.updataWf(incData,function(){
			alert('更新成功！');
		})
	
	}
	
	
	//直接解决工单
	function directResolve(){
		var s = $.formValidator.pageIsValid('1');
		if(s){
			document.getElementById("incForm").action = "/itsm/incident/directResolve.do";
			document.getElementById("incForm").submit();
		}
		  
	}
	
	function dosubmitWf(){
		var s = $.formValidator.pageIsValid('1');
		if(s){
			document.getElementById("incForm").submit();
		}
	}
	