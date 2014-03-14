/*****
*ci类型树展示js
***********************************************/
var thisPageXMLHttpRequest;//ajax请求对象
var backFunc;//回调函数
/**
*ajax请求响应对象 
*@param url 页面业务逻辑处理地址
*@param object 只嵌套一级的json对象(如:{ name:'lilei',password:'123'} 此对象会传入到后台并存入request.setAttribut("name","lilei")...中
*/
function request(url,object,callback){
	var obj  = new dorequest(url,object,callback);
	obj.buldeXML();//构造xml串
	//obj.sendRequest(true);//发送请求
	obj.subServer();
}

function dorequest(url,object,callback){
	this.xmlHttp;
	this.url = "/itsm/cmdb/AjaxRefreshAreaInHTML";
	this.backFunc= callback;
	this.object = object;
	this.send=url;
	this.creatReq();
	backFunc = this.backFunc;
}

 
dorequest.prototype.buldeXML = function(){
	var str="";
	if(this.object){
		for(var par in this.object){
			str+="<parameter key=\""+par+"\" value=\""+this.object[par]+"\"></parameter>";
		}
	}
	str +="<parameter key=\"url\" value=\""+this.send+"\"></parameter>";
	 
	this.send = "<root>"+str+"</root>";
}
 
dorequest.prototype.creatReq = function () // 创建xmlhttprequest,ajax开始
{
	var req; //定义变量，用来创建xmlhttprequest对象
    if(window.XMLHttpRequest) //非IE浏览器及IE7(7.0及以上版本)，用xmlhttprequest对象创建
    {
        req=new XMLHttpRequest();
    }else if(window.ActiveXObject) //IE(6.0及以下版本)浏览器用activexobject对象创建,如果用户浏览器禁用了ActiveX,可能会失败.
    {
        req=new ActiveXObject("Microsoft.XMLHttp");
    }
    this.xmlHttp = req;
    return req;
}

/**普通ajax 请求方法*/

dorequest.prototype.sendRequest = function(syn){
	if(!syn)syn=true;
	this.xmlHttp.open("post",this.url,syn);//与服务端建立连接(请求方式post或get，地址,true表示异步)
	this.xmlHttp.onreadystatechange=this.callback;//指定回调函数
	thisPageXMLHttpRequest = this.xmlHttp;
	this.xmlHttp.send(this.send);//发送请求
}


dorequest.prototype.callback = function() //回调函数，对服务端的响应处理，监视response状态
{
	this.xmlHttp =thisPageXMLHttpRequest;
	this.backFunc = backFunc;
    if(this.xmlHttp.readyState==4) //请求状态为4表示成功
    {
        if(this.xmlHttp.status==200) //http状态200表示OK
        {
            this.backFunc(this.xmlHttp.responseText);
        }
        else //http返回状态失败
        {
            alert("服务端返回状态" + this.xmlHttp.statusText);
        }
    }
}


/**jqury  请求方法*/
dorequest.prototype.subServer = function ()
{
   var xml = this.send;
   var url = this.url;
   jQuery.ajax(
   {
      data :xml,
      dataType : 'html',
      type : 'post',
      url : url,
      success : function(html)
      {
      	backFunc(html);
      }
   }
   );
}




