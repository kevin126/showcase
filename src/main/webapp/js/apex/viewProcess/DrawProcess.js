function drawProcess() {
	this.draw = function() {
		var excutionId = document.getElementById("excutionId").value;
		var processCode = document.getElementById("processCode").value;
		ViewProcessService.getProcessNodes(excutionId,processCode, callBack4GetNode);
	}

	function callBack4GetNode(retValue) {
		var nodes = new Array();
		nodes = retValue;
		var jpdlPanel = new jsGraphics("jpdlProcess");// init graphic
		jpdlPanel.setColor("#000000");// set color
		jpdlPanel.setStroke(1);//set stroke
		// draw node
		
		if (nodes != null && nodes != "" && nodes.length > 0) {
			for (var index = 0; index < nodes.length; index++) {
				var node = nodes[index];
				drawNode(node, jpdlPanel);
			}
		}else{
			jpdlPanel.setColor("red");// set color
		    jpdlPanel.setStroke(5);//set stroke
			drawLabel(jpdlPanel, "该工单已经被删除或不存在，请刷新后再操作！", 400,300);
		}
		jpdlPanel.paint();
	}

	function drawNode(node, jpdlPanel) {
		var w = node.width;// > 90 ? node.width : 90;//set node min width
		var h = node.height;// > 30 ? 30 : node.height;//set node max height
		var imgsrc = node.icon;
		if(node.currentNode){
			jpdlPanel.drawFlash(imgsrc, node.x, node.y, w, h);
		}else{
			jpdlPanel.drawImage(imgsrc, node.x, node.y, w, h,node);
		}
		// draw  background picture
		var nodeName = node.name;
		nodeName = Status_I18N[nodeName];// get name
		if(nodeName==undefined){
			nodeName = node.name;
		}
		var x = node.x;
		var y = node.y;
		var reg = new RegExp("^[\\u4E00-\\u9FFF]+$", "g");
		var len = nodeName.length;
		var isCN = false;
		var labelLength = 0;
		if (len != null && len > 0) {
			for (var i = 0; i < len; i++) {
				var s = nodeName.charAt(i);
				if (!reg.test(s)) {// not chinese
                   labelLength += 7;
				} else {// chinese
					isCN = true;
					labelLength += 16;
				}
			}
		}
//		if(isCN){
//			y = y+h/2-8;
//		}else{
//			y = y+h/2-4;
//		}
		x += (w-labelLength)/2;
		drawLabel(jpdlPanel, nodeName, x, y+h+2);// draw name
		drawTransition(node, jpdlPanel);// draw transition
	}

	function drawTransition(node, jpdlPanel) {
		var trans = node.transitions;
		if (trans != null && trans.length > 0) {
			for (var index = 0; index < trans.length; index++) {
				var tan = trans[index];
				if (tan != null) {
					var pointX = tan.pointsTranX;
					var pointY = tan.pointsTranY;
					drawTransitionLine(jpdlPanel, pointX, pointY);
					var pointAX = tan.pointsArrowX;
					var pointAY = tan.pointsArrowY;
					drawTransitionArrow(jpdlPanel, pointAX, pointAY);
					var labelPosition = tan.labelPosition;
					var label = tan.label;
					if(label==undefined){
						label = tan.label;
					}
					label = typeof(Transition_I18N[label])=='undefined' ? label : Transition_I18N[label];//get name
					drawLabel(jpdlPanel, label, labelPosition.x,
							labelPosition.y);
				}

			}
		}
	}

	function drawLabel(jpdlPanel, name, x, y) {
		jpdlPanel.drawString(name, x, y);//边的名称，节点名称，显示出来
	}

	function drawTransitionLine(jpdlPanel, pointX, pointY) {
		jpdlPanel.drawPolyline(pointX, pointY);//画折线；
	}

	function drawTransitionArrow(jpdlPanel, pointX, pointY) {
		jpdlPanel.fillPolygon(pointX, pointY);//填充三角型区域，箭头；
	}

	return this;
}
