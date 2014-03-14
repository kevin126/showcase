
//**根据类型显示分页查询ci
function displayPage(typeId){
	 jQuery.ajax(
	   {
	      data :
	      {
	         startIndex : 0,
	         limitIndex : 10,
	         currentPage : 1,
	         CITypeId:typeId
	      }, 
	      dataType : 'html', 
	      type : 'post', 
	      url : '/itsm/cmdb/queryCi.do?method=selectCiByType&menuId=m6_0', 
	      success : function(html)
	      {
	      	var cilist  = document.getElementById("cilist");
	      	cilist.innerHTML = html;
	      }
	   });
}

//**根据lucen关键字显示分页查询ci
function displayPageByKeyword(keyword){
	 jQuery.ajax(
	   {
	      data :
	      {
	         startIndex : 0,
	         limitIndex : 10,
	         currentPage : 1,
	         keyword:keyword
	      }, 
	      dataType : 'html', 
	      type : 'post', 
	      url : '/itsm/cmdb/queryCi.do?method=selectCiByLucen&menuId=m6_0', 
	      success : function(html)
	      {
	      	var cilist  = document.getElementById("cilist");
	      	cilist.innerHTML = html;
	      }
	   });
}

function searchCiByKeyword(obj){
	var keyworde = document.getElementById("keyword");
	var nav = document.getElementById("access");
	if(keyworde){
		if(keyworde.value=='输入关键字进行查询')keyworde.value=' ';
		displayPageByKeyword(keyworde.value);
		if(nav){
			nav.innerHTML=">>'"+keyworde.value+"'";
		}
	}
}
		



