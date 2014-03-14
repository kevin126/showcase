/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : Role.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.model;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * @author kevin
 * @version Revision: 1.00 Date: 11-1-18上午9:17
 * @Email liuyuhui007@gmail.com
 */
//@Entity
//@Table(name = "ca_role")
public class Role implements Serializable {
	private static final long serialVersionUID = -8735457807792766042L;

	/**
     * 数据库持久ID
     */
    private long id;

    /**
     * 角色名称
     */
    private String roleName;

    /**
     * 提供给工作流的非业务字段，在出厂时工作流同步负责和这个字段同步
     * <p/>
     * 现在无用
     */
    @Deprecated
    private String wfGroup;

    /**
     * 角色描述
     */
    private String roleDescription;

    /**
     * 是否可以删除,系统默认角色不允许被删除
     */
    private boolean deletable;

    /**
     * user与role之前双向多对多，因为需要知道角色下拥有的用户，级联设为NONE
     */
    private Set<User> users = new HashSet<User>(0);

    /**
     * role与permission之间单向多对多
     */
    private Set<Permission> perms = new HashSet<Permission>(0);

    /**
     * 应用名称
     */
    private String appName;

    public Role() {
	}

	@Id
    @GeneratedValue
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
    @Column(unique = true)
    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
    }

    public boolean isDeletable() {
        return deletable;
    }

    public void setDeletable(boolean deletable) {
        this.deletable = deletable;
    }

    @ManyToMany(targetEntity = User.class, cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinTable(name = "ca_user_role", joinColumns = {
            @JoinColumn(name = "roleId")
    }, inverseJoinColumns = {
            @JoinColumn(name = "userId")
    })
    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    @ManyToMany(targetEntity = Permission.class, cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinTable(name = "ca_role_permission", joinColumns = {
            @JoinColumn(name = "roleId")
    }, inverseJoinColumns = {
            @JoinColumn(name = "permissionId")
    })
    public Set<Permission> getPerms() {
//    	if(perms!=null){
//    		perms.size();
//    	}
        return perms;
    }

    public void setPerms(Set<Permission> perms) {
        this.perms = perms;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }
    @Transient
    @Deprecated
	public String getWfGroup() {
		return wfGroup;
	}
    @Deprecated
	public void setWfGroup(String wfGroup) {
		this.wfGroup = wfGroup;
	}
}