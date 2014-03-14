Ext.namespace('Apex.portlet.delayTopN');

// Refresh combox
Apex.portlet.delayTopN.RefreshCombox = function() {

	var refreshTimeStore = new Ext.data.SimpleStore({
				fields : ['refreshTimeName', 'refreshTimeValue'],
				data : [['30秒', '30000'], ['1分钟', '60000'], ['5分钟', '300000'],
						['10分钟', '600000'], ['30分钟', '1800000'],
						['1小时', '3600000']]
			});

	var refreshTimeCombox = new Ext.form.ComboBox({
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

	return refreshTimeCombox;
}

// Portlet Panel
Apex.portlet.delayTopN.PortletPanel = function(pId) {

	var portletId = pId;

	var timerTask = null;
	var taskRunner = null;

	// Refresh Text
	var refreshText = new Ext.Toolbar.TextItem({
				text : '刷新周期：'
			});

	// Refresh Combox
	var refreshCombox = new Apex.portlet.delayTopN.RefreshCombox();

	var store = new Ext.data.JsonStore({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : PortalService.getDelayTopN
						}),
				root : 'rows',
				fields : [{
							name : 'sysName'
						}, {
							name : 'ipAddr'
						}, {
							name : 'delayTime'
						}]
			});
	store.load();
	// Grid Panel
	var grid = new Ext.grid.GridPanel({
				store : store,
				columns : [new Ext.grid.RowNumberer(), {
							header : '设备名称',
							width : 150,
							sortable : false,
							dataIndex : 'sysName'
						}, {
							header : '设备IP',
							width : 100,
							sortable : false,
							dataIndex : 'ipAddr'
						}, {
							header : '延迟时间(ms)',
							width : 30,
							sortable : false,
							dataIndex : 'delayTime'
						}],
				tbar : [new Ext.Toolbar.Fill(), refreshText, refreshCombox],
				enableHdMenu : false,
				autoExpandColumn: 3,
				stripeRows : true,
				border : false,
				height : 530,
				width : 455
			});

	// Build listener
	function startRefreshTableByFiedTime() {
		var fixedTime = refreshCombox.getValue();
		timerTask = {
			run : refreshTable,
			interval : fixedTime
		};
		if (null == taskRunner)
			taskRunner = new Ext.util.TaskRunner();
		taskRunner.start(timerTask);
	}

	function stopRefreshTableByFixedTime() {
		if (null != taskRunner)
			taskRunner.stop(timerTask);
	}

	function refreshTable() {
		store.load({});
	}

	function handleRefreshChange() {
		stopRefreshTableByFixedTime();
		startRefreshTableByFiedTime();

		// Save param
		if (portletId != null
				&& portletId != PortletParamConstants.PORTLET_ID_DEFAULT) {
			var paramName = PortletParamConstants.REFRESH_TIME;
			var paramValue = refreshCombox.getValue();
			PortalService.savePortletParam(portletId, paramName, paramValue);
		}
	}

	refreshCombox.on('select', handleRefreshChange, refreshCombox);

	// Public method

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

	return this;
}