/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : LoginAction.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.security;


import java.io.IOException;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.interceptor.SessionAware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import sun.font.TrueTypeFont;
import sun.misc.BASE64Encoder;

import com.opensymphony.xwork2.ActionSupport;
import com.tekview.apex.itsm.server.system.Version;
import com.tekview.apex.uums.constants.CAConstants;
import com.tekview.apex.uums.model.Administrator;
import com.tekview.apex.uums.service.AdministratorService;


@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Namespace("/security")
// 指定名称空间
@Results( {
		@Result(name = "success", location = "/user/user!list.action",type="redirect"),
		@Result(name = "input", location = "/index.jsp")})
public class LoginAction  extends ActionSupport implements ServletRequestAware, ServletResponseAware,SessionAware{
	private static final long serialVersionUID = -4913160116943945884L;
	private static Logger logger = LogManager.getLogger("UUMS");
	protected HttpServletRequest request;
	protected HttpServletResponse response;
	@Autowired
	private AdministratorService administratorService;
	private Map<String,Object> session;
	private Administrator admin=new Administrator();
	private String writeStatus; //是否记住密码
	public String execute(){
		logger.info("enter LoginAction method login");
		//没有输入用户名和密码，返回登录页面
		if(admin==null){
			//当提示错误时，这个时候就不需要从cookie里读取以前的用户名和密码，而应该还是用这次的用户名和密码		
			request.setAttribute("needLoadCookie", false);
			addActionError(getText("login.error.admininfo"));
			return INPUT;
		}else{ //用户名或密码存在未填写情况
			if(admin.getName()==null || admin.getName().length()==0){
				addActionError(getText("login.error.adminname"));
				request.setAttribute("needLoadCookie", false);
				return INPUT;
			}
			if(admin.getPassword()==null || admin.getPassword().length()==0){
				addActionError(getText("login.error.adminpasswd"));
				request.setAttribute("needLoadCookie", false);
				return INPUT;
			}
		}
		//获取端口，并更新到version.properties
		int localPort = request.getLocalPort();
		String port = Version.getInstance().getProperty("server.port");
		if(!String.valueOf(localPort).equals(port)){
			Version.getInstance().setProperty("server.port", String.valueOf(localPort));
		}
		//获取Session
		HttpSession session = request.getSession(true);
		String encrptPassword = new BASE64Encoder().encode(admin.getPassword().getBytes());
		Administrator dbAdmin=null;
		dbAdmin=administratorService.getByName(admin.getName());
		if(dbAdmin==null){
			addActionError(getText("login.error.adminname.notexists"));
			request.setAttribute("needLoadCookie", false);
			return INPUT;
		}
		logger.info("当前登录用户:"+dbAdmin.getName());
		if(dbAdmin.getPassword() != null){//密码不为空才判断
			if (!dbAdmin.getPassword().equals(encrptPassword)/* 密码不对 */) {
				request.setAttribute("needLoadCookie", false);
				// 登陆名或密码错
				addActionError(getText("login.error.adminpsswd.incorrect"));
				return INPUT;
			}
		}
		if(dbAdmin.getEnabled()==2){
			request.setAttribute("needLoadCookie", false);
			addActionError(getText("login.error.admin.disabled"));
			return INPUT;
		}else{
			if (null != writeStatus) {
				// 存活期最大为一年
				Cookie userCookie = new Cookie("caUserName", admin.getName());
				userCookie.setMaxAge(60 * 60 * 24 * 30 * 365);
				userCookie.setPath("/");
				response.addCookie(userCookie);
				//解密密码
				Cookie passwordCookie = new Cookie("caPassword", encrptPassword);
				passwordCookie.setPath("/");
				passwordCookie.setMaxAge(60 * 60 * 24 * 30 * 365);
				response.addCookie(passwordCookie);
			}else{
				// 销毁可能存在的cookie
				Cookie[] cookies = request.getCookies();
				if (null != cookies) {
					for (int i = 0; i < cookies.length; i++) {
						if (cookies[i].getName().equals("caUserName") || cookies[i].getName().equals("caPassword")) {
							cookies[i].setMaxAge(0);
							response.addCookie(cookies[i]);
						}
					}
				}
			}
			session.setAttribute(CAConstants.SESSION_USER, dbAdmin);
			session.setAttribute(CAConstants.SESSION_USERNAME, dbAdmin.getName());
			session.setAttribute(CAConstants.SESSION_USE_ID, dbAdmin.getId());
			//更新管理员信息
			dbAdmin.setOnline(true);
			dbAdmin.setLastLoginTime(new Date());
			administratorService.update(dbAdmin);
		}
		logger.info("exit LoginAction method login");
		if (session.getAttribute(CAConstants.SESSION_URL)==null) {
			//第一次登录
			return SUCCESS;
		}else {
			try {
				//跳转向登录前的页面，并将储存地址的session清除
				if (session.getAttribute(CAConstants.SESSION_URL)!=null) {
					response.sendRedirect(session.getAttribute(CAConstants.SESSION_URL).toString());
					session.removeAttribute(CAConstants.SESSION_URL);
				}
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			return null;
		}
		
	}
	public HttpServletRequest getRequest() {
		return request;
	}
	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}
	public HttpServletResponse getResponse() {
		return response;
	}
	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}
	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request=request;
	}
	@Override
	public void setServletResponse(HttpServletResponse response) {
		this.response=response;
	}
	@Override
	public void setSession(Map<String, Object> session) {
		this.session=session;
	}
	public Map<String, Object> getSession() {
		return session;
	}
	public Administrator getAdmin() {
		return admin;
	}
	public void setAdmin(Administrator admin) {
		this.admin = admin;
	}
	public String getWriteStatus() {
		return writeStatus;
	}
	public void setWriteStatus(String writeStatus) {
		this.writeStatus = writeStatus;
	}
	
}