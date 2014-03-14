Ext.namespace('Apex.asset');
Apex.asset.AssetCountPanel = function() {
	var panel = new Ext.Panel({
		layout : 'fit',
		autoScroll : true,
		border : false,
		closable : false,
		items : [{
			xtype : 'portal',
			region : 'center',
			items : [{
				columnWidth : .5,
//				style : 'padding:10px 0 10px 10px',
				items : [{
					id : 'GDSLTJ',
					title : '资产类型饼图',
					layout : 'fit',
					html : '<html><head></head><body><img src="/itsm/asset/assetCount.do?type=TYPEPIE" width="500" height="300"></body></html>'
				}, {
					id : 'GDLXTJ',
					title : '资产状态饼图',
					layout : 'fit',
					html : '<html><head></head><body><img src="/itsm/asset/assetCount.do?type=STATUSPIE" width="500" height="300"></body></html>'
				}]
			},{
				columnWidth : .5,
				// style : 'padding:10px',
				items : [{
					id : 'GDYZDTJ',
					title : '资产类型柱状图',
					layout : 'fit',
					html : '<html><head></head><body><img src="/itsm/asset/assetCount.do?type=TYPEHIS" width="500" height="300"></body></html>'
				}, {
					id : 'GDUXJTJ',
					title : '资产状态柱状图',
					layout : 'fit',
					html : '<html><head></head><body><img src="/itsm/asset/assetCount.do?type=STATUSHIS" width="500" height="300"></body></html>'
				}]
			}]
		}]
	});
	return panel
}