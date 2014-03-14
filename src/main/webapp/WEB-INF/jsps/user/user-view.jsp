<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<%@include file="../common/commonHeader.jsp"%>
	<head>
		<title><s:text name="common.product.title" />
		</title>
		<link href="<%=request.getContextPath()%>/css/global.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"
			rel="stylesheet" type="text/css" />
		<%@include file="../common/commonJs.jsp"%>
		<link href="<%=request.getContextPath()%>/css/global.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"
			rel="stylesheet" type="text/css" />
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/jQuery1.4.2.js"></script>
		<link type="text/css" rel="stylesheet" href="<%=request.getContextPath()%>/js/jquery/style/validator.css"></link>
		<script src="<%=request.getContextPath()%>/js/jquery/jquery_last.js" type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/js/jquery/formValidator.js" type="text/javascript" charset="UTF-8"></script>
		<script	src="<%=request.getContextPath()%>/js/jquery/formValidatorRegex.js" type="text/javascript" charset="UTF-8"></script>
		<script	src="<%=request.getContextPath()%>/js/jquery/validator/validateUserEdit.js"	type="text/javascript" charset="UTF-8"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog/artDialog.min.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/artDialog/skin.js"></script>
		<script type="text/javascript">
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#userMgt").addClass("on_this");
			}
			
			function del(){
				art.dialog({icon: 'confirm',content: '您确定要删所选的用户吗？',
			    yesFn: function(){
			        //return false; //如果返回false将阻止关闭
			    },
			    noFn: true //为true等价于function(){}
			  });
				}
				function qiyong(){
				art.dialog({icon: 'confirm',content: '您确定要启用所选的用户吗？',
			    yesFn: function(){
			        //return false; //如果返回false将阻止关闭
			    },
			    noFn: true //为true等价于function(){}
			  });
				}
				function jinyong(){
				art.dialog({icon: 'confirm',content: '您确定要禁用所选的用户吗？',
			    yesFn: function(){
			        //return false; //如果返回false将阻止关闭
			    },
			    noFn: true //为true等价于function(){}
			  });
				}
				
				function re_pass(){
				art.dialog({icon: 'confirm',content: '您确定要将该用户的密码重置为默认密码"11111111"吗？',
			    yesFn: function(){
			        //return false; //如果返回false将阻止关闭
			        var idsArray="<s:property value='user.id'/>";
			        $.ajax({
						data:{
							ids:idsArray
							},
						dataType:'html',
						type:'post',
						url:'/uums/user/user!batchModifyPSW.action',
						success:function(html){
							 art.dialog({lock: true,content: '重置密码已完成!',yesFn: true});
						},
						error:function (XMLHttpRequest, textStatus) {
								art.dialog({lock: true,content: '操作失败:'+textStatus,yesFn: true});
						}
					});
			
			    },
			    noFn: true //为true等价于function(){}
			  });
				}
			//修改用户状态超级链接
			function changUserStatus(aLink){
				//alert(aLink.innerHTML);
				//id="userStatusSpanId"
				var userStatus=document.getElementById("userStatusId").value;
				//alert("userStatus:"+userStatus);
				//当前状态为启用状态
				if(userStatus==1){
					art.dialog({icon: 'confirm',content: '您确定要禁用当前用户吗？',
					    yesFn: function(){
					        //return false; //如果返回false将阻止关闭
					        aLink.innerHTML='启用用户';
					        
					        $.ajax({
								dataType:'json',
								type:'post',
								url:'<%=request.getContextPath()%>/user/user!modifyUserStatus.action?user.id='+<s:property value="user.id"/>+'&user.enabled='+2,
									success:function(result){
										if(result.code==200){
											document.getElementById("userStatusId").value=2;
									        $("#userStatusSpanId").removeClass("lv");
									        $("#userStatusSpanId").addClass("red");
									        document.getElementById("userStatusSpanId").innerHTML="（已禁用）";
										}else{
											 art.dialog({lock: true,content: '操作失败:'+result.message,yesFn: true});
										}
									},
									error:function (XMLHttpRequest, textStatus) {
										  art.dialog({lock: true,content: '操作失败:'+textStatus,yesFn: true});
										}
									});
					    },
					    noFn: true //为true等价于function(){}
			  		});
				}else{
					art.dialog({icon: 'confirm',content: '您确定要启用当前用户吗？',
					    yesFn: function(){
					        //return false; //如果返回false将阻止关闭
					          aLink.innerHTML='禁用用户';
					         $.ajax({
								dataType:'json',
								type:'post',
								url:'<%=request.getContextPath()%>/user/user!modifyUserStatus.action?user.id='+<s:property value="user.id"/>+'&user.enabled='+1,
									success:function(result){
										if(result.code==200){
											document.getElementById("userStatusId").value=1;
									        $("#userStatusSpanId").removeClass("red");
									        $("#userStatusSpanId").addClass("lv");
									        document.getElementById("userStatusSpanId").innerHTML="（已启用）";
										}else{
											 art.dialog({lock: true,content: '操作失败:'+result.message,yesFn: true});
										}
									},
									error:function (XMLHttpRequest, textStatus) {
										  art.dialog({lock: true,content: '操作失败:'+textStatus,yesFn: true});
										}
									});
					    },
					    noFn: true //为true等价于function(){}
			  		});
				}
			}
			
		</script>
	</head>
	<body onload="init()">
		<%@include file="../common/new_topMenu.jsp"%>
		<div class="height2px"></div>
		<div class="main_w wai_border">
			<div class="main white_border">

				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="left" valign="top">
							<%@include file="../common/systemLeftOperatorItems.jsp"%>
						</td>
						<td width="100%" align="left" valign="top">
							<div class="works_search left_margin8px all_border no_bor_bott">
								<div class="work_ss_title white_border">
									<h1 class="mokuai_ss"></h1>
									<h2 class="works_ss_ge"></h2>
									<h3>
										<s:text name="common.product.currentlocation" />
										<s:text name="common.product.systemtitle" /> >> 用户管理 >> 详细信息
									</h3>
								</div>
								<div class="all_space"></div>
								<div class="workrep_content">
									<div class="gongzuoqu_footbg2 white_border">
										<div class="lingyong_sm">
											<h1>
												<div class="rep_biaoti">
													<img
														src="<%=request.getContextPath()%>/images/tongyi/er.jpg"
														width="59" height="59" />
												</div>
												<div class="dawem_bt">
													<dt>
														<img
															src="<%=request.getContextPath()%>/images/tongyi/er2.jpg"
															height="25" />
													</dt>

													<dt class="shuoming_tu">
														说明：查看用户详情，可对用户资料进行修改！
													</dt>
												</div>
											</h1>
										</div>
									</div>
								</div>
							</div>
							<div class="works_search left_margin8px all_border">
								<div class="works_ss_jieguo white_border">
									<div class="jiaose_gl_list">
										 <div class="user_info_tit">
							                  <h1>基本信息</h1>
							                  <h2></h2>
						                 </div>
										 <table width="100%" border="0" cellspacing="0" cellpadding="0">
										 	<tr>
							                    <td style="width:230px"><div class="user_info_tx"><img src="<%=request.getContextPath()%>/images/tongyi/6_r5_c2.jpg" width="196" height="224" /></div>
							                      <div class="user_info_tx2">
							                        <ul>
							                          <li class="user_info_cz1"><a href="<%=request.getContextPath()%>/user/user!preEdit.action?user.id=<s:property value="user.id"/>" title="">编辑用户</a></li>
							                          <li class="user_info_cz2"><a href="<%=request.getContextPath()%>/user/user!modifySignUserPsw.action?passWordVo.userId=<s:property value="user.id"/>" title="">修改密码</a></li>
							                        </ul>
							                        <ul>
							                          <li class="user_info_cz3"><input type="hidden" id="userStatusId" value="<s:property value="user.enabled"/>"><a href="javascript:void(0);" title="" onclick="changUserStatus(this);"><s:if test="user.enabled==1">禁止用户</s:if><s:else>启用用户</s:else></a></li>
							                          <li class="user_info_cz4"><a href="javascript:void(0);" title="" onclick="re_pass()">重置密码</a></li>
							                          <li></li>
							                        </ul>
							                      </div>
							                     </td>
								                 <td width="100%"><div style="text-align: center;" class="add_userinfo">
							                        <ul>
							                          <li>用 户 名：</li>
							                          <li><s:property value="user.name"/></li>
							                          <s:if test="user.enabled==1"> <li>&nbsp;&nbsp;<span id="userStatusSpanId" class="lv" style="font-size:12px">（已启用）</span></li></s:if>
							                          <s:else> <li>&nbsp;&nbsp;<span id="userStatusSpanId" class="red" style="font-size:12px">（已禁用）</span></li></s:else>
							                        </ul>
							                        <ul>
							                          <li>真实姓名：</li>
							                          <li><s:property value="user.realName"/></li>
							                        </ul>
							                        <ul>
							                          <li>工    号：</li>
							                          <li><s:property value="user.employeeNo"/></li>
							                        </ul>
							                        <ul>
							                          <li>上网账号：</li>
							                          <li><s:property value="user.internetAccount"/></li>
							                        </ul>
							                        <!-- 
							                        <ul>
							                          <li>工 作 组：</li>
							                          <li><s:property value="user.workGroup.workGroupName" /></li>
							                        </ul>
							                        <ul>
							                          <li>部    门：</li>
							                          <li><s:property value="user.depet.deptName" /></li>
							                        </ul>
							                        <ul>
							                          <li>角    色：</li>
							                          <li>
							                          	<s:iterator value="user.roles" status="roleStatus" var="role">
							                          		<s:if test="#roleStatus.index!=(user.roles.size()-1)">
							                          			<s:property value="roleName"/>,
							                          		</s:if>
							                          		<s:else>
							                          			<s:property value="roleName"/>
							                          		</s:else>
							                          	</s:iterator>
							                          </li>
							                        </ul>
							                         -->
							                        <ul>
							                          <li>创建时间：</li>
							                          <li>
							                          		<s:property value="user.createTimeStr" />
							                          </li>
							                        </ul>
							                        <!-- 
							                        <ul>
							                          <li>最后登入时间：</li>
							                          <li>
							                          	<s:property value="user.lastLoginTimeStr" />
							                          </li>
							                        </ul>
							                        <ul>
							                          <li>最后登入IP：</li>
							                          <li><s:property value="user.loginIP" /></li>
							                        </ul>
							                         -->
							                      </div>
							                     </td>
							                 </tr>
										 </table>						
									</div>
									 <div class="jiaose_gl_list" style="padding-top:0">
						                <div class="user_info_tit top">
						                  <h1>联系方式</h1>
						                  <h2></h2>
						                </div>
						                 <table width="100%" border="0" cellspacing="0" cellpadding="0">
							                <tr>
							                    <td style="width:230px"><div class="user_info_tx"><img src="<%=request.getContextPath()%>/images/tongyi/pr7_c2.jpg" width="196" height="224" /></div></td>
							                    <td width="100%"><div style="text-align: center;" class="add_userinfo">
							                        <ul>
							                          <li>电子邮件：</li>
							                          <li><s:property value="user.mail" /> </li>
							                        </ul>
							                        <ul>
							                          <li>手机号码：</li>
							                          <li><s:property value="user.mobile" /></li>
							                        </ul>
                        							<ul>
							                          <li>传真号码：</li>
							                          <li><s:property value="user.fax" /> </li>
							                        </ul>
							                        <ul>
							                          <li>固定电话：</li>
							                          <li><s:property value="user.office" /></li>
							                        </ul>
							                        <ul>
							                          <li>常 用MSN：</li>
							                          <li><s:property value="user.msn" /></li>
							                        </ul>
							                        <ul>
							                          <li>QQ 号 码：</li>
							                          <li><s:property value="user.qq" /></li>
							                        </ul>
							                        <ul>
							                          <li>国&nbsp;&nbsp;&nbsp;&nbsp;家：</li>
							                          <li><s:property value="user.country" /></li>
							                        </ul>
							                        <ul>
							                          <li>城&nbsp;&nbsp;&nbsp;&nbsp;市：</li>
							                          <li><s:property value="user.city" /></li>
							                        </ul>
							                        <ul>
							                          <li>所在地址：</li>
							                          <li><s:property value="user.address" /></li>
							                        </ul>
							                        <ul>
							                          <li>邮政编码：</li>
							                          <li><s:property value="user.zipCode" /></li>
							                        </ul>
							                      </div>
							                    </td>
							                 </tr>
							             </table>
						            </div>
						            <center>
						                <div class="hui_space top_margin8px tar_wid90b" style="border-color:#D4E1EF"></div>
						                <div class="bn_ceng">
						                  <div class="table_an tar_wid90b">
						                    <input type="button" name="" class="bn_css all_butt wen_center" value="返 回" onclick="window.history.back();">
						                  </div>
						                </div>
					              </center>
								</div>
							</div>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<%@include file="../common/bottom.jsp"%>
	</body>
</html>
