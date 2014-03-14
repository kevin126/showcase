/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Feb 10, 2011
 * File Name       : MailSettingAction.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.email;

import org.apache.struts2.convention.annotation.InterceptorRef;
import org.apache.struts2.convention.annotation.InterceptorRefs;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.tekview.apex.itsm.server.security.Base64;
import com.tekview.apex.platform.mail.EmailService;
import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.core.web.action.BaseAction;
import com.tekview.apex.uums.model.EmailServerConfig;

/**
 * 邮件设置Action
 */
@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Namespace("/setting") // 指定名称空间
@Results( {
		@Result(name = "success", location = "/WEB-INF/jsps/mail/mail-setting.jsp")})
public class MailSettingAction extends BaseAction {
	private static final long serialVersionUID = 1L;
	@Autowired
	private EmailService emailService;
	private EmailServerConfig email=new EmailServerConfig();
	private int msgShow=0;
	@Override
	public String execute() {
		email = emailService.getEmailServerConfig();
		if(email!=null){
			email.setPassWord(new String(Base64.decode(email.getPassWord().toCharArray())));
		}
		return SUCCESS;
	}
	public String save(){
		if(email.getPassWord()==null)
			throw new OceanRuntimeException("请输入必须参数！");
		email.setPassWord(new String(Base64.encode(email.getPassWord().getBytes())));
		emailService.saveEmailServerConfig(email);
		msgShow=1;
		return execute();
	}
	public EmailServerConfig getEmail() {
		return email;
	}
	public void setEmail(EmailServerConfig email) {
		this.email = email;
	}
	public int getMsgShow() {
		return msgShow;
	}
	public void setMsgShow(int msgShow) {
		this.msgShow = msgShow;
	}

}
