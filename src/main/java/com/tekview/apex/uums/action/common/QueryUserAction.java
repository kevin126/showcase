/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Feb 16, 2011
 * File Name       : QueryUserAction.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.common;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.criterion.Restrictions;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.core.web.action.BaseAction;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserMaintenanceGroup;
import com.tekview.apex.uums.service.UserService;
import com.tekview.apex.uums.service.WorkGroupService;
/**
 * 根据输入条件查询用户
 */
@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Namespace("/common")// 指定名称空间
@Results( {
		@Result(name = "success", location = "/WEB-INF/jsps/common/user-query.jsp")
	})
public class QueryUserAction extends BaseAction {
	private static final long serialVersionUID = 6843281931728575188L;
	private String enter;
	private String status; //状态
	private String exclude; //排除
	private String selectOne; //单选还是多选
	private PageList<User> userList;

	// 以下为查询条件
	private String name; // 用户名
	private String realName; // 姓名
	private String employeeNo; //工号
	private String internetAccount; //上网帐号
	private String workGroupName;// 工作组标识
	private String office; // 电话号码
	
	@Autowired
	private UserService userService;
	@Autowired
	private WorkGroupService workGroupService;
	
	@Override
	public String execute() throws Exception {
		long startTime = System.currentTimeMillis();
		if ((StringUtils.isNotEmpty(status) && status.equals("submit"))) {
			Criteria criteria = new Criteria();
			if (StringUtils.isNotEmpty(name)) {
				criteria.add(Restrictions.like("name", name));
			}
			if (StringUtils.isNotEmpty(realName)) {
				criteria.add(Restrictions.like("realName", realName));
			}
			if (StringUtils.isNotEmpty(employeeNo)) {
				criteria.add(Restrictions.like("employeeNo", employeeNo));
			}
			if (StringUtils.isNotEmpty(internetAccount)) {
				criteria.add(Restrictions.like("internetAccount", internetAccount));
			}
			if (StringUtils.isNotEmpty(office)) {
				criteria.add(Restrictions.like("office", office));
			}
			if (workGroupName != null && workGroupName.length() > 0) {
				UserMaintenanceGroup workGroup = workGroupService
						.getByName(workGroupName);
				if (workGroup != null) {
					criteria.add(Restrictions.eq("workGroup.id", workGroup.getId()));
				}
			}
			criteria.setOffset(getOffset());
			criteria.setLength(getPageSize());
			userList = userService.queryByPage(criteria);
			records =Long.valueOf(userList.getTotalCount()).intValue();
		}
		System.out.println(System.currentTimeMillis()-startTime);
		return SUCCESS;
	}
	public String getEnter() {
		return enter;
	}
	public void setEnter(String enter) {
		this.enter = enter;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getExclude() {
		return exclude;
	}
	public void setExclude(String exclude) {
		this.exclude = exclude;
	}
	public PageList<User> getUserList() {
		return userList;
	}
	public void setUserList(PageList<User> userList) {
		this.userList = userList;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRealName() {
		return realName;
	}
	public void setRealName(String realName) {
		this.realName = realName;
	}
	public String getEmployeeNo() {
		return employeeNo;
	}
	public void setEmployeeNo(String employeeNo) {
		this.employeeNo = employeeNo;
	}
	public String getInternetAccount() {
		return internetAccount;
	}
	public void setInternetAccount(String internetAccount) {
		this.internetAccount = internetAccount;
	}
	public String getWorkGroupName() {
		return workGroupName;
	}
	public void setWorkGroupName(String workGroupName) {
		this.workGroupName = workGroupName;
	}
	public String getOffice() {
		return office;
	}
	public void setOffice(String office) {
		this.office = office;
	}
	public String getSelectOne() {
		return selectOne;
	}
	public void setSelectOne(String selectOne) {
		this.selectOne = selectOne;
	}

}
