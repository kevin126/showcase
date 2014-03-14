if(document.addEventListener){
		document.addEventListener("keypress",fireFoxHandler, true); 
}else{
		document.attachEvent("onkeypress",ieHandler); 
}
    
 function fireFoxHandler(evt){
    if(evt.keyCode == 13 && evt.ctrlKey){
       var evt = document.createEvent("MouseEvents"); 
	   evt.initEvent("click", true, true); 
	   document.getElementById('submitButton').dispatchEvent(evt); 
	}
}
    
function ieHandler(evt){
	if(evt.keyCode == 10 && evt.ctrlKey)
    	 document.getElementById('submitButton').click(); 
}