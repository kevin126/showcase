//@param m tab区域序号  @parma nTab的序号  @parm z表格的序号
function setTab(m,n,z){
	 var tli=document.getElementById("menu"+m).getElementsByTagName("h3");
	 var mli=document.getElementById("tab"+m).getElementsByTagName("ul");
	 var s = n;
	 if(z)s=z;
	 for(i=0;i<tli.length;i++){
		  if(tli[i]){
		  	tli[i].className=i==n?"hover":"";
		  }
		  if(mli[i]){
		  	mli[i].style.display=i==s?"block":"none";
		  }
	 }
}


function wjsetTab(obj){
	if(obj){
		var menuNode = obj.parentNode?obj.parentNode.parentNode:null;
		if(menuNode){
			var tli=menuNode.getElementsByTagName("H3")
			var mli=menuNode.getElementsByTagName("UL");
			for(i=0;i<tli.length;i++){
				  if(tli[i]){
				  	tli[i].className= (tli[i]==obj)?"hover":"";
				  }
				  if(mli[i]){
				  	mli[i].style.display=(tli[i]==obj)?"block":"none";
				  }
			}
	 	}
	}
}

