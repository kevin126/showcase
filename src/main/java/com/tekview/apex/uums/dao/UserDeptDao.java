/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 24, 2011
 * File Name       : UserDeptDao.java
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
import com.tekview.apex.uums.model.UserDept;

/**
 * 部门Dao
 * @author Xiaojiapeng
 *
 * @param <UserDept>
 */

public interface UserDeptDao extends BaseInterface<UserDept> {
	/**
     * 查看父部门下的所有部门
     * @param parentId  父部门Id
     * @return 父部门下的所有子部门
     */
	public List<UserDept> getAllDeptByParentId(String parentId);
	
	/**
     * 删除部门
     * @param deptName 部门名称
     */
	public void deleteUserDept(String deptName);
	
	/**
	 * 根据部门名称查询
	 * @param deptName 部门名称
	 */
	public UserDept getUserDeptByName(String deptName);
	
	/**
	 * 分页根据deptId查询实体对象
	 * 
	 * @param start
	 *            开始位置 - 下标从0开始
	 * @param pageSize
	 *            每页大小
	 * @param deptId 部门Id
	 * @return
	 */
	public PageList<User> queryUsers(Long deptId,int start, int pageSize);
	
	public List<User> queryUsers(Long deptId);
    /**
     * 查询所有部门
     * @return 部门列表
     */
    public List<UserDept> getAllDept();
    
    /**
	 * 根据实体对象的某个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER';
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public List<UserDept> getEntitiesByOneProperty(final String propertyName, final Object value);
	/**
     * 通过部门名称查询部门
     *
     * @param deptName 部门名称
     * @return 部门信息
     */
    public UserDept getByName(String deptName);
    
    /**
	 * 根据实体对象的某个属性查询唯一的实体对象
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的唯一实体，如果没有找到，则返回null
	 */
	public UserDept getUniqueEntityByOneProperty(String propertyName,Object value);
	
	/**
	 * 保存实体
	 * 
	 * @param userDept 部门信息
	 * @return id 部门标识
	 */
	public long saveEntity(UserDept userDept);
	/**
	 * 得到所有一级根部门
	 * 
	 * @return 部门列表
	 */
	public List<UserDept> getAllRootDept();
    
	/**
	 * 根据parentDeptId查询UserDept
	 * List里面放Object数组
	 * 下标 0 部门Id
	 * 下标 1 部门名称 deptName
	 * 下标 2 部门描述 deptMemo
	 * 下标 3 资产审批负责人 Id
	 * 下标 4 资产审批负责人名称 name
	 * 下标 5 部门用户数量
	 * 下标 6 子部门数量
	 * @param parentDeptId
	 * @return
	 */
	public List<Object> getAllUserDeptByParentId(String parentDeptId,int start,int limit);
	
	/**
	 * 根据实体对象的多个属性查询实体对象数量，举个例子如下： from DeviceResource where type = 'ROUTER' and temp = false;
	 * 
	 * @param propertyNames 匹配的属性名
	 * @param values 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public int countEntitiesByPropNames(final String[] propertyNames, final Object[] values);
	
	/**
	 * 向部门中添加成员
	 * @param deptId 部门标识
	 * @param userIds	用户Id集合
	 */
	public void addUserToDept(Long deptId,List<Long> userIds);
	
	/**
	 * 删除部门下的多个成员
	 * @param deptId 部门标识
	 * @param userIds 成员标识集合
	 */
	public void deleteUserDeptMember(Long deptId,List<Long> userIds);
	
	/**
	 * 根据父部门id得到所有子部门（含父部门）
	 * 
	 * @return 部门列表
	 */
	public List<UserDept> getALLDeptID(Long parentId);
	
	/**
     * 通过id查询,加载子部门
     * @param id 部门标识
     * @return 部门对象
     */
    public UserDept getByIdEager(Long id);
}
