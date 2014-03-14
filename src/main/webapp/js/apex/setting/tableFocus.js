$(function(){bindMouseOver('table1', 'white', '#EFEFEF', '#DDE8EE');});
function bindMouseOver(tableId, firstColor, secondColor, thisColor){
	($("#" + tableId).find("tbody") ? $("#" + tableId).find("tbody") : $("#" + tableId)).children("tr").each(function(index){
		if(index == 0) return;
		$(this).bind("mouseover", function(){$(this).children().css("backgroundColor", thisColor);});
		$(this).bind("mouseout", function(){index % 2 ? $(this).children().css("backgroundColor", firstColor) : $(this).children().css("backgroundColor", secondColor);});
	});
}