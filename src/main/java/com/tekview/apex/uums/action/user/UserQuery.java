/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Apr 2, 2011
 * File Name       : UserQuery.java
 *
 * APEX UUMS是上海泰信科技有限公司自主研发的一款网络管理产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2010 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.user;

import java.io.Serializable;
import java.util.List;

/**
 * 
 *
 * @author Xiaojiapeng
 * @version 1.0
 */
public class UserQuery  implements Serializable{
	
	private static final long serialVersionUID = -5802095570724051777L;

	/**
	 * 用户名
	 */
	private String name;
	
	/**
	 * 姓名
	 */
	private String realName;
	
	/**
	 * 邮箱地址
	 */
	private String mail;
	
	/**
	 * 部门名称集合
	 */
	private List<String> deptNames;
	
	/**
	 * 工作组名称集合
	 */
	private List<String> workGroupNames;
	
	/**
	 * 查询开始记录号
	 */
	private int start;
	
	/**
	 * 查询条数
	 */
	private int limit;

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

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public List<String> getDeptNames() {
		return deptNames;
	}

	public void setDeptNames(List<String> deptNames) {
		this.deptNames = deptNames;
	}

	public List<String> getWorkGroupNames() {
		return workGroupNames;
	}

	public void setWorkGroupNames(List<String> workGroupNames) {
		this.workGroupNames = workGroupNames;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}
	
}
