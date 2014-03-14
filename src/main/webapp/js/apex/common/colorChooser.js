var ColorHex = new Array('00', '33', '66', '99', 'CC', 'FF')
var SpColorHex = new Array('FF0000', '00FF00', '0000FF', 'FFFF00', '00FFFF',
		'FF00FF')
var current = null
function initcolor(evt) {
	var colorTable = ''
	for (i = 0; i < 2; i++) {
		for (j = 0; j < 6; j++) {
			colorTable = colorTable + '<tr height=15>'
			colorTable = colorTable
					+ '<td width=15 style="background-color:#000000">'
			if (i == 0) {
				colorTable = colorTable
						+ '<td width=15 style="cursor:pointer;background-color:#'
						+ ColorHex[j] + ColorHex[j] + ColorHex[j]
						+ '" onclick="doclick(this.style.backgroundColor)">'
			} else {
				colorTable = colorTable
						+ '<td width=15 style="cursor:pointer;background-color:#'
						+ SpColorHex[j]
						+ '" onclick="doclick(this.style.backgroundColor)">'
			}
			colorTable = colorTable
					+ '<td width=15 style="background-color:#000000">'
			for (k = 0; k < 3; k++) {
				for (l = 0; l < 6; l++) {
					colorTable = colorTable
							+ '<td width=15 style="cursor:pointer;background-color:#'
							+ ColorHex[k + i * 3]
							+ ColorHex[l]
							+ ColorHex[j]
							+ '" onclick="doclick(this.style.backgroundColor)">'
				}
			}
		}
	}
	colorTable = '<table border="0" cellspacing="0" cellpadding="0" style="border:1px #000000 solid;border-bottom:none;border-collapse: collapse;width:337px;" bordercolor="000000">'
			+ '<tr height=20><td colspan=21 bgcolor=#ffffff style="font:12px tahoma;padding-left:2px;">'
			+ '<span style="float:left;color:#999999;">请选择标记颜色</span>'
			+ '<span style="float:right;padding-right:3px;cursor:pointer;" onclick="colorclose()">×关闭</span>'
			+ '</td></table>'
			+ '<table border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse" bordercolor="000000" style="cursor:pointer;">'
			+ colorTable + '</table>';
	document.getElementById("colorpane").innerHTML = colorTable;
//	var current_x = document.getElementById("inputcolor").offsetLeft;
//	var current_y = document.getElementById("inputcolor").offsetTop;
	// alert(current_x + "-" + current_y)
//	document.getElementById("colorpane").style.left = current_x + "px";
//	document.getElementById("colorpane").style.top = current_y + "px";
}
function doclick(obj) {
	$("#inputColor").css("background-color",obj);
	colorclose();
}
function colorclose() {
	document.getElementById("colorpane").style.display = "none";
	// alert("ok");
}
function coloropen(event) {
	document.getElementById("colorpane").style.display = "";
	document.getElementById("colorpane").style.posLeft = document.body.scrollLeft+event.clientX; 
	document.getElementById("colorpane").style.posTop = document.body.scrollTop+event.clientY; 
}
window.onload = initcolor;