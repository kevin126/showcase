<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<html xmlns="http://www.w3.org/1999/xhtml">
	<%@include file="../common/commonHeader.jsp"%>
	<head>
		<title><s:text name="common.product.title" />
		</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link href="<%=request.getContextPath()%>/css/global.css"
			rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/new_main.css"
			rel="stylesheet" type="text/css" />
		<%@include file="../common/commonJs.jsp"%>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/jQuery1.4.2.js"></script>
		<link type="text/css" rel="stylesheet"
			href="<%=request.getContextPath()%>/js/jquery/style/validator.css"></link>
		<script src="<%=request.getContextPath()%>/js/jquery/jquery_last.js"
			type="text/javascript"></script>
		<script src="<%=request.getContextPath()%>/js/jquery/formValidator.js"
			type="text/javascript" charset="UTF-8"></script>
		<script
			src="<%=request.getContextPath()%>/js/jquery/formValidatorRegex.js"
			type="text/javascript" charset="UTF-8"></script>
		<script
			src="<%=request.getContextPath()%>/js/jquery/validator/validateUser.js"
			type="text/javascript" charset="UTF-8"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/artDialog/artDialog.min.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/artDialog/skin.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/apex/setting/setting.js"></script>
		<script language="javascript">
			function changejs(){art.dialog.open('/uums/common/select-role.action', {lock:true,limit:false,title:'<b>请选择角色</b>',width:'901px',height:'640px'});}
			//移除选中项
			function removeOption(value){
				$("#roleNames option:selected").remove();
			}
			function formCheck(){
				$("#roleNames option[value*=]").attr("selected", true);
				return true;
			}
			//选择用户管理菜单时高亮显示
			function init() {
				$("li").removeClass("on_this");
				$("#userMgt").addClass("on_this");
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
						<td align="left" valign="top"><%@include
								file="../common/systemLeftOperatorItems.jsp"%></td>
						<td width="100%" align="left" valign="top">
							<div class="works_search left_margin8px all_border no_bor_bott">
								<div class="work_ss_title white_border white_border_gai">
									<h1 class="mokuai_ss"></h1>
									<h2 class="works_ss_ge"></h2>

									<h3>
										<s:text name="common.product.currentlocation" />
										<s:text name="common.product.systemtitle" />
										>> 用户管理 >> 添加用户
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
															src="<%=request.getContextPath()%>/images/tongyi/ewr2.jpg"
															height="25" />
													</dt>
													<dt class="shuoming_tu">
														说明：添加新用户！
													</dt>
												</div>
											</h1>
										</div>
									</div>

								</div>
							</div>
							<form action="<%=request.getContextPath()%>/user/user!add.action" method="post" id="adduser" onsubmit="return formCheck();">
							<div class="works_search left_margin8px all_border">
								<div class="works_ss_tiaojian">
									<div class="gd_t2">
										<div class="liuc2_tit bott_xub">
											<strong>用户基本资料</strong>
										</div>
									</div>
									<div class="add_work_od" style="text-align: center">
										<ul>
											<li class="add_s_biaot">
												用户名：
											</li>
											<li>
												<input name="user.name" type="text" class="all_input" size="28" id="username"/>

											</li>
											<li>
												<strong>*&nbsp;必填</strong>&nbsp;请输入用户登入时的账户名！
											</li>
											<li>
												<div id="usernameTip" style="width:auto;float:left"></div>
											</li>
										</ul>
										<ul>
											<li class="add_s_biaot">
												真实姓名：
											</li>
											<li>
												<input name="user.realName" type="text" class="all_input" size="28"
													id="userrealName" />
												&nbsp;
											</li>
											<li>
												<strong>*&nbsp;必填</strong>&nbsp;请输入用户的真实姓名！
											</li>
											<li>
												<div id="userrealNameTip"></div>
											</li>
										</ul>
										<ul>
											<li class="add_s_biaot">
												工号：
											</li>
											<li>
												<input name="user.employeeNo" type="text" class="all_input" size="28" id="useremployeeNo" />
												&nbsp;
											</li>
											<li>
												<i>*</i>&nbsp;选填，请填写用户的工号，长度为0-30个字符！
											</li>
											<li>
												<div id="useremployeeNoTip"></div>
											</li>
										</ul>
										<ul>

											<li class="add_s_biaot">
												上网账号：
											</li>
											<li>
												<input name="user.internetAccount" type="text" class="all_input"
													style="width: 355px" id="internetAccount" />
												&nbsp;
											</li>
											<li>
												<i>*</i>&nbsp;选填，请输入用户的上网账号！
											</li>
											<li>
												<div id="internetAccountTip"></div>
											</li>

										</ul>
										<!-- 
										<ul>
											<li class="add_s_biaot">
												所在的工作组：
											</li>
											<li>
												<select name="workGroupId" id="selectWorkGroup"  class="inp_wid360" style="font-family:Tahoma, Geneva, sans-serif">
																			<option value="-1">
																				--请选择--
																			</option>
																			<s:iterator value="workGroupList" var="workGroup">
																				<option value='<s:property value="id" />'>
																					<s:property value="workGroupName" />
																				</option>
																			</s:iterator>
																		</select>

												&nbsp;
											</li>
											<li>
												<div id="selectWorkGroupTip"></div>
											</li>
											<li>
												<i>*</i>请选择用户所在的工作组！
											</li>
										</ul>
										<ul>
											<li class="add_s_biaot">
												所在的部门：
											</li>
											<li>
												<select name="depetId"	id="selectuserdept"  class="inp_wid360" class="inp_wid360" style="font-family:Tahoma, Geneva, sans-serif">
																			<option value="-1">
																				--请选择--
																			</option>
																			<s:iterator value="userDeptList" var="userDept">
																				<option value='<s:property value="id" />'>
																					<s:property value="deptName" />
																				</option>
																			</s:iterator>
																		</select>
											</li>
											
											<li>
												<div id="selectuserdeptTip"></div>
											</li>
											<li>
												<i>*</i>请选择用户所在的部门！
											</li>
										</ul>
										 -->
										 <!-- 
										<ul>
											<li class="add_s_biaot">
												设定角色：
											</li>
											<li>
											 -->
											<!-- 
												<textarea name="roleNames" cols="90" rows="5"
													id="roleNames" class=" all_textarea "></textarea>
											-->
											<!-- 
											<select id="roleNames" name="roleNames" class="inp_wid360" multiple="multiple" style="height:auto" ondblclick= "removeOption(this.value)">
						                    </select>
												&nbsp;
											</li>
											<li>
												<input type="button" value="选择角色"
													class="chaxunall_bn all_butt" name="" onclick="changejs();" />
													<div id="roleNamesTip"></div>
											</li>

										</ul>
										 -->
										<ul>
											<li class="add_s_biaot">
												用户描述：
											</li>
											<li>
												<textarea name="user.taskNotifier" cols="90" rows="5"
													id="usertaskNotifier" class=" all_textarea "></textarea>
												&nbsp;
											</li>
											<li>
												<div id="usertaskNotifierTip"></div>
											</li>
										</ul>

									</div>


									<div class="gd_t2">
										<div class="liuc2_tit bott_xub">
											<strong>联系方式</strong>
										</div>
									</div>

									<div class="add_work_od" style="text-align: center">
										<ul>
											<li class="add_s_biaot">
												电子邮件：
											</li>
											<li>
												<input name="user.mail" type="text" class="all_input inp_wid360"
													size="22" id="usermail"/>&nbsp;
											</li>
											<li>
												 <strong>*&nbsp;必填</strong>&nbsp;请填写用户电子邮件，例如：abc@hotmail.com!
											</li>
											<li>
												<div id="usermailTip"></div>
											</li>
										</ul>
										<ul>
											<li class="add_s_biaot">
												手机号码：
											</li>
											<li>
												<input name="user.mobile" type="text" class="all_input inp_wid360"
													size="22" id="usermobile"/>
												&nbsp;
											</li>
											<li>
												<strong>*&nbsp;必填</strong>&nbsp;请填写用户手机号码，仅支持数字！
											</li>
											<li>
												<div id="usermobileTip" style="float:left;margin-top:0;*margin-top:4px;*line-height:26px"></div>
											</li>
										</ul>
										<ul>
											<li class="add_s_biaot">
												传真：
											</li>
											<li>
												<input name="user.fax" type="text" class="all_input inp_wid360"
													size="22" id="userfax"/>
												&nbsp;
											</li>
											<li>
												<i>*</i>&nbsp;选填，请填写用户传真号码，仅支持数字！
											</li>
											<li>
												<div id="userfaxTip" style="float:left;margin-top:0;*margin-top:4px;*line-height:26px"></div>
											</li>
										</ul>

										<ul>
											<li class="add_s_biaot">
												固话：
											</li>
											<li>
												<input name="user.office" type="text" class="all_input inp_wid360"
													size="22" id="useroffice"/>
												&nbsp;
											</li>
											<li>
												<i>*</i>&nbsp;选填，请填写用户的固定电话号码，仅支持数字！
											</li>
											<li>
												<div id="userofficeTip" style="float:left;margin-top:0;*margin-top:4px;*line-height:26px"></div>
											</li>
										</ul>
										<ul>
											<li class="add_s_biaot">
												MSN：
											</li>
											<li>
												<input name="user.msn" type="text" class="all_input inp_wid360"
													size="22" id="usermsn"/>
												&nbsp;
											</li>
											<li>
												<i>*</i>&nbsp;选填，请填写用户的MSN账户，例如：abc@hotmail.com！
											</li>
											<li>
												<div id="usermsnTip" style="float:left;margin-top:0;*margin-top:4px;*line-height:26px"></div>
											</li>

										</ul>
										
										<ul>
											<li class="add_s_biaot">
												QQ：
											</li>
											<li>
												<input name="user.qq" type="text" class="all_input inp_wid360"
													size="22" id="qq"/>
												&nbsp;
											</li>
											<li>
												<i>*</i>&nbsp;选填，请填写用户的QQ账户！
											</li>
											<li>
												<div id="qqTip" style="float:left;margin-top:0;*margin-top:4px;*line-height:26px"></div>
											</li>

										</ul>

									</div>


									<div class="gd_t2">
										<div class="liuc2_tit bott_xub">
											<strong>地址信息</strong>
										</div>
									</div>
									<div class="add_work_od" style="text-align: center">
										<ul>
											<li class="add_s_biaot">
												国家：
											</li>
											<li>
												<input name="user.country" type="text" class="all_input inp_wid360"
													size="22" id="usercountry"/>&nbsp;
											</li>
											<li>
												<i>*</i>&nbsp;选填，请填写用户所在的国家！
											</li>
											<li>
												<div id="usercountryTip" style="float:left;margin-top:0;*margin-top:4px;*line-height:26px"></div>
											</li>

										</ul>
										<ul>
											<li class="add_s_biaot">
												所在城市：
											</li>
											<li>
												<input name="user.city" type="text" class="all_input inp_wid360"
													size="22" id="usercity" />
												&nbsp;
											</li>
											<li>
												<i>*</i>&nbsp;选填，请填写用户所在的城市！
											</li>
											<li>
												<div id="usercityTip" style="float:left;margin-top:0;*margin-top:4px;*line-height:26px"></div>
											</li>
										</ul>
										<ul>
											<li class="add_s_biaot">
												地址：
											</li>
											<li>
												<input name="user.address" type="text" class="all_input inp_wid360"
													size="22" id="useraddress"/>
												&nbsp;
											</li>
											<li>
												<i>*</i>&nbsp;选填，请填写用户所在的地址！
											</li>
											<li>
												<div id="useraddressTip" style="float:left;margin-top:0;*margin-top:4px;*line-height:26px"></div>
											</li>
										</ul>
										<ul>
											<li class="add_s_biaot">
												邮编：
											</li>
											<li>
												<input name="user.zipCode" type="text" class="all_input inp_wid360"
													size="22" id="userzipcode"/>
												&nbsp;
											</li>
											
											<li>
												<i>*</i>&nbsp;选填，请填当地的邮政编码！
											</li>
											<li>
												<div id="userzipcodeTip" style="float:left;margin-top:0;*margin-top:4px;*line-height:26px"></div>
											</li>
										</ul>


									</div>

									<div class="bn_ceng">
										<div class="table_an tar_wid90b">
											<input name="" type="submit" class="gx_w_bn all_butt"
												value="确 定" id="addusersubmitButton"/>
											<input name="" type="button" class="gx_w_bn all_butt"
												value="取 消" onclick="window.history.back();" />
										</div>
									</div>
								</div>

							</div>
							</form>
						</td>
					</tr>

				</table>
			</div>
		</div>
		<%@include file="../common/bottom.jsp"%>
	</body>
</html>
