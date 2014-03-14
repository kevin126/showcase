/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 24, 2011
 * File Name       : WorkGroupDaoImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.page.PageArrayList;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.dao.DaoSupport;
import com.tekview.apex.uums.dao.UserDao;
import com.tekview.apex.uums.dao.WorkGroupDao;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserMaintenanceGroup;

/**
 * 工作组dao的实现类
 * 
 * @author Xiaojiapeng
 * 
 */
@Repository("workGroupDao")
@Transactional
public class WorkGroupDaoImpl extends DaoSupport<UserMaintenanceGroup> implements WorkGroupDao {
	
	@PersistenceContext
	private EntityManager entityManager;
	@Autowired
	private UserDao userDao;
	
	@Override
	public UserMaintenanceGroup getById(Long id) {
		try {
			return super.getById(id);
		} catch (NullPointerException e) {
			return null;
		}
	}

	
	@Override
	protected Class getEntityClass() {
		return UserMaintenanceGroup.class;
	}
	 /**
	 * 得到所有一级根工作组
	 * @return 工作组列表
	 */
	public List<UserMaintenanceGroup> getAllRootWorkGroup(){
		Query query = entityManager.createQuery("FROM UserMaintenanceGroup workGroup WHERE workGroup.parentworkGroup.id = null");
		return query.getResultList();
	}

	/**
	 * 查询父工作组下面的所有子工作组
	 * @param parentGroupId 父工作组Id
	 * @return 工作组集合
	 */
	@Override
	public List<UserMaintenanceGroup> getGroupByParentDeptId(long parentGroupId) {
		StringBuffer hql;
		if(parentGroupId==0){
			hql=new StringBuffer(" as workGroup where workGroup.parentworkGroup.id is null");
		}
		else{
			hql=new StringBuffer(" as workGroup where workGroup.parentworkGroup.id="
					+ parentGroupId);
		}
		return (List<UserMaintenanceGroup>) super.getEntityByHql(hql.toString());

	}
	 /**
     * 删除工作组
     * @param workGroupName 工作组名称
     */
	@Override
	public void deleteWorkGroup(String workGroupName) {
		if (workGroupName != null && !"".equals(workGroupName)) {
			super.deleteEntityByProperty("workGroupName", workGroupName);
		}
	}
	
	 /**
     *  根据工作组名查询工作组信息
     * @param workGroupName	 工作组名称
     * @return	工作组对象
     */
	@Override
	public UserMaintenanceGroup getWorkGroupByWorkGroupName(String workGroupName) {
		Query query = entityManager.createQuery("select workGroup from UserMaintenanceGroup workGroup where workGroup.workGroupName=:workGroupName");
		query.setParameter("workGroupName", workGroupName);
		List<UserMaintenanceGroup> workGroupList = query.getResultList();
		return (UserMaintenanceGroup)workGroupList.get(0);
	}
	
	
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
	public PageList<User> queryUsers(Long groupId,int start, int pageSize) {
		Query query = entityManager
				.createQuery("select entity from User entity where entity.workGroup.id=:groupId");
		Integer totalCount=query.setParameter("groupId", groupId).getResultList().size();
		query.setFirstResult(start);
		query.setMaxResults(pageSize);
		List<User> list = query.setParameter("groupId", groupId)
				.getResultList();
		
		for (User user : list) {
			Hibernate.initialize(user.getRoles()); // 强制加载用户角色
		}
		PageList<User> userList=new PageArrayList<User>(Long.valueOf(totalCount.toString()),list);
		return userList;
	}
	
	/**
     * 查询工作组下的用户
     *
     * @param workGroupId 工作组标识
     * @return 工作组下的用户列表
     */
	@Override
	public List<User> queryUsers(Long workGroupId) {
		Query query = entityManager.createQuery("select entity from User entity where entity.workGroup.id=:workGroupId");
		List<User> userList = query.setParameter("workGroupId", workGroupId).getResultList();
		for (User user : userList) {
			Hibernate.initialize(user.getRoles());			//强制加载用户角色
		}
		return userList;
	}

	/**
     * 获取所有的工作组列表
     * @return 工作组列表
     */
	public List<UserMaintenanceGroup> getAllWorkGroup() {
		return getAllEntities();
	}
	/**
	 * 获取所有的工作组列表，包含父子关系
	 * @return 工作组列表
	 */
	public List<UserMaintenanceGroup> getAllWorkGroupEager(){
		List<UserMaintenanceGroup> workGroups= (List<UserMaintenanceGroup>)entityManager.createQuery("from " + getEntityClass().getName()).getResultList();
		if(workGroups!=null){
			for(UserMaintenanceGroup workGroup: workGroups){
				workGroup.getSubWorkGroup().size();
			}
		}
		 return workGroups;
	}
	 /**
     * 通过工作组名称获取工作组信息
     *
     * @param workGroupName 工作组名称
     * @return 工作组对象
     */
    public UserMaintenanceGroup getByName(String workGroupName){
    	Query query = entityManager.createQuery("select entity from UserMaintenanceGroup entity where entity.workGroupName=:workGroupName");
		query.setParameter("workGroupName", workGroupName);
		
		try {
			if(query!=null&&query.getSingleResult()!=null){
				return (UserMaintenanceGroup)query.getSingleResult();
			}else {
				return null;
			}
		} catch (Exception e) {
			return null;
		}
    }
    /**
	 * 保存实体
	 * 
	 * @param entity 实体信息
	 * @return id 数据库标识
	 */
    public long saveEntity(UserMaintenanceGroup entity){
		if(entity==null){
			return 0L;
		}
		entityManager.persist(entity);
		return entity.getId();
	}
    
    public List<Object> getAllWorkGroupByParentId(String parentGroupId,int start,int limit){
    	StringBuffer sql;
    	if(parentGroupId==null||parentGroupId.equals("")){
    		sql=new StringBuffer("SELECT workGroup.id,workGroup.workGroupName,workGroup.workGroupMemo,count(user.id)," +
    				"(SELECT count(PARENTWORKGROUP_ID) from ca_usermaintenancegroup where ca_usermaintenancegroup.PAREN" +
    				"TWORKGROUP_ID=workGroup.id) from ca_usermaintenancegroup workGroup left join ca_user user on user." +
    				"workGroupId=workGroup.id WHERE workGroup.PARENTWORKGROUP_ID is null GROUP BY workGroup.id limit " +start+","+limit);
		}
		else{
			sql=new StringBuffer("SELECT workGroup.id,workGroup.workGroupName,workGroup.workGroupMemo,count(user.id)," +
					"(SELECT count(PARENTWORKGROUP_ID) from ca_usermaintenancegroup where ca_usermaintenancegroup.PAREN" +
					"TWORKGROUP_ID=workGroup.id) from ca_usermaintenancegroup workGroup left join ca_user user on user." +
					"workGroupId=workGroup.id WHERE workGroup.PARENTWORKGROUP_ID = "+parentGroupId+" GROUP BY workGroup.id limit " +start+","+limit);
		}
    	Query query=entityManager.createNativeQuery(sql.toString());
    	
    	return query.getResultList();
    }
	/* (non-Javadoc)
	 * @see com.tekview.apex.uums.dao.WorkGroupDao#addUserToGroup(java.lang.Long, java.util.List)
	 */
	@Override
	synchronized public void addUserToGroup(Long groupId, List<Long> userIds) {
		UserMaintenanceGroup workGroup=getById(groupId);
		//1、查看将要添加新成员的工作组是否存在
		if (workGroup==null) {
			throw new OceanRuntimeException("工作组不存在或已被删除！");
		}
		List<User> userList=userDao.getEntitiesByOneProperty("workGroup.id", groupId);
		for (Long userId : userIds) {
			User user = userDao.getById(userId);
			//2、查看将要添加的成员是否存在
			if (user==null) {
				throw new OceanRuntimeException("所选成员不存在或已被删除！");
			}
			//3、检查将要添加的成员是否已存在工作组中
			if (!userList.contains(user)) {
				user.setWorkGroup(workGroup);
				userDao.update(user);
			}
			
		}
		
	}


	/* (non-Javadoc)
	 * @see com.tekview.apex.uums.dao.WorkGroupDao#deleteWorkGroupMember(java.lang.Long, java.util.List)
	 */
	@Override
	synchronized public void deleteWorkGroupMember(Long groupId, List<Long> userIds) {
		UserMaintenanceGroup workGroup = getById(groupId);
		//1、查看将要删除成员的工作组是否存在
		if (workGroup==null) {
			throw new OceanRuntimeException("工作组不存在或已被删除！");
		}
		List<User> userList=userDao.getEntitiesByOneProperty("workGroup.id", groupId);
		for (Long userId : userIds) {
			User user = userDao.getById(userId);
			//2、查看将要删除的成员是否存在
			if (user==null) {
				throw new OceanRuntimeException("标识为"+userId+"的成员不存在或已被删除，删除成员失败！");
			}
			//3、检查将要删除的成员是否在工作组中
			if (userList.contains(user)) {
				user.setWorkGroup(null);
				userDao.update(user);
			}
			
		}
		
	}
	/**
     * 通过id查询,加载子组
     * @param id 工作组标识
     * @return 工作组对象
     */
    public UserMaintenanceGroup getByIdEager(Long id){
    	UserMaintenanceGroup workGroup=(UserMaintenanceGroup)entityManager.find(getEntityClass(), id);
    	if(workGroup.getSubWorkGroup()!=null){
    		workGroup.getSubWorkGroup().size();
    	}
    	return workGroup;
    }
	
}
