Ext.namespace('Apex.Portal.Notic');
/**
 * by timy 1.显示最新已经发布的十条公告 2.显示条目。标题，发布时间 3.排序 。按时间顺序由近及远的排列
 * 4.链接设置。在标题上设置超链接，点击后可以查看公告 5.效果。公告列表上增加滚动效果，从下往上依次滚动，当鼠标移上去时停止滚动，鼠标移出则继续滚动
 */
Apex.Portal.Notic.PortletPanel = function(id) {
	var panel = new Ext.Panel({
		title : '最新公告',
		height : 530,
		width : 355,
		contentEl :id
			// The id of an existing HTML node to use as the panel's body
			// content (defaults to '').
			// html : '/jsps/notice/portalScrollNotic.jsp'
		});
		return panel;
}