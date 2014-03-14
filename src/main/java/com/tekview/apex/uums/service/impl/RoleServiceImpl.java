/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : RoleServiceImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.dao.PermissionDao;
import com.tekview.apex.uums.dao.RoleDao;
import com.tekview.apex.uums.dao.UserDao;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.model.Role;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.service.RoleService;
/**
 * 角色Service
 *
 */
@Service("roleService")
@Transactional
public class RoleServiceImpl implements RoleService{
	@Autowired
	private RoleDao roleDao;
	@Autowired
	private PermissionDao permissionDao;
	@Autowired
	private UserDao userDao;
	 /**
     * 查看角色所有权限
     *
     * @param roleId 角色标识
     * @return 角色下的权限列表
     */
	public List<Permission> queryPermissions(Long roleId) {
		return roleDao.queryPermissions(roleId);
	}
	 /**
     * 查看角色下所有用户
     *
     * @param roleId 角色标识
     * @return 角色下的用户列表
     */
	public List<User> queryUsers(Long roleId) {
		return roleDao.queryUsers(roleId);
	}
	/**
	 * 删除角色
	 */
	public void delete(Long roleId) {
		if(roleDao.hasUsed(roleId)){
			throw new OceanRuntimeException("role.has.used");
		}else{
			Role role=roleDao.getById(roleId);
			if(role!=null){
				role.setPerms(null);
				role.setUsers(null);
				roleDao.update(role);
			}
			roleDao.deleteRole(role.getRoleName());
		}
	}
	/**
	 * 获取角色信息
	 */
	public Role getById(Long roleId) {
		return roleDao.getById(roleId);
	}
	/**
	 * 分页查询角色信息
	 */
	public PageList<Role> queryByPage(Criteria criteria) {
		return roleDao.queryByPage(criteria);
	}
	/**
	 * 保存角色
	 */
	public void save(Role entity) {
		roleDao.save(entity);
	}
	/**
	 * 更新角色
	 */
	synchronized public void update(Role entity) {
		roleDao.update(entity);
	}
	/**
	 * 添加角色的同时添加权限项
	 * @param role 角色信息
	 * @param permissionIds 权限项标识
	 */
	synchronized public void saveRoleWithPermissions(Role role,Long permissionIds[]){
		 roleDao.saveRoleWithPermissions(role,permissionIds);
	 }
	/**
	 * 添加角色的同时添加权限项
	 * @param role 角色信息
	 * @param permissionIds 权限项标识
	 */
	synchronized public void saveRoleWithPermissions(Role role,String permissionActionIds[]){
    	roleDao.saveRoleWithPermissions(role, permissionActionIds);
    }
	/**
	 * 角色添加权限
	 * @param roleId 角色标识
	 * @param permissionIds 权限标识
	 */
	public void addPermissions(Long roleId,Long permissionIds[]){
		roleDao.addPermissions(roleId, permissionIds);
	}
	/**
	 * 修改角色权限
	 * @param roleId 角色标识
	 * @param permissionIds 权限标识
	 */
	synchronized public void updateRoleWithPermissions(Long roleId,Long permissionIds[]){
		roleDao.updateRoleWithPermissions(roleId, permissionIds);
	}
	
	/**
	 * 《测试通过》
	 * <li>更新角色</li>
	 * <p>
	 * <li>包括更新角色描述和更新角色拥有权限</li>
	 * <p>
	 * <li>角色的名字不允许修改</li>
	 * <p>
	 * <li>如果actionId为空或者大小为零，则只更新角色描述</li>
	 * 
	 * @param roleId 角色名
	 * @param actionId 要更新为的权限actionId列表
	 * @return boolean 是否成功
	 */
	public boolean updateRoleWithPermissions(String roleId,
			List<String> actionIds) {
		// 1、非普通用户角色至少要拥有一个权限！
		/**
		 * 硬编码
		 */
		if ((actionIds == null || actionIds.size() == 0)&&!roleId.equals("15"))
			throw new OceanRuntimeException("role.at.least.have.a.permission");
		Role role = roleDao.getById(Long.valueOf(roleId));
		// 2、角色是否存在
		if (role == null)
			throw new OceanRuntimeException("theroledoesnotexist");
		//获取数据库中的权限
		Set<Permission> dbPers = role.getPerms();
		List<Permission> newPers =new ArrayList<Permission>();
		//加载页面中选中的权限
		if(actionIds != null && actionIds.size()> 0){
			newPers = permissionDao.getEntitiesByOrCondition("actionId", actionIds.toArray());
		}
		//遍历数据库中角色的所有权限，将非页面中选中的权限移除
		for (Iterator<Permission> it = dbPers.iterator(); it.hasNext();) {
			Permission per = (Permission) it.next();
			if (!newPers.contains(per)) {
				it.remove();
			}
		}
		//遍历页面选中的角色的权限，将非数据库中有的放入列表中
		for (Iterator<Permission> it = newPers.iterator(); it.hasNext();) {
			Permission per = (Permission) it.next();
			if (!dbPers.contains(per)) {
				dbPers.add(per);
			}
		}
		roleDao.update(role);
		return true;
	}
	/**
	 * 加载角色信息的同时加载权限
	 * @param RoleId 角色标识
	 * @return 角色对象
	 */
	public Role getByIdWithPermissions(Long roleId){
		return roleDao.getByIdWithPermissions(roleId);
	}
	 /**
	 * 角色添加用户
	 * @param roleId 角色标识
	 * @param permissionIds 用户标识
	 */
	public void AddUsers(Long roleId, Long[] userIds) {
		roleDao.AddUsers(roleId, userIds);
	}
	/**
	 * 修改角色用户
	 * @param roleId 角色标识
	 * @param permissionIds 用户标识
	 */
	public void updateRoleWithUsers(Long roleId, Long[] userIds) {
		roleDao.updateRoleWithUsers(roleId, userIds);
	}
	/**
	 * 分页查询角色下的用户
	 * @param roleId 角色标识
	 * @param start 开始记录
	 * @param pageSize 每页记录数
	 * @return 用户列表
	 */
    public PageList<User> queryUsersByPage(Long roleId,int start,int pageSize){
    	return roleDao.queryUsersByPage(roleId, start, pageSize);
    }
    /**
	 * 根据实体对象的某个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER';
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public List<Role> getEntitiesByOneProperty(final String propertyName, final Object value){
		return roleDao.getEntitiesByOneProperty(propertyName, value);
	}
	/**
	 * 移除角色下面的用户
	 * @param roleId 角色
	 * @param memberIds 用户标识集合
	 */
	public void removeRoleMembers(Long roleId,List<Long> memberIds){
		roleDao.removeRoleMembers(roleId,memberIds);
	}
	/**
	 * 向角色中添中用户
	 * @param roleId 角色标识
	 * @param memberIds 用户标识集合
	 */
	public void addUserToRole(Long roleId,List<Long> memberIds){
		Role role=roleDao.getById(roleId);
		//1、判断是否为资产审批负责人角色或者普通用户角色
		if (role.getRoleName().equals("普通用户")||role.getRoleName().equals("普通用户（资产审批）")) {
			//若为这两个角色，则将用户原有的角色都清空
			for (Long memberId : memberIds) {
				User user=userDao.getById(memberId);
				user.setRoles(null);
				userDao.update(user);
			}
		}
		//2、判断将要添加的用户中是否有为资产审批负责人角色或者普通角色
		for (Long memberId : memberIds) {
			User user = userDao.getById(memberId);
			Set<Role> roles=user.getRoles();
			if (roles!=null&&roles.size()>0) {
				List<Role> roleList=roleDao.getEntitiesByOrCondition("roleName", "普通用户","普通用户（资产审批）");
				if(roleList!=null&&roleList.size()>0){
					//若有这两个角色 则移除
					for (Role role2 : roleList) {
						if (roles.contains(role2)) {
							roles.remove(role2);
						}
					}
					user.setRoles(roles);
					userDao.update(user);
				}
			}
			
		}
		roleDao.addUserToRole(roleId,memberIds);
	}
	@Override
	public List<Role> getAllRoles() {
		return roleDao.getAllEntities();
	}
	@Override
	public List<Object> getRolesByAppName(String appName, int start, int limit) {
		return roleDao.getRolesByAppName(appName, start, limit);
	}
	@Override
	public int countEntitiesByPropNames(Object[] values) {
		return roleDao.countEntitiesByPropNames(new String[]{"appName"}, values);
	}
	@Override
	public List<Role> getRolesByIds(List<Long> roleIds) {
		return roleDao.getRolesByIds(roleIds);
	}
	@Override
	public Role getUniqueEntityByOneProperty(String propertyName, Object value) {
		return roleDao.getUniqueEntityByOneProperty(propertyName, value);
	}
}
