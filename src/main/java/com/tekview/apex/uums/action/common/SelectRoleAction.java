/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Apr 6, 2011
 * File Name       : SelectUserAction.java
 *
 * APEX UUMS是上海泰信科技有限公司自主研发的一款网络管理产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2010 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.common;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;

import com.tekview.apex.uums.action.role.RoleAppVo;
import com.tekview.apex.uums.core.web.action.BaseAction;
import com.tekview.apex.uums.service.RoleService;

/**
 * 
 *
 * @author Xiaojiapeng
 * @version 1.0
 */

@Namespace("/common")// 指定名称空间
@Results( {
		@Result(name = "success", location = "/WEB-INF/jsps/common/role-select.jsp")
	})
public class SelectRoleAction extends BaseAction {

	private static final long serialVersionUID = 3476780401307618096L;
	
	@Autowired
	private RoleService roleService;

	private List<RoleAppVo> nmRoleList = new ArrayList<RoleAppVo>(); // NM应用角色信息
	private List<RoleAppVo> ossRoleList = new ArrayList<RoleAppVo>(); // OSS应用角色信息
	private int nmRecords; // NM角色数量
	private int ossRecords; // OSS角色数量
	
	
	@Override
	public String execute() throws Exception {
		List<Object> nmList = roleService.getRolesByAppName("nm", getOffset(),
				10000);		//不分页 所以最大值设置10000 应该够了
		nmRecords = roleService
				.countEntitiesByPropNames(new Object[] { "'nm'" }) + 1; // 查询出来的角色中不包括系统管理员, 所以要+1
		if (nmList.size() > 0 && nmList != null) {
			for (Object object : nmList) {
				Object[] objects = (Object[]) object;
				if (objects.length > 0 && objects != null) {
					RoleAppVo roleAppVo = new RoleAppVo();
					roleAppVo.setId(((BigInteger) objects[0]).longValue());
					roleAppVo.setRoleName((String) objects[1]);
					roleAppVo.setRoleDescription((String) objects[2]);
					roleAppVo.setCount(((BigInteger) objects[3]).intValue());
					nmRoleList.add(roleAppVo);
				}
			}
		}
		List<Object> ossList = roleService.getRolesByAppName("oss",
				getOffset(), 10000);	//不分页 所以最大值设置10000 应该够了
		ossRecords = roleService
				.countEntitiesByPropNames(new Object[] { "'oss'" }) + 1; // 查询出来的角色中不包括系统管理员
		// 所以要+1
		if (ossList.size() > 0 && ossList != null) {
			for (Object object : ossList) {
				Object[] objects = (Object[]) object;
				if (objects.length > 0 && objects != null) {
					RoleAppVo roleAppVo = new RoleAppVo();
					roleAppVo.setId(((BigInteger) objects[0]).longValue());
					roleAppVo.setRoleName((String) objects[1]);
					roleAppVo.setRoleDescription((String) objects[2]);
					roleAppVo.setCount(((BigInteger) objects[3]).intValue());
					ossRoleList.add(roleAppVo);
				}
			}
		}
		return SUCCESS;
	}


	public RoleService getRoleService() {
		return roleService;
	}


	public void setRoleService(RoleService roleService) {
		this.roleService = roleService;
	}


	public List<RoleAppVo> getNmRoleList() {
		return nmRoleList;
	}


	public void setNmRoleList(List<RoleAppVo> nmRoleList) {
		this.nmRoleList = nmRoleList;
	}


	public List<RoleAppVo> getOssRoleList() {
		return ossRoleList;
	}


	public void setOssRoleList(List<RoleAppVo> ossRoleList) {
		this.ossRoleList = ossRoleList;
	}


	public int getNmRecords() {
		return nmRecords;
	}


	public void setNmRecords(int nmRecords) {
		this.nmRecords = nmRecords;
	}


	public int getOssRecords() {
		return ossRecords;
	}


	public void setOssRecords(int ossRecords) {
		this.ossRecords = ossRecords;
	}
}
