/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 24, 2011
 * File Name       : PermissionServiceImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.dao.PermissionDao;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.service.PermissionService;

@Service("permissionService")
@Transactional
public class PermissionServiceImpl implements PermissionService {
	@Autowired
	private PermissionDao permissionDao;

	/**
	 * 删除权限
	 */
	public void delete(Long id) {
		Permission permission=getById(id);
		//删除权限项
		if(permission.getParentPermission()!=null){
			//检查当前权限是否被角色使用
			if(permissionDao.hasUsed(id)){
				throw new OceanRuntimeException("permissin has used!");
			}
		}else{ //删除权限组
			//检查当前权限组下是否有子权限
			if(permission.getSubPermissions().size()>0){
				throw new OceanRuntimeException("has sub permission!");
			}
		}
		permissionDao.delete(id);
	}

	/**
	 * 获取权限
	 */
	public Permission getById(Long id) {
		return permissionDao.getById(id);
	}

	/**
	 * 分页查询权限
	 */
	public PageList<Permission> queryByPage(Criteria criteria) {
		return permissionDao.queryByPage(criteria);
	}

	/**
	 * 新建权限
	 */
	public void save(Permission entity) {
		permissionDao.save(entity);
	}

	/**
	 * 修改权限
	 */
	public void update(Permission entity) {
		permissionDao.update(entity);
	}
	/**
	 * 保存权限项
	 * @param parentPermissionId 权限组标识
	 * @param permission 权限项内容
	 */
	public void savePermission(Long parentPermissionId,Permission permission){
		permissionDao.savePermission(parentPermissionId, permission);
	}
	/**
	 * 列出所有的权限组
	 * @param appName 应用名称，当为null时列出所有系统的权限组,目前包括oss,nm两个应用
	 * @return 权限组列表
	 */
	public List<Permission> queryAllPermissionGroup(String appName){
		return permissionDao.queryAllPermissionGroup(appName);
	}
	/**
	 * 按应用名称查询所有的权限项和权限组并加载子权限项
	 * @param appName 应用名称 应用名称为空时不区分应用
	 * @return 权限列表
	 */
	public List<Permission> queryAllPermissionByAppName(String appName){
		List<Permission> permissions=new ArrayList<Permission>();
		permissions=permissionDao.queryAllPermissionByAppName(appName);
		return permissions;
	}
}
