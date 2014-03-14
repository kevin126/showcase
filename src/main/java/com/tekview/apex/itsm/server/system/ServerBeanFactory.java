/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : ServerBeanFactory.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.itsm.server.system;

import javax.servlet.ServletContext;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;

import com.tekview.apex.platform.mail.EmailDispatcher;
import com.tekview.apex.platform.util.LogUtil;
import com.tekview.apex.uums.core.system.DBInfo;
import com.tekview.apex.uums.core.system.DBType;
import com.tekview.apex.uums.core.system.Initialization;
import com.tekview.apex.uums.core.system.OperatingSystemType;
import com.tekview.apex.uums.model.Administrator;
import com.tekview.apex.uums.service.AdministratorService;
/**
 * 保存Spring和Servlet上下文对象
 */
public final class ServerBeanFactory {
	private static Logger logger = LogUtil.getLogger(LogUtil.UUMS_LOG);

	private ServerBeanFactory() {
	}

	private static ApplicationContext ctx = null;

	private static ServletContext scx = null;
	
	private static DBInfo dbInfo=null;

	public static void setAppContext(ApplicationContext appCtx) {
		ctx = appCtx;
	}
	
	public static ApplicationContext getAppContext(){
		return ctx;
	}
	
	public static void setServletContext(ServletContext servletContext){
		scx = servletContext;
	}
		
	public static ServletContext getServletContext(){
		return scx;
	}
	public static Object getBean(String beanName) {
		return ctx.getBean(beanName);
	}
	
	public static DBInfo getDbInfo() {
		return dbInfo;
	}

	public static void setDbInfo(DBInfo dbInfo) {
		ServerBeanFactory.dbInfo = dbInfo;
	}

	/**
	 * 分别初始化各个模块，如果有单个模块初始化失败则不影响系统其它模块
	 */
	public static void initModules() {
		//initDb();
		activateEmailDispatcher();
	}
	
	private static void initDb(){
		try{
			logger.info("Start module: initDb");
			AdministratorService administratorService=(AdministratorService)getAppContext().getBean("administratorService");
			//获取ID为管理员的信息
			Administrator admin=administratorService.getById(1L);
			//如果管理员信息为空，需要执行初始化数据库脚本
			if(admin==null){
				DBInfo dbInfo=Initialization.getDbInfoInstance();
				OperatingSystemType operatingSystemType=Initialization.getOperatingSystemType();
				//当前操作系统是Windows
				if(OperatingSystemType.windows==operatingSystemType){
					//当前数据库是MYSQL
					if(dbInfo.getDbType()==DBType.MYSQL){
						boolean result=Initialization.windowsInitMysqlDB();
						if(!result){
							logger.error("Start module: initDb failed");
						}else{
							logger.info("Start module: initDb success!");
						}
					}
				}
				
			}
		}catch(Exception e){
			e.printStackTrace();
			logger.error("Start module: initDb failed");
		}
	}
	
	private static void activateEmailDispatcher() {
		try {
			EmailDispatcher dispatcher = (EmailDispatcher) getAppContext().getBean("mailDispather");
			dispatcher.start();
			logger.info("Start module: EmailDispatcher");
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Start module: EmailDispatcher failed");
		}
	}
}
