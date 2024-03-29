/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 27, 2011
 * File Name       : EmailService.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.platform.mail;

import com.tekview.apex.uums.model.EmailServerConfig;

/**
 * 邮件服务接口
 *
 */
public interface EmailService {
	/** 获取email服务器设置对象 */
	public EmailServerConfig getEmailServerConfig();

	/** 保存email服务器设置 */
	public boolean saveEmailServerConfig(EmailServerConfig config);

	/**
	 * 判断邮件服务器的配置是否是正确的配置
	 */
	public boolean isConfigRight(EmailServerConfig config);

	/**
	 * 测试配置的邮件服务器是否能够发送邮件
	 */
	public boolean testEmailServer(EmailServerConfig config);
}
