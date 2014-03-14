package com.tekview.apex.uums.dao.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.page.PageArrayList;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.dao.DaoSupport;
import com.tekview.apex.uums.dao.PermissionDao;
import com.tekview.apex.uums.dao.RoleDao;
import com.tekview.apex.uums.dao.UserDao;
import com.tekview.apex.uums.model.Permission;
import com.tekview.apex.uums.model.Role;
import com.tekview.apex.uums.model.User;

@Repository("roleDao")
@Transactional
public class RoleDaoImpl extends DaoSupport<Role> implements RoleDao {
	@PersistenceContext
	private EntityManager entityManager;
	@Autowired
	private PermissionDao permissionDao;
	@Autowired
	private UserDao userDao;
	@Override
	protected Class<Role> getEntityClass() {
		return Role.class;
	}

	/**
	 * 查看角色所有权限
	 * 
	 * @param roleId 角色标识
	 * @return 角色下的权限列表
	 */
	public List<Permission> queryPermissions(Long roleId) {
		List<Permission> permissions=new ArrayList<Permission>();
		Role role=getById(roleId);
		if(role!=null){
			role.getPerms().size();
			Set<Permission> perms=role.getPerms();
			for(Permission perm:perms){
				permissions.add(perm);
			}
		}
		return permissions;
	}

	/**
	 * 查看角色下所有用户
	 * 
	 * @param roleId 角色标识
	 * @return 角色下的用户列表
	 */
	public List<User> queryUsers(Long roleId) {
		List<User> users=new ArrayList<User>();
		Role role=getById(roleId);
		if(role!=null){
			role.getUsers().size();
			Set<User> userSets=role.getUsers();
			for(User user:userSets){
				users.add(user);
			}
		}
		return users;
	}
	/**
	 * 添加角色的同时添加权限项
	 * @param role 角色信息
	 * @param permissionIds 权限项标识
	 */
	public void saveRoleWithPermissions(Role role,Long permissionIds[]){
		Set<Permission> perms=new HashSet<Permission>();
		for(Long permissionId:permissionIds){
			Permission permission=permissionDao.getById(permissionId);
			perms.add(permission);
		}
		role.setPerms(perms);
		save(role);
	}
	/**
	 * 添加角色的同时添加权限项
	 * @param role 角色信息
	 * @param permissionIds 权限项标识
	 */
	public void saveRoleWithPermissions(Role role,String permissionActionIds[]){
		Set<Permission> perms=new HashSet<Permission>();
		for(String permissionActionId:permissionActionIds){
			Permission permission=permissionDao.getByActionId(permissionActionId);
			perms.add(permission);
		}
		role.setPerms(perms);
		save(role);
	}

	/**
	 * 角色添加权限
	 * @param roleId 角色标识
	 * @param permissionIds 权限标识
	 */
	public void addPermissions(Long roleId, Long[] permissionIds) {
		Role role=getById(roleId);
		Set<Permission> perms=new HashSet<Permission>();
		for(Long permissionId:permissionIds){
			Permission permission=permissionDao.getById(permissionId);
			perms.add(permission);
		}
		role.setPerms(perms);
		save(role);
	}

	/**
	 * 修改角色权限
	 * @param roleId 角色标识
	 * @param permissionIds 权限标识
	 */
	public void updateRoleWithPermissions(Long roleId, Long[] permissionIds) {
		Role role=getById(roleId);
		Set<Permission> perms=new HashSet<Permission>();
		for(Long permissionId:permissionIds){
			Permission permission=permissionDao.getById(permissionId);
			perms.add(permission);
		}
		role.setPerms(perms);
		update(role);
	}
	
	/**
	 * 加载角色信息的同时加载权限
	 * @param RoleId 角色标识
	 * @return 角色对象
	 */
	public Role getByIdWithPermissions(Long roleId){
		Role role=getById(roleId);
		if(role!=null){
			role.getPerms().size();
			role.getUsers().size();
		}
		return role;
	}
	/**
	 * 当前角色是否被使用
	 * @param roleId 角色标识
	 * @return 如果当前角色被使用返回true,否则返回false
	 */
	public boolean hasUsed(Long roleId){
		boolean result=false;
		Query query =entityManager.createNativeQuery("select * from ca_user_role where roleId=:roleId and userId is not null");
		query.setParameter("roleId", roleId);
		List list=query.getResultList();
		if(list.size()>0){
			result=true;
		}
		return result;
	}

	 /**
	 * 角色添加用户
	 * @param roleId 角色标识
	 * @param permissionIds 用户标识
	 */
	public void AddUsers(Long roleId, Long[] userIds) {
		Role role=getById(roleId);
		Set<User> users=new HashSet<User>();
		for(Long userId:userIds){
			User user=userDao.getById(userId);
			users.add(user);
		}
		role.setUsers(users);
		save(role);
	}
	/**
	 * 修改角色用户
	 * @param roleId 角色标识
	 * @param permissionIds 用户标识
	 */
	public void updateRoleWithUsers(Long roleId, Long[] userIds) {
		Role role=getById(roleId);
		Set<User> users=new HashSet<User>();
		for(Long userId:userIds){
			User user=userDao.getById(userId);
			users.add(user);
		}
		role.setUsers(users);
		update(role);
	}
	
	/**
	 * 分页查询角色下的用户
	 * @param roleId 角色标识
	 * @param start 开始记录
	 * @param pageSize 每页记录数
	 * @return 用户列表
	 */
    public PageList<User> queryUsersByPage(Long roleId,int start,int pageSize) {
       Query query=entityManager.createQuery("select entity.users from Role entity where entity.id=:id");
       query.setParameter("id", roleId);
       int totalCount=query.getResultList().size();
       query.setFirstResult(start);
       query.setMaxResults(pageSize);
       return new PageArrayList<User>(totalCount,query.getResultList());
    }
    /**
	 * 移除角色下面的用户
	 * @param roleId 角色
	 * @param memberIds 用户标识集合
	 */
	public void removeRoleMembers(Long roleId,List<Long> memberIds){
		Role role=getById(roleId);
		if(role==null){
			throw new OceanRuntimeException("找不到指定的角色!");
		}
		role.getUsers().size();
		Set<User> users=role.getUsers();
		for(Long memberId:memberIds){
			User user=userDao.getById(memberId);
			if(user!=null){
				users.remove(user);
			}
		}
		role.setUsers(users);
		update(role);
	}
	/**
	 * 向角色中添中用户
	 * @param roleId 角色标识
	 * @param memberIds 用户标识集合
	 */
	public void addUserToRole(Long roleId,List<Long> memberIds){
		Role role=getById(roleId);
		if(role==null){
			throw new OceanRuntimeException("找不到指定的角色!");
		}
		role.getUsers().size();
		Set<User> users=role.getUsers();
		for(Long memberId:memberIds){
			User user=userDao.getById(memberId);
			if(user!=null){
				if(!users.contains(user)){
					users.add(user);
				}
			}else{
				throw new OceanRuntimeException("没有找到标识为"+memberId+"的用户，添加角色成员出错!");
			}
		}
		role.setUsers(users);
		update(role);
	}

	@Override
	public List<Role> getAllEntities() {
		List<Role> roleList=super.getAllEntities();
		//加载要延迟加载的属性
		for (Role role : roleList) {
			role.getPerms().size();
			role.getUsers().size();
		}
		return roleList;
	}

	@Override
	public void deleteRole(String roleName) {
		Query query=entityManager.createQuery("from Role as role where role.roleName=:roleName");
		query.setParameter("roleName",roleName);
		List<Role> rolesList=query.getResultList();
		if(rolesList!=null && rolesList.size()>0){
			entityManager.remove(rolesList.get(0));
		}
	}

	@Override
	public List<Role> getRolesByIds(List<Long> roleIds) {
		if (roleIds==null||roleIds.size()==0) {
			return null;
		}
		List<Role> roles=new ArrayList<Role>();
		Query query=entityManager.createQuery("select role from Role as role where role.id in (:roleIds)");
		query.setParameter("roleIds", roleIds);
		roles=(List<Role>)query.getResultList();
		//加载要延迟加载的属性
		for (Role role : roles) {
			role.getPerms().size();
			role.getUsers().size();
		}
		return roles;
	}

	@Override
	public Role getById(Long id) {
		try {
			Role role=super.getById(id);
			role.getPerms().size();
			return role;
		} catch (NullPointerException e) {
			return null;
		}
	}

	@Override
	public List<Object> getRolesByAppName(String appName, int start, int limit) {
		String sql ="select role.id,role.roleName,role.roleDescription,(SELECT count(userId) from ca_user_role WHERE roleId=role.id),role.deletable" +
				" from ca_role role left join ca_user user on role.id = user.id where role.appName='"+appName+"' or role.appName" +
				"='nm,oss' group by role.id limit "+start+","+limit;
		Query query = entityManager.createNativeQuery(sql);
		return query.getResultList();
	}
}
