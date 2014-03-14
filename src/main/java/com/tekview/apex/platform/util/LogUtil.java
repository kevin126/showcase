/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Feb 9,2011
 * File Name       : LogUtil.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.platform.util;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
/**
 * 日志工具类
 */
public class LogUtil {
	/** CA平台日志文件 */
	public static final String UUMS_LOG = "uums";
	
	public static Logger getLogger(String name) {
		return LogManager.getLogger(name);
	}
}
