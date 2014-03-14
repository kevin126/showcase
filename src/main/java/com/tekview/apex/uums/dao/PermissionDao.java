/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 24, 2011
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

import com.tekview.apex.uums.base.BaseInterface;
import com.tekview.apex.uums.model.Permission;
/**
 * 权限DAO
 *
 */
public interface PermissionDao extends BaseInterface<Permission> {
	/**
	 * 保存权限项
	 * @param parentPermissionId 权限组标识
	 * @param permission 权限项内容
	 */
	public void savePermission(Long parentPermissionId,Permission permission);
	/**
	 * 列出所有的权限组
	 * @param appName 应用名称，当为null时列出所有系统的权限组,目前包括oss,nm两个应用
	 * @return 权限组列表
	 */
	public List<Permission> queryAllPermissionGroup(String appName);
	
	/**
	 * 判断当前权限是否被角色使用
	 * @param permissionId 权限标识
	 * @return 如果使用返回true，否则返回false
	 */
	public boolean hasUsed(Long permissionId);
	/**
	 * 按应用名称查询所有的权限项和权限组并加载子权限项
	 * @param appName 应用名称 应用名称为空时不区分应用
	 * @return 权限列表
	 */
	public List<Permission> queryAllPermissionByAppName(String appName);
	
	 /**
     * 对过ActionId区取权限项
     * @param actionId 标识
     * @return 权限信息
     */
    public Permission getByActionId(String actionId);
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
    public List<Permission> getEntitiesByOrCondition(final String propertyName, final Object... values);
    
    /**
	 * 将查询条件封装为hql查找
	 * 
	 * @param hql 查询语句
	 * @return 实体列表
	 */
    public List<Permission> getEntityByHql(String hql);
}
