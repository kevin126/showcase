/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : UserDaoImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.tekview.apex.uums.action.user.UserQuery;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.dao.DaoSupport;
import com.tekview.apex.uums.dao.UserDao;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.model.Role;
import com.tekview.apex.uums.model.User;

/**
 * 用户DAO
 */
@Repository("userDao")
@Transactional
public class UserDaoImpl extends DaoSupport<User> implements UserDao {
	@PersistenceContext
	private EntityManager entityManager;

	/**
	 * @return 实体类
	 */
	@Override
	protected Class<User> getEntityClass() {
		return User.class;
	}

	/**
	 * 加载用户信息时加载角色
	 * 
	 * @param id
	 *            用户标识
	 * @return 用户信息
	 */
	public User getUserWithRolesById(Long id) {
		User user = entityManager.find(User.class, id);
		if (user != null) {
			  //要延时加载的属性
			if(user.getRoles()!=null){
				 user.getRoles().size();
			}
            if(user.getDepet()!=null){
            	if(user.getDepet().getSubUserDepts()!=null){
            		 user.getDepet().getSubUserDepts().size();
            	}
            }
           if(user.getWorkGroup()!=null){
        	   if(user.getWorkGroup().getSubWorkGroup()!=null){
        		   user.getWorkGroup().getSubWorkGroup().size();
        	   }
           }
		}
		return user;
	}
	 /**
	 * 获取用户信息
	 * @param userName 用户名
	 * @return 用户信息
	 */
	@Override
	public User getByName(String userName) {
		if(userName==null || userName.length()==0){
			return null;
		}
		Query query=entityManager.createQuery("SELECT entity From User entity where entity.name=:userName");
		query.setParameter("userName", userName);
		List<User> users=query.getResultList();
		if(users!=null&& users.size()>0){
			return users.get(0);
		}else{
			return null;
		}
	}
	 /**
	 * 获取用户信息
	 * @param mail 邮件地址
	 * @return 用户信息
	 */
	@Override
	public User getByMail(String mail) {
		if(mail==null || mail.length()==0){
			return null;
		}
		Query query=entityManager.createQuery("SELECT entity From User entity where entity.mail=:mail");
		query.setParameter("mail", mail);
		List<User> users=query.getResultList();
		if(users!=null&& users.size()>0){
			return users.get(0);
		}else{
			return null;
		}
	}
	/**
	 * 根据用户名获取带有权限信息的用户对象
	 * @param userName 用户名
	 * @return 用户信息
	 */
	@Override
	public User getUserWithPermissionByName(String userName) {
		if(userName==null || userName.length()==0){
			return null;
		}
		Query query=entityManager.createQuery("SELECT entity From User entity where entity.name=:userName");
		query.setParameter("userName", userName);
		User user=(User)query.getSingleResult();
		if(user!=null){
			 //要延时加载的属性
			if(user.getRoles()!=null){
				 user.getRoles().size();
				 Set<Role> roles=user.getRoles();
				 for(Role role:roles){
					 role.getPerms().size();
				 }
			}
           if(user.getDepet()!=null){
        	   user.getDepet().getSubUserDepts().size();
           }
           if(user.getWorkGroup()!=null){
        	   user.getWorkGroup().getSubWorkGroup().size();
           }
		}
		return user;
	}

	 /**
     * 用户是否存在
     * @param userId 用户标识
     * @return 用户存在返回true
     */
    public boolean hasUserByUserId(Long userId){
    	boolean result=false;
    	User user=getEntityById(userId);
    	if(user!=null){
    		result=true;
    	}
    	return result; 
    }
    /**
	 * 根据sql语句统计用户数计
	 * 
	 * @return 数量
	 */
	@Override
	public Integer countUserSql(String sql){
		Query query=entityManager.createQuery(sql);
		Long count=(Long)query.getSingleResult();
		return count.intValue();
	}
	/**
	 * 根据权限id找出拥有该权限的所有用户
	 * 
	 * @param actionId 权限id
	 * @return 拥有该权限标识的用户数
	 */
	public Integer countUserByPermissionId(String actionId){
		actionId = StringUtils.trimToNull(actionId);
		if (null == actionId) {
			return 0;
		} else {
			String hql = " select count(user) from User user  join user.roles role join  role.perms perms where  perms.actionId ='"
					+ actionId + "' ";
			Query query=entityManager.createQuery(hql);
			Iterator<Long> iterator =query.getResultList().iterator();
			while (iterator.hasNext()) {
				Long sum = (Long) iterator.next();
				return sum.intValue();
			}
			return 0;
		}
	}

	@Override
	public User getUserByOneProperty(String propertyName, Object value) {
		List<User> result = getEntitiesByOneProperty(propertyName, value);
		if (result!=null && result.size()>0)
			return result.get(0);
		return null;
	}
	/**
	 * 删除角色下的所有用户
	 * @param roleName 角色名称
	 * @return 删除成功或失败
	 */
	public boolean deleteUserByRoleName(String roleName){
		boolean result=false;
		if (!StringUtils.isEmpty(roleName)) {
			Query query=entityManager.createQuery("select user from User user join user.roles role where role.roleName = :roleName");
			query.setParameter("roleName", roleName);
			List<User> lists=query.getResultList();
			if (lists!=null && lists.size()>0) {
				for (User user : lists)
					delete(user.getId());
			}
//			TODO:简化操作
//			Query query=entityManager.createQuery("delete from User user join user.roles role where role.roleName = :roleName");
//			query.executeUpdate();
			result=true;
		}
		return result;
	}
	/**
	 * 删除用户的所有角色
	 * 
	 * @param userId 用户标识
	 */
	public void deleteUserRoleByUserId(Long userId){
		User user=getById(userId);
		if(user!=null){
			user.setRoles(null);
			save(user);
		}
	}
	/**
	 * 
	 * 或得所有用户的realname 和id 并返回
	 * 
	 */
	@Override
	public List<User> getAllUserRelName(){
		List<User> users = new ArrayList<User>();
		Query query = entityManager.createQuery("select user.id,user.realName,user.name from User user");
		// 集合中的元素不再是 一个 Object[] 对象数组
		List result = query.getResultList();
		if(result!=null){
			for(int i=0;i<result.size();i++){
				User user=new User();
				Object[] obj=(Object[])result.get(i);
				user.setId((Long)obj[0]);
				user.setRealName(obj[1].toString());
				user.setName(obj[2].toString());
				users.add(user);
			}
		}
		return users;
	}
	/**
	 * 数据库中所有name != 'gradingviewer' 的user
	 */
	@Override
	public List<User> getAllUsers(){
		Query query=entityManager.createQuery("from User where name <> 'gradingviewer'");
		return query.getResultList();
	}
	/**
	 * 获取用户邮件地址
	 */
	@Override
	public String getEmailByUserName(String userName){
		User user=getByName(userName);
		if (user != null) {
			return user.getMail();
		} else {
			return "";
		}
	}
	/**
	 * 在线用户列表
	 * 
	 * @return 用户列表
	 */
	@Override
	public List<User> getOnlineUsers(){
		Query query=entityManager.createQuery("from User where online = true");
		return query.getResultList();
	}
	 /**
     * 获取用户手要号码
     * @param userName 用户名
     * @return 手机号码
     */
    public String getPhoneByUserName(String userName){
    	if(userName==null || userName.length()==0){
    		return null;
    	}
    	User user=getByName(userName);
    	if(user!=null){
    		return user.getMobile();
    	}else{
    		return null;
    	}
    }
    /**
	 * 根据权限id找出拥有该权限的所有用户
	 * 
	 * @param actionId 权限id
	 * @return 用户列表
	 */
	@Override
	public List<User> getUserByPermissionId(String actionId){
		actionId = StringUtils.trimToNull(actionId);
		if (null == actionId) {
			return null;
		} else {
			String hql = " select distinct user.id,user.name ,user.realName from User user  join user.roles role join  role.perms perms where  perms.actionId = '"
					+ actionId + "' ";
			Query query = entityManager.createQuery(hql);
			List<User> userList = new ArrayList<User>();
			List result = query.getResultList();
			if(result!=null){
				for(int i=0;i<result.size();i++){
					User user = new User();
					Object[] obj=(Object[])result.get(i);
					user.setId((Long)obj[0]);
					user.setName(obj[1].toString());
					user.setRealName(obj[2].toString());
					userList.add(user);
				}
			}
			return userList;
		}
	}
	/***
	 * 获取角色下的用户列表
	 * @param roleName 角色名称
	 * @return 用户列表
	 */
	@Override
	public List<User> getUserListByRoleName(String roleName){
		Query query = entityManager.createQuery("select user from User user join user.roles role where role.roleName = :roleName");
		query.setParameter("roleName", roleName);
		return query.getResultList();
	}
	/**
	 * 获取指定scopeName的用户列表
	 * @param scopeName
	 * @return 用户列表
	 */
	@Override
	@Deprecated
	public List<User> getUserListByScopeName(String scopeName){
		Query query = entityManager.createQuery("from User where scopeName = :scopeName");
		query.setParameter("scopeName", scopeName);
		return query.getResultList();
	}
	/**
	 * 根据用户ID查询角色ID列表
	 * 
	 * @param userId 用户标识
	 * @return 角色ID列表
	 */
	public List<Long> getRoleIdsByUserId(Long userId){
		Query query = entityManager.createQuery("select role.id from User user join user.roles role where user.id =:userId");
		query.setParameter("userId", userId);
		List<Long> result = (List<Long>)query.getResultList();
		return result;
	}
	/**
	 * 查询多个工作组下的用户列表
	 * @param groupIds 工作组标识列表
	 * @return 用户列表
	 */
	@Override
	public List<User> getUsersByGroupIds(List<Long> groupIds){
		Query query = entityManager.createQuery("from User user where workGroup.id in (:ids)");
		query.setParameter("ids", groupIds);
		return query.getResultList();
	}
	/**
	 * 根据角色取用户
	 * 
	 * @param roleIdList 角色标识列表
	 * @return 用户列表
	 */
	@Override
	public List<User> getUsersByRoleId(List<String> roleIdList){
		List<Long> ids=new ArrayList<Long>();
		for(String roleId:roleIdList){
			ids.add(Long.valueOf(roleId));
		}
		Query query = entityManager.createQuery("select distinct user from User as user left join user.roles as role where  role.id in (:ids)");
		query.setParameter("ids", ids);
		return query.getResultList();
	}
	/**
	 * 通过角色名得到该Role的所有用户
	 * 
	 * @param roleName 角色名
	 * @return List 用户列表
	 */
	@Override
	public List<User> getUsersByRoleName(String roleName){
		Query query = entityManager.createQuery("select distinct user from User as user left join user.roles as role where role.roleName = :roleName");
		query.setParameter("roleName", roleName);
		return query.getResultList();
	}
	/**
	 * 得到特定资源的用户列表
	 * 
	 * @param scopeName 资源名
	 * @return List,不会为null
	 */
	@Override
	@Deprecated
	public List<User> getUsersByScopeName(String scopeName){
		Query query = entityManager.createQuery("from User where scopeName = :scopeName");
		query.setParameter("scopeName", scopeName);
		return query.getResultList();
	}
	/**
	 * 通过多个用户名来获取用户信息
	 * @param userNames  用户名列表
	 * @return 用户列表
	 */
	public List<User> getUsersByUserNames(List<String> userNames){
		Query query = entityManager.createQuery("from User user where user.name in (:userNames)");
		query.setParameter("userNames", userNames);
		return query.getResultList();
	}
	/**
	 * 
	 * 判断该用户是否存在
	 * 
	 * @param userName 用户名
	 * @return 用户存在返回true
	 */
	@Override
	public boolean isExistByUserName(String userName){
		Query query = entityManager.createQuery("select count(*) from User user where user.name=:userName");
		query.setParameter("userName", userName);
		Long result=(Long) query.getSingleResult();
		return result.intValue()>0?true:false;
	}
	/**
	 * 
	 * 判断用户列表中是否有不存在的用户 全部存在返回false ,包含一个不存在返回true
	 * 
	 * @param userNames
	 * @return 存在返回true
	 */
	@Override
	public boolean isNotExistByUserNames(List<String> userNames) {
		Query query = entityManager.createQuery("select count(*) from User user where name in (:userNames)");
		query.setParameter("userNames", userNames);
		Long result=(Long) query.getSingleResult();
		return result.intValue()!=userNames.size()?true:false;
	}
	/**
	 * 获取用户的权限标识列表
	 * @param userId 用户标识
	 * @return 权限标识列表
	 */
	@Override
	public List<Long> pemissionIds(Long userId){
		Query query = entityManager.createQuery("select c.id  from User a join a.roles b join b.perms c  where  a.id =:userId");
		query.setParameter("userId", userId);
		return (List<Long>)query.getResultList();
	}
	/**
	 * 
	 * 根据用户真实姓名获取模糊匹配的用户名称和用户Id
	 * 
	 * @param realName 用户真实姓名
	 * @return 用户名称和用户Id
	 */
	public List<Object[]> getUsersByLikeRealName(String realName){
		Query query = entityManager.createQuery("select user.id,user.realName from User user where user.realName like '"+realName+"%'");
		return (List<Object[]>)query.getResultList();
	}
	/**
	 * 
	 * 根据用户名列表获得邮件列表
	 * 
	 * @param userNames 用户名称
	 * @return 邮件列表
	 */
	public List<String> getMailListByName(List<String> userNames){
		Query query = entityManager.createQuery(" select  user.mail from User user where user.name in (:userNames)");
		query.setParameter("userNames", userNames);
		return query.getResultList();
	}

	public EntityManager getEntityManager() {
		return entityManager;
	}

	@Override
	public PageList<User> queryByPage(Criteria criteria) {
		PageList<User> pageList= super.queryByPage(criteria);
		for (User user : pageList) {
			user.getRoles().size();
		}
		return pageList;
	}

	@Override
	public int countUserByHql(UserQuery userQuery) {
		//查询语句
		StringBuffer countHql=new StringBuffer("select count(*) from User as user where 1=1");
		if (StringUtils.isNotEmpty(userQuery.getName())) {
			countHql.append(" and user.name like '%"+userQuery.getName()+"%'");
		}
		if (StringUtils.isNotEmpty(userQuery.getRealName())) {
			countHql.append(" and user.realName like '%"+userQuery.getRealName()+"%' ");
		}
		if (StringUtils.isNotEmpty(userQuery.getMail())) {
			countHql.append(" and user.mail like '%"+userQuery.getMail()+"%' ");
		}
		if (!CollectionUtils.isEmpty(userQuery.getDeptNames())) {
			countHql.append(" and user.depet.deptName in (:deptName)");
		}
		if (!CollectionUtils.isEmpty(userQuery.getWorkGroupNames())) {
			countHql.append(" and user.workGroup.workGroupName in (:workGroupName)");
		}
		Query query=entityManager.createQuery(countHql.toString());
		//参数赋值
		if (!CollectionUtils.isEmpty(userQuery.getDeptNames())) {
			query.setParameter("deptName", userQuery.getDeptNames());
		}
		if (!CollectionUtils.isEmpty(userQuery.getWorkGroupNames())) {
			query.setParameter("workGroupName", userQuery.getWorkGroupNames());
		}
		Long count=(Long)query.getSingleResult();
		return count.intValue();
	}

	@Override
	public List<User> getPagingUser(UserQuery userQuery) {
		//查询语句
		StringBuffer hql=new StringBuffer("select user from User as user where 1=1 ");
		
		if (StringUtils.isNotEmpty(userQuery.getName())) {
			if(userQuery.getName().trim().length()>0){
				hql.append(" and user.name like '%"+userQuery.getName()+"%'");
			}
		}
		if (StringUtils.isNotEmpty(userQuery.getRealName())) {
			if(userQuery.getRealName().trim().length()>0){
				hql.append(" and user.realName like '%"+userQuery.getRealName()+"%'");
			}
		}
		if (StringUtils.isNotEmpty(userQuery.getMail())) {
			if(userQuery.getMail().trim().length()>0){
				hql.append(" and user.mail like '%"+userQuery.getMail()+"%'");
			}
		}
		if (!CollectionUtils.isEmpty(userQuery.getDeptNames())) {
			hql.append(" and user.depet.deptName in (:deptName)");
		}
		if (!CollectionUtils.isEmpty(userQuery.getWorkGroupNames())) {
			hql.append(" and user.workGroup.workGroupName in (:workGroupName)");
		}
		hql.append(" order by user.id desc");
		Query query=entityManager.createQuery(hql.toString());
		//分页设置
		query.setFirstResult(userQuery.getStart());
		query.setMaxResults(userQuery.getLimit());
		//参数赋值
		if (!CollectionUtils.isEmpty(userQuery.getDeptNames())) {
			query.setParameter("deptName", userQuery.getDeptNames());
		}
		if (!CollectionUtils.isEmpty(userQuery.getWorkGroupNames())) {
			query.setParameter("workGroupName", userQuery.getWorkGroupNames());
		}
		List<User> userList=query.getResultList();
		return userList;
	}
	 /**
     * 保存OSS系统同步过来的用户数据
     * @param user 用户信息
     */
    public void saveOssUser(User user){
    	Query query = entityManager.createNativeQuery("INSERT INTO ca_user VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
	    query.setParameter(1, user.getId()); //id
	    query.setParameter(2, user.getAddress()==null?"":user.getAddress()); //address
	    query.setParameter(3, user.getAppName()==null?"":user.getAppName()); //appName
	    query.setParameter(4, user.getCity()==null?"":user.getCity());//city
	    query.setParameter(5, user.getCountry()==null?"":user.getCountry());//country
	    query.setParameter(6, user.getCreateTime());//createTime
	    query.setParameter(7, user.isDeletable());//deletable
	    query.setParameter(8, user.getEmployeeNo()==null?"":user.getEmployeeNo());//employeeNo
	    query.setParameter(9, user.getEnabled());//enabled
	    query.setParameter(10, user.getFax()==null?"":user.getFax());//fax
	    
	    query.setParameter(11, user.isGlobalUser());//isGlobal
	    query.setParameter(12, user.getInternetAccount()==null?"":user.getInternetAccount());//internetAccount
	    query.setParameter(13, user.getKlScores()==null?0:user.getKlScores());//kl_scores
	    query.setParameter(14, user.getLastLoginTime());//lastLoginTime
	    query.setParameter(15, user.getLoginIP()==null?"":user.getLoginIP());//loginIP
	    query.setParameter(16, user.getMail()==null?"":user.getMail());//mail
	    query.setParameter(17, user.getMobile()==null?"":user.getMobile());//mobile
	    query.setParameter(18, user.getMsn()==null?"":user.getMsn());//msn
	    query.setParameter(19, user.getName()==null?"":user.getName());//name
	    query.setParameter(20, user.getOffice()==null?"":user.getOffice());//office
	    query.setParameter(21, user.isOnline());//isOnline
	    
	    query.setParameter(22, user.getPassword()==null?"":user.getPassword());//password
	    query.setParameter(23, user.getQq()==null?"":user.getQq());//qq
	    query.setParameter(24, user.getRealName()==null?"":user.getRealName());//realName
	    query.setParameter(25, user.isSsdUser());//ssdUser
	    query.setParameter(26, user.getTaskNotifier()==null?"":user.getTaskNotifier());//taskNotifier
	    query.setParameter(27, user.getTitle()==null?"":user.getTitle());//title
	    query.setParameter(28, user.getZipCode()==null?"":user.getZipCode());//zipcode
	    query.executeUpdate();
    }

	@Override
	public void saveNmUser(User user) {
		save(user);
		
	}
	/**
	 * 批量删除用户
	 * @param userNames 用户登录名合集
	 */
	public void deleteUserByNames(List<String> userNames){
		Query query = entityManager.createQuery("delete User user where user.name in (:userNames)");
		query.setParameter("userNames", userNames);
		query.executeUpdate();
	}
	/**
	 * 批量修改用户状态
	 * @param enabled 用户状态（1 ：启用；２ ：禁用；其他预留）
	 * @param userNames 用户名称集合
	 */
	public void batchModifyUserStatus(int enabled,List<String> userNames){
		Query query = entityManager.createQuery("upate User user set user.enabled=:enabled where user.name in (:userNames)");
		query.setParameter("userNames", userNames);
		query.setParameter(enabled, enabled);
		query.executeUpdate();
	}
}