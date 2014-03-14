/**
 * 存放所有的命名空间
 */
Ext.ns('Apex.ex', 'Apex.main', 'Apex.quickview', 'Apex.topo', 'Apex.topomap',
		'Apex.asset', 'Apex.workflow', 'Apex.alarm', 'Ext.ux.data',
		'Apex.netResource', 'Apex.common', 'Apex.nodesManage', 'Apex.misc',
		'Apex.linksManage', 'Apex.deviceConfigBak.view.setting',
		'Apex.deviceConfigBak.handler.setting',
		'Apex.deviceConfigBak.handler.maintenance', 'Apex.chassis.util',
		'Apex.chassis.view', 'Apex.chassis.handler',
		'Apex.chassis.template.view', 'Apex.chassis.template.handler',
		'Apex.chassis.editChassis.view', 'Apex.renderer', 'Apex.duty',
		'Apex.security', 'Apex.maintenance', 'Apex.maintenance.incident',
		'Apex.maintenance.Incident.Type', 'Apex.setting');

/**
 * 存放资源图片的常量。<br>
 * 写法 ：key:value e.g:images/icons/AAA.png<br>
 * 用法 ：
 * 
 * <pre>
 * ResourceConstants.VIEW_16_PNG
 * </pre>
 * 
 * @type
 */
var ResourceConstants = {
	/**
	 * 拓扑图工具栏上的图片
	 */
	VIEW_16_PNG : '/itsm/images/icons/view-16.png',
	SEARCH_16_PNG : '/itsm/images/icons/search-16.png',
	AUTO_LAYOUT_PNG : '/itsm/images/icons/autolayout.png',
	LINK_BUNDLE_PNG : '/itsm/images/icons/link-bundle-16.png',
	/**
	 * 系统中添加按钮上的图片
	 */
	ADD_BUTTON_PNG : '/itsm/images/icons/add.gif',
	/**
	 * 系统中修改按钮上的图片
	 */
	EDIT_BUTTON_PNG : '/itsm/images/icons/edit.gif',
	/**
	 * 系统中删除按钮上的图片
	 */
	DELETE_BUTTON_PNG : '/itsm/images/icons/delete.gif',
	/**
	 * 系统中接单按钮上的图片
	 */
	TAKE_TASK_BUTTON_PNG : '/itsm/images/icons/arrow-down-16.png',
	/**
	 * 系统中设置访问方式按钮上的图片
	 */
	SETACCESSMODE_BUTTON_PNG : '/itsm/images/icons/config.gif',
	/**
	 * 系统中清楚访问方式按钮上的图片
	 */
	CLEARACCESSMODE_BUTTON_PNG : '/itsm/images/icons/config.gif',
	/**
	 * 显示/隐藏主机和Hub
	 */
	HIDE_HOST_HUB_PNG : '/itsm/images/icons/hide-host-hub-16.png',

	RESET_BUTTON_PNG : '/itsm/images/icons/reset.png',

	STATISTIC_BUTTON_PNG : '/itsm/images/icons/statistic.png',

	REFRESH_BUTTON_PNG : '/itsm/images/icons/refresh-16.png',

	EXPORT_BUTTON_PNG : '/itsm/images/icons/arrow-up-16.png',

	TAKE_BUTTON_PNG : '/itsm/images/icons/redo-16.png',

	EXPORT_EXCEL_BUTTON_PNG : '/itsm/images/icons/export-excel16.png',

	EXPORT_PDF_BUTTON_PNG : '/itsm/images/icons/export-pdf16.png',

	IMPORT_BUTTON_PNG : '/itsm/images/icons/import-16.gif',

	CANCEL_ISTOP_BUTTON_PNG : '/itsm/images/icons/revert.png',

	SAVE_BUTTON_PNG : '/itsm/images/icons/save.gif',
	
	SCRAP_BUTTON_PNG : '/itsm/images/icons/delete-role.png'
}

/**
 * 
 * 系统全局对象，保存系统相关的一些常量与配置值
 * 
 * @author Andy Cui
 */
ApexConstants = {

	/**
	 * 当前系统版本
	 * 
	 * @type String
	 */
	version : '0.1',

	/**
	 * 是否是Apex本身产品，如果为真，使用下拉式菜单作为主菜单，点击菜单后对话框采用弹出窗口的形式；如果为假，则使用天融信风格
	 * 
	 * @type Boolean
	 */
	isApex : false,

	/**
	 * 分页尺寸
	 * 
	 * @type Number
	 */
	PAGE_SIZE : 20,

	/**
	 * 物理拓扑图mapId
	 * 
	 * @type Number
	 */
	Layer2TopoMapId : 1,

	/**
	 * 设备类型数组
	 * 
	 * @author jch
	 * @type Array
	 */
	DEVICE_TYPE : [['L2_SWITCH', '二层交换机'], ['L3_SWITCH', '三层交换机'],
			['ROUTER', '路由器'], ['HOST', '主机'], ['SERVER', '服务器'],
			['HUB', '集线器'], ['VPN', 'VPN'], ['UPS', '不间断电源'],
			['PRINTER', '打印机'], ['FIREWALL', '防火墙'], ['UNKNOWN', '未知']]
};