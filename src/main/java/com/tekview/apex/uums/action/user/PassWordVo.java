/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Feb 15, 2011
 * File Name       : PassWordVo.java
 *
 * APEX OSSWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2009 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.user;

import java.io.Serializable;


/**
 * 封装修改密码的页面数据
 *
 * @author Xiaojiapeng
 * @version 1.0
 * @since APEX OSSWorks 5.5
 */
public class PassWordVo implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 57878762025443317L;

	/**
	 *  用户Id
	 */
	private Long userId;
	
	/**
	 * 旧密码
	 */
	private String oldPassWord;
	
	/**
	 * 新密码
	 */
	private String newPassWord;
	
	/**
	 * 新密码确认
	 */
	private String newPassWordConfirm;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getOldPassWord() {
		return oldPassWord;
	}

	public void setOldPassWord(String oldPassWord) {
		this.oldPassWord = oldPassWord;
	}

	public String getNewPassWord() {
		return newPassWord;
	}

	public void setNewPassWord(String newPassWord) {
		this.newPassWord = newPassWord;
	}

	public String getNewPassWordConfirm() {
		return newPassWordConfirm;
	}

	public void setNewPassWordConfirm(String newPassWordConfirm) {
		this.newPassWordConfirm = newPassWordConfirm;
	}
	
}
