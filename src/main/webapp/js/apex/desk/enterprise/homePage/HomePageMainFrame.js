Ext.onReady(function() {

	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

	var etools = [];

	var tools = [{
		id : 'gear',
		handler : function(event, toolEl, panel) {
			var id = panel.id;
			var pie = '';
			var bar = '';
			var prev = panel.body.dom.innerHTML;
			if (id == 'GDSLTJ') {
				pie = '<html><head></head><body><img src="/itsm/deskdiagram?DT=UT2" width="400" height="300"></body></html>';
				bar = '<html><head></head><body><img src="/itsm/deskdiagram?DT=UT" width="400" height="300"></body></html>';
			}
			if (id == 'GDLXTJ') {
				pie = '<html><head></head><body><img src="/itsm/deskdiagram?DT=TT2" width="400" height="300"></body></html>';
				bar = '<html><head></head><body><img src="/itsm/deskdiagram?DT=TT" width="400" height="300"></body></html>';
			}
			if (id == 'GDYZDTJ') {
				pie = '<html><head></head><body><img src="/itsm/deskdiagram?DT=ST2" width="400" height="300"></body></html>';
				bar = '<html><head></head><body><img src="/itsm/deskdiagram?DT=ST" width="400" height="300"></body></html>';
			}
			if (id == 'GDUXJTJ') {
				pie = '<html><head></head><body><img src="/itsm/deskdiagram?DT=PT2" width="400" height="300"></body></html>';
				bar = '<html><head></head><body><img src="/itsm/deskdiagram?DT=PT" width="400" height="300"></body></html>';
			}
			panel.body.dom.innerHTML = '';
			panel.removeAll();
			panel.add(new Apex.Desk.Enterprise.PSet.Panel(panel, pie, bar, prev)
					.getPanel());
			panel.doLayout();
		}
	}];

	var np = new Apex.Desk.Portlet.Notice.Panel().getPanel();
    var dutyPanel  = new Ext.Panel({
    	    frame : false,
    	    style :'background:white',
			html : '<iframe frameborder="0" width="410" height="300" src="DutyPortalServlet"></iframe>'
		});
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [{
			xtype : 'portal',
			region : 'center',
			margins : '135 5 5 0',
			items : [{
				columnWidth : .33,
				style : 'padding:10px 0 10px 10px',
				items : [{
							title : '值班表',
							tools : etools,
							layout : 'fit',
							items : [dutyPanel]
						}, {
							title : '系统公告',
							tools : etools,
							layout : 'fit',
							items : [np]
						}, {
							title : '事件工单趋势',
							tools : etools,
							html : '<html>' +
									  '<head></head>' +
									  '<body>' +
									    '<div align="center"><input type="radio" checked="checked" name="radiobutton"  onclick="x(1);">最近一周' +
									                        '&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="radiobutton" onclick="x(2);">最近一月' +
									                        '&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="radiobutton" onclick="x(3);">最近三月' +
									                        '&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="radiobutton" onclick="x(4);">最近半年' +
									    '</div>' +
									    '<img id="xxx" src="/itsm/deskdiagram?DT=NT&NTT=w" width="400" height="300">' +
									  '</body>' +
								   '</html>'
						}]
			}, {
				columnWidth : .33,
				style : 'padding:10px 0 10px 10px',
				items : [{
					id : 'GDSLTJ',
					title : '运维人员工单数量统计',
					tools : tools,
					layout : 'fit',
					html : '<html><head></head><body><img src="/itsm/deskdiagram?DT=UT" width="400" height="300"></body></html>'
				}, {
					id : 'GDLXTJ',
					title : '工单类型统计',
					tools : tools,
					layout : 'fit',
					html : '<html><head></head><body><img src="/itsm/deskdiagram?DT=TT" width="400" height="300"></body></html>'
				}]
			}, {
				columnWidth : .33,
				style : 'padding:10px',
				items : [{
					id : 'GDYZDTJ',
					title : '工单严重度统计',
					tools : tools,
					layout : 'fit',
					html : '<html><head></head><body><img src="/itsm/deskdiagram?DT=ST" width="400" height="300"></body></html>'
				}, {
					id : 'GDUXJTJ',
					title : '工单优先级统计',
					tools : tools,
					layout : 'fit',
					html : '<html><head></head><body><img src="/itsm/deskdiagram?DT=PT" width="400" height="300"></body></html>'
				}]
			}]
		}]
	});
});
