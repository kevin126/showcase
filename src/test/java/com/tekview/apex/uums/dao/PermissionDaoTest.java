/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Mar 14, 2011
 * File Name       : PermissionDaoTest.java
 *
 * APEX UUMS是上海泰信科技有限公司自主研发的一款网络管理产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2010 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao;

import java.util.List;
import java.util.Set;

import org.junit.Test;

import com.tekview.apex.uums.base.BaseTestCase;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.model.Permission;

/**
 * PermissionDao测试用例
 *
 * @author Xiaojiapeng
 * @version 1.0
 */
public class PermissionDaoTest extends BaseTestCase {
	
	private PermissionDao permissionDao;
	
	public PermissionDaoTest(){
		permissionDao = (PermissionDao) getApplicationContext().getBean("permissionDao");
	}
	
	@Test  //保存权限项
	public void testSavePermission(){
		Permission permission=new Permission();
		permission.setActionId("add_test_case");
		permission.setPermissionGroup("添加测试用例");
		permission.setPermissionName("添加测试用例");
		permission.setAppName("oss");  //设置应用名称
		permission.setPermissionDescription("添加测试用例权限描述!");
		permissionDao.savePermission(79L, permission);
	}
	@Test  //列出所有的权限组
	public void testQueryAllPermissionGroup(){
		List<Permission> permissionList=permissionDao.queryAllPermissionGroup(null);
		System.out.println("共有"+permissionList.size()+"个权限组");
		for (Permission permission : permissionList) {
			System.out.println("权限组名称："+permission.getPermissionName());
		}
	}
	@Test  //判断当前权限是否被角色使用
	public void testHasUsed(){
		boolean flag=permissionDao.hasUsed(1L);
		if (flag) {
			System.out.println("权限未被使用");
		}else {
			System.err.println("权限已被使用");
		}
	}
	@Test  //安应用名称查询所有的权限项和权限组并加载出子权限
	public void testQueryAllPermissionByAppName(){
		List<Permission> permissionList=permissionDao.queryAllPermissionByAppName(null);
		System.out.println("共有"+permissionList.size()+"个权限");
		for (Permission permission : permissionList) {
			System.out.println("权限名称："+permission.getPermissionName());
			Set<Permission> subPerms=permission.getSubPermissions();
			for (Permission permission2 : subPerms) {
				System.err.println("         子权限名称："+permission2.getPermissionName());
			}
		}
	}
	@Test  //通过actionId取权限项
	public void testGetByActionId(){
		Permission permission=permissionDao.getByActionId("topoMgmt");
		System.out.println("actionId为topoMgmt的权限应为：拓扑管理！");
		System.out.println("测试所得权限名称："+permission.getPermissionName());
	}
	@Test  // 进行Or查询时调用次方法
	public void testGetEntitiesByOrCondition(){
		List<Permission> permissionList=permissionDao.getEntitiesByOrCondition("permissionName","配置管理","添加附件");
		for (Permission permission : permissionList) {
			System.out.println("权限名称："+permission.getPermissionName());
		}
	}
	@Test  // 根据Id查询
	public void testGetById(){
		Permission permission=permissionDao.getById(2L);
		System.out.println("权限名称："+permission.getPermissionName());
	}
	@Test  // 分页查询
	public void testQueryByPage(){
		Criteria criteria=new Criteria();
		criteria.setLength(10);
		criteria.setOffset(0);
		List<Permission> permList=permissionDao.queryByPage(criteria);
		System.out.println("每页应显示条数：10条，实际显示条数："+permList.size()+"条。");
		for (Permission permission : permList) {
			System.out.println("权限名称："+permission.getPermissionName());
		}
	}
	@Test  //
	public void testDeleteEntity(){
		permissionDao.delete(93L);
	}
	@Test  //
	public void testDeleteByIds(){
		
	}
	@Test  //
	public void testGetAllEntities(){
		
	}
	@Test  //将查询条件封装为hql查找
	public void testGetEntityByHql(){
		System.out.println("将查询条件封装为hql查找");
		String hql=" order by id asc";
		List<Permission> permissions=permissionDao.getEntityByHql(hql);
		printPermissionInfos(permissions);
	}
	
	@Test  // 根据Id查询
	public void testGetByIdSort(){
		Permission permission=permissionDao.getById(1L);
		System.out.println("权限名称："+permission.getPermissionName());
		System.out.println("未排序前权限名称列表");
		printPermissionInfos(permission.getSubPermissions());
		System.out.println("------------------------------------------");
		System.out.println("排序后权限名称列表");
		printPermissionInfos(permission.getSortSubPermissions());
	}
	
	@Test  //
	public void testGetPagingEntities(){
	System.out.println();
	}
	@Test  //
	public void testGetPagingEntitiesByHql(){
	System.out.println();
	}
	@Test  //
	public void testGetEntityById(){
	System.out.println();
	}
	@Test  //
	public void testGetStatement(){
	System.out.println();
	}
	@Test  //
	public void testDeleteEntityByProperty(){
	System.out.println();
	}
	@Test  //
	public void testDeleteAllEntities(){
	System.out.println();
	}
	@Test  //
	public void testIsObjExist(){
	System.out.println();
	}
	@Test  //
	public void testUpdateOceanObject(){
	System.out.println();
	}
	@Test  //
	public void testGetEntitiesByOneProperty(){
		
	}
	@Test  //
	public void testGetEntitiesByPropNames(){
	System.out.println();
	}
	@Test  //
	public void testGetUniqueEntityByPropNames(){
	System.out.println();
	}
	@Test  //
	public void testCount(){
		
	}
	@Test  //
	public void testSave(){
	System.out.println();
	}
	@Test  //
	public void testDelete(){
	System.out.println();
	}
	@Test  //
	public void testUpdate(){
	System.out.println();
	}
	/**
	 * 打印权限基本信息
	 * @param permission 权限信息
	 */
	public void printPermissionInfo(Permission permission){
		if(permission!=null){
			System.out.print("id:"+permission.getId());
			System.out.print("Actionid:"+permission.getActionId());
			System.out.print("AppName:"+permission.getAppName());
			System.out.print("description:"+permission.getPermissionDescription());
			System.out.print("permission group:"+permission.getPermissionGroup());
			System.out.print("Name:"+permission.getPermissionName());
			System.out.println("wfGroup:"+permission.getWfGroup());
//			System.out.print("id:"+permission.g);
//			System.out.print("id:"+permission.getId());
			
		}
	}
	/**
	 * 打印权限列表信息
	 * @param permissions 权限列表
	 */
	public void printPermissionInfos(List<Permission> permissions){
		if(permissions!=null){
			for(Permission permission:permissions){
				printPermissionInfo(permission);
			}
		}
	}
	/**
	 * 打印权限列表信息
	 * @param permissions 权限列表
	 */
	public void printPermissionInfos(Set<Permission> permissions){
		if(permissions!=null){
			for(Permission permission:permissions){
				printPermissionInfo(permission);
			}
		}
	}
}
