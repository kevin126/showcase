function switchMenu(menuId) {
	var obj = document.getElementById(menuId);
	var div1 = document.getElementById('Div1');
	var div2 = document.getElementById('Div2');
	var div3 = document.getElementById('Div3');
	var div4 = document.getElementById('Div4');
	var div5 = document.getElementById('Div5');
	for (var i = 1; i < 6; i++) {
		document.getElementById('tbm' + i).className = 'noshow';
	}
	div1.style.display = (menuId == 'tbm1' ? 'block' : 'none');
	div2.style.display = (menuId == 'tbm2' ? 'block' : 'none');
	div3.style.display = (menuId == 'tbm3' ? 'block' : 'none');
	div4.style.display = (menuId == 'tbm4' ? 'block' : 'none');
	div5.style.display = (menuId == 'tbm5' ? 'block' : 'none');
	obj.className = 'show';
}
/**锁定或解锁ci完成后设置显示样式**/

function lockCiStyle(returnValue){
		if(returnValue&& ''!= returnValue){
			Ext.Msg.show({
							title : '错误',
							msg : returnValue,
							modal : true,
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});
		}else{
			var obj = document.getElementById('unlockci');
			if(!obj) obj = document.getElementById('lockci');
			if(obj.id=='unlockci'){
			//id ="lockimg"  
				document.getElementById('locktext').innerHTML="解除锁定"
				document.getElementById('lockimg').src="../images/newui/lock.gif"
				obj.id='lockci';
			}else if(obj.id=='lockci'){
				document.getElementById('locktext').innerHTML="锁定"
				document.getElementById('lockimg').src="../images/newui/unlock.gif"
				obj.id='unlockci'
			}
		}
	
}

function lockCi(obj,id,userid){
	if(obj){
		if(obj.id=='unlockci'){
		 	ConfigurationService.lockOneCIStatus(id, userid,lockCiStyle);
		}else if(obj.id=='lockci'){
			ConfigurationService.unLockCIStatus(id, userid,lockCiStyle);
		}
	}
}

function cmdbCiDel(){
	var CITOPO_VIEW = document.getElementById('CITOPO_VIEW');
	var cmdbCiDelDIV = document.getElementById('cmdbCiDelDIV');
	var cmdbdetailbottom = document.getElementById('cmdbdetailbottom');
	
	if(CITOPO_VIEW){
		CITOPO_VIEW.style.display="none";
		cmdbdetailbottom.style.display="none";
		cmdbCiDelDIV.style.display="block";
	}
}

function disDel(){
	var CITOPO_VIEW = document.getElementById('CITOPO_VIEW');
	var cmdbCiDelDIV = document.getElementById('cmdbCiDelDIV');
	var cmdbdetailbottom = document.getElementById('cmdbdetailbottom');
	if(CITOPO_VIEW){
		CITOPO_VIEW.style.display="block";
		cmdbdetailbottom.style.display="block";
		cmdbCiDelDIV.style.display="none";
	}
}