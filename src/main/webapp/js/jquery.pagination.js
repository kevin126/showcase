/**
 * This jQuery plugin displays pagination links inside the selected elements.
 * 
 * This plugin needs at least jQuery 1.4.2
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 2.1
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
 (function($){
	/**
	 * @class Class for calculating pagination values
	 * 
	 */
	$.PaginationCalculator = function(maxentries, opts) {
		this.maxentries = maxentries; //总记录数
		this.opts = opts; //参数集
	}
	
	$.extend($.PaginationCalculator.prototype, {
		/**
		 * Calculate the maximum number of pages
		 * @method
		 * @returns {Number}
		 */
		numPages:function() {
			//返回大于等于x的最小整数
			return Math.ceil(this.maxentries/this.opts.items_per_page); //返回页数
		},
		/**
		 * Calculate start and end point of pagination links depending on 
		 * current_page and num_display_entries.
		 * 计算分页的开始和结束点依赖于当前页和每页显示条目数
		 * @returns {Array} 有开始和结束数量的对象
		 */
		getInterval:function(current_page)  {
			var ne_half = Math.floor(this.opts.num_display_entries/2);
			//获取分页页数
			var np = this.numPages();
			//分页总页数-连续分页主体部分显示的分页条目数
			var upper_limit = np - this.opts.num_display_entries;
			var start = current_page > ne_half ? Math.max( Math.min(current_page - ne_half, upper_limit), 0 ) : 0;
			var end = current_page > ne_half?Math.min(current_page+ne_half + (this.opts.num_display_entries % 2), np):Math.min(this.opts.num_display_entries, np);
			return {start:start, end:end};
		}
	});
	
	// Initialize jQuery object container for pagination renderers
	$.PaginationRenderers = {}
	
	/**
	 * @class Default renderer for rendering pagination links
	 */
	$.PaginationRenderers.defaultRenderer = function(maxentries, opts) {
		this.maxentries = maxentries;
		this.opts = opts;
		this.pc = new $.PaginationCalculator(maxentries, opts);
	}
	$.extend($.PaginationRenderers.defaultRenderer.prototype, {
		/**
		 * Helper function for generating a single link (or a span tag if it's the current page)
		 * @param {Number} page_id The page id for the new item
		 * @param {Number} current_page 
		 * @param {Object} appendopts Options for the new item: text and classes
		 * @returns {jQuery} jQuery object containing the link
		 */
		createLink:function(page_id, current_page, appendopts){
			var lnk, np = this.pc.numPages();
			page_id = page_id<0?0:(page_id<np?page_id:np-1); // Normalize page id to sane value
			appendopts = $.extend({text:page_id+1, classes:""}, appendopts||{});
			if(page_id == current_page){
				if(appendopts.classes.length>0){
					if(appendopts.classes=="prev"){
						appendopts.text='<img class="feng_img" src="../images/cmdb_n/vf2.gif" height="10" width="5"><img class="feng_img" src="../images/cmdb_n/vf2.gif" height="10" width="5">';
					}else{
						appendopts.text='<img class="feng_img" src="../images/cmdb_n/vf3.gif" height="10" width="5"><img class="feng_img" src="../images/cmdb_n/vf3.gif" height="10" width="5">';
					}
					lnk = $("<span class='h2_span'><i>" + appendopts.text + "</i></span>");
				}else{
					lnk = $("<span class='h2_span_on'><i>" + appendopts.text + "</i></span>");
				}
			}
			else
			{
				if(appendopts.classes.length>0){
					if(appendopts.classes=="prev"){
						appendopts.text='<img class="feng_img" src="../images/cmdb_n/vf2.gif" height="10" width="5"><img class="feng_img" src="../images/cmdb_n/vf2.gif" height="10" width="5">';
					}else{
						appendopts.text='<img class="feng_img" src="../images/cmdb_n/vf3.gif" height="10" width="5"><img class="feng_img" src="../images/cmdb_n/vf3.gif" height="10" width="5">';
					}
				}
				aLink = $("<a><i>" + appendopts.text + "</i></a>").attr('href', this.opts.link_to.replace(/__id__/,page_id));
				lnk=$("<span onmouseout=\"this.className='h2_span'\" onmouseover=\"this.className='h2_span_on'\" class=\"h2_span\"></span>");
				aLink.appendTo(lnk);
			}
			if(appendopts.classes){ lnk.addClass(appendopts.classes); }
			lnk.data('page_id', page_id);
			return lnk;
		},
		// Generate a range of numeric links 
		appendRange:function(container, current_page, start, end, opts) {
			var i;
			for(i=start; i<end; i++) {
				this.createLink(i, current_page, opts).appendTo(container);
			}
		},
		getLinks:function(current_page, eventHandler) {
			var begin, end,
				interval = this.pc.getInterval(current_page),
				np = this.pc.numPages(),
				fragment = $("<h2></h2>");
			// Generate "Previous"-Link
			if(this.opts.prev_text && (current_page > 0 || this.opts.prev_show_always)){
				fragment.append(this.createLink(current_page-1, current_page, {text:this.opts.prev_text, classes:"prev"}));
			}
			// Generate starting points
			if (interval.start > 0 && this.opts.num_edge_entries > 0)
			{
				end = Math.min(this.opts.num_edge_entries, interval.start);
				this.appendRange(fragment, current_page, 0, end, {classes:'sp'});
				if(this.opts.num_edge_entries < interval.start && this.opts.ellipse_text)
				{
					jQuery("<span class=\"h2_span\" style=\"border:none;\">"+this.opts.ellipse_text+"</span>").appendTo(fragment);
				}
			}
			// Generate interval links
			this.appendRange(fragment, current_page, interval.start, interval.end);
			// Generate ending points
			if (interval.end < np && this.opts.num_edge_entries > 0)
			{
				if(np-this.opts.num_edge_entries > interval.end && this.opts.ellipse_text)
				{
					jQuery("<span class=\"h2_span\" style=\"border:none;\">"+this.opts.ellipse_text+"</span>").appendTo(fragment);
				}
				begin = Math.max(np-this.opts.num_edge_entries, interval.end);
				this.appendRange(fragment, current_page, begin, np, {classes:'ep'});
				
			}
			// Generate "Next"-Link
			if(this.opts.next_text && (current_page < np-1 || this.opts.next_show_always)){
				fragment.append(this.createLink(current_page+1, current_page, {text:this.opts.next_text, classes:"next"}));
			}
			$('a', fragment).click(eventHandler);
			return fragment;
		},
		getGoToPageCompanant:function(eventHandler){
			var np = this.pc.numPages();
			var fragment=$('<span style="height:10px;line-height:12px;"></span>');
			fragment.append("转到第&nbsp;<input type='text' value='' style=\"border: 1px solid rgb(219, 219, 219); width: 25px;\">页 &nbsp;<input type='button' value='转到' style='border: medium none ; margin: 0pt 0pt 0pt 4px; background: transparent url(../images/cmdb_n/2_r2_c2.jpg) repeat scroll 0% 0%; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; width: 40px; height: 20px; cursor: pointer; color: rgb(68, 68, 68);'> &nbsp;每页显示");
			$("[type='button']", fragment).click(eventHandler);
			fragment.data('np', np);
			return fragment;
		},
		getChangePageSizeCompanant:function(eventHandler,opts){
			var maxentries=this.pc.maxentries;
			var fragment="<select>";
			var items_per_page=opts.items_per_page;
			//下拉列表10-100
			for(var i=1;i<=10;i++){
				if(i*10==items_per_page){
					fragment+=("<option value='"+i*10+"' selected>"+i*10+"</option>");
				}else{
					fragment+=("<option value='"+i*10+"'>"+i*10+"</option>");
				}
			}
			//下拉列表1-10
		//	for(var i=1;i<=10;i++){
		//		if(i==items_per_page){
		//			fragment+=("<option value='"+i+"' selected>"+i+"</option>");
		//		}else{
		//			fragment+=("<option value='"+i+"'>"+i+"</option>");
		//		}
		//	}
			fragment+=("</select>");
			var finalFragment=$(fragment);
			finalFragment.data("maxentries",maxentries);
			$(finalFragment).change(eventHandler);
			return finalFragment;
		}
	});
	
	// Extend jQuery
	$.fn.pagination = function(maxentries, opts){
		// Initialize options with default values
		opts = jQuery.extend({
			items_per_page:10, //每页显示的条目数
			num_display_entries:8,//连续分页主体部分显示的分页条目数
			current_page:0, //当前选中的页面
			num_edge_entries:2, //两侧显示的首尾分页的条目数
			link_to:"#", //分页的链接
			prev_text:"前一页", //“前一页”分页按钮上显示的文字
			next_text:"后一页", //“下一页”分页按钮上显示的文字
			ellipse_text:"...", //省略的页数用什么文字表示
			prev_show_always:true, //是否显示“前一页”分页按钮
			next_show_always:true, //是否显示“下一页”分页按钮
			renderer:"defaultRenderer", //默认渲染器
			callback:function(){return false;} //回调函数,默认无执行效果
		},opts||{});
		
		var containers = this,
			renderer, links, current_page;
		
		/**
		 * This is the event handling function for the pagination links. 
		 * @param {int} page_id The new page number
		 */
		function paginationClickHandler(evt){
			var links,new_current_page;
			//当点击某一页时，单击元素为i tagName兼容IE，FireFox,Google Chrome
			 if(evt.target.tagName=='I'){
			 	new_current_page= $(evt.target).parent().parent().data('page_id');
			 }else if(evt.target.tagName=='IMG'){ //点击前一页后一页时单击元素为图片img标签
			 	new_current_page= $(evt.target).parent().parent().parent().data('page_id');
			 }
			var continuePropagation = selectPage(new_current_page);
			if (!continuePropagation) {
				evt.stopPropagation();
			}
			return continuePropagation;
		}
		//跳转到按钮事件
		function goToPageClickHandler(evt){
			var np=$(evt.target).parent().data('np');
			var new_current_page=$(evt.target).prevAll("input[type='text']").val();
			var reg=/^[1-9]+[0-9]*$/;//以1-9开头，后面为任意数字
			var result =reg.test(new_current_page);
			//输入非整数
			if(!result){
				if(Ext.MessageBox){Ext.MessageBox.show({title: '警告',msg: '请输入大于零的整数！',buttons : Ext.MessageBox.OK,icon : Ext.MessageBox.WARNING,fn : function(returnValue) {}});}else{alert('请输入大于零的整数！');}
				return;
			}
			//超出页数范围提示
			var pageNum=parseInt(new_current_page); //字符串转换成数字
			if(pageNum>np){
				if(Ext.MessageBox){Ext.MessageBox.show({title: '警告',msg: '没有那么多页的数据！',buttons : Ext.MessageBox.OK,icon : Ext.MessageBox.WARNING,fn : function(returnValue) {}});}else{alert('没有那么多页的数据');}
				return ;
			}
			continuePropagation = selectPage(pageNum-1);
			if (!continuePropagation) {
				evt.stopPropagation();
			}
			return continuePropagation;
		}
		//下拉列表事件
		function changePageSizeHandler(evt){
			//获取总记录数
			var maxentries=$(evt.target).parent().data('maxentries');
			//获取每页显示记录数
			var items_per_page=evt.target.value;
			var continuePropagation = changePageSize(items_per_page);
			if (!continuePropagation) {
				evt.stopPropagation();
			}
			return continuePropagation;
		}
		//重新初始化分页组件，更改每页显示记录数
		function changePageSize(items_per_page){
			// -----------------------------------
			// Initialize containers
			// -----------------------------------
			//初始化时当前页为0
			current_page = opts.current_page;
			//使用this保存当前页数
			containers.data('current_page', current_page);
			
			// Create a sane value for maxentries and items_per_page
			//页面中传入的总条目数如果没有初始化置为1
			maxentries = (!maxentries || maxentries < 0)?1:maxentries;
			
			//每页显示记录数如果未定义或小于零，则置为1
			opts.items_per_page = (!items_per_page || items_per_page < 0)?1:items_per_page;
			//containers.data('items_per_page', opts.items_per_page);
			
			//如果没有初始化成功默认的分页渲染器则抛出异常
			if(!$.PaginationRenderers[opts.renderer])
			{
				//raised when de-referencing an invalid reference  
				throw new ReferenceError("Pagination renderer '" + opts.renderer + "' was not found in jQuery.PaginationRenderers object.");
			}
			renderer = new $.PaginationRenderers[opts.renderer](maxentries, opts);
			
			// Attach control events to the DOM elements
			//初始化分页计算器
			var pc = new $.PaginationCalculator(maxentries, opts);
			//获取页数
			var np = pc.numPages();
			containers.bind('setPage', {numPages:np}, function(evt, page_id) { 
					if(page_id >= 0 && page_id < evt.data.numPages) {
						selectPage(page_id); return false;
					}
			});
			containers.bind('prevPage', function(evt){
					var current_page = $(this).data('current_page');
					if (current_page > 0) {
						selectPage(current_page - 1);
					}
					return false;
			});
			containers.bind('nextPage', {numPages:np}, function(evt){
					var current_page = $(this).data('current_page');
					if(current_page < evt.data.numPages - 1) {
						selectPage(current_page + 1);
					}
					return false;
			});
			
			// When all initialisation is done, draw the links
			containers.data('opts', opts);
			links = renderer.getLinks(current_page, paginationClickHandler);
			var goToPageCompant=renderer.getGoToPageCompanant(goToPageClickHandler);
			var changePageSizeCompanant=renderer.getChangePageSizeCompanant(changePageSizeHandler,opts);
			containers.empty();
			createPageHeader(current_page,np,maxentries).appendTo(containers);
			goToPageCompant.appendTo(links);
			changePageSizeCompanant.appendTo(links);
			links.appendTo(containers);
			// call callback function
			opts.callback(current_page, opts.items_per_page,containers);
		
		}
		//创建分页头部显示信息
		function createPageHeader(current_page,np,maxentries){
			var pageHeader=$("<h1></h1>");
			pageHeader.append("页数:"+(current_page+1)+"/"+np+"页 总计:"+maxentries+" 条数据");
			return pageHeader;
		}
		/**
		 * This is a utility function for the internal event handlers. 
		 * It sets the new current page on the pagination container objects, 
		 * generates a new HTMl fragment for the pagination links and calls
		 * the callback function.
		 */
		function selectPage(new_current_page) {
			// update the link display of a all containers
			containers.data('current_page', new_current_page);
			containers.data('opts', opts);
			links = renderer.getLinks(new_current_page, paginationClickHandler);
			var goToPageCompant=renderer.getGoToPageCompanant(goToPageClickHandler);
			var changePageSizeCompanant=renderer.getChangePageSizeCompanant(changePageSizeHandler,opts);
			containers.empty();
			np = pc.numPages(); //这里必需要重新计算页数
			createPageHeader(new_current_page,np,maxentries).appendTo(containers);
			goToPageCompant.appendTo(links);
			changePageSizeCompanant.appendTo(links);
			links.appendTo(containers);
			// call the callback and propagate the event if it does not return false
			var continuePropagation = opts.callback(new_current_page,opts.items_per_page, containers);
			return continuePropagation;
		}
		
		// -----------------------------------
		// Initialize containers
		// -----------------------------------
		//初始化时当前页为0
		current_page = opts.current_page;
		//使用this保存当前页数
		containers.data('current_page', current_page);
		
		// Create a sane value for maxentries and items_per_page
		//页面中传入的总条目数如果没有初始化置为1
		maxentries = (!maxentries || maxentries < 0)?1:maxentries;
		containers.data('maxentries', maxentries);
		//每页显示记录数如果未定义或小于零，则置为1
		opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0)?1:opts.items_per_page;
		//如果没有初始化成功默认的分页渲染器则抛出异常
		if(!$.PaginationRenderers[opts.renderer])
		{
			//raised when de-referencing an invalid reference  
			throw new ReferenceError("Pagination renderer '" + opts.renderer + "' was not found in jQuery.PaginationRenderers object.");
		}
		renderer = new $.PaginationRenderers[opts.renderer](maxentries, opts);
		
		// Attach control events to the DOM elements
		//初始化分页计算器
		var pc = new $.PaginationCalculator(maxentries, opts);
		//获取页数
		var np = pc.numPages();
		containers.bind('setPage', {numPages:np}, function(evt, page_id) { 
				if(page_id >= 0 && page_id < evt.data.numPages) {
					selectPage(page_id); return false;
				}
		});
		containers.bind('prevPage', function(evt){
				var current_page = $(this).data('current_page');
				if (current_page > 0) {
					selectPage(current_page - 1);
				}
				return false;
		});
		containers.bind('nextPage', {numPages:np}, function(evt){
				var current_page = $(this).data('current_page');
				if(current_page < evt.data.numPages - 1) {
					selectPage(current_page + 1);
				}
				return false;
		});
		
		// When all initialisation is done, draw the links
		containers.data('opts', opts);
		//生成超级链接
		links = renderer.getLinks(current_page, paginationClickHandler);
		//生成跳转输入框和按钮
		var goToPageCompant=renderer.getGoToPageCompanant(goToPageClickHandler);
		//生成改变每页显示记录数下拉列表
		var changePageSizeCompanant=renderer.getChangePageSizeCompanant(changePageSizeHandler,opts);
		//清除原有内容
		containers.empty();
		//渲染组件
		createPageHeader(current_page,np,maxentries).appendTo(containers);
		goToPageCompant.appendTo(links);
		changePageSizeCompanant.appendTo(links);
		links.appendTo(containers);
		// call callback function
		opts.callback(current_page, opts.items_per_page,containers);
	} // End of $.fn.pagination block
	
})(jQuery);
