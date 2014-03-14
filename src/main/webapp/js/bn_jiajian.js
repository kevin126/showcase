// JavaScript Document
$(document).ready(function(){
  $(".bn").click(function(){
  var i = $(".bn").index(this); 
      s = $(".shuzhi").eq(i).attr("value");
	  $(".shuzhi").eq(i).attr("value",parseInt(s)+1);  
}); 
$(".bn2").click(function(){
  var i = $(".bn2").index(this); 
      s = $(".shuzhi").eq(i).attr("value");
	  if(s>0){
	  $(".shuzhi").eq(i).attr("value",parseInt(s)-1);}
});
});


