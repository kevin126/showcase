Ext.namespace('Apex.portlet.linkTopN');

// Refresh combox
Apex.portlet.linkTopN.RefreshCombox = function() {

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
Apex.portlet.linkTopN.PortletPanel = function(pId) {

	var portletId = pId;

	var timerTask = null;
	var taskRunner = null;

	// Refresh Text
	var refreshText = new Ext.Toolbar.TextItem({
				text : '刷新周期：'
			});

	// Refresh Combox
	var refreshCombox = new Apex.portlet.linkTopN.RefreshCombox();

	var store = new Ext.data.JsonStore({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : PortalService.getLinkTopN
						}),
				root : 'rows',
				fields : [{
							name : 'ipAddr'
						}, {
							name : 'ifIndex'
						}, {
							name : 'ifDisName'
						}, {
							name : 'rxBps'
						}, {
							name : 'txBps'
						}, {
							name : 'rxDisPps'
						}, {
							name : 'txDisPps'
						}, {
							name : 'rxErrPps'
						}, {
							name : 'txErrPps'
						}, {
							name : 'totalBps'
						}]
			});
	store.sort('totalBps','DESC');
	store.load();
	// Grid Panel
	var grid = new Ext.grid.GridPanel({
				store : store,
				columns : [new Ext.grid.RowNumberer({header :'序号',width : 40}), {
							header : '设备IP',
							width : 100,
							sortable : false,
							dataIndex : 'ipAddr'
						}, {
							header : '端口名称',
							width : 100,
							sortable : false,
							dataIndex : 'ifDisName'
						}, {
							header : '端口号',
							width : 50,
							sortable : false,
							dataIndex : 'ifIndex'
						}, {
							header : '进流量',
							width : 100,
							sortable : true,
							dataIndex : 'rxBps',
							renderer : unitFormat
						}, {
							header : '出流量',
							width : 100,
							sortable : true,
							dataIndex : 'txBps',
							renderer : unitFormat
						}, {
							header : '进丢包速率',
							width : 100,
							sortable : true,
							hidden : true,
							dataIndex : 'rxDisPps'
						}, {
							header : '出丢包速率',
							width : 100,
							sortable : true,
							hidden : true,
							dataIndex : 'txDisPps'
						}, {
							header : '进错包速率',
							width : 100,
							sortable : true,
							hidden : true,
							dataIndex : 'rxErrPps'
						}, {
							header : '出错包速率',
							width : 100,
							sortable : true,
							hidden : true
						}, {
							header : '总流量',
							width : 100,
							sortable : true,
							dataIndex : 'totalBps',
							renderer : unitFormat
						}],
				tbar : [new Ext.Toolbar.Fill(), refreshText, refreshCombox],
				enableHdMenu : false,
				autoExpandColumn : 9,
				stripeRows : true,
				border : false,
				height : 530,
				width : 1150
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