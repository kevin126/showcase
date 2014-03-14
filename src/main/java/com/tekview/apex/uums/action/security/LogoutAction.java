/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 29, 2011
 * File Name       : LogoutAction.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.security;

import javax.servlet.http.HttpSession;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.tekview.apex.uums.constants.CAConstants;
import com.tekview.apex.uums.core.web.action.BaseAction;
import com.tekview.apex.uums.model.Administrator;
@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Namespace("/security") // 指定名称空间
@Results( { @Result(name = "success", location = "/index.jsp") })
/**
 * 登出系统
 */
public class LogoutAction extends BaseAction {
	private static final long serialVersionUID = -979145439237902328L;

	@Override
	public String execute() throws Exception {
		HttpSession session = request.getSession();
		if(session != null) {
			//删除Session中的用户信息
			Administrator admin = (Administrator) session.getAttribute(CAConstants.SESSION_USER);
			if(admin != null){
				//ss.logout(admin.getName()); TODO:这里暂不需要设置用户的在线状态
				session.removeAttribute(CAConstants.SESSION_USER);
			}
			session.invalidate();
		}
		return SUCCESS;
	}
}
