/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : UserDept.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.model;

import javax.persistence.*;

import com.tekview.apex.itsm.common.util.SysUtil;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * 部门模型
 */
//@Entity
//@Table(name = "ca_userdept")
public class UserDept implements Serializable {
	private static final long serialVersionUID = 4953802905709617203L;

	/**
	 * 数据库持久ID
	 */
	private long id;

	/**
	 * 部门名称
	 */
	private String deptName;

	/**
	 * js部分使用 与deptName相同*
	 */
	private String name;

	/**
	 * 部门备注
	 */
	private String deptMemo;

	/**
	 * 父用户组
	 */
	private UserDept parentUserDept;

	/**
	 * 子用户组
	 */
	private Set<UserDept> subUserDepts = new HashSet<UserDept>(0);

	/**
	 * 是否有子属性
	 */
	@Deprecated
	private Boolean hasChild = false;
	/**
	 * 所属于系统
	 */
	@Deprecated
	private String appNames;
	
	/**
	 * 资产审批负责人
	 */
	private User assUser=new User();

	public UserDept() {
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
	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	@Transient
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDeptMemo() {
		return deptMemo;
	}

	public void setDeptMemo(String deptMemo) {
		this.deptMemo = deptMemo;
	}

	@ManyToOne
	@JoinColumn(name = "PARENTUSERDEPT_ID")
	public UserDept getParentUserDept() {
		return parentUserDept;
	}

	public void setParentUserDept(UserDept parentUserDept) {
		this.parentUserDept = parentUserDept;
	}

	@OneToMany(cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENTUSERDEPT_ID")
	public Set<UserDept> getSubUserDepts() {
		return subUserDepts;
	}

	public void setSubUserDepts(Set<UserDept> subUserDepts) {
		this.subUserDepts = subUserDepts;
	}
	@Deprecated
	@Transient
	public Boolean getHasChild() {
		return hasChild;
	}
	@Deprecated
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
	
	@ManyToOne(optional = true,fetch=FetchType.EAGER)
    @JoinColumn(name = "assUserId")
	public User getAssUser() {
		return assUser;
	}

	public void setAssUser(User assUser) {
		this.assUser = assUser;
	}
	
	
	/**
	 * 获得打印列名
	 * @param columnName
	 * @return
	 */
	public String columnValue(String columnName){
		if (columnName != null && columnName.trim().length() > 0) {
			String colName=columnName.trim();
			if (colName.equalsIgnoreCase("部门名称")) {
				return SysUtil.HtmlToText(deptName);
			}else if (colName.equalsIgnoreCase("部门描述")) {
				return SysUtil.HtmlToText(deptMemo);
			}else if(colName.equalsIgnoreCase("父部门Id")){
				if (parentUserDept!=null) 
					return SysUtil.HtmlToText(String.valueOf(parentUserDept.getId()));
				else {
					return "";
				}
			}else if (colName.equalsIgnoreCase("父部门名称")) {
				if(parentUserDept!=null)
				return SysUtil.HtmlToText(parentUserDept.getDeptName());
				else {
					return "";
				}
			}else {
				return "";
			}
		}else 
		return "";
	}

}