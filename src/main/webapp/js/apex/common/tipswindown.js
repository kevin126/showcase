///-------------------------------------------------------------------------
//jQuery弹出窗口 By Await [2009-11-22]
//--------------------------------------------------------------------------
/*参数：[可选参数在调用时可写可不写,其他为必写]
----------------------------------------------------------------------------
    title:	窗口标题
  content:  内容(可选内容为){ text | id | img | url | iframe }
    width:	内容宽度
   height:	内容高度
	 drag:  是否可以拖动(ture为是,false为否)
     time:	自动关闭等待的时间，为空是则不自动关闭
   showbg:	[可选参数]设置是否显示遮罩层(0为不显示,1为显示)
  cssName:  [可选参数]附加class名称
 ------------------------------------------------------------------------*/
 //示例:
 //------------------------------------------------------------------------
 //simpleWindown("例子","text:例子","500","400","true","3000","0","exa")
 //------------------------------------------------------------------------
var showWindown = true;
var templateSrc = "/itsm/"; //设置loading.gif路径

function tipsWindown(title,content,width,height,drag,time,showbg,cssName) {
	var framid= Math.random()+"fr";
	$("#windown-box").remove(); //请除内容
	$("#windownbgfram").remove();
	var width = width>= (screen.width-100)?this.width=(screen.width-100):this.width=width;	    //设置最大窗口宽度
	var height = height>= (screen.height-250)?this.height=(screen.height-250):this.height=height;  //设置最大窗口高度
	if(showWindown == true) {
		var simpleWindown_html = new String;
			simpleWindown_html = "<iframe id='windownbgfram' height='0' width='0'></iframe><div id=\"windownbg\" style=\"height:"+$(document).height()+"px;filter:alpha(opacity=0);opacity:0;z-index: 999901\"></div>";
			simpleWindown_html += "<div id=\"windown-box\">";
			simpleWindown_html += "<div id=\"windown-title\" ><div class='flo_z'><img src='/itsm/images/ci_por/1_r3_c2.jpg' /></div><h2></h2>";
			simpleWindown_html += "<span id=\"windown-close\">关闭</span></div>";
			simpleWindown_html += "<div id=\"windown-content-border\"><div id=\"windown-content\"></div></div>"; 
			simpleWindown_html += "</div>";
			$("body").append(simpleWindown_html);
			show = false;
	}
	contentType = content.substring(0,content.indexOf(":"));
	content = content.substring(content.indexOf(":")+1,content.length);
	switch(contentType) {
		case "text":
		$("#windown-content").html(content);
		break;
		case "id":
		$("#windown-content").html($("#"+content+"").html());
		break;
		case "img":
		$("#windown-content").ajaxStart(function() {
			$(this).html("<img src='"+templateSrc+"/js/apex/Thickbox/images/loadingAnimation.gif' class='loading' />");
		});
		$.ajax({
			error:function(){
				$("#windown-content").html("<p class='windown-error'>加载数据出错...</p>");
			},
			success:function(html){
				$("#windown-content").html("<img src="+content+" alt='' />");
			}
		});
		break;
		case "url":
		var content_array=content.split("?");
		$("#windown-content").ajaxStart(function(){
			$(this).html("<img src='"+templateSrc+"/js/apex/Thickbox/images/loadingAnimation.gif' class='loading' />");
		});
		$.ajax({
			type:content_array[0],
			url:content_array[1],
			data:content_array[2],
			error:function(){
				$("#windown-content").html("<p class='windown-error'>加载数据出错...</p>");
			},
			success:function(html){
				$("#windown-content").html(html);
			}
		});
		break;
		case "iframe":
		//$("#windown-content").ajaxStart(function(){
		//	$(this).html("<img src='"+templateSrc+"/js/apex/Thickbox/images/loadingAnimation.gif' class='loading' />");
		//});
		//$.ajax({
		//	error:function(){
		//		$("#windown-content").html("<p class='windown-error'>加载数据出错...</p>");
		//	},
		//	success:function(html){

		{
			var frame = document.createElement('IFRAME');
			frame.style.background='#F1F5FB';
			frame.setAttribute('id',framid);
			frame.setAttribute('name',framid);
			frame.setAttribute('scrolling','auto');
			frame.setAttribute('frameborder','0');
			frame.setAttribute('marginheight','0');
			frame.setAttribute('marginwidth','0');
			frame.setAttribute('height',"100%");
			frame.setAttribute('width',"100%");
			frame.setAttribute('src',content);
			frame.style.border="0px solid blue";
			frame.style.frameborder="0px solid blue";
			this.frame = frame;
		}
	}
	$("#windown-title h2").html(title);
	if(showbg == "true") {$("#windownbg").show();}else {$("#windownbg").remove();};
	$("#windownbg").animate({opacity:"0.5"},"normal");//设置透明度
	$("#windown-box").show();
	if( height >= 527 ) {
		$("#windown-title").css({width:(parseInt(width)+22)+"px"});
		$("#windown-content").css({width:(parseInt(width)+17)+"px",height:height+"px"});
	}else {
		$("#windown-title").css({width:(parseInt(width)+10)+"px"});
		$("#windown-content").css({width:width+"px",height:height+"px"});
	}
	var	cw = document.documentElement.clientWidth,ch = document.documentElement.clientHeight,est = document.documentElement.scrollTop; 
	var _version = $.browser.version;
	if ( _version == 6.0 ) {
		$("#windown-box").css({left:"50%",top:(parseInt((ch)/2)+est)+"px",marginTop: -((parseInt(height)+53)/2)+"px",marginLeft:-((parseInt(width)+32)/2)+"px",zIndex: "999999"});
	}else {
		$("#windown-box").css({left:"50%",top:"50%",marginTop:-((parseInt(height)+53)/2)+"px",marginLeft:-((parseInt(width)+32)/2)+"px",zIndex: "999999"});
	};
	var Drag_ID = document.getElementById("windown-box"),DragHead = document.getElementById("windown-title");
		
	var moveX = 0,moveY = 0,moveTop,moveLeft = 0,moveable = false;
		if ( _version == 6.0 ) {
			moveTop = est;
		}else {
			moveTop = 0;
		}
	var	sw = Drag_ID.scrollWidth,sh = Drag_ID.scrollHeight;
		DragHead.onmouseover = function(e) {
			if(drag == "true"){DragHead.style.cursor = "move";}else{DragHead.style.cursor = "default";}
		};
		DragHead.onmousedown = function(e) {
		if(drag == "true"){moveable = true;}else{moveable = false;}
		e = window.event?window.event:e;
		var ol = Drag_ID.offsetLeft, ot = Drag_ID.offsetTop-moveTop;
		moveX = e.clientX-ol;
		moveY = e.clientY-ot;
		document.onmousemove = function(e) {
				if (moveable) {
				e = window.event?window.event:e;
				var x = e.clientX - moveX;
				var y = e.clientY - moveY;
					if ( x > 0 &&( x + sw < cw) && y > 0 && (y + sh < ch) ) {
						Drag_ID.style.left = x + "px";
						Drag_ID.style.top = parseInt(y+moveTop) + "px";
						Drag_ID.style.margin = "auto";
						}
					}
				}
		document.onmouseup = function () {moveable = false;};
		Drag_ID.onselectstart = function(e){return false;}
	}
	$("#windown-content").attr("class","windown-"+cssName);
	var closeWindown = function() {
		$("#windownbg").remove();
		$("#windown-box").fadeOut("slow",function(){$(this).remove();});
	}
	if( time == "" || typeof(time) == "undefined") {
		$("#windown-close").click(function() {
			$("#windownbg").remove();
			$("#windown-box").fadeOut("slow",function(){$(this).remove();});
		});
	}else { 
		setTimeout(closeWindown,time);
	}
	
	var load = function(){
		$("#windown-content").append(this.frame);
	}
	$(document).bind("keydown", function(event){
		if(event.keyCode==27){
			$("#windownbg").remove();
			$("#windown-box").fadeOut("slow",function(){$(this).remove();});
		}
	}); 
	if(this.frame){
		$("#windown-content").css({overflow:'hidden'});
		if(window.navigator.appName=='Netscape'){//火狐不用延迟加载
			load();
		}else{
			setTimeout(load,time);//ie在一定情况下必须延迟加载frame,否则ie在一定情况下会崩溃不知道是为什么,真它nnd郁闷!
		}
		/*window.frames[framid].window.Colse= function(){
			wbg.remove();
			wbx.fadeOut("slow",function(){$(this).remove();});
		}
		window.frames[framid].window.Colse.prototype.wbg = $("#windownbg");
		window.frames[framid].window.Colse.prototype.wbx = $("#windown-box");*/
		return window.frames[framid].window;
	}
	
	
}

document.tipsWindown = tipsWindown;
