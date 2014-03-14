/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : RoleServiceTest.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service.impl;

import java.util.List;
import java.util.Set;

import org.junit.Test;

import com.tekview.apex.uums.base.BaseTestCase;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.criterion.Order;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.model.Role;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.service.RoleService;

/**
 * 角色测试用例
 * 
 */
public class RoleServiceTest extends BaseTestCase {
	private RoleService roleService = null;
	/**
	 * Service初始化
	 */
	public RoleServiceTest() {
		roleService = (RoleService) getApplicationContext().getBean("roleService");
	}
	@Test //添加角色
	public void testSaveRole(){
		Role role=new Role();
		role.setRoleName("测试用例角色");
		role.setDeletable(true); //允许删除
		role.setRoleDescription("测试用例角色");
		roleService.save(role);
	}
	@Test //添加角色的时候添加权限
	public void testSaveRoleWithPermission(){
		Role role=new Role();
		role.setRoleName("测试用例角色permission");
		role.setDeletable(true); //允许删除
		role.setRoleDescription("测试用例角色permission");
		roleService.saveRoleWithPermissions(role,new Long[]{2L,3L});
	}
	@Test //角色添加权限
	public void testAddPermissions(){
		roleService.addPermissions(28L, new Long[]{4L,5L});
	}
	@Test //角色添加用户
	public void testAddUsers(){
		roleService.AddUsers(27L, new Long[]{1L,2L});
	}
	@Test //修改角色基本信息
	public void testUpdateRole(){
		Role role=roleService.getById(24L);
		role.setDeletable(true);
		roleService.update(role);
	}
	@Test //修改角色下面的权限信息
	public void testUpdateRoleWithPermissions(){
		roleService.updateRoleWithPermissions(28L, new Long[]{2L,3L});
	}
	@Test //修改角色下面的用户信息
	public void testUpdateRoleWithUsers(){
		roleService.updateRoleWithUsers(27L, new Long[]{4L,5L});
	}
	@Test //查看所有角色
	public void testQueryByPage(){
		Criteria criteria = new Criteria();
		criteria.addOrder(Order.asc("roleName"));
		criteria.setOffset(0);
		criteria.setLength(Integer.MAX_VALUE);
		PageList<Role> roles=roleService.queryByPage(criteria);
		System.out.println("系统中角色个数为:"+roles.getTotalCount());
	}
	@Test //获取角色
	public void testGetById(){
		Role role=roleService.getById(28L);
		System.out.println("角色名称为:"+role.getRoleName());
	}
	@Test //获取角色的同时加载权限
	public void testGetByIdWithPermissions(){
		Role role=roleService.getByIdWithPermissions(1L);
		System.out.println("角色名称为:"+role.getRoleName());
		Set<Permission> permissions=role.getPerms();
		System.out.println("角色下共有:"+permissions.size()+"个权限!");
	}
	@Test //删除角色
	public void testDelete(){
		roleService.delete(28L);
	}
	@Test //分页查询角色下的用户
	public void testQueryUsersByPage(){
		List<User> users=roleService.queryUsersByPage(3L, 0, 2);
		if(users!=null){
			for(User user:users){
				System.out.println("id="+user.getId()+" Name="+user.getName());
			}
		}
		
	}
}
