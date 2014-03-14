/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 24, 2011
 * File Name       : UserDeptService.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service;

import java.util.List;

import com.tekview.apex.uums.base.BaseInterface;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserDept;

/**
 * 部门service
 * @author Xiaojiapeng
 *
 */
public interface UserDeptService extends BaseInterface<UserDept> {
    /**
     * 查看部门用户
     *
     * @param deptId 部门标识
     * @return 部门下的用户列表
     */
	PageList<User> queryUsers(Long deptId,int start, int pageSize);
    
    /**
     * 查看父部门下的所有部门
     * @param parentId  父部门Id
     * @return 父部门下的所有子部门
     */
    public List<UserDept> getAllDeptByParentId(String parentId);
    
    /**
     * 添加新部门
     * @param deptName 部门名称
     * @param deptMemo  部门备注
     * @param parentDeptId 上级部门ID
     * @param assUserId 资产审批负责人Id
     * @return 添加的结果
     */
    public long addUserDept(String deptName, String deptMemo, String parentDeptId,Long assUserId);
    
    /**
     * 修改部门信息
     * @param deptId 部门ID
     * @param newDeptName 部门名称
     * @param deptMemo 描述
     * @param assUserId  资产审批负责人Id
     * @return 修改是否成功
     */
    public boolean updateUserDept(String deptId, String newDeptName, String deptMemo,Long assUserId);
    
    /**
     * 删除部门
     * @param deptName 部门名称
     */
    public void deleteUserDept(String deptName);
    
    /**
     * 批量删除部门
     * @param id 批量删除的部门ID集合
     */
    public void deleteUserDepts(List<String> id);
    /**
     * 通过部门名称查询部门
     *
     * @param userDeptName 部门名称
     * @return 部门信息
     */
    public UserDept getByName(String deptName);
    
    /**
     * 查询所有的部门
     * @return
     */
    public List<UserDept> getByAll();
    
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
	 * 根据parentId 获得部门数量
	 * @param parentId
	 * @return
	 */
	public int count(String parentId);
	
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
	 * 获取所有的部门树列表，名称加入标识
	 * @return 部门列表
	 */
	public List<UserDept> getAllUserDeptTree();
}