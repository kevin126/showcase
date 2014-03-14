/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : User.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.model;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

/**
 *用户模型，TODO:后面要加入工作流
 */

@Entity
@Table(name = "ca_user")
public class User implements Serializable {
	private static final long serialVersionUID = -3276082126362205161L;

	/**
     * 领域对象的代理主键.
     */
    private long id;

    /**
     * 登录时用的用户名，不是姓名
     */
    private String name;

    /**
     * 真实姓名
     */
    private String realName;

    /**
     * 密码（需加密）
     */
    private String password;

    /**
     * 用户状态（1 ：启用；２ ：禁用；其他预留）
     */
    private int enabled;

    /**
     * 是否可以删除,默认可以删除
     */
    private boolean deletable = true;

    /**
     * 是否在线 ,默认为不在线
     */
    private boolean online = false;

    /**
     * 最后一次登陆时间
     */
    private long lastLoginTime;
    
    /**
     * 仅用于页面显示
     */
    private String lastLoginTimeStr;

    /**
     * 用户工作组ID
     */
    @Deprecated
    private UserMaintenanceGroup workGroup;

    /**
     * 用户部门的名称（用户与部门这里通过这个唯一的部门名称来做关联）
     */
    @Deprecated
    private UserDept depet;

    /**
     * 用户与角色的双向多对多
     */
    @Deprecated
    private Set<Role> roles = new HashSet<Role>(0);

    private String taskNotifier;

    /**
     * 邮编
     */
    private String zipCode;

    /**
     * 国家
     */
    private String country;

    /**
     * 城市
     */
    private String city;

    /**
     * 具体住址
     */
    private String address;

    /**
     * 手机号码
     */
    private String mobile;

    /**
     * 办公电话
     */
    private String office;

    /**
     * 传真
     */
    private String fax;

    /**
     * 电子邮件
     */
    private String mail;

    /**
     * msn
     */
    private String msn;

    /**
     * 职位
     */
    private String title;

    /**
     * 工号
     */
    private String employeeNo;

    /**
     * 上网帐号
     */
    private String internetAccount;
    
    /**
     * QQ账号
     */
    private String qq;

    /**
     * 该用户是否是自助式服务台用户，true是自助式服务台用户，false则是运维人员
     */
    private boolean ssdUser;

    /**
     * 知识库用户积分
     */
    private Integer klScores;
    /**
     * 系统名称，多个系统用逗号分隔，保存个常量，比如存OSS或者NM，<br>
     */
    private String appName;
    
    /**
     * 最后一次登录IP
     */
    private String loginIP;
    
    /** 
     * 是否为全局用户 默认为全局用户
     */
	private boolean globalUser = true;
	/**
     * 创建时间
     */
    private long createTime;
    
    /**
     * 仅用于页面显示
     */
    private String createTimeStr;
    
    /**
	 * 全局只读
	 */
	private Boolean globalReadonly = false; 
	
    @Column(name="isGlobal")
	public boolean isGlobalUser() {
		return globalUser;
	}

	public void setGlobalUser(boolean globalUser) {
		this.globalUser = globalUser;
	}

	public User() {
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
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getEnabled() {
        return enabled;
    }

    public void setEnabled(int enabled) {
        this.enabled = enabled;
    }

    public boolean isDeletable() {
        return deletable;
    }

    public void setDeletable(boolean deletable) {
        this.deletable = deletable;
    }
    @Column(name="isOnline")
    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public long getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(long lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

//    @ManyToMany(targetEntity = Role.class, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    @JoinTable(name = "ca_user_role", joinColumns = {
//            @JoinColumn(name = "userId")
//    }, inverseJoinColumns = {
//            @JoinColumn(name = "roleId")
//    })
    @Deprecated
    @Transient
    public Set<Role> getRoles() {
        return roles;
    }
    @Deprecated
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getTaskNotifier() {
        return taskNotifier;
    }

    public void setTaskNotifier(String taskNotifier) {
        this.taskNotifier = taskNotifier;
    }
    @Column(name="zipcode")
    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getOffice() {
        return office;
    }

    public void setOffice(String office) {
        this.office = office;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getMsn() {
        return msn;
    }

    public void setMsn(String msn) {
        this.msn = msn;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEmployeeNo() {
        return employeeNo;
    }

    public void setEmployeeNo(String employeeNo) {
        this.employeeNo = employeeNo;
    }

    public String getInternetAccount() {
        return internetAccount;
    }

    public void setInternetAccount(String internetAccount) {
        this.internetAccount = internetAccount;
    }

    public boolean isSsdUser() {
        return ssdUser;
    }

    public void setSsdUser(boolean ssdUser) {
        this.ssdUser = ssdUser;
    }

    @Column(name = "kl_scores")
    public Integer getKlScores() {
        return klScores;
    }

    public void setKlScores(Integer klScores) {
        this.klScores = klScores;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

//    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
//    @JoinColumn(name = "departmentId")
    @Deprecated
    @Transient
    public UserDept getDepet() {
        return depet;
    }
    @Deprecated
    public void setDepet(UserDept depet) {
        this.depet = depet;
    }

//    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.REFRESH}, optional = true)
//    @JoinColumn(name = "workGroupId")
    @Deprecated
    @Transient
    public UserMaintenanceGroup getWorkGroup() {
        return workGroup;
    }
    @Deprecated
    public void setWorkGroup(UserMaintenanceGroup workGroup) {
        this.workGroup = workGroup;
    }

	public String getLoginIP() {
		return loginIP;
	}

	public void setLoginIP(String loginIP) {
		this.loginIP = loginIP;
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}
	
	@Transient
	public String getLastLoginTimeStr() {
		if (this.lastLoginTime == 0)
			return "";
		Date date = new Date(this.lastLoginTime);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return format.format(date);
	}

	public void setLastLoginTimeStr(String lastLoginTimeStr) {
		this.lastLoginTimeStr = lastLoginTimeStr;
	}

	public long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(long createTime) {
		this.createTime = createTime;
	}
	@Transient
	public String getCreateTimeStr() {
		if (this.createTime == 0)
			return "";
		Date date = new Date(this.createTime);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return format.format(date);
	}

	public void setCreateTimeStr(String createTimeStr) {
		this.createTimeStr = createTimeStr;
	}

	public Boolean isGlobalReadonly() {
		return globalReadonly;
	}

	public void setGlobalReadonly(Boolean globalReadonly) {
		this.globalReadonly = globalReadonly;
	}
	
}