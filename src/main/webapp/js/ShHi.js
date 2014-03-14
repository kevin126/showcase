function f(d) {
	var t = document.getElementById(d);
	if (t) {
		return t.style;
	} else {
		return null;
	}
}
function Hi() {
	var items = document.getElementsByTagName("dl");
	for (var i = 0; i < items.length; i++) {
		items[i].style.display = "none";
	}
}
function Hl() {
	var iteml = document.getElementsByTagName("h2");
	for (var j = 0; j < iteml.length; j++) {
		iteml[j].style.fontWeight = "normal";
	}
}
function h(d) {
	var s = f(d);
	if ("none" == s.display) {
		return true;
	} else {
		return false;
	}
}
function ShHi(ii, jj) {
	if (h(jj)) {
		f(jj).display = "block";
	} else {
		f(jj).display = "none";
	}
}

