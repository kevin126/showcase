/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : RoleDao.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao;

import java.util.List;

import com.tekview.apex.uums.base.BaseInterface;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.model.Role;
import com.tekview.apex.uums.model.User;

public interface RoleDao extends BaseInterface<Role> {
	 /**
     * 查看角色所有权限
     *
     * @param roleId 角色标识
     * @return 角色下的权限列表
     */
	public List<Permission> queryPermissions(Long roleId);
	 /**
     * 查看角色下所有用户
     *
     * @param roleId 角色标识
     * @return 角色下的用户列表
     */
	public List<User> queryUsers(Long roleId);
	/**
	 * 添加角色的同时添加权限项
	 * @param role 角色信息
	 * @param permissionIds 权限项标识
	 */
	public void saveRoleWithPermissions(Role role,Long permissionIds[]);
	/**
	 * 添加角色的同时添加权限项
	 * @param role 角色信息
	 * @param permissionActionIds 权限项标识
	 */
	public void saveRoleWithPermissions(Role role,String permissionActionIds[]);
	/**
	 * 角色添加权限
	 * @param roleId 角色标识
	 * @param permissionIds 权限标识
	 */
	public void addPermissions(Long roleId,Long permissionIds[]);
	/**
	 * 修改角色权限
	 * @param roleId 角色标识
	 * @param permissionIds 权限标识
	 */
	public void updateRoleWithPermissions(Long roleId,Long permissionIds[]);
	/**
	 * 加载角色信息的同时加载权限
	 * @param roleId 角色标识
	 * @return 角色对象
	 */
	public Role getByIdWithPermissions(Long roleId);
	/**
	 * 当前角色是否被使用
	 * @param roleId 角色标识
	 * @return 如果当前角色被使用返回true,否则返回false
	 */
	public boolean hasUsed(Long roleId);
	 /**
	 * 角色添加用户
	 * @param roleId 角色标识
	 * @param userIds 用户标识
	 */
	public void AddUsers(Long roleId, Long[] userIds);
	/**
	 * 修改角色用户
	 * @param roleId 角色标识
	 * @param userIds 用户标识
	 */
	public void updateRoleWithUsers(Long roleId, Long[] userIds);
	/**
	 * 分页查询角色下的用户
	 * @param roleId 角色标识
	 * @param start 开始记录
	 * @param pageSize 每页记录数
	 * @return 用户列表
	 */
    public PageList<User> queryUsersByPage(Long roleId,int start,int pageSize);
    
    /**
	 * 根据实体对象的某个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER';
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public List<Role> getEntitiesByOneProperty(final String propertyName, final Object value);
	/**
	 * 移除角色下面的用户
	 * @param roleId 角色
	 * @param memberIds 用户标识集合
	 */
	public void removeRoleMembers(Long roleId,List<Long> memberIds);
	/**
	 * 向角色中添中用户
	 * @param roleId 角色标识
	 * @param memberIds 用户标识集合
	 */
	public void addUserToRole(Long roleId,List<Long> memberIds);
	
	/**
	 * 查询所有角色
	 * @return 角色列表
	 */
	public List<Role> getAllEntities();
	
	/**
	 * 查询数据条数
	 * @return
	 */
	public long count();
	
	/**
     * 分页查询实体对象
     *
     * @param start    开始位置 - 下标从0开始
     * @param pageSize 每页大小
     * @return
     */
	public List<Role> getPagingEntities(int start,int pageSize);
	
	 /**
	 * 根据SQL的or条件查询，举个例子如下： from DeviceResource where (type = 'ROUTER' or type = 'L3_SWITCH');
	 * 
	 * <p>
	 * Notes: 请在进行or查询时调用这个方法
	 * 
	 * @param propertyName 属性名
	 * @param values 属性的可能值
	 * 
	 * @return 符合条件的记录
	 */
	public List<Role> getEntitiesByOrCondition(final String propertyName, final Object... values);
	
	/**
	 * 根据角色名删除角色
	 * @param roleName
	 * @return
	 */
	public void deleteRole(String roleName);
	
	
	/**
	 * 根据Id集合查询角色信息
	 * @param roleIds
	 * @return
	 */
	public List<Role> getRolesByIds(List<Long> roleIds);
	
	/**
	 * 根据指定的条件获符合要求的对象，以分页的形式返回
	 * 
	 * @param start 起始值
	 * @param limit 分页的数目
	 * @param hql 获取对象的Hql语句 
	 * @return 对象数组
	 */
	public Object[] getFiexedObjectsInPage(final int start, final int limit,  final String hql);
	/**
	 * 根据主键查询实体
	 * 
	 * @param id 实体ID
	 * @return 实体对象
	 */
    public Role getById(Long id);
    /**
	 * 根据实体对象的某个属性查询唯一的实体对象
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的唯一实体，如果没有找到，则返回null
	 */
	public Role getUniqueEntityByOneProperty(final String propertyName, final Object value);
	
	/**
	 * 根据应用名称查询角色
	 * @param appName
	 * @param start
	 * @param limit
	 * @return
	 */
	public List<Object> getRolesByAppName(String appName,int start,int limit);
	
	/**
	 * 根据实体对象的多个属性查询实体对象数量，举个例子如下： from DeviceResource where type = 'ROUTER' and temp = false;
	 * 
	 * @param propertyNames 匹配的属性名
	 * @param values 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public int countEntitiesByPropNames(final String[] propertyNames, final Object[] values);
}
