Ext.namespace('Apex.common');
FlexValueTreeWin=function(valueCode,jspId,StorTypeId){
	var sureBtn = new Ext.Button({
		id : 'FlexValueTreeWinSure',
		text : '确定',
		minWidth : 70,
		handler : sureEvent
	});
		sureBtn.disabled=true;
	var cancelBtn = new Ext.Button({
		text : '取消',
		minWidth : 70,
		handler : cancelEvent
	});
	var treeRoot = new Ext.tree.AsyncTreeNode({
				text : '类型列表',
				id : null==valueCode? -1:valueCode,
				disabled : true,
				hasChildren : true,
				devNodeType : 'root',
				expanded : true
			});
	var treeLoader = new Ext.ux.DWRTreeLoader({
					preloadChildren : true,
				dwrCall : FlexValueService.getFlexValueTreeByCode,
				waitMessage : new Ext.LoadMask(Ext.getBody(), {
							msg : "正在读取数据，请稍等..."
						})
			});
	var panel = new Ext.tree.TreePanel({
				loader : treeLoader,
				collapsible : true,
				rootVisible : true,
				autoScroll : true,
				border : false,
				margins : '5 5 5 5',
				frame : false,
				split : true,
				region : 'west',
				width : 284,
				height : 350,
				root : treeRoot
			});
	var win = new Ext.Window({
				title : '类型列表',
				height : 410,
				model:true,
				width : 300,
				items : panel,
				buttons : [sureBtn,cancelBtn],
				buttonAlign : 'center'
			})
		panel.on('dblclick', handleDbClick);
		panel.on('click', function(selectdeNode) {
			if (selectdeNode.id == 0)
				Ext.getCmp('FlexValueTreeWinSure').setDisabled(true);
			else if (selectdeNode.id > 0)
				Ext.getCmp('FlexValueTreeWinSure').setDisabled(false);
			else
				Ext.getCmp('FlexValueTreeWinSure').setDisabled(true);
		});
	function handleDbClick() {
		var treeNode = panel.getSelectionModel().getSelectedNode();
		// 避免用户双击所有类型
		if (treeNode.id != valueCode && !treeNode.hasChildNodes()) {
			win.close();
			var value = Ext.util.Format.htmlDecode(treeNode.text);
			var finalValue = value.replace(/&nbsp;/g," ");
			document.getElementById(jspId).value=finalValue;
			document.getElementById(StorTypeId).value=treeNode.id;
			jQuery("#"+jspId).blur();
		}
		}
	function sureEvent() {
	var treeNode = panel.getSelectionModel().getSelectedNode();
		win.close();
		var value = Ext.util.Format.htmlDecode(treeNode.text);
		var finalValue = value.replace(/&nbsp;/g," ");
		document.getElementById(jspId).value=finalValue;
		document.getElementById(StorTypeId).value=treeNode.id;
		jQuery("#"+jspId).blur();
	}
	function cancelEvent() {
		win.close();
	}
	return win;
}