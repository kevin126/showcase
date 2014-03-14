/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 24, 2011
 * File Name       : UserDeptServiceTest.java
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

import org.apache.commons.lang.xwork.StringUtils;
import org.junit.Test;

import com.tekview.apex.uums.base.BaseTestCase;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.criterion.Restrictions;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.model.UserDept;
import com.tekview.apex.uums.service.UserDeptService;

/**
 *  部门Service测试实例
 * @author Xiaojiapeng
 *
 */
public class UserDeptServiceTest extends BaseTestCase {

	private UserDeptService userDeptService=null;
	
	/**
	 * 初始化
	 */
	public UserDeptServiceTest(){
		userDeptService= (UserDeptService)getApplicationContext().getBean("userDeptService");
	}
	
	@Test		//添加部门
	public void testAddUserDept(){
		try {
			userDeptService.addUserDept("研发部", "研发NM、OSS以及以后的新产品", null,null);
			userDeptService.addUserDept("研发部1", "研发NM、OSS以及以后的新产品", null,null);
			userDeptService.addUserDept("研发部2", "研发NM、OSS以及以后的新产品", null,null);
			userDeptService.addUserDept("研发部3", "研发NM、OSS以及以后的新产品", null,null);
			userDeptService.addUserDept("测试部", "测试NM、OSS以及以后的新产品", null,null);
			userDeptService.addUserDept("财务部", "管理公司财务", null,null);
			userDeptService.addUserDept("人事部", "管理公司产品出售", null,null);
			System.out.println("添加成功。。。。。。。。。。。。。。");
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("添加失败。。。。。。。。。。。");
		}
		
	}
	
	@Test		//删除部门
	public void testDeleteUserDept(){
		try {
			userDeptService.deleteUserDept("研发部");
			System.out.println("删除==研发部==成功");
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("删除==研发部==失败");
		}
		
	}
	
	@Test		//批量删除部门
	public void testDeleteUserDepts(){
		try {
			List<String> id = new ArrayList<String>();
			id.add("2");
			id.add("3");
			userDeptService.deleteUserDepts(id);
			System.out.println("批量删除成功");
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("批量删除失败");
		}
		
	}
	
	@Test		//获取所有父部门下的全部子部门
	public void testGetAllDeptByParentId(){
		try {
			List<UserDept> userDeptList = userDeptService.getAllDeptByParentId("1");
			if(userDeptList==null)
				System.out.println("没有查询到数据");
			else{
				for (UserDept userDept : userDeptList) {
					System.out.println(userDept.getDeptName());
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("查询出错");
		}
	}
	
	@Test		//更新部门信息
	public void testUpdateUserDept(){
		try {
			userDeptService.updateUserDept("4", "泰信科技", null,null);
			System.out.println((userDeptService.getById(4L)).getDeptName());
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("更新失败！！！");
		}
		
	}
	
	@Test		//删除部门
	public void testDelete(){
		try {
			userDeptService.delete(5L);
			System.out.println("删除成功");
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("删除失败");
		}
	}
	
	@Test			//根据Id查看部门信息
	public void testGetById(){
		try {
			UserDept userDept = userDeptService.getById(1L);
			System.out.println(userDept.getDeptName());
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("GetById方法======查询失败");
		}
		
		
	}
	
	@Test			//分页查询
	public void testQueryByPage(){
		try {
			 Criteria criteria = new Criteria();
		        String name = "研发部";
		        if (StringUtils.isNotEmpty(name)) {
		            //查询用户名中含有研发部字符串的用户
		            criteria.add(Restrictions.like("deptName", name));
		        }
		        criteria.setOffset(0);
		        criteria.setLength(10);
		        PageList userDeptList = userDeptService.queryByPage(criteria);
		        System.out.println("list size:" + userDeptList.size());
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("QueryByPage方法====查询失败");
		}
	}
	
	
	@Test			//添加部门
	public void testSave(){
		try {
			UserDept entity = new UserDept();
			entity.setDeptName("研发部");
			userDeptService.save(entity);
			System.out.println("Save方法添加成功");
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Save方法添加失败");
		}
		
		
	}
	
	@Test			//更新部门
	public void testUpdate(){
		try {
			UserDept entity = userDeptService.getById(5L);
			entity.setDeptName("研发部11");
			userDeptService.update(entity);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("Update方法更新失败");
		}
	}
}
