/***
*按关键字查询CI相关js
*
*/
//**根据类型显示分页查询ci
function displayPage(typeId){
	 jQuery.ajax(
	   {
	      data :
	      {
	         startIndex : 0,
	         currentPage : 1,
	         CITypeId:typeId
	      }, 
	      dataType : 'html', 
	      type : 'post', 
	      url : '/itsm/cmdb/queryCi.do?method=queryCiByType&menuId=m6_0&oprationCI='+oprationCI, 
	      success : function(html)
	      {
	      	var cilist  = document.getElementById("cilist");
	      	cilist.innerHTML = html;
	      	//toggleTableColor('toggleTable');
	      }
	   });
}

//**根据lucen关键字显示分页查询ci
function displayPageByKeyword(keyword){
	 document.getElementById('citypedetaillist').style.display="none";
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
	      url : '/itsm/cmdb/queryCi.do?method=queryCi&menuId=m6_0&oprationCI='+oprationCI, 
	      success : function(html)
	      {
	      	var cilist  = document.getElementById("cilist");
	      	cilist.innerHTML = html;
	      	toggleTableColor('toggleTable');
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
			if(keyworde.value==' '){
				nav.innerHTML=">>";
			}else{
				nav.innerHTML=">>'"+Ext.util.Format.htmlEncode(keyworde.value)+"'";
			}
		}
	}
}



