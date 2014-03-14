/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Mar 15, 2011
 * File Name       : UserDeptDaoTest.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import com.tekview.apex.uums.base.BaseTestCase;
import com.tekview.apex.uums.model.UserDept;

/**
 * 部门DAO测试用例
 */
public class UserDeptDaoTest extends BaseTestCase {
	private UserDeptDao userDeptDao;

	public UserDeptDaoTest() {
		userDeptDao = (UserDeptDao) getApplicationContext().getBean("userDeptDao");
	}
	@Test  //通过部门名称查询部门
	public  void testGetByName(){
		System.out.println("通过部门名称查询部门");
		String deptName="默认部门";
		UserDept userDept=userDeptDao.getByName(deptName);
		printUserDeptInfo(userDept);
	}
	@Test  //查看父部门下的所有部门
	public  void testGetAllDeptByParentId(){
		System.out.println("查看父部门下的所有部门");
		String parentId="1";
		List<UserDept> userDepts=userDeptDao.getAllDeptByParentId(parentId);
		printUserDeptInfos(userDepts);
	}
	@Test  //删除部门
	public  void testDeleteUserDept(){
		System.out.println("删除部门");
		String deptName="'testCaseDept'";
		userDeptDao.deleteUserDept(deptName);
		System.out.println("删除部门成功!");
	}
	@Test  //查询所有部门
	public  void testGetAllDept(){
		System.out.println("查询所有部门");
		List<UserDept> userDepts=userDeptDao.getAllDept();
		printUserDeptInfos(userDepts);
	}
	@Test  //保存部门新信息
	public  void testSaveEntity(){
		System.out.println("保存部门新信息");
		UserDept userDept=new UserDept();
		userDept.setAppNames("OssWorks");
		userDept.setDeptName("testCaseDept");
		userDept.setDeptMemo("test cas memo");
		userDept.setHasChild(false);
		userDept.setName("name");
		Long userDeptId=userDeptDao.saveEntity(userDept);
		System.out.println("新添加的部门标识为:"+userDeptId);
	}
	@Test  //得到所有一级根部门
	public  void testGetAllRootDept(){
		System.out.println("得到所有一级根部门");
		List<UserDept> userDepts=userDeptDao.getAllRootDept();
		printUserDeptInfos(userDepts);
	}
	@Test  //根据实体对象的某个属性查询唯一的实体对象
	public  void testGetUniqueEntityByOneProperty(){
		System.out.println("根据实体对象的某个属性查询唯一的实体对象");
		String propertyName="id";
		Long value=1L;
		UserDept userDept=userDeptDao.getUniqueEntityByOneProperty(propertyName, value);
		printUserDeptInfo(userDept);
	}
	@Test  //根据实体对象的某个属性查询实体对象
	public  void testGetEntitiesByOneProperty(){
		System.out.println("根据实体对象的某个属性查询实体对象");
		String propertyName="parentUserDept.id";
		Long value=1L;
		List<UserDept> userDepts=userDeptDao.getEntitiesByOneProperty(propertyName,value);
		printUserDeptInfos(userDepts);
	}
	@Test //修改部门信息
	public void testupdateEntity(){
		System.out.println("修改部门信息");
		UserDept userDept=userDeptDao.getByName("默认部门");
		if(userDept!=null){
			userDept.setDeptMemo("modify");
			userDeptDao.update(userDept);
		}
		System.out.println("修改部门信息成功!");
	}
	/**
	 * 打印部门基本信息
	 * @param userDept 部门信息
	 */
	public void printUserDeptInfo(UserDept userDept){
		if(userDept!=null){
			if(userDept.getId()!=0L){
				System.out.print(" id:"+userDept.getId());
			}
			if(userDept.getName()!=null){
				System.out.print(" Name:"+userDept.getName());
			}
			if(userDept.getAppNames()!=null){
				System.out.print(" appNames:"+userDept.getAppNames());
			}
			if(userDept.getDeptName()!=null){
				System.out.print(" deptName:"+userDept.getDeptName());
			}
			if(userDept.getDeptMemo()!=null){
				System.out.print(" DeptMemo:"+userDept.getDeptMemo());
			}
			System.out.println(" Has child:"+userDept.getHasChild());
		}
	}
	/**
	 * 打印部门列表
	 * @param userDepts 部门列表
	 */
	public void printUserDeptInfos(List<UserDept> userDepts){
		if(userDepts!=null && userDepts.size()>0){
			for(UserDept userDept:userDepts){
				printUserDeptInfo(userDept);
			}
		}
	}
	
	/**
	 * 根据parentId获得部门信息，包含部门人数信息
	 */
	@Test
	public void testGetAllUserDeptByParentDeptId(){
		List<Object> objList=userDeptDao.getAllUserDeptByParentId(null,0,5);
		if(objList!=null && objList.size()>0){
			for(Object data:objList){
				Object[] dataSubObjects=(Object[])data;
				if(dataSubObjects!=null && dataSubObjects.length>0){
					for(int i=0;i<dataSubObjects.length;i++){
						System.out.println(dataSubObjects[i]);
					}
				}
			}
		}
	}
	
	/**
	 * 向部门中添加用户成员
	 */
	@Test
	public void testAddUserToDept(){
		List<Long> userIds=new ArrayList<Long>();
		userIds.add(1L);
		userIds.add(5L);
		userDeptDao.addUserToDept(1L, userIds);
	}
	
	/**
	 * 删除部门中的用户成员
	 */
	@Test
	public void testDeleteUserDeptMember(){
		List<Long> userIds=new ArrayList<Long>();
		userIds.add(1L);
		userIds.add(5L);
		userDeptDao.deleteUserDeptMember(1L, userIds);
	}
	
	@Test	//根据参数名 获得工作组数量
	public void testCountEntitiesByPropNames(){
		int count=userDeptDao.countEntitiesByPropNames(new String[]{"parentworkGroup.id"}, new Object[]{null});
		System.out.println(count);
		
	}
	// 生成测试用例签名
	public static void main(String args[]) {
		Class<?> c1 = null; // 声明Class对象
		try {
			c1 = Class.forName("com.tekview.apex.uums.dao.impl.UserDeptDaoImpl");
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		Method m[] = c1.getMethods(); // 取得全部的方法
		for (int i = 0; i < m.length; i++) {
			Class<?> r = m[i].getReturnType();// 得到方法的返回值类型

			Class<?> p[] = m[i].getParameterTypes();// 得到全部的参数类型
			int xx = m[i].getModifiers();// 得到方法的修饰符
			System.out.print("@Test  //\n");
			System.out.print(Modifier.toString(xx) + " ");// 还原修饰符
			System.out.print(" void ");// 得到方法名称
			System.out.print("test");
			System.out.print(m[i].getName().substring(0, 1).toUpperCase());
			System.out.print(m[i].getName().substring(1,
					m[i].getName().length()));
			System.out.print("(){\n");
			System.out.print("System.out.println();\n");
			System.out.print("}");
			System.out.println();
		}
	}
}
