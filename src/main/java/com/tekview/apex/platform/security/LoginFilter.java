/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : LoginFilter.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.platform.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;

import com.tekview.apex.itsm.server.system.ServerBeanFactory;
import com.tekview.apex.uums.constants.CAConstants;
import com.tekview.apex.uums.model.Administrator;
import com.tekview.apex.uums.service.AdministratorService;

/**
 * 用户登录验让
 */
public class LoginFilter implements Filter {
	/**
	 * 所有不需要进行权限判断的请求url片段
	 */
	private List<String> ingoreUrls = new ArrayList<String>();
	public void destroy() {
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;
		StringBuffer buffer = httpRequest.getRequestURL();// 得到请求url
		String queryString = httpRequest.getQueryString();// 得到请求参数字符串
		//TODO: SSO测试
		if(httpRequest.getUserPrincipal()!=null){
			System.out.println("userName:"+httpRequest.getUserPrincipal().getName());
		}
		//TODO:加载用户权限等信息
		//用户请求的完整地址
		String wonderUrl = URLEncoder.encode(httpRequest.getRequestURI() + "?" +httpRequest.getQueryString(), "UTF-8");
		if (StringUtils.isNotEmpty(queryString)) {
			buffer.append("?");
			buffer.append(queryString);
		}
		String fullUrl = buffer.toString();// 构造完整的url地址，该地址是客户端浏览器请求web服务器时的完整地址
		boolean checkPermission = true;// 是否需要检查用户是否登录，有些请求是不需要检查的，比如请求图片，请求CSS，请求JS或者是JVM内部发起的获取页面的请求
		for (String ingoreUrl : ingoreUrls) {
			if (fullUrl.indexOf(ingoreUrl) != -1) {// 客户端请求的URL字符串中包括不需要检查是否登录的字符串片段，则不需要检查权限
				checkPermission = false;
				break;
			}
		}
		if (!checkPermission) {// 不需要检查是否登录，直接放行
			chain.doFilter(request, response);
		} else {// 需要检查权限，判断用户是否已经登录
			Administrator loginAdmin = (Administrator) httpRequest.getSession().getAttribute(CAConstants.SESSION_USER);
			if(loginAdmin == null){
				//如果被拦截，那么先记录上次想请求的地址，以便下次登录后直接跳转过去。
				httpRequest.getSession().setAttribute(CAConstants.SESSION_URL, fullUrl);
				//session失效
				httpResponse.sendRedirect(httpRequest.getContextPath() + "/index.jsp?wonderUrl=" + wonderUrl);
				return;
			}else{
				AdministratorService administratorService=(AdministratorService)ServerBeanFactory.getBean("administratorService");
				//到库中验证一下管理员是否存在
				Administrator admin=administratorService.getById(loginAdmin.getId());
				if(admin==null){ //系统中已经不存在该管理员了
					httpResponse.sendRedirect(httpRequest.getContextPath() + "/index.jsp?wonderUrl=" + wonderUrl);
					return;
				}
				else{
					HttpSession session = httpRequest.getSession();
					if (session == null || session.getAttribute(CAConstants.SESSION_USER) == null) {// 用户没有登录，比如直接敲的URL地址进来的
						httpResponse.sendRedirect(httpRequest.getContextPath() + "/index.jsp?wonderUrl=" + wonderUrl);
					} 
					
					chain.doFilter(httpRequest, response);
				}
			}
		}
	}

	public void init(FilterConfig filterConfig) throws ServletException {
		String ignoreStr = filterConfig.getInitParameter("ignoreUrl");
		if (StringUtils.isNotEmpty(ignoreStr)) {
			String igs[] = ignoreStr.split(",");
			for (String ig : igs) {
				ingoreUrls.add(ig.trim());
			}
		}
	}

}
