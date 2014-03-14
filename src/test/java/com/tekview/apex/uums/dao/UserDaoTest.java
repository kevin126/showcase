/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Mar 11, 2011
 * File Name       : UserDaoTest.java
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
import java.util.Set;

import org.junit.Test;

import com.tekview.apex.uums.base.BaseTestCase;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.criterion.Restrictions;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.model.Role;
import com.tekview.apex.uums.model.User;

/**
 * 用户DAO测试类
 */
public class UserDaoTest extends BaseTestCase {
	private UserDao userDao;

	public UserDaoTest() {
		userDao = (UserDao) getApplicationContext().getBean("userDao");
	}

	@Test
	// 数据库中用户数量
	public void testCount() {
		Long count = userDao.count();
		System.out.println("数据库中用户数量:" + count);
	}

	@Test
	// 获取用户信息
	public void testGetByName() {
		User user = userDao.getByName("kevin");
		if (user != null) {
			System.out.println("用户kevin的数据库标识是:" + user.getId());
		}
	}

	@Test
	// 加载用户信息时加载角色
	public void testGetUserWithRolesById() {
		User user = userDao.getUserWithRolesById(1L);
		if (user != null) {
			System.out.println("数据库标识为1的用户是:" + user.getName());
			if (user.getRoles() != null) {
				System.out.println("该用户共有:" + user.getRoles().size()
						+ "个角色,分别是:");
				Set<Role> roles = user.getRoles();
				for (Role role : roles) {
					System.out.println(role.getRoleName());
				}
			}
		}
		System.out.println("success!");
	}

	@Test
	// 根据用户名获取带有权限信息的用户对象
	public void testGetUserWithPermissionByName() {
		User user = userDao.getUserWithPermissionByName("kevin");
		if (user != null) {
			System.out.println("用户kevin的数据库标识是:" + user.getId());
			System.out.println("该用户共有:" + user.getRoles().size() + "个角色,分别是:");
			Set<Role> roles = user.getRoles();
			for (Role role : roles) {
				System.out.println("----" + role.getRoleName() + "------");
				if (role.getPerms() != null) {
					Set<Permission> permissions = role.getPerms();
					for (Permission permission : permissions) {
						System.out.println(permission.getPermissionName());
					}
				}
			}
		}
	}

	@Test
	// 用户是否存在
	public void testHasUserByUserId() {
		boolean result = userDao.hasUserByUserId(1L);
		if (result) {
			System.out.println("数据库标识为1的用户存在!");
		} else {
			System.out.println("数据库标识为1的用户不存在!");
		}

	}

	@Test
	// 根据sql语句统计用户数计
	public void testCountUserSql() {
		int count = userDao.countUserSql("select count(*) from User");
		System.out.println("SQL语句为:select count(*) from User");
		System.out.println("结果:" + count);
	}

	@Test
	// 根据权限id找出拥有该权限的所有用户
	public void testCountUserByPermissionId() {
		String permissionId = "setting_system_parameters";
		Integer count = userDao.countUserByPermissionId(permissionId);
		System.out.println("权限标识为:" + permissionId + " 权限名称：设置系统参数 " + " 用户数为："
				+ count);
	}

	@Test
	// 根据实体对象的某个属性查询唯一的实体对象
	public void testGetUserByOneProperty() {
		String property = "mobile";
		String value = "13482009055";
		User user = userDao.getUserByOneProperty(property, value);
		System.out.println("查询条件为：属性:" + property + " 值：" + value);
		if (user == null) {
			System.out.println("没有找到!");
		} else {
			System.out.println("用户标识为：" + user.getId() + " 用户名为:"
					+ user.getName());
		}
	}

	@Test
	//删除角色下的所有用户
	public void testDeleteUserByRoleName() {
		String roleName = "系统管理员";
		System.out.println("要查询的角色名称为:" + roleName);
		boolean result = userDao.deleteUserByRoleName(roleName);
		if (result) {
			System.out.println("删除成功！");
		} else {
			System.out.println("删除失败！");
		}
	}

	@Test
	//删除用户的所有角色
	public void testDeleteUserRoleByUserId() {
		Long userId=1L;
		userDao.deleteUserRoleByUserId(userId);
		System.out.println("删除用户的所有角色");
	}

	@Test
	//或得所有用户的realname 和id 并返回
	public void testGetAllUserRelName() {
		List<User> users=userDao.getAllUserRelName();
		printUsersInfo(users);
	}

	@Test
	//数据库中所有name != 'gradingviewer' 的user
	public void testGetAllUsers() {
		List<User> users=userDao.getAllUsers();
		printUsersInfo(users);
	}

	@Test
	//获取用户邮件地址
	public void testGetEmailByUserName() {
		String userName="kevin";
		String email=userDao.getEmailByUserName(userName);
		if(email!=null){
			System.out.println("用户："+userName+" 的邮件地址是:"+email);
		}
	}

	@Test
	//在线用户列表
	public void testGetOnlineUsers() {
		List<User> users=userDao.getOnlineUsers();
		System.out.println("---------在线用户列表-----------");
		printUsersInfo(users);
	}

	@Test
	//获取用户手机号码
	public void testGetPhoneByUserName() {
		String userName="kevin";
		String phone=userDao.getPhoneByUserName(userName);
		if(phone!=null){
			System.out.println("用户："+userName+" 的手机号码是:"+phone);
		}
	}

	@Test
	//根据权限id找出拥有该权限的所有用户
	public void testGetUserByPermissionId() {
		String actionId="notice_manager"; //可以创建、编辑、删除公告
		List<User> users=userDao.getUserByPermissionId(actionId);
		System.out.println("===拥有权限"+actionId+"的用户有=====");
		printUsersInfo(users);
	}

	@Test
	// 获取角色下的用户列表
	public void testGetUserListByRoleName() {
		String roleName = "系统管理员";
		System.out.println("要查询的角色名称为:" + roleName);
		List<User> users = userDao.getUserListByRoleName(roleName);
		if (users != null) {
			System.out.println("该角色下共有：" + users.size() + "个用户");
			for (User user : users) {
				System.out.println("用户标识：" + user.getId() + "用户名:"
						+ user.getName());
			}
		} else {
			System.out.println("该角色下无用户!");
		}
	}

	@Test
	//获取指定scopeName的用户列表
	@Deprecated //系统暂无该属笥
	public void testGetUserListByScopeName() {
		String scopeName = "";
		List<User> users = userDao.getUserListByScopeName(scopeName);
		System.out.println("===scopeName="+scopeName+"的用户有=====");
		printUsersInfo(users);
	}

	@Test
	//根据用户ID查询角色ID列表
	public void testGetRoleIdsByUserId() {
		Long userId=1L;
		List<Long> roleIds=userDao.getRoleIdsByUserId(userId);
		if(roleIds!=null){
			System.out.println("标识为:"+userId+"的用户共有:"+roleIds.size()+"个角色");
			for(Long roleId:roleIds){
				System.out.println("角色标识:"+roleId);
			}
		}
	}

	@Test
	//查询多个工作组下的用户列表
	public void testGetUsersByGroupIds() {
		List<Long>groupIds=new ArrayList<Long>();
		System.out.println("查询多个工作组下的用户列表");
		System.out.println("工作组标识:1,2");
		groupIds.add(1L);
		groupIds.add(2L);
		if(groupIds!=null && groupIds.size()>0){
			List<User> users=userDao.getUsersByGroupIds(groupIds);
			printUsersInfo(users);
		}
	}

	@Test
	//根据角色取用户
	public void testGetUsersByRoleId() {
		List<String> roleIdList=new ArrayList<String>();
		System.out.println("根据角色取用户");
		System.out.println("角色标识:1,2");
		roleIdList.add("1");
		roleIdList.add("2");
		if(roleIdList!=null && roleIdList.size()>0){
			List<User> users=userDao.getUsersByRoleId(roleIdList);
			printUsersInfo(users);
		}
	}

	@Test
	//通过角色名得到该Role的所有用户
	public void testGetUsersByRoleName() {
		String roleName="系统管理员";
		List<User> users=userDao.getUsersByRoleName(roleName);
		System.out.println("通过角色名得到该Role的所有用户");
		System.out.println(roleName+"角色下的用户有:");
		printUsersInfo(users);
	}

	@Test
	//得到特定资源的用户列表
	@Deprecated
	public void testGetUsersByScopeName() {
		String scopeName="";
		List<User> users=userDao.getUsersByScopeName(scopeName);
		System.out.println("得到特定资源的用户列表");
		System.out.println(scopeName+"资源下的用户有:");
		printUsersInfo(users);
	}

	@Test
	//通过多个用户名来获取用户信息
	public void testGetUsersByUserNames() {
		List<String> userNames=new ArrayList<String>();
		userNames.add("kevin");
		userNames.add("bob");
		List<User> users=userDao.getUsersByUserNames(userNames);
		System.out.println("通过多个用户名来获取用户信息");
		System.out.println("用户名：kevin bob");
		printUsersInfo(users);
	}

	@Test
	//判断该用户是否存在
	public void testIsExistByUserName() {
		String userName="kevin";
		System.out.println("判断该用户是否存在");
		boolean result=userDao.isExistByUserName(userName);
		if(result){
			System.out.println("名称为："+userName+"的用户存在！");
		}else{
			System.out.println("名称为："+userName+"的用户不存在！");
		}
	}

	@Test
	//判断用户列表中是否有不存在的用户 全部存在返回false ,包含一个不存在返回true
	public void testIsNotExistByUserNames() {
		List<String> userNames=new ArrayList<String>();
		userNames.add("kevin");
		userNames.add("bob");
		userNames.add("hello");
		System.out.println("判断用户列表中是否有不存在的用户 全部存在返回false ,包含一个不存在返回true");
		boolean result=userDao.isNotExistByUserNames(userNames);
		System.out.println("结果为:"+result);
	}

	@Test
	//获取用户的权限标识列表
	public void testPemissionIds() {
		Long userId=1L;
		List<Long> permissionIds=userDao.pemissionIds(userId);
		System.out.println("获取用户的权限标识列表");
		System.out.println("用户标识："+userId);
		if(permissionIds!=null && permissionIds.size()>0){
			for(Long permissionId:permissionIds){
				System.out.println("权限标识:"+permissionId);
			}
		}
	}

	@Test
	//根据指定的条件获符合要求的对象，以分页的形式返回
	public void testGetFiexedObjectsInPage() {
		int start=0;
		int limit=20;
		String hql="from User where ssdUser =false";
		System.out.println("根据指定的条件获符合要求的对象，以分页的形式返回");
		System.out.println("start:"+start);
		System.out.println("limit:"+limit);
		System.out.println("hql:"+hql);
		
		Object[] objectArray=userDao.getFiexedObjectsInPage(start, limit, hql);
		if(objectArray!=null){
			System.out.println("总记录数为:"+objectArray[0]);
			List<Object> objects=(List<Object>)objectArray[1];
			for(int i=0;i<objects.size();i++){
				User user=(User)objects.get(i);
				System.out.println("realName:"+user.getRealName()+" Id="+user.getId());
			}
		}
	}

	@Test
	//条件查询实体对象的某几个属性而不返回整个实体对象，在仅仅需要实体对象的属性而不是整个实体对象时，可以提高效率。
	public void testGetEntityProperties() {
		System.out.println("条件查询实体对象的某几个属性而不返回整个实体对象，在仅仅需要实体对象的属性而不是整个实体对象时，可以提高效率。");
		long id=1L;
		//多个返回字段情况
		List<?> objects=userDao.getEntityProperties(new String[]{"name","realName"}, new String[]{"id"}, new Object[]{id});
		if(objects!=null){
			System.out.println("返回数据长度："+objects.size());
			for(Object obj:objects){
				Object[] objArray=(Object[])obj;
				for(int i=0;i<objArray.length;i++){
					System.out.println("propery:"+i+" :"+objArray[i]);
				}
			}
		}
		//OSS代码中的调用情况
		List<?> list = userDao.getEntityProperties(new String[]{"name"}, new String[]{"id"}, new Object[]{id});
		String result="";
		if(!list.isEmpty()){
			result=list.get(0).toString();
		}
		System.out.println(result);
	}

	@Test
	//根据实体对象的多个属性查询实体对象数量
	public void testCountEntitiesByPropNames() {
		//测试字符串和数值类型参数
		String[] propertyNames=new String[]{"id","name"};
		String values[] =new String[]{"1","'kevin'"};
		int count=userDao.countEntitiesByPropNames(propertyNames, values);
		System.out.println("根据实体对象的多个属性查询实体对象数量");
		System.out.println("条件为:id=1 name=keivn");
		System.out.println("实体对象数量:"+count);
		
		Long userDeptId=1L; //部门标识
		int userDeptCount= userDao.countEntitiesByPropNames(new String[]{"depet.id"},new Object[]{userDeptId});
		System.out.println("部门下用户数量:"+userDeptCount);
	}

	@Test
	//保存用户
	public void testSave() {
		User user=new User();
		user.setName("caseUser");
		user.setRealName("测试用例添加用户");
		user.setCity("china");
		user.setDeletable(true);
		user.setFax("021-111111");
		userDao.save(user);
		System.out.println("保存后用户标识:"+user.getId());
		System.out.println("保存用户成功!");
	}

	@Test
	//删除用户
	public void testDelete() {
		System.out.println("----删除用户----");
		User user=userDao.getById(23L);
		if(user!=null){
			System.out.println("用户标识："+user.getId()+"用户名:"+user.getName());
			userDao.delete(user.getId());
			System.out.println("删除用户成功!");
		}else{
			System.out.println("没有找到要删除的用户!");
		}
	}

	@Test
	//修改用户信息
	public void testUpdate() {
		System.out.println("----修改用户信息----");
		User user=userDao.getById(24L);
		if(user!=null){
			System.out.println("用户标识："+user.getId()+"用户名:"+user.getName());
			user.setAppName("OssWorks");
			userDao.update(user);
			System.out.println("修改用户成功!");
		}else{
			System.out.println("没有找到要修改的用户!");
		}
	}
	@Test
	//根据实体对象的某个属性查询实体对象
	public void testGetEntitiesByOneProperty() {
		System.out.println("----根据实体对象的某个属性查询实体对象----");
		String propertyName="name";
		Object value="bob";
		List<User> users=userDao.getEntitiesByOneProperty(propertyName, value);
		printUsersInfo(users);
	}

	@Test
	//根据实体对象的多个属性查询实体对象
	public void testGetUniqueEntityByPropNames() {
		System.out.println("根据实体对象的多个属性查询实体对象");
		String[] propertyNames=new String[]{"id","name"};
		Object values[] =new Object[]{1L,"kevin"};
		User user=userDao.getUniqueEntityByPropNames(propertyNames, values);
		printUserInfo(user);
	}

	@Test
	//删除用户
	public void testDeleteEntity() {
		System.out.println("----删除用户----");
		User user=userDao.getById(24L);
		if(user!=null){
			System.out.println("用户标识："+user.getId()+"用户名:"+user.getName());
			userDao.deleteEntity(user);
			System.out.println("删除用户成功!");
		}else{
			System.out.println("没有找到要删除的用户!");
		}
	}

	@Test
	//分页查询实体对象
	public void testGetPagingEntities() {
		System.out.println("分页查询实体对象");
		int start=0;
		int pageSize=25;
		System.out.println("开始位置:"+start);
		System.out.println("每页记录数:"+pageSize);
		List<User> users=userDao.getPagingEntities(start, pageSize);
		printUsersInfo(users);
	}

	@Test
	//将查询条件封装为hql查找
	public void testGetEntityByHql() {
		System.out.println("将查询条件封装为hql查找");
		Long workGroupId=1L;
		String hql=" where workGroup.id= "+workGroupId;
		System.out.println("查询工作组标识为:"+workGroupId+"的用户列表");
		System.out.println("HQL="+hql);
		List<User> users=userDao.getEntityByHql(hql);
		printUsersInfo(users);
	}

	@Test
	//分页根据hql查询实体对象
	public void testGetPagingEntitiesByHql() {
		System.out.println("分页根据hql查询实体对象");
		Long roleId=5L;
		StringBuffer hql =new StringBuffer();
		 hql.append( "select user from User as user left join user.roles  as role where role.id=" + roleId+ " group by user.id");
		int start=0;
		int pageSize=25;
		System.out.println("开始位置:"+start);
		System.out.println("每页记录数:"+pageSize);
		System.out.println(hql);
		System.out.println("查询指定角色下的所有用户");
		List<User> users=userDao.getPagingEntitiesByHql(hql.toString(), start, pageSize);
		printUsersInfo(users);
	}

	@Test
	//通过id查询
	public void testGetById() {
		System.out.println("通过id查询");
		Long id=1L;
		User user=userDao.getById(id);
		printUserInfo(user);
	}

	@Test
	//分页查询
	public void testQueryByPage() {
		System.out.println("分页查询");
		Criteria criteria = new Criteria();
		criteria.add(Restrictions.like("name", "kevin"));
		List<User> users=userDao.queryByPage(criteria);
		printUsersInfo(users);
	}

	@Test
	//数据库中所有name != 'gradingviewer' 的user
	public void testGetAllEntities() {
		System.out.println("数据库中所有name != 'gradingviewer' 的user");
		List<User> users=userDao.getAllUsers();
		printUsersInfo(users);
	}

	@Test
	//根据实体对象的某个属性查询实体对象
	public void testGetEntitiesByOrCondition() {
		System.out.println("根据实体对象的某个属性查询实体对象");
		String propertyName="id";
		Long value=2L;
		List<User> users=userDao.getEntitiesByOneProperty(propertyName, value);
		printUsersInfo(users);
	}
	@Test
	//根据用户真实姓名获取模糊匹配的用户名称和用户Id
	public void testGetUsersByLikeRealName(){
		System.out.println("根据用户真实姓名获取模糊匹配的用户名称和用户Id");
		List<List<String>>results = new ArrayList<List<String>>();
		String realName="坚";
		List<Object[]> users=userDao.getUsersByLikeRealName(realName);
		System.out.println("length:"+users.size());
		for(Object[] user : users){
			List<String>result = new ArrayList<String>();
			result.add(user[0].toString());
			result.add(user[1].toString());
			results.add(result);
		}
		System.out.println("成功返回!");	
	}
	@Test
	//根据用户名列表获得邮件列表
	public void testgetMailListByName(){
		System.out.println("根据用户名列表获得邮件列表");
		List<String> userNames=new ArrayList<String>();
		userNames.add("kevin");
		userNames.add("bob");
		userNames.add("vsandjava");
		List<String> emails=userDao.getMailListByName(userNames);
		if(emails!=null && emails.size()>0){
			System.out.println("----------邮件地址-----------");
			for(String email:emails){
				System.out.println(email);
			}
		}
	}
	@Test
	//条件查询实体对象
	public void testGetEntitiesByPropertiesEuqal(){
		System.out.println("条件查询实体对象");
		List<User> users = userDao.getEntitiesByPropertiesEuqal(new String[]{"workGroup.id","ssdUser"}, new Object[]{1L,false});
		printUsersInfo(users);
	}
	@Test //将完整的查询条件封装为hql查找,包括关键字select
	public void testGetEntityByFullHql(){
		System.out.println("将完整的查询条件封装为hql查找,包括关键字select");
		String hql="select user from User user join user.roles role where ssdUser=true and role.id !=161";
		System.out.println("hql:"+hql);
		List<User> users =userDao.getEntityByFullHql(hql);
		printUsersInfo(users);
	}
	//打印多个用户信息
	private void printUsersInfo(List<User> users){
		if(users!=null){
			for(User user:users){
				printUserInfo(user);
			}
		}
	}
	//打印用户信息
	public void printUserInfo(User user){
		if(user!=null){
			System.out.println("realName:"+user.getRealName()+" Id="+user.getId());
		}
	}
	// 生成测试用例签名
	public static void main(String args[]) {
		Class<?> c1 = null; // 声明Class对象
		try {
			c1 = Class.forName("com.tekview.apex.uums.dao.impl.UserDaoImpl");
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
