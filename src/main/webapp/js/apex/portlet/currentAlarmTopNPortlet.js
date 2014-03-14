Ext.namespace('Apex.ossworks.portlet');
/**
 * 告警TopN Panel对象
 * 
 * @param {} portletId
 */
Apex.ossworks.portlet.CurrentAlarmTopNPanel = function(portletId) {
	this.portletId = portletId;
	var refreshTimeCombox = null;// 当前告警的刷新周期
	var timerTask = null;// 定时任务
	var taskRunner = null;// 任务控制器
	var defaultRefreshTime = '60000';// 默认的刷新周期是5分钟
	var alarmStore = null;
	
	/**
	 * 获取告警查询结果panel，供外部程序调用
	 */
	this.getPanel = function() {
		var columns = [new Ext.grid.RowNumberer(), {
					id : 'topic',
					header : "序号",
					dataIndex : 'id',
					width : 100,
					hidden : true,
					align : 'center',
					sortable : true
				}, {
					header : "告警源",
					dataIndex : 'source',
					width : 100,
					align : 'center',
					sortable : true
				}, {
					header : "告警原因",
					dataIndex : 'probableCause',
					width : 100,
					align : 'center',
					sortable : true
				}, {
					header : "严重度",
					dataIndex : 'severity',
					width : 100,
					align : 'center',
					sortable : true,
					renderer : formServity
				}, {
					header : "产生时间",
					dataIndex : 'raiseTime',
					width : 120,
					sortable : true,
					align : 'center',
					renderer : dateFormat
				}];

		alarmStore = new Ext.data.JsonStore({
					proxy : new Ext.ux.data.DWRProxy({
								dwrFunction : PortalService.getAlarmsTopN
							}),
					root : 'rows',
					fields : [{
								name : "id"
							}, {
								name : "severity"
							}, {
								name : "source"
							}, {
								name : "raiseTime"
							}, {
								name : "probableCause"
							}]
				});
		alarmStore.setDefaultSort('raiseTime', 'desc');

		refreshTimeCombox = new Ext.form.ComboBox({
					triggerAction : 'all',
					store : new Ext.data.SimpleStore({
								fields : ['name', 'value'],
								data : [['30秒', '30000'], ['1分钟', '60000'],
										['5分钟', '300000'], ['10分钟', '600000'],
										['30分钟', '1800000'], ['1小时', '3600000']]
							}),
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
		refreshTimeCombox.on('select', handleRefreshTimeChange, refreshTimeCombox);
		
		var textItem = new Ext.Toolbar.TextItem({
				text : '刷新周期：'
			});
			
		alarmStore.load();
		
		return new Ext.grid.GridPanel({
					height : 530,
					width : 700,
					store : alarmStore,
					columns : columns,
					border : false,
					enableHdMenu : false,
					stripeRows : true,
					autoExpandColumn: 5,
					tbar : [new Ext.Toolbar.Fill(), textItem, refreshTimeCombox]
				});
	}
	/*
	 * 设置初始化参数，主要包括显示数目，刷新周期及加载表格数据
	 */
	this.initDefaultParam = function() {
		PortalService.getPortletParam(portletId, function(retuenObj) {

					if (portletId != null
							&& portletId != PortletParamConstants.PORTLET_ID_DEFAULT) {

						var newRefreshTime = retuenObj.refreshTime;
						if (!Ext.isEmpty(newRefreshTime))
							refreshTimeCombox.setValue(newRefreshTime);
						else
							refreshTimeCombox.setValue(defaultRefreshTime);
					}
					startRefreshTableByFiedTime();
				})
	}

	/**
	 * 切换刷新周期时的响应函数，它主要完成两件事：停止以前的刷新任务；按新的周期重新启动刷新任务
	 */
	function handleRefreshTimeChange(obj, newValue) {
		stopRefreshTableByFixedTime();
		startRefreshTableByFiedTime();
		var paramName = PortletParamConstants.REFRESH_TIME;
		var paramValue = newValue.get('refreshTimeValue');
		if (portletId != null
				&& portletId != PortletParamConstants.PORTLET_ID_DEFAULT) {
			PortalService.savePortletParam(portletId, paramName, paramValue);
		}
	}
	/**
	 * 重新加载表格
	 */
	function refreshTable() {
		alarmStore.load();
	}
	/*
	 * 按新周期重启定时刷新任务
	 */
	function startRefreshTableByFiedTime() {
		var fixedTime = refreshTimeCombox.getValue();
		timerTask = {
			run : refreshTable,
			interval : fixedTime
		};
		if (null == taskRunner)
			taskRunner = new Ext.util.TaskRunner();
		taskRunner.start(timerTask);
	}
	/*
	 * 停止以前的定时刷新任务
	 */
	function stopRefreshTableByFixedTime() {
		if (null != taskRunner)
			taskRunner.stop(timerTask);
	}
}