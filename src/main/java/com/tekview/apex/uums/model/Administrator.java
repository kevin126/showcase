/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 27, 2011
 * File Name       : User.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 管理员模型
 * 
 */
@Entity
@Table(name = "ca_administrator")
public class Administrator implements Serializable {
	private static final long serialVersionUID = 107435744602168957L;
	/**
	 * 领域对象的代理主键.
	 */
	private long id;

	/**
	 * 登录时用的用户名，不是姓名
	 */
	private String name;

	/**
	 * 真实姓名
	 */
	private String realName;

	/**
	 * 密码（需加密）
	 */
	private String password;

	/**
	 * 管理员状态（1 ：启用；２ ：禁用；其他预留）
	 */
	private int enabled;
	/**
	 * 是否可以删除,默认可以删除
	 */
	private boolean deletable = true;

	/**
	 * 是否在线 ,默认为不在线
	 */
	private boolean online = false;

	/**
	 * 最后一次登陆时间
	 */
	private Date lastLoginTime;
	/**
	 * 手机号码
	 */
	private String mobile;

	/**
	 * 办公电话
	 */
	private String office;

	/**
	 * 电子邮件
	 */
	private String mail;

	/**
	 * msn
	 */
	private String msn;

	@Id
	@GeneratedValue
	public long getId() {
		return id;
	}

	public Administrator() {
	}

	public void setId(long id) {
		this.id = id;
	}
	@Column(unique = true)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getEnabled() {
		return enabled;
	}

	public void setEnabled(int enabled) {
		this.enabled = enabled;
	}

	public boolean isDeletable() {
		return deletable;
	}

	public void setDeletable(boolean deletable) {
		this.deletable = deletable;
	}

	public boolean isOnline() {
		return online;
	}

	public void setOnline(boolean online) {
		this.online = online;
	}
	public Date getLastLoginTime() {
		return lastLoginTime;
	}

	public void setLastLoginTime(Date lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getOffice() {
		return office;
	}

	public void setOffice(String office) {
		this.office = office;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public String getMsn() {
		return msn;
	}

	public void setMsn(String msn) {
		this.msn = msn;
	}

}
