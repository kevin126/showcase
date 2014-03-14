/**
 * 设置Screen
 */

	$(document).ready(function(){
		$("div.edit_v").hide();
		var nodeName = $("#nodeName").val();
		var transitionName = $("#transitionName").val(); 
		var screenType = $("#screenType").val();
		$.formTable = createFromTable("formOperationTbody"); //实例化 表单字段定义表格
		if(!document.hasElectRow){
			document.hasElectRow = new Object();
		}
		 setInitSelectColum();
	}); 
	
	
	/**
	 * 设置初始选中列
	 */
	function setInitSelectColum(){
		var nodeName = $("#nodeName").val();
		var transitionName = $("#transitionName").val(); 
		var screenType = $("#screenType").val();
		if(nodeName=="" || transitionName=="")return;
		CwfService.getProcessScreenByNamesAndType(nodeName,transitionName,screenType,{
			 	callback : function(data) {
						if(data && data.length>0){
							var recordList  = {};
							for(var i=0 ;i<data.length;i++){
								if(data[i].code=='cwf'){
									var box  = $('#'+data[i].displayName).get(0);//
									if(box) box.checked =true;
									continue;//公共属性列 不在表格中添加一条记录
								}
								var displayName =data[i].displayName;
								var record = {};
								record[displayName] = data[i];
								var trEle = $.formTable.addRows(record);//添加一行
								record[displayName].columnSequence = $(trEle.parentNode).find('tr').length;//设置顺序号
								document.hasElectRow[displayName] = trEle;//将该行存入js缓存 方便下次使用时查找
								trEle.displayName = displayName;//将该行在缓存中的key值设置给该行对象的一个属性,方便通过checkbox删除该行时直接找到该行对象。
								var box  = $('#'+displayName).get(0);//方便删除 
								if(box) box.checked =true;
							}
						}
					},
					errorHandler : function(
							errorString,
							exception) {
						Ext.MessageBox.show({
							title : '错误',
							msg : '获取数据失败！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
					}
			 });
	}
	
	/**
	 * 获取后台中该流程表单的所有列
	 */
	CwfService.getCreatFormAllColumnsListBySession({
		 	callback : function(data) {
					if(data && data.length>0){
						var recordList  = {};
						for(var i=0 ;i<data.length;i++){
							var disn =data[i].displayName;
							var tem  = new Object();
							tem[disn] = data[i];
							recordList[disn]= tem;
						}
						document.FormColumnList = recordList;//存储为全局
					}
				},
				errorHandler : function(
						errorString,
						exception) {
					Ext.MessageBox.show({
						title : '错误',
						msg : '获取数据失败！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
		 });
 
 
	/**
	 * 选中一个checkbox
	 * @param {} obj
	 * @param {} displayName
	 */
	 function checkScreenColum(obj,displayName){
			if(obj && displayName){
				var te =document.FormColumnList;
				if(obj.checked==true){
					var record = document.FormColumnList[displayName];
					var trEle = $.formTable.addRows(record);
					record[displayName].columnSequence = $(trEle.parentNode).find('tr').length;//设置顺序号
					document.hasElectRow[displayName] = trEle;
					trEle.displayName = displayName;
				}else{
					var tbody = document.hasElectRow[displayName].parentNode;
					tbody.removeChild(document.hasElectRow[displayName]);
					delete document.hasElectRow[displayName];
				}
			}
	}
	
	/**
	 * 删除一行取消checkbox的选中
	 * @param {} obj
	 */
	function removeChecked(obj){
		if(obj){
			var trEle = obj.parentNode.parentNode.parentNode;//删除按钮坐在的TR
			$('#'+trEle.displayName).get(0).checked= false;
		}
	}
	
	/***
	 * 保存操作结果
	 */
	function saveOperation(){
		var nodeName = $("#nodeName").val();
		var transitionName = $("#transitionName").val(); 
		var screenType = $("#screenType").val();
		var colums = new Array();
		var boxs = $(".jinqi_liebiao input:checkbox");
		for(var i=0 ;i<boxs.length;i++){
			var box =boxs.get(i);
			if(box.checked==true){
				var record = document.FormColumnList[box.value];
				var colum  = record[box.value];
				colums.push(colum)
			}
		}
		
		/*for(var par in document.hasElectRow){
			var record = document.FormColumnList[par];
			var colum  = record[par];
			colums.push(colum)
		}*/
		CwfService.saveProcessScreen(colums,nodeName,transitionName,screenType,function(){art.dialog.close()});
	}
	
		