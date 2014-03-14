/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 27, 2011
 * File Name       : PermissionServiceTest.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service.impl;

import org.junit.Test;

import com.tekview.apex.uums.base.BaseTestCase;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.model.Administrator;
import com.tekview.apex.uums.service.AdministratorService;

/**
 * 管理员测试用例
 */
public class AdministratorServiceTest extends BaseTestCase {
	private AdministratorService administratorService = null;

	/**
	 * Service初始化
	 */
	public AdministratorServiceTest() {
		administratorService = (AdministratorService) getApplicationContext()
				.getBean("administratorService");
	}

	@Test // 添加管理员
	public void testAddAdministrator(){
		Administrator admin=new Administrator();
		admin.setName("admin");
		admin.setRealName("坚持到底");
		admin.setMail("hello@gmail.com");
		admin.setMobile("88888888");
		admin.setMsn("hello@gmail.com");
		admin.setPassword("admin");
		administratorService.save(admin);
	}
	@Test //获取管理员信息
	public void testGetById(){
		Administrator admin=administratorService.getById(3L);
		System.out.println("管理员名称："+admin.getName());
	}
	@Test //查询管理员
	public void testQueryByPage(){
		Criteria criteria = new Criteria();
		criteria.setOffset(0);
		criteria.setLength(Integer.MAX_VALUE);
		PageList<Administrator> admins=administratorService.queryByPage(criteria);
		if(admins!=null){
			System.out.println("共有:"+admins.size()+"个管理员!");
		}
	}
	@Test //修改管理员信息
 	public void testUpdate(){
		Administrator admin=administratorService.getById(3L);
		admin.setMail("administrator@tekview.com");
		admin.setMobile("999999999");
		admin.setEnabled(1); //启用管理员
		administratorService.update(admin);
	}
}
