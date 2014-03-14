/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : Permission.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

/**
 * 权限模型，区分子系统
 */
//@Entity
//@Table(name = "ca_permission")
public class Permission implements Serializable {
	private static final long serialVersionUID = 4201271600877117805L;

	/**
	 * 持久化ID
	 */
	private Long id;

	/**
	 * 权限名
	 */
	private String permissionName;

	/**
	 * 权限描述
	 */
	private String permissionDescription;

	/**
	 * 权限的ACTIONID
	 */
	private String actionId;

	/**
	 * 是否必选
	 */
	private boolean obligatory;

	/**
	 * 用来分组 (现在分组只是用来简单的做展示用的，所以这里只用一个字段来表示)
	 */
	private String permissionGroup;

	/**
	 * 父权限项
	 */
	private Permission parentPermission;

	/**
	 * 子权限项
	 */
	private Set<Permission> subPermissions = new HashSet<Permission>(0);

	/**
	 * 排了序的subPermissions，按id从小到大排序
	 */
	private List<Permission> sortSubPermissions = new ArrayList<Permission>();

	/**
	 * 提供给工作流的非业务字段，在出厂时工作流同步负责和这个字段同步 <p/> 用户新增角色这个字段为空
	 */
	private String wfGroup;
	/**
	 * 应用名称
	 */
	private String appName;

	public Permission() {
	}

	@Id
	@GeneratedValue
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	@Column(unique=true)
	public String getPermissionName() {
		return permissionName;
	}

	public void setPermissionName(String permissionName) {
		this.permissionName = permissionName;
	}

	public String getPermissionDescription() {
		return permissionDescription;
	}

	public void setPermissionDescription(String permissionDescription) {
		this.permissionDescription = permissionDescription;
	}
	@Column(unique=true)
	public String getActionId() {
		return actionId;
	}

	public void setActionId(String actionId) {
		this.actionId = actionId;
	}

	public boolean isObligatory() {
		return obligatory;
	}

	public void setObligatory(boolean obligatory) {
		this.obligatory = obligatory;
	}

	public String getPermissionGroup() {
		return permissionGroup;
	}

	public void setPermissionGroup(String permissionGroup) {
		this.permissionGroup = permissionGroup;
	}

	@ManyToOne(optional = true, cascade = CascadeType.PERSIST)
	@JoinColumn(name = "PARENTPERMISSION_ID")
	public Permission getParentPermission() {
		return parentPermission;
	}

	public void setParentPermission(Permission parentPermission) {
		this.parentPermission = parentPermission;
	}

	@OneToMany(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
	@JoinColumn(name = "PARENTPERMISSION_ID")
	public Set<Permission> getSubPermissions() {
		return subPermissions;
	}

	public void setSubPermissions(Set<Permission> subPermissions) {
		this.subPermissions = subPermissions;
	}

	@Transient
	public List<Permission> getSortSubPermissions() {
		List<Permission> perList = new ArrayList<Permission>();
		Object[] subPer = this.subPermissions.toArray();
		// 冒泡排序
		for (int i = 0; i < subPer.length; i++) {
			for (int j = i + 1; j < subPer.length; j++) {
				if (((Permission) subPer[i]).getId() > ((Permission) subPer[j]).getId()) {
					Permission per = new Permission();
					per = (Permission) subPer[j];
					subPer[j] = subPer[i];
					subPer[i] = per;
				}
			}
			perList.add((Permission) subPer[i]);
		}
		return perList;
	}

	public void setSortSubPermissions(List<Permission> sortSubPermissions) {
		this.sortSubPermissions = sortSubPermissions;
	}
	
	@Column(name="wf_group",unique=true)
	public String getWfGroup() {
		return wfGroup;
	}

	public void setWfGroup(String wfGroup) {
		this.wfGroup = wfGroup;
	}

	public String getAppName() {
		return appName;
	}

	public void setAppName(String appName) {
		this.appName = appName;
	}
}