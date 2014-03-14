/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 24, 2011
 * File Name       : PermissionDaoImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.dao.DaoSupport;
import com.tekview.apex.uums.dao.PermissionDao;
import com.tekview.apex.uums.model.Permission;

@Repository("permissionDao")
@Transactional
public class PermissionDaoImpl extends DaoSupport<Permission> implements
		PermissionDao {
	@PersistenceContext
	private EntityManager entityManager;

	@Override
	protected Class<Permission> getEntityClass() {
		return Permission.class;
	}

	@Override
	public void savePermission(Long parentPermissionId, Permission permission) {
		Permission permissionGroup = entityManager.find(getEntityClass(),
				parentPermissionId);
		if (permissionGroup == null) {
			throw new OceanRuntimeException("permission Group not found!");
		}
		permission.setParentPermission(permissionGroup);
		entityManager.persist(permission);
	}

	/**
	 * 列出所有的权限组
	 * @param appName 应用名称，当为null时列出所有系统的权限组,目前包括oss,nm两个应用
	 * @return 权限组列表
	 */
	public List<Permission> queryAllPermissionGroup(String appName) {
		List<Permission> permissionGroups = new ArrayList<Permission>();
		if (appName == null || appName.length() == 0) {
			permissionGroups = entityManager
					.createQuery(
							"SELECT entity From Permission entity Where entity.parentPermission is null")
					.getResultList();
		} else {
			Query query = entityManager
					.createQuery("SELECT entity From Permission entity Where entity.parentPermission is null and entity.appName=:appName");
			query.setParameter("appName", appName);
			permissionGroups = query.getResultList();
		}
		// 返回父权限为空的权限项即为权限组
		return permissionGroups;
	}
	/**
	 * 判断当前权限是否被角色使用
	 * @param permissionId 权限标识
	 * @return 如果使用反回true，否则返回false
	 */
	public boolean hasUsed(Long permissionId){
		boolean result=false;
		Query query =entityManager.createNativeQuery("select * from ca_role_permission where permissionId=:permissionId and roleId is not null");
		query.setParameter("permissionId", permissionId);
		List list=query.getResultList();
		if(list.size()>0){
			result=true;
		}
		return result;
	}
	/**
	 * 按应用名称查询所有的权限项和权限组并加载子权限项
	 * @param appName 应用名称 应用名称为空时不区分应用
	 * @return 权限列表
	 */
	public List<Permission> queryAllPermissionByAppName(String appName){
		List<Permission> permissions = new ArrayList<Permission>();
		if (appName == null || appName.length() == 0) {
			permissions = entityManager.createQuery("SELECT entity From Permission entity where entity.parentPermission.id is null").getResultList();
		} else{
			Query query=entityManager.createQuery("SELECT entity From Permission entity where entity.appName=:appName and  entity.parentPermission.id is null");
			query.setParameter("appName", appName);
			permissions=query.getResultList();
		}
		for(Permission permission:permissions){
			//延迟加载属性
			permission.getSubPermissions().size();
			List<Permission> sortSubPermissions=new ArrayList<Permission>();
			sortSubPermissions.addAll(permission.getSubPermissions());
			//根据Permission的Id进行排序
			Collections.sort(sortSubPermissions, new Comparator<Permission>(){
	            public int compare(Permission arg0, Permission arg1) {
	                return arg0.getId().compareTo(arg1.getId());
	            }
	        });
			permission.setSortSubPermissions(sortSubPermissions);
		}
		return permissions;
	}
	 /**
     * 对过ActionId区取权限项
     * @param actionId 标识
     * @return 权限信息
     */
	public Permission getByActionId(String actionId) {
		 Query query=entityManager.createQuery("SELECT entity From Permission entity where entity.actionId=:actionId");
		 query.setParameter("actionId", actionId);
		return (Permission)query.getSingleResult();
	}
}
