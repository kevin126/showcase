/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 27, 2011
 * File Name       : RoleAction.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.role;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.xwork.StringUtils;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.core.web.action.BaseAction;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.model.Role;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.service.PermissionService;
import com.tekview.apex.uums.service.RoleService;

/**
 * 角色管理
 */
/**
 * 权限管理Action
 */
@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Namespace("/role")
// 指定名称空间
@Results( {
		@Result(name = "list", location = "/WEB-INF/jsps/role/role-list.jsp"),
		@Result(name = "add", location = "/WEB-INF/jsps/role/add-role.jsp"),
		@Result(name = "roleMembers", location = "/WEB-INF/jsps/role/role-member-list.jsp"),
		@Result(name = "json", location = "/WEB-INF/jsps/common/json.jsp") })
public class RoleAction extends BaseAction {
	private static final long serialVersionUID = 1L;
	@Autowired
	private RoleService roleService;
	@Autowired
	private PermissionService permissionService;
	private PageList<Role> roleList;
	private Role role = new Role();
	private String permissionActionIdsOne[];
	private String permissionActionIdsTwo[];
	// 系统中的所有权限
	private List<Permission> permissionList = new ArrayList<Permission>();
	// 角色拥有的权限
	private Set<Permission> rolePermissionList = new HashSet<Permission>();
	private String appName = ""; // 选择权限时的应用名称
	private Long roleId; // 角色标识
	private String jsonData; // json数据
	PageList<User> userList; // 用户列表
	private String memberId; // 删除角色中的用户时存储用户标识，逗号分割

	private List<RoleAppVo> nmRoleList = new ArrayList<RoleAppVo>(); // NM应用角色信息
	private List<RoleAppVo> ossRoleList = new ArrayList<RoleAppVo>(); // OSS应用角色信息

	private int nmRecords; // NM角色数量
	private int ossRecords; // OSS角色数量
	

	// 角色列表
	public String list() {
//		List<Object> nmList = roleService.getRolesByAppName("nm", getOffset(),
//				getPageSize());
//		nmRecords = roleService
//				.countEntitiesByPropNames(new Object[] { "'nm'" }) + 1; // 查询出来的角色中不包括系统管理员, 所以要+1
//		if (nmList.size() > 0 && nmList != null) {
//			for (Object object : nmList) {
//				Object[] objects = (Object[]) object;
//				if (objects.length > 0 && objects != null) {
//					RoleAppVo roleAppVo = new RoleAppVo();
//					roleAppVo.setId(((BigInteger) objects[0]).longValue());
//					roleAppVo.setRoleName((String) objects[1]);
//					roleAppVo.setRoleDescription((String) objects[2]);
//					roleAppVo.setCount(((BigInteger) objects[3]).intValue());
//					nmRoleList.add(roleAppVo);
//				}
//			}
//		}
//		List<Object> ossList = roleService.getRolesByAppName("oss",
//				getOffset(), getPageSize());
//		ossRecords = roleService
//				.countEntitiesByPropNames(new Object[] { "'oss'" }) + 1; // 查询出来的角色中不包括系统管理员
		// 所以要+1
//		if (ossList.size() > 0 && ossList != null) {
//			for (Object object : ossList) {
//				Object[] objects = (Object[]) object;
//				if (objects.length > 0 && objects != null) {
//					RoleAppVo roleAppVo = new RoleAppVo();
//					roleAppVo.setId(((BigInteger) objects[0]).longValue());
//					roleAppVo.setRoleName((String) objects[1]);
//					roleAppVo.setRoleDescription((String) objects[2]);
//					roleAppVo.setCount(((BigInteger) objects[3]).intValue());
//					ossRoleList.add(roleAppVo);
//				}
//			}
//		}
		return "list";
	}

	/**
	 * 进入添加角色页面
	 * 
	 * @return
	 */
	public String enterAddOrUpdateRole() {
		if (roleId == null) { // 进入添加角色界面
			permissionList = permissionService
					.queryAllPermissionByAppName(appName);
		} else { // 进入修改角色界面
			role = roleService.getById(roleId);
			if (role == null) {
				throw new OceanRuntimeException("角色不存在或已被删除！");
			}
			permissionList = permissionService
					.queryAllPermissionByAppName(appName);
		}
		return "add";
	}

	// 合并两个数组
	@SuppressWarnings("unchecked")
	private String[] getSumPermissionActionIds() {
		List<Object> list = new ArrayList<Object>();
		if ((permissionActionIdsOne == null || permissionActionIdsOne.length == 0)
				&& (permissionActionIdsTwo == null || permissionActionIdsTwo.length == 0))
			return null;
		if (permissionActionIdsOne != null && permissionActionIdsOne.length > 0)
			list.add(java.util.Arrays.asList(permissionActionIdsOne));
		if (permissionActionIdsTwo != null && permissionActionIdsTwo.length > 0)
			list.add(java.util.Arrays.asList(permissionActionIdsTwo));
		List<String> permissionActionIds = new ArrayList<String>();
		for (int i = 0; i < list.size(); i++) {
			List<Object> objects = (List<Object>) list.get(i);
			for (int j = 0; j < objects.size(); j++) {
				permissionActionIds.add((String) objects.get(j));
			}
		}
		return permissionActionIds.toArray(new String[0]);
	}

	/**
	 * 判断是更新角色还是添加新角色
	 * @return
	 */
	public String addRoleOrUpdateRole() {
		if (roleId != null && roleId > 0) { // 更新角色
			updateRole();
		} else { // 添加新角色
			addRole();
		}
		return list();
	}

	// 添加角色
	public void addRole() {
		// 角色名称重复检查
		if (role != null) {
			List<Role> roles = roleService.getEntitiesByOneProperty("roleName",
					role.getRoleName().trim());
			if (roles != null && roles.size() > 0) {
				throw new OceanRuntimeException(role.getRoleName()
						+ "角色已经存在，请更改角色名称后在添加！");
			}
		} else {
			throw new OceanRuntimeException("请输入必填参数!");
		}
		role.setDeletable(true); // 允许删除
		if ( getSumPermissionActionIds() == null) {
			throw new OceanRuntimeException("请至少选择一项权限");
		}
		roleService.saveRoleWithPermissions(role, getSumPermissionActionIds());
	}

	// 加载角色信息
	public String loadRoleJson() {
		if (roleId != null && !roleId.equals("")) {
			if (roleId != 0L) {
				Role myRole = roleService.getById(roleId);
				Role simpleRole = new Role();
				simpleRole.setRoleName(myRole.getRoleName());
				simpleRole.setRoleDescription(myRole.getRoleDescription());
				simpleRole.setId(myRole.getId());
				JSONArray jsonArray = JSONArray.fromObject(simpleRole);
				jsonData = jsonArray.toString();
			}
		}
		return "json";
	}

	// 修改角色
	public void updateRole() {
		Role roleDb = roleService.getById(roleId);
		if (!roleDb.isDeletable()) {
			throw new OceanRuntimeException("系统角色不能编辑！");
		}
		if (roleDb == null) {
			throw new OceanRuntimeException("角色不存在或已被删除！");
		}
		if (role != null) {
			//判断角色名是否存在 先判断旧角色名是否与新角色名相同，相同则不进行判断
			if (!role.getRoleName().trim().equals(roleDb.getRoleName())) {
				List<Role> roles = roleService.getEntitiesByOneProperty("roleName",
						role.getRoleName().trim());
				if (roles != null && roles.size() > 0) {
					throw new OceanRuntimeException(role.getRoleName()
							+ "角色已经存在，请更换角色名称！");
				}
			}
		} else {
			throw new OceanRuntimeException("请输入必填信息!");
		}
		// 修改角色信息
		roleDb.setRoleName(role.getRoleName().trim());
		roleDb.setRoleDescription(role.getRoleDescription().trim());
		// 保存基本信息到数据库
		roleService.update(roleDb);
		if (getSumPermissionActionIds() == null) {
			throw new OceanRuntimeException("请至少选择一项权限！");
		}
		// 保存角色权限信息到数据库
		roleService.updateRoleWithPermissions(Long.toString(role.getId()),
				java.util.Arrays.asList(getSumPermissionActionIds()));
	}

	// 删除角色
	public void deleteRole() throws Exception{
		try {
			if (roleId!=null&&roleId>0) {
				Role roleDb=roleService.getById(roleId);
				if(roleDb==null)
					throw new OceanRuntimeException("角色不存在或已被删除！");
				if(!roleDb.isDeletable())
					throw new OceanRuntimeException("系统角色，不能删除！");
				roleService.delete(roleId);
			}
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

	// 查看角色内用户
	public String roleMembers() {
		if (roleId != null && roleId != 0) {
			role = roleService.getById(roleId);
			userList = roleService.queryUsersByPage(roleId, getOffset(),
					getPageSize());
			records = Long.valueOf(userList.getTotalCount()).intValue();
		}
		return "roleMembers";
	}

	// 删除角色内成员用户
	public String deleteRoleMember() {
		if (roleId == null || roleId.equals("") || roleId == 0L) {
			throw new OceanRuntimeException("要删除的角色标识不正确!");
		}
		String[] ids = memberId.split(",");
		List<Long> memberIds = new ArrayList<Long>();
		for (String id : ids) {
			memberIds.add(Long.valueOf(id));
		}
		// 移除角色下面多个用户
		roleService.removeRoleMembers(roleId, memberIds);
		return roleMembers();
	}

	// 向角色内添加成员用户
	public String addUerToRole() {
		if (roleId == null || roleId.equals("") || roleId == 0L) {
			throw new OceanRuntimeException("要添加成员的角色标识不正确!");
		}
		String[] ids = memberId.split(",");
		List<Long> memberIds = new ArrayList<Long>();
		for (String id : ids) {
			memberIds.add(Long.valueOf(id));
		}
		// 向角色中添中用户
		roleService.addUserToRole(roleId, memberIds);
		return roleMembers();
	}
	//返回指定应用下的角色记录总数
	public String queryRoleCountByAppNames(){
		JSONObject jo = new JSONObject();
		if(appName!=null && appName.length()>0){
			int count = roleService.countEntitiesByPropNames(new Object[] { "'"+appName+"'" }) + 1; // 查询出来的角色中不包括系统管理员, 所以要+1
			jo.put("code", 200);
			jo.put("result", count);
		}else{
			jo.put("code", 201);
			jo.put("message", "应用名称不能传空数据!");
		}
		jsonData=jo.toString();
		return "json";
	}
	//返回指定应用下的角色列表
	public String queryRoleByAppNames(){
		JSONObject jo = new JSONObject();
		if(appName!=null && appName.length()>0){
			List<Object> list = roleService.getRolesByAppName(appName, getOffset(),getPageSize());
			jo.put("code", 200);
			jo.put("result", list);
		}else{
			jo.put("code", 201);
			jo.put("message", "应用名称不能传空数据!");
		}
		jsonData=jo.toString();
		return "json";
	}
	
	public PageList<Role> getRoleList() {
		return roleList;
	}

	public void setRoleList(PageList<Role> roleList) {
		this.roleList = roleList;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public List<Permission> getPermissionList() {
		return permissionList;
	}

	public void setPermissionList(List<Permission> permissionList) {
		this.permissionList = permissionList;
	}

	public String getAppName() {
		return appName;
	}

	public void setAppName(String appName) {
		this.appName = appName;
	}

	public Set<Permission> getRolePermissionList() {
		return rolePermissionList;
	}

	public void setRolePermissionList(Set<Permission> rolePermissionList) {
		this.rolePermissionList = rolePermissionList;
	}

	public String getJsonData() {
		return jsonData;
	}

	public void setJsonData(String jsonData) {
		this.jsonData = jsonData;
	}

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public PageList<User> getUserList() {
		return userList;
	}

	public void setUserList(PageList<User> userList) {
		this.userList = userList;
	}

	public String getMemberId() {
		return memberId;
	}

	public void setMemberId(String memberId) {
		this.memberId = memberId;
	}

//	public List<RoleAppVo> getNmRoleList() {
//		return nmRoleList;
//	}
//
//	public void setNmRoleList(List<RoleAppVo> nmRoleList) {
//		this.nmRoleList = nmRoleList;
//	}

//	public List<RoleAppVo> getOssRoleList() {
//		return ossRoleList;
//	}
//
//	public void setOssRoleList(List<RoleAppVo> ossRoleList) {
//		this.ossRoleList = ossRoleList;
//	}

	public int getNmRecords() {
		return nmRecords;
	}

	public void setNmRecords(int nmRecords) {
		this.nmRecords = nmRecords;
	}

	public int getOssRecords() {
		return ossRecords;
	}

	public void setOssRecords(int ossRecords) {
		this.ossRecords = ossRecords;
	}

	public String[] getPermissionActionIdsOne() {
		return permissionActionIdsOne;
	}

	public void setPermissionActionIdsOne(String[] permissionActionIdsOne) {
		this.permissionActionIdsOne = permissionActionIdsOne;
	}

	public String[] getPermissionActionIdsTwo() {
		return permissionActionIdsTwo;
	}

	public void setPermissionActionIdsTwo(String[] permissionActionIdsTwo) {
		this.permissionActionIdsTwo = permissionActionIdsTwo;
	}
}
