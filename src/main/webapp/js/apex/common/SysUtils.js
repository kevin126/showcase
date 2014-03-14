/**
 * 默认的处理DWR异常信息的方法
 * 
 * @param {}
 *            errorString
 * @param {}
 *            exception
 */
function errorHandler(errorString, exception) {
	if (exception.message && exception.message == 'Failed to read input')
		return;
	Ext.MessageBox.show({
				title : '错误',
				msg : exception.message,
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.ERROR
			});
};
/**
 * 注册处理异常方法
 */
dwr.engine.setErrorHandler(errorHandler);

/**
 * 获得所有可视的列名,从start开始
 */
function extractVisibleColumn(start, panel) {
	var ary = new Array();
	if (panel != null && panel.getColumnModel() != null && start > 0
			&& panel.getColumnModel().getColumnCount(false) > start) {
		var model = panel.getColumnModel();
		var count = model.getColumnCount(false);
		for (var id = start; id < count; id++) {
			if (!model.isHidden(id)) {
				ary.push(model.getColumnHeader(id));
			}
		}
	}
	return ary;
}

/**
 * 获得所有可视的列名,从start开始
 */
function extractVisibleColumnString(start, panel) {
	var str = "";
	if (panel != null && panel.getColumnModel() != null && start > 0
			&& panel.getColumnModel().getColumnCount(false) > start) {
		var model = panel.getColumnModel();
		var count = model.getColumnCount(false);
		for (var id = start; id < count; id++) {
			if (!model.isHidden(id)) {
				str = str + model.getColumnHeader(id) + "，";
			}
		}
	}
	return str;
}