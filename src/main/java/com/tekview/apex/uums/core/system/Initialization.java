/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Mar 22, 2011
 * File Name       : Initialization.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.core.system;

import java.io.File;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.orm.jpa.EntityManagerFactoryInfo;

import java.lang.management.ManagementFactory;

import com.sun.management.OperatingSystemMXBean;
import com.tekview.apex.itsm.server.system.ServerBeanFactory;
import com.tekview.apex.platform.util.LogUtil;

/**
 * 系统初始化类
 */
public final class Initialization {
	private static Logger logger = LogUtil.getLogger(LogUtil.UUMS_LOG);
	private static DBInfo dbInfo=null;

	/**
	 * 获取数据库连接信息
	 * @return 数据库连接信息
	 */
	public static synchronized DBInfo getDbInfoInstance(){
		if(dbInfo==null){
			dbInfo=new DBInfo();
			EntityManagerFactoryInfo entityMangerFactoryInfo=(EntityManagerFactoryInfo)ServerBeanFactory.getBean("entityManagerFactory");
			DataSource dataSource=entityMangerFactoryInfo.getDataSource();
			try {
				DatabaseMetaData metaData=dataSource.getConnection().getMetaData();
				dbInfo.setUserName(metaData.getUserName().split("@")[0]);
				dbInfo.setUrl(metaData.getURL());
				String extractString=metaData.getURL().split(":")[3];
				dbInfo.setPort(Integer.valueOf(extractString.split("/")[0]));
				String databaseProductName=metaData.getDatabaseProductName(); //获取数据库的名称 EX:mysql
				DBType dbType=DBType.MYSQL;
				if(databaseProductName.equalsIgnoreCase("mysql")){
					dbType = DBType.MYSQL;
				}else if(databaseProductName.equalsIgnoreCase("sqlserver")){
					dbType =DBType.SQLSERVER;
				}
				else if(databaseProductName.equalsIgnoreCase("Oracle")){
					dbType =DBType.ORACLE;
				}
				else if(databaseProductName.equalsIgnoreCase("db2")){
					dbType =DBType.DB2;
				}
				logger.info("当前系统使用的数据库是------"+dbType);
				//设置数据库类型
				dbInfo.setDbType(dbType);
				dbInfo.setCatalog(dataSource.getConnection().getCatalog()); //uums
			} catch (SQLException e) {
				logger.error("获取系统数据库信息失败！");
				e.printStackTrace();
			}
		}
		return dbInfo;
	}
	/**
	 * 获取操作系统类型
	 * @return 操作系统类型
	 */
	public static OperatingSystemType getOperatingSystemType(){
		OperatingSystemType operatingSystemType=OperatingSystemType.windows;
		OperatingSystemMXBean operatingSystemMXBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
		logger.info("当前操作系统--------------" + operatingSystemMXBean.getName());
		if (operatingSystemMXBean.getName().indexOf("Windows") != -1) {
			operatingSystemType = OperatingSystemType.windows;
		} else {
			operatingSystemType = OperatingSystemType.linux;
		}
		return operatingSystemType;
	}
	/**
	 * Windows系统上的MYSQL数据库初始化
	 * @return 系统数据库初始化成功返回true
	 */
	public synchronized static boolean windowsInitMysqlDB(){
		boolean result=false;
		// 得到系统运行的当前路径,
		File tempFile = new File("." + File.separator);
		String currentPath = tempFile.getAbsolutePath();
		String beforePathJboss = currentPath.substring(0, currentPath.indexOf("jboss"));
		File beforeDirectoryJboss = new File(beforePathJboss);
		String mysqlName = "";
		if (beforeDirectoryJboss.isDirectory()) {
			File[] fileList = beforeDirectoryJboss.listFiles();
			for (int i = 0; i < fileList.length; i++) {
				if (fileList[i].getName().startsWith("mysql")) {
					mysqlName = fileList[i].getName();
					break;
				} else {
					// 一直到最后都没有找到mysql目录则失败退出
					if (i == (fileList.length - 1) && !fileList[i].getName().startsWith("mysql")) {
						logger.info("当前目录下找不到mysql安装目录，失败退出");
					}
				}
			}
		}
		// 得到系统运行的当前路径,
		String currentDisk = tempFile.getAbsolutePath().substring(0, 2);
		String jbossBinDirectory = "jboss-4.2.2.GA\\bin\\.";
		currentPath = currentPath.substring(0, currentPath.length() - jbossBinDirectory.length());
		String startBatCmd = "cmd /c " + currentPath + mysqlName + "\\UUMSinit.bat";
		try{
			Process proc =Runtime.getRuntime().exec(startBatCmd+ " " + currentDisk + " " + currentPath + mysqlName); // 执行UUMSinit.bat文件进行数据库初始化
			StreamGobbler errorGobbler = new StreamGobbler(proc.getErrorStream(), "Error");
	        StreamGobbler outputGobbler = new StreamGobbler(proc.getInputStream(), "Output");
	        PrintWriter out = new PrintWriter(new OutputStreamWriter(proc.getOutputStream()));
	        errorGobbler.start();
	        outputGobbler.start();
			int exitVal = proc.waitFor();
			if(exitVal==0){
				result=true;
			}
		} catch (IOException ioe) {
			logger.info(ioe.getMessage());
			logger.info("Windows上的MySQL数据库初始化过成中，读取文件出错!");
		}catch (InterruptedException e) {
			logger.info(e.getMessage());
			logger.info("Windows上的MySQL数据库初始化过成中，读取文件出错!");
		}
		return result;
	}
}
