/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 24, 2011
 * File Name       : WorkGroupService.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service;

import java.util.List;
import java.util.Map;

import com.tekview.apex.uums.base.BaseInterface;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserMaintenanceGroup;

/**
 * 工作组Service
 * @author Xiaojiapeng
 *
 */
public interface WorkGroupService extends BaseInterface<UserMaintenanceGroup> {
    /**
     * 查询工作组下的用户
     *
     * @param workGroupId 工作组标识
     * @return 工作组下的用户列表
     */
    public List<User> queryUsers(Long workGroupId);
    
    /**
     * 查询父工作组下面的所有子工作组
     * @param parentGroupId 父工作组Id
     * @return 工作组集合
     */
    public List<UserMaintenanceGroup> getGroupByParentDeptId(long parentGroupId);
    
    /**
     * 根据工作组Id查询工作组详情
     * @param id 工作组Id
     * @return 工作组对象
     */
    public UserMaintenanceGroup getGroupById(String id);
    
    /**
     * 
     * @param parentId 父工作组Id
     * @return
     */
    public List<Map<String, Object>> getAllWorkGroupNamesTree(String parentId);
    
    /**
     * 添加新工作组
     * @param workGroupName 工作组名称
     * @param workGroupMemo 描述
     * @param parentWorkGroupId 父工作组Id
     * @return 添加结果
     */
    public long addWorkGroup(String workGroupName, String workGroupMemo, String parentWorkGroupId);
    
    /**
     * 修改工作组信息
     * @param workGroupId 工作组Id
     * @param newWorkGroupName 工作组名称
     * @param workGroupMemo 描述
     * @return 是否修改成功
     */
    public boolean updateWorkGroup(String workGroupId, String newWorkGroupName, String workGroupMemo);
    
    /**
     * 批量删除工作组
     * @param workGroupIds 批量删除工作组Id集合
     */
    public void deleteWorkGroups(List<String> workGroupIds);
    
    
    /**
     * 删除工作组
     * @param workGroupName 工作组名称
     */
    public void deleteWorkGroup(String workGroupName);
    
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
	 * 根据父工作组获得工作组总条数
	 * @return
	 */
	public int count(String parentId);
	
	/**
	 * 查询所有工作组
	 * @return
	 */
	public List<UserMaintenanceGroup> getAllWorkGroups();
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
    
    /**
	 * 获取所有的工作组树列表，名称加入标识
	 * @return 工作组列表
	 */
	public List<UserMaintenanceGroup> getAllWorkGroupTree();
}