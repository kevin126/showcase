/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : UserService.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service;

import java.util.List;

import com.tekview.apex.uums.action.user.UserQuery;
import com.tekview.apex.uums.base.BaseInterface;
import com.tekview.apex.uums.model.User;

public interface UserService extends BaseInterface<User> {
    /**
     * 修改密码
     * @param userId 用户标识
     * @param oldPasswd     旧密码
     * @param newPasswd     新密码
     * @param confirmPasswd 新密码确认
     * @return 密码修改是否成功
     */
    public boolean modifyPassword(Long userId,String oldPasswd, String newPasswd, String confirmPasswd) throws Exception;
        /**
     * 加载用户信息时加载角色
     *
     * @param id 用户标识
     * @return 用户信息
     */
    public User getUserWithRolesById(Long id);
    /**
     * 批量删除用户
     * 
     * 
     * @param ids  用户Id集合
     */
    public void deleteUsers(List<String> ids);
    
    /**
     *  重置用户密码
     * @param id		用户Id
     * @param newPassword		新密码
     * @param newPasswordAgain		确认新密码
     */
    public void resetPassword(String id, String newPassword,
			String newPasswordAgain);
    /**
     * 批量重置用户密码
     * @param ids		用户id集合
     */
    public void batchModifyPSW(List<String> ids);
    
    /**
     * 禁用用户
     * @param userId  用户id
     * @return
     */
    public boolean disableUser(String userId);
    
    /**
     * 批量禁用用户
     * @param stopUserId   用户Id集合
     */
    public void disableUsers(List<String> stopUserId);
    /**
     * 启用用户
     * @param userId  用户Id
     */
    public void enableUser(String userId);
    
    /**
     * 批量启用用户
     * @param startUserId		用户Id集合
     */
    public void enableUsers(List<String> startUserId);
    
    
    /**
     * 批量添加用户
     * @param user 
     */
    public void batchAddUser(User user);
    
    /**
	 * 获取用户信息
	 * @param userName 用户名
	 * @return 用户信息
	 */
    public User getByName(String userName);
    /**
	 * 获取用户信息
	 * @param mail 邮件地址
	 * @return 用户信息
	 */
	public User getByMail(String mail) ;
    
    /**
     *  根据条件分页查询
     * @param userQuery
     * @return
     */
    public List<User> getPagingUser(UserQuery userQuery);
    
    /**
     * 根据条件语句查询数量
     * @param userQuery
     * @return
     */
    public int countUser(UserQuery userQuery);
}