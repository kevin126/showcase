/**写备注快捷键脚本  */
$(document).ready(function () {
	document.getElementById("comment").onkeydown = function (moz_ev) {
		var ev = null;
		if (window.event) {
			ev = window.event;
		} else {
			ev = moz_ev;
		}
		if (ev != null && ev.ctrlKey && ev.keyCode == 13) {
			document.getElementById("sure").click();
		}
	};
});

