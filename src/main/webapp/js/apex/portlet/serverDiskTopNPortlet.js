Ext.namespace('Apex.ossworks.portlet');

/**
 * 服务器磁盘使用率TopN面板对象
 * 
 * @param {} pId
 */
Apex.ossworks.portlet.ServerDiskTopNPanel = function(pId) {

	var portletId = pId;
	var timerTask = null;
	var taskRunner = null;

	var refreshText = new Ext.Toolbar.TextItem({
				text : '刷新周期：'
			});

	var refreshTimeStore = new Ext.data.SimpleStore({
		fields : ['refreshTimeName', 'refreshTimeValue'],
		data : [['30秒', '30000'], ['1分钟', '60000'], ['5分钟', '300000'],
				['10分钟', '600000'], ['30分钟', '1800000'],
				['1小时', '3600000']]
	});

	var refreshCombox = new Ext.form.ComboBox({
				triggerAction : 'all',
				store : refreshTimeStore,
				displayField : 'refreshTimeName',
				valueField : 'refreshTimeValue',
				mode : 'local',
				forceSelection : true,
				typeAhead : true,
				value : '60000',
				width : 100,
				readOnly : true,
				handleHeight : 10
			});

	// Data Store
	var store = new Ext.data.JsonStore({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : PortalService.getServerDiscTopN
						}),
				root : 'rows',
				fields : [{
							name : 'sysName'
						}, {
							name : 'ipAddr'
						}, {
							name : 'discId'
						}, {
							name : 'discName'
						}, {
							name : 'usage'
						}]
			});
	store.load();
	// Grid Panel
	var grid = new Ext.grid.GridPanel({
				store : store,
				columns : [new Ext.grid.RowNumberer(), {
							header : '服务器名称',
							width : 100,
							sortable : true,
							dataIndex : 'sysName'
						}, {
							header : '服务器IP',
							width : 100,
							sortable : true,
							dataIndex : 'ipAddr'
						}, {
							header : '磁盘号',
							width : 100,
							sortable : true,
							dataIndex : 'discId'
						}, {
							header : '磁盘名称',
							width : 100,
							sortable : true,
							dataIndex : 'discName'
						},  {
							header : '磁盘使用率',
							width : 100,
							sortable : true,
							dataIndex : 'usage'
						}],
				tbar : [new Ext.Toolbar.Fill(), refreshText, refreshCombox],
				enableHdMenu : false,
				autoExpandColumn: 5,
				frame : false,
				stripeRows : true,
				border : false,
				height : 530,
				width : 355
			});

	function handleRefreshChange() {
		if (null != taskRunner)
			taskRunner.stop(timerTask);
		var fixedTime = refreshCombox.getValue();
		timerTask = {
			run : function() {store.load();},
			interval : fixedTime
		};
		if (null == taskRunner)
			taskRunner = new Ext.util.TaskRunner();
		taskRunner.start(timerTask);

		// Save param
		if (portletId != null
				&& portletId != PortletParamConstants.PORTLET_ID_DEFAULT) {
			var paramName = PortletParamConstants.REFRESH_TIME;
			var paramValue = refreshCombox.getValue();
			PortalService.savePortletParam(portletId, paramName, paramValue);
		}
	}

	refreshCombox.on('select', handleRefreshChange, refreshCombox);

	this.loadParam = function() {
		PortalService.getPortletParam(portletId, function(returnObj) {
					if (portletId != null) {
						var refreshTime = returnObj.refreshTime;
						if (!Ext.isEmpty(refreshTime))
							refreshCombox.setValue(refreshTime);
					}
				});
	}

	this.getPanel = function() {
		return grid;
	}
}