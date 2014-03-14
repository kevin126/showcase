/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 24, 2011
 * File Name       : WorkGroupDao.java
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
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserMaintenanceGroup;

/**
 *  工作组Dao
 * @author Xiaojiapeng
 *
 * @param <UserMaintenanceGroup>
 */

public interface WorkGroupDao extends BaseInterface<UserMaintenanceGroup> {
	/**
     * 查询父工作组下面的所有子工作组
     * @param parentGroupId 父工作组Id
     * @return 工作组集合
     */
	public List<UserMaintenanceGroup> getGroupByParentDeptId(long parentGroupId);
	
	 /**
     * 删除工作组
     * @param workGroupName 工作组名称
     */
    public void deleteWorkGroup(String workGroupName);
    
    /**
     *  根据工作组名查询工作组信息
     * @param workGroupName	 工作组名称
     * @return	工作组对象
     */
    public UserMaintenanceGroup getWorkGroupByWorkGroupName(String workGroupName);
    
    /**
     * 查询工作组下的用户
     *
     * @param workGroupId 工作组标识
     * @return 工作组下的用户列表
     */
    public List<User> queryUsers(Long workGroupId);
    
    /**
     * 获取所有的工作组列表
     * @return 工作组列表
     */
    public List<UserMaintenanceGroup> getAllWorkGroup();
    
    /**
	 * 根据实体对象的某个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER';
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public List<UserMaintenanceGroup> getEntitiesByOneProperty(final String propertyName, final Object value);
	 /**
     * 通过工作组名称获取工作组信息
     *
     * @param workGroupName 工作组名称
     * @return 工作组对象
     */
    public UserMaintenanceGroup getByName(String workGroupName);
    
    /**
	 * 分页根据groupId查询实体对象
	 * 
	 * @param start
	 *            开始位置 - 下标从0开始
	 * @param pageSize
	 *            每页大小
	 * @param groupId 工作组Id
	 * @return
	 */
	public PageList<User> queryUsers(Long groupId,int start, int pageSize);
	
	/**
	 * 将完整的查询条件封装为hql查找,包括关键字select
	 * 
	 * @param hql 查询语句
	 * @return 实体列表
	 */
    public List<UserMaintenanceGroup> getEntityByFullHql(String hql);
    
    /**
     * 通过id查询
     * @param id 工作组标识
     * @return 工作组对象
     */
    public UserMaintenanceGroup getById(Long id);
    
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
	 * 根据实体对象的某个属性查询唯一的实体对象
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的唯一实体，如果没有找到，则返回null
	 */
	public UserMaintenanceGroup getUniqueEntityByOneProperty(final String propertyName, final Object value);
	/**
	 * 保存实体
	 * 
	 * @param entity 实体信息
	 * @return id 数据库标识
	 */
	public long saveEntity(UserMaintenanceGroup userMaintenanceGroup);
	
	 /**
	 * 得到所有一级根工作组
	 * @return 工作组列表
	 */
	public List<UserMaintenanceGroup> getAllRootWorkGroup();
	
	/**
	 *  根据parentGroupId查询WorkGroup
	 *  List中存放object数组
	 *  下标 0 工作组Id
	 *  下标 1 工作组名称 workGroupName
	 *  下标 2 工作组描述 workGroupMemo
	 *  下标 3 工作组所拥有人数 count
	 *  下标 4 工作组拥有的子工作组的数量 
	 * @param parentGroupId
	 * @return
	 */
	public List<Object> getAllWorkGroupByParentId(String parentGroupId,int start,int limit);
	
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
	 * 向工作组中添加工作组成员
	 * @param groupId
	 * @param userIds
	 */
	public void addUserToGroup(Long groupId,List<Long> userIds);
	
	/**
	 * 删除工作组中的多个成员
	 * @param groupId
	 * @param userIds
	 */
	public void deleteWorkGroupMember(Long groupId,List<Long> userIds);
	
	/**
	 * 获取所有的工作组列表，包含父子关系
	 * @return 工作组列表
	 */
	public List<UserMaintenanceGroup> getAllWorkGroupEager();
	/**
     * 通过id查询,加载子组
     * @param id 工作组标识
     * @return 工作组对象
     */
    public UserMaintenanceGroup getByIdEager(Long id);
}
