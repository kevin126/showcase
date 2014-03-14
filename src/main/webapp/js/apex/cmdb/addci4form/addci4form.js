var dataBoxDataMap = new Object();//页面数据缓存
var OSSfexDataMap = new Object();//下拉框,单选等 数据值集合缓存(需要时从数据库加载一次)
function choseType(){
	var treePanel = new Apex.cmdb.citype.CITreePanel();
	//显示CI类型树，选中类型后，类型ID会赋值给隐藏文本 
	showTreeWin(treePanel, 'ciType', 'selectedCiTypeId');
} 
window.onerror = function myerrorsw(){}
function showTreeWin(treePanel, field, hiddenField){
		var ciTypeWindow = new Ext.Window({
			title : '选择CI类型',
			closable : true,
			width : 260,
			autoHeight : true,
			plain : true,
			resizable : false,
			modal : true,
			items : [treePanel],
			buttons : [
				{text : '确定',
					handler : function() {
						var node = treePanel.getSelectionModel().getSelectedNode();
						if(node){
							setFieldValue(node, field, hiddenField);
						}
						if(node.id != '0'){
							ciTypeWindow.close();
						}
					}
				},
				{text : '取消',
					handler : function() {
						ciTypeWindow.close();
					}
				}
			]
		});
		var hiddenCiTypeIcon = new Object();
		treePanel.on("dblclick", function(node, evt){
			var node = treePanel.getSelectionModel().getSelectedNode();
			if(node){
				setFieldValue(node, field, hiddenField, hiddenCiTypeIcon);
			}
			if(node.id != '0'){
				ciTypeWindow.close();
			}
		});
		ciTypeWindow.show();
}

function setFieldValue(node, field, hiddenField, hiddenCiTypeIcon){
	if(node.disabled || node.id == '0'){
		Ext.MessageBox.show({
			title: '警告',
			msg: '根节点不允许选择！',
			buttons : Ext.MessageBox.OK,
			icon : Ext.MessageBox.WARNING
		});
		return;
		//$("#"+field).val("");
	}else{
		$("#"+field).val(getPathName(node));
		$("#"+hiddenField).val(node.id);
		var type = node.id;
		CIService.getCINodeBycitype(type,{callback:function(data){ //返回对象为CINode
					if($("#CIID").val()==''){
						$("#CIID").val("AUTO")
					};
	         		// 对查询出的公共属性值加入到页面数据对象中
	         		fillCiData2DataMap($("#CIID").val(),data);
	         		
	         		//将CI属性填充指定区域
	         		fillCiProperty(data);
	         		$("#ciName").val("")
	         		var customfields = new Array();
	         		for(var par in data.cmList){
	         			var tem = data.cmList[par];
	       				if(!data.cmList[par].isCommonColumn){
		         			customfields.push(data.cmList[par]);
	       				}
	         		}
	         		fillCustomCiProperty(customfields);
	        		fillCustomCiData2DataMap($("#CIID").val(),customfields);
					$.formValidator.pageIsValid('1');
	         	},
	         	errorHandler: function(msg, exc){
	         		alert(msg );
	         	}
	         }
	     );
     }
     
     function getPathName(node ){
		if(node ){
			if(node.text=='CI类型')return"";
			var pName= getPathName(node.parentNode);
			if(pName==""){
				return node.text;
			}else{
				return pName+"/" +node.text;
			}
		}else{
			return "";
		}
	}
	
   				
}

/**
 * 填充自定义属性
 */
function fillCustomCiProperty(data){
//	alert("自定义属性个数："+data.length);
	var trs = $("#CI_CUST_PROP_TABLE tr");
//	alert(trs.length);
	var table = $("#CI_CUST_PROP_TABLE");
	
	//清除原有行
	for(var j=0; j< trs.length; j++){
		$("#CI_CUST_PROP_TABLE tr:eq(0)").remove(); 
	}
	
	if(!data || !data.length || data.length == 0){//无自定义属性
		table.append("<tr><td colspan=2 class='css_bai_bg'><font color='#D2691E'>该CI没有自定义属性.</font></td></tr>");
		return;
	}
	//循环输出自定义属性
	/*
	for(var i=0; i< data.length; i++){
		var colValue = (data[i].columnValueStr == null ? '' : data[i].columnValueStr);
		var trStr = "<tr><td class=\"css_lan_bg\">"+ data[i].displayName +"</td><td><input name=\"" + data[i].dbColumn + "\" id=\""+ data[i].dbColumn +"\" type=\"text\" class=\"input_style\" value=\""+ colValue +"\" style=\"width: 140px;\"></td></tr>";
		table.append(trStr);
	}
	*/
	//------------- add by wjdeng at 6/28
	writCustomPropertyHtml(data,table);
	//-------------- end 
}

/**
 * 填充CI公共属性
 */
function fillCiProperty(data){
	$("#ciName").val(data.text == null ? "":data.text);
	//$("#ciType").val(data.ciType == null ? "":data.ciType);
	//$("#ciTypeId").val(data.ciTypeId == null ? "":data.ciTypeId);
	$("#code").val(data.ciCode == null ? "":data.ciCode);
	$("#version").val(data.version == null ? "":data.version);
	//----------modify bywjdeng
	$("#manager").val(data.manager == null ? "":data.manager);
	$("#manager").attr("flexSetId", (!data.managerId  ? "":data.managerId));
	$("#phone").val(data.phone == null ? "":data.phone);
	$("#position").val( data.position == null ? "":data.position);
	$("#source").val( data.source == null ? "":data.source);
	var manufacturerName = data.manufacturerName?data.manufacturerName : (data.cmList.configuration_manufacturer?data.cmList.configuration_manufacturer.columnValueStr:'');//data.cmList.configuration_manufacturer.columnValueStr;
	//var mn1 = data.cmList.configuration_manufacturer;
	$("#manufacturer").val((!manufacturerName)?'':manufacturerName);
	var manufacturerId = data.manufacturerId?data.manufacturerId : (data.cmList.configuration_manufacturer?data.cmList.configuration_manufacturer.flexSetId:'');//data.cmList.configuration_manufacturer.flexSetId;
	$("#manufacturerId").val((!manufacturerId)?'':manufacturerId);
	var supplierName = data.supplierName?data.supplierName:(data.cmList.configuration_supplier?data.cmList.configuration_supplier.columnValueStr:'');//data.cmList.configuration_supplier.columnValueStr;
	$("#supplier").val((!supplierName)?'':supplierName);
	var supplierId = data.supplierId?data.supplierId:(data.cmList.configuration_supplier?data.cmList.configuration_supplier.flexSetId:'');//data.cmList.configuration_supplier.flexSetId;
	$("#supplierId").val((!supplierId)?'':supplierId);
	//--------------end
	$("#memo").val(data.memo == null ? "":data.memo);
	
//	//自定义属性
//	var cmList = new Array();
//	for(var cm in data.columnModelMap){
//		var cmtem = data.columnModelMap[cm];
//		if(cmtem){
//			if(!cmtem.isCommonColumn){
//				cmList.push(data.columnModelMap[cm]);
//			}
//		}
//	}
//	
//	fillCustomCiProperty(cmList);
	
}


//将从后台取得的数据存储到存储top图中节点公共属性
function fillCiData2DataMap(ciid,data){
	dataBoxDataMap[ciid]={
		text 		: data.text == null ? "":data.text,
		ciType 		: data.ciType == null ? "":data.ciType,
		ciTypeId 	: data.ciTypeId == null ? "":data.ciTypeId,
		ciCode 		: data.ciCode == null ? "":data.ciCode,
		version 	: data.version == null ? "":data.version,
		manager 	: data.manager == null ? "":data.manager,
		managerId	: data.managerId == null ? "":data.managerId, 
		phone 		: data.phone == null ? "":data.phone,
		position	: data.position == null ? "":data.position,
		source 		: data.source == null ? "":data.source,
		manufacturerName: data.manufacturer == null ? "":data.manufacturerName,
		supplierName: data.supplier == null ? "":data.supplierName,
		manufacturerId :data.manufacturerId == null ? "":data.manufacturerId,
		supplierId  : data.supplierId == null ? "":data.supplierId,
		memo 		: data.memo == null ? "":data.memo,
		cmList		: data.cmList
	}
}
//将从后台取得的数据存储top图中节点自定义属性
function fillCustomCiData2DataMap(ciid,data){
	if(typeof(dataBoxDataMap[ciid])=='undefined' ){
		dataBoxDataMap[ciid]=new Object();
	}
	dataBoxDataMap[ciid].CustomCiProperty = data;//自定义属性
	for(var i=0; i< data.length; i++){
		var colValue = (data[i].columnValueStr == null ? '' : data[i].columnValueStr);
		var dbColumn = data[i].dbColumn;
		dataBoxDataMap[ciid][dbColumn]={
			dbColumn : dbColumn,
			columnValueStr:colValue,
			displayName:data[i].displayName,
			isCommonColumn:false
			//colValue;//自定义属性值
		}
	}
	
}


//自定义属性列页面输出
function writCustomPropertyHtml(columModels,table){
	//return ;
	 if(!columModels){
	 	return;
	 }
	 for( var i=0 ;i <columModels.length; i++){
	 	var col = columModels[i];
	 	var colValue = (col.columnValueStr == null ? '' : col.columnValueStr);
		var trStr = "<tr><td width='20%' class='css_lan_bg'><div class='cicss_t'>"+ col.displayName +"</div></td>";
		if(col.htmlType=='flex'){//下拉选项框
			builderSelectTD(col,table);
		}else if(col.htmlType=='radio'){//单选框
			builderRadioTD(col,table);
		}else if(col.htmlType=='one_string'||col.htmlType=='float'||col.htmlType=='integer'){//单行文本
			buliderInputTD(col,table);
		}else if(col.htmlType=='many_string'){//多行文本
			bulidertextareaTD(col,table);
		}else if(col.htmlType=='date'){//日期
			buliderDateTD(col,table);
		}
	 	
	 }
	 
	 /**单行输出*/
	 function buliderDateTD(col,table){
			var colValue = (col.columnValueStr == null ? '' : col.columnValueStr);
			var trStr = "<tr><td width='20%'  class='css_lan_bg'><div class='cicss_t'>"+ col.displayName +"</div></td><td   class='css_bai_bg'>";
			trStr += " <input onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',vel:'d244_1',onpicked:checkdate,oncleared:checkdate})\"  readonly='true'  class='wdateinput'";
			if($("#DATABOX_KEY").val()=="View"){
				trStr +=" disabled='true' ";
			} //NEW, Edit, View
			trStr +=" name='" +col.dbColumn + "' id='"+ col.dbColumn +"' type='text' class='input_style' value='"+ colValue +"' style='width: 140px;'>";
			trStr += "<div id='"+col.dbColumn+"Tip'></div>";
			trStr += "</td></tr>";
			table.append(trStr);
			//var te = (col.minLength?col.minLength:(col.allowedNull?1:0))
			bindValidate(col,null);
			
	 }
	 
	 /**单行输出*/
	 function bulidertextareaTD(col,table){
			var colValue = (col.columnValueStr == null ? '' : col.columnValueStr);
			var trStr = "<tr><td width='20%' class='css_lan_bg'><div class='cicss_t'>"+ col.displayName +"</div></td><td   class='css_bai_bg'><textarea rows='150' cols='3' ";
			if($("#DATABOX_KEY").val()=="View"){
				trStr +=" disabled='true'";
			}
			trStr += "name='" +col.dbColumn + "' id='"+ col.dbColumn +"' class='input_style'  style='width: 68%;height:72px;'>"+ colValue +"</textarea>";
			trStr += "<div id='"+col.dbColumn+"Tip'></div>";
			trStr += "</td></tr>";
			table.append(trStr);
			//bindValidate(id,regexpstr,min,max,str){
			if(col.htmlType=='float'){
				bindValidate(col,{
				regexp:'^[0-9|.]{0,15}$',
				str: ''
				});
				
			}else if(col.htmlType=='integer'){
				bindValidate(col,{
				regexp:'^[0-9]{0,15}$',
				str: ''
				});
			}else{
				bindValidate(col,null);
			}
	 }
	 
	  /**多行文本输出*/
	 function buliderInputTD(col,table){
			var colValue = (col.columnValueStr == null ? '' : col.columnValueStr);
			var trStr = "<tr><td width='20%' class='css_lan_bg'><div class='cicss_t'>"+ col.displayName +"</div></td><td   class='css_bai_bg'><input";
			if($("#DATABOX_KEY").val()=="View"){
				trStr +=" disabled='true'";
			}
			trStr +=" name='" +col.dbColumn + "' id='"+ col.dbColumn +"' type='text' class='input_style' value='"+ colValue +"' style='width: 140px;'>";
			trStr += "<div id='"+col.dbColumn+"Tip'></div>";
			trStr += "</td></tr>";
			table.append(trStr);
			bindValidate(col,null);
	 }
	 
	 /**下拉选项*/
	 function builderSelectTD(col,table){
	 	var tdid = col.dbColumn+"TD";
		trStr +=    "<td id='"+tdid+"' cvalue="+col.flexSetId+"   class='css_bai_bg'>";
		function  FlexValueCalback(data){
			if(data){
				var key="";
				var option="<option value=''></option>";
				for(var par in data){
					key  = par;
					for(var i=0 ;i<data[par].length;i++){
						option += "<option value='"+data[par][i].id+"'>"+data[par][i].name+"</option>";
					}
				}
				option = "<select class='input_style' style='width: 140px;' id='"+key+"' >" + option;
				option +="</select>";
				option += "<div id='"+col.dbColumn+"Tip'></div>";
				$("#"+key+"TD").append(option);
				$("#"+key).val($("#"+key+"TD").attr("cvalue"));
				if($("#DATABOX_KEY").val()=="View"){
					$("#"+key).attr("disabled",true);
				}
				OSSfexDataMap[key]= data;//更新下拉列表
				bindValidate(col,null);
			}
		}
		trStr += "</td> ";
		table.append(trStr);
		if(OSSfexDataMap[col.dbColumn]){//下拉列表中值集合已经存在
			FlexValueCalback(OSSfexDataMap[col.dbColumn]);
		}else{
			CIService.getFlexValuesByCloumn(col.flexSetCode,col.dbColumn,FlexValueCalback);
		}
	 }
	 /**单选按钮*/
	 function builderRadioTD(col,table){
	 	var tdid = col.dbColumn+"TD";
		trStr +=    "<td id='"+tdid+"' cvalue="+col.flexSetId+"  class='css_bai_bg'>";
		function  FlexValueCalback(data){
			if(data){
				var key="";
				var option="";
				for(var par in data){
					key  = par;
					var value= $("#"+key+"TD").attr("cvalue");//具体值
					for(var i=0 ;i<data[par].length;i++){
						option += "<input type='radio'   name='" +key+"'";
						if($("#DATABOX_KEY").val()=="View"){
							option +=" disabled='true'";
						}
						if(value== (data[par][i].id+"")){
							option += "checked='checked'";
							option += "text='"+data[par][i].name+"'";//显示值
						}
						option += "  value="+data[par][i].id+" />"+data[par][i].name;
						//option += "<option value='"+data[par][i].id+"'>"+data[par][i].name+"</option>";
					}
				}
				option += "<div id='"+col.dbColumn+"Tip'></div>";
				$("#"+key+"TD").append(option);
				OSSfexDataMap[key]= data;//更新单选列表
				bindValidate(col,null);
				//$("input[name='"+key+"']").attr("checked", true);
				
			}
		}
		trStr += "</td> ";
		//$("#"+key+"TD").attr("cvalue",col.flexSetId);
		table.append(trStr);
		if(OSSfexDataMap[col.dbColumn]){//下拉列表中值集合已经存在
			FlexValueCalback(OSSfexDataMap[col.dbColumn]);
		}else{
			CIService.getFlexValuesByCloumn(col.flexSetCode,col.dbColumn,FlexValueCalback);
		}
	 }
	 
}



//更属性值
function refreshDataMap(){
	
		var ciType = $("#ciType").val();
		var ciTypeId = $("#selectedCiTypeId").val();
		var ciid = $("#CIID").val();
		if(!ciid||'null'==ciid)return;
		if(ciTypeId=='')return;
		//对应dataBoxCache里的key,当增加CI时，key = "NEW", 以一个CI为核心查询CI时，key=[CIID]
		//var boxcacheKey = dataBoxCacheKey;
		
		if(!dataBoxDataMap[ciid] ){
			return;
		}
		
		dataBoxDataMap[ciid].text		= $("#ciName").val();
		dataBoxDataMap[ciid].ciType 	= ciType;
		dataBoxDataMap[ciid].ciTypeId 	= ciTypeId;
		dataBoxDataMap[ciid].ciCode		= $("#code").val();
		dataBoxDataMap[ciid].version 	= $("#version").val();
		
		dataBoxDataMap[ciid].manager 	= $("#manager").val();
		dataBoxDataMap[ciid].managerId 	= (!$("#manager").attr("flexSetId"))?'':$("#manager").attr("flexSetId");
		dataBoxDataMap[ciid].phone 		= $("#phone").val();
		dataBoxDataMap[ciid].position 	= $("#position").val();
		
		var select = document.getElementById("source");
		var fid = "";
		var ft =""; 
		if(select){
			var fid = select.value;
			var ft = select.options[select.selectedIndex].text;
		}
		//var fid = $("#"+data[i].dbColumn).val();
		//var ft = $("#"+data[i].dbColumn+" option[checked]").text();
		dataBoxDataMap[ciid].source.flexSetId = fid;
		dataBoxDataMap[ciid].source.columnValueStr = ft;
		//data[i].source = fid;
		dataBoxDataMap[ciid].source 	= fid;
		dataBoxDataMap[ciid].sourceName = ft;
		
		dataBoxDataMap[ciid].manufacturerName= $("#manufacturer").val();
		dataBoxDataMap[ciid].cmList.configuration_manufacturer.columnValueStr = dataBoxDataMap[ciid].manufacturerName;
		
		dataBoxDataMap[ciid].supplierName 	= $("#supplier").val();
		dataBoxDataMap[ciid].cmList.configuration_supplier.columnValueStr = dataBoxDataMap[ciid].supplierName;
		
		dataBoxDataMap[ciid].supplierId = $("#supplierId").val();
		dataBoxDataMap[ciid].cmList.configuration_supplier.flexSetId = dataBoxDataMap[ciid].supplierId;
		
		dataBoxDataMap[ciid].manufacturerId = $("#manufacturerId").val();
		dataBoxDataMap[ciid].cmList.configuration_manufacturer.flexSetId = dataBoxDataMap[ciid].manufacturerId;
		
		dataBoxDataMap[ciid].memo = $("#memo").val();
		
		dataBoxDataMap[ciid].cmList.configuration_status.flexSetId = $("#status").val();
		dataBoxDataMap[ciid].cmList.configuration_status.columnValueStr = $("#status").find("option:selected").text();
		var debug = dataBoxDataMap;
		if(dataBoxDataMap[ciid].CustomCiProperty){//自定义属性
			var data = dataBoxDataMap[ciid].CustomCiProperty;
			for(var i=0; i< data.length; i++){
       			var dbColumn = data[i].dbColumn;
       			var col = data[i];
       			if(col.htmlType=='radio'){//单选
       				var fid = $("input[type='radio'][checked][name='"+dbColumn+"']").val();
       				var ft ="";
       				var fexset = OSSfexDataMap[dbColumn][dbColumn];//       				
       				for(var j=0 ;j < fexset.length;j++){
       					if(fexset[j].id==fid){
       						ft = fexset[j].name;
       						break;
       					}
       				}
					//var ft = $("input[type='radio'][checked][name='"+dbColumn+"']").attr("text");
       				dataBoxDataMap[ciid][dbColumn].flexSetId = fid;
					dataBoxDataMap[ciid][dbColumn].columnValueStr = ft;
					data[i].columnValueStr  = ft;
					data[i].flexSetId = fid;
				}else if(col.htmlType=='flex'){//下拉框
					var select = document.getElementById(data[i].dbColumn);
					if(!select)break;
					var fid = select.value;
					var ft = select.options[select.selectedIndex].text;
					//var fid = $("#"+data[i].dbColumn).val();
					//var ft = $("#"+data[i].dbColumn+" option[checked]").text();
					dataBoxDataMap[ciid][dbColumn].flexSetId = fid;
					dataBoxDataMap[ciid][dbColumn].columnValueStr = ft;
					data[i].columnValueStr = ft;
					data[i].flexSetId = fid;
				}else {
					dataBoxDataMap[ciid][dbColumn].columnValueStr = $("#"+data[i].dbColumn).val();
					data[i].columnValueStr = $("#"+data[i].dbColumn).val();
				}
       		}
		}
		
} 



/***保存编辑结果**/
function save4dataMap(){
	var ls = new Array();
	refreshDataMap();
	for(var ciid in dataBoxDataMap){
		var cmList = new Array();
		cmList.push({dbColumn:"id",columnValueStr:ciid,isCommonColumn:true});//名称
		cmList.push({dbColumn:"configuration_name",columnValueStr:dataBoxDataMap[ciid].text,isCommonColumn:true});//名称
		cmList.push({dbColumn:"configuration_type",columnValueStr:dataBoxDataMap[ciid].ciType, flexSetId: dataBoxDataMap[ciid].ciTypeId,isCommonColumn:true});//CI类型名称
		cmList.push({dbColumn:"configuration_type_id",columnValueStr:dataBoxDataMap[ciid].ciTypeId, isCommonColumn:true});//CI类型ID-隐藏
		cmList.push({dbColumn:"configuration_code",columnValueStr:dataBoxDataMap[ciid].ciCode,isCommonColumn:true});//CI编号
		cmList.push({dbColumn:"configuration_version",columnValueStr:dataBoxDataMap[ciid].version,isCommonColumn:true});//版本号
		var managerId = (!dataBoxDataMap[ciid].managerId)?'':dataBoxDataMap[ciid].managerId;
		cmList.push({dbColumn:"configuration_manager",columnValueStr:dataBoxDataMap[ciid].manager,flexSetId: managerId,isCommonColumn:true});//负责人，管理员
		cmList.push({dbColumn:"configuration_phone",columnValueStr:dataBoxDataMap[ciid].phone,isCommonColumn:true});//电话
		cmList.push({dbColumn:"configuration_position",columnValueStr:dataBoxDataMap[ciid].position,isCommonColumn:true});//位置
		cmList.push({dbColumn:"configuration_resoure",columnValueStr:dataBoxDataMap[ciid].sourceName,flexSetId:dataBoxDataMap[ciid].source,isCommonColumn:true});//来源
		cmList.push({dbColumn:"configuration_manufacturer",columnValueStr:dataBoxDataMap[ciid].cmList.configuration_manufacturer.columnValueStr,flexSetId: dataBoxDataMap[ciid].cmList.configuration_manufacturer.flexSetId,isCommonColumn:true});//生产商
		cmList.push({dbColumn:"configuration_supplier",columnValueStr:dataBoxDataMap[ciid].cmList.configuration_supplier.columnValueStr,flexSetId: dataBoxDataMap[ciid].cmList.configuration_supplier.flexSetId,isCommonColumn:true});//供应商
		cmList.push({dbColumn:"configuration_manufacturerId",columnValueStr:dataBoxDataMap[ciid].manufacturerId,isCommonColumn:true});//生产商id
		cmList.push({dbColumn:"configuration_supplierId",columnValueStr:dataBoxDataMap[ciid].supplierId,isCommonColumn:true});//供应商id
		cmList.push({dbColumn:"configuration_memo",columnValueStr:dataBoxDataMap[ciid].memo,isCommonColumn:true});//备注
		cmList.push({dbColumn:"configuration_status",columnValueStr:dataBoxDataMap[ciid].cmList.configuration_status.columnValueStr,flexSetId: dataBoxDataMap[ciid].cmList.configuration_status.flexSetId,isCommonColumn:true});//备注
		if(dataBoxDataMap[ciid].CustomCiProperty){//自定义属性
			var data = dataBoxDataMap[ciid].CustomCiProperty;
			for(var i=0; i< data.length; i++){
				cmList.push(data[i]);
       		}
		}
		ls.push(cmList);
	}
	CIService.addCI4Form(ls,{callback:function(data){
				//alert(data);
				if(data=='ok'){
					window.location.href="/itsm/cmdb/ciGrid.do?method=queryCi&menuId=m6_0&oprationCI=queryCI";
				}
   				//refreshLockCiDetection();//刷新锁定的ci
   				//$("#ciType").val('');
				//$("#selectedCiTypeId").val('');
        	},
        	errorHandler: function(msg, exc){
        		 /*Ext.MessageBox.show({
	      			title: '警告',
					msg: msg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO
	           });*/
	           $("#vipDiv").css('display','block');
	           $("#vipText").html(msg);
	           document.getElementById("submitButton").disabled=false
        	}
        }
	);
	
}



//选择管理员
function selectUserEvent() { 
		var url = "/itsm/common/userQuery.do?selectOne=1&enter=enter&exclude=15,16&status=submit";
	    var win = tipsWindown('选择用户','iframe:'+url,'1100','420','true','','true','leotheme');
	}
	
function doCallBack(rtValue){
	for(var i=0;i<rtValue.length;i++){
	    for(var j=0;j<rtValue[i].length;j++){
	        if(j==1){
	        	$("#manager").attr("value", Ext.util.Format.htmlDecode(rtValue[i][j].realName));
	        	$("#manager").focus();
	         	continue;
	        }else if(j==9){
	        	$("#manager").attr("flexSetId", rtValue[i][j].id);
	         	continue;
	        }else if(j==8){
		        	$("#phone").attr("value", Ext.util.Format.htmlDecode(rtValue[i][j].office));
					$("#phone").blur();
		         	continue;
	        }
	    }
	}
}		
		