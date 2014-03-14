
	function hideDiv(id){
		$("#" + id).hide();
	}
	
	function showDiv(id){
		$("#" + id).show();	
	}
	
	function toggleDiv(id){
		$("#" + id).css("display") == "block" ? hideDiv(id) : showDiv(id);	
	}
