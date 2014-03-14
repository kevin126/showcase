<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib prefix="uums" uri="/WEB-INF/tlds/mypage.tld" %>
<%@ taglib prefix="s" uri="/struts-tags" %>
<html xmlns="http://www.w3.org/1999/xhtml">
	<%@include file="../common/commonHeader.jsp"%>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>用户查询</title>
		<link href="<%=request.getContextPath()%>/css/global.css" rel="stylesheet" type="text/css" />
		<link href="<%=request.getContextPath()%>/css/chang_c.css" rel="stylesheet" type="text/css" />
		<%@include file="../common/commonJs.jsp"%>
		<base target="_self" />
		<script type='text/javascript' src='<%=request.getContextPath()%>/dwr/interface/SecurityService.js'></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/security/rolemanage/AllRoleDlg.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/security/workGroupManage/MultipleSelectWorkGroup.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/security/deptmanage/AllDepartmentDlg.js"></script>
		<script src="<%=request.getContextPath()%>/js/jquery/jquery_last.js" type="text/javascript"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/security/rolemanage/QueryUserByRole.js"></script>
		<script type="text/javascript" src="<%=request.getContextPath()%>/js/apex/setting/security/deptmanage/MultipleSelectDept.js"></script>
				<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/artDialog/artDialog.min.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/js/artDialog/skin.js"></script>
		<script language="javascript" type="text/javascript">
		String.prototype.replaceAll  = function(s1,s2){   
			return this.replace(new RegExp(s1,"gm"),s2);   
		} 
		function getAllWorkGroup(){
		var win = new MultipleSelectWorkGroup("queryuserworkgroup");
					win.show();
		}
		function getAllRoles(){
		var win = new QueryUserByRole("queryuserroleid");
						win.show();
		}
		function getAllDept(){
		var win= new MultipleSelectDept("queryuserdept");
						win.show();
		}
		function resetQueryValues(){
		document.getElementById("name").value="";
		document.getElementById("realName").value="";
		//document.getElementById("mail").value="";
		document.getElementById("employeeNo").value="",
		document.getElementById("internetAccount").value="";
		//document.getElementById("queryuserroleid").value="";
		//document.getElementById("queryuserdept").value="";
		document.getElementById("queryuserworkgroup").value="";
		document.getElementById("office").value="";
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
		   	for(var i=1;i<checkboxs.length;i++) {
		   		checkboxs[i].checked = obj.checked;
		  }
		}
		function returnValue(){	
	
			var allRows = new Array();
			var tb = document.getElementById('recordTabelId'); 
			//循环看是否有选择的用户，没有就直接提示
			var isSelect=false;
			for(var i=1;i<tb.rows.length;i++) {
			     var checkbox = tb.rows[i].cells[1].getElementsByTagName("INPUT")[0];
			     if(checkbox.checked==true){
			     isSelect=true;
			     break;
			     }
			     }
			if(!isSelect){
				  Ext.Msg.show({
						title : '提示',
						msg : '请选择要添加的用户！',
						modal : true,
						buttons : Ext.Msg.OK,
						icon : Ext.Msg.INFO
				});	
				return;
			}
			for(var i=1;i<tb.rows.length;i++) {
			
			     var checkbox = tb.rows[i].cells[1].getElementsByTagName("INPUT")[0];
			     if(checkbox.checked==true){
			     	var row=new Array();
				    for(var j=2;j<tb.rows[i].cells.length;j++){
					    var value = tb.rows[i].cells[j].innerHTML;
					    	
					    if(j==2){
					     row.push({"name":value.trim().replaceAll('&nbsp;','')});
					     continue;
					    }else  if(j==3){
					    row.push({"realName":value.trim().replaceAll('&nbsp;','')});
					     continue;
					    }else  if(j==4){
					    row.push({"employeeNo":value.trim().replaceAll('&nbsp;','')});
					     continue;
					    }else  if(j==5){
					    row.push({"depet":value.trim().replaceAll('&nbsp;','')});
					     continue;
					    }else  if(j==6){
					    row.push({"workGroup":value.trim().replaceAll('&nbsp;','')});
					     continue;
					    }else  if(j==7){
					    row.push({"internetAccount":value.trim().replaceAll('&nbsp;','')});
					     continue;
					    }else  if(j==8){
					    row.push({"mail":value.trim().replaceAll('&nbsp;','')});
					     continue;
					    }else  if(j==9){
					    var chanageValue = tb.rows[i].cells[7].innerHTML;
					    row.push({"office":chanageValue.trim().replaceAll('&nbsp;','')});
					     continue;
					    }else  if(j==10){
					    row.push({"id":value.trim()});
					     continue;
					    }else if(j==11){
					    	row.push({"taskNotifier" : value.trim().replaceAll('&nbsp;','')});
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
	<body style="background: none;">
		<form action="<%=request.getContextPath()%>/common/query-user.action" id="queryUser">
			<input type="hidden" id="excludeRoleId" name="excludeRoleId" value="<s:property value="excludeRoleId"/>"/>
			<input type="hidden" name="status" value="submit"/>
			<input type="hidden" id="selectOne" name="selectOne" value="<s:property value="selectOne"/>"/>
			<input type="hidden" id="start" name="start" value="0"/>
			<input type="hidden" id="pageNo" name="pageNo" value="1"/>
			<input type="hidden" id="pageSize" name="pageSize" value="10"/>
			<div class="pop_tiaojian">
				<ul>
				    <li class="pop_biaot">用户名：</li><li><input type="text" id="name" name="name" size="26" maxlength="20" class="all_input" value="<s:property value="name"/>"></li>
				    <li class="pop_biaot">姓名：</li><li><input type="text" name="realName" id="realName" size="26" maxlength="20" class="all_input" value="<s:property value="realName"/>"></li>
				    <li class="pop_biaot">工号：</li><li><input type="text" name="employeeNo" id="employeeNo" size="26" maxlength="20" class="all_input" value="<s:property value="employeeNo"/>"></li>
				 </ul>
				 <ul>
				    <li class="pop_biaot">上网账号：</li><li><input type="text" name="internetAccount" id="internetAccount" size="26" maxlength="20" class="all_input" value="<s:property value="internetAccount"/>"></li>
				    <li class="pop_biaot">工作组：</li><li><input type="text" name="workGroupName" id="queryuserworkgroup" readonly="true" onclick="getAllWorkGroup()" size="26" value="<s:property value="workGroupName"/>" class="all_input"/></li>
				    <li class="pop_biaot">电话号码：</li><li><input type="text" maxlength="50" size="26" name="office" id="office" value="<s:property value="office"/>" class="all_input" /></li>
				 </ul>
				 <div class="space"></div>
				<div class="pop_ss_bn">
					<input name="" type="submit" class="all_butt pop_cha" value="查 询" />
					<input name="" type="button" class="all_butt pop_qu" value="取 消" onclick="resetQueryValues();" />
				</div>
			</div>
			<div class=" white_space"></div>
			<div class=" hui_space"></div>
			<div class=" white_space"></div>
			<div class="pop_tiaojian">
  				<div class="pop_liebiao_ku xbiao_border">
  					<s:if test="userList!=null && userList.size()>0">
	  					<table width="100%" border="0" cellspacing="0" cellpadding="0" id="recordTabelId">
	  						<tr class="xbiao_th">
		     				<!-- 序号 -->
								<th width="40px" ><div class="xbiao_th_w">序号</div></th>
								<s:if test="selectOne==2">
									<th>
										<input type="checkbox" onclick="selectAllRecords(this,'checkbox');" name="checkbox" id="checkbox" />
									</th>
								</s:if>
								<s:else>
									<th>&nbsp;&nbsp;&nbsp;&nbsp;</th>
								</s:else>
								<th ><div class="xbiao_th_w">用户名</div></th>
								<th ><div class="xbiao_th_w">姓名</div></th>
								<th ><div class="xbiao_th_w">工号</div></th>
								<th width="100px"><div class="xbiao_th_w">部门</div></th>
								<th width="100px"><div class="xbiao_th_w">工作组</div></th>
								<th><div class="xbiao_th_w">电话号码</div></th>
			
								<th width="100px"><div class="xbiao_th_w">上网账号</div></th>
								<th><div class="xbiao_th_w">电子邮件</div></th>
								<th><div class="xbiao_th_w" style="display: none" >id</div></th>
								<!-- 隐藏列：用户描述 -->
								<th><div class="xbiao_th_w" style="display: none" >desc</div></th>
							</tr>
							<s:iterator value="userList" status="userStatus">
								<s:if test="#userStatus.index%2==0">
									<tr class="tbody_tr1" onmouseover="this.className='tbody_tr_on'" onmouseout="this.className='tbody_tr1'">
										<td class="lh_24" valign="top"><s:property value="#userStatus.index+1"/></td>
										<s:if test="selectOne==2">
											<td width="22" class="lh_24" valign="top">
												<input type="checkbox" name="checkbox" id="checkbox2" />
											</td>
										</s:if>
										<s:else>
											<td width="22" class="lh_24" valign="top">
												<input type="radio" name="radio" id="radio" />
											</td>
										</s:else>
										<td><s:property value="name"/>&nbsp;</td>
										<td><s:property value="realName"/>&nbsp;</td>
										<td><s:property value="employeeNo"/>&nbsp;</td>
										<td><s:property value="depet.deptName"/>&nbsp;</td>
										<td><s:property value="workGroup.workGroupName"/>&nbsp;</td>
										<td><s:property value="office"/>&nbsp;</td>
										<td><s:property value="internetAccount"/>&nbsp;</td>
										<td><s:property value="mail"/>&nbsp;</td>
										<td style="display: none" ><s:property value="id"/></td>
										<td style="display: none" ></td>
									</tr>
								</s:if>
								<s:else>
									<tr class="tbody_tr2" onmouseover="this.className='tbody_tr_on'" onmouseout="this.className='tbody_tr2'">
										<td class="lh_24" valign="top"><s:property value="#userStatus.index+1"/></td>
										<s:if test="selectOne==2">
											<td width="22" class="lh_24" valign="top">
												<input type="checkbox" name="checkbox" id="checkbox2" />
											</td>
										</s:if>
										<s:else>
											<td width="22" class="lh_24" valign="top">
												<input type="radio" name="radio" id="radio" />
											</td>
										</s:else>
										<td><s:property value="name"/>&nbsp;</td>
										<td><s:property value="realName"/>&nbsp;</td>
										<td><s:property value="employeeNo"/>&nbsp;</td>
										<td><s:property value="depet.deptName"/>&nbsp;</td>
										<td><s:property value="workGroup.workGroupName"/>&nbsp;</td>
										<td><s:property value="office"/>&nbsp;</td>
										<td><s:property value="internetAccount"/>&nbsp;</td>
										<td><s:property value="mail"/>&nbsp;</td>
										<td style="display: none" ><s:property value="id"/></td>
										<td style="display: none" ></td>
									</tr>
								</s:else>
							</s:iterator>
	  					</table>
	  					 <div class="fenye_css">
							<div class="fenye_coun">
								<uums:page currentPage="${currentPage}" pageSize="${pageSize}" records="${records}" url="/uums/common/query-user.action"/>
							</div>
						</div>
					</s:if>
					<s:else>
						<table width="100%" border="0" cellspacing="0" cellpadding="0" id="recordTabelId">
	  						<tr class="xbiao_th">
	  							<td><center><h5>无查询记录!</h5></center></td>
	  						</tr>
	  					</table>
					</s:else>
  					<div class="space"></div>
			        <div class="pop_ceng">
			        	<input name="" type="button" onclick="returnValue();" class="gx_w_bn all_butt" value="确 定" />
			            <input name="" type="button" class="gx_w_bn all_butt" onclick="closeWindow();" value="取 消" />
			        </div>
  				</div>
  			</div>
		</form>
	</body>
</html>