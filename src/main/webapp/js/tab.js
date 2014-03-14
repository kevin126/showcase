function setTab(m,n){
 var tli=document.getElementById("menu"+m).getElementsByTagName("h3");
 var mli=document.getElementById("tab"+m).getElementsByTagName("ul");
 for(i=0;i<tli.length;i++){
  tli[i].className=i==n?"hover":"";
  mli[i].style.display=i==n?"block":"none";
 }
}

function setTabol(m,n){
 var tli=document.getElementById("menu"+m).getElementsByTagName("h3");
 var mli=document.getElementById("tab"+m).getElementsByTagName("ol");
 for(i=0;i<tli.length;i++){
  tli[i].className=i==n?"hover":"";
  mli[i].style.display=i==n?"block":"none";
 }
}