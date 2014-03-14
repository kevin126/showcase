/**
该JS用于LOAD工作区所有内容 By Huangw
*/
	
function progress(divId){
	$('#'+divId).each(
		function(){
			$(this).children().children("tr").each(
				function(){
					var td = $(this).children("td");
					var jindu = td.eq(4).find(".jindu");
					//js竟然parseInt(100%)=100, 无语了										
					var length = parseInt(td.eq(5).html())/100 * parseInt(jindu.width());
					//jindu.append("<div>&nbsp;</div>");
					jindu.css("backgroundImage", "url(/itsm/images/jindu_da.jpg)");
					jindu.css("backgroundRepeat", "repeat-x");
					jindu.animate({width: length + "px"}, 1500);
				}
			);
		}
	);
	//new slideDrag(852, 3, "images");
}

function loadFilter(){
	$.getJSON('/itsm/issue/issueView.do?menuId=m0_0&type=0',function(data){
		if(data!=null && data.length > 0){
			$('#filter_count_span').html(data[0]);
			var filterHtml = '';
			for(var i=0,n=data[1].length;i<n;i++){
				filterHtml += '<tr><td width="90"';
				if(i%2==1){
					filterHtml += 'style="background-color: #eee;">'+(i+1)+'</td>';
				}else{
					filterHtml += '>'+(i+1)+'</td>';
				}
				if(i%2==1){
					filterHtml += '<td style="background-color: #eee;">';
				}else{
					filterHtml += '<td>';
				}
				filterHtml += '<a href="/itsm/common/search.do?_search_=complexSearch&'+data[1][i].condition+'">'+data[1][i].name+'</a></td></tr>';
			}
			$('#filter_list_table').append(filterHtml);
			$('#filter_loading').remove();
			$('#filter_data_div').show();
		}
     });
}

function loadIssue(){
	var issueHtml = null;
	var type = null;
	for(var i=1;i<=5;i++) {
		var loadingHtml = '<div id="issue_loading_'+i+'" class="workarea_block">';
		loadingHtml += $('#issue_loading').html();
		loadingHtml += '</div>';
		$('#notice_div').before(loadingHtml);
		$.get('/itsm/issue/issueView.do?menuId=m0_0&type='+i,function(content){
			if(content!=null){
				if(content.indexOf('<div')!=-1){
					type = content.substring(0,content.indexOf('<div'));
				}else{
					type = content;
				}
				content = content.replace(type,'');
				$('#issue_loading_'+$.trim(type)).remove();
				if($.trim(content)!=""){
					$('#notice_div').before(content);
				}
			}
		});
	}
}

function loadNotice(){
	$.getJSON('/itsm/issue/issueView.do?menuId=m0_0&type=12',function(data){
			var noticeHtml = null;
       		var listHtml = "<li>&nbsp;</li>";
        	if(data!=null && data.length==2){
        		if(data[0]!=null){
        			noticeHtml = '<a href="/itsm/servicedesk/notice/showNotice.do?method=common&noticeId='+data[0].noticeId+'&comm=2" target="_blank">'+data[0].memo+'</a>';
        		}else{
        			noticeHtml = '未发布相关公告！';
        		}
        		if(data[1]!=null && data[1].length>0){
        			for(var i=0,n=data[1].length;i<n;i++){
        				listHtml += '<li><img src="/itsm/images/child.gif" />';
        				listHtml += '<a title="'+data[1][i].title+'" href="/itsm/servicedesk/notice/showNotice.do?method=common&noticeId='+data[1][i].noticeId+'&comm=2" target="_blank"><p title="'+data[1][i].title+'" style="display:inline;">'+data[1][i].newTitle+'</p></a>';
        				listHtml += '</li>';
        			}
        		}else{
        			listHtml += '<li><img src="/itsm/images/child.gif" />未发布相关公告！</li>';
        		}

        	}else{
        		noticeHtml = '未发布相关公告！';
        		listHtml += '<li><img src="/itsm/images/child.gif" />未发布相关公告！</li>';
        	}
        	
        	//公告列表
       		$('#notice_list_div').html(listHtml);
       		$('#notice_td').html(noticeHtml);
    });
}

function loadStatByLevel(){
	$.getJSON('/itsm/issue/issueView.do?menuId=m0_0&type=13',function(data){
		if(data!=null && data.length > 0){
			var prior_1 = data[0]['1'];
			var prior_2 = data[0]['2'];
			var prior_3 = data[0]['3'];
			var prior_4 = data[0]['4'];
			$('#prior_td_4_0').html(prior_4+'');
			$('#prior_td_3_0').html(prior_3+'');
			$('#prior_td_2_0').html(prior_2+'');
			$('#prior_td_1_0').html(prior_1+'');
			
			var total = prior_1+prior_2+prior_3+prior_4;
			if(total>0){
				$('#prior_td_4_1').html(Math.round(prior_4/total*100)+'%');
				$('#prior_td_3_1').html(Math.round(prior_3/total*100)+'%');
				$('#prior_td_2_1').html(Math.round(prior_2/total*100)+'%');
				$('#prior_td_1_1').html(Math.round(prior_1/total*100)+'%');
			}
			$('#prior_loading').remove();
			$('#prior_yin').show();
			$('#prior_div').show();
			progress('prior_table');
		}
    });
}

function loadStatBySeverity(){
	$.getJSON('/itsm/issue/issueView.do?menuId=m0_0&type=14',function(data){
		if(data!=null && data.length > 0){
			var impact_1 = data[0]['1']==null?0:data[0]['1'];
			var impact_2 = data[0]['2']==null?0:data[0]['2'];
			var impact_3 = data[0]['3']==null?0:data[0]['3'];
			var impact_4 = data[0]['4']==null?0:data[0]['4'];
			$('#impact_td_4_0').html(impact_4+'');
			$('#impact_td_3_0').html(impact_3+'');
			$('#impact_td_2_0').html(impact_2+'');
			$('#impact_td_1_0').html(impact_1+'');
			
			var total = impact_1+impact_2+impact_3+impact_4;
			if(total>0){
				$('#impact_td_4_1').html(Math.round(impact_4/total*100)+'%');
				$('#impact_td_3_1').html(Math.round(impact_3/total*100)+'%');
				$('#impact_td_2_1').html(Math.round(impact_2/total*100)+'%');
				$('#impact_td_1_1').html(Math.round(impact_1/total*100)+'%');
			}
			$('#impact_loading').remove();
			$('#impact_yin').show();
			$('#impact_div').show();
			progress('impact_table');
		}		
     });
}

function loadStatByProessor(){
	$.getJSON('/itsm/issue/issueView.do?menuId=m0_0&type=15',function(data){
		if(data!=null && data.length==3 && data[0]>0){
			var processorHtml = '';
			for(var key in data[1]){
				var realName = key.split('|')[1];
				processorHtml += '<tr bgcolor="#fde8e8"><td width="6%">&nbsp;</td><td width="8%"><img src="/itsm/images/renyuan.gif" /></td>';
				processorHtml += '<td width="33%"><span class="tongji_link"> <a href="'+data[2]+'&p='+encodeURIComponent(realName)+'" title="'+realName+'">'+realName.substr(0,6)+'</a></span></td>';
				processorHtml += '<td width="7%">'+data[1][key]+'</td><td width="29%"><div class="jindu"></div></td>';
				processorHtml += '<td width="17%" align="center">'+Math.round(data[1][key]/data[0]*100)+'%</td>';
			}
			$('#processor_table').html(processorHtml);
			$('#processor_loading').remove();
			$('#processor_yin').show();
			$('#processor_div').show();
			progress('processor_table');
		}else{
			$('#processor_loading').remove();
		}
    });
}

$(function(){
	$("div[name='toggle']").hide();
	$("div[name='toggle']").bind("click", function(){
		$(this).parent().parent().parent().parent().parent().next("div").slideToggle();
		$(this).attr("class") == "yin" ? $(this).attr("class", "zhankai") : $(this).attr("class", "yin")
		$(this).html() == "隐藏" ? $(this).html("展开") : $(this).html("隐藏");
	});
	
	//Loading页面内容
	loadFilter();
	loadIssue();
	loadNotice();
	loadStatByLevel();
	loadStatBySeverity();
	loadStatByProessor();
});