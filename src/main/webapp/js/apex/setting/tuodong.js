// JavaScript Document
function initFloatDiv(divid){
    new FloatDiv(divid);
}

function FloatDiv(divId){
    this.isIE=(navigator.appVersion.indexOf("MSIE")!=-1)?true:false;
    this.dragClickX = 0;
    this.dragClickY = 0;     
    this.titleBar = this.getDocobj(divId);
    this.floatDiv= this.titleBar.parentNode; 
    this.titleBar.floatDiv = this.floatDiv;
    this.titleBar.methodObj = this;
    this.titleBar.onmousedown = this.catchDiv;
    this.closeBar =  this.titleBar.childNodes[0]; 
    this.closeBar.floatDiv = this.floatDiv;
    this.closeBar.onclick = function(){
        this.floatDiv.style.display="none";
        return true;
    }
}

FloatDiv.prototype.getDocobj = function(){
    var elements ;
    elements = new Array();
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (typeof element == 'string'){
            element = document.getElementById(element); 
        }
        if (arguments.length == 1){
            return element;
        }
        elements.push(element);
    }
    return elements;
}

FloatDiv.prototype.catchDiv = function(ev){
    ev=ev||window.event;
    bIsCatchFlyBar = true;     
    this.clientX =  ev.clientX+"";
    this.clientY =  ev.clientY+"";
    try{
        this.setCapture();
    }catch(e){
    }   
    this.onmousemove = this.methodObj.moveFlyBar;
    this.onmouseup = this.methodObj.releaseFlyBar;
    this.style.cursor = "move";
}

FloatDiv.prototype.moveFlyBar = function(ev){
    ev=ev||window.event;
    try{
        var beforX = parseInt(this.floatDiv.style.left);
        var beforY = parseInt(this.floatDiv.style.top);
        var moveX = ev.clientX- parseInt(this.clientX);
        var moveY = ev.clientY- parseInt(this.clientY);
        this.floatDiv.style.left = beforX + moveX + "px";
        this.floatDiv.style.top  = beforY + moveY + "px";
        this.clientX =  ev.clientX+"";
        this.clientY =  ev.clientY+"";
    }catch(e){}
}

FloatDiv.prototype.releaseFlyBar = function(ev){
    this.methodObj.isIE? this.releaseCapture():null;
    try{
        this.releaseCapture();
    }catch(e){}
    this.onmousemove = null;
    this.style.cursor = "";
}
