/**
*关注ci相关js
*/
var selectAttentionCis = new Object();

function attionCiEvent(obj,ciid,userid){
	if(obj){ 
		if(!obj.attionCiid)obj.attionCiid = ciid;
		if(!obj.attionUserId)obj.attionUserId = userid;
		var knowpanel = document.getElementById('know');
		var className  = obj.parentNode.className;
		if(obj.value == "变更"){
			attentionCi(obj);
			obj.value = "待变更";
			//obj.parentNode.className='smallBlueButton';
			if(knowpanel && !knowpanel.flag){
				knowpanel.style.display = "block";
				knowpanel.flag = new Object();
			}
		}else if(obj.value == "待变更"){
			disAttentionCi(obj)
			obj.value = "变更";
			//obj.parentNode.className='smallBlueButton';
		}
	}
}

/**关注ci*/
function attentionCi(obj){
	ConfigurationService.attentionCi(obj.attionCiid,obj.attionUserId);
}

/**取消关注*/
function disAttentionCi(obj){
	ConfigurationService.disAttentionCi(obj.attionCiid,obj.attionUserId);
}

/**显示我的关注列表*/
function displayAttentionList(){
	var url = '/cmdb/queryCi.do?method=queryAttenctionCi';
	 request(url,null,attentionCallback);
	 function attentionCallback(html){
	 	var attentionDiv  = document.getElementById("attentionPage");
	 	var querylistDiv  = document.getElementById("queryPage");
	 	attentionDiv.innerHTML = html;
	 	//toggleTableColor('attionListable')
	 	querylistDiv.style.display="none";
	 	attentionDiv.style.display="block";
	 	new AttentionDIVobj();
	 }
}

function AttentionDIVobj(){
	this.attentionDIVobj  =  document.getElementById("attentionPage");
	if(this.attentionDIVobj){
		this.init();//初始化对象
	}
}

AttentionDIVobj.prototype.init = function(){
	if(!this.attentionDIVobj.selectAttentionCis){
		/**我关注的工单列表已经选择的ci*/
		this.attentionDIVobj.selectAttentionCis = new Object();//当前勾选的ci为空列表
		this.selectAttentionCis = this.attentionDIVobj.selectAttentionCis;//关注列表div对象引用当前已经勾选的ci
	}
	this.selectAttentionCis = this.attentionDIVobj.selectAttentionCis;
	this.selectAttentionCis = this.getAllCheckboxElement();//重新设置选中的ci列表
	this.attentionDIVobj.selectAttentionCis = this.selectAttentionCis;//关注列表div对象引用当前已经勾选的ci
	this.attentionDIVobj.allCheckbox = this.allCheckbox;
}

AttentionDIVobj.prototype.getAllCheckboxElement = function(){
	var tbody =  document.getElementById("attentionPage_cilist");
	this.allCheckbox = new Object();
	if(tbody){
		var temObj = new Object();
		var checkbox = tbody.getElementsByTagName("INPUT");
		for(var i =0 ;i<checkbox.length;i++){
			var ele = checkbox[i];
			if(ele.type=='checkbox'){
				if(this.selectAttentionCis[""+ele.value]){
					temObj[""+ele.value] = ele;//已经选择了的ci
					ele.checked = true;
				}
				this.allCheckbox[""+ele.value] = ele;//当前关注列表中所有ci
				ele.checkedCIs = temObj;//将当前处理对象赋予checkbox
			}
		}
		return temObj;//返回经过调整选中的ci列表
	}
}

/**单选事件*/
function selectCheckboxEvent(obj){
	if(obj){
		var div = document.getElementById("attentionPage");
		var allCheckbox = div.allCheckbox;
		if(!allCheckbox){
			new AttentionDIVobj();
		}
		if(obj.checked ==true){
			div.selectAttentionCis[""+obj.value] = obj;
		}else{
			delete div.selectAttentionCis[""+obj.value];
		}
	}
}

/**全选事件*/
function selectTopCheckboxEvent(obj){
	if(obj){
		var div = document.getElementById("attentionPage");
		var attentionDIVobj = div.attentionDIVobj;
		if(!attentionDIVobj){
			new AttentionDIVobj();
		}
		for( var par in div.allCheckbox){
			if(div.allCheckbox[par]){
				var tem  = div.allCheckbox[par];
				if(obj.checked==true){
					tem.checked=obj.checked;
					div.selectAttentionCis[""+tem.value] = tem;
				}else {
					tem.checked=obj.checked;
					delete div.selectAttentionCis[""+tem.value];
				}
			}
		}
	}
}


/**隐藏关注列表*/
function disAttionList(){
	var attentionDiv  = document.getElementById("attentionPage");
 	var querylistDiv  = document.getElementById("queryPage");
 	if(querylistDiv)querylistDiv.style.display="block";
 	if(attentionDiv)attentionDiv.style.display="none";
}


/**取消关注按钮事件*/
function disSelectedAttion(){
	var div = document.getElementById("attentionPage");
	var selectAttentionCis = div.selectAttentionCis;
	var ciids = "";
	for(var par in selectAttentionCis){
		ciids +=par+",";
		var checkbox = selectAttentionCis[par];
		checkbox.checked=false;
		var tr  = checkbox.parentNode.parentNode;
		var tbody  = tr.parentNode;
		tbody.removeChild(tr);
		delete selectAttentionCis[par];
	}
	if(ciids!=""){
		ConfigurationService.disAttentionCi(ciids,pageUserId,function(){
			AsynchronousQuery();
		});
	}else{
		Ext.MessageBox.show({
    			title: '警告',
				msg: '请选择需要取消关注的配置项！',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
         });
	}	
}

/**发起变更*/
function subRFC(){
	var div = document.getElementById("attentionPage");
	var selectAttentionCis = div.selectAttentionCis;
	if(!selectAttentionCis){
		alert('请选择关注的配置项！');
		return ;
	}
	var ciids = "";
	for(var par in selectAttentionCis){
		ciids +=par+",";
			//alert(par);
	}
	var url = "/itsm/servicedesk/creatIssueRfcWiz.do?menuId=m4_0&next=1&processType=RFC&cisets="+ciids
	if(ciids!=""){
		window.location.href = url;
	}else{
		Ext.MessageBox.show({
    			title: '警告',
				msg: '请选择需要进行变更的配置项！',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
         });
	}	
}

