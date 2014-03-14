/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : UserServiceImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tekview.apex.itsm.common.util.SysUtil;
import com.tekview.apex.uums.action.user.UserQuery;
import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.dao.UserDao;
import com.tekview.apex.uums.dao.UserDeptDao;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.service.UserService;

@Service("userService")
@Transactional
public class UserServiceImpl implements UserService {
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private UserDeptDao userDeptDao;

	/**
	 * 保存用户信息
	 * 
	 * @param entity
	 *            用户信息
	 */
	public void save(User entity) {
		if(entity==null)
			throw new OceanRuntimeException("param.is.empty");
		if (entity.getName()==null||entity.getRealName()==null) {
			throw new OceanRuntimeException("param.is.empty");
		}
		if (entity.getName().trim().equals("")||entity.getRealName().trim().equals("")) {
			throw new OceanRuntimeException("param.is.empty");
		}
		userDao.save(entity);
	}

	/**
	 * 更新用户信息
	 * 
	 * @param entity
	 *            用户信息
	 */
	public void update(User entity) {
		userDao.update(entity);
	}

	/**
	 * 删除用户
	 * 
	 * @param id
	 *            用户标识
	 */
	public void delete(Long id) {
		userDao.delete(id);
	}

	/**
	 * 批量删除用户
	 * 
	 * 
	 * @param ids
	 *            用户id集合
	 */
	public void deleteUsers(List<String> ids) {
		if (ids != null && ids.size() > 0) {
				for (String string : ids) {
					if (string == null && "".equals(string.trim()))		//id为空，提示操作失败
						throw new OceanRuntimeException("param.is.empty");
					User user = userDao.getById(Long.valueOf(string.trim()));
					if (!user.isDeletable()) 			//不能被删除的用户，用户因所拥有的角色等因素不能被删除
						throw new OceanRuntimeException("can.not.be.deleted");
					//使用中的资产审批负责人账号 不能删除
//					List<UserDept> userDeptList=userDeptDao.getEntitiesByOneProperty("assUser.id", Long.valueOf(string.trim()));
//					if (userDeptList!=null&&userDeptList.size()>0) {
//						throw new OceanRuntimeException("can.not.be.delete.because.it.is.assUser");
//					}
					delete(Long.valueOf(string.trim()));
				}
		} else {
			throw new OceanRuntimeException("has.no.Users");
		}
	}

	/**
	 * 获取用户信息
	 * 
	 * @param id
	 *            用户标识
	 * @return 用户信息
	 */
	public User getById(Long id) {
		return (User) userDao.getById(id);
	}

	/**
	 * 加载用户信息时加载角色
	 * 
	 * @param id
	 *            用户标识
	 * @return 用户信息
	 */
	public User getUserWithRolesById(Long id) {
		User user = (User) userDao.getUserWithRolesById(id);
		return user;
	}

	/**
	 * 分页查询用户列表
	 * 
	 * @param criteria
	 *            用户查询条件
	 * @return 用户列表
	 */
	public PageList<User> queryByPage(Criteria criteria) {
		return userDao.queryByPage(criteria);
	}

	/**
	 * 修改用户密码
	 * 
	 * @param userId
	 *            用户标识
	 * @param oldPasswd
	 *            旧密码
	 * @param newPasswd
	 *            新密码
	 * @param confirmPasswd
	 *            新密码确认
	 * @return 修改成功或失败
	 * @throws Exception
	 *             异常
	 */
	public boolean modifyPassword(Long userId, String oldPasswd,
			String newPasswd, String confirmPasswd) throws Exception {
		User user = (User) userDao.getById(userId);
		if (user == null) {
			throw new OceanRuntimeException("exception.user.notexists");
		}
		// TODO:是否需要Base64密码解密比较
		if (!SysUtil.decodeBase64(user.getPassword()).equals(oldPasswd)) {
			throw new OceanRuntimeException("exception.user.oldpasswdnotmatch");
		}
		if (!confirmPasswd.trim().equals(newPasswd.trim())) {
			throw new OceanRuntimeException("exception.passwd.notmatch");
		}
		String newpwd = SysUtil.encodeBase64(newPasswd);
		user.setPassword(newpwd);
		userDao.update(user);
		// TODO:接口调用返回情况待考虑
		return true;
	}
	
	/**
	 *  重置用户密码
	 * @param id	用户Id
	 * @param newPassword		新密码
	 * @param newPasswordAgain		确认新密码
	 */
	synchronized public void resetPassword(String id, String newPassword,
			String newPasswordAgain) {
		// 设置默认密码 
		//TODO:需调用系统预先设置好的，尚未定义，此处先设置为八个一
		if (newPassword == null || "".equals(newPassword)) {
			newPassword = "11111111";
			newPasswordAgain = "11111111";
		}
		// 1、检验两次新密码是否相等
		if (!newPassword.equals(newPasswordAgain))
			throw new OceanRuntimeException("enterthenewpasswordtwiceinconsistent");
		// 2、检验用户是否存在
		User user = userDao.getById(Long.valueOf(id.trim()));
		if (user == null)
			throw new OceanRuntimeException("has.no.Users");
		// 3、新密码转码后存入数据库
		String newpwd = SysUtil.encodeBase64(newPassword);
		user.setPassword(newpwd);
		userDao.update(user);
		// 4、成功后系统自动注销当前登录的用户强制用户重新登录（待添加）
	}
	
	/**
	 * 批量重置密码
	 * @param ids  用户id集合
	 */
	@Override
	public void batchModifyPSW(List<String> ids) {
		if (ids == null || ids.size() == 0)
			throw new OceanRuntimeException("has.no.Users");
		for (String string : ids) {
			resetPassword(string.trim(), null, null);
		}
		
	}
	
	/**
	 * 禁用用户
	 * @param userId  用户Id
	 */
	@Override
	synchronized public boolean disableUser(String userId) {
		User user = userDao.getById(Long.valueOf(userId.trim()));
		// 1、用户是否存在
		if (user == null)
			throw new OceanRuntimeException(
					"has.no.Users");
		//2、管理员不能被禁用
		if (user.getName().equals("admin")) {
			throw new OceanRuntimeException("user.is.admin");
		}
		//3、用户是否为禁用状态
		if (user.getEnabled() == 2) {		// 将要禁用的用户已为禁用状态
			throw new OceanRuntimeException(
					"SelectTheUserContainsTheUserHasBeenBannedPleaseReselect");
		}
		// 4、禁用
		user.setEnabled(2);
		userDao.update(user);
		return true;
	}
	
	/**
	 * 批量禁用用户
	 * @param stopUserId	用户Id集合
	 */
	@Override
	public void disableUsers(List<String> stopUserId) {
		for (int i = 0; i < stopUserId.size(); i++) {
			disableUser(stopUserId.get(i));
		}
	}
	
	/**
	 *  启用用户
	 *  @param userId 用户Id
	 */
	@Override 
	synchronized public void enableUser(String userId) {
		User user = userDao.getById(Long.valueOf(userId.trim()));
		// 1、用户是否存在
		if (user == null)
			throw new OceanRuntimeException(
					"has.no.Users");
		//2、用户是否为禁用状态
		if (user.getEnabled() == 1) {
			throw new OceanRuntimeException(
					"SelectTheUserContainsTheUserHasBeenEnabledPleaseReselect");
		}
		// 3、启用
		user.setEnabled(1);
		userDao.update(user);
	}
	
	/**
	 * 批量启用用户
	 * @param startUserId   用户id集合
	 */
	@Override
	public void enableUsers(List<String> startUserId) {
		for (int i = 0; i < startUserId.size(); i++) {
			enableUser(startUserId.get(i));
		}
	}

	@Override
	public void batchAddUser(User user) {
		userDao.save(user);
	}

	@Override
	public User getByName(String userName) {
		return userDao.getByName(userName);
	}
	 /**
	 * 获取用户信息
	 * @param mail 邮件地址
	 * @return 用户信息
	 */
	@Override
	public User getByMail(String mail) {
		return userDao.getByMail(mail);
	}

	/* (non-Javadoc)
	 * @see com.tekview.apex.uums.service.UserService#getPagingUserByHql(java.lang.String, int, int)
	 */
	@Override
	public List<User> getPagingUser(UserQuery userQuery) {
		return userDao.getPagingUser(userQuery);
	}

	@Override
	public int countUser(UserQuery userQuery) {
		return userDao.countUserByHql(userQuery);
	}
}