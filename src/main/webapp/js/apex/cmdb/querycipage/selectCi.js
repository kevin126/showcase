/***选择ci弹出窗口操作js**/
var PWIN = window.parent ;//父窗口对象
var PDOC = window.parent.document;

function getPanelObject(){
	var panel =  document.getElementById('cilist');
	if(panel){
		if(!panel.selectCI){
			panel.selectCI = new Object();
		}
		return panel.selectCI;
	}else{
		alert("没有结果集!");
	}
}


/**单选事件*/
function selectCheckboxEvent(obj,ciid){
	if(obj){
		if(!ciid)ciid = obj.vlaue;
		if(!ciid)return;
		var trObj = obj.parentNode.parentNode;// 行对象
		if(obj.checked==true){
			var noder = trObj.cloneNode(true);
			selectObj(ciid,noder);
		}else{
			var cipanel = getPanelObject();
			delete cipanel[''+ciid];
		}
	}
}

/**全选事件*/
function selectTopCheckboxEvent(obj){
	if(obj){
		var checkboxsT = document.getElementById("cicheckboxs");
		if(!checkboxsT)return;
		var cheboxs = checkboxsT.getElementsByTagName("INPUT");
		if(!cheboxs)return;
		for(var i =0 ;i < cheboxs.length;i++){
			if(cheboxs[i].type=='checkbox'){
				var checkbox  = cheboxs[i];
				if(obj.checked==true){
					checkbox.checked=true;
				}else{
					checkbox.checked=false;
				}
			}			
		}
		
	}
}

function checkSelected(){
	var checkboxsT = document.getElementById("cicheckboxs");
	if(!checkboxsT)return;
	var cheboxs = checkboxsT.getElementsByTagName("INPUT");
	if(!cheboxs)return;
	for(var i =0 ;i < cheboxs.length;i++){
		if(cheboxs[i].type=='checkbox'){
			var checkbox  = cheboxs[i];
			if(checkbox.checked==true){
				var trObj = checkbox.parentNode.parentNode;// 行对象
				var noder = trObj.cloneNode(true);
				selectObj(checkbox.value,noder);
			}else{
				var cipanel = getPanelObject();
				delete cipanel[''+checkbox.value];
			}
		}			
	}
}

function selectObj(ciid,objNode){
	if(!objNode)return;
	var cipanel = getPanelObject();
	if(ciid){
		if(!cipanel[''+ciid]){
			cipanel[''+ciid] = objNode.cloneNode(true);
		}else{
			delete cipanel[''+ciid] ;
			cipanel[''+ciid] = objNode.cloneNode(true);
		}
		
	}
}

/**添加到工单页面*/
function AddToWf(){
	if(!PDOC)return;
	checkSelected();
	var cipanel = getPanelObject();
	var cis = new Array();
	for(var par in cipanel){
		cis.push(par);
	}
	if(cis.length==0){
		Ext.MessageBox.show({
   			title: '提示',
			msg: '请选择记录！',
			buttons : Ext.MessageBox.OK,
			icon : Ext.MessageBox.INFO
          });	
        return;
	}
	CIselectCallback = PWIN.CIselectCallback ;
	if(CIselectCallback){
		CIselectCallback(cis,cipanel);//父窗口回调函数
		for(var par in cipanel){
			delete cipanel[par];
		}
		
		Ext.MessageBox.show({
				      			title: '提示',
								msg: '添加成功！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO
				           });	
		
		//delete document.getElementById('cilist').selectCI;
	}
}



/**隐藏关注列表*/
function disAttionList(){
}

/**显示我的关注列表*/
function displayAttentionList(){
}

