/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Mar 17, 2011
 * File Name       : WorkGroupDaoTest.java
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
import com.tekview.apex.uums.model.UserMaintenanceGroup;
/**
 * 工作组DAO层测试用例
 */
public class WorkGroupDaoTest extends BaseTestCase {
	private WorkGroupDao workGroupDao;
	public WorkGroupDaoTest() {
		workGroupDao = (WorkGroupDao) getApplicationContext().getBean("workGroupDao");
	}
	
	@Test  //得到所有一级根工作组
	public  void testGetAllRootWorkGroup(){
		System.out.println("得到所有一级根工作组");
		List<UserMaintenanceGroup> userMaintenanceGroups=workGroupDao.getAllRootWorkGroup();
		printUserMaintenanceGroupInfos(userMaintenanceGroups);
	}
	@Test  //将完整的查询条件封装为hql查找,包括关键字select
	public  void testGetEntityByFullHql(){
		System.out.println("将完整的查询条件封装为hql查找,包括关键字select");
		String hql="FROM UserMaintenanceGroup workGroup WHERE workGroup.parentworkGroup.id =1";
		List<UserMaintenanceGroup> userMaintenanceGroups=workGroupDao.getEntityByFullHql(hql);
		printUserMaintenanceGroupInfos(userMaintenanceGroups);
	}
	@Test  //获取所有的工作组列表
	public  void testGetGroupByAll(){
		System.out.println("获取所有的工作组列表");
		List<UserMaintenanceGroup> userMaintenanceGroups=workGroupDao.getAllWorkGroup();
		printUserMaintenanceGroupInfos(userMaintenanceGroups);
	}
	@Test  //通过id查询
	public  void testGetGroupById(){
		System.out.println("通过id查询");
		Long id=1L;
		UserMaintenanceGroup userMaintenanceGroup=workGroupDao.getById(id);
		printUserMaintenanceGroupInfo(userMaintenanceGroup);
	}
	@Test  //通过工作组名称获取工作组信息
	public  void testGetGroupByName(){
		System.out.println("通过工作组名称获取工作组信息");
		String workGroupName="默认组";
		UserMaintenanceGroup userMaintenanceGroup=workGroupDao.getByName(workGroupName);
		printUserMaintenanceGroupInfo(userMaintenanceGroup);
	}
	@Test  //根据指定的条件获符合要求的对象，以分页的形式返回
	public  void testGetFiexedObjectsInPage(){
		System.out.println("根据指定的条件获符合要求的对象，以分页的形式返回");
		int start=0;
		int limit=20;
		String hql="from UserMaintenanceGroup";
		Object[] objects=workGroupDao.getFiexedObjectsInPage(start, limit, hql);
	}
	@Test  //根据实体对象的某个属性查询唯一的实体对象
	public  void testGetUniqueEntityByOneProperty(){
		System.out.println("根据实体对象的某个属性查询唯一的实体对象");
		String propertyName="id";
		Long value=1L;
		UserMaintenanceGroup userMaintenanceGroup=workGroupDao.getUniqueEntityByOneProperty(propertyName, value);
		printUserMaintenanceGroupInfo(userMaintenanceGroup);
	}
	@Test  //保存对象到数据库中
	public  void testSaveEntity(){
		System.out.println("保存对象到数据库中");
		UserMaintenanceGroup userMaintenanceGroup=new UserMaintenanceGroup();
		userMaintenanceGroup.setAppNames("oss");
		userMaintenanceGroup.setWorkGroupName("testcase");
		userMaintenanceGroup.setWorkGroupMemo("memo");
		UserMaintenanceGroup parentworkGroup=workGroupDao.getById(1L);
		userMaintenanceGroup.setParentworkGroup(parentworkGroup);
		workGroupDao.save(userMaintenanceGroup);
	}
	@Test  //根据实体对象的某个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER';
	public  void testGetEntitiesByOneProperty(){
		System.out.println("根据实体对象的某个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER';");
		String propertyName="parentworkGroup.id";
		Long value=1L;
		List<UserMaintenanceGroup> userMaintenanceGroups=workGroupDao.getEntitiesByOneProperty(propertyName, value);
		printUserMaintenanceGroupInfos(userMaintenanceGroups);
	}
	@Test  //修改记录信息
	public  void testUpdateEntity(){
		System.out.println("修改记录信息");
		UserMaintenanceGroup workGroup=workGroupDao.getById(5L);
		workGroup.setAppNames("modify");
		workGroup.setWorkGroupMemo("modify memo");
		workGroupDao.update(workGroup);
		System.out.println("修改记录信息成功!");
	}
	@Test  //删除数据库中指定ID的记录
	public  void testDeleteEntity(){
		System.out.println("删除数据库中指定ID的记录");
		Long id=5L;
		workGroupDao.delete(id);
		System.out.println("删除成功!");
	}
	/**
	 * 打印工作组基本信息
	 * @param workGroup 工作组信息
	 */
	public void printUserMaintenanceGroupInfo(UserMaintenanceGroup workGroup){
		System.out.print("id:"+workGroup.getId());
		System.out.print(" groupName:"+workGroup.getWorkGroupName());
		System.out.print(" memo:"+workGroup.getWorkGroupMemo());
		System.out.print(" hasChild:"+workGroup.getHasChild());
		System.out.println(" appNames:"+workGroup.getAppNames());
	}
	/**
	 * 打印工作组列表信息
	 * @param workGroups 工作组列表
	 */
	public void printUserMaintenanceGroupInfos(List<UserMaintenanceGroup> workGroups){
		if(workGroups!=null && workGroups.size()>0){
			for(UserMaintenanceGroup workGroup:workGroups){
				printUserMaintenanceGroupInfo(workGroup);
			}
		}
	}

	/**
	 * 根据parentId获得工作组信息，包含工作组人数信息
	 */
	@Test
	public void testGetAllWorkGroupByParentId(){
		List<Object> objList=workGroupDao.getAllWorkGroupByParentId(null,0,5);
		System.out.println("hello");
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
	
	@Test	//根据参数名 获得工作组数量
	public void testCountEntitiesByPropNames(){
		int count=workGroupDao.countEntitiesByPropNames(new String[]{"parentworkGroup.id"}, new Object[]{null});
		System.out.println(count);
		
	}
	
	/**
	 * 向工作组中添加用户成员
	 */
	@Test
	public void testAddUserToGroup(){
		List<Long> userIds= new ArrayList<Long>();
		userIds.add(1L);
		userIds.add(5L);
		userIds.add(2L);
		workGroupDao.addUserToGroup(1L, userIds);
		
	}
	/**
	 * 删除工作组成员
	 */
	@Test
	public void testDeleteWorkGroupMember(){
		List<Long> userIds=new ArrayList<Long>();
		userIds.add(5L);
		userIds.add(2L);
		workGroupDao.deleteWorkGroupMember(1L, userIds);
	}
	// 生成测试用例签名
	public static void main(String args[]) {
		Class<?> c1 = null; // 声明Class对象
		try {
			c1 = Class.forName("com.tekview.apex.uums.rmi.service.impl.WorkGroupServiceableImpl");
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
