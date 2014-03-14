/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : CAStartupListener.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.itsm.server.system;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
/**
 * 
 *CA系统监听器
 */
public class CAStartupListener implements ServletContextListener {
	private static Logger logger = LogManager.getLogger("UUMS");
	public void contextDestroyed(ServletContextEvent sce) {
		logger.info("APEX-UUMS Server [" + Version.getInstance().getSvnTag() + ".GA (build: SVNTag="
				+ Version.getInstance().getSvnTag() + " date=" + Version.getInstance().getBuildDate() + ")] has stopped...");
	}

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(sce.getServletContext());
		ServerBeanFactory.setAppContext(ctx);
		ServerBeanFactory.setServletContext(sce.getServletContext());
		ServerBeanFactory.initModules();
	}
}
