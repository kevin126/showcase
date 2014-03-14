/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : UserMaintenanceGroup.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.model;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * 工作组模型
 */
//@Entity
//@Table(name = "ca_userMaintenanceGroup")
public class UserMaintenanceGroup implements Serializable {
	private static final long serialVersionUID = 1150819501878607072L;

	/**
	 * 数据库持久ID
	 */
	private long id;

	/**
	 * 工作组名称
	 */
	private String workGroupName;

	/**
	 * 工作组备注
	 */
	private String workGroupMemo;

	/**
	 * 父工作组
	 */
	private UserMaintenanceGroup parentworkGroup;

	/**
	 * 子工作组
	 */
	private Set<UserMaintenanceGroup> subWorkGroup = new HashSet<UserMaintenanceGroup>(
			0);
	/**
	 * 是否有子属性
	 */
	private Boolean hasChild = false;
	/**
	 * 所属于系统
	 */
	@Deprecated
	private String appNames;

	public UserMaintenanceGroup() {
	}

	@Id
	@GeneratedValue
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	@Column(unique = true)
	public String getWorkGroupName() {
		return workGroupName;
	}

	public void setWorkGroupName(String workGroupName) {
		this.workGroupName = workGroupName;
	}

	public String getWorkGroupMemo() {
		return workGroupMemo;
	}

	public void setWorkGroupMemo(String workGroupMemo) {
		this.workGroupMemo = workGroupMemo;
	}

	@ManyToOne
	@JoinColumn(name = "PARENTWORKGROUP_ID")
	public UserMaintenanceGroup getParentworkGroup() {
		return parentworkGroup;
	}

	public void setParentworkGroup(UserMaintenanceGroup parentworkGroup) {
		this.parentworkGroup = parentworkGroup;
	}

	@OneToMany(cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENTWORKGROUP_ID")
	public Set<UserMaintenanceGroup> getSubWorkGroup() {
		return subWorkGroup;
	}

	public void setSubWorkGroup(Set<UserMaintenanceGroup> subWorkGroup) {
		this.subWorkGroup = subWorkGroup;
	}
	
	@Transient
	public Boolean getHasChild() {
		return hasChild;
	}

	public void setHasChild(Boolean hasChild) {
		this.hasChild = hasChild;
	}

	@Transient
	@Deprecated
	public String getAppNames() {
		return appNames;
	}
	@Deprecated
	public void setAppNames(String appNames) {
		this.appNames = appNames;
	}
}