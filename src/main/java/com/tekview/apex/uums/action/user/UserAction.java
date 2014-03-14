/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : LoginAction.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.user;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import net.sf.json.JSONObject;

import org.apache.commons.lang.xwork.StringUtils;
import org.apache.struts2.convention.annotation.InterceptorRef;
import org.apache.struts2.convention.annotation.InterceptorRefs;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.tekview.apex.itsm.common.util.SysUtil;
import com.tekview.apex.platform.mail.Email;
import com.tekview.apex.platform.mail.EmailDispatcher;
import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.constants.CAConstants;
import com.tekview.apex.uums.core.web.action.BaseAction;
import com.tekview.apex.uums.model.Role;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserDept;
import com.tekview.apex.uums.model.UserMaintenanceGroup;
import com.tekview.apex.uums.service.RoleService;
import com.tekview.apex.uums.service.UserDeptService;
import com.tekview.apex.uums.service.UserService;
import com.tekview.apex.uums.service.WorkGroupService;

/**
 * 用户管理
 */
@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Namespace("/user")
//指定名称空间
@Results( {
	@Result(name = "list", location = "/WEB-INF/jsps/user/user-list.jsp"),
	@Result(name = "add", location = "/WEB-INF/jsps/user/user-add.jsp"),
	@Result(name = "edit", location = "/WEB-INF/jsps/user/user-edit.jsp"),
	@Result(name = "view", location = "/WEB-INF/jsps/user/user-view.jsp"),
	@Result(name = "json", location = "/WEB-INF/jsps/common/json.jsp"),
	@Result(name = "psw", location = "/WEB-INF/jsps/user/user-modify-password.jsp"),
	@Result(name = "notification", location = "/WEB-INF/jsps/user/user-notification.jsp"),
	@Result(name = "modifyResult", location = "/WEB-INF/jsps/user/user-modify-password-result.jsp") })
public class UserAction extends BaseAction {
	private static final long serialVersionUID = -9033124999598506792L;
	private User user = new User(); // 用于接收表单数据
	private List<UserDept> userDeptList = new ArrayList<UserDept>();
	private List<UserMaintenanceGroup> workGroupList = new ArrayList<UserMaintenanceGroup>();
	private List<Role> roleList = new ArrayList<Role>();
	private List<User> userList;
	private String jsonData; // json数据

	@Autowired
	private UserService userService;
	@Autowired
	private WorkGroupService workGroupService;
	@Autowired
	private UserDeptService userDeptService;
	@Autowired
	private RoleService roleService;
	@Autowired
	private EmailDispatcher emailDispatcher;

	// 以下为查询条件
	private String name; // 用户名
	private String realName; // 姓名
	private String mail; // 邮件
	private String depetName; // 部门标识
	private Long depetId; //部门标识
	private String workGroupName;// 工作组标识
	private Long workGroupId; //工作组标识
	private String ids; // 用户id集合
	private List<String> userNames=new ArrayList<String>(); //删除时的用户名称合集，方便拦截器使用
	private int enabledFlag; //enabledFlag 用户状态（1 ：启用；２ ：禁用；其他预留），方便拦截器使用

	private String roleNames[];

	/**
	 * 封装页面密码信息
	 */
	private PassWordVo passWordVo;

	// 用户列表
	public String list() throws Exception {
		// generatePagerParam(request,0);
		UserQuery userQuery = new UserQuery();
		if (StringUtils.isNotEmpty(name)) {
			userQuery.setName(name.trim());
		}
		if (StringUtils.isNotEmpty(realName)) {
			userQuery.setRealName(realName.trim());
		}
		if (StringUtils.isNotEmpty(mail)) {
			userQuery.setMail(mail.trim());
		}
		if (StringUtils.isNotEmpty(depetName)) {
			String deptName[]=depetName.split(",");
			userQuery.setDeptNames(Arrays.asList(deptName));
		}
		if (StringUtils.isNotEmpty(workGroupName)) {
			String groupName[]=workGroupName.split(",");
			userQuery.setWorkGroupNames(Arrays.asList(groupName));
		}
		userQuery.setStart(getOffset());
		userQuery.setLimit(getPageSize());
		userList = userService.getPagingUser(userQuery);
		records = userService.countUser(userQuery);
		return "list";
	}

	// 跳转到添加页面Action
	public String preAdd() throws Exception {
		//add by Kevin : 2011-04-19 用户基本信息，不需要加载以下属性
//		userDeptList = userDeptService.getAllUserDeptTree();
//		workGroupList = workGroupService.getAllWorkGroupTree();
//		roleList = roleService.getAllRoles();
		return "add";
	}

	// 添加用户
	public String add() throws Exception {
		if (user == null) {
			throw new OceanRuntimeException("请输入必填信息！");
		}
		//add by Kevin : 2011-04-19 用户关联信息去掉
//		if(roleNames==null||roleNames.toString().trim().equals(""))
//			throw new OceanRuntimeException("角色不能为空，请至少选择一个角色！");
		
		// 添加部门信息
//		if (depetId == null || depetId ==-1) {
//			user.setDepet(null);
//		} else {
//			UserDept userDept = userDeptService.getById(depetId);
//			if (userDept == null) {
//				throw new OceanRuntimeException("所选部门不存在或已被删除！");
//			}
//			user.setDepet(userDept);
//		}
		
//		if (workGroupId==null|| workGroupId == -1) {
//			user.setWorkGroup(null);
//		} else {
//			UserMaintenanceGroup workGroup = workGroupService.getById(workGroupId);
//			if (workGroup == null) {
//				throw new OceanRuntimeException("所选工作组不存在或已被删除！");
//			}
//			user.setWorkGroup(workGroup);
//		}
		
		user.setEnabled(1); // 启用
		user.setPassword(SysUtil.encodeBase64("11111111")); // 设置默认密码为8个1
		//加入创建时间
		user.setCreateTime(new Date().getTime());
		User dBUser = userService.getByName(user.getName());
		if(dBUser!=null){
			throw new OceanRuntimeException("系统中已经存在同名用户！");
		}
		if(StringUtils.isNotEmpty(user.getMail())){ //用户输入了邮件信息
			dBUser = userService.getByMail(user.getMail());
			if(dBUser!=null){
				throw new OceanRuntimeException("系统中已经存在使用该邮件地址的用户！");
			}
		}
		userService.save(user);
		//System.out.println(user.getId());
		dBUser = userService.getByName(user.getName());
		user=dBUser;
//		if (roleNames != null) {
//			// 添加角色信息
//			Set<Role> roles = new HashSet<Role>();
//			for (int i = 0; i < roleNames.length; i++) {
//				Role role=roleService.getUniqueEntityByOneProperty("roleName", roleNames[i].trim().toString());
//				if (!roles.contains(role)) {
//					roles.add(role);
//				}
//			}
//			//向数据库中添加角色信息
//			if (roles.size()>0&&roles!=null) {
//				dBUser.setRoles(roles);
//				userService.update(dBUser);
//			}
//		}
		workGroupName = null;
		depetName = null;
		emailDispatcher.dispatchMail(new Email(CAConstants.MAIL_PREFIX_ADD_USER,String.valueOf(user.getId())));
		return list();
	}

	// 查看用户信息
	public String view() throws Exception {
		if (user != null && user.getId() != 0) {
			user = userService.getUserWithRolesById(user.getId());
		}
		userDeptList = userDeptService.getByAll();
		workGroupList = workGroupService.getAllWorkGroups();
		return "view";
	}
	//创建用户后通知页面
	public String notification(){
		if (user != null && user.getId() != 0) {
			user = userService.getUserWithRolesById(user.getId());
		}else{
			throw new OceanRuntimeException("用户标识不合法!");
		}
		return "notification";
	}
	// 预先加载要修改的用户信息
	public String preEdit() {
		if (user != null && user.getId() != 0) {
			user = userService.getById(user.getId());
			//add by Kevin : 2011-04-19 用户基本信息修改，不需要加载角色，工作组和部门属性
//			user = userService.getUserWithRolesById(user.getId());
//			userDeptList = userDeptService.getAllUserDeptTree();
//			workGroupList = workGroupService.getAllWorkGroupTree();
		}
		return "edit";
	}

	// 修改用户信息
	public String edit() throws Exception {
		if (user != null && user.getId() != 0) {
			User dbUser = userService.getById(user.getId());
			if (dbUser != null) {
				// 更新用户资料

				// 更新基本信息
				//dbUser.setName(user.getName()); //用户名唯一，不允许修改
				dbUser.setRealName(user.getRealName());
				dbUser.setEmployeeNo(user.getEmployeeNo());
				dbUser.setInternetAccount(user.getInternetAccount());
				dbUser.setTaskNotifier(user.getTaskNotifier());
				// 更新部门
				if ( depetId == null || depetId==0L ) {
					dbUser.setDepet(null);
				} else {
					UserDept userDept = userDeptService.getById(depetId);
					if (userDept == null) {
						throw new OceanRuntimeException("所选部门不存在或已被删除！");
					}
					dbUser.setDepet(userDept);
				}
				// 更新工作组
				if (workGroupId == null || workGroupId==0L) {
					dbUser.setWorkGroup(null);
				} else {
					UserMaintenanceGroup workGroup = workGroupService.getById(workGroupId);
					if (workGroup == null) {
						throw new OceanRuntimeException("所选工作组不存在或已被删除！");
					}
					dbUser.setWorkGroup(workGroup);
				}
				//更新角色信息
				if (roleNames != null) {
					// 添加角色信息
					Set<Role> roles = new HashSet<Role>();
					for (int i = 0; i < roleNames.length; i++) {
						Role role=roleService.getUniqueEntityByOneProperty("roleName", roleNames[i].trim().toString());
						if (!roles.contains(role)) {
							roles.add(role);
						}
					}
					//向数据库中添加角色信息
					if (roles.size()>0&&roles!=null) {
						dbUser.setRoles(roles);
					}
				}
				// 更新联系方式
				if(StringUtils.isNotEmpty(user.getMail())){
					if(user.getMail().equals(dbUser.getMail().trim())){ //新邮件地址和库存中的不一致
						User tempUser=userService.getByMail(user.getMail().trim()); //查看新的邮件地址是否有用户使用
						if(tempUser!=null&& !dbUser.getName().equals(tempUser.getName())){
							throw new OceanRuntimeException("系统中已经存在使用该邮件地址的用户！");
						}
					}else{
						dbUser.setMail(user.getMail());
					}
				}else{
					dbUser.setMail(user.getMail());
				}
				dbUser.setMobile(user.getMobile());
				dbUser.setMsn(user.getMsn());
				dbUser.setFax(user.getFax());
				dbUser.setOffice(user.getOffice());
				dbUser.setQq(user.getQq());

				// 更新联系地址

				dbUser.setCountry(user.getCountry());
				dbUser.setCity(user.getCity());
				dbUser.setAddress(user.getAddress());
				dbUser.setZipCode(user.getZipCode());

				userService.update(dbUser);
			} else {
				throw new OceanRuntimeException("用户不存在或已被删除！");
			}

		} else {
			throw new OceanRuntimeException("用户不存在或已被删除");
		}
		return view();
	}

	/**
	 * 删除用户
	 * 
	 * @throws Exception
	 */
	public void deleteUsers() throws Exception {
		userNames.clear();//清空要删除的用户名称列表
		try {
			List<String> list = new ArrayList<String>();
			String[] idsArray = ids.split(",");
			for (String id : idsArray) {
				list.add(id.trim());
				User u=userService.getById(Long.valueOf(id.trim()));//获取要删除的用户信息
				if(u!=null){
					userNames.add(u.getName());//加入到要删除的用户名称集合中
				}
			}
			userService.deleteUsers(list);
		} catch (OceanRuntimeException e) {
			String msg = getText(e.getErrorCode());
			String name = e.getErrorParam();
			if (StringUtils.isNotEmpty(name)) {
				msg = msg.replace("{0}", name);
			}
			response.setContentType("text/plain");
			response.setStatus(500);
			response.getWriter().append(msg);
		}
	}

	/**
	 * 批量重置密码
	 * 
	 * @throws Exception
	 */
	public void batchModifyPSW() throws Exception {
		try {
			String[] idsArray = ids.split(",");
			List<String> list = Arrays.asList(idsArray);
			userService.batchModifyPSW(list);
		} catch (OceanRuntimeException e) {
			String msg = getText(e.getErrorCode());
			response.setContentType("text/plain");
			String name = e.getErrorParam();
			if (StringUtils.isNotEmpty(name)) {
				msg = msg.replace("{0}", name);
			}
			response.setStatus(500);
			response.getWriter().append(msg);
		}
	}

	/**
	 * 批量启用用户
	 * 
	 * @throws Exception
	 */
	public void batchEnableUser() throws Exception {
		enabledFlag=1;
		userNames.clear();//清空要启用的用户名称列表
		try {
			String[] idsArray = ids.split(",");
			for (String id : idsArray) {
				User u=userService.getById(Long.valueOf(id.trim()));//获取要启用的用户信息
				if(u!=null){
					userNames.add(u.getName());//加入到要启用的用户名称集合中
				}
			}
			List<String> list = Arrays.asList(idsArray);
			userService.enableUsers(list);
		} catch (OceanRuntimeException e) {
			String msg = getText(e.getErrorCode());
			String name = e.getErrorParam();
			if (StringUtils.isNotEmpty(name)) {
				msg = msg.replace("{0}", name);
			}
			response.setContentType("text/plain");
			response.setStatus(500);
			response.getWriter().append(msg);
		}
	}

	/**
	 * 批量禁用用户
	 * 
	 * @throws Exception
	 */
	public void batchDisableUser() throws Exception {
		enabledFlag=2;
		userNames.clear();//清空要的用户名称列表
		try {
			String[] idsArray = ids.split(",");
			for (String id : idsArray) {
				User u=userService.getById(Long.valueOf(id.trim()));//获取要禁用的用户信息
				if(u!=null){
					userNames.add(u.getName());//加入到要禁用的用户名称集合中
				}
			}
			List<String> list = Arrays.asList(idsArray);
			userService.disableUsers(list);
		} catch (OceanRuntimeException e) {
			String msg = getText(e.getErrorCode());
			String name = e.getErrorParam();
			if (StringUtils.isNotEmpty(name)) {
				msg = msg.replace("{0}", name);
			}
			response.setContentType("text/plain");
			response.setStatus(500);
			response.getWriter().append(msg);
		}
	}

	/**
	 * 修改用户密码
	 * 
	 * @return
	 * @throws Exception
	 */
	public String modifyUserPsw() throws Exception {
		if (passWordVo != null) {
			userService.modifyPassword(passWordVo.getUserId(), passWordVo
					.getOldPassWord(), passWordVo.getNewPassWord(), passWordVo
					.getNewPassWordConfirm());
		}

		return "modifyResult";
	}

	/**
	 * 进入修改密码界面
	 * 
	 * @return
	 * @throws Exception
	 */
	public void enterModifyUserPsw() throws Exception {
		String[] idsArray = ids.split(",");
		List<String> list = Arrays.asList(idsArray);
		for (String string : list) {
			passWordVo = new PassWordVo();
			passWordVo.setUserId(Long.valueOf(string.trim()));
		}
		request.getSession().setAttribute("passWordVo", passWordVo);
	}

	/**
	 * 进入修改单个密码界面
	 */
	public String modifySignUserPsw() throws Exception {
		request.getSession().setAttribute("passWordVo", passWordVo);
		return "psw";
	}
	
	public String enterUrl() throws Exception {
		passWordVo = (PassWordVo) request.getSession().getAttribute(
				"passWordVo");
		return "psw";
	}
	
	//修改用户状态
	public String modifyUserStatus(){
		JSONObject jo = new JSONObject();
		if(user!=null && user.getEnabled()!=0 && user.getId()!=0L){
			User dbUser=userService.getById(user.getId());
			if(dbUser!=null){
				dbUser.setEnabled(user.getEnabled());
				userService.update(dbUser);
				jo.put("code", 200);
				jo.put("result", "修改用户状态成功!");
			}else{
				jo.put("code", 201);
				jo.put("message", "数据库中无该用户信息!");
			}
		}else{
			jo.put("code", 201);
			jo.put("message", "获取不到要修改的用户信息参数!");
		}
		jsonData=jo.toString();
		return "json";
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getDepetName() {
		return depetName;
	}

	public void setDepetName(String depetName) {
		this.depetName = depetName;
	}

	public String getWorkGroupName() {
		return workGroupName;
	}

	public void setWorkGroupName(String workGroupName) {
		this.workGroupName = workGroupName;
	}

	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}

	public PassWordVo getPassWordVo() {
		return passWordVo;
	}

	public void setPassWordVo(PassWordVo passWordVo) {
		this.passWordVo = passWordVo;
	}

	public List<UserDept> getUserDeptList() {
		return userDeptList;
	}

	public void setUserDeptList(List<UserDept> userDeptList) {
		this.userDeptList = userDeptList;
	}

	public List<UserMaintenanceGroup> getWorkGroupList() {
		return workGroupList;
	}

	public void setWorkGroupList(List<UserMaintenanceGroup> workGroupList) {
		this.workGroupList = workGroupList;
	}

	public List<Role> getRoleList() {
		return roleList;
	}

	public void setRoleList(List<Role> roleList) {
		this.roleList = roleList;
	}

	public String[] getRoleNames() {
		return roleNames;
	}

	public void setRoleNames(String[] roleNames) {
		this.roleNames = roleNames;
	}

	public List<User> getUserList() {
		return userList;
	}

	public void setUserList(List<User> userList) {
		this.userList = userList;
	}

	public Long getWorkGroupId() {
		return workGroupId;
	}

	public void setWorkGroupId(Long workGroupId) {
		this.workGroupId = workGroupId;
	}

	public Long getDepetId() {
		return depetId;
	}

	public void setDepetId(Long depetId) {
		this.depetId = depetId;
	}

	public String getJsonData() {
		return jsonData;
	}

	public void setJsonData(String jsonData) {
		this.jsonData = jsonData;
	}

	@Override
	public Map<String, List<String>> getErrors() {
		System.out.println();
		return super.getErrors();
	}

	@Override
	public Map<String, List<String>> getFieldErrors() {
		System.out.println();
		return super.getFieldErrors();
	}

	public List<String> getUserNames() {
		return userNames;
	}

	public void setUserNames(List<String> userNames) {
		this.userNames = userNames;
	}

	public int getEnabledFlag() {
		return enabledFlag;
	}

	public void setEnabledFlag(int enabledFlag) {
		this.enabledFlag = enabledFlag;
	}
	
}