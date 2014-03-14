/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 26, 2011
 * File Name       : PermissionAction.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.permission;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.tekview.apex.uums.core.web.action.BaseAction;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.service.PermissionService;
/**
 * 权限管理Action
 */
@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Namespace("/permission") // 指定名称空间
@Results( {
		@Result(name = "list", location = "/WEB-INF/jsps/permission/permission-list.jsp")})
public class PermissionAction extends BaseAction implements Serializable {
	private static final long serialVersionUID = 7963270821414441953L;
	@Autowired
	private PermissionService permissionService;
	//权限列表
	private List<Permission> permissionList=new ArrayList<Permission>();
	private String appName; //权限所属应用
	//权限列表
	public String list(){
		permissionList=permissionService.queryAllPermissionByAppName(appName);
		return "list";
	}
	public List<Permission> getPermissionList() {
		return permissionList;
	}

	public void setPermissionList(List<Permission> permissionList) {
		this.permissionList = permissionList;
	}

	public String getAppName() {
		return appName;
	}
	public void setAppName(String appName) {
		this.appName = appName;
	}
	
}
