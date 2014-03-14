/**
 * APEX OSS 自定义表单 定义字段属性控件
 * 使用方式在head位置引入js/apex/cwf/reateDefinitionlForm.js文件 
 * 在页面必须加入一个id为"rowModel"的table, 并且此table的行为动态增加的行模板,动态加入的行与此table的行结构及事件一致
 * 使用示例:
 * 	 var $.createForm = new CreatFromFiledTable('tableId');
 * 	 $.createForm.addNewRow();//添加全新的一行
 *   $.createForm.addRows({disName:{id:'',displayName:'',createFrom:{}....}});//添加一行并将传入的数据赋予该行
 *   $.createForm.onDelRow( {fun:function(){},ajaxFun:function(){}} ); //为删除一行添加自定义事件
 *   $.createForm.getColumDataList();//获取当前表格中所有的数据列表
 *   $.createForm.getSelectedColumDataList();//获取选中行的数据列表
 * @author wjdeng
 */
 
 
 /**
  * 入口方法
  *  通过该方法的返回对象可以调用 .addNewRow()添加一个新行,  .addRows(record)添加一个带数据的行
  * @param {} tbodyId 
  * @param {} addbtnId
  * @param {} toUpRowId
  * @param {} toDownRowId
  * @param {} toBottomRowId
  * @param {} toTopRowId
  * @return {} 
  */
 function createFromTable(tbodyId,addbtnId,toUpRowId,toDownRowId,toBottomRowId,toTopRowId){
 	var fromtem = new CreatFromFiledTable(tbodyId,addbtnId,toUpRowId,toDownRowId,toBottomRowId,toTopRowId);
 	return fromtem;
 }
 
 
 /**
  * 定义字段属性控件类构造函数
  * @param {} tbodyId
  * @param {} addbtnId
  * @param {} toUpRowId
  * @param {} toDownRowId
  * @param {} toBottomRowId
  * @param {} toTopRowId
  */
 function CreatFromFiledTable(tbodyId,addbtnId,toUpRowId,toDownRowId,toBottomRowId,toTopRowId){
 	if(tbodyId==false)return;//tbodyId为false时,初始化全局函数引用构造上下文环境
 	this.config ={
 		tbodyId :tbodyId?tbodyId:'formOperationTbody',//绑定所在的table
 		addBtnId :addbtnId?addbtnId:'cwf_addBtn',				 //新增加一行的按钮id
 		toUpRowId :toUpRowId?toUpRowId:'cwf_toUpRow',
 		toDownRowId:toDownRowId?toDownRowId:'cwf_toDownRow',
 		toBottomRowId:toBottomRowId?toBottomRowId:'cwf_toBottomRow',
 		toTopRow:toTopRowId?toTopRowId:'cwf_toTopRow',
 		rowModelId:"rowModel" //增加列模板tableid
 	}
 	this.validatorFlag= new Array();//所有输入行校验是否通过
 	//删除一行前的事件列表, funList普通事件 ajaxFunList:ajax验证的事件列表; 在不同模块页面中删除的校验验证不同 
 	//示例:通过new CreatFromFiledTable('tableId').onDelRow( {fun:function(){},ajaxFun:function{}} )方法向此列表中添加自定义事件
 	this.delRowEventList = {fun:null,ajaxFun:null};
 	this.maxValidatorgroup = 0 ;//最大校验组编号
 	cwf.creatFromFiledTable[this.config.tbodyId] = this;
 	$("#"+this.config.addBtnId).click(function(){
 		cwf.creatFromFiledTable[tbodyId].addNewRow();
	})
	
	$("#"+this.config.toUpRowId).click(function(){
 		cwf.creatFromFiledTable[tbodyId].toUpRow();
	})
	
	$("#"+this.config.toDownRowId).click(function(){
 		cwf.creatFromFiledTable[tbodyId].toDownRow();
	})
	
	$("#"+this.config.toTopRow).click(function(){
 		cwf.creatFromFiledTable[tbodyId].toTopRow();
	})
	
	$("#"+this.config.toBottomRowId).click(function(){
 		cwf.creatFromFiledTable[tbodyId].toBottomRow();
	})
	
	this.getValidatorgroup = function(trElement){
		if(!trElement)return;
		var validatorgroup = trElement.validatorgroup;
		if(!validatorgroup && validatorgroup!=0){
			validatorgroup = this.maxValidatorgroup++;
			trElement.validatorgroup = validatorgroup;
		}
		return validatorgroup;
	}
 }
 
 //全局函数引用
 var cwf = {creatFromFiledTable:new CreatFromFiledTable(false)};
 
 /***
  * 删除行时,用户自定义事件
  * 
  * @param {} fun
  * @return true|| false
  */
 CreatFromFiledTable.prototype.onDelRow= function (fun){
 	if(!fun)return;
 	if(fun.fun){
	 	this.delRowEventList.fun = fun.fun;
 	}
 	if(fun.ajaxFun){
	 	this.delRowEventList.ajaxFun =fun.ajaxFun;
 	}
 	
 }
 
 /***
  * 删除一行
  * @param {} obj
  */
 CreatFromFiledTable.prototype.delRow= function (obj,appContext){
 	if(!obj)return;
	var trEle = obj.parentNode.parentNode.parentNode;
 	if(!appContext){
 		del();
 		return;
 	}
	var fun = appContext.delRowEventList.ajaxFun;
	if(fun != null && typeof(fun)=='function'){
		fun(trEle,trEle.columData,del)
	}else{
		del();
	}
	
	function del(){
		var flag = doDelEvent();
		if(flag==true){
			var tablEle = trEle.parentNode;
			if(!tablEle.dropColum )tablEle.dropColum = new Object();
			if(trEle.columData){
				var columId = trEle.columData.id;
				if(columId){
					tablEle.dropColum[columId]= trEle.columData;
				}
			}
			appContext.validatorFlag[trEle.validatorgroup]=true;
			tablEle.removeChild(trEle);
			var rowLen  = $(tablEle).find('tr');
			for(var i=0;i<rowLen.length ;i ++){
				$(rowLen.get(i)).find("td[name='columnSequence']").html(i+1);
			}
		}
	}
	
	
	function doDelEvent(){
		var rel = true;
		var fun  = appContext.delRowEventList.fun;
		if(typeof(fun)=='function'){
			var tem = fun();
			if(tem==true){
				rel = rel && tem;
			}else if(tem==false){
				return false;
			}
		}
		return rel;
	}
	
		
 }


/**
*选项窗口
*@param eleId 跟随页面节点id
*@param dataStore  数据
*/
 CreatFromFiledTable.prototype.selectOptionWin = function (inputEle,dataStore,callBack){
 	var eleId = inputEle.id;
 	if($.FlexSetWin && $.FlexSetWin.close)$.FlexSetWin.close();
	$.FlexSetWin = art.dialog({
		id:eleId+'_Win',
		width:'180px',
		height:'182px',
		title:false,
		skin:'none',
		esc:true,
	    follow: eleId,
	    content: document.getElementById('selectOptionWin').innerHTML,
	    initFn : function(){
	    	if(!dataStore) return;
	    	var winPanl = $(document.getElementById(eleId+'_Wincontent'));
	     	var close = winPanl.find('input').get(0);
	     	$(close).bind("click",function(){$.FlexSetWin.close()} );
	    	var wincontent = winPanl.find(".jinqi_liebiao").get(0);
	    	var htmTem = "<ul>";
	    	for(var i=0 ;i<dataStore.length;i++){
	    		htmTem += "<li class='liebiao_li' onmouseover=\"this.className='liebiao_lion' \" onmouseout=\"this.className='liebiao_li'\" >";
	    		htmTem += "<input id=eleId+'_'"+i+"'_check_popWin'   type='radio'  value="+dataStore[i].value+" name=radio /> ";
	    		htmTem += "<label for=eleId+'_'"+i+"\'_check_popWin'>"+dataStore[i].name+"</label>";
	    		htmTem += "</li>";
	    		wincontent[dataStore[i].value]=dataStore[i].name;
	    	}
	    	htmTem += "</ul>";
	    	$(wincontent).append(htmTem);
	    	$(wincontent).find('input:radio').click(function(){
	    		var val = $(this).get(0).value;
	    		var name = wincontent[val];
	    		inputEle.value = name;
				inputEle.flexValueSet = {id:val,name:name};
				$.FlexSetWin.close();
				inputEle.focus();
				document.body.focus();
	    	});
		}
	});
}

	

/***
 * 刷新指定行的数据及显示效果
 * @param {} trEle
 */
 CreatFromFiledTable.prototype.refreshValueDis = function (trEle){
	if(!trEle)return;
	var dmodel = this.getDataModel();
	var trEleJquery = $(trEle);
	for(var par in dmodel){
		if(par=='htmlType'){
			var disInput  =  trEleJquery.find("select[name='htmlType']").get(0);
			if(disInput) {
				this.htmlTypeChange(disInput);
				this.setDisHtml(disInput);
				trEle.columData.htmlType = disInput.value;	
			}		
		}else{
			var disInput  =trEleJquery.find("input[name='"+par+"']").get(0);
			if(disInput) {
				if(disInput.type=='checkbox'){
					var radioDisV = "";
			  	    if(disInput.checked!=true){
						radioDisV = "否";
				    }else{
						radioDisV = "是";
				    }
				    $(disInput.parentNode.parentNode).find(".bak_zhi").html(radioDisV);
				    trEle.columData[par] = disInput.checked;
				}else{
					trEle.columData[par] = disInput.value;
					this.setDisHtml(disInput);
				}
				
				if(disInput.name=='flexValueSetName'){
					var flexSet = disInput.flexValueSet;
					if(flexSet){
						trEle.columData.flexValueSet = flexSet;
						trEle.columData.flexValueSetId = flexSet.id;
					}
				}
			}
		}
	}
	return trEle.columData;
}

/**
 * 将指定行设置为编辑状态
 * @param {} trEle 
 */
 CreatFromFiledTable.prototype.editRow= function (trEle){
 	var disp = $(trEle).find(".bak_zhi");
	  var valp = $(trEle).find(".edit_v");
	  disp.hide();
	  valp.show();
 }
 
 /***
  * 将制定行设置为显示状态
  * @param {} trEle
  */
 CreatFromFiledTable.prototype.detailRow= function (trEle){
 	var disp = $(trEle).find(".bak_zhi");
  	var valp = $(trEle).find(".edit_v");
  	disp.show();
  	valp.hide();
 }

/**
*初始化按钮事件
*@param obj  所在TR的doment对象
*@param record 数据
*/
 CreatFromFiledTable.prototype.initEvent= function (obj,record){
	if(obj){
		var appContext = this;
		//编辑按钮事件
		$(obj).find("input[name='editRowBtn']").click(function(){
		  	  var trEle = $(this).get(0).parentNode.parentNode.parentNode;//按钮所在行,对应的tr
		  	  cwf.creatFromFiledTable.editRow(trEle);
		});
		
		//删除按钮事件
		$(obj).find("input[name='delRowBtn']").click(function(){
		  	  cwf.creatFromFiledTable.delRow($(this).get(0),appContext);
		});
			 
		var svb =$(obj).find("input[name='saveRowBtn']").get(0)
		if(svb){
			svb.tbodyId = this.config.tbodyId;
		}
		//保存按钮事件
		$(obj).find("input[name='saveRowBtn']").click(function(){
		  	  var btn = $(this).get(0).parentNode.parentNode.parentNode;//按钮所在行,对应的tr
		  	  //var columData = btn.columData;
		  	  //if(!columData)btn.columData =new Object();
			  cwf.creatFromFiledTable.refreshValueDis(btn);//刷新该行数据 及显示效果
			  if($.formValidator){//启动了校验.
			  	if(!$.formValidator.pageIsValid(btn.validatorgroup)){//校验输入框中的数据
			  		cwf.creatFromFiledTable[this.tbodyId].validatorFlag[btn.validatorgroup]= false;
			  		return;//校验未通过
			  	}else{
			  		cwf.creatFromFiledTable[this.tbodyId].validatorFlag[btn.validatorgroup]= true;
			  	}
			  }
		  	  cwf.creatFromFiledTable.detailRow(btn);
			  return false;
 		});
 		
		$(obj).find("select[name='htmlType']").change(function(){
			cwf.creatFromFiledTable.htmlTypeChange($(this).get(0));//页面表现形式 下拉框change事件
		});
		
		
	}
	
	
}

 CreatFromFiledTable.prototype.toTopRow = function (){

}

 CreatFromFiledTable.prototype.toBottomRow = function (){

}

/**
 * 获取指定行的状态(编辑状态还是显示状态)
 * @param {} trEle  
 * @return {'unknow'|| 'none'||'block'}
 */
 CreatFromFiledTable.prototype.trView =function (trEle,state){
	if(!state){
		var ediv  = $(trEle).find(".bak_zhi").get(0);
		if(ediv){
			if(ediv.style.display!="none"){
				return 'view';
			}else{
				return 'edit';
			}
		}
		return 'unknow';
	}else{
		var disp = $(trEle).find(".bak_zhi");
  	  	var valp = $(trEle).find(".edit_v");
  	  	if(state =='view'){
  	  	 	disp.show();
		 	valp.hide();
  	  	}else if(state =='edit'){
  	  	 	valp.show();
		 	disp.hide();
  	  	} 
	}
}


/**上移一行*/
 CreatFromFiledTable.prototype.toUpRow= function (){
	var checkbox = $('#'+this.config.tbodyId).find("input[name='checkbox']");
	var tempChecks = new Object();
	for(var i=0 ;i<checkbox.length;i++){
		var box  = checkbox.get(i);
		var trEle = box.parentNode.parentNode;//该行对象
		tempChecks[i]={trEle : trEle,box:box };//缓存该行对性
		if(box.checked == true){
			tempChecks[i].checked = {};//标记本行已经被选择
			if(i==0)continue;//第一行不用上移
			if(tempChecks[i-1].checked)continue;//本行的上一行被选中则本行不用上移
			//循环仍在继续 需要上移
			var pData = this.getVal(tempChecks[i-1].trEle);//tempChecks[i-1].trEle.columData;//上一行的数据
			var data = this.getVal(tempChecks[i].trEle);//tempChecks[i].trEle.columData;//当前行的数据
			var pstate = this.trView(tempChecks[i-1].trEle);//上一行的显示状态
			var state = this.trView(tempChecks[i].trEle);//当前行的显示状态
			
			this.setVal(tempChecks[i-1].trEle,data);
			tempChecks[i-1].trEle.columData = data;
			$(tempChecks[i-1].trEle).find("td[name='columnSequence']").html(i)
			this.trView(tempChecks[i-1].trEle,state);
			
			this.setVal(tempChecks[i].trEle,pData);
			tempChecks[i].trEle.columData = pData;
			$(tempChecks[i].trEle).find("td[name='columnSequence']").html(i+1)
			this.trView(tempChecks[i].trEle,pstate);
			 
			delete tempChecks[i]['checked'];
			tempChecks[i-1].checked={};
			box.checked = false;
			tempChecks[i-1].box.checked=true;
		}
		
	}
}




/**下移一行*/
 CreatFromFiledTable.prototype.toDownRow= function (){
	var checkbox = $('#'+this.config.tbodyId).find("input[name='checkbox']");
	var tempChecks = new Object();
	for(var i=checkbox.length-1 ;i>=0;i--){
		var box  = checkbox.get(i);
		var trEle = box.parentNode.parentNode;//该行对象
		tempChecks[i]={trEle : trEle,box:box };//缓存该行对性
		if(box.checked == true){
			tempChecks[i].checked = {};//标记本行已经被选择
			if(i==checkbox.length-1)continue;//第一行不用上移
			if(tempChecks[i+1].checked)continue;//本行的上一行被选中则本行不用上移
			
			//否定条件已经过去 继续执行
			var pData = this.getVal(tempChecks[i+1].trEle)//tempChecks[i+1].trEle.columData;//上一行的数据
			var data = 	this.getVal(tempChecks[i].trEle)//tempChecks[i].trEle.columData;//当前行的数据
			var pstate =this.trView(tempChecks[i+1].trEle);//上一行的显示状态
			var state = this.trView(tempChecks[i].trEle);//当前行的显示状态
			
			this.setVal(tempChecks[i+1].trEle,data);
			tempChecks[i+1].trEle.columData = data;
			$(tempChecks[i+1].trEle).find("td[name='columnSequence']").html(i+2)
			this.trView(tempChecks[i+1].trEle,state);//上一行的显示状态
			
			this.setVal(tempChecks[i].trEle,pData);
			tempChecks[i].trEle.columData = pData;
			$(tempChecks[i].trEle).find("td[name='columnSequence']").html(i+1)
			this.trView(tempChecks[i].trEle,pstate);//当前行的显示状态
			
			delete tempChecks[i]['checked'];
			tempChecks[i+1].checked={};
			box.checked = false;
			tempChecks[i+1].box.checked=true;
		}
		
	}
}


/**设置页面显示值(输入标签)*/
 CreatFromFiledTable.prototype.setDisHtml= function (element){
	if(element){
		if(element.type=='button')return;
		var tdele = element.parentNode.parentNode;//输入框对应的td
		var str  = '&nbsp;';
		if(element.value&& element.value!='null')str  = element.value;
		if(element.tagName=='SELECT'){
			var index = element.selectedIndex==-1?0:element.selectedIndex;
			str = element.options[index].text;
		}
		$(tdele).find(".bak_zhi").html(str);
	}
}

/**新添加一行*/
 CreatFromFiledTable.prototype.addNewRow= function (){
	var lastRow = this.addRows({'new':this.getDataModel()});
	if(lastRow.validatorgroup)this.validatorFlag[lastRow.validatorgroup]=  false;//新增加的一行默认校验未通过
	$(lastRow).find("input[name='displayName']").focus();
	var btn = lastRow;//$(lastRow).get(0).parentNode.parentNode.parentNode;//按钮所在行,对应的tr
  	var disp = $(btn).find(".bak_zhi");
  	var valp = $(btn).find(".edit_v");
	disp.hide();
	valp.show();
}
	


/**
*为列表添加带数据的一行
*/
 CreatFromFiledTable.prototype.addRows= function (record){
	if(record){
		var table = $('#'+this.config.tbodyId).get(0);
		var lastRow;
		for(var par in record){
			var rowLen = $('#'+this.config.tbodyId).get(0).getElementsByTagName('tr').length;//行数
			var trModel = $('#'+this.config.rowModelId).find('tr').get(rowLen%2).cloneNode(true);
			var validatorgroup = this.getValidatorgroup(trModel);
			trModel.id="tr_"+validatorgroup;
			trModel.columData = record[par];
			trModel.rowNumber =validatorgroup;
			table.appendChild(trModel);
			this.setVal(trModel,record[par]);//赋值
			this.initEvent(trModel,record[par]);//设置button事件
			var fsname = $(trModel).find("input[name='flexValueSetName']").get(0);
			lastRow = trModel;
		}
		return lastRow;
	}
	
}

/***
 * 获取全部校验结果
 * @return {}返回当前table中所有的输入校验是否通过
 */
 CreatFromFiledTable.prototype.getValidator  =function(){
	var tem =true;
	for(var par in this.validatorFlag){
		tem  = tem && this.validatorFlag[par];
	}
	return tem;
}
/***
 * 设置输入校验 
 * @param {} rowElement
 * @param {} validatorgroup 校验组
 */
 CreatFromFiledTable.prototype.setValidator= function (rowElement){
	if(!$.formValidator)return;
	if(!rowElement)return;
	var validatorgroup = this.getValidatorgroup(rowElement);
	var tbodyId = this.config.tbodyId;
	var appContext  = this;
	if(!$.formValidator.getInitConfig(rowElement.validatorgroup)){//此行没有初始化校验
		$.formValidator.initConfig({
			validatorgroup : validatorgroup,//以行编号做为校验组ID
			onerror : function(msg) {
				if(typeof(msg)=='function'){
					msg();
				}
				try{
				}catch(e){
					alert(msg);
				}
				return false;
			},
			onsuccess : function(msg) {
				return true;
			}
		});
		
		$(rowElement).find("input[name='displayName']").formValidator({
				onshow : '{}',
				onfocus : '{}',
				validatorgroup : rowElement.validatorgroup,
				oncorrect : '{}'
			}).inputValidator({
				min : 1,
				onerror :  function(){
					setErrorClass($('#tr_'+rowElement.validatorgroup).find("input[name='displayName']"),'不能为空','snmp_in1_4_err');
				}
			}).functionValidator({
			    fun : function(val, elem) {
				    var reg_normal = new RegExp(regexEnum.notempty);
				    if(reg_normal.test(val)){
				    	setCorrectClass(elem,"","all_input");
				    	var map = new Object();
				    	var temp = true;
				    	$("#"+tbodyId+" input[name='displayName']").each(function(index,eletem){
				    		var valtem = eletem.value.trim();
				    		if(valtem=='')return;
				    		if(!map[valtem]){
				    			map[valtem] = index+1;
				    		}else{
				    			setErrorClass(eletem,"显示名称与第"+map[valtem]+"行重复");
				    			temp = false;
				    		}
				    	})
				    	return temp;
				    }else{
				    	setErrorClass(elem,"不能为空");
				    	return false;
				    }
			    }
			});
			
		$(rowElement).find("select[name='htmlType']").formValidator({
			onshow : '{}',
			onfocus : '{}',
			validatorgroup : rowElement.validatorgroup,
			oncorrect : '{}'
		}).functionValidator({
		    fun : function(val, elem) {
		    	var valPanel  = elem.parentNode.parentNode.parentNode;//下拉框所在的TR
		    	setOtherEleValidateByselectType(valPanel,val)
		    	return true;
		    }
		});
		setOtherEleValidateByselectType(rowElement,$(rowElement).find("select[name='htmlType']").val());	
	}
	
	var validatem = this.validatorFlag[rowElement.validatorgroup]= $.formValidator.pageIsValid(rowElement.validatorgroup);//初始化过校验则启动校验
	if(validatem == false){
		cwf.creatFromFiledTable.editRow(rowElement);//将该行设置为编辑状态
	}
		
	/***
	 * 根据页面表现形式选项来设置其它输入框的校验
	 * @param {} rowEle 行对象 TR
	 * @param {} htmlType  "select[name='htmlType']" 的值
	 */
	function setOtherEleValidateByselectType(rowEle,htmlType){
		if(htmlType){
			var valPanel = rowEle;
			var dataMode = cwf.creatFromFiledTable.getDataTypeModel();
			var config = dataMode[htmlType];// 
			for( var conpar in config){
				var cfg = config[conpar].valconfig//校验配置
				if(!cfg){	//没有配置校验
					setValidFun(valPanel,"input[name='"+conpar+"']");//取消已经添加过的校验
					continue;
				}
				if(cfg.valReg){
    				setValidFun(valPanel,cfg.findstr,cfg.valReg,cfg.errmsg);//设置校验函数
				}else{//没有不包含校验的正则表达式 则取消已经添加过的校验
					setValidFun(valPanel,cfg.findstr);//
				}
			}
			
		}
	
	}
		
		/***
		 * 选择页面样式后动态设置校验
		 * 如果valReg 为空则取消掉此空间的校验
		 * @param {} trEle  校验组容器
		 * @param {} findstr 查找脚本
		 * @param {} valReg 校验正则
		 * @param {} errmsg 错误消息
		 * @param {} sclass 正确样式
		 * @param {} smsg  正确消息
		 * @param {} errclass 错误样式
		 */
		function setValidFun(trEle,findstr,valReg,errmsg,sclass,errclass,fun,smsg){
			if(!trEle || !findstr)return;
			var config ={
				errmsg: errmsg?errmsg:'错误！',
				smsg: smsg?smsg:'',
				errclass:errclass?errclass:'snmp_in1_4_err',
				sclass:sclass?sclass:"all_input"
			}
			if(valReg){
				$(trEle).find(findstr).formValidator({
					onshow : '{}',
					onfocus : '{}',
					validatorgroup : trEle.validatorgroup,//用TR的行号作为校验组编号 在function addRows(record) 中为TR.validatorgroup 赋值
					oncorrect : '{}'
				}).functionValidator({
				    fun : function(val, elem) {
				    	if(elem.name=='flexValueSetName'){//情况特殊
				    		elem = elem.parentNode;
				    		config.sclass = ' ';//去除错误样式 并且不添加新的样式
				    	}
				    	if(''==val && valReg!=regexEnum.notempty){//输入的值为空 并且校验正则不为:非空
				    		setCorrectClass(elem,config.smsg,config.sclass,config.errclass);
				    		return true;
				    	}
					    var reg_normal = new RegExp(valReg);
					    if(reg_normal.test(val)){
					    	setCorrectClass(elem,config.smsg,config.sclass,config.errclass);
					    	return true;
					    }else{
					    	setErrorClass(elem,config.errmsg,config.errclass,config.sclass);
					    	return false;
					    }
				    }
				});
			}else{
				setCorrectClass($(trEle).find(findstr).get(0),config.smsg,config.sclass,config.errclass);//重新设置样式
				$(trEle).find(findstr).formValidator({validatorgroup : trEle.validatorgroup}).functionValidator();
			}
			
		}
		
		
		
		
		
		
	/***
	 * 错误样式
	 * @param {} obj
	 * @param {} title
	 * @param {} className
	 */	
	function setErrorClass(obj,title,addClassName,removeCalss){
		$(obj).attr("title",title);
		$(obj).removeClass(removeCalss?removeCalss:"all_input");
		$(obj).addClass(addClassName?addClassName:"snmp_in1_4_err");
	}
	
	/***
	 * 正常显示样式
	 * @param {} obj
	 * @param {} title
	 * @param {} className
	 */
	function setCorrectClass(obj,title,addClassName,removeCalss){
		$(obj).attr("title",title);
		$(obj).removeClass(removeCalss?removeCalss:"snmp_in1_4_err");
		$(obj).addClass(addClassName?addClassName:"all_input");
	}	
	
}



/**
*将行数据初始化到行所对应的表格中
*/
 CreatFromFiledTable.prototype.setVal=  function (trEle,record){
		if(!trEle)return;
		var dmodel = this.getDataModel()
		var trEleJquery = $(trEle);
		var validatorgroup = this.getValidatorgroup(trEle);
		var rowNumber = $('#'+this.config.tbodyId).get(0).getElementsByTagName('tr').length;//table所有行数
		$(trEle).find("td[name='columnSequence']").html(rowNumber);//在tr中查找顺序号单元格
		for(var par in dmodel){
			if(par=='htmlType'){
				var disInput  =  trEleJquery.find("select[name='htmlType']").get(0);
				if(!disInput.id )disInput.id = par+'_'+validatorgroup;
				if(record[par]){
					disInput.value = record[par];
				}
	  	  		this.htmlTypeChange(disInput);//隐藏相关输入框
	  	  		this.setDisHtml(disInput);
			}else{
				var disInput  =trEleJquery.find("input[name='"+par+"']").get(0);
				if(!disInput)continue;
				if(!disInput.id )disInput.id = par+'_'+validatorgroup;
				if(disInput.type=='checkbox'){
					var radioDisV = "";
					if(!disInput.id )disInput.id = par+'_'+validatorgroup;
					if(record[par]!=true){
						radioDisV = "否";
						disInput.checked=false;
					}else{
						radioDisV = "是";
						disInput.checked=true;
					}
					$(disInput.parentNode.parentNode).find(".bak_zhi").html(radioDisV);//在td中查找 .bak_zhi
				}else{
					disInput.value =record[par]?record[par]:'';
					this.setDisHtml(disInput);
				}
			}
		}
		this.setValidator(trEle);//设置相关校验
}		

/***
 * 获取每一行的数据到JS对象中
 * @param {} trEle
 */
 CreatFromFiledTable.prototype.getVal= function (trEle){
	if(!trEle)return;
	var dmodel = this.getDataModel()
	var trEleJquery = $(trEle);
	for(var par in dmodel){
		if(par=='htmlType'){
			var disInput  =  trEleJquery.find("select[name='htmlType']").get(0);
			trEle.columData.htmlType = disInput.value;
		}else{
			var disInput  =trEleJquery.find("input[name='"+par+"']").get(0);
			if(disInput) {
				if(disInput.type=='checkbox'){
					trEle.columData[par]= disInput.checked;
				}else{
					trEle.columData[par] = disInput.value;
					if(par=='flexValueSetName' && disInput.flexValueSet){//特殊情况 
						trEle.columData.flexValueSet= disInput.flexValueSet;
						trEle.columData.flexValueSetId = disInput.flexValueSet.id;
					}
				}
			}
		}
	}
	return trEle.columData;
}

/**
*选择页面样式后更改各个输入框的样式
*/
 CreatFromFiledTable.prototype.htmlTypeChange = function (obj){
	if(obj){
		var trEleJquery = $(obj.parentNode.parentNode.parentNode); //行对象
		var tyeMod = cwf.creatFromFiledTable.getDataTypeModel();
		var tm = tyeMod[obj.value];//根据下拉框的值获取 隐藏还是显示的配置属性
		for(var tp in tm){
			var eleJ = trEleJquery.find("input[name='"+tp+"']");
			if(tm[tp].operation=='w'){
				eleJ.get(0).style.display="";//显示
				eleJ.get(0).maxlength = tm[tp].maxleng;
			}else{
				eleJ.get(0).style.display="none";//隐藏
				eleJ.val('');
				if(tp=='flexValueSetName'){//特殊情况 
					var flex = eleJ.get(0); 
					flex['flexValueSet']=null;//删除数据来源
					$(eleJ.get(0).parentNode).removeClass("snmp_in1_4_err");
				}
			}
		}
		
		var appContext  = this; 
		var setTem = $(trEleJquery).find("input[name='flexValueSetName']").unbind('click');
		if(obj.value=='radio'||obj.value=='flex'){//选择结果是"下拉"或"单选"
			setTem.bind('click',function(){
				//cwf.creatFromFiledTable.showFlexValueSetTree($(this).get(0));
				var fsetnam = $(this).get(0);
				FlexValueSetService.getFlexValueSetTree(0,function(data){
					if(data){
						var store = new Array();
						for(var i=0 ;i<data.length;i++){
							if(data[i].id<1)continue;
							store.push({name:data[i].text,value:data[i].id})
						}
						appContext.selectOptionWin(fsetnam,store);//弹出选择组件
					}
		    	});
			});
		}else if(obj.value=='syscomponent'){
			setTem.bind('click',function(){
				//cwf.creatFromFiledTable.showFlexValueSetTree($(this).get(0));
				var fsetnam = $(this).get(0);
				var store = [
								{name:'系统用户(单选)',value:'syscomponent_user_s'},
								{name:'系统用户(多选)',value:'syscomponent_user_m'},
								//{name:'系统角色(单选)',value:'syscomponent_role_s'},
								//{name:'系统角色(多选)',value:'syscomponent_role_m'},
								//{name:'系统用户组(单选)',value:'syscomponent_group_s'},
								//{name:'系统用户组(多选)',value:'syscomponent_group_m'},
								{name:'问题工单类型',value:'syscomponent_role_inc'},
								{name:'事件工单类型',value:'syscomponent_role_pro'}
							];
				appContext.selectOptionWin(fsetnam,store);//弹出选择组件
			});
		}
		
		
	}
}

/***
 * 列数据模型
 * @return {}
 */
 CreatFromFiledTable.prototype.getDataModel= function (){
		return	{	
				allowedNull:true,
				code :'',
				columnLength :null,
				columnSequence : null,//序号
				createForm :null, 
				dbColumn :null,
				dbType:'',//数据库类型
				defaultValue:'',//缺省值
				discription:'',//描述
				displayName:'',//显示名称
				enabled:false,
				flexValueSet:null,//系统数据集合
				flexValueSetId:	null,//数据集合id
				flexValueSetName:	null,//数据集合名称
				htmlType:null,//页面形式(单行,多行,多选....)
				id:null,	
				maxLength:null,
				minLength :null,
				index:false,//索引
				store:false //存储
			};
}


/**
* 选择输入框类型的数据模型(定义了在个中类型下,哪些输入框显示和哪些隐藏,并且配置数据校验方式)
*
*setValidFun(trEle,findstr,valReg,errmsg,sclass,errclass,fun,smsg)
*
*setValidFun(valPanel,"input[name='maxLength']",regexEnum.intege1,'正整数');
*setValidFun(valPanel,"input[name='minLength']",regexEnum.intege1,'正整数');
*setValidFun(valPanel,"input[name='defaultValue']",regexEnum.decmal,'浮点数');
*setValidFun(valPanel,"input[name='flexValueSetName']");
*/
 CreatFromFiledTable.prototype.getDataTypeModel= function (){
	return {
		one_string :{//下拉选择单行文本框
			flexValueSetName :{
				operation:'r',//隐藏(只读)  单行字符时 系统数据集合隐藏
				valconfig:{//校验配置
					findstr:"input[name='flexValueSetName']"//在当前行jquery查找匹配字符串
				}
			},
			maxLength :{
				operation:'w',//可输入
				maxleng:15,//最大长度
				valconfig:{//校验配置
					valReg:regexEnum.intege1,//对最大长度字段校验 正则表达式正整数
					findstr:"input[name='maxLength']",//在当前行jquery查找匹配字符串
					errmsg:"正整数"//错误消息
				}
			},
			minLength :{
				operation:'w',//可输入
				maxleng:15,
				valconfig:{//校验配置
					valReg:regexEnum.intege1,//正则表达式正整数
					findstr:"input[name='minLength']",//在当前行jquery查找匹配字符串
					errmsg:"正整数"//错误消息
				}
			},
			defaultValue :{
				operation:'w',//可输入
				maxleng:255
			}
		},
		many_string:{//下拉选择多行文本框
			flexValueSetName :{
				operation:'r',//隐藏(只读)  系统数据集合隐藏
				valconfig:{//校验配置
					findstr:"input[name='flexValueSetName']"//在当前行jquery查找匹配字符串
				}
			},
			maxLength :{
				operation:'w',
				maxleng:15,
				valconfig:{//校验配置
					valReg:regexEnum.intege1,//正则表达式正整数
					findstr:"input[name='maxLength']",//在当前行jquery查找匹配字符串
					errmsg:"正整数"//错误消息
				}
			},
			minLength :{
				operation:'w',
				maxleng:15,
				valconfig:{//校验配置
					valReg:regexEnum.intege1,//正则表达式正整数
					findstr:"input[name='minLength']",//在当前行jquery查找匹配字符串
					errmsg:"正整数"//错误消息
				}
			},
			defaultValue :{operation:'w',maxleng:255}
		},
		integer:{
			flexValueSetName :{
				operation:'r',//隐藏(只读)  系统数据集合隐藏
				valconfig:{//校验配置
					findstr:"input[name='flexValueSetName']"//在当前行jquery查找匹配字符串
				}
			},
			maxLength :{
				operation:'w',
				maxleng:15,
				valconfig:{//校验配置
					valReg:regexEnum.intege1,//正则表达式正整数
					findstr:"input[name='maxLength']",//在当前行jquery查找匹配字符串
					errmsg:"正整数"//错误消息
				}
			},
			minLength :{
				operation:'w',
				maxleng:15,
				valconfig:{//校验配置
					valReg:regexEnum.intege1,//正则表达式正整数
					findstr:"input[name='minLength']",//在当前行jquery查找匹配字符串
					errmsg:"正整数"//错误消息
				}
			},
			defaultValue :{
				operation:'w',
				maxleng:15,
				valconfig:{//校验配置
					valReg:regexEnum.intege,//正则表达式整数
					findstr:"input[name='defaultValue']",//在当前行jquery查找匹配字符串
					errmsg:"整数"//错误消息
				}
			}
		},
		float:{
			flexValueSetName :{
				operation:'r',//隐藏(只读)  系统数据集合隐藏
				valconfig:{//校验配置
					findstr:"input[name='flexValueSetName']"//在当前行jquery查找匹配字符串
				}
			},//浮点型时,系统数据集合为只读不能进行选择
			maxLength :{
				operation:'w',
				maxleng:15,
				valconfig:{//校验配置
					valReg:regexEnum.intege1,//正则表达式正整数
					findstr:"input[name='maxLength']",//在当前行jquery查找匹配字符串
					errmsg:"正整数"//错误消息
				}
			},
			minLength :{
				operation:'w',
				maxleng:15,
				valconfig:{//校验配置
					valReg:regexEnum.intege1,//正则表达式正整数
					findstr:"input[name='minLength']",//在当前行jquery查找匹配字符串
					errmsg:"正整数"//错误消息
				}
			},
			defaultValue :{
				operation:'w',
				maxleng:15,
				valconfig:{//校验配置
					valReg:regexEnum.decmal,//正则表达浮点
					findstr:"input[name='defaultValue']",//在当前行jquery查找匹配字符串
					errmsg:"带小数点的数字"//带小数点的数字
				}
			} 
		},
		flex:{//用户选择页面形式
			flexValueSetName :{
				operation:'w',
				valconfig:{//校验配置
					valReg:regexEnum.notempty,//正则表达浮点
					findstr:"input[name='flexValueSetName']",//在当前行jquery查找匹配字符串
					errmsg:"必选"//数字或带小数点的数字
				}
			},
			maxLength :{
				operation:'r',
				valconfig:{//校验配置
					findstr:"input[name='maxLength']"//在当前行jquery查找匹配字符串
				}
			},//下拉框
			minLength :{
				operation:'r',
				valconfig:{//校验配置
					findstr:"input[name='minLength']"//在当前行jquery查找匹配字符串
				}
			},
			defaultValue :{
				operation:'r',
				valconfig:{//校验配置
					findstr:"input[name='defaultValue']"//在当前行jquery查找匹配字符串
				}
			}
		},
		syscomponent:{//用户选择页面形式
			flexValueSetName :{
				operation:'w',
				valconfig:{//校验配置
					valReg:regexEnum.notempty,//正则表达浮点
					findstr:"input[name='flexValueSetName']",//在当前行jquery查找匹配字符串
					errmsg:"必选"//数字或带小数点的数字
				}
			},
			maxLength :{
				operation:'r',
				valconfig:{//校验配置
					findstr:"input[name='maxLength']"//在当前行jquery查找匹配字符串
				}
			},//下拉框
			minLength :{
				operation:'r',
				valconfig:{//校验配置
					findstr:"input[name='minLength']"//在当前行jquery查找匹配字符串
				}
			},
			defaultValue :{
				operation:'r',
				valconfig:{//校验配置
					findstr:"input[name='defaultValue']"//在当前行jquery查找匹配字符串
				}
			}
		},
		radio:{
			flexValueSetName :{
				operation:'w',
				valconfig:{//校验配置
					valReg:regexEnum.notempty,//正则表达浮点
					findstr:"input[name='flexValueSetName']",//在当前行jquery查找匹配字符串
					errmsg:"必选"//数字或带小数点的数字
				}
			},
			maxLength :{
				operation:'r',//隐藏(只读)  
				valconfig:{//校验配置
					findstr:"input[name='maxLength']"//在当前行jquery查找匹配字符串
				}
			},//单选
			minLength :{
				operation:'r',//隐藏(只读)  
				valconfig:{//校验配置
					findstr:"input[name='minLength']"//在当前行jquery查找匹配字符串
				}
			},
			defaultValue :{
				operation:'r',//隐藏(只读)  
				valconfig:{//校验配置
					findstr:"input[name='defaultValue']"//在当前行jquery查找匹配字符串
				}
			}
		},
		date:{
			maxLength :{
				operation:'r',//隐藏(只读)  
				valconfig:{//校验配置
					findstr:"input[name='maxLength']"//在当前行jquery查找匹配字符串
				}
			},//日期
			minLength :{
				operation:'r',//隐藏(只读)  
				valconfig:{//校验配置
					findstr:"input[name='minLength']"//在当前行jquery查找匹配字符串
				}
			},
			defaultValue :{
				operation:'w',
				valconfig:{//校验配置
					valReg:regexEnum.date,//正则表达日期
					findstr:"input[name='defaultValue']",//在当前行jquery查找匹配字符串
					errmsg:"格式不正确(2010-01-01)"//数字或带小数点的数字
				}
			},
			flexValueSetName :{
				operation:'r',//隐藏(只读)  系统数据集合隐藏
				valconfig:{//校验配置
					findstr:"input[name='flexValueSetName']"//在当前行jquery查找匹配字符串
				}
			}
		}
	}
}

/**
 * 将数据保存到服务器
 */
 CreatFromFiledTable.prototype.saveDataListToSever=  function(callback){
 	if(!CustomFormService)return; //没有配置保存到服务器端的DWR方法
 	var data = this.getColumDataList() ;
	var re =this.getValidator();
	if(!re){
		art.dialog({lock:true,content: '请数据填写完整，并保存！',yesFn: true});
		return true;
	}
	var appContext = this;
	for(var i=0 ;i<data.dataList.length;i++){
		if(data.dataList[i].htmlType=='syscomponent'){//系统组件
			data.dataList[i].htmlType = data.dataList[i].flexValueSet.id;
			data.dataList[i].flexValueSetId =null;
			data.dataList[i].flexValueSet = null;
		}
	}
	CustomFormService.updateCwfColumnList(data.dataList,data.dropIdList,formid,{
			callback : function(data) {
				appContext.clearDropDataList();
				if(data){
					var trs = $('#'+appContext.config.tbodyId).find('tr');
					for(var i=0 ;i<data.length;i++){
						trs.get(i).columData.id = data[i].id;
					}
				}
				callback();
			},
			errorHandler : function(
					errorString,
					exception) {
				art.dialog({lock:true,content: '保存发生错误！（error:'+errorString+')',yesFn: true});
			}
		});
 }

/**
 * 清除删除列缓存
 */
 CreatFromFiledTable.prototype.clearDropDataList=  function (){
 	$('#'+this.config.tbodyId).get(0).dropColum = new Object();
 }

/**
*获取所有行的数据
*/
 CreatFromFiledTable.prototype.getColumDataList=  function (){
 	var trs = $('#'+this.config.tbodyId).find('tr');
 	var dataList  = new Array();
 	for(var i=0 ;i <trs.length;i++){
 		var record = trs.get(i).columData;
 		for(var par in record){
 			record[par] = record[par]?record[par]:null;//将数据中undefined清除
 			record.columnSequence= i;
 		}
 		dataList[i] = record;
 	}
 	var dcol  =$('#'+this.config.tbodyId).get(0).dropColum;
 	var dropIdList  = new Array();
 	for(var par in dcol){
 		dropIdList[dropIdList.length] = Number(par);
 	}
 	return {
 		dataList :dataList,
 		dropIdList:dropIdList
 	}
}


/**
*获取选中行的数据
*/
 CreatFromFiledTable.prototype.getSelectedColumDataList=  function (){
 	var trs = $('#'+this.config.tbodyId+" tr");//.find("[name='checkbox']");
 	var dataList  = new Array();
 	for(var i=0 ;i <trs.length;i++){
 		var tr  = trs.get(i);
 		var box = $(tr).find("input[name='checkbox']").get(0);
 		if(box.checked==true){
	 		var record = tr.columData;
	 		for(var par in record){
	 			record[par] = record[par]?record[par]:null;//将数据中undefined清除
	 			record.columnSequence= i;
	 		}
	 		dataList[dataList.length] = record;
 		}
 	}
 	return dataList;
}

