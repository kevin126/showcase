/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : UserServiceTest.java
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
import java.util.Set;

import org.apache.commons.lang.xwork.StringUtils;
import org.junit.Test;

import com.tekview.apex.uums.base.BaseTestCase;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.criterion.Restrictions;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.model.Role;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.service.UserService;
/**
 * 用户Service实现测试类
 */
public class UserServiceTest extends BaseTestCase{
	private UserService userService = null;

	/**
	 * Service初始化
	 */
	public UserServiceTest() {
		userService = (UserService) getApplicationContext().getBean(
				"userService");
	}

	@Test
	// 获取用户信息
	public void testGetUserById() {
		User user = userService.getById(1L);
		System.out.println(user.getName());
	}

	@Test
	// 加载用户信息时加载角色
	public void testGetUserWithRolesById() {
		User user = userService.getUserWithRolesById(1L);
		Set<Role> roles = user.getRoles();
		for (Role role : roles) {
			System.out.println("角色名称:" + role.getRoleName());
		}
	}

	@Test
	// 创建用户
	public void testSaveUser() {
		User user = new User();
		user.setName("administrator");
		user.setPassword("123456789");
		user.setEmployeeNo("001");// 设置工号
		user.setInternetAccount("SD7987FS");// 上网帐号
		// user.setDepet(); //设置部门
		// user.setWorkGroup(); //设置工作组
		// user.setRoles(); //设置角色
		user.setMail("admin@tekview.com");
		user.setMobile("13482009055");
		user.setOffice("021-2342342");
		userService.save(user);
	}

	@Test
	// 修改用户
	public void testUpdate() {
		User user = userService.getById(9L);
		user.setName("modify userName");
		userService.update(user);
	}

	@Test
	// 删除用户
	public void testDelete() {
		userService.delete(3L);
	}
	
	@Test
	//批量删除用户
	public void testDeletes(){
		List<String> ids = new ArrayList<String>();
		ids.add("4");
		userService.deleteUsers(ids);
	}

	@Test
	// 分页查询用户信息
	public void testQueryByPage() {
		Criteria criteria = new Criteria();
		String name = "b";
		if (StringUtils.isNotEmpty(name)) {
			// 查询用户名中含有b字符串的用户
			criteria.add(Restrictions.like("name", name));
		}
		criteria.setOffset(0);
		criteria.setLength(10);
		PageList<User> userList = userService.queryByPage(criteria);
		System.out.println("list size:" + userList.size());
	}

	@Test
	// 测试修改用户密码
	public void testModifyPassword() throws Exception {
		String newPasswd = "111111";
		String oldPasswd = "MTIzNDU2Nzg5";
		String confirmPasswd = "111111";
		userService.modifyPassword(6L, oldPasswd, newPasswd, confirmPasswd);
	}
}
