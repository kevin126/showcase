/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Feb 9, 2011
 * File Name       : EmailServerConfig.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * 邮件服务器配置类
 */
@Entity
@Table(name="ca_email_config")
public class EmailServerConfig implements Serializable {
	private static final long serialVersionUID = -6819777590709064194L;
	/**
	 * 领域对象的代理主键.
	 */
	private long id;
	/**
	 * 发送邮件地址
	 */
	private String fromAddress = "@";
	/**
	 * SMTP服务器地址
	 */
	private String smtpAddress;
	/**
	 * SMTP服务器端口
	 */
	private int port = 25;
	/**
	 * 发送邮件的用户名
	 */
	private String userName;
	/**
	 * 发送邮件的用户名对应密码
	 */
	private String passWord;
	/**
	 * 发送主题前缀
	 */
	private String subjectPrefix;
	
	public EmailServerConfig() {
	}
	@Id
	@GeneratedValue
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getFromAddress() {
		return fromAddress;
	}
	public void setFromAddress(String fromAddress) {
		this.fromAddress = fromAddress;
	}
	public String getSmtpAddress() {
		return smtpAddress;
	}
	public void setSmtpAddress(String smtpAddress) {
		this.smtpAddress = smtpAddress;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassWord() {
		return passWord;
	}
	public void setPassWord(String passWord) {
		this.passWord = passWord;
	}
	public String getSubjectPrefix() {
		return subjectPrefix;
	}
	public void setSubjectPrefix(String subjectPrefix) {
		this.subjectPrefix = subjectPrefix;
	}

}
