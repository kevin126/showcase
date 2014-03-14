/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : UserServiceImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.itsm.server.dwr;

import javax.servlet.http.HttpSession;

import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.extend.Calls;
import org.directwebremoting.extend.Replies;
import org.directwebremoting.impl.DefaultRemoter;
import org.directwebremoting.proxy.dwr.Util;


/**
 * dwr框架session过期的检查
 * 
 * @author kevin
 * @version 5.0
 * @since Apex Ocean V5
 */
public class SessionCheckRemoter extends DefaultRemoter {

	public Replies execute(Calls calls) {
		HttpSession session = WebContextFactory.get().getSession();
		String requestURI = WebContextFactory.get().getHttpServletRequest().getRequestURI();
//		Object attribute = session.getAttribute(OssworksStrutsConstants.SESSION_USER);
		// 注册自助式服务台用户时，用户根本没有的登陆，所以此时的dwr请求需要放行
//		if (attribute == null && requestURI.indexOf("querySubjectForSlide") == -1
//				&& requestURI.indexOf("queryAllCategoryList") == -1 && requestURI.indexOf("getTopUsersByScore") == -1
//				&& requestURI.indexOf("querySubjectProblem") == -1
//				&& requestURI.indexOf("getAllDepartmentNames") == -1 && requestURI.indexOf("NoticeService") == -1) {
//			logOut();
//			return super.execute(new Calls());
//		}
		return super.execute(calls);
	}

	private void logOut() {
		WebContext wct = WebContextFactory.get();
		Util utilThis = new Util(wct.getScriptSession());
		ScriptBuffer str = new ScriptBuffer("logOut()");
		utilThis.addScript(str);
	}
}
