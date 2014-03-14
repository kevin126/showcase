/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Mar 14, 2011
 * File Name       : RoleDaoTest.java
 *
 * APEX UUMS是上海泰信科技有限公司自主研发的一款网络管理产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2010 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import com.tekview.apex.uums.base.BaseTestCase;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.model.Role;
import com.tekview.apex.uums.model.User;
import org.junit.Test;

/**
 * 
 *
 * @author Xiaojiapeng
 * @version 1.0
 */
public class RoleDaoTest extends BaseTestCase {
	
	private RoleDao roleDao;
	
	public RoleDaoTest(){
		roleDao = (RoleDao) getApplicationContext().getBean("roleDao");
	}
	@Test  // 查看角色所有权限
	public void testQueryPermissions(){
		Long roleId=1L;	//角色标识
		List<Permission> permList=roleDao.queryPermissions(roleId);
		for (Permission permission : permList) {
			System.out.println("角色标识为1的所有权限名称："+permission.getPermissionName());
		}
	}
	@Test  //查看角色下所有用户
	public void testQueryUsers(){
		Long roleId=1L;		//角色标识
		List<User> userList=roleDao.queryUsers(roleId);
		for (User user : userList) {
			System.out.println("角色标识为1的所有用户名称："+user.getName());
		}
	}
	@Test  //添加角色的同时添加权限项
	public void testSaveRoleWithPermissionsByPermissionIds(){
		Role role=new Role();
		role.setRoleName("测试用例角色permission1");
		role.setDeletable(true); //允许删除
		role.setRoleDescription("测试用例角色permission1");
		roleDao.saveRoleWithPermissions(role,new Long[]{2L,3L});
	}
	@Test  //添加角色的同时添加权限项
	public void testSaveRoleWithPermissionsByPermissionActionIds(){
		Role role=new Role();
		role.setRoleName("测试用例角色permission2");
		role.setDeletable(true); //允许删除
		role.setRoleDescription("测试用例角色permission2");
		roleDao.saveRoleWithPermissions(role,new String[]{"configMgmt","topoMgmt"});
	}
	@Test  //修改角色权限
	public void testUpdateRoleWithPermissions(){
		roleDao.updateRoleWithPermissions(23L, new Long[]{2L,3L});
	}
	@Test  //加载角色信息的同时加载权限
	public void testGetByIdWithPermissions(){
		Role role=roleDao.getByIdWithPermissions(1L);
		System.out.println("角色名称为:"+role.getRoleName());
		Set<Permission> permissions=role.getPerms();
		System.out.println("角色下共有:"+permissions.size()+"个权限!");
		System.out.println("角色下共有："+role.getUsers().size()+"个用户");
	}
	@Test  // 当前角色是否被使用
	public void testHasUsed(){
		boolean flag=roleDao.hasUsed(4L);
		if (flag) {
			System.out.println("当前角色被使用");
		}else {
			System.out.println("当前角色未被使用");
		}
	}
	@Test  //角色添加用户
	public void testAddUsers(){
		roleDao.AddUsers(2L, new Long[]{2L,5L});
	}
	@Test  // 修改角色用户
	public void testUpdateRoleWithUsers(){
		roleDao.updateRoleWithUsers(2L, new Long[]{2L});
	}
	@Test  //分页查询角色下的用户
	public void testQueryUsersByPage(){
		List<User> users=roleDao.queryUsersByPage(2L, 0, 2);
		if(users!=null){
			for(User user:users){
				System.out.println("id="+user.getId()+" Name="+user.getName());
			}
		}
	}
	@Test  //移除角色下面的用户
	public void testRemoveRoleMembers(){
		List<Long> members=new ArrayList<Long>();
		members.add(2L);
		roleDao.removeRoleMembers(2L, members);
	}
	@Test  //向角色中添中用户
	public void testAddUserToRole(){
		roleDao.addUserToRole(2L, java.util.Arrays.asList(new Long[]{2L,5L}));
	}
	@Test  //角色添加权限
	public void testAddPermissions(){
		roleDao.addPermissions(23L,new Long[]{3L,4L,6L});
	}
	@Test  //根据Id获得角色信息
	public void testGetById(){
		Role role=roleDao.getById(24L);
		System.out.println(role.getRoleName());
	}
	@Test  //根据一个属性获得角色信息
	public void testGetEntitiesByOneProperty(){
		List<Role> roleList=roleDao.getEntitiesByOneProperty("roleName", "系统管理员");
		for (Role role : roleList) {
			System.out.println("系统管理员的描述："+role.getRoleDescription());
		}
	}
	@Test  // 查询所有角色
	public void testGetAllEntities(){
		List<Role> roleList=roleDao.getAllEntities();
		for (Role role : roleList) {
			System.out.println("角色名称："+role.getRoleName());
			System.out.println("角色拥有的权限数："+role.getPerms().size());
		}
	}
	@Test  //
	public void testGetPagingEntities(){
		List<Role> roleList=roleDao.getPagingEntities(0, 5);
		for (Role role : roleList) {
			System.out.println("角色名称:"+role.getRoleName());
		}
	}
	@Test  //
	public void testGetEntitiesByOrCondition(){
		List<Role> roleList=roleDao.getEntitiesByOrCondition("roleName", "系统管理员");
		for (Role role : roleList) {
			System.out.println("角色名称："+role.getRoleName());
		}
	}
	@Test  // 分页查询
	public void testQueryByPage(){
		Criteria criteria=new Criteria();
		criteria.setOffset(0);
		criteria.setLength(10);
		List<Role> roleList=roleDao.queryByPage(criteria);
		for (Role role : roleList) {
			System.out.println("角色名称："+role.getRoleName());
		}
	}
	
	@Test	//根据Id集合查询角色信息
	public void testGetRolesByIds(){
		List<Long> roleIds=new ArrayList<Long>();
		roleIds.add(3L);
		roleIds.add(4L);
		roleIds.add(7L);
		List<Role> roles=roleDao.getRolesByIds(roleIds);
		for (Role role : roles) {
			System.out.println("所查到的角色名称为："+role.getRoleName());
		}
	}
	
	@Test //根据角色名称删除角色
	public void testDeleteRoleByName(){
		roleDao.deleteRole("测试用例角色permission1");
	}
	@Test //根据实体对象的某个属性查询唯一的实体对象
	public void testGetUniqueEntityByOneProperty(){
		System.out.println("根据实体对象的某个属性查询唯一的实体对象");
		String propertyName="id";
		Long value=1L;
		Role role=roleDao.getUniqueEntityByOneProperty(propertyName,value);
		System.out.println("角色名称："+role.getRoleName());
	}
	@Test //根据指定的条件获符合要求的对象，以分页的形式返回
	public void testgetFiexedObjectsInPage(){
		//test Object[] datas = roleDao.getFiexedObjectsInPage(this.getStartIndex(), this.getAsyPageSize(), "from Role");
		//Object中如果返回Role类型，需要进行类型转换
		System.out.println("根据指定的条件获符合要求的对象，以分页的形式返回");
		int start=0;
		int limit=20;
		String hql="from Role";
		Object[] roleList=roleDao.getFiexedObjectsInPage(start, limit, hql);
		if(roleList!=null){
			System.out.println("结果集长度为："+roleList.length);
			System.out.println("返回记录数："+roleList[0]);
			if(roleList[1]!=null){
				List<Object> objects=(List<Object>)roleList[1];
				if(objects!=null && objects.size()>0){
					if(objects.get(0) instanceof Role){
						List<Role> roles=(List<Role>)roleList[1];
						if(roles!=null){
							System.out.println("convert Role");
						}
					}
				}
			}
		}
	}
	
	/**
	 * 根据指定条件查询角色数量
	 */
	@Test
	public void testCountEntitiesByPropNames(){
		int count=roleDao.countEntitiesByPropNames(new String[]{"appName"}, new Object[]{"'nm'"});
		System.out.println("NM应用中的角色数量为："+count);
	}
	
	/**
	 * 根据应用名称查询所有角色
	 */
	@Test
	public void testGetRolesByAppName(){
		List<Object> nmRoleList=roleDao.getRolesByAppName("nm", 0, 5);
		if (nmRoleList.size() > 0 && nmRoleList != null) {
			for (Object object : nmRoleList) {
				Object[] objects = (Object[]) object;
				System.out.println();
				if (objects.length > 0 && objects != null) {
					for (int i = 0; i < objects.length; i++) {
						System.out.print("NM数据:"+objects[i]);
					}
				}
			}
		}
		List<Object> ossRoleList=roleDao.getRolesByAppName("oss", 0, 5);
		if (ossRoleList.size() > 0 && ossRoleList != null) {
			for (Object object : ossRoleList) {
				Object[] objects = (Object[]) object;
				System.out.println();
				if (objects.length > 0 && objects != null) {
					for (int i = 0; i < objects.length; i++) {
						System.out.print("OSS数据："+objects[i]);
					}
				}
			}
		}
	}

	@Test  //
	public void testGetEntityByHql(){
		
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
	public void testGetEntitiesByPropNames(){
		
	}
	@Test  //
	public void testGetUniqueEntityByPropNames(){
	System.out.println();
	}
	@Test  //
	public void testCount(){
		System.out.println(roleDao.count());
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
}
