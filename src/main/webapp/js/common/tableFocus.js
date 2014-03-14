//$(function(){bindMouseOver('table1', 'white', '#EFEFEF', '#DDE8EE');});

function bindMouseOver(tableId, firstColor, secondColor, thisColor){
	($("#" + tableId).find("tbody") ? $("#" + tableId).find("tbody") : $("#" + tableId)).children("tr").each(function(index){
		if(!index) return;
		!(index & 1) && $(this).children().css("backgroundColor", secondColor);
		$(this).bind("mouseover", function(){$(this).children().css("backgroundColor", thisColor);});
		$(this).bind("mouseout", function(){index & 1 ? $(this).children().css("backgroundColor", firstColor) : $(this).children().css("backgroundColor", secondColor);});
	});
}
/**
with check box,change Color each tr and the tr's sibling
*/
function bindMouseOver2(firstColor, secondColor, thisColor){
	var checkTr=$("table input[type=checkbox]").parent().parent();
		checkTr.each(function(index){
		!(index & 1) && $(this).children().css("backgroundColor", secondColor);
		!(index & 1) && $(this).next().children().css("backgroundColor", secondColor);
		$(this).bind("mouseover", function(j){
		$(this).children().css("backgroundColor", thisColor);
		$(this).next().children().css("backgroundColor", thisColor);
		});
		$(this).next().bind("mouseover", function(j){
		$(this).children().css("backgroundColor", thisColor);
		$(this).prev().children().css("backgroundColor", thisColor);
		});
		$(this).bind("mouseout", function(){
		index & 1 ? $(this).children().css("backgroundColor", firstColor) : $(this).children().css("backgroundColor", secondColor);
		index & 1 ?$(this).next().children().css("backgroundColor", firstColor) :$(this).next().children().css("backgroundColor", secondColor);
		});
		$(this).next().bind("mouseout", function(){
		index & 1 ? $(this).children().css("backgroundColor", firstColor) : $(this).children().css("backgroundColor", secondColor);
		index & 1 ?$(this).prev().children().css("backgroundColor", firstColor) :$(this).prev().children().css("backgroundColor", secondColor);
		});
	
});
}