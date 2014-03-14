/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : PermissionServiceTest.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service.impl;

import java.util.List;

import org.junit.Test;

import com.tekview.apex.uums.base.BaseTestCase;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.service.PermissionService;

/**
 * 权限测试用例
 * 
 */
public class PermissionServiceTest extends BaseTestCase {
	private PermissionService permissionService = null;

	/**
	 * Service初始化
	 */
	public PermissionServiceTest() {
		permissionService = (PermissionService) getApplicationContext()
				.getBean("permissionService");
	}
	//添加权限组 与权限项的区别是缺少部分字段
	@Test
	public void testSavePermissionGroup(){
		Permission permissionGroup=new Permission();
		permissionGroup.setActionId("group13");
		permissionGroup.setPermissionGroup("测试用例");
		permissionGroup.setPermissionName("测试用例");
		permissionService.save(permissionGroup);
	}
	@Test //添加权限项，首先要找到权限组
	public void testSavePermission(){
		Permission permission=new Permission();
		permission.setActionId("add_test_case");
		permission.setPermissionGroup("添加测试用例");
		permission.setPermissionName("添加测试用例");
		permission.setAppName("oss");  //设置应用名称
		permission.setPermissionDescription("添加测试用例权限描述!");
		permissionService.savePermission(79L,permission);
	}
	@Test //编辑权限组
	public void testUpdatePermissionGroup(){
		Permission permissionGroup=permissionService.getById(79L);
		permissionGroup.setPermissionGroup("测试用例-修改");
		permissionGroup.setPermissionName("测试用例-修改");
		permissionService.update(permissionGroup);
	}
	@Test //编辑权限项
	public void testUpdatePermission(){
		Permission permission=permissionService.getById(82L);
		Permission permissionGroup=permissionService.getById(76L);
		permission.setParentPermission(permissionGroup);
		permissionService.update(permission);
	}
	@Test //列出系统中的权限组
	public void testQueryAllPermissionGroup(){
		String appName="oss";  //null,oss,nm
		List<Permission> permissionGroups=permissionService.queryAllPermissionGroup(appName);
		System.out.println("系统中共用"+permissionGroups.size()+"个权限组");
	}
	@Test //删除权限 //如果该权限项已经被角色关联，那么需要提示用户无法删除
	public void testDelete(){
		permissionService.delete(70L);
	}
}
