//JS下的LOG，只适用于FF，兼容IE
function JsLog(){
	
}

JsLog.log = function(msg){
	if(window.console){
		window.console.log(msg);
	}
}