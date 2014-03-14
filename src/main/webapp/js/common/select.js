function init_select_set(){
	btn_url="/itsm/images/new_top/ne_bg.jpg";
	btn_focus_url="/itsm/images/new_top/ne_bg.jpg";
	border_color="#aaaaaa";
	font_size="12px";
	rollover_style = "url("+btn_focus_url+") no-repeat right 0px";
	rollout_style = "url("+btn_url+") no-repeat right 0px";
};



var childCreate=false;
function Offset(e)
//取标签的绝对位置
{
	var t = e.offsetTop;
	var l = e.offsetLeft;
	var w = e.offsetWidth;
	var h = e.offsetHeight;

	while(e=e.offsetParent)
	{
		t+=e.offsetTop;
		l+=e.offsetLeft;
	}
	return {
		top : t,
		left : l,
		width : w,
		height : h
	}
};

function loadSelect(obj){
	//第一步：取得Select所在的位置
	var offset=Offset(obj);
	//第二步：将真的select隐藏
	
	//第三步：虚拟一个div出来代替select
	var iDiv = document.createElement("div");
		iDiv.className="iDiv";
		iDiv.id="selectof" + obj.name;
		iDiv.style.position = "absolute";
		iDiv.style.width=offset.width + "px";
		iDiv.style.height=offset.height + "px";
		iDiv.style.top=offset.top + "px";
		iDiv.style.left=offset.left + "px";
		iDiv.style.background=rollout_style;
		iDiv.style.border="1px solid "+border_color;
		iDiv.style.borderWidth="0 0 1px 1px";
		iDiv.style.fontSize="12px";
		iDiv.style.lineHeight=offset.height+4 + "px";
		iDiv.style.textIndent="4px";
		iDiv.style.cursor="pointer";
		iDiv.style.overflow="hidden";
		document.body.appendChild(iDiv);

	//第四步：将select中默认的选项显示出来
	var tValue=obj.options[obj.selectedIndex].innerHTML;
	iDiv.innerHTML=tValue;


	//第五步：模拟鼠标点击
	iDiv.onmouseover=function(){
		iDiv.style.background=rollover_style;
	};
	iDiv.onmouseout=function(){
		iDiv.style.background=rollout_style;
	};
	iDiv.onclick=function(){
	
		if (document.getElementById("selectchild" + obj.name)){
		//判断是否创建过div
			if (childCreate){
				//判断当前的下拉是不是打开状态，如果是打开的就关闭掉。是关闭的就打开。
				document.getElementById("selectchild" + obj.name).style.display="none";
				childCreate=false;
			}else{
				document.getElementById("selectchild" + obj.name).style.display="";
				childCreate=true;
			}
		}else{
			//初始一个div放在上一个div下边，当options的替身。
			var cDiv = document.createElement("div");
			cDiv.id="selectchild" + obj.name;
			cDiv.style.position = "absolute";
			cDiv.style.width=offset.width-1 + "px";
			cDiv.style.height=obj.options.length *20 + "px";
			cDiv.style.top=(offset.top+offset.height-1) + "px";
			cDiv.style.left=offset.left + "px";
			cDiv.style.background="#f7f7f7";
			cDiv.style.border="1px solid silver";
			cDiv.style.cursor="default";

			var uUl = document.createElement("ul");
			uUl.id="uUlchild" + obj.name;
			uUl.style.listStyle="none";
			uUl.style.margin="0";
			uUl.style.padding="0";
			uUl.style.fontSize=font_size;
			cDiv.appendChild(uUl);
			document.body.appendChild(cDiv);		
			childCreate=true;
			for (var i=0;i<obj.options.length;i++){
				//将原始的select标签中的options添加到li中
				var lLi=document.createElement("li");
				lLi.id=obj.options[i].value;
				lLi.style.textIndent="4px";
				lLi.style.height="20px";
				lLi.style.lineHeight="20px";
				lLi.innerHTML=obj.options[i].innerHTML;
				uUl.appendChild(lLi);
			}

			var liObj=document.getElementById("uUlchild" + obj.name).getElementsByTagName("li");
			
			
			for (var j=0;j<obj.options.length;j++){
				//为li标签添加鼠标事件
				liObj[j].onmouseover=function(){
					this.style.background="gray";
					this.style.color="white";
				};
				liObj[j].onmouseout=function(){
					this.style.background="white";
					this.style.color="black";
				};
				liObj[j].onclick=function(){
					//做两件事情，一是将用户选择的保存到原始select标签中，要不做的再好看表单递交后也获取不到select的值了。
					obj.options.length=0;
					obj.options[0]=new Option(this.innerHTML,this.id);
					//同时我们把下拉的关闭掉。
					document.getElementById("selectchild" + obj.name).style.display="none";
					childCreate=false;
					iDiv.innerHTML=this.innerHTML;
				};
				
			}
		}
	};
};

/*if(window.attachEvent){
	window.attachEvent("onload",init_select);
}else{
	window.onload=function(){
		init_select();
	};
}*/


function init_select(){
	init_select_set();
	var s = document.getElementsByTagName('select');
      for (var i=0; i<s.length; i++) {
        loadSelect(s[i]);
      }
      for(var i=0 ; i<s.length;i++){
      	  s[i].style.display="none";
      	  //s[i].style.opacity = 0;
		 // s[i].style.filter = 'alpha(opacity=0)';
      	//$(s[i]).css('margin-left:-56px;filter:alpha(opacity=0); opacity:0;');
      }
};

if(window.addEventListener)//火狐
{
   window.addEventListener("load",init_select,false);
} 
else if(window.attachEvent)//ie内核
{
   window.attachEvent('onload',init_select);
} 

document.onclick=function(evt){
	var evt = evt || window.event; 
	var target = evt.target || window.event.srcElement;
	var s = document.getElementsByTagName('select');
	if(target.className!="iDiv"){
      for (var i=0; i<s.length; i++) {
        if(!document.getElementById("selectchild" + s[i].name)) continue;
        document.getElementById("selectchild" + s[i].name).style.display="none";
        childCreate=false;
      }
   }
};
