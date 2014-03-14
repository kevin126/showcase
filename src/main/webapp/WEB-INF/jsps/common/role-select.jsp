<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@include file="../common/commonHeader.jsp"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>选择角色</title>
		<link href="<%=request.getContextPath()%>/css/global.css" rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css" rel="stylesheet" type="text/css" />
		<%@include file="../common/commonJs.jsp"%>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/jQuery1.4.2.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/dialog_popup/lanrentuku.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/tab.js"></script>
		
		<link
			href="<%=request.getContextPath()%>/js/dialog_popup/css/Popup.css"
			rel="stylesheet" type="text/css" />
		<script type="text/javascript">
			$(document).ready(function(){
  				$("dl").mouseover(function(){
  				$("dt:last", this).show();
  			});
  				$("dl").mouseout(function(){
  				$("dt:last", this).hide();
  			});
			});
			String.prototype.replaceAll  = function(s1,s2){   
				return this.replace(new RegExp(s1,"gm"),s2);   
			}
			
			function closeWindow(){
			if(window.parent){
				try{
					art.dialog.close();
				}catch(e){
				}
			}
		}
		function selectAllRecords(obj,checkboxName){
		//表头的checkbox
		var checkboxs=document.getElementsByName(checkboxName);
		   	for(var i=0;i<checkboxs.length;i++) {
		   		checkboxs[i].checked = obj.checked;
		  }
		}
		function returnValue(){	
	
			var allRows = new Array();
			var nmTb = document.getElementById('nmRecordTabelId'); 
			var ossTb = document.getElementById('ossRecordTabelId'); 
			//循环看是否有选择的角色，没有就直接提示
			var isSelect=false;
			//查看NM是否有选择的角色
			for(var i=1;i<nmTb.rows.length;i++) {
			     var checkbox = nmTb.rows[i].cells[0].getElementsByTagName("INPUT")[0];
			     if(checkbox.checked==true){
			     isSelect=true;
			     break;
			     }
			     }
			//查看OSS是否有选择的角色
			for(var i=1;i<ossTb.rows.length;i++) {
			     var checkbox = ossTb.rows[i].cells[0].getElementsByTagName("INPUT")[0];
			     if(checkbox.checked==true){
			     isSelect=true;
			     break;
			     }
			     }
			if(!isSelect){
				  Ext.Msg.show({
						title : '提示',
						msg : '请选择要添加的角色！',
						modal : true,
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.INFO
				});	
				return;
			}
			//将NM所选择的角色数据保存
			for(var i=1;i<nmTb.rows.length;i++) {
			
			     var checkbox = nmTb.rows[i].cells[0].getElementsByTagName("INPUT")[0];
			     if(checkbox.checked==true){
			     	var row=new Object();
			     //	var row=new Array();
				    for(var j=2;j<nmTb.rows[i].cells.length;j++){
					    var value = nmTb.rows[i].cells[j].innerHTML;
					    	
					    if(j==2){
					    // row.push({"roleName":value.trim().replaceAll('&nbsp;','')});
					     row.roleName=value.trim().replaceAll('&nbsp;','');
					     continue;
					    }else  if(j==4){
					     row.roleDescription=value.trim().replaceAll('&nbsp;','');
					     row.appName="nm";
					    //row.push({"roleDescription":value.trim().replaceAll('&nbsp;','')});
					    //row.push({"appName":"nm"});
					     continue;
					    }
					    
					}  
					allRows.push(row);
			     }  
			}
			//将OSS所选择的角色数据保存
			for(var i=1;i<ossTb.rows.length;i++) {
			
			     var checkbox = ossTb.rows[i].cells[0].getElementsByTagName("INPUT")[0];
			     if(checkbox.checked==true){
			     	//var row=new Array();
			     	var row=new Object();
				    for(var j=2;j<ossTb.rows[i].cells.length;j++){
					    var value = ossTb.rows[i].cells[j].innerHTML;
					    	
					    if(j==2){
					     //row.push({"roleName":value.trim().replaceAll('&nbsp;','')});
					     row.roleName=value.trim().replaceAll('&nbsp;','');
					     continue;
					    }else  if(j==4){
					    row.roleDescription=value.trim().replaceAll('&nbsp;','');
					    //row.push({"roleDescription":value.trim().replaceAll('&nbsp;','')});
					    // row.push({"appName":"oss"});
					    row.appName="oss";
					     continue;
					    }
					   
					}  
					allRows.push(row);
			     }  
			}
		 if(window.parent){
				try{
				<c:if test="${param.jsmethod==null}">
					window.parent.doCallBack(allRows);
				</c:if>
				<c:if test="${param.jsmethod!=null}">
					window.parent.<c:out value="${param.jsmethod}"/>(allRows);
				</c:if>
					art.dialog.close();
				}catch(e){}
			}
			}
		</script>
	</head>
	<body>
		<center>


			<div id="tab6">
				<div id="menu6">
					<h3 class="hover" onmouseover="setTabol(6,0)">
						<div id="santu0" class="nn_tb"
							onmouseover="document.getElementById('santu0').className='nn_tb';document.getElementById('santu1').className='nn_tb2'">
							<span></span>
							<em>NetManager</em>
							<i></i>
						</div>
					</h3>

					<h3 class="hover" onmouseover="setTabol(6,1)">
						<div id="santu1" class="nn_tb2"
							onmouseover="document.getElementById('santu0').className='nn_tb2';document.getElementById('santu1').className='nn_tb'">
							<span></span>
							<em>OSSWorks</em>
							<i></i>
						</div>
					</h3>
				</div>
				<!--tab标签,NO1-->
				<ol class="block">
					<div class="jiaose_gl_list">
						<div class="qianhui_border margin_10px">
							<div class="jssd_title white_border">
								<h3>
									<div class="g_titil">
										<strong>NetManager角色列表</strong>&nbsp;-&nbsp;共有
										<s:property value="nmRecords" />
										个角色
									</div>
								</h3>
							</div>
							<div class="qianhui_space"></div>

							<div class="liucheng_counter">
								<table width="100%" cellspacing="0" cellpadding="0" border="0" id="nmRecordTabelId">
									<tbody>
										<tr class="xbiao_th_new">
											<th width="4%" align="left" style="padding-left: 6px">
												<input type="checkbox" name="checkbox" id="checkbox"  onclick="selectAllRecords(this,'nmcheckbox');"/>
											</th>
											<th width="4%">
												<div class="xbiao_th_new_g"></div>
												<div class="xbiao_th_w">
													序号
												</div>
											</th>

											<th width="12%">
												<div class="xbiao_th_new_g"></div>
												<div class="xbiao_th_w">
													<span class="pop_biaot">角色</span>
												</div>
											</th>
											<th width="7%">
												<div class="xbiao_th_new_g"></div>
												<div class="xbiao_th_w">
													<span class="pop_biaot">数量</span>
												</div>
											</th>
											<th width="66%">
												<div class="xbiao_th_new_g"></div>
												<div class="xbiao_th_w">
													描述
												</div>
											</th>
										</tr>
										<s:if test="nmRoleList!=null && nmRoleList.size()>0">
											<s:iterator value="nmRoleList" status="roleStatus">
												<tr
													<s:if test="#roleStatus.index%2==0">
																				 onmouseout="this.className='xbiao_tr'"
																				onmousemove="this.className='xbiao_tr_on'"
																				class="xbiao_tr" 
																			</s:if>
													<s:else>
																 				onmouseout="this.className='xbiao_tr2'" onmousemove="this.className='xbiao_tr_on'" class="xbiao_tr2"
																			</s:else>
													id="<s:property value="id"/>">
													<td>
														<input type="checkbox" name="nmcheckbox" id="checkbox" />
													</td>
													<td>
														<s:property value="#roleStatus.index+1" />
													</td>
													<td>
														<s:property value="roleName" />
													</td>
													<td>
														<a
															href="<%=request.getContextPath()%>/role/role!roleMembers.action?roleId=<s:property value="id"/>"
															title="查看角色成员"><s:property value="count" />人</a>
													</td>

													<td>
														<s:property value="roleDescription" />
													</td>
												</tr>
											</s:iterator>
										</s:if>
										<s:else>
											<tr>
												<td colspan="5">
													<center>
														<h5>
															系统中没有角色信息!
														</h5>
													</center>
												</td>
												<td></td>
											</tr>
										</s:else>
									</tbody>
								</table>
								<div class="fenye_css">
									<div class="fenye_coun">
										<h1>

										</h1>
									</div>
								</div>
							</div>

						</div>
					</div>
					<div class="bn_ceng">
						<div class="table_an tar_wid90b">
							<input name="" type="button" class="gx_w_bn all_butt" value="确 定"
								onclick="returnValue();" />
							<input name="" type="button" class="gx_w_bn all_butt" value="取 消"
								onclick="art.dialog.close()" />
						</div>
					</div>
				</ol>
				<ol style="display: none">
					<div class="jiaose_gl_list">

						<div class="qianhui_border margin_10px">
							<div class="jssd_title white_border">
								<h3>
									<div class="g_titil">
										<strong>OSSWorks角色列表</strong>&nbsp;-&nbsp;共有
										<s:property value="ossRecords" />
										个角色
									</div>
								</h3>
							</div>
							<div class="qianhui_space"></div>
							<div class="liucheng_counter">

								<table width="100%" cellspacing="0" cellpadding="0" border="0" id="ossRecordTabelId">
									<tbody>
										<tr class="xbiao_th_new">
											<th width="4%" align="left" style="padding-left: 6px">
												<input type="checkbox" name="checkbox" id="checkbox"  onclick="selectAllRecords(this,'osscheckbox');"/>
											</th>
											<th width="4%">
												<div class="xbiao_th_new_g"></div>
												<div class="xbiao_th_w">
													序号
												</div>
											</th>

											<th width="12%">
												<div class="xbiao_th_new_g"></div>
												<div class="xbiao_th_w">
													<span class="pop_biaot">角色</span>
												</div>
											</th>
											<th width="7%">
												<div class="xbiao_th_new_g"></div>
												<div class="xbiao_th_w">
													<span class="pop_biaot">数量</span>
												</div>
											</th>
											<th width="66%">
												<div class="xbiao_th_new_g"></div>
												<div class="xbiao_th_w">
													描述
												</div>
											</th>
										</tr>

										<s:if test="ossRoleList!=null && ossRoleList.size()>0">
											<s:iterator value="ossRoleList" status="roleStatus">
												<tr
													<s:if test="#roleStatus.index%2==0">
																				 onmouseout="this.className='xbiao_tr'"
																				onmousemove="this.className='xbiao_tr_on'"
																				class="xbiao_tr" 
																			</s:if>
													<s:else>
																 				onmouseout="this.className='xbiao_tr2'" onmousemove="this.className='xbiao_tr_on'" class="xbiao_tr2"
																			</s:else>
													id="<s:property value="id"/>">
													<td>
														<input type="checkbox" name="osscheckbox" id="checkbox" />
													</td>
													<td>
														<s:property value="#roleStatus.index+1" />
													</td>
													<td>
														<s:property value="roleName" />
													</td>
													<td>
														<a
															href="<%=request.getContextPath()%>/role/role!roleMembers.action?roleId=<s:property value="id"/>"
															title="查看角色成员"><s:property value="count" />人</a>
													</td>

													<td>
														<s:property value="roleDescription" />
													</td>
												</tr>
											</s:iterator>
										</s:if>
										<s:else>
											<tr>
												<td colspan="5">
													<center>
														<h5>
															系统中没有角色信息!
														</h5>
													</center>
												</td>
												<td></td>
											</tr>
										</s:else>
									</tbody>
								</table>
								<div class="fenye_css">
									<div class="fenye_coun">
										<h1>
											
										</h1>
									</div>
								</div>
							</div>

						</div>
					</div>
					<div class="bn_ceng">
						<div class="table_an tar_wid90b">
							<input name="" type="button" class="gx_w_bn all_butt" value="确 定"
								onclick="returnValue();" />
							<input name="" type="button" class="gx_w_bn all_butt" value="取 消"
								onclick="art.dialog.close()" />
						</div>
					</div>
				</ol>
			</div>
		</center>
	</body>
</html>
