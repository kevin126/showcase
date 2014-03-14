/**
 * 获得当前正在使用的布局类型，据此生成相应的表格td
 */
function getLayoutItems() {
    initScroll("scrlContainer", "scrlContent");
	$.ajax({
		dataType : 'json',
		type : 'post',
		url : '/itsm/workArea/layoutMgt.do?method=getLayoutItem',
		success : function(json) {
			var step = 0;
			for (var par in json[0]) {
				// 最多对应三列container2
				var columnValue = par;
				var array = json[0][par];
				var divStr = "";
				for (var i = 0; i < array.length; i++) {
					divStr += ("<div id='" + step + "'class='works_search left_margin8px all_border top_margin8px ui-widget-content '>");
					divStr += ('<div  class="work_ss_title white_border white_border_gai dragArea">');
					divStr += ('<h1 class="mokuai_ss"></h1>');
					divStr += ('<h2 class="works_ss_ge"></h2>');
					divStr += ('<h3>');
					divStr += ('<strong>');
					divStr += (array[i].headName);
					divStr += ('</strong>');
					divStr += ('</h3>');
					divStr += ('');
					divStr += ('<div class="tit_right">');
					if (null != array[i].editPath && '' != array[i].editPath) {
						var frameId = 'iframe_' + array[i].id;
						var editPath = array[i].editPath;
						divStr += "<input title='设置' onclick=\"setItem('"+ editPath +"','"+ frameId +"')\" type='button' class='all_butt mokuai_1 left_margin2px'/>";
					}
					divStr += ('<input title="还原" id="min' + step
							+ '" onclick="reBackView(' + step + ')"  type="button" class="all_butt mokuai_4 left_margin2px" style="display:none"/>');
					divStr += ('<input title="最大化" id="max' + step
							+ '" onclick="maxView(' + step + ')"  type="button"  class="all_butt mokuai_5 left_margin2px" />');

					// 必须显示的布局元素不显示删除按钮
					if (!array[i].mustShow) {
						divStr += ('<input title="关闭" onclick="deletItem('
								+ step + ')" type="button" class="all_butt mokuai_3" />');
					}
					divStr += ('</div>');
					divStr += ('</div>');
					divStr += ('<div class="all_space"></div>');
					divStr += ('');
					divStr += ('<div class="works_ss_content">');
					// onmousedown="drag(this)"
					divStr += ('<div  title="' + array[i].headName + '" ');
					divStr += ('style="height:auto" ');
					divStr += ('id="resizeable' + step + '"class="gongzuoqu_footbg gongzuoqu_bottom resizeable">');
					divStr += ('<iframe id=iframe_' + array[i].id + ' style="border: none; margin:0px;');
					if ("0" != array[i].divHeight) {
						divStr += ('height:' + array[i].divHeight + 'px"');
					} else {
						divStr += ('height:350px"');
					}
					divStr += (' frameBorder="no" scrolling="no"  width="100%" src="'
							+ array[i].srcPath + '&column=' + columnValue  + '&width='+($("#container"+columnValue).width()-10)+'&height='+array[i].divHeight+ '">');
					divStr += ('</iframe>');
					divStr += ('</div>');
					divStr += ('</div>');
					divStr += ('</div>');
					step = step + 1;
				}
				if ('0' == columnValue) {
					$("#container0").append(divStr);
				}
				if ('1' == columnValue) {
					$("#container1").append(divStr);
				}
				if ('2' == columnValue) {
					$("#container2").append(divStr);
				}
			}
		},
		complete : function() {
			initMoveItems();
			resizeable();
		}
	});
}
function drag(obj) {
	$(obj).css("height", obj.clientHeight);
}
// 设置每个布局元素
function setItem(editSrc, frameId) {
	if (null != editSrc && "" != editSrc && 'undefinde' != editSrc) {
		//如果是过滤器，则配置页面是独立的，其余的则显示在当前DIV里
		if(editSrc.indexOf("common/filter.do") != -1){
			window.location.href = editSrc;
		}else{
			//alert($("#"+frameId).attr("src"));
			$("#"+frameId).attr("src", editSrc);
			$("#"+frameId).src = editSrc;
			// 返回时是否还在那个div里面呢？
	//		$("#" + hideId).hide();
	//		$("#" + showId).show();
		}
	}
}
// 删除div
function deletItem(step) {
	var divName = $("#" + step).find("h3 strong").html();
	$.ajax({
		data : {
			divName : divName
		},
		dataType : 'json',
		type : 'post',
		url : '/itsm/workArea/layoutMgt.do?method=disenableItem',
		success : function(json) {
			// 成功后隐藏div
			reBackView(step);
			$("#" + step).remove();
		}
	});
}
// 保存被最大化的窗口的高度，在由最大化返回时用
var oldHeight = 0;
// 最大化div
function maxView(step) {
	// 把他自己的兄弟节点给隐藏了，把他父节点的儿子节点也给隐藏了
	$("#" + step).siblings().each(function() {
		$(this).hide();
	});
	$("#" + step).parent().siblings().each(function() {
		$(this).hide();
	});
	var height = window.screen.availHeight;
	oldHeight = $("#resizeable" + step).find("iframe").css("height");
	$("#resizeable" + step).find("iframe").css("height", height);
	// 最大化按钮的兄弟节点都显示
	$("#max" + step).siblings().each(function() {
		$(this).show();
	});
	// 最大化按钮隐藏，最小化按钮显示
	$("#max" + step).hide();
	$("#min" + step).show();
}
// 最大化窗口后，如果要返回原来的界面,与最大化相反
function reBackView(step) {
	$("#" + step).siblings().each(function() {
		$(this).show();
	});
	$("#" + step).parent().siblings().each(function() {
		$(this).show();
	});
	$("#min" + step).hide();
	$("#max" + step).show();
	$("#resizeable" + step).find("iframe").css("height", oldHeight);
	oldHeight = 0;
}
function enableDiv(divName) {
	var useed = $("#" + divName).val();
	if (null == useed || "" == useed) {
		$.ajax({
			data : {
				divName : divName
			},
			dataType : 'json',
			type : 'post',
			url : '/itsm/workArea/layoutMgt.do?method=enableItem',
			success : function(json) {
				// 成功后返回一个标志，设置已经被添加，在点击时就不再调用后台程序
				$("#" + divName).val("useed");
			},
			complete : function() {
			}
		});
	}
}
// 初始化移动的div
function initMoveItems() {
	$(".column").sortable({
		connectWith : ".column"
	});
	$(".column").disableSelection();
}
// 设置高度
function resizeable() {
	$(".resizeable").resizable();
}
function getHeight(event) {
	var offsetHeight = event.parentNode.offsetHeight-10;
	var name = event.parentNode.title;
	$.ajax({
		data : {
			height : offsetHeight,
			divName : name
		},
		dataType : 'json',
		type : 'post',
		url : '/itsm/workArea/layoutMgt.do?method=resizeDiv',
		success : function(json) {
		},
		complete : function() {
		}
	}); 
	
}
// 选择布局类型那个
function layoutMgt() {
	var url = "/itsm/workArea/layoutMgt.do?method=layoutMgt";
	var s = tipsWindown('选择工作区布局类型', 'iframe:' + url, '930', '600', 'true', '',
			'true', 'leotheme');
}

// 关闭弹出来的选择布局的类型窗口
function closeWin() {
	if (window.parent) {
		try {
			window.parent.$("#windownbg").remove();
			window.parent.$("#windown-box").fadeOut("slow", function() {
				$(this).remove();
			});
		} catch (e) {
		}
	}

}
function selectLayoutType() {
	// 得到选中的radio状态的value值
	var selectValue = $("input:checked").val();
	if (null != selectValue && "" != selectValue && "undefined" != selectValue) {
		$.ajax({
			data : {
				id : selectValue
			},
			dataType : 'json',
			type : 'post',
			url : '/itsm/workArea/layoutMgt.do?method=changeLayoutType',
			success : function(json) {
				window.parent.location.href = "/itsm/workArea/layoutMgt.do?method=enter";
			},
			complete : function() {
			}
		});
	}
}
