/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Mar 21, 2011
 * File Name       : DBInfo.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.core.system;


/**
 * 数据库连接信息
 */
public class DBInfo {
	private DBType dbType; //数据库类型
	private String userName; //登录用户名
	private String url; //连接字符串 EX:jdbc:mysql://127.0.0.1:12581/uums
	private String catalog; //EX:uums
	private int port; //端口
	
	public DBType getDbType() {
		return dbType;
	}
	public void setDbType(DBType dbType) {
		this.dbType = dbType;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getCatalog() {
		return catalog;
	}
	public void setCatalog(String catalog) {
		this.catalog = catalog;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
}
