Ext.namespace('Apex.portlet.faultTopN');

// Refresh combox
Apex.portlet.faultTopN.RefreshCombox = function() {

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
Apex.portlet.faultTopN.PortletPanel = function(pId) {

	var portletId = pId;

	var timerTask = null;
	var taskRunner = null;

	// Refresh Text
	var refreshText = new Ext.Toolbar.TextItem({
				text : '刷新周期：'
			});

	// Refresh Combox
	var refreshCombox = new Apex.portlet.faultTopN.RefreshCombox();
	// Data Store
	var store = new Ext.data.JsonStore({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : PortalService.getFaultTopN
						}),
				root : 'rows',
				fields : [{
							name : 'id'
						}, {
							name : 'deviceName'
						}, {
							name : 'deviceByname'
						}, {
							name : 'deviceIp'
						}, {
							name : 'connect'
						}, {
							name : 'crticalNum'
						}, {
							name : 'majorNum'
						}, {
							name : 'minorNum'
						}, {
							name : 'warningNum'
						}, {
							name : 'totalNum'
						}]
			});
	store.load();
	store.sort('totalNum','DESC');
	// Grid Panel
	var grid = new Ext.grid.GridPanel({
				store : store,
				columns : [new Ext.grid.RowNumberer(), {
							header : '设备名称',
							width : 100,
							sortable : false,
							dataIndex : 'deviceName'
						}, {
							header : '设备别名',
							width : 100,
							sortable : false,
							dataIndex : 'deviceByname'
						}, {
							header : '设备IP',
							width : 100,
							sortable : false,
							dataIndex : 'deviceIp'
						}, {
							header : '通断状态',
							width : 100,
							sortable : true,
							renderer : connectFormat,
							dataIndex : 'connect'
						}, {
							header : '紧急告警数',
							width : 70,
							sortable : true,
							dataIndex : 'crticalNum'
						}, {
							header : '主要告警数',
							width : 70,
							sortable : true,
							dataIndex : 'majorNum'
						}, {
							header : '次要告警数',
							width : 70,
							sortable : true,
							dataIndex : 'minorNum'
						}, {
							header : '警告告警数',
							width : 70,
							sortable : true,
							dataIndex : 'warningNum'
						}, {
							header : '告警总数',
							width : 70,
							sortable : true,
							dataIndex : 'totalNum'
						}],
				tbar : [new Ext.Toolbar.Fill(), refreshText, refreshCombox],
				enableHdMenu : false,
				stripeRows : true,
				border : false,
				height : 530,
				width : 820
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