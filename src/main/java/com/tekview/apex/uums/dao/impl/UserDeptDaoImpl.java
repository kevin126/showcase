/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 24, 2011
 * File Name       : UserDeptDaoImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao.impl;

import java.util.ArrayList;
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
import com.tekview.apex.uums.dao.UserDeptDao;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserDept;
import com.tekview.apex.uums.model.UserMaintenanceGroup;

/**
 * 部门Dao 的实现类
 * 
 * @author Xiaojiapeng
 * 
 */
@Repository("userDeptDao")
@Transactional
public class UserDeptDaoImpl extends DaoSupport<UserDept> implements UserDeptDao {

	@PersistenceContext
	private EntityManager entityManager;
	
	@Autowired
	private UserDao userDao;

	/**
	 * return 实体类
	 */
	@Override
	protected Class<UserDept> getEntityClass() {

		return UserDept.class;
	}

	/**
	 * 查看父部门下的所有部门
	 * 
	 * @param parentId 父部门Id
	 * @return 父部门下的所有子部门
	 */
	@Override
	public List<UserDept> getAllDeptByParentId(String parentDeptId) {
		StringBuffer hql;
		if (parentDeptId != null && !"".equals(parentDeptId)
				&& !"0".equals(parentDeptId)) { // 判断是否为父权限
			hql = new StringBuffer(
					" as userDept where userDept.parentUserDept.id = "
							+ Long.parseLong(parentDeptId));
		} else { // 为父权限
			hql = new StringBuffer(
					" as userDept where userDept.parentUserDept.id is null");
		}
		return (List<UserDept>) getEntityByHql(hql.toString());
	}

	/**
	 * 删除部门
	 * 
	 * @param deptName 部门名称
	 */
	@Override
	public void deleteUserDept(String deptName) {
		if (deptName != null && !"".equals(deptName)) {
			deleteEntityByProperty("deptName", deptName);
		}
	}

	/**
	 * 根据部门名称查询
	 * 
	 * @param deptName 部门名称
	 */
	@Override
	public UserDept getUserDeptByName(String deptName) {
		Query query = entityManager.createQuery("select userDept from UserDept userDept where userDept.deptName=:deptName");
		query.setParameter("deptName", deptName);
		List<UserDept> userDeptList = query.getResultList();
		return (UserDept) userDeptList.get(0);
	}

	/**
	 * 分页根据deptId查询实体对象
	 * 
	 * @param start 开始位置 - 下标从0开始
	 * @param pageSize 每页大小
	 * @param deptId 部门Id
	 * @return
	 */
	public PageList<User> queryUsers(Long deptId,int start, int pageSize) {
		Query query = entityManager.createQuery("select entity from User entity where entity.depet.id=:deptId");
		Integer totalCount=query.setParameter("deptId", deptId).getResultList().size();
		query.setFirstResult(start);
		query.setMaxResults(pageSize);
		List<User> list = query.setParameter("deptId", deptId).getResultList();
		
		for (User user : list) {
			Hibernate.initialize(user.getRoles()); // 强制加载用户角色
		}
		PageList<User> userList=new PageArrayList<User>(Long.valueOf(totalCount.toString()),list);
		return userList;
	}
	
	/* (non-Javadoc)
	 * @see com.tekview.apex.uums.dao.UserDeptDao#queryUsers(java.lang.Long)
	 */
	public List<User> queryUsers(Long deptId) {
		Query query = entityManager.createQuery("select entity from User entity where entity.depet.id=:deptId");
		List<User> userList = query.setParameter("deptId", deptId).getResultList();
		for (User user : userList) {
			Hibernate.initialize(user.getRoles()); // 强制加载用户角色
		}
		return userList;
	}

	/**
	 * 查询所有部门
	 * 
	 * @return 部门列表
	 */
	public List<UserDept> getAllDept() {
		return getAllEntities();
	}

	/**
	 * 通过部门名称查询部门
	 * 
	 * @param userDeptName 部门名称
	 * @return 部门信息
	 */
	public UserDept getByName(String deptName) {
		Query query = entityManager.createQuery("select entity from UserDept entity where entity.deptName=:deptName");
		query.setParameter("deptName", deptName);
		
		try {
			if (query!=null&&query.getSingleResult()!=null) {
				return (UserDept)query.getSingleResult();
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
	 * @param userDept 部门信息
	 * @return id 部门标识
	 */
	public long saveEntity(UserDept userDept){
		if(userDept==null){
			return 0L;
		}
		entityManager.persist(userDept);
		return userDept.getId();
	}
	/**
	 * 得到所有一级根部门
	 * 
	 * @return 部门列表
	 */
	public List<UserDept> getAllRootDept(){
		Query query = entityManager.createQuery("FROM UserDept dept WHERE dept.parentUserDept.id = null");
		return query.getResultList();
	}
	
	/* (non-Javadoc)
	 * @see com.tekview.apex.uums.dao.UserDeptDao#getAllUserDeptByParentId(java.lang.String, int, int)
	 */
	public List<Object> getAllUserDeptByParentId(String parentDeptId,int start,int limit){
		StringBuffer sql;
		if (parentDeptId != null && !"".equals(parentDeptId)
				&& !"0".equals(parentDeptId)) { // 判断是否为父权限
			sql=new StringBuffer("select dept.id,dept.deptName,dept.deptMemo,dept.assUserId,(SELECT name from ca_user" +
					" WHERE ca_user.id=dept.assUserId),count(user.id),(SELECT count(PARENTUSERDEPT_ID) FROM " +
					"ca_userdept WHERE ca_userdept.PARENTUSERDEPT_ID=dept.id) from ca_userdept dept left join ca_user user " +
					"on user.departmentId=dept.id where dept.PARENTUSERDEPT_ID = "+parentDeptId+" group by dept.id limit " +start+","+limit);
		} else { // 为父权限
			sql=new StringBuffer("select dept.id,dept.deptName,dept.deptMemo,dept.assUserId,(SELECT name from ca_user" +
					" WHERE ca_user.id=dept.assUserId),count(user.id), (SELECT count(PARENTUSERDEPT_ID) FROM " +
					"ca_userdept WHERE ca_userdept.PARENTUSERDEPT_ID=dept.id)from ca_userdept dept left join ca_user user " +
					"on user.departmentId=dept.id where dept.PARENTUSERDEPT_ID is null group by dept.id limit " +start+","+limit);
		}
		Query query = entityManager.createNativeQuery(sql.toString());
		return query.getResultList();
	}

	@Override
	public UserDept getById(Long id) {
		try {
			return super.getById(id);
		} catch (NullPointerException e) {
			return null;
		}
	}

	/* (non-Javadoc)
	 * @see com.tekview.apex.uums.dao.UserDeptDao#addUserToDept(java.util.List)
	 */
	@Override
	synchronized public void addUserToDept(Long deptId,List<Long> userIds) {
		//1、查看部门是否存在
		UserDept userDept=getById(deptId);
		if (userDept==null) {
			throw new OceanRuntimeException("部门不存在或已被删除！");
		}
		List<User> userList=userDao.getEntitiesByOneProperty("depet.id", deptId);
		for (Long userId : userIds) {
			User user=userDao.getById(userId);
			//2、判断将要添加的部门成员是否存在
			if (user==null) {
				throw new OceanRuntimeException("标识为"+userId+"的用户不存在或已被删除，添加部门成员失败！");
			}
			//3、判断将要添加的部门成员中是否有已在部门中的
			if (!userList.contains(user)) {
				user.setDepet(userDept);
				userDao.update(user);
			}
		}
	}

	/* (non-Javadoc)
	 * @see com.tekview.apex.uums.dao.UserDeptDao#deleteUserDeptMember(java.lang.Long, java.util.List)
	 */
	@Override
	synchronized public void deleteUserDeptMember(Long deptId, List<Long> userIds) {
		//1、查看部门是否存在
		UserDept userDept=getById(deptId);
		if (userDept==null) {
			throw new OceanRuntimeException("部门不存在或已被删除！");
		}
		List<User> userList=userDao.getEntitiesByOneProperty("depet.id", deptId);
		for (Long userId : userIds) {
			User user = userDao.getById(userId);
			//2、判断将要删除的部门成员是否存在
			if (user==null) {
				throw new OceanRuntimeException("标识为"+userId+"的用户不存在或已被删除！删除部门成员失败！");
			}
			//3、判断将要删除的成员是否还在部门中
			if (userList.contains(user)) {
				user.setDepet(null);
				userDao.update(user);
			}
			
		}
		
	}
	/**
	 * 根据父部门id得到所有子部门（含父部门）
	 * 
	 * @return 部门列表
	 */
	public List<UserDept> getALLDeptID(Long parentId){
		List<UserDept> deptList = new ArrayList<UserDept>();
		deptList.add(this.getEntityById(parentId));
		for(int i=0;i<deptList.size();i++){
			List<UserDept> chileList = this.getEntityByHql(" where parentUserDept.id = "+deptList.get(i).getId());
			deptList.addAll(chileList);
		}
		return deptList;
	}
	/**
     * 通过id查询,加载子部门
     * @param id 部门标识
     * @return 部门对象
     */
    public UserDept getByIdEager(Long id){
    	UserDept userDept=(UserDept)entityManager.find(getEntityClass(), id);
    	if(userDept.getSubUserDepts()!=null){
    		userDept.getSubUserDepts().size();
    	}
    	return userDept;
    }
}
