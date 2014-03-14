/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Apr 02, 2011
 * File Name       : UserHtmlEmailGenerator.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2009 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.platform.mail;

import java.util.ArrayList;
import java.util.List;

import com.tekview.apex.itsm.server.system.Version;
import com.tekview.apex.uums.model.User;
/**
 * 负责抓取新注册用户页面信息
 *
 */
public class UserHtmlEmailGenerator extends HtmlEmailGenerator {
	private User user;
	public UserHtmlEmailGenerator(Email email) {
		super(email);
		user = userDao.getById(Long.valueOf(this.email.getAction()));
		if(user == null) {//用户不存在或还没有保存到数据库
				throw new IllegalStateException("User: " + email.getCode() + " does not exist.");
		}
	}

	@Override
	protected String getHttpUrl() {
		return httpServerBasePath + "/user/user!notification.action?user.id=" + email.getAction() + "&vmRequest=true";
	}
	@Override
	protected List<String> getMailReceivers() {
		List<String> mailReceivers = new ArrayList<String>();
		if (user != null) {
			if(user.getMail()!=null && user.getMail().length()>0){
				mailReceivers.add(user.getMail());
			}
		}
		return mailReceivers;
	}

	@Override
	protected String getMailTitle() {
		StringBuilder buffer = new StringBuilder("["+ Version.getInstance().getSystemTitle() +"] 新创建用户：");
		buffer.append(user.getName());
		return buffer.toString();
	}

}
