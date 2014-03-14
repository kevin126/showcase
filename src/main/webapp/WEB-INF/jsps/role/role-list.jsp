<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="uums" uri="/WEB-INF/tlds/mypage.tld"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<%@include file="../common/commonHeader.jsp"%>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><s:text name="common.product.title" /></title>
		<link href="<%=request.getContextPath()%>/css/global.css" rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css" rel="stylesheet" type="text/css" />
		<%@include file="../common/commonJs.jsp"%>
		<link href="../css/main.css" rel="stylesheet" type="text/css" />
		<script src="<%=request.getContextPath()%>/js/uums/role/role.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/tab.js"></script>
		<script	src="<%=request.getContextPath()%>/js/apex/setting/RoleFunction.js"></script>
		<script	src="<%=request.getContextPath()%>/js/jquery.pagination.js"></script>
		<script type="text/javascript">
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#roleMgt").addClass("on_this");
			}
			//处理方法
			function process(url,appName){
				//alert("process url:"+url);
				$.ajax({
				   type: "POST",
				   url: url,
				   dataType: "json",
				   success: function(data){
				    if(data.code=="200"){
					//	alert("count:"+data.result);
						var dataList=data.result;
						//alert("table length:"+$('#'+appName+'TableId tr').length);
						//Table中存在旧的数据需要删除,第一行为表头
						if($('#'+appName+'TableId tr').length>1){
							//除了第一行其它都删除
							$('#'+appName+'TableId').find("tr:gt(0)").remove();
						}
						if(dataList.length>0){
							for(var i=0;i<dataList.length;i++){
								var data=dataList[i];
								var columnStr="<tr";
								if(i%2==0){
									columnStr+=' onmouseout="this.className=\'xbiao_tr\'" onmousemove=\"this.className=\'xbiao_tr_on\'" class=\"xbiao_tr\"';
								}else{
									columnStr+=' onmouseout="this.className=\'xbiao_tr2\'" onmousemove=\"this.className=\'xbiao_tr_on\'" class=\"xbiao_tr2\"';
								}
								columnStr+=" id='"+data[0]+"'>";
								columnStr+=" <td>"+(i+1)+"</td>";  //序号列
								columnStr+="<td>"+data[1]+"</td>";
								columnStr+="<td><a href='<%=request.getContextPath()%>/role/role!roleMembers.action?roleId="+data[0]+"' title=\"查看角色成员\">"+data[3]+"人</a></td>";
								columnStr+="<td>"+data[2]+"</td>";
								columnStr+='<td>';
								if(data[4]){
									columnStr+='<input type="button" class="all_butt chakan_bn" value="编辑" onclick=\"window.location.href=\'<%=request.getContextPath()%>/role/role!enterAddOrUpdateRole.action?appName='+appName+'&roleId='+data[0]+'\'\"/>';
								}
								columnStr+='<input type="button" class="all_butt chakan_bn" value="删除" onclick=\'deleteConform('+data[0]+')\'/>';
								columnStr+="</td>";
								
								columnStr+="</tr>";
							//	alert(columnStr);
								$('#'+appName+'TableId tr:last').after(columnStr);
							}
						}else{
							$('#'+appName+'TableId tr:last').after('<tr><td colspan="5"><center><h5>系统中没有角色信息!</h5></center></td><td></td></tr>');
						}
					 }
				   }
				 });
			}
			//nm分页回调方法
			function nmPageSelectCallBack(currentPage, pageSize,jq){
				//alert("currentPage:"+currentPage+" pageSize:"+pageSize);
				var url="<%=request.getContextPath()%>/role/role!queryRoleByAppNames.action?appName=nm&currentPage="+(currentPage+1)+"&pageSize="+pageSize;
				process(url,"nm");
			}
			$.ajax({
			   type: "POST",
			   url: "<%=request.getContextPath()%>/role/role!queryRoleCountByAppNames.action?appName=nm",
			   dataType: "json",
			   success: function(data){
			    if(data.code=="200"){
					//alert("count:"+data.result);
					var num_entries=data.result;
					$("#nmHeaderId").append("<strong>角色列表</strong>&nbsp;-&nbsp;共有"+num_entries+"个角色");
					$("#nmPagination").pagination(num_entries, {
	                    callback: nmPageSelectCallBack,
	                    items_per_page: 10// Show only one item per page
	                });
				 }else{
				 	alert(data.message);
				 }
			   }
			 });
			 
			 //oss 
			 //oss分页回调方法
			function ossPageSelectCallBack(currentPage, pageSize,jq){
				var url="<%=request.getContextPath()%>/role/role!queryRoleByAppNames.action?appName=oss&currentPage="+(currentPage+1)+"&pageSize="+pageSize;
				process(url,"oss");
			}
			 $.ajax({
			   type: "POST",
			   url: "<%=request.getContextPath()%>/role/role!queryRoleCountByAppNames.action?appName=oss",
			   dataType: "json",
			   success: function(data){
			    if(data.code=="200"){
					//alert("count:"+data.result);
					var num_entries=data.result;
					$("#ossHeaderId").append("<strong>角色列表</strong>&nbsp;-&nbsp;共有"+num_entries+"个角色");
					$("#ossPagination").pagination(num_entries, {
	                    callback: ossPageSelectCallBack,
	                    items_per_page: 10// Show only one item per page
	                });
				 }else{
				 	alert(data.message);
				 }
			   }
			 });
			 
		</script>
	</head>
	<body onload="init()">
		<%@include file="../common/new_topMenu.jsp"%>
		<div class="height2px"></div>
		<div class="main_w wai_border">
			<div class="main white_border">

				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="left" valign="top"><%@ include
								file="../common/systemLeftOperatorItems.jsp"%></td>
						<td width="100%" align="left" valign="top">
							<div class="works_search left_margin8px all_border no_bor_bott">
								<div class="work_ss_title white_border">
									<h1 class="mokuai_ss"></h1>
									<h2 class="works_ss_ge"></h2>
									<h3>
										<s:text name="common.product.currentlocation" />
										<s:text name="common.product.systemtitle" /> >> 角色设定
									</h3>
								</div>
								<div class="all_space"></div>
								<div class="workrep_content">
									<div class="gongzuoqu_footbg2 white_border">
										<div class="lingyong_sm">
											<h1>
												<div class="rep_biaoti">
													<img
														src="<%=request.getContextPath()%>/images/tongyi/i_r2_c22.jpg"
														width="59" height="59" />
												</div>
												<div class="dawem_bt">
													<dt>
														<img
															src="<%=request.getContextPath()%>/images/tongyi/e3_c42.jpg"
															height="25" />
													</dt>

													<dt class="shuoming_tu">
														说明：对系统中的各种角色进行管理，不同的角色对应不同的权限！
													</dt>
												</div>
											</h1>
										</div>

										<!--<div class="tab_ceng_jiao">
                <div class="tabl_x"></div>
                <div class="tabl_y"></div>
                  
                  </div>-->
									</div>
								</div>
							</div>
							<div class="works_search left_margin8px all_border">

								<div class="works_ss_jieguo white_border">
									<div id="tab6">
										<div id="menu6">
											<h3 class="hover" onmouseover="setTab(6,0)">
												<div id="santu0" class="nn_tb"
													onmouseover="document.getElementById('santu0').className='nn_tb';document.getElementById('santu1').className='nn_tb2'">
													<span></span>
													<em>NetManager</em>
													<i></i>
												</div>
											</h3>

											<h3 class="hover" onmouseover="setTab(6,1)">
												<div id="santu1" class="nn_tb2"
													onmouseover="document.getElementById('santu0').className='nn_tb2';document.getElementById('santu1').className='nn_tb'">
													<span></span>
													<em>OSSWorks</em>
													<i></i>
												</div>
											</h3>
										</div>
										<!-- 操作失败后在这里显示错误信息 -->
										<div id="errorInforShow" style="display: none">
											<div style="height: 10px;"></div>
											<div class="warning" id="errorShowId" style="padding: 5px;">
												${genericErrorContent}
											</div>
											<div class="button_position">
												<table width="100%" height="28" border="0">
													<tr>
														<td>
															<a href="#" onclick="hideDiv('errorInforShow')">
																<div class="button_gray">
																	确&nbsp;&nbsp;定
																</div> </a>
														</td>
													</tr>
												</table>
											</div>
										</div>
										<div id="delete" style="display: none">
											<div style="height: 10px;"></div>
											<div class="warning" style="padding: 5px;">
												&nbsp;您是否确定删除所选的角色?
												<input id="deleteRoleId" type="hidden" />
											</div>
											<div class="button_position">

												<table width="100%" height="28" border="0">
													<tr>
														<td width="48%" align="center">
															<a href="#" onclick="deleteRole()"><div
																	class="button_blue">
																	确&nbsp;&nbsp;定
																</div> </a>
														</td>
														<td width="52%">
															<a href="#" onclick="hideDiv('delete')"><div
																	class="button_gray">
																	取&nbsp;&nbsp;消
																</div> </a>
														</td>
													</tr>
												</table>
											</div>
										</div>
										<!--tab标签,NO1-->
										<ul class="block">
											<div class="jiaose_gl_list">
										        <div class="qianhui_border margin_10px">
										            <div class="jssd_title white_border">
										                <h3>
										                    <div class="g_titil" id="nmHeaderId"></div>
										                </h3>
										                <div class="tit_right tit_right_gai">
										                    <div class="cmdb_cha">
										                        <div class="jiaosetop_margin6px">
										                            <input name="" type="button" class="all_butt add_jiaose" value="添加角色" onclick="window.location.href='<%=request.getContextPath()%>/role/role!enterAddOrUpdateRole.action?appName=nm'"/>
										                        </div>
										                    </div>
										                </div>
										            </div>
										            <div class="qianhui_space">
										            </div>
										            <div class="liucheng_counter">
										                <table width="100%" cellspacing="0" cellpadding="0" border="0" id="nmTableId">
										                    <tbody>
										                        <tr class="xbiao_th_new">
										                            <th width="4%">
										                                <div class="xbiao_th_w">
										                                    	序号
										                                </div>
										                            </th>
										                            <th width="12%">
										                                <div class="xbiao_th_new_g">
										                                </div>
										                                <div class="xbiao_th_w">
										                                    <span class="pop_biaot">角色</span>
										                                </div>
										                            </th>
										                            <th width="7%">
										                                <div class="xbiao_th_new_g">
										                                </div>
										                                <div class="xbiao_th_w">
										                                    <span class="pop_biaot">数量</span>
										                                </div>
										                            </th>
										                            <th width="66%">
										                                <div class="xbiao_th_new_g">
										                                </div>
										                                <div class="xbiao_th_w">
										                                    	描述
										                                </div>
										                            </th>
										                            <th width="11%">
										                                <div class="xbiao_th_new_g">
										                                </div>
										                                <div class="xbiao_th_w">
										                                    <span class="pop_biaot">操作</span>
										                                </div>
										                            </th>
										                        </tr>
											                    </tbody>
											                </table>
											                <div class="fenye_css">
											                    <div class="fenye_coun" id="nmPagination">
											                    </div>
											                </div>
											            </div>
											        </div>
											    </div>
										</ul>
										<ul>
										    <div class="jiaose_gl_list">
										        <div class="qianhui_border margin_10px">
										            <div class="jssd_title white_border">
										                <h3>
										                    <div class="g_titil" id="ossHeaderId"></div>
										                </h3>
										                <div class="tit_right tit_right_gai">
										                    <div class="cmdb_cha">
										                        <div class="jiaosetop_margin6px">
										                            <input name="" type="button" class="all_butt add_jiaose" value="添加角色" onclick="window.location.href='<%=request.getContextPath()%>/role/role!enterAddOrUpdateRole.action?appName=oss'"/>
										                        </div>
										                    </div>
										                </div>
										            </div>
										            <div class="qianhui_space">
										            </div>
										            <div class="liucheng_counter">
										                <table width="100%" cellspacing="0" cellpadding="0" border="0" id="ossTableId">
										                    <tbody>
										                        <tr class="xbiao_th_new">
										                            <th width="4%">
										                                <div class="xbiao_th_w">
										                                    	序号
										                                </div>
										                            </th>
										                            <th width="12%">
										                                <div class="xbiao_th_new_g">
										                                </div>
										                                <div class="xbiao_th_w">
										                                    <span class="pop_biaot">角色</span>
										                                </div>
										                            </th>
										                            <th width="7%">
										                                <div class="xbiao_th_new_g">
										                                </div>
										                                <div class="xbiao_th_w">
										                                    <span class="pop_biaot">数量</span>
										                                </div>
										                            </th>
										                            <th width="66%">
										                                <div class="xbiao_th_new_g">
										                                </div>
										                                <div class="xbiao_th_w">
										                                  	  描述
										                                </div>
										                            </th>
										                            <th width="11%">
										                                <div class="xbiao_th_new_g">
										                                </div>
										                                <div class="xbiao_th_w">
										                                    <span class="pop_biaot">操作</span>
										                                </div>
										                            </th>
										                        </tr>
										                    </tbody>
										                </table>
										                <div class="fenye_css">
										                    <div class="fenye_coun" id="ossPagination">
										                    </div>
										                </div>
										            </div>
										        </div>
										    </div>
										</ul>
									</div>
								</div>
							</div>

							<div class="works_search left_margin8px">
								<table width="100%" border="0" cellspacing="0" cellpadding="0">
									<tr>
										<td width="50%">
											&nbsp;
										</td>
										<td>
											&nbsp;
										</td>
									</tr>
								</table>
							</div>
						</td>
					</tr>

				</table>
			</div>
		</div>
		<%@include file="../common/bottom.jsp"%>
	</body>
</html>
