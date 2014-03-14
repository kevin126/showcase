/**
 * 创建资产模块的验证
 */

 function check2wLength(id){
 	var tag = document.getElementById(id);
 	var div = document.getElementById(id+"Tip");
 	var button = document.getElementById(id+"Button");
 	var value = tag.value;
 	if(value.length>20000){
 		div.style.display="block";
 		//button.setAttribute("disabled","true");
 		//button.className="button_gray_fixed";
        tag.focus();
        return false;
 	}else{
 		//button.removeAttribute("disabled");
 		//button.className="button_blue_fixed";
 		div.style.display="none";
 		return true;
 	}
 }