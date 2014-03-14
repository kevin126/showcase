Ext.namespace('Apex.ossworks.portlet');

/**
 * 网络设备CPU负载TopN
 * 
 * @param {} pId
 */
Apex.ossworks.portlet.DeviceCpuTopNPanel = function(pId) {

	var portletId = pId;
	var timerTask = null;
	var taskRunner = null;

	var refreshText = new Ext.Toolbar.TextItem({
				text : '刷新周期：'
			});

	var refreshTimeStore = new Ext.data.SimpleStore({
		fields : ['name', 'value'],
		data : [['30秒', '30000'], ['1分钟', '60000'], ['5分钟', '300000'],
				['10分钟', '600000'], ['30分钟', '1800000'],
				['1小时', '3600000']]
	});

	var refreshCombox = new Ext.form.ComboBox({
		triggerAction : 'all',
		store : refreshTimeStore,
		displayField : 'name',
		valueField : 'value',
		mode : 'local',
		forceSelection : true,
		typeAhead : true,
		value : '60000',
		width : 100,
		readOnly : true,
		handleHeight : 10
	});
	var store = new Ext.data.JsonStore({
				proxy : new Ext.ux.data.DWRProxy({
							dwrFunction : PortalService.getDeviceCpuTopN
						}),
				root : 'rows',
				fields : [{
							name : 'sysName',
							mapping : 'sysName'
						}, {
							name : 'ipAddr',
							mapping : 'ipAddr'
						}, {
							name : 'cpuNo',
							mapping : 'cpuNo'
						} ,{
							name : 'usage',
							mapping : 'usage'
						}]
			});
			
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
							header : 'CPU号',
							width : 100,
							sortable : false,
							dataIndex : 'cpuNo'
						}, {
							header : 'CPU使用率',
							width : 20,
							sortable : false,
							dataIndex : 'usage'
						}],
				tbar : [new Ext.Toolbar.Fill(), refreshText, refreshCombox],
				enableHdMenu : false,
				autoExpandColumn:4,
				stripeRows : true,
				border : false,
				height : 530,
				width : 455
			});

	store.load();
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