Ext.namespace('Apex.Desk.Enterprise.PSet');

Apex.Desk.Enterprise.PSet.Panel = function(p, pie, bar, prev) {

	var pp = p;

	var ppie = pie;

	var pbar = bar;

	var pprev = prev;

	var pt = '1';

	var pRadio = new Ext.form.RadioGroup({
				fieldLabel : '图表类型',
				items : [{
					        checked : true,  
							boxLabel : '柱状图',
							name : 'pt',
							listeners : {
								check : function(radio, checked) {
									pt = '1';
								}
							}
						}, {
							boxLabel : '饼图',
							name : 'pt',
							listeners : {
								check : function(radio, checked) {
									pt = '2';
								}
							}
						}]
			});

	var tRadio = new Ext.form.RadioGroup({
				fieldLabel : '工单类型',
				items : [{
					        checked : true,  
							boxLabel : '事件管理',
							name : 'tt'
						}, {
							boxLabel : '问题管理',
							name : 'tt'
						}, {
							boxLabel : '配置管理',
							name : 'tt'
						}]
			});

	var saveBtn = new Ext.Button({
				text : '确定',
				disabled : false,
				minWidth : 80,
				handler : function() {
					if (pt == '') {
						Ext.Msg.show({
									title : '提示',
									msg : '请选择图表类型！',
									modal : true,
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.INFO
								});
					} else {
						pp.removeAll();
						if (pt == '1') {
							pp.body.dom.innerHTML = pbar;
						}
						if (pt == '2') {
							pp.body.dom.innerHTML = ppie;
						}
					}
				}
			});

	var cancelBtn = new Ext.Button({
				text : '取消',
				disabled : false,
				minWidth : 80,
				handler : function() {
					pp.removeAll();
					pp.body.dom.innerHTML = pprev;
				}
			});

	var mp = createPanel();

	function createPanel() {
		return new Ext.form.FormPanel({
					frame : true,
					border : false,
					width : 400,
					height : 300,
					items : [pRadio],
					buttons : [saveBtn, cancelBtn]
				});
	};

	this.getPanel = function() {
		return mp;
	};
};
