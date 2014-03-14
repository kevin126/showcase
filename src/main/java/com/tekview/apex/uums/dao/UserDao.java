/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : UserDao.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao;

import java.util.List;

import javax.persistence.EntityManager;

import com.tekview.apex.uums.action.user.UserQuery;
import com.tekview.apex.uums.base.BaseInterface;
import com.tekview.apex.uums.model.User;

public interface UserDao extends BaseInterface<User> {
    /**
     * 加载用户信息时加载角色
     *
     * @param id 用户标识
     * @return 用户信息
     */
    public User getUserWithRolesById(Long id);
    /**
	 * 获取用户信息
	 * @param userName 用户名
	 * @return 用户信息
	 */
    public User getByName(String userName);
    /**
	 * 获取用户信息
	 * @param mail 邮件地址
	 * @return 用户信息
	 */
	public User getByMail(String mail) ;
    /**
	 * 根据用户名获取带有权限信息的用户对象
	 * @param userName 用户名
	 * @return 用户信息
	 */
    public User getUserWithPermissionByName(String userName);
    
    /**
     * 删除对象
     * @param user 用户对象
     */
    public void deleteEntity(User user);
    
    /**
     * 用户是否存在
     * @param userId 用户标识
     * @return 用户存在返回true
     */
    public boolean hasUserByUserId(Long userId);
    
    /**
	 * 根据sql语句统计用户数计
	 * 
	 * @return
	 */
	public Integer countUserSql(String sql);
	/**
	 * 数据库中用户数量
	 * @return 用户数
	 */
	public long count();
	/**
	 * 根据权限id找出拥有该权限的所有用户
	 * 
	 * @param actionId 权限id
	 * @return 拥有该权限标识的用户数
	 */
	public Integer countUserByPermissionId(String actionId);
	
	/**
	 * 根据实体对象的某个属性查询唯一的实体对象
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的唯一实体，如果没有找到，则返回null
	 */
	public User getUserByOneProperty(String propertyName, Object value);
	/**
	 * 删除角色下的所有用户
	 * @param roleName 角色名称
	 * @return 删除成功或失败
	 */
	public boolean deleteUserByRoleName(String roleName);
	/**
	 * 删除用户的所有角色
	 * 
	 * @param userId
	 */
	public void deleteUserRoleByUserId(Long userId);
	
	/**
	 * 根据实体对象的某个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER';
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public List<User> getEntitiesByOneProperty(final String propertyName, final Object value);
	/**
	 * 
	 * 或得所有用户的realname 和id 并返回
	 * 
	 * @return
	 */
	public List<User> getAllUserRelName();
	/**
	 * 数据库中所有name != 'gradingviewer' 的user
	 */
	public List<User> getAllUsers();
	/**
	 * 获取用户邮件地址
	 */
	public String getEmailByUserName(String userName);
	
	/**
	 * 在线用户列表
	 * 
	 * @return 用户列表
	 */
	public List<User> getOnlineUsers();
	 /**
     * 分页查询实体对象
     *
     * @param start    开始位置 - 下标从0开始
     * @param pageSize 每页大小
     * @return 用户列表
     */
    public List<User> getPagingEntities(final int start, final int pageSize);
    /**
     * 获取用户手机号码
     * @param userName 用户名
     * @return 手机号码
     */
    public String getPhoneByUserName(String userName);
    /**
	 * 根据权限id找出拥有该权限的所有用户
	 * 
	 * @param actionId 权限id
	 * @return 用户列表
	 */
	public List<User> getUserByPermissionId(String actionId);
	/***
	 * 获取角色下的用户列表
	 * @param roleName 角色名称
	 * @return 用户列表
	 */
	public List<User> getUserListByRoleName(String roleName);
	/**
	 * 获取指定scopeName的用户列表
	 * @param scopeName
	 * @return 用户列表
	 */
	@Deprecated
	public List<User> getUserListByScopeName(String scopeName);
	/**
	 * 根据用户ID查询角色ID列表
	 * 
	 * @param userId 用户标识
	 * @return 角色ID列表
	 */
	public List<Long> getRoleIdsByUserId(Long userId);
	/**
	 * 查询多个工作组下的用户列表
	 * @param groupIds 工作组标识列表
	 * @return 用户列表
	 */
	public List<User>getUsersByGroupIds(List<Long> groupIds);
	/**
	 * 根据角色取用户
	 * 
	 * @param roleIdList 角色标识列表
	 * @return 用户列表
	 */
	public List<User> getUsersByRoleId(List<String> roleIdList);
	/**
	 * 通过角色名得到该Role的所有用户
	 * 
	 * @param roleName 角色名
	 * @return List 用户列表
	 */
	public List<User> getUsersByRoleName(String roleName);
	
	/**
	 * 得到特定资源的用户列表
	 * 
	 * @param scopeName 资源名
	 * @return List,不会为null
	 */
	@Deprecated
	public List<User> getUsersByScopeName(String scopeName);
	/**
	 * 通过多个用户名来获取用户信息
	 * @param userNames  用户名列表
	 * @return 用户列表
	 */
	public List<User> getUsersByUserNames(List<String> userNames);
	
	/**
	 * 
	 * 判断该用户是否存在
	 * 
	 * @param userName 用户名
	 * @return 用户存在返回true
	 */
	public boolean isExistByUserName(String userName);
	/**
	 * 
	 * 判断用户列表中是否有不存在的用户 全部存在返回false ,包含一个不存在返回true
	 * 
	 * @param userNames
	 * @return 存在返回true
	 */
	public boolean isNotExistByUserNames(List<String> userNames);
	
	/**
	 * 获取用户的权限标识列表
	 * @param userId 用户标识
	 * @return 权限标识列表
	 */
	public List<Long> pemissionIds(Long userId);
	
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
	 * 条件查询实体对象的某几个属性而不返回整个实体对象，在仅仅需要实体对象的属性而不是整个实体对象时，可以提高效率。
	 * 
	 * @param selectedProps 要查询的属性名称
	 * @param conditionKeys where子句中的查询条件
	 * @param values where子句中的查询条件对应的值
	 * @return 符合条件的实体对象某几个属性的集合
	 */
	public List<?> getEntityProperties(final String[] selectedProps, final String[] conditionKeys, final Object[] values);
	
	/**
	 * 根据实体对象的多个属性查询实体对象数量，举个例子如下： from DeviceResource where type = 'ROUTER' and temp = false;
	 * 
	 * @param start 开始位置
	 * @param pageSize 每页大小
	 * @param propertyNames 匹配的属性名
	 * @param values 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public int countEntitiesByPropNames(final String[] propertyNames, final Object[] values);
	/**
	 * 将查询条件封装为hql查找
	 * 
	 * @param hql 查询语句
	 * @return 用户列表
	 */
	public List<User> getEntityByHql(String hql);
	
	/**
     * 分页根据hql查询实体对象
     *
     * @param start    开始位置 - 下标从0开始
     * @param pageSize 每页大小
     * @param hql
     * @return
     */
    public List<User> getPagingEntitiesByHql(final String hql, final int start, final int pageSize);
    /**
	 * 根据实体对象的多个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER' and temp = false and mgtIp = '192.168.0.8';
	 * 在这个例子中，我知道查询只会返回唯一值
	 * 
	 * <p>
	 * 在你确定查询返回唯一一个值的情况下调用这个方法，否则请使用{{@link #getEntitiesByPropNames(String[], Object[])}
	 * 
	 * @param propertyNames 匹配的属性名
	 * @param values 属性对应的值
	 * 
	 * @return 符合该特定查询条件的唯一实体
	 */
	public User getUniqueEntityByPropNames(final String[] propertyNames, final Object[] values);
	
	/**
	 * 
	 * 根据用户真实姓名获取模糊匹配的用户名称和用户Id
	 * 
	 * @param realName 用户真实姓名
	 * @return 用户名称和用户Id
	 */
	public List<Object[]> getUsersByLikeRealName(String realName);
	/**
	 * 
	 * 根据用户名列表获得邮件列表
	 * 
	 * @param userNames 用户名称
	 * @return 邮件列表
	 */
	public List<String> getMailListByName(List<String> userNames);
	
	/**
	 * 条件查询实体对象
	 * 举个例子如下： from DeviceResource where type = 'ROUTER' and id=1;
	 * @param propertyNames where子句中的查询条件
	 * @param values where子句中的查询条件对应的值
	 * @return 用户列表
	 */
	public List<User> getEntitiesByPropertiesEuqal(final String[] propertyNames, final Object[] values);
	
	 /**
	 * 将完整的查询条件封装为hql查找,包括关键字select
	 * 
	 * @param hql 查询语句
	 * @return 实体列表
	 */
    public List<User> getEntityByFullHql(String hql);
    
    /**
     * 根据条件语句查询数量
     * @param userQuery
     * @return
     */
    public int countUserByHql(UserQuery userQuery);
    
    /**
     * 分页查询用户列表
     * @param userQuery
     * @return
     */
    public List<User> getPagingUser(UserQuery userQuery);
    
    public EntityManager getEntityManager();
    /**
     * 保存OSS系统同步过来的用户数据
     * @param user 用户信息
     */
    public void saveOssUser(User user);
    
    /**
     * 保存NM系统同步过来的用户数据
     * @param user
     */
    public void saveNmUser(User user);
    /**
	 * 批量删除用户
	 * @param userNames 用户登录名合集
	 */
	public void deleteUserByNames(List<String> userNames);
	
	/**
	 * 批量修改用户状态
	 * @param enabled 用户状态（1 ：启用；２ ：禁用；其他预留）
	 * @param userNames 用户名称集合
	 */
	public void batchModifyUserStatus(int enabled,List<String> userNames);
}